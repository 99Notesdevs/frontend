"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import TextAlign from "@tiptap/extension-text-align";
import Color from "@tiptap/extension-color";
import TextStyle from "@tiptap/extension-text-style";
import { Mark, mergeAttributes, Extension, Editor } from "@tiptap/core";
import Heading from "@tiptap/extension-heading";
import { CleanPaste } from "./cleanpaste";
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
  AlignJustify,
  Table as TableIcon,
  RowsIcon,
  ColumnsIcon,
  Trash2,
  ChevronDown,
  Palette,
  Minus,
  Plus,
} from "lucide-react";
import { cn } from "@/lib/utils";
import React, { useState, useEffect, useRef, useCallback } from "react";
import Table from "@tiptap/extension-table";
import TableRow from "@tiptap/extension-table-row";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import { Iframe } from "./Iframe";
import { TABLE_DESIGNS } from "./tableDesigns";
import { OrderedList } from "@tiptap/extension-ordered-list";

// Editor instance will be created using the useEditor hook in the component
const editor = new Editor({
  extensions: [StarterKit, CleanPaste],
});

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

const TableStyles = Extension.create({
  name: "tableStyles",

  addGlobalAttributes() {
    return [
      {
        types: ["table", "tableRow", "tableCell", "tableHeader"],
        attributes: {
          style: {
            default: null,
            parseHTML: (element) => element.getAttribute("style"),
            renderHTML: (attributes) => {
              if (!attributes.style) return {};
              return { style: attributes.style };
            },
          },
        },
      },
    ];
  },
});

// Custom Image extension with resizing and text wrapping support
const CustomImage = Image.extend({
  name: "resizableImage",
  addOptions() {
    return {
      ...this.parent?.(),
      HTMLAttributes: {
        class: "floating-image",
      },
    };
  },
  addAttributes() {
    return {
      ...this.parent?.(),
      src: { default: null },
      alt: { default: null },
      title: { default: null },
      width: {
        default: "auto",
        renderHTML: (attributes: any) => ({
          width: attributes.width,
        }),
      },
      height: {
        default: "auto",
        renderHTML: (attributes: any) => ({
          height: attributes.height,
        }),
      },
      float: {
        default: "none",
        renderHTML: (attributes: any) => ({
          float: attributes.float,
        }),
      },
      margin: {
        default: "0 16px 16px 0",
        renderHTML: (attributes: any) => ({
          margin: attributes.margin,
        }),
      },
    };
  },
  renderHTML({ HTMLAttributes }: any) {
    // Map float to Tailwind classes
    let floatClass = "";
    let marginClass = "mb-4";
    if (HTMLAttributes.float === "left") {
      floatClass = "float-left";
      marginClass = "mr-4 mb-4";
    } else if (HTMLAttributes.float === "right") {
      floatClass = "float-right";
      marginClass = "ml-4 mb-4";
    } else {
      floatClass = "mx-auto";
      marginClass = "mb-4";
    }
    // Compose class string
    const className = ["floating-image", floatClass, marginClass].join(" ");

    // Merge with any additional classes
    const attrs = {
      ...HTMLAttributes,
      class: className,
      style: [
        HTMLAttributes.width && HTMLAttributes.width !== "auto"
          ? `width:${HTMLAttributes.width};`
          : "",
        HTMLAttributes.height && HTMLAttributes.height !== "auto"
          ? `height:${HTMLAttributes.height};`
          : "",
        "max-width:100%;height:auto;display:block;border-radius:0.375rem;",
      ].join(""),
    };

    return ["img", attrs];
  },
  addNodeView() {
    return ({ node, getPos, editor }: any) => {
      // Create the image element
      const img = document.createElement("img");
      const {
        src,
        alt,
        width,
        height,
        float = "none",
        margin = "0 16px 16px 16px",
      } = node.attrs;

      // Set up the image
      img.src = src;
      img.alt = alt || "";
      img.style.width = width || "50%";
      img.style.height = height || "auto";
      img.style.maxWidth = "100%";
      img.style.display = "block";
      img.style.verticalAlign = "top";
      img.style.margin = "0";
      img.style.padding = "0";
      img.style.border = "none";
      img.className = "floating-image";

      // Create the resize handle
      const resizeHandle = document.createElement("div");
      resizeHandle.className = "resize-handle";

      // Create the container for the image and resize handle
      const container = document.createElement("div");
      container.className = "resizable-image-container";
      container.setAttribute("data-type", "image-container");
      container.setAttribute("data-float", float);
      container.style.float = float;
      container.style.maxWidth = "50%";
      container.style.display = "inline-block";
      container.style.verticalAlign = "top";
      container.style.margin = margin;
      container.style.shapeOutside = "margin-box";
      container.style.shapeMargin = "1em";
      container.style.zIndex = "1";

      // Make the image and resize handle interactive while keeping the container non-interactive
      img.style.pointerEvents = "auto";
      img.style.display = "block";
      img.style.margin = "0";
      img.style.padding = "0";
      img.style.border = "none";
      resizeHandle.style.pointerEvents = "auto";
      container.appendChild(img);
      container.appendChild(resizeHandle);

      // Resize functionality
      let isResizing = false;
      let startX: number,
        startY: number,
        startWidth: number,
        startHeight: number;

      const onMouseDown = (e: MouseEvent) => {
        if (e.target === resizeHandle) {
          e.preventDefault();
          e.stopPropagation();
          isResizing = true;
          startX = e.clientX;
          startY = e.clientY;
          startWidth = parseInt(
            document.defaultView?.getComputedStyle(img).width || "0",
            10
          );
          startHeight = parseInt(
            document.defaultView?.getComputedStyle(img).height || "0",
            10
          );

          document.addEventListener("mousemove", onMouseMove);
          document.addEventListener("mouseup", onMouseUp);
        }
      };

      const onMouseMove = (e: MouseEvent) => {
        if (!isResizing) return;

        const dx = e.clientX - startX;
        const dy = e.clientY - startY;

        const newWidth = startWidth + dx;
        const newHeight = startHeight + dy;

        img.style.width = `${newWidth}px`;
        img.style.height = `${newHeight}px`;
      };

      const onMouseUp = () => {
        if (!isResizing) return;

        isResizing = false;

        // Update the node with new dimensions
        const { view } = editor;
        const { state } = view;
        const pos = getPos();

        if (typeof pos === "number") {
          view.dispatch(
            state.tr.setNodeMarkup(pos, undefined, {
              ...node.attrs,
              width: img.style.width,
              height: img.style.height,
            })
          );
        }

        document.removeEventListener("mousemove", onMouseMove);
        document.removeEventListener("mouseup", onMouseUp);
      };

      container.addEventListener("mousedown", onMouseDown);

      return {
        dom: container,
        destroy: () => {
          container.removeEventListener("mousedown", onMouseDown);
        },
      };
    };
  },
});

// Custom Link extension with title and description support
const CustomLink = Link.extend({
  addAttributes() {
    return {
      href: {
        default: null,
      },
      title: {
        default: null,
      },
      "data-description": {
        default: null,
      },
      "data-title": {
        default: null,
      },
    };
  },
  renderHTML({ HTMLAttributes }) {
    return ["a", HTMLAttributes, 0];
  },
});
const CustomOrderedList = OrderedList.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      'data-list-style': {
        default: 'decimal',
        parseHTML: (element: any) => element.getAttribute('data-list-style') || 'decimal',
        renderHTML: (attributes: any) => ({
          'data-list-style': attributes['data-list-style'] || 'decimal',
          style: `list-style-type: ${attributes['data-list-style'] || 'decimal'}`,
        }),
      },
    };
  },
  parseHTML() {
    return [
      {
        tag: 'ol',
        getAttrs: (node: any) => {
          const element = node as HTMLElement;
          // Try to get list style from data attribute first, then from style attribute
          const listStyle = element.getAttribute('data-list-style') || 
                           (element.style.listStyleType || 'decimal');
          return {
            'data-list-style': listStyle,
          };
        },
      },
    ];
  },
  renderHTML({ HTMLAttributes }: any) {
    const listStyle = HTMLAttributes['data-list-style'] || 'decimal';
    
    return ['ol', { 
      ...HTMLAttributes, 
      'data-list-style': listStyle,
      style: `list-style-type: ${listStyle}`
    }, 0];
  },
  addCommands() {
    return {
      ...this.parent?.(),
      setOrderedListStyle: 
        (styleType: string) => 
        ({ commands }: { commands: any }) => {
          return commands.updateAttributes('orderedList', { 
            'data-list-style': styleType,
            style: `list-style-type: ${styleType}`
          });
        },
    };
  },
});

// List style types
const LIST_STYLES = [
  { id: 'disc', label: 'Bullets', icon: <List className="w-4 h-4" /> },
  { id: 'decimal', label: 'Numbers', icon: <ListOrdered className="w-4 h-4" /> },
  { id: 'lower-roman', label: 'Lower Roman', icon: <ListOrdered className="w-4 h-4" /> },
  { id: 'upper-roman', label: 'Upper Roman', icon: <ListOrdered className="w-4 h-4" /> },
  { id: 'lower-alpha', label: 'Lower Alpha', icon: <ListOrdered className="w-4 h-4" /> },
  { id: 'upper-alpha', label: 'Upper Alpha', icon: <ListOrdered className="w-4 h-4" /> },
];

interface ListMenuProps {
  editor: any;
}

const ListMenu = ({ editor }: ListMenuProps) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [showTemplates, setShowTemplates] = React.useState(false);
  const menuRef = React.useRef<HTMLDivElement>(null);
  const buttonRef = React.useRef<HTMLButtonElement>(null);

  // Close menu when clicking outside
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Get current list style
  const getCurrentListStyle = () => {
    if (editor.isActive("orderedList")) {
      const attrs = editor.getAttributes("orderedList");
      // Check both data-list-style attribute and style attribute for backward compatibility
      let style = attrs['data-list-style'];
      if (!style && attrs.style) {
        const match = attrs.style.match(/list-style-type:\s*([^;]+)/);
        if (match) style = match[1].trim();
      }
      return style || 'decimal';
    } else if (editor.isActive('bulletList')) {
      return 'disc';
    }
    return null;
  };

  const currentStyle = getCurrentListStyle();
  const currentStyleData =
    LIST_STYLES.find((style) => style.id === currentStyle) || LIST_STYLES[0];

  const toggleList = (styleId: string) => {
    const isSameStyle = currentStyle === styleId;

    // If clicking the same style, toggle it off
    if (isSameStyle) {
      if (styleId === 'disc') {
        editor.chain().focus().toggleBulletList().run();
      } else {
        editor.chain().focus().toggleOrderedList().run();
      }
      setIsOpen(false);
      return;
    }

    // If switching from one list type to another, first clear any existing list
    if (currentStyle !== null) {
      if (editor.isActive('orderedList')) {
        editor.chain().focus().toggleOrderedList().run();
      } else if (editor.isActive('bulletList')) {
        editor.chain().focus().toggleBulletList().run();
      }
    }

    // Apply the new list style
    if (styleId === 'disc') {
      editor.chain().focus().toggleBulletList().run();
    } else {
      editor
        .chain()
        .focus()
        .toggleOrderedList()
        .updateAttributes('orderedList', { 
          'data-list-style': styleId,
          style: `list-style-type: ${styleId}`
        })
        .run();
    }

    setIsOpen(false);
  };

  return (
    <div className="relative">
      <ToolbarButton
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        icon={
          <div className="flex items-center gap-1">
            {currentStyleData.icon}
            <ChevronDown className="w-3 h-3 opacity-50" />
          </div>
        }
        label="List Styles"
        isActive={currentStyle !== null}
      />

      {isOpen && (
        <div
          ref={menuRef}
          className="absolute left-0 z-10 mt-1 w-48 bg-white rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5 focus:outline-none"
          role="menu"
          aria-orientation="vertical"
          tabIndex={-1}
        >
          {LIST_STYLES.map((style) => (
            <button
              key={style.id}
              onClick={() => toggleList(style.id)}
              className={`w-full text-left px-4 py-2 text-sm flex items-center gap-2 ${
                currentStyle === style.id
                  ? "bg-gray-100 text-gray-900"
                  : "text-gray-700 hover:bg-gray-50"
              }`}
              role="menuitem"
              tabIndex={-1}
              type="button"
            >
              <span className="w-5 flex justify-center">{style.icon}</span>
              <span>{style.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

const PRESET_COLORS = [
  "#000000", // Black
  "#343A40", // Dark Gray
  "#495057", // Gray
  "#868E96", // Medium Gray
  "#E9ECEF", // Light Gray
  "#F8F9FA", // Almost White
  "#E03131", // Red
  "#C2255C", // Pink
  "#9C36B5", // Purple
  "#3B5BDB", // Blue
  "#1098AD", // Cyan
  "#0CA678", // Teal
  "#37B24D", // Green
  "#74B816", // Lime
  "#F59F00", // Yellow
  "#F76707", // Orange
];

interface ToolbarButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: React.ReactNode;
  label: string;
  isActive?: boolean;
}

const ToolbarButton = React.forwardRef<HTMLButtonElement, ToolbarButtonProps>(
  (
    {
      onClick,
      icon,
      label,
      isActive = false,
      disabled = false,
      className = "",
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        type="button"
        onClick={onClick}
        disabled={disabled}
        className={cn(
          "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground h-8 w-8 p-0",
          isActive ? "bg-accent text-accent-foreground" : "",
          className
        )}
        aria-label={label}
        title={label}
      >
        {icon}
      </button>
    );
  }
);

ToolbarButton.displayName = "ToolbarButton";

interface TableMenuProps {
  editor: any;
}

const TableMenu = ({ editor }: TableMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setShowTemplates(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const addTable = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    editor
      .chain()
      .focus()
      .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
      .run();
    setIsOpen(false);
    setShowTemplates(false);
  };

  const addRowAfter = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    editor.chain().focus().addRowAfter().run();
    setIsOpen(false);
    setShowTemplates(false);
  };

  const addColumnAfter = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    editor.chain().focus().addColumnAfter().run();
    setIsOpen(false);
    setShowTemplates(false);
  };

  const deleteRow = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    editor.chain().focus().deleteRow().run();
    setIsOpen(false);
    setShowTemplates(false);
  };

  const deleteColumn = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    editor.chain().focus().deleteColumn().run();
    setIsOpen(false);
    setShowTemplates(false);
  };

  const deleteTable = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    editor.chain().focus().deleteTable().run();
    setIsOpen(false);
    setShowTemplates(false);
  };

  const increaseRowHeight = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const { from, to } = editor.state.selection;
    const transactions: any[] = [];

    editor.state.doc.nodesBetween(from, to, (node: any, pos: number) => {
      if (node.type.name === "tableRow") {
        const currentHeight =
          node.attrs.style?.match(/height:\s*(\d+px)/)?.[1] || "24px";
        const newHeight = `${Math.min(parseInt(currentHeight) + 10, 200)}px`;

        transactions.push(
          editor.state.tr.setNodeMarkup(pos, null, {
            ...node.attrs,
            style: `height: ${newHeight};`,
          })
        );
      }
    });

    transactions.forEach((tr: any) => editor.view.dispatch(tr));
  };

  const decreaseRowHeight = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const { from, to } = editor.state.selection;
    const transactions: any[] = [];

    editor.state.doc.nodesBetween(from, to, (node: any, pos: number) => {
      if (node.type.name === "tableRow") {
        const currentHeight =
          node.attrs.style?.match(/height:\s*(\d+px)/)?.[1] || "24px";
        const newHeight = `${Math.max(parseInt(currentHeight) - 10, 10)}px`;

        transactions.push(
          editor.state.tr.setNodeMarkup(pos, null, {
            ...node.attrs,
            style: `height: ${newHeight};`,
          })
        );
      }
    });

    transactions.forEach((tr: any) => editor.view.dispatch(tr));
  };

  const increaseColumnWidth = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const { from, to } = editor.state.selection;
    const transactions: any[] = [];

    editor.state.doc.nodesBetween(from, to, (node: any, pos: number) => {
      if (node.type.name === "tableCell" || node.type.name === "tableHeader") {
        const currentStyle = node.attrs.style || "";
        const currentWidth =
          currentStyle.match(/width:\s*(\d+px)/)?.[1] || "100px";
        const newWidth = `${Math.min(parseInt(currentWidth) + 20, 500)}px`;
        const newStyle = currentStyle
          ? currentStyle.replace(/width:\s*\d+px/, `width: ${newWidth}`)
          : `width: ${newWidth};`;

        if (!currentStyle.includes("width:")) {
          // If width style doesn't exist, add it
          transactions.push(
            editor.state.tr.setNodeMarkup(pos, null, {
              ...node.attrs,
              style: `${node.attrs.style || ""} width: ${newWidth};`.trim(),
            })
          );
        } else {
          // If width style exists, replace it
          transactions.push(
            editor.state.tr.setNodeMarkup(pos, null, {
              ...node.attrs,
              style: newStyle,
            })
          );
        }
      }
    });

    transactions.forEach((tr: any) => editor.view.dispatch(tr));
  };

  const decreaseColumnWidth = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const { from, to } = editor.state.selection;
    const transactions: any[] = [];

    editor.state.doc.nodesBetween(from, to, (node: any, pos: number) => {
      if (node.type.name === "tableCell" || node.type.name === "tableHeader") {
        const currentStyle = node.attrs.style || "";
        const currentWidth =
          currentStyle.match(/width:\s*(\d+px)/)?.[1] || "100px";
        const newWidth = `${Math.max(parseInt(currentWidth) - 20, 50)}px`;
        const newStyle = currentStyle
          ? currentStyle.replace(/width:\s*\d+px/, `width: ${newWidth}`)
          : `width: ${newWidth};`;

        if (!currentStyle.includes("width:")) {
          // If width style doesn't exist, add it
          transactions.push(
            editor.state.tr.setNodeMarkup(pos, null, {
              ...node.attrs,
              style: `${node.attrs.style || ""} width: ${newWidth};`.trim(),
            })
          );
        } else {
          // If width style exists, replace it
          transactions.push(
            editor.state.tr.setNodeMarkup(pos, null, {
              ...node.attrs,
              style: newStyle,
            })
          );
        }
      }
    });

    transactions.forEach((tr: any) => editor.view.dispatch(tr));
  };

  const insertTableTemplate = (html: string) => {
    editor.chain().focus().insertContent(html).run();
    setIsOpen(false);
    setShowTemplates(false);
  };

  const toggleMenu = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!isOpen) {
      setShowTemplates(false);
    }
    setIsOpen(!isOpen);
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={toggleMenu}
        className={cn(
          "p-1.5 rounded hover:bg-gray-100 transition-colors text-gray-900 flex items-center gap-1",
          editor.isActive("table") && "bg-gray-100 text-blue-600"
        )}
        title="Table"
      >
        <TableIcon className="w-5 h-5" />
        {editor.isActive("table") && (
          <ChevronDown
            className="w-3 h-3 transition-transform duration-200"
            style={{ transform: isOpen ? "rotate(180deg)" : "rotate(0deg)" }}
          />
        )}
      </button>
      {isOpen && (
        <div className="absolute z-50 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
          <div className="py-1" role="menu" aria-orientation="vertical">
            {!editor.isActive("table") && (
              <>
                <button
                  type="button"
                  onClick={addTable}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 flex items-center gap-2"
                >
                  <TableIcon className="w-4 h-4" />
                  Insert Basic Table
                </button>
                <div className="relative">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      setShowTemplates(!showTemplates);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 flex items-center justify-between"
                  >
                    <span>Insert Template</span>
                    <ChevronDown
                      className={`w-4 h-4 transition-transform ${
                        showTemplates ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {showTemplates && (
                    <div className="absolute left-full top-0 ml-1 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
                      {TABLE_DESIGNS.map((template, index) => (
                        <button
                          type="button"
                          key={index}
                          onClick={(e) => {
                            e.preventDefault();
                            insertTableTemplate(template.html);
                          }}
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                        >
                          {template.name}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}
            {editor.isActive("table") && (
              <>
                <button
                  type="button"
                  onClick={addRowAfter}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 flex items-center gap-2"
                >
                  <RowsIcon className="w-4 h-4" />
                  Add Row
                </button>
                <button
                  type="button"
                  onClick={addColumnAfter}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 flex items-center gap-2"
                >
                  <ColumnsIcon className="w-4 h-4" />
                  Add Column
                </button>
                <div className="border-t border-gray-100 my-1">
                  <div className="px-2 py-1 text-xs font-medium text-gray-500">
                    Row Height
                  </div>
                  <div className="flex">
                    <button
                      type="button"
                      onClick={decreaseRowHeight}
                      className="flex-1 text-center px-2 py-1 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                      title="Decrease Row Height"
                    >
                      <Minus className="w-3 h-3 mx-auto" />
                    </button>
                    <button
                      type="button"
                      onClick={increaseRowHeight}
                      className="flex-1 text-center px-2 py-1 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                      title="Increase Row Height"
                    >
                      <Plus className="w-3 h-3 mx-auto" />
                    </button>
                  </div>
                </div>
                <div className="border-t border-gray-100 my-1">
                  <div className="px-2 py-1 text-xs font-medium text-gray-500">
                    Column Width
                  </div>
                  <div className="flex">
                    <button
                      type="button"
                      onClick={decreaseColumnWidth}
                      className="flex-1 text-center px-2 py-1 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                      title="Decrease Column Width"
                    >
                      <Minus className="w-3 h-3 mx-auto" />
                    </button>
                    <button
                      type="button"
                      onClick={increaseColumnWidth}
                      className="flex-1 text-center px-2 py-1 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                      title="Increase Column Width"
                    >
                      <Plus className="w-3 h-3 mx-auto" />
                    </button>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={deleteRow}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 flex items-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete Row
                </button>
                <button
                  type="button"
                  onClick={deleteColumn}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 flex items-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete Column
                </button>
                <button
                  type="button"
                  onClick={deleteTable}
                  className="w-full text-left px-4 py-2 text-sm text-red-700 hover:bg-red-50 hover:text-red-900 flex items-center gap-2 border-t border-gray-100 mt-1 pt-2"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete Table
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

interface ColorMenuProps {
  editor: any;
}

const ColorMenu = ({ editor }: ColorMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [customColor, setCustomColor] = useState("#000000");
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const setColor = (color: string) => {
    editor.chain().focus().setColor(color).run();
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "p-1.5 rounded hover:bg-gray-100 transition-colors text-gray-900 flex items-center gap-1",
          editor.isActive("textStyle") && "bg-gray-100"
        )}
        title="Text Color"
      >
        <div className="flex items-center gap-1">
          <Palette
            className="w-5 h-5"
            style={{
              color: editor.getAttributes("textStyle").color || "#000000",
            }}
          />
          <ChevronDown
            className="w-3 h-3 transition-transform duration-200"
            style={{ transform: isOpen ? "rotate(180deg)" : "rotate(0deg)" }}
          />
        </div>
      </button>
      {isOpen && (
        <div
          className="absolute z-50 mt-2 p-2 rounded-lg shadow-lg bg-white ring-1 ring-black ring-opacity-5"
          style={{ width: "272px" }}
        >
          <div className="grid grid-cols-8 gap-1" role="menu">
            {PRESET_COLORS.map((color) => (
              <button
                key={color}
                type="button"
                onClick={() => setColor(color)}
                className="w-8 h-8 rounded-md border border-gray-200 transition-transform hover:scale-110 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                style={{
                  backgroundColor: color,
                  transform:
                    editor.getAttributes("textStyle").color === color
                      ? "scale(1.1)"
                      : "scale(1)",
                }}
                title={color}
              />
            ))}
          </div>
          <div className="mt-2 pt-2 border-t">
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={customColor}
                onChange={(e) => setCustomColor(e.target.value)}
                className="w-8 h-8 p-0 border-0 rounded cursor-pointer"
              />
              <button
                type="button"
                onClick={() => setColor(customColor)}
                className="flex-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-md px-3 py-1.5 transition-colors"
              >
                Custom Color
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
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

const debounce = (fn: Function, delay: number) => {
  let timeoutId: NodeJS.Timeout;
  return (...args: any[]) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
};

const TiptapEditor = ({ content, onChange }: TiptapEditorProps) => {
  const [linkDialogOpen, setLinkDialogOpen] = useState(false);
  const [linkData, setLinkData] = useState({
    url: "",
    title: "",
    description: "",
  });
  const [isHtmlMode, setIsHtmlMode] = useState(false);
  const [htmlContent, setHtmlContent] = useState("");
  const [currentSize, setCurrentSize] = useState("Normal");
  const imageInputRef = React.useRef<HTMLInputElement>(null);
  const [imageDialogOpen, setImageDialogOpen] = useState(false);
  const [imageSrc, setImageSrc] = useState<string>("");
  const [altText, setAltText] = useState("");
  const [name, setName] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [htmlCursor, setHtmlCursor] = useState(0); // For HTML textarea cursor
  const [tiptapSelection, setTiptapSelection] = useState<{
    from: number;
    to: number;
  } | null>(null); // For Tiptap selection

  // Add styles for the resizable image and list wrapping
  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = `
      .resizable-image-container {
        position: relative;
        display: inline-block;
        max-width: 100%;
        margin: 0.5rem 1rem 1rem 1rem;
        vertical-align: middle;
        shape-outside: content-box;
        shape-margin: 0.75rem;
      }
      
      /* Improve text wrapping around images */
      .ProseMirror p {
        margin: 0 0 1em 0;
        line-height: 1.6;
      }
      
      /* Fix for list items wrapping around floated images */
      .ProseMirror ul, .ProseMirror ol {
        overflow: hidden; /* Contain the float */
        padding-left: 1.5em; /* Standard list indentation */
      }
      
      .ProseMirror li {
        position: relative;
        overflow: visible; /* Allow content to flow around floats */
      }
      
      /* Fix for nested lists */
      .ProseMirror li > ul,
      .ProseMirror li > ol {
        margin: 0.25em 0;
        padding-left: 1.5em;
      }
      
      /* Ensure list markers stay in place */
      .ProseMirror li > p:first-child {
        display: inline;
      }
      
      .ProseMirror img.floating-image {
        margin: 0.5rem 1rem 1rem 1rem;
      }
      
      .ProseMirror img[data-float="left"] {
        float: left;
        margin-right: 1.5rem;
        margin-left: 0;
        clear: left;
      }
      
      .ProseMirror img[data-float="right"] {
        float: right;
        margin-left: 1.5rem;
        margin-right: 0;
        clear: right;
        margin-right: 0;
      }
      
      .resize-handle {
        position: absolute;
        right: -8px;
        bottom: -8px;
        width: 16px;
        height: 16px;
        background: #3b82f6;
        border-radius: 50%;
        cursor: nwse-resize;
        z-index: 10;
        opacity: 0;
        transition: opacity 0.2s ease;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        border: 2px solid white;
      }
      
      .resizable-image-container:hover .resize-handle {
        opacity: 1;
      }
      
      .resizable-image-container img {
        max-width: 100%;
        height: auto;
        transition: box-shadow 0.2s ease;
      }
      
      .resizable-image-container:hover img {
        box-shadow: 0 0 0 2px #3b82f6;
      }
      
      .resizable-image-container.resizing img {
        user-select: none;
        pointer-events: none;
      }
      
      .resizable-image-container.resizing .resize-handle {
        opacity: 1;
        background: #1d4ed8;
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  const addImage = () => {
    imageInputRef.current?.click();
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      const file = e.target.files[0];
      const reader = new FileReader();

      reader.onloadstart = () => setIsUploading(true);

      reader.onload = (event) => {
        if (event.target?.result) {
          setImageSrc(event.target.result as string);
          setImageDialogOpen(true);
          setAltText("");
        }
      };

      reader.onloadend = () => setIsUploading(false);

      reader.onerror = () => {
        console.error("Error reading file");
        setIsUploading(false);
      };

      reader.readAsDataURL(file);
    }
  };

  const handleAddImage = () => {
    if (!editor || !imageSrc) return;

    editor
      .chain()
      .focus()
      .setImage({
        src: imageSrc,
        alt: altText,
        title: name,
      })
      .run();

    // Reset the dialog
    setImageDialogOpen(false);
    setImageSrc("");
    setAltText("");
    setName("");

    // Reset the input value to allow selecting the same file again
    if (imageInputRef.current) {
      imageInputRef.current.value = "";
    }
  };

  const handleCancelImage = () => {
    setImageDialogOpen(false);
    setImageSrc("");
    setAltText("");
    setName("");
    if (imageInputRef.current) {
      imageInputRef.current.value = "";
    }
  };

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3, 4, 5, 6],
        },
        bulletList: {
          keepMarks: true,
          keepAttributes: true,
        },
        orderedList: false,
      }),
      CustomOrderedList,
      CustomLink.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-blue-500 underline hover:text-blue-700",
        },
      }),
      // Configure the image extension to work within tables
      CustomImage.configure({
        inline: true,
        allowBase64: true,
        HTMLAttributes: {
          class: "max-w-full h-auto",
        },
      }),
      
      TextAlign.configure({ types: ["heading", "paragraph", "image", "tableCell"],}),
      Color,
      TextStyle,
      FontSize,
      TableStyles,
      Table.configure({
        resizable: true,
        HTMLAttributes: {
          style:
            "width: 100%; border-collapse: collapse; border: 1px solid #e5e7eb;",
        },
      }),
      TableRow.configure({
        HTMLAttributes: {
          style: "border: 1px solid #e5e7eb;",
        },
      }),
      TableHeader.configure({
        HTMLAttributes: {
          style:
            "border: 1px solid #e5e7eb; padding: 0.5rem; background-color: #f9fafb; font-weight: 500;",
        },
      }),
      TableCell.configure({
        HTMLAttributes: {
          style:
            "border: 1px solid #e5e7eb; padding: 0.5rem; vertical-align: top;",
        },
      }),
      Iframe,
      CleanPaste,
    ],
    content: content,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      const handleUpdate = debounce(() => {
        if (editor) {
          const html = editor.getHTML();
          if (html !== content) {
            onChange(html); // Ensure the updated content is passed to the parent
          }
        }
      }, 300);
      handleUpdate();
    },
    editorProps: {
      handleDOMEvents: {
        // Prevent default image dragging behavior
        dragstart: (view: any, event: Event) => {
          const target = event.target as HTMLElement;
          if (target?.closest(".resizable-image-container")) {
            event.preventDefault();
            return true;
          }
          return false;
        },
      },
      attributes: {
        class:
          "prose prose-slate max-w-none focus:outline-none min-h-[300px] p-4 text-gray-900 overflow-y-auto h-[600px]",
      },
    },
  });

  useEffect(() => {
    if (editor && content) {
      if (editor.getHTML() !== content) {
        editor.commands.setContent(content, false); // Prevent focusing
      }
    }
  }, [editor, content]);

  // Helper: Get plain text up to a position in HTML
  function getTextUpToHtmlPos(html: string, pos: number) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html.slice(0, pos), "text/html");
    return doc.body.textContent?.length || 0;
  }

  // Helper: Find HTML position for a given text offset
  function findHtmlPosForTextOffset(html: string, offset: number) {
    let textCount = 0;
    for (let i = 0; i < html.length; i++) {
      if (html[i] === "<") {
        // Skip tag
        while (i < html.length && html[i] !== ">") i++;
      } else {
        textCount++;
        if (textCount === offset) return i + 1;
      }
    }
    return html.length;
  }

  // When switching to HTML mode, store Tiptap selection and set textarea cursor
  const toggleHtmlMode = () => {
    if (!editor) return;
    if (!isHtmlMode) {
      // Switching to HTML mode
      const content = editor.getHTML();
      const processedContent = content
        .replace(/<table([^>]*)>/g, (match, attrs) => {
          if (attrs.includes("style=")) return match;
          return `<table style="width: 100%; border-collapse: collapse; border: 1px solid #e5e7eb; margin: 0;"${attrs}>`;
        })
        .replace(/<t[hd]([^>]*)>/g, (match, attrs) => {
          if (attrs.includes("style=")) return match;
          return `<td style="border: 1px solid #e5e7eb; padding: 4px 6px; margin: 0; line-height: 1.2;"${attrs}>`;
        })
        .replace(/<th([^>]*)>/g, (match, attrs) => {
          if (attrs.includes("style=")) return match;
          return `<th style="border: 1px solid #e5e7eb; padding: 4px 6px; background-color: #f9fafb; margin: 0; line-height: 1.2;"${attrs}>`;
        });
      setHtmlContent(processedContent);
      // Store Tiptap selection
      const { from, to } = editor.state.selection;
      setTiptapSelection({ from, to });
      // Map Tiptap selection to HTML cursor
      const plainText = editor.getText();
      const htmlPos = findHtmlPosForTextOffset(processedContent, from);
      setTimeout(() => {
        setHtmlCursor(htmlPos);
      }, 0);
    } else {
      // Switching back to rich text mode
      // Store HTML cursor
      const textarea = document.getElementById(
        "tiptap-html-textarea"
      ) as HTMLTextAreaElement;
      const cursor = textarea ? textarea.selectionStart : 0;
      setHtmlCursor(cursor);
      // Map HTML cursor to text offset
      const textOffset = getTextUpToHtmlPos(htmlContent, cursor);
      setTimeout(() => {
        setTiptapSelection({ from: textOffset, to: textOffset });
      }, 0);
      const contentWithPreservedStyles = htmlContent.replace(
        /<table[^>]*style="([^"]*)"[^>]*>/g,
        (match, style) => {
          // Preserve custom styles while switching back
          return match;
        }
      );
      editor.commands.setContent(contentWithPreservedStyles, false);
    }
    setIsHtmlMode(!isHtmlMode);
  };

  // Set textarea cursor after switching to HTML mode
  useEffect(() => {
    if (isHtmlMode && typeof htmlCursor === "number") {
      const textarea = document.getElementById(
        "tiptap-html-textarea"
      ) as HTMLTextAreaElement;
      if (textarea) {
        textarea.setSelectionRange(htmlCursor, htmlCursor);
        textarea.focus();
      }
    }
  }, [isHtmlMode, htmlCursor]);

  // Set Tiptap selection after switching back to rich text mode
  useEffect(() => {
    if (!isHtmlMode && tiptapSelection && editor) {
      editor.commands.focus(tiptapSelection.from);
      // Optionally, set selection range if needed
      // editor.view.dispatch(editor.state.tr.setSelection(TextSelection.create(editor.state.doc, tiptapSelection.from, tiptapSelection.to)));
    }
  }, [isHtmlMode, tiptapSelection, editor]);

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

  const setIframe = () => {
    if (!editor) return;

    const src = window.prompt("Enter iframe URL");
    if (src) {
      editor
        .chain()
        .focus()
        .insertContent({
          type: "iframe",
          attrs: {
            src,
            width: "100%",
            height: "300",
            frameborder: "0",
            allowfullscreen: true,
          },
        })
        .run();
    }
  };

  const setHeading = (level: number) => {
    if (!editor) return;
    editor
      .chain()
      .focus()
      .toggleHeading({ level: level as 1 | 2 | 3 | 4 | 5 | 6 })
      .run();
  };

  const handleLinkSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editor) return;

    const { url, title, description } = linkData;

    // Remove the link if the URL is empty
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
    } else {
      // Update the link with all attributes
      editor
        .chain()
        .focus()
        .extendMarkRange("link")
        .setLink({
          href: url,
          "data-title": title,
          "data-description": description,
        } as any)
        .run();
    }

    setLinkDialogOpen(false);
  };

  const setLink = () => {
    if (!editor) return;

    const previousUrl = editor.getAttributes("link").href || "";
    const previousTitle = editor.getAttributes("link").title || "";
    const previousDescription =
      editor.getAttributes("link")["data-description"] || "";

    setLinkData({
      url: previousUrl,
      title: previousTitle,
      description: previousDescription,
    });

    setLinkDialogOpen(true);
  };

  if (!editor) {
    return null;
  }

  const formatHTML = (html: string) => {
    return html.replace(/></g, ">\n<");
  };

  // Toggle image alignment (left/right/none)
  const setImageAlignment = (float: string) => {
    const { state } = editor;
    const { selection } = state;
    const { $from } = selection;
    const node = $from.nodeAfter || $from.nodeBefore;

    if (node && node.type.name === "resizableImage") {
      // Toggle off if clicking the same alignment
      const currentFloat = node.attrs.float || "none";
      const newFloat = currentFloat === float ? "none" : float;

      // Set appropriate margins based on alignment
      let margin = "0 16px 16px 0"; // default right margin
      if (newFloat === "right") {
        margin = "0 0 16px 16px"; // left margin when right-aligned
      } else if (newFloat === "none") {
        margin = "16px auto"; // centered
      }

      editor
        .chain()
        .focus()
        .updateAttributes("resizableImage", {
          float: newFloat,
          margin: margin,
        })
        .run();
    }
  };

  // Helper: Check if cursor is on an image
  const isImageSelected = () => {
    const { state } = editor;
    const { selection } = state;
    const { $from } = selection;
    const node = $from.nodeAfter || $from.nodeBefore;
    return node && node.type.name === "resizableImage";
  };

  // Helper: Get current image float alignment
  const getImageAlignment = () => {
    const { state } = editor;
    const { selection } = state;
    const { $from } = selection;
    const node = $from.nodeAfter || $from.nodeBefore;
    if (node && node.type.name === "resizableImage") {
      return node.attrs.float || "none";
    }
    return null;
  };

  return (
    <div className="border border-input rounded-lg">
      <input
        type="file"
        ref={imageInputRef}
        onChange={handleImageUpload}
        accept="image/*"
        className="hidden"
      />

      {/* Image Dialog */}
      {/* Link Dialog */}
      {linkDialogOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-medium mb-4">Add/Edit Link</h3>
            <form onSubmit={handleLinkSubmit}>
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="url"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    URL <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="url"
                    type="url"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="https://example.com"
                    value={linkData.url}
                    onChange={(e) =>
                      setLinkData({ ...linkData, url: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label
                    htmlFor="title"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Title
                  </label>
                  <input
                    id="title"
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Link title (optional)"
                    value={linkData.title}
                    onChange={(e) =>
                      setLinkData({ ...linkData, title: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label
                    htmlFor="description"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Description
                  </label>
                  <textarea
                    id="description"
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Link description (optional)"
                    value={linkData.description}
                    onChange={(e) =>
                      setLinkData({ ...linkData, description: e.target.value })
                    }
                  />
                </div>
              </div>
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setLinkDialogOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleLinkSubmit}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Apply
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {imageDialogOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onKeyDown={(e) => {
            if (e.key === "Escape") {
              handleCancelImage();
            } else if (e.key === "Enter") {
              handleAddImage();
            }
          }}
          tabIndex={-1}
        >
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-medium mb-4">Add Image</h3>

            <div className="mb-4">
              {imageSrc && (
                <div className="mb-4 border rounded-md overflow-hidden">
                  <img
                    src={imageSrc}
                    alt="Preview"
                    className="max-h-48 w-full object-contain"
                  />
                </div>
              )}

              <label className="block text-sm font-medium text-gray-700 mb-1">
                Image Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter image name"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                autoFocus
              />

              <label className="block text-sm font-medium text-gray-700 mb-1">
                Alt Text (for accessibility)
              </label>
              <input
                type="text"
                value={altText}
                onChange={(e) => setAltText(e.target.value)}
                placeholder="Describe the image for accessibility"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <p className="mt-1 text-xs text-gray-500">
                Alt text improves accessibility for users with screen readers.
              </p>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={handleCancelImage}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                disabled={isUploading}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleAddImage}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                disabled={isUploading}
              >
                {isUploading ? "Uploading..." : "Add Image"}
              </button>
            </div>
          </div>
        </div>
      )}
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
              value={
                editor.isActive("heading")
                  ? `h${editor.getAttributes("heading").level}`
                  : ""
              }
              onChange={(e) => {
                if (e.target.value === "") {
                  editor.chain().focus().setParagraph().run();
                } else {
                  const level = parseInt(e.target.value.replace("h", ""));
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
            <ColorMenu editor={editor} />
            <ListMenu editor={editor} />
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
            <TableMenu editor={editor} />
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
              onClick={() => editor.commands.setTextAlign("justify")}
              icon={<AlignJustify className="w-5 h-5" />}
              label="Justify"
              isActive={editor.isActive({ textAlign: "justify" })}
            />

            {/* Image Alignment Controls - Only show when an image is selected */}
            {isImageSelected() && (
              <div className="flex items-center ml-2 border-l pl-2 gap-1">
                <span className="text-xs text-muted-foreground mr-1 whitespace-nowrap">
                  Image:
                </span>
                <ToolbarButton
                  onClick={() => setImageAlignment("left")}
                  isActive={getImageAlignment() === "left"}
                  icon={<AlignLeft className="w-4 h-4" />}
                  label="Float Left"
                  className={
                    getImageAlignment() === "left" ? "bg-gray-200" : ""
                  }
                />
                <ToolbarButton
                  onClick={() => setImageAlignment("none")}
                  isActive={getImageAlignment() === "none"}
                  icon={<AlignCenter className="w-4 h-4" />}
                  label="Center"
                  className={
                    getImageAlignment() === "none" ? "bg-gray-200" : ""
                  }
                />
                <ToolbarButton
                  onClick={() => setImageAlignment("right")}
                  isActive={getImageAlignment() === "right"}
                  icon={<AlignRight className="w-4 h-4" />}
                  label="Float Right"
                  className={
                    getImageAlignment() === "right" ? "bg-gray-200" : ""
                  }
                />
              </div>
            )}
          </>
        )}
      </div>

      {isHtmlMode ? (
        <textarea
          id="tiptap-html-textarea"
          className="w-full min-h-[500px] p-4 font-mono text-sm focus:outline-none resize-none"
          value={formatHTML(htmlContent)}
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
        <div className="w-full overflow-x-auto">
          <EditorContent
            editor={editor}
            className="prose prose-slate max-w-full p-4 w-full"
            style={
              {
                "--tw-prose-pre-bg": "transparent",
                "--tw-prose-pre-border": "1px solid #e5e7eb",
                "--tw-prose-pre-padding": "1rem",
                "--tw-prose-pre-code-padding": "0",
                "--tw-prose-pre-code-bg": "transparent",
              } as React.CSSProperties
            }
          />
        </div>
      )}
    </div>
  );
};

export default TiptapEditor;
