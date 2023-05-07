import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $getSelection, $isRangeSelection, FORMAT_TEXT_COMMAND } from 'lexical';
import type { LexicalEditor } from 'lexical';
import { useCallback, useEffect, useRef, useState } from 'react';
import { IconButton } from '../LexicalIconButton';

const supportedBlockTypes = new Set([
  'paragraph',
  'quote',
  'h1',
  'h2',
  'ul',
  'ol',
]);

const blockTypeToBlockName = {
  paragraph: 'Normal',
  quote: 'Quote',
  h1: 'Large Heading',
  h2: 'Small Heading',
  h3: 'Heading',
  h4: 'Heading',
  h5: 'Heading',
  ul: 'Bulleted List',
  ol: 'Numbered List',
};

type ToolbarProps = {
  editor: LexicalEditor;
  isBold: boolean;
  isItalic: boolean;
  isStrikethrough: boolean;
  isUnderline: boolean;
};

function Toolbar({ ...props }: ToolbarProps) {
  const ref = useRef<HTMLDivElement>(null);

  return (
    <div
      className="flex items-center justify-between bg-tertiary-highlight border-b-1 border-t-0 border-x-0 border-secondary-highlight rounded-b-md p-1 gap-1"
    >
      <IconButton
        icon="bold"
        aria-label="format text as bold"
        active={props.isBold}
        onClick={() => {
          props.editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold');
        }}
      />

    </div>
  );
}

export function ToolbarPlugin() {
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [isStrikethrough, setIsStrikethrough] = useState(false);

  const [editor] = useLexicalComposerContext();

  const updateToolbar = useCallback(() => {
    editor.getEditorState().read(() => {
      if (editor.isComposing()) return;
      const selection = $getSelection();

      if ($isRangeSelection(selection)) {
        const nodes = selection.getNodes();
        setIsBold(selection.hasFormat('bold'));
        setIsItalic(selection.hasFormat('italic'));
        setIsUnderline(selection.hasFormat('underline'));
        setIsStrikethrough(selection.hasFormat('strikethrough'));
      }
    });
  }, [editor]);

  // Needed to show correct state for active formatting state.
  useEffect(() => {
    return editor.registerUpdateListener(() => {
      updateToolbar();
    });
  });

  return (
    <Toolbar
      editor={editor}
      isBold={isBold}
      isItalic={isItalic}
      isUnderline={isUnderline}
      isStrikethrough={isStrikethrough}
    />
  );
}
