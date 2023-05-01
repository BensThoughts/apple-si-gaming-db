import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import LexicalErrorBoundary from '@lexical/react/LexicalErrorBoundary';
import { ListNode, ListItemNode } from '@lexical/list';
import { LinkNode } from '@lexical/link';
import { CodeNode } from '@lexical/code';
import { HeadingNode, QuoteNode } from '@lexical/rich-text';
import { TRANSFORMERS } from '@lexical/markdown';
import { MarkdownShortcutPlugin } from '@lexical/react/LexicalMarkdownShortcutPlugin';
import { classNames } from '~/lib/css/classNames';
// import { LocalStoragePlugin } from './LocalStoragePlugin';
import { useEffect, useState, useMemo } from 'react';
import { ToolbarPlugin } from './Plugins/ToolbarPlugin';
import { $generateHtmlFromNodes } from '@lexical/html';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { LocalStoragePlugin } from './Plugins/LocalStoragePlugin';

const EDITOR_NODES = [
  CodeNode,
  HeadingNode,
  LinkNode,
  ListNode,
  ListItemNode,
  QuoteNode,
];

type LexicalEditorProps = {
  config: Parameters<typeof LexicalComposer>['0']['initialConfig'];
};

export function LexicalEditor(props: LexicalEditorProps) {
  return (
    <LexicalComposer initialConfig={props.config}>
      <ToolbarPlugin />
      <RichTextPlugin
        contentEditable={
          <ContentEditable
            // className="relative"
          />
        }
        placeholder={<Placeholder />}
        // placeholder={(isEditable) => isEditable ? <Placeholder /> : null}
        ErrorBoundary={LexicalErrorBoundary}
      />
      <LocalStoragePlugin namespace={props.config.namespace} />
      <MarkdownShortcutPlugin transformers={TRANSFORMERS} />
      <OnChangePlugin onChange={(editorState) => {

      }} />
    </LexicalComposer>
  );
}

const Placeholder = () => {
  return (
    <div className="absolute z-1 top-[63px] left-4 opacity-50 pointer-events-none overflow-hidden overflow-ellipsis select-none inline-block">
      Create Post...
    </div>
  );
};

const EDITOR_NAMESPACE = 'lexical-editor';

export function Editor() {
  // const [content, setContent] = useState<string | null>(null);

  // useEffect(() => {
  //   if (localStorage && !content) {
  //     setContent(localStorage.getItem(EDITOR_NAMESPACE));
  //   }
  // }, [content]);

  // console.log(content);

  return (
    <div
      id="editor-wrapper"
      className={classNames(
          'prose prose-slate dark:prose-invert prose-p:my-0',
          'prose-headings:mb-4 prose-headings:mt-2',
          '[&_s]:line-through [&_u]:underline',
          'border-slate-500 bg-primary border-2 rounded-md focus-within:outline-none',
          'focus-within:border-slate-900 dark:focus-within:border-slate-400',
          'w-full relative z-0 isolate',
      )}
    >
      <LexicalEditor
        config={{
          namespace: EDITOR_NAMESPACE,
          // editorState: content,
          nodes: EDITOR_NODES,
          theme: {
            root: 'p-4 h-full min-h-[200px] focus:outline-none',
            link: 'cursor-pointer',
            text: {
              bold: 'font-semibold',
              underline: 'underline',
              italic: 'italic',
              strikethrough: 'line-through',
              underlineStrikethrough: '[text-decoration:underline_line-through]',
            },
          },
          onError: (error) => {
            console.log(error);
          },
        }}
      />
    </div>
  );
}
