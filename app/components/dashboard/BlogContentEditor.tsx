"use client";

import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import TextAlign from "@tiptap/extension-text-align";
import {
  Color,
  FontFamily,
  FontSize,
  TextStyle,
} from "@tiptap/extension-text-style";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useEffect, useRef, useState } from "react";

type BlogContentEditorProps = {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
};

const FONT_OPTIONS = [
  { label: "Default", value: "" },
  { label: "Arial", value: "Arial" },
  { label: "Helvetica", value: "Helvetica" },
  { label: "Georgia", value: "Georgia" },
  { label: "Times New Roman", value: "Times New Roman" },
  { label: "Verdana", value: "Verdana" },
  { label: "Tahoma", value: "Tahoma" },
  { label: "Trebuchet MS", value: "Trebuchet MS" },
  { label: "Courier New", value: "Courier New" },
  { label: "Palatino", value: "Palatino Linotype" },
  { label: "Garamond", value: "Garamond" },
  { label: "Comic Sans", value: "Comic Sans MS" },
] as const;

const FONT_SIZE_OPTIONS = [
  "12px",
  "14px",
  "16px",
  "18px",
  "20px",
  "24px",
  "28px",
  "32px",
] as const;

const COLOR_PRESETS = [
  "#1E2939",
  "#667085",
  "#711E00",
  "#FE915D",
  "#B42318",
  "#027A48",
  "#175CD3",
  "#7A5AF8",
  "#FFFFFF",
  "#000000",
] as const;

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

function ToolbarSelect({
  label,
  value,
  onChange,
  children,
  className = "",
  showLabel = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  children: React.ReactNode;
  className?: string;
  showLabel?: boolean;
}) {
  return (
    <label className={`inline-flex items-center gap-1 ${className}`}>
      {showLabel ? (
        <span className="whitespace-nowrap text-[11px] font-medium text-[#6A7282]">{label}</span>
      ) : (
        <span className="sr-only">{label}</span>
      )}
      <span className="relative inline-flex items-center">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-8 min-w-[7.5rem] max-w-[11rem] appearance-none rounded-md border border-[#E5E7EB] bg-white py-1 pl-2 pr-6 text-xs text-[#1E2939] outline-none focus:border-[#FE915D]"
        >
          {children}
        </select>
        <svg
          className="pointer-events-none absolute right-1.5 text-[#6A7282]"
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
          aria-hidden
        >
          <path
            d="M3 4.5L6 7.5L9 4.5"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
    </label>
  );
}

export function BlogContentEditor({
  value,
  onChange,
  placeholder = "Enter your content here",
}: BlogContentEditorProps) {
  const imageInputRef = useRef<HTMLInputElement>(null);
  const lastEmitted = useRef(value);
  const [, setToolbarTick] = useState(0);

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
      TextStyle,
      Color,
      FontFamily,
      FontSize,
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

  useEffect(() => {
    if (!editor) return;
    const refreshToolbar = () => setToolbarTick((tick) => tick + 1);
    editor.on("selectionUpdate", refreshToolbar);
    editor.on("transaction", refreshToolbar);
    return () => {
      editor.off("selectionUpdate", refreshToolbar);
      editor.off("transaction", refreshToolbar);
    };
  }, [editor]);

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

  const currentFontRaw =
    (editor.getAttributes("textStyle").fontFamily as string | undefined) ?? "";
  const currentFont =
    FONT_OPTIONS.find(
      (font) =>
        font.value &&
        currentFontRaw.replace(/['"]/g, "").toLowerCase().includes(font.value.toLowerCase()),
    )?.value ?? "";
  const currentSize =
    (editor.getAttributes("textStyle").fontSize as string | undefined) ?? "";
  const currentColor =
    (editor.getAttributes("textStyle").color as string | undefined) ?? "#1E2939";

  const sizeIndex = FONT_SIZE_OPTIONS.findIndex((size) => size === currentSize);
  const effectiveSizeIndex = sizeIndex >= 0 ? sizeIndex : 2;

  function bumpFontSize(delta: number) {
    if (!editor) return;
    const nextIndex = Math.min(
      FONT_SIZE_OPTIONS.length - 1,
      Math.max(0, effectiveSizeIndex + delta),
    );
    editor.chain().focus().setFontSize(FONT_SIZE_OPTIONS[nextIndex]).run();
  }

  return (
    <div className="overflow-hidden rounded-xl border border-[#E5E7EB]">
      <div className="flex flex-wrap items-center gap-1 border-b border-[#E5E7EB] bg-[#F9FAFB] px-2 py-1.5">
        <ToolbarSelect
          label="Font"
          showLabel
          value={currentFont}
          onChange={(next) => {
            if (!next) {
              editor.chain().focus().unsetFontFamily().run();
              return;
            }
            editor.chain().focus().setFontFamily(next).run();
          }}
          className="mr-1"
        >
          {FONT_OPTIONS.map((font) => (
            <option key={font.label} value={font.value} style={{ fontFamily: font.value || undefined }}>
              {font.label}
            </option>
          ))}
        </ToolbarSelect>

        <ToolbarSelect
          label="Size"
          showLabel
          value={currentSize || "16px"}
          onChange={(next) => {
            editor.chain().focus().setFontSize(next).run();
          }}
          className="mr-0.5"
        >
          {FONT_SIZE_OPTIONS.map((size) => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </ToolbarSelect>

        <ToolbarButton label="Decrease text size" onClick={() => bumpFontSize(-1)}>
          <span className="text-xs font-semibold">A−</span>
        </ToolbarButton>
        <ToolbarButton label="Increase text size" onClick={() => bumpFontSize(1)}>
          <span className="text-sm font-semibold">A+</span>
        </ToolbarButton>

        <div className="mx-1 flex items-center gap-1">
          <label className="relative flex h-8 w-8 cursor-pointer items-center justify-center rounded-md hover:bg-[#F3F4F6]">
            <span className="sr-only">Text color</span>
            <span className="flex flex-col items-center leading-none">
              <span className="text-sm font-semibold text-[#1E2939]">A</span>
              <span
                className="mt-0.5 h-1 w-4 rounded-sm border border-[#E5E7EB]"
                style={{ backgroundColor: currentColor }}
              />
            </span>
            <input
              type="color"
              value={/^#[0-9A-Fa-f]{6}$/.test(currentColor) ? currentColor : "#1E2939"}
              onChange={(e) => editor.chain().focus().setColor(e.target.value).run()}
              className="absolute inset-0 cursor-pointer opacity-0"
            />
          </label>
          <div className="hidden items-center gap-0.5 sm:flex">
            {COLOR_PRESETS.map((color) => (
              <button
                key={color}
                type="button"
                aria-label={`Set color ${color}`}
                onClick={() => editor.chain().focus().setColor(color).run()}
                className={`h-4 w-4 rounded-full border ${
                  currentColor.toLowerCase() === color.toLowerCase()
                    ? "border-[#711E00] ring-1 ring-[#711E00]"
                    : "border-[#E5E7EB]"
                }`}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
          <ToolbarButton
            label="Reset text color"
            onClick={() => editor.chain().focus().unsetColor().run()}
          >
            <span className="text-[10px] font-semibold">✕</span>
          </ToolbarButton>
        </div>

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
