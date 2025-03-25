"use client"

import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Link from "@tiptap/extension-link"
import Image from "@tiptap/extension-image"
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight"
import TextAlign from "@tiptap/extension-text-align"
import Color from "@tiptap/extension-color"
import TextStyle from "@tiptap/extension-text-style"
import { Mark, mergeAttributes } from '@tiptap/core'
import { common, createLowlight } from "lowlight"
import {
  Bold,
  Italic,
  Strikethrough,
  List,
  ListOrdered,
  Quote,
  Code,
  Link as LinkIcon,
  Image as ImageIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Undo,
  Redo,
  Type
} from "lucide-react"
import { cn } from "@/lib/utils"
import React, { useState } from 'react';

const lowlight = createLowlight(common)

const FontSize = Mark.create({
  name: 'fontSize',
  addAttributes() {
    return {
      size: {
        default: '16px',
        parseHTML: element => element.style.fontSize,
        renderHTML: attributes => {
          if (!attributes.size) {
            return {}
          }
          return {
            style: `font-size: ${attributes.size}`
          }
        }
      }
    }
  },
  parseHTML() {
    return [
      {
        style: 'font-size',
        getAttrs: value => {
          return {
            size: value
          }
        }
      }
    ]
  },
  renderHTML({ HTMLAttributes }) {
    return ['span', mergeAttributes(HTMLAttributes), 0]
  }
})

interface ToolbarButtonProps {
  onClick: () => void
  icon: React.ReactNode
  label: string
  isActive?: boolean
  disabled?: boolean
}

const ToolbarButton = ({ onClick, icon, label, isActive, disabled }: ToolbarButtonProps) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "p-1.5 rounded hover:bg-gray-100 transition-colors text-gray-900",
        isActive && "bg-gray-100 text-blue-600",
        disabled && "opacity-50 cursor-not-allowed"
      )}
      title={label}
      type="button"
    >
      {icon}
    </button>
  )
}

interface TiptapEditorProps {
  content: string
  onChange: (html: string) => void
}

const FONT_SIZES = {
  'Small': '12px',
  'Normal': '16px',
  'Large': '20px',
  'Extra Large': '24px',
  'Huge': '32px'
}

const TiptapEditor = ({ content, onChange }: TiptapEditorProps) => {
  const [currentSize, setCurrentSize] = useState('Normal');
  const imageInputRef = React.useRef<HTMLInputElement>(null);

  const addImage = () => {
    imageInputRef.current?.click();
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      const file = e.target.files[0];
      const reader = new FileReader();
      
      reader.onload = (event) => {
        if (event.target?.result && editor) {
          editor.chain().focus().setImage({ src: event.target.result as string }).run();
        }
      };
      
      reader.readAsDataURL(file);
    }
  };

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: {
          keepMarks: true,
          keepAttributes: false,
        },
        orderedList: {
          keepMarks: true,
          keepAttributes: false,
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-blue-600 hover:underline cursor-pointer',
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: 'max-w-full rounded-lg my-4',
        },
      }),
      CodeBlockLowlight.configure({
        lowlight,
      }),
      TextAlign.configure({
        types: ['paragraph'],
        defaultAlignment: 'left',
      }),
      Color.configure({ types: ['textStyle'] }),
      TextStyle,
      FontSize,
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
    editorProps: {
      attributes: {
        class: 'prose prose-slate max-w-none focus:outline-none min-h-[300px] p-4 text-gray-900'
      }
    }
  })

  if (!editor) {
    return null
  }

  const setFontSize = (sizeName: string) => {
    const size = FONT_SIZES[sizeName as keyof typeof FONT_SIZES];
    editor.chain().focus().unsetMark('fontSize').setMark('fontSize', { size }).run();
    setCurrentSize(sizeName);
  };

  const setLink = () => {
    const url = window.prompt("Enter URL")
    if (url) {
      editor.chain().focus().setLink({ href: url }).run()
    }
  }

  return (
    <div className="border rounded-lg bg-white">
      <input
        type="file"
        ref={imageInputRef}
        onChange={handleImageUpload}
        accept="image/*"
        className="hidden"
      />

      {/* Editor Toolbar */}
      <div className="border-b p-2 flex flex-wrap gap-1 bg-gray-50">
        {/* Font Size Selector */}
        <div className="flex items-center gap-1 pr-2 border-r">
          <div className="flex items-center gap-2">
            <Type className="w-4 h-4 text-gray-600" />
            <select
              onChange={(e) => setFontSize(e.target.value)}
              value={currentSize}
              className="border border-gray-300 rounded-md px-2 py-1 text-sm bg-white text-gray-900"
            >
              {Object.keys(FONT_SIZES).map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex items-center gap-1 px-2 border-r">
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBold().run()}
            isActive={editor.isActive("bold")}
            icon={<Bold size={18} />}
            label="Bold"
          />
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleItalic().run()}
            isActive={editor.isActive("italic")}
            icon={<Italic size={18} />}
            label="Italic"
          />
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleStrike().run()}
            isActive={editor.isActive("strike")}
            icon={<Strikethrough size={18} />}
            label="Strike"
          />
        </div>

        <div className="flex items-center gap-1 px-2 border-r">
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            isActive={editor.isActive('bulletList')}
            icon={<List size={18} />}
            label="Bullet List"
          />
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            isActive={editor.isActive('orderedList')}
            icon={<ListOrdered size={18} />}
            label="Ordered List"
          />
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            isActive={editor.isActive("blockquote")}
            icon={<Quote size={18} />}
            label="Quote"
          />
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
            isActive={editor.isActive("codeBlock")}
            icon={<Code size={18} />}
            label="Code Block"
          />
        </div>

        <div className="flex items-center gap-1 px-2 border-r">
          <input
            type="color"
            onInput={(e: React.FormEvent<HTMLInputElement>) => 
              editor.chain().focus().setColor((e.target as HTMLInputElement).value).run()
            }
            value={editor.getAttributes('textStyle').color || '#000000'}
            className="h-8 w-8 cursor-pointer border-0 bg-transparent p-1"
            title="Text Color"
          />
        </div>

        <div className="flex items-center gap-1 px-2 border-r">
          <ToolbarButton
            onClick={setLink}
            isActive={editor.isActive("link")}
            icon={<LinkIcon size={18} />}
            label="Add Link"
          />
          <ToolbarButton
            onClick={addImage}
            icon={<ImageIcon size={18} />}
            label="Add Image"
          />
        </div>

        <div className="flex items-center gap-1 px-2 border-r">
          <ToolbarButton
            onClick={() => editor.commands.setTextAlign('left')}
            isActive={editor.isActive({ textAlign: 'left' })}
            icon={<AlignLeft size={18} />}
            label="Align Left"
          />
          <ToolbarButton
            onClick={() => editor.commands.setTextAlign('center')}
            isActive={editor.isActive({ textAlign: 'center' })}
            icon={<AlignCenter size={18} />}
            label="Align Center"
          />
          <ToolbarButton
            onClick={() => editor.commands.setTextAlign('right')}
            isActive={editor.isActive({ textAlign: 'right' })}
            icon={<AlignRight size={18} />}
            label="Align Right"
          />
        </div>

        <div className="flex items-center gap-1">
          <ToolbarButton
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().undo()}
            icon={<Undo size={18} />}
            label="Undo"
          />
          <ToolbarButton
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().redo()}
            icon={<Redo size={18} />}
            label="Redo"
          />
        </div>
      </div>

      {/* Editor Content */}
      <EditorContent 
        editor={editor} 
        className="prose prose-slate max-w-none focus:outline-none min-h-[300px] p-4 text-gray-900" 
      />
    </div>
  )
}

export default TiptapEditor
