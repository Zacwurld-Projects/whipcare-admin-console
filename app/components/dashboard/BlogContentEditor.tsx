"use client";

import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import TextAlign from "@tiptap/extension-text-align";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useEffect, useRef } from "react";

type BlogContentEditorProps = {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
};

function ToolbarButton({
  label,
  active,
  onClick,
  children,
}: {
  label: string;
  active?: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      aria-pressed={active}
      className={`flex h-8 w-8 items-center justify-center rounded-md transition-colors ${
        active
          ? "bg-[#FDF3F0] text-[#711E00]"
          : "text-[#4B5563] hover:bg-[#F3F4F6]"
      }`}
    >
      {children}
    </button>
  );
}

export function BlogContentEditor({
  value,
  onChange,
  placeholder = "Enter your content here",
}: BlogContentEditorProps) {
  const imageInputRef = useRef<HTMLInputElement>(null);
  const lastEmitted = useRef(value);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: false,
        link: {
          openOnClick: false,
          HTMLAttributes: {
            class: "text-primary underline",
          },
        },
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Image.configure({
        HTMLAttributes: {
          class: "max-h-[32rem] w-full max-w-full rounded-lg object-contain",
        },
      }),
      Placeholder.configure({
        placeholder,
      }),
    ],
    content: value || "",
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class:
          "min-h-[140px] px-3 py-3 text-sm text-[#1E2939] outline-none prose prose-sm max-w-none [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_p]:my-1",
      },
    },
    onUpdate: ({ editor: current }) => {
      const html = current.getHTML();
      lastEmitted.current = html;
      onChange(html === "<p></p>" ? "" : html);
    },
  });

  useEffect(() => {
    if (!editor) return;
    if (value === lastEmitted.current) return;
    const current = editor.getHTML();
    if (value === current || (value === "" && current === "<p></p>")) return;
    editor.commands.setContent(value || "", { emitUpdate: false });
    lastEmitted.current = value;
  }, [editor, value]);

  if (!editor) {
    return (
      <div className="min-h-[188px] animate-pulse rounded-xl border border-[#E5E7EB] bg-[#F9FAFB]" />
    );
  }

  function insertImage(file: File | null) {
    if (!file || !editor) return;
    const url = URL.createObjectURL(file);
    editor.chain().focus().setImage({ src: url, alt: file.name }).run();
  }

  function insertLink() {
    if (!editor) return;
    const previous = editor.getAttributes("link").href as string | undefined;
    const url = window.prompt("Enter URL", previous ?? "https://");
    if (url === null) return;
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  }

  return (
    <div className="overflow-hidden rounded-xl border border-[#E5E7EB]">
      <div className="flex flex-wrap items-center gap-0.5 border-b border-[#E5E7EB] bg-[#F9FAFB] px-2 py-1.5">
        <ToolbarButton
          label="Bold"
          active={editor.isActive("bold")}
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          <span className="text-sm font-bold">B</span>
        </ToolbarButton>
        <ToolbarButton
          label="Italic"
          active={editor.isActive("italic")}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          <span className="text-sm italic">I</span>
        </ToolbarButton>
        <ToolbarButton
          label="Underline"
          active={editor.isActive("underline")}
          onClick={() => editor.chain().focus().toggleUnderline().run()}
        >
          <span className="text-sm underline">U</span>
        </ToolbarButton>
        <ToolbarButton
          label="Bulleted list"
          active={editor.isActive("bulletList")}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <circle cx="3" cy="4" r="1" fill="currentColor" />
            <circle cx="3" cy="8" r="1" fill="currentColor" />
            <circle cx="3" cy="12" r="1" fill="currentColor" />
            <path d="M6 4h8M6 8h8M6 12h8" stroke="currentColor" strokeWidth="1.4" />
          </svg>
        </ToolbarButton>
        <ToolbarButton
          label="Numbered list"
          active={editor.isActive("orderedList")}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path
              d="M3 3.5h1v3M3.5 12.5h1.5M2.5 10.5h1.2c.7 0 1.3.4 1.3 1s-.6 1-1.3 1"
              stroke="currentColor"
              strokeWidth="1.2"
              strokeLinecap="round"
            />
            <path d="M6 4h8M6 8h8M6 12h8" stroke="currentColor" strokeWidth="1.4" />
          </svg>
        </ToolbarButton>
        <ToolbarButton
          label="Align left"
          active={editor.isActive({ textAlign: "left" })}
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M2 4h12M2 8h8M2 12h10" stroke="currentColor" strokeWidth="1.4" />
          </svg>
        </ToolbarButton>
        <ToolbarButton
          label="Align center"
          active={editor.isActive({ textAlign: "center" })}
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M2 4h12M4 8h8M3 12h10" stroke="currentColor" strokeWidth="1.4" />
          </svg>
        </ToolbarButton>
        <ToolbarButton
          label="Align right"
          active={editor.isActive({ textAlign: "right" })}
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M2 4h12M6 8h8M4 12h10" stroke="currentColor" strokeWidth="1.4" />
          </svg>
        </ToolbarButton>
        <ToolbarButton label="Insert link" active={editor.isActive("link")} onClick={insertLink}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path
              d="M6.5 9.5l3-3M7 11.5l-.7.7a2.5 2.5 0 01-3.5-3.5l.7-.7M9 4.5l.7-.7a2.5 2.5 0 013.5 3.5l-.7.7"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinecap="round"
            />
          </svg>
        </ToolbarButton>
        <ToolbarButton label="Insert image" onClick={() => imageInputRef.current?.click()}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <rect
              x="2"
              y="3"
              width="12"
              height="10"
              rx="1.5"
              stroke="currentColor"
              strokeWidth="1.4"
            />
            <circle cx="5.5" cy="6.5" r="1" fill="currentColor" />
            <path
              d="M2.5 11.5l3.5-3.5 2.5 2.5 2-2 3 3"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinejoin="round"
            />
          </svg>
        </ToolbarButton>
        <input
          ref={imageInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            insertImage(e.target.files?.[0] ?? null);
            e.target.value = "";
          }}
        />
      </div>

      <EditorContent editor={editor} />
    </div>
  );
}
