"use client"; // Only for Next.js App Router

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Heading from "@tiptap/extension-heading";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import { common, createLowlight } from "lowlight";
import {
  Bold,
  Italic,
  Strikethrough,
  List,
  ListOrdered,
  Quote,
  Code,
  Heading1,
  Heading2,
  Heading3,
  Link as LinkIcon,
  Image as ImageIcon,
  Undo,
  Redo,
} from "lucide-react";
import { cn } from "@/lib/utils";

const lowlight = createLowlight(common);

interface ToolbarButtonProps {
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  isActive?: boolean;
  disabled?: boolean;
}

const ToolbarButton = ({ onClick, icon, label, isActive, disabled }: ToolbarButtonProps) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={cn(
      "p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors",
      "text-gray-600 dark:text-gray-300",
      "border border-transparent",
      "group relative",
      "disabled:opacity-50 disabled:cursor-not-allowed",
      isActive && "bg-gray-100 dark:bg-gray-800 text-blue-600 dark:text-blue-400"
    )}
    title={label}
  >
    {icon}
    <span className="sr-only">{label}</span>
    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-900 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
      {label}
    </div>
  </button>
);

interface TiptapEditorProps {
  content: string;
  setContent: (content: string) => void;
}

const TiptapEditor = ({ content, setContent }: TiptapEditorProps) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: false, // we'll add our own heading extension
      }),
      Heading.configure({
        levels: [1, 2, 3],
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-blue-600 dark:text-blue-400 hover:underline cursor-pointer",
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: "max-w-full h-auto rounded-lg",
        },
      }),
      CodeBlockLowlight.configure({
        lowlight,
        HTMLAttributes: {
          class: "rounded-lg bg-gray-900 p-4 font-mono text-sm text-gray-100",
        },
      }),
    ],
    content: content || "<p>Start writing here...</p>",
    onUpdate: ({ editor }) => {
      setContent(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: "prose dark:prose-invert max-w-none focus:outline-none min-h-[200px]",
      },
    },
  });

  if (!editor) return null;

  const addImage = () => {
    const url = window.prompt("Enter image URL");
    if (url) {
      editor.chain().focus().insertContent(`<img src="${url}" alt="Image" />`).run();
    }
  };

  const addLink = () => {
    const url = window.prompt("Enter URL");
    if (url) {
      editor.chain().focus().toggleLink({ href: url }).run();
    }
  };

  return (
    <div className="border dark:border-gray-700 rounded-lg overflow-hidden">
      <div className="flex flex-wrap gap-1 p-2 border-b dark:border-gray-700 bg-white dark:bg-gray-900">
        <div className="flex items-center gap-1 pr-2 border-r dark:border-gray-700">
          <ToolbarButton
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().undo()}
            icon={<Undo className="w-4 h-4" />}
            label="Undo"
          />
          <ToolbarButton
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().redo()}
            icon={<Redo className="w-4 h-4" />}
            label="Redo"
          />
        </div>

        <div className="flex items-center gap-1 pr-2 border-r dark:border-gray-700">
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            icon={<Heading1 className="w-4 h-4" />}
            label="Heading 1"
            isActive={editor.isActive("heading", { level: 1 })}
          />
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            icon={<Heading2 className="w-4 h-4" />}
            label="Heading 2"
            isActive={editor.isActive("heading", { level: 2 })}
          />
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            icon={<Heading3 className="w-4 h-4" />}
            label="Heading 3"
            isActive={editor.isActive("heading", { level: 3 })}
          />
        </div>

        <div className="flex items-center gap-1 pr-2 border-r dark:border-gray-700">
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBold().run()}
            icon={<Bold className="w-4 h-4" />}
            label="Bold"
            isActive={editor.isActive("bold")}
          />
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleItalic().run()}
            icon={<Italic className="w-4 h-4" />}
            label="Italic"
            isActive={editor.isActive("italic")}
          />
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleStrike().run()}
            icon={<Strikethrough className="w-4 h-4" />}
            label="Strikethrough"
            isActive={editor.isActive("strike")}
          />
        </div>

        <div className="flex items-center gap-1 pr-2 border-r dark:border-gray-700">
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            icon={<List className="w-4 h-4" />}
            label="Bullet List"
            isActive={editor.isActive("bulletList")}
          />
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            icon={<ListOrdered className="w-4 h-4" />}
            label="Ordered List"
            isActive={editor.isActive("orderedList")}
          />
        </div>

        <div className="flex items-center gap-1 pr-2 border-r dark:border-gray-700">
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            icon={<Quote className="w-4 h-4" />}
            label="Quote"
            isActive={editor.isActive("blockquote")}
          />
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
            icon={<Code className="w-4 h-4" />}
            label="Code Block"
            isActive={editor.isActive("codeBlock")}
          />
        </div>

        <div className="flex items-center gap-1">
          <ToolbarButton
            onClick={addLink}
            icon={<LinkIcon className="w-4 h-4" />}
            label="Add Link"
            isActive={editor.isActive("link")}
          />
          <ToolbarButton
            onClick={addImage}
            icon={<ImageIcon className="w-4 h-4" />}
            label="Add Image"
          />
        </div>
      </div>

      <div className="p-4 bg-white dark:bg-gray-900">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
};

export default TiptapEditor;
