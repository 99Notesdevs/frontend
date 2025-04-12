"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import TextAlign from "@tiptap/extension-text-align";
import Color from "@tiptap/extension-color";
import TextStyle from "@tiptap/extension-text-style";
import { Mark, mergeAttributes } from "@tiptap/core";
import { common, createLowlight } from "lowlight";
import Heading from "@tiptap/extension-heading";
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
} from "lucide-react";
import { cn } from "@/lib/utils";
import React, { useState, useEffect } from "react";

const lowlight = createLowlight(common);

const FontSize = Mark.create({
  name: "fontSize",
  addAttributes() {
    return {
      size: {
        default: "16px",
        parseHTML: (element) => element.style.fontSize,
        renderHTML: (attributes) => {
          if (!attributes.size) {
            return {};
          }
          return {
            style: `font-size: ${attributes.size}`,
          };
        },
      },
    };
  },
  parseHTML() {
    return [
      {
        style: "font-size",
        getAttrs: (value) => {
          return {
            size: value,
          };
        },
      },
    ];
  },
  renderHTML({ HTMLAttributes }) {
    return ["span", mergeAttributes(HTMLAttributes), 0];
  },
});

interface ToolbarButtonProps {
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  isActive?: boolean;
  disabled?: boolean;
}

const ToolbarButton = ({
  onClick,
  icon,
  label,
  isActive,
  disabled,
}: ToolbarButtonProps) => {
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
  );
};

interface TiptapEditorProps {
  content?: string;
  onChange: (html: string) => void;
}

const FONT_SIZES = {
  Small: "12px",
  Normal: "16px",
  Large: "20px",
  "Extra Large": "24px",
  Huge: "32px",
};

const TiptapEditor = ({ content, onChange }: TiptapEditorProps) => {
  const [isHtmlMode, setIsHtmlMode] = useState(false);
  const [htmlContent, setHtmlContent] = useState("");
  const [currentSize, setCurrentSize] = useState("Normal");
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
          editor
            .chain()
            .focus()
            .setImage({ src: event.target.result as string })
            .run();
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
        codeBlock: false, // Disable codeBlock from StarterKit
        heading: false,   // Disable heading from StarterKit
      }),
      Heading.configure({
        levels: [1, 2, 3, 4, 5, 6],
      }),
      CodeBlockLowlight.configure({
        lowlight,
      }),
      Link.configure({
        openOnClick: false,
      }),
      Image,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Color,
      TextStyle,
      FontSize,
    ],
    content: content,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      if (html !== content) {
        onChange(html);
      }
    },
    editorProps: {
      attributes: {
        class:
          "prose prose-slate max-w-none focus:outline-none min-h-[300px] p-4 text-gray-900",
      },
    },
  });

  useEffect(() => {
    if (editor && content) {
      // Only update content if it's different
      if (editor.getHTML() !== content) {
        editor.commands.setContent(content, false); // false to prevent focusing
      }
    }
  }, [editor, content]);

  const toggleHtmlMode = () => {
    if (!editor) return;

    if (!isHtmlMode) {
      // Switching to HTML mode
      setHtmlContent(editor.getHTML());
    } else {
      // Switching to rich text mode
      editor.commands.setContent(htmlContent);
    }
    setIsHtmlMode(!isHtmlMode);
  };

  const setFontSize = (sizeName: string) => {
    if (!editor) return;
    const size = FONT_SIZES[sizeName as keyof typeof FONT_SIZES];
    editor
      ?.chain()
      .focus()
      .unsetMark("fontSize")
      .setMark("fontSize", { size })
      .run();
    setCurrentSize(sizeName);
  };

  const setHeading = (level: number) => {
    if (!editor) return;
    editor
      .chain()
      .focus()
      .toggleHeading({ level: level as 1 | 2 | 3 | 4 | 5 | 6 })
      .run();
  };

  const setLink = () => {
    if (!editor) return;
    const url = window.prompt("Enter URL");
    if (url) {
      editor.chain().focus().setLink({ href: url }).run();
    }
  };

  if (!editor) {
    return null;
  }

  return (
    <div className="border border-input rounded-lg">
      <input
        type="file"
        ref={imageInputRef}
        onChange={handleImageUpload}
        accept="image/*"
        className="hidden"
      />
      <div className="border-b border-input bg-transparent p-1 flex items-center gap-1 flex-wrap">
        <ToolbarButton
          onClick={toggleHtmlMode}
          icon={<Code className="w-5 h-5" />}
          label="Toggle HTML Mode"
          isActive={isHtmlMode}
        />
        {!isHtmlMode && (
          <>
            <select
              className="h-8 rounded border border-input bg-transparent px-2 text-sm"
              value={editor.isActive('heading') ? `h${editor.getAttributes('heading').level}` : ''}
              onChange={(e) => {
                if (e.target.value === '') {
                  editor.chain().focus().setParagraph().run();
                } else {
                  const level = parseInt(e.target.value.replace('h', ''));
                  setHeading(level);
                }
              }}
            >
              <option value="">Normal</option>
              <option value="h1">Heading 1</option>
              <option value="h2">Heading 2</option>
              <option value="h3">Heading 3</option>
              <option value="h4">Heading 4</option>
              <option value="h5">Heading 5</option>
              <option value="h6">Heading 6</option>
            </select>
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleBold().run()}
              icon={<Bold className="w-5 h-5" />}
              label="Bold"
              isActive={editor.isActive("bold")}
            />
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleItalic().run()}
              icon={<Italic className="w-5 h-5" />}
              label="Italic"
              isActive={editor.isActive("italic")}
            />
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleStrike().run()}
              icon={<Strikethrough className="w-5 h-5" />}
              label="Strike"
              isActive={editor.isActive("strike")}
            />
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              icon={<List className="w-5 h-5" />}
              label="Bullet List"
              isActive={editor.isActive("bulletList")}
            />
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
              icon={<ListOrdered className="w-5 h-5" />}
              label="Ordered List"
              isActive={editor.isActive("orderedList")}
            />
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleBlockquote().run()}
              icon={<Quote className="w-5 h-5" />}
              label="Quote"
              isActive={editor.isActive("blockquote")}
            />
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleCodeBlock().run()}
              icon={<Code className="w-5 h-5" />}
              label="Code Block"
              isActive={editor.isActive("codeBlock")}
            />
            <input
              type="color"
              onInput={(e: React.FormEvent<HTMLInputElement>) =>
                editor
                  ?.chain()
                  .focus()
                  .setColor((e.target as HTMLInputElement).value)
                  .run()
              }
              value={editor.getAttributes("textStyle").color || "#000000"}
              className="h-8 w-8 cursor-pointer border-0 bg-transparent p-1"
              title="Text Color"
            />
            <ToolbarButton
              onClick={setLink}
              icon={<LinkIcon className="w-5 h-5" />}
              label="Add Link"
              isActive={editor.isActive("link")}
            />
            <ToolbarButton
              onClick={addImage}
              icon={<ImageIcon className="w-5 h-5" />}
              label="Add Image"
            />
            <ToolbarButton
              onClick={() => editor.commands.setTextAlign("left")}
              icon={<AlignLeft className="w-5 h-5" />}
              label="Align Left"
              isActive={editor.isActive({ textAlign: "left" })}
            />
            <ToolbarButton
              onClick={() => editor.commands.setTextAlign("center")}
              icon={<AlignCenter className="w-5 h-5" />}
              label="Align Center"
              isActive={editor.isActive({ textAlign: "center" })}
            />
            <ToolbarButton
              onClick={() => editor.commands.setTextAlign("right")}
              icon={<AlignRight className="w-5 h-5" />}
              label="Align Right"
              isActive={editor.isActive({ textAlign: "right" })}
            />
            <ToolbarButton
              onClick={() => editor.chain().focus().undo().run()}
              disabled={!editor?.can().undo()}
              icon={<Undo className="w-5 h-5" />}
              label="Undo"
            />
            <ToolbarButton
              onClick={() => editor.chain().focus().redo().run()}
              disabled={!editor?.can().redo()}
              icon={<Redo className="w-5 h-5" />}
              label="Redo"
            />
          </>
        )}
      </div>

      {isHtmlMode ? (
        <textarea
          className="w-full min-h-[500px] p-4 font-mono text-sm focus:outline-none resize-none"
          value={htmlContent}
          onChange={(e) => {
            const newContent = e.target.value;
            setHtmlContent(newContent);
            if (editor) {
              editor.commands.setContent(newContent, false);
              onChange(newContent);
            }
          }}
        />
      ) : (
        <EditorContent editor={editor} className="prose prose-slate max-w-none p-4" />
      )}
    </div>
  );
};

export default TiptapEditor;