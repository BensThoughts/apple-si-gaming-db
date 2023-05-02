import { useCallback, useEffect, useMemo, useState } from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { ClearEditorPlugin } from '@lexical/react/LexicalClearEditorPlugin';
import {
  $getSelection,
  $isRangeSelection,
  $createParagraphNode,
  CLEAR_EDITOR_COMMAND,
  FORMAT_TEXT_COMMAND,
} from 'lexical';
import { DeleteIcon } from '~/components/Icons/FeatherIcons';
import { IconButton } from '../LexicalIconButton';
import {
  $isListNode,
  $createListNode,
  ListNode,
} from '@lexical/list';
import { $getNearestNodeOfType } from '@lexical/utils';
import { $createHeadingNode, $isHeadingNode } from '@lexical/rich-text';
import { $setBlocksType } from '@lexical/selection';

// type ToolbarProps = {
//   editor: LexicalEditor;
//   isBold: boolean;
//   isItalic: boolean;
//   isStrikethrough: boolean;
//   isUnderline: boolean;
// };

export function ToolbarPlugin() {
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [isStrikethrough, setIsStrikethrough] = useState(false);
  const [blockType, setBlockType] = useState('paragraph');
  // const [selectedElementKey, setSelectedElementKey] = useState<string | null>(null);

  const [editor] = useLexicalComposerContext();

  const updateToolbar = useCallback(() => {
    editor.getEditorState().read(() => {
      if (editor.isComposing()) return;
      const selection = $getSelection();

      if ($isRangeSelection(selection)) {
        // const nodes = selection.getNodes();
        const anchorNode = selection.anchor.getNode();
        const element = anchorNode.getKey() === 'root'
          ? anchorNode
          : anchorNode.getTopLevelElementOrThrow();
        const elementKey = element.getKey();
        const elementDom = editor.getElementByKey(elementKey);
        if (elementDom != null) {
          // setSelectedElementKey(elementKey);
          if ($isListNode(element)) {
            const parentList = $getNearestNodeOfType(anchorNode, ListNode);
            const type = parentList ? parentList.getTag() : element.getTag();
            setBlockType(type);
          } else {
            const type = $isHeadingNode(element)
              ? element.getTag()
              : element.getType();
            setBlockType(type);
          }
        }
        setIsBold(selection.hasFormat('bold'));
        setIsItalic(selection.hasFormat('italic'));
        setIsUnderline(selection.hasFormat('underline'));
        setIsStrikethrough(selection.hasFormat('strikethrough'));
      }
    });
  }, [editor]);

  const formatList = (listType: 'ul' | 'ol') => {
    if (blockType !== listType) {
      editor.update(() => {
        const selection = $getSelection();

        if ($isRangeSelection(selection)) {
          $setBlocksType(selection, () => $createListNode(listType === 'ul' ? 'bullet' : 'number'));
        }
      });
    } else {
      editor.update(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          $setBlocksType(selection, () => $createParagraphNode());
        }
      });
    }
  };


  const formatHeadingOne = () => {
    if (blockType !== 'h1') {
      editor.update(() => {
        const selection = $getSelection();

        if ($isRangeSelection(selection)) {
          $setBlocksType(selection, () => $createHeadingNode('h1'));
        }
      });
    } else {
      editor.update(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          $setBlocksType(selection, () => $createParagraphNode());
        }
      });
    }
  };

  const formatHeadingTwo = () => {
    if (blockType !== 'h2') {
      editor.update(() => {
        const selection = $getSelection();

        if ($isRangeSelection(selection)) {
          $setBlocksType(selection, () => $createHeadingNode('h2'));
        }
      });
      // return;
    } else {
      editor.update(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          $setBlocksType(selection, () => $createParagraphNode());
        }
      });
    }
    // setShowBlockOptionsDropDown(false);
  };

  // Needed to show correct state for active formatting state.
  useEffect(() => {
    return editor.registerUpdateListener(() => {
      updateToolbar();
    });
  });

  const MandatoryPlugins = useMemo(() => {
    return <ClearEditorPlugin />;
  }, []);

  return (
    <>
      {MandatoryPlugins}
      <div
        className="flex items-center flex-wrap justify-between bg-tertiary-highlight
                   rounded-t-md rounded-b-none border-b-1 border-b-gray p-2 gap-1"
      >
        <div className="flex items-center gap-2">
          <IconButton
            icon="bold"
            aria-label="format text as bold"
            active={isBold}
            onClick={() => {
              editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold');
            }}
          />
          <IconButton
            icon="italic"
            aria-label="format text as italic"
            active={isItalic}
            onClick={() => {
              editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic');
            }}
          />
          <IconButton
            icon="underline"
            aria-label="format text as underline"
            active={isUnderline}
            onClick={() => {
              editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'underline');
            }}
          />
          <IconButton
            icon="strike"
            aria-label="format text as strikethrough"
            active={isStrikethrough}
            onClick={() => {
              editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'strikethrough');
            }}
          />
          <IconButton
            icon="headingOne"
            aria-label="format block as heading 1"
            active={blockType === 'h1'}
            onClick={formatHeadingOne}
          />
          <IconButton
            icon="headingTwo"
            aria-label="format block as heading 2"
            active={blockType === 'h2'}
            onClick={formatHeadingTwo}
          />
          <IconButton
            icon="list"
            aria-label="format block as unordered list"
            active={blockType === 'ul'}
            onClick={() => formatList('ul')}
          />
          <IconButton
            icon="listOrdered"
            aria-label="format block as ordered list"
            active={blockType === 'ol'}
            onClick={() => formatList('ol')}
          />
        </div>
        <IconButton
          icon="clear"
          className="hidden lg:block"
          onClick={() => {
            editor.dispatchCommand(CLEAR_EDITOR_COMMAND, undefined);
          }}
        >
          <DeleteIcon />
        </IconButton>

      </div>
    </>
  );
}
