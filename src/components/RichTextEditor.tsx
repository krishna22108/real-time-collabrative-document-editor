import React, { useCallback, useEffect, useState, useRef } from 'react';
import { useEditor, EditorContent, BubbleMenu, FloatingMenu } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import Highlight from '@tiptap/extension-highlight';
import Subscript from '@tiptap/extension-subscript';
import Superscript from '@tiptap/extension-superscript';
import TextStyle from '@tiptap/extension-text-style';
import FontFamily from '@tiptap/extension-font-family';
import Color from '@tiptap/extension-color';

import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import Table from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import Placeholder from '@tiptap/extension-placeholder';

const FontSize = require('@tiptap/extension-font-size').default;
import {
  Bold, Italic, Underline as UnderlineIcon, Strikethrough, Highlighter,
  AlignLeft, AlignCenter, AlignRight, AlignJustify,
  Link as LinkIcon, Image as ImageIcon, List, ListOrdered,
  Heading1, Heading2, Heading3, Quote, Code, Undo, Redo,
  IndentDecrease, IndentIncrease, Subscript as SubscriptIcon,
  Superscript as SuperscriptIcon, CheckSquare, Table as TableIcon,
  Minus, Palette, FolderDown, MoreHorizontal, Copy,
  RotateCcw, Search, X, ChevronDown, Trash2, TableCellsMerge,
  Columns as ColumnsIcon, Rows, Maximize2, Minimize2, FileText, Download,
  Printer, LayoutTemplate, Ruler, ArrowDownToLine, ZoomIn, ZoomOut,
  MoreVertical, XCircle, FileUp
} from 'lucide-react';
import { cn } from '../lib/utils';

const FONT_FAMILIES = [
  { name: 'Sans Serif', value: 'Inter, ui-sans-serif, system-ui' },
  { name: 'Serif', value: 'Georgia, serif' },
  { name: 'Monospace', value: 'Menlo, monospace' },
  { name: 'Arial', value: 'Arial, sans-serif' },
  { name: 'Times New Roman', value: 'Times New Roman, serif' },
  { name: 'Courier New', value: 'Courier New, monospace' },
];

const FONT_SIZES = [10, 11, 12, 14, 16, 18, 20, 22, 24, 26, 28, 32, 36, 42, 48, 54, 60, 72, 84, 96];
const TEXT_COLORS = [
  '#000000', '#434343', '#666666', '#999999', '#B7B7B7', '#CCCCCC', '#D9D9D9', '#EFEFEF',
  '#ED1C24', '#F26522', '#FFA300', '#8DC63F', '#00A0DC', '#2E3192', '#EC008C', '#7628B8',
  '#FFFFFF', '#FFF200', '#00FFFF', '#FF00FF',
];
const HIGHLIGHT_COLORS = [
  '#FFFF00', '#FF0', '#00FF00', '#0FF', '#00FFFF', '#FF00FF', '#F0F', '#C0C0C0',
];

const LINE_SPACING = [
  { label: '1.0', value: '1' },
  { label: '1.15', value: '1.15' },
  { label: '1.5', value: '1.5' },
  { label: '2.0', value: '2' },
  { label: '2.5', value: '2.5' },
  { label: '3.0', value: '3' },
];

const PAGE_SIZES = [
  { label: 'Letter (8.5" x 11")', value: 'letter', width: '8.5in', height: '11in' },
  { label: 'Legal (8.5" x 14")', value: 'legal', width: '8.5in', height: '14in' },
  { label: 'A4 (210mm x 297mm)', value: 'a4', width: '210mm', height: '297mm' },
  { label: 'A5 (148mm x 210mm)', value: 'a5', width: '148mm', height: '210mm' },
  { label: 'Executive (7.25" x 10.5")', value: 'executive', width: '7.25in', height: '10.5in' },
];

const MARGIN_PRESETS = [
  { label: 'Normal', top: '1in', bottom: '1in', left: '1in', right: '1in' },
  { label: 'Narrow', top: '0.5in', bottom: '0.5in', left: '0.5in', right: '0.5in' },
  { label: 'Moderate', top: '1in', bottom: '1in', left: '1.25in', right: '1.25in' },
  { label: 'Wide', top: '1in', bottom: '1in', left: '2in', right: '2in' },
  { label: 'Mirror', top: '1in', bottom: '1in', left: '1.25in', right: '1.25in' },
];

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
  editable?: boolean;
}

export default function RichTextEditor({
  content,
  onChange,
  placeholder = 'Start writing...',
  editable = true
}: RichTextEditorProps) {
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [showFontModal, setShowFontModal] = useState(false);
  const [showSizeModal, setShowSizeModal] = useState(false);
  const [showColorModal, setShowColorModal] = useState(false);
  const [showHighlightModal, setShowHighlightModal] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [replaceQuery, setReplaceQuery] = useState('');
  const [selectedFont, setSelectedFont] = useState('Inter, ui-sans-serif, system-ui');
  const [selectedSize, setSelectedSize] = useState(16);
  const [wordCount, setWordCount] = useState({ words: 0, chars: 0, charsNoSpaces: 0 });
  
  // Page layout states
  const [zoom, setZoom] = useState(100);
  const [showPageSetupModal, setShowPageSetupModal] = useState(false);
  const [pageSize, setPageSize] = useState('letter');
  const [pageOrientation, setPageOrientation] = useState<'portrait' | 'landscape'>('portrait');
  const [marginPreset, setMarginPreset] = useState('normal');
  const [customMargins, setCustomMargins] = useState({ top: '1in', bottom: '1in', left: '1in', right: '1in' });
  const [showLineSpacingModal, setShowLineSpacingModal] = useState(false);
  const [lineSpacing, setLineSpacing] = useState('1.5');
  const [showColumnsModal, setShowColumnsModal] = useState(false);
  const [columnCount, setColumnCount] = useState(1);
  const [showFindReplaceModal, setShowFindReplaceModal] = useState(false);
  const [findReplaceMode, setFindReplaceMode] = useState<'find' | 'replace'>('find');
  const [currentSearchIndex, setCurrentSearchIndex] = useState(0);
  const [searchMatches, setSearchMatches] = useState<number[]>([]);
  const [showZoomModal, setShowZoomModal] = useState(false);
  const [showPrintPreview, setShowPrintPreview] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
        bulletList: { keepMarks: true, keepAttributes: false },
        orderedList: { keepMarks: true, keepAttributes: false },
      }),
      Underline,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Link.configure({ openOnClick: false }),
      Image,
      Highlight.configure({ multicolor: true }),
      Subscript,
      Superscript,
      TextStyle,
      FontFamily,
      Color,
      TaskList,
      TaskItem.configure({ nested: true }),
      Table.configure({ resizable: true }),
      TableRow,
      TableCell,
      TableHeader,
      Placeholder.configure({ placeholder }),
      FontSize,
    ],
    content,
    editable,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
      updateWordCount(editor);
    },
  });

  const updateWordCount = useCallback((editorInstance: typeof editor) => {
    if (!editorInstance) return;
    const text = editorInstance.getText();
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    const chars = text.length;
    const charsNoSpaces = text.replace(/\s/g, '').length;
    setWordCount({ words, chars, charsNoSpaces });
  }, []);

  useEffect(() => {
    if (editor) {
      updateWordCount(editor);
    }
  }, [editor, updateWordCount]);

  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  const handleLinkSubmit = () => {
    if (linkUrl && editor) {
      editor.chain().focus().extendMarkRange('link').setLink({ href: linkUrl }).run();
      setLinkUrl('');
      setShowLinkModal(false);
    }
  };

  const handleImageSubmit = () => {
    if (imageUrl && editor) {
      editor.chain().focus().setImage({ src: imageUrl }).run();
      setImageUrl('');
      setShowImageModal(false);
    }
  };

  const handleFindReplaceOpen = () => {
    setShowFindReplaceModal(true);
    setFindReplaceMode('find');
    setSearchQuery('');
    setReplaceQuery('');
    setSearchMatches([]);
    setCurrentSearchIndex(0);
  };

  const insertTable = () => {
    editor?.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
  };

  const insertPageBreak = () => {
    if (!editor) return;
    editor.chain().focus().setHorizontalRule().run();
  };

  const setPageMargin = (position: 'top' | 'bottom' | 'left' | 'right', value: string) => {
    setCustomMargins(prev => ({ ...prev, [position]: value }));
  };

  const applyMarginPreset = (preset: typeof MARGIN_PRESETS[0]) => {
    setCustomMargins({ top: preset.top, bottom: preset.bottom, left: preset.left, right: preset.right });
    setMarginPreset(preset.label.toLowerCase());
  };

  const handleFindNext = () => {
    if (!editor || !searchQuery) return;
    const text = editor.getText();
    const regex = new RegExp(searchQuery, 'gi');
    const matches: number[] = [];
    let match;
    while ((match = regex.exec(text)) !== null) {
      matches.push(match.index);
    }
    setSearchMatches(matches);
    if (matches.length > 0) {
      const nextIndex = (currentSearchIndex + 1) % matches.length;
      setCurrentSearchIndex(nextIndex);
      editor.commands.setTextSelection({
        from: matches[nextIndex],
        to: matches[nextIndex] + searchQuery.length
      });
    }
  };

  const handleReplaceOne = () => {
    if (!editor || !searchQuery || !replaceQuery) return;
    const { from, to } = editor.state.selection;
    if (from !== to) {
      editor.chain().focus().deleteSelection().run();
    }
    editor.chain().focus().insertContent(replaceQuery).run();
    handleFindNext();
  };

  const handleReplaceAll = () => {
    if (!editor || !searchQuery || !replaceQuery) return;
    const text = editor.getText();
    const regex = new RegExp(searchQuery, 'gi');
    const newText = text.replace(regex, replaceQuery);
    editor.commands.setContent(newText);
  };

  const handlePrint = () => {
    const printContent = editor?.getHTML();
    if (!printContent) return;
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Print Document</title>
          <style>
            @page { margin: ${customMargins.top} ${customMargins.right} ${customMargins.bottom} ${customMargins.left}; }
            body { font-family: Arial, sans-serif; line-height: ${lineSpacing}; }
            .page-break { page-break-after: always; }
            table { border-collapse: collapse; width: 100%; }
            th, td { border: 1px solid #ddd; padding: 8px; }
            img { max-width: 100%; }
          </style>
        </head>
        <body>${printContent}</body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  const handleDownloadPDF = () => {
    handlePrint();
  };

  const handleDownload = (format: 'html' | 'markdown') => {
    if (!editor) return;
    
    let content: string;
    let filename: string;
    let mimeType: string;
    
    if (format === 'html') {
      content = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Document</title>
  <style>
    body { font-family: Arial, sans-serif; max-width: 800px; margin: 40px auto; padding: 20px; }
    table { border-collapse: collapse; width: 100%; }
    th, td { border: 1px solid #ddd; padding: 8px; }
    th { background: #f5f5f5; }
  </style>
</head>
<body>
${editor.getHTML()}
</body>
</html>`;
      filename = 'document.html';
      mimeType = 'text/html';
    } else {
      content = editor.getText();
      filename = 'document.md';
      mimeType = 'text/markdown';
    }
    
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!editor) return null;

  const MenuButton = ({ 
    onClick, 
    isActive, 
    disabled, 
    title, 
    children 
  }: { 
    onClick?: () => void; 
    isActive?: boolean; 
    disabled?: boolean; 
    title?: string; 
    children: React.ReactNode 
  }) => (
    <button
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={cn(
        "p-1.5 rounded transition-colors text-slate-600",
        isActive && "bg-primary/10 text-primary",
        !isActive && "hover:bg-slate-100",
        disabled && "opacity-30 cursor-not-allowed"
      )}
    >
      {children}
    </button>
  );



  const FontDropdown = () => (
    <div className="relative">
      <button
        onClick={() => setShowFontModal(!showFontModal)}
        className="flex items-center gap-1 px-2 py-1 text-xs hover:bg-slate-100 rounded transition-colors max-w-[120px]"
      >
        <span className="truncate" style={{ fontFamily: selectedFont }}>{FONT_FAMILIES.find(f => f.value === selectedFont)?.name || 'Sans Serif'}</span>
        <ChevronDown className="w-3 h-3 shrink-0" />
      </button>
      {showFontModal && (
        <div className="absolute top-full left-0 mt-1 w-40 bg-white border border-slate-200 rounded-lg shadow-xl z-50 max-h-60 overflow-y-auto">
          {FONT_FAMILIES.map(font => (
            <button
              key={font.value}
              onClick={() => {
                setSelectedFont(font.value);
                editor?.chain().focus().setFontFamily(font.value).run();
                setShowFontModal(false);
              }}
              style={{ fontFamily: font.value }}
              className={cn(
                "w-full px-3 py-1.5 text-left text-sm hover:bg-slate-100",
                selectedFont === font.value && "bg-primary/10 text-primary font-medium"
              )}
            >
              {font.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );

  const SizeDropdown = () => (
    <div className="relative">
      <button
        onClick={() => setShowSizeModal(!showSizeModal)}
        className="flex items-center gap-1 px-2 py-1 text-xs hover:bg-slate-100 rounded transition-colors"
      >
        <span className="w-6 text-center">{selectedSize}</span>
        <ChevronDown className="w-3 h-3" />
      </button>
      {showSizeModal && (
        <div className="absolute top-full left-0 mt-1 w-24 bg-white border border-slate-200 rounded-lg shadow-xl z-50 max-h-60 overflow-y-auto">
          {FONT_SIZES.map(size => (
            <button
              key={size}
              onClick={() => {
                setSelectedSize(size);
                editor?.chain().focus().updateAttributes('textStyle', { fontSize: `${size}px` }).run();
                setShowSizeModal(false);
              }}
              className={cn(
                "w-full px-3 py-1.5 text-left text-sm hover:bg-slate-100",
                selectedSize === size && "bg-primary/10 text-primary font-medium"
              )}
            >
              {size}
            </button>
          ))}
        </div>
      )}
    </div>
  );

  const ColorPicker = ({ type }: { type: 'text' | 'highlight' }) => {
    const isText = type === 'text';
    const colors = isText ? TEXT_COLORS : HIGHLIGHT_COLORS;
    const showModal = isText ? showColorModal : showHighlightModal;
    const setShowModal = isText ? setShowColorModal : setShowHighlightModal;
    const currentColor = isText 
      ? editor?.getAttributes('textStyle').color 
      : editor?.getAttributes('highlight').color;

    return (
      <div className="relative">
        <button
          onClick={() => setShowModal(!showModal)}
          className="flex items-center gap-1 px-2 py-1 text-xs hover:bg-slate-100 rounded transition-colors"
        >
          <Palette className="w-3.5 h-3.5" style={{ color: currentColor || '#000' }} />
          <ChevronDown className="w-3 h-3" />
        </button>
        {showModal && (
          <div className="absolute top-full left-0 mt-1 p-2 bg-white border border-slate-200 rounded-lg shadow-xl z-50">
            <div className="grid grid-cols-5 gap-1">
              <button
                onClick={() => {
                  if (isText) {
                    editor?.chain().focus().unsetColor().run();
                  } else {
                    editor?.chain().focus().unsetHighlight().run();
                  }
                  setShowModal(false);
                }}
                className="w-8 h-8 rounded border border-slate-200 flex items-center justify-center hover:bg-slate-100"
                title="Remove"
              >
                <X className="w-4 h-4" />
              </button>
              {colors.map((color, i) => (
                <button
                  key={i}
                  onClick={() => {
                    if (isText) {
                      editor?.chain().focus().setColor(color).run();
                    } else {
                      editor?.chain().focus().setHighlight({ color }).run();
                    }
                    setShowModal(false);
                  }}
                  className="w-8 h-8 rounded border border-slate-200 hover:scale-110 transition-transform"
                  style={{ 
                    backgroundColor: isText ? color : color === '#FFFF00' ? color : color,
                    opacity: isText ? 1 : 0.5
                  }}
                  title={color}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  const ToolbarSection = ({ children }: { children: React.ReactNode }) => (
    <div className="flex items-center gap-0.5">{children}</div>
  );

  const Divider = () => <div className="w-px h-5 bg-slate-200 mx-1" />;

  return (
    <div className="flex flex-col h-full">
      {/* Main Toolbar */}
      <div className="bg-white border-b border-slate-200 flex items-center gap-1 px-2 py-1 overflow-x-auto shrink-0 flex-wrap">
        <ToolbarSection>
          <MenuButton onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()} title="Undo (Ctrl+Z)">
            <Undo className="w-4 h-4" />
          </MenuButton>
          <MenuButton onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()} title="Redo (Ctrl+Y)">
            <Redo className="w-4 h-4" />
          </MenuButton>
        </ToolbarSection>

        <Divider />

        <ToolbarSection>
          <FontDropdown />
          <SizeDropdown />
        </ToolbarSection>

        <Divider />

        <ToolbarSection>
          <MenuButton onClick={() => editor.chain().focus().toggleBold().run()} isActive={editor.isActive('bold')} title="Bold (Ctrl+B)">
            <Bold className="w-4 h-4" />
          </MenuButton>
          <MenuButton onClick={() => editor.chain().focus().toggleItalic().run()} isActive={editor.isActive('italic')} title="Italic (Ctrl+I)">
            <Italic className="w-4 h-4" />
          </MenuButton>
          <MenuButton onClick={() => editor.chain().focus().toggleUnderline().run()} isActive={editor.isActive('underline')} title="Underline (Ctrl+U)">
            <UnderlineIcon className="w-4 h-4" />
          </MenuButton>
          <MenuButton onClick={() => editor.chain().focus().toggleStrike().run()} isActive={editor.isActive('strike')} title="Strikethrough">
            <Strikethrough className="w-4 h-4" />
          </MenuButton>
          <MenuButton onClick={() => editor.chain().focus().toggleHighlight().run()} isActive={editor.isActive('highlight')} title="Highlight">
            <Highlighter className="w-4 h-4" />
          </MenuButton>
        </ToolbarSection>

        <Divider />

        <ColorPicker type="text" />
        <ColorPicker type="highlight" />

        <Divider />

        <ToolbarSection>
          <MenuButton onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} isActive={editor.isActive('heading', { level: 1 })} title="Heading 1">
            <Heading1 className="w-4 h-4" />
          </MenuButton>
          <MenuButton onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} isActive={editor.isActive('heading', { level: 2 })} title="Heading 2">
            <Heading2 className="w-4 h-4" />
          </MenuButton>
          <MenuButton onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} isActive={editor.isActive('heading', { level: 3 })} title="Heading 3">
            <Heading3 className="w-4 h-4" />
          </MenuButton>
        </ToolbarSection>

        <Divider />

        <ToolbarSection>
          <MenuButton onClick={() => editor.chain().focus().toggleBulletList().run()} isActive={editor.isActive('bulletList')} title="Bullet List">
            <List className="w-4 h-4" />
          </MenuButton>
          <MenuButton onClick={() => editor.chain().focus().toggleOrderedList().run()} isActive={editor.isActive('orderedList')} title="Numbered List">
            <ListOrdered className="w-4 h-4" />
          </MenuButton>
          <MenuButton onClick={() => editor.chain().focus().toggleTaskList().run()} isActive={editor.isActive('taskList')} title="Task List">
            <CheckSquare className="w-4 h-4" />
          </MenuButton>
        </ToolbarSection>

        <Divider />

        <ToolbarSection>
          <MenuButton onClick={() => editor.chain().focus().setTextAlign('left').run()} isActive={editor.isActive({ textAlign: 'left' })} title="Align Left">
            <AlignLeft className="w-4 h-4" />
          </MenuButton>
          <MenuButton onClick={() => editor.chain().focus().setTextAlign('center').run()} isActive={editor.isActive({ textAlign: 'center' })} title="Align Center">
            <AlignCenter className="w-4 h-4" />
          </MenuButton>
          <MenuButton onClick={() => editor.chain().focus().setTextAlign('right').run()} isActive={editor.isActive({ textAlign: 'right' })} title="Align Right">
            <AlignRight className="w-4 h-4" />
          </MenuButton>
          <MenuButton onClick={() => editor.chain().focus().setTextAlign('justify').run()} isActive={editor.isActive({ textAlign: 'justify' })} title="Justify">
            <AlignJustify className="w-4 h-4" />
          </MenuButton>
        </ToolbarSection>

        <Divider />

        <ToolbarSection>
          <MenuButton onClick={() => editor.chain().focus().sinkListItem('listItem').run()} title="Indent">
            <IndentIncrease className="w-4 h-4" />
          </MenuButton>
          <MenuButton onClick={() => editor.chain().focus().liftListItem('listItem').run()} title="Outdent">
            <IndentDecrease className="w-4 h-4" />
          </MenuButton>
        </ToolbarSection>

        <Divider />

        <ToolbarSection>
          <MenuButton onClick={() => setShowLinkModal(true)} isActive={editor.isActive('link')} title="Insert Link (Ctrl+K)">
            <LinkIcon className="w-4 h-4" />
          </MenuButton>
          <MenuButton onClick={() => setShowImageModal(true)} title="Insert Image">
            <ImageIcon className="w-4 h-4" />
          </MenuButton>
        </ToolbarSection>

        <Divider />

        <ToolbarSection>
          <MenuButton onClick={() => editor.chain().focus().toggleBlockquote().run()} isActive={editor.isActive('blockquote')} title="Quote">
            <Quote className="w-4 h-4" />
          </MenuButton>
          <MenuButton onClick={() => editor.chain().focus().toggleCode().run()} isActive={editor.isActive('code')} title="Code">
            <Code className="w-4 h-4" />
          </MenuButton>
          <MenuButton onClick={() => editor.chain().focus().toggleSubscript().run()} isActive={editor.isActive('subscript')} title="Subscript">
            <SubscriptIcon className="w-4 h-4" />
          </MenuButton>
          <MenuButton onClick={() => editor.chain().focus().toggleSuperscript().run()} isActive={editor.isActive('superscript')} title="Superscript">
            <SuperscriptIcon className="w-4 h-4" />
          </MenuButton>
        </ToolbarSection>

        <Divider />

        <ToolbarSection>
          <MenuButton onClick={insertTable} title="Insert Table">
            <TableIcon className="w-4 h-4" />
          </MenuButton>
          <MenuButton onClick={() => editor.chain().focus().setHorizontalRule().run()} title="Horizontal Line">
            <Minus className="w-4 h-4" />
          </MenuButton>
        </ToolbarSection>

        <Divider />

        <ToolbarSection>
          <MenuButton onClick={() => setShowSearchModal(true)} title="Find & Replace (Ctrl+F)">
            <Search className="w-4 h-4" />
          </MenuButton>
          <MenuButton onClick={() => editor.chain().focus().clearNodes().unsetAllMarks().run()} title="Clear Formatting">
            <RotateCcw className="w-4 h-4" />
          </MenuButton>
        </ToolbarSection>

        <Divider />

        <ToolbarSection>
          <MenuButton onClick={() => setShowLineSpacingModal(true)} title="Line Spacing">
            <LayoutTemplate className="w-4 h-4" />
          </MenuButton>
          <MenuButton onClick={() => setShowColumnsModal(true)} title="Columns">
            <ColumnsIcon className="w-4 h-4" />
          </MenuButton>
        </ToolbarSection>

        <Divider />

        <ToolbarSection>
          <MenuButton onClick={() => setShowZoomModal(true)} title="Zoom">
            <Maximize2 className="w-4 h-4" />
          </MenuButton>
          <MenuButton onClick={handlePrint} title="Print (Ctrl+P)">
            <Printer className="w-4 h-4" />
          </MenuButton>
        </ToolbarSection>

        <Divider />

        <ToolbarSection>
          <MenuButton onClick={() => setShowPageSetupModal(true)} title="Page Setup">
            <FileText className="w-4 h-4" />
          </MenuButton>
        </ToolbarSection>

        <div className="ml-auto flex items-center gap-1">
          <span className="text-xs text-slate-500 px-2">{zoom}%</span>
          <MenuButton onClick={() => setZoom(Math.max(50, zoom - 10))} title="Zoom Out">
            <ZoomOut className="w-4 h-4" />
          </MenuButton>
          <MenuButton onClick={() => setZoom(Math.min(200, zoom + 10))} title="Zoom In">
            <ZoomIn className="w-4 h-4" />
          </MenuButton>
        </div>
      </div>

      {/* Editor Area */}
      <div className="flex-1 overflow-y-auto p-8 bg-slate-100 flex justify-center">
        <div 
          className="bg-white shadow-sm min-h-[1100px] relative ring-1 ring-slate-200"
          style={{
            width: pageOrientation === 'landscape' ? '11in' : '8.5in',
            maxWidth: '100%',
            paddingTop: customMargins.top,
            paddingBottom: customMargins.bottom,
            paddingLeft: customMargins.left,
            paddingRight: customMargins.right,
            transform: `scale(${zoom / 100})`,
            transformOrigin: 'top center',
          }}
        >
          <div className="px-16 md:px-24" style={{ lineHeight: lineSpacing }}>
            <EditorContent editor={editor} className="prose prose-lg max-w-none focus:outline-none" />
          </div>
        </div>
      </div>

      {/* Bubble Menu */}
      {editor && (
        <BubbleMenu 
          editor={editor} 
          tippyOptions={{ duration: 100 }}
          className="bg-white border border-slate-200 rounded-lg shadow-xl flex items-center gap-0.5 p-1"
        >
          <MenuButton onClick={() => editor.chain().focus().toggleBold().run()} isActive={editor.isActive('bold')} title="Bold">
            <Bold className="w-4 h-4" />
          </MenuButton>
          <MenuButton onClick={() => editor.chain().focus().toggleItalic().run()} isActive={editor.isActive('italic')} title="Italic">
            <Italic className="w-4 h-4" />
          </MenuButton>
          <MenuButton onClick={() => editor.chain().focus().toggleUnderline().run()} isActive={editor.isActive('underline')} title="Underline">
            <UnderlineIcon className="w-4 h-4" />
          </MenuButton>
          <MenuButton onClick={() => setShowLinkModal(true)} isActive={editor.isActive('link')} title="Link">
            <LinkIcon className="w-4 h-4" />
          </MenuButton>
        </BubbleMenu>
      )}

      {/* Floating Menu */}
      {editor && (
        <FloatingMenu 
          editor={editor}
          tippyOptions={{ duration: 100 }}
          className="bg-white border border-slate-200 rounded-lg shadow-xl flex items-center gap-0.5 p-1"
        >
          <MenuButton onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} isActive={editor.isActive('heading', { level: 1 })} title="Heading 1">
            <Heading1 className="w-4 h-4" />
          </MenuButton>
          <MenuButton onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} isActive={editor.isActive('heading', { level: 2 })} title="Heading 2">
            <Heading2 className="w-4 h-4" />
          </MenuButton>
          <MenuButton onClick={() => editor.chain().focus().toggleBulletList().run()} isActive={editor.isActive('bulletList')} title="Bullet List">
            <List className="w-4 h-4" />
          </MenuButton>
          <MenuButton onClick={() => editor.chain().focus().toggleBlockquote().run()} isActive={editor.isActive('blockquote')} title="Quote">
            <Quote className="w-4 h-4" />
          </MenuButton>
        </FloatingMenu>
      )}

      {/* Link Modal */}
      {showLinkModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowLinkModal(false)}>
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-2xl" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-slate-900 mb-4">Insert Link</h3>
            <input
              type="url"
              placeholder="Enter URL"
              value={linkUrl}
              onChange={e => setLinkUrl(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary"
              autoFocus
            />
            <div className="flex gap-2 mt-4">
              <button
                onClick={handleLinkSubmit}
                className="flex-1 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary/90"
              >
                Insert
              </button>
              <button
                onClick={() => setShowLinkModal(false)}
                className="flex-1 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Image Modal */}
      {showImageModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowImageModal(false)}>
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-2xl" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-slate-900 mb-4">Insert Image</h3>
            <input
              type="url"
              placeholder="Enter image URL"
              value={imageUrl}
              onChange={e => setImageUrl(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary"
              autoFocus
            />
            <div className="flex gap-2 mt-4">
              <button
                onClick={handleImageSubmit}
                className="flex-1 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary/90"
              >
                Insert
              </button>
              <button
                onClick={() => setShowImageModal(false)}
                className="flex-1 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Search & Replace Modal */}
      {showSearchModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowSearchModal(false)}>
          <div className="bg-white rounded-xl p-6 w-full max-w-lg shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-slate-900">Find & Replace</h3>
              <button onClick={() => setShowSearchModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Find"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary"
                autoFocus
              />
              <input
                type="text"
                placeholder="Replace with"
                value={replaceQuery}
                onChange={e => setReplaceQuery(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary"
              />
              {searchMatches.length > 0 && (
                <p className="text-xs text-slate-500">{currentSearchIndex + 1} of {searchMatches.length} matches</p>
              )}
            </div>
            <div className="flex gap-2 mt-4">
              <button
                onClick={handleFindNext}
                disabled={!searchQuery}
                className="flex-1 py-2 bg-slate-100 text-slate-700 rounded-lg font-medium hover:bg-slate-200 disabled:opacity-50"
              >
                Find Next
              </button>
              <button
                onClick={handleReplaceOne}
                disabled={!searchQuery || !replaceQuery}
                className="flex-1 py-2 bg-slate-100 text-slate-700 rounded-lg font-medium hover:bg-slate-200 disabled:opacity-50"
              >
                Replace
              </button>
              <button
                onClick={handleReplaceAll}
                disabled={!searchQuery || !replaceQuery}
                className="flex-1 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 disabled:opacity-50"
              >
                Replace All
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Page Setup Modal */}
      {showPageSetupModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowPageSetupModal(false)}>
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-slate-900">Page Setup</h3>
              <button onClick={() => setShowPageSetupModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Paper Size</label>
                <select
                  value={pageSize}
                  onChange={e => setPageSize(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary"
                >
                  {PAGE_SIZES.map(size => (
                    <option key={size.value} value={size.value}>{size.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Orientation</label>
                <div className="flex gap-2">
                  <button
                    onClick={() => setPageOrientation('portrait')}
                    className={`flex-1 py-2 rounded-lg border font-medium ${pageOrientation === 'portrait' ? 'bg-primary text-white border-primary' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                  >
                    Portrait
                  </button>
                  <button
                    onClick={() => setPageOrientation('landscape')}
                    className={`flex-1 py-2 rounded-lg border font-medium ${pageOrientation === 'landscape' ? 'bg-primary text-white border-primary' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                  >
                    Landscape
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Margins</label>
                <div className="grid grid-cols-2 gap-2 mb-2">
                  {MARGIN_PRESETS.map(preset => (
                    <button
                      key={preset.label}
                      onClick={() => applyMarginPreset(preset)}
                      className={`py-1.5 px-2 text-sm rounded-lg border ${marginPreset === preset.label.toLowerCase() ? 'bg-primary/10 border-primary text-primary' : 'border-slate-200 hover:bg-slate-50'}`}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-xs text-slate-500">Top</label>
                    <input
                      type="text"
                      value={customMargins.top}
                      onChange={e => setPageMargin('top', e.target.value)}
                      className="w-full px-2 py-1 text-sm border border-slate-200 rounded"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-500">Bottom</label>
                    <input
                      type="text"
                      value={customMargins.bottom}
                      onChange={e => setPageMargin('bottom', e.target.value)}
                      className="w-full px-2 py-1 text-sm border border-slate-200 rounded"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-500">Left</label>
                    <input
                      type="text"
                      value={customMargins.left}
                      onChange={e => setPageMargin('left', e.target.value)}
                      className="w-full px-2 py-1 text-sm border border-slate-200 rounded"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-500">Right</label>
                    <input
                      type="text"
                      value={customMargins.right}
                      onChange={e => setPageMargin('right', e.target.value)}
                      className="w-full px-2 py-1 text-sm border border-slate-200 rounded"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="flex gap-2 mt-6">
              <button
                onClick={() => setShowPageSetupModal(false)}
                className="flex-1 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary/90"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Line Spacing Modal */}
      {showLineSpacingModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowLineSpacingModal(false)}>
          <div className="bg-white rounded-xl p-6 w-full max-w-xs shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-slate-900">Line Spacing</h3>
              <button onClick={() => setShowLineSpacingModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-1">
              {LINE_SPACING.map(spacing => (
                <button
                  key={spacing.value}
                  onClick={() => {
                    setLineSpacing(spacing.value);
                    document.documentElement.style.setProperty('--editor-line-height', spacing.value);
                    setShowLineSpacingModal(false);
                  }}
                  className={`w-full py-2 px-3 text-left rounded-lg ${lineSpacing === spacing.value ? 'bg-primary/10 text-primary font-medium' : 'hover:bg-slate-50'}`}
                >
                  {spacing.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Columns Modal */}
      {showColumnsModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowColumnsModal(false)}>
          <div className="bg-white rounded-xl p-6 w-full max-w-xs shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-slate-900">Columns</h3>
              <button onClick={() => setShowColumnsModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-1">
              {[1, 2, 3].map(num => (
                <button
                  key={num}
                  onClick={() => {
                    setColumnCount(num);
                    setShowColumnsModal(false);
                  }}
                  className={`w-full py-2 px-3 text-left rounded-lg ${columnCount === num ? 'bg-primary/10 text-primary font-medium' : 'hover:bg-slate-50'}`}
                >
                  {num} {num === 1 ? 'Column' : 'Columns'}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Zoom Modal */}
      {showZoomModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowZoomModal(false)}>
          <div className="bg-white rounded-xl p-6 w-full max-w-xs shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-slate-900">Zoom</h3>
              <button onClick={() => setShowZoomModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex items-center justify-between mb-4">
              <button onClick={() => setZoom(Math.max(50, zoom - 10))} className="p-2 hover:bg-slate-100 rounded">
                <ZoomOut className="w-5 h-5" />
              </button>
              <span className="text-lg font-medium">{zoom}%</span>
              <button onClick={() => setZoom(Math.min(200, zoom + 10))} className="p-2 hover:bg-slate-100 rounded">
                <ZoomIn className="w-5 h-5" />
              </button>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {[50, 75, 100, 125, 150, 200].map(z => (
                <button
                  key={z}
                  onClick={() => {
                    setZoom(z);
                    setShowZoomModal(false);
                  }}
                  className={`py-2 rounded-lg text-sm ${zoom === z ? 'bg-primary text-white' : 'bg-slate-100 hover:bg-slate-200'}`}
                >
                  {z}%
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Footer Status Bar */}
      <div className="h-8 bg-white border-t border-slate-200 px-4 flex items-center justify-between text-xs text-slate-500 shrink-0">
        <div className="flex items-center gap-4">
          <span>{wordCount.words} words</span>
          <span>{wordCount.chars} characters</span>
          <span>{wordCount.charsNoSpaces} characters (excluding spaces)</span>
        </div>
        <div className="flex items-center gap-2">
          <span>Page 1</span>
          <span className="text-slate-300">|</span>
          <span>{PAGE_SIZES.find(p => p.value === pageSize)?.label.split(' ')[0] || 'Letter'}</span>
          <span className="text-slate-300">|</span>
          <span>{pageOrientation === 'portrait' ? 'Portrait' : 'Landscape'}</span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={handleDownloadPDF}
            className="px-2 py-1 hover:bg-slate-100 rounded flex items-center gap-1"
            title="Print / Export to PDF"
          >
            <Printer className="w-3 h-3" />
            <span>Print</span>
          </button>
          <button
            onClick={() => handleDownload('html')}
            className="px-2 py-1 hover:bg-slate-100 rounded flex items-center gap-1"
            title="Download as HTML"
          >
            <FolderDown className="w-3 h-3" />
            <span>HTML</span>
          </button>
        </div>
      </div>
    </div>
  );
}