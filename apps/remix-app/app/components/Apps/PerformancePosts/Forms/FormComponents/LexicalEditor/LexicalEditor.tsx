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
import { ToolbarPlugin } from './Plugins/ToolbarPlugin';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { HiddenInputPlugin } from './Plugins/HiddenInputPlugin';
// import { $createParagraphNode, $createTextNode, $getRoot } from 'lexical';

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

export function LexicalEditor({
  defaultState,
  placeholderText,
  lexicalEditorProps: { config },
}: {
  defaultState: {
    postText: string;
    postHTML?: string;
    serializedLexicalEditorState?: string;
  }
  placeholderText?: string;
  lexicalEditorProps: LexicalEditorProps;
}) {
  return (
    <LexicalComposer initialConfig={config}>
      <ToolbarPlugin />
      <RichTextPlugin
        contentEditable={
          <ContentEditable
            // className="relative"
          />
        }
        placeholder={<Placeholder placeholderText={placeholderText} />}
        // placeholder={(isEditable) => isEditable ? <Placeholder /> : null}
        ErrorBoundary={LexicalErrorBoundary}
      />
      <HiddenInputPlugin
        defaultState={defaultState}
        // namespace={config.namespace}
      />
      <MarkdownShortcutPlugin transformers={TRANSFORMERS} />
      <OnChangePlugin onChange={(editorState) => {

      }} />
    </LexicalComposer>
  );
}

const Placeholder = ({
  placeholderText = 'Create Post...',
}: {
  placeholderText?: string;
}) => {
  return (
    <div className="absolute z-1 top-[63px] left-4 opacity-50 pointer-events-none overflow-hidden overflow-ellipsis select-none inline-block">
      {placeholderText}
    </div>
  );
};

const EDITOR_NAMESPACE = 'lexical-editor';

export function Editor({
  defaultState,
  placeholderText,
}: {
  defaultState: {
    postText: string;
    postHTML?: string;
    serializedLexicalEditorState?: string;
  };
  placeholderText?: string;
}) {
  // const [content, setContent] = useState<string | null>(null);

  // useEffect(() => {
  //   if (localStorage && !content) {
  //     setContent(localStorage.getItem(EDITOR_NAMESPACE));
  //   }
  // }, [content]);

  // console.log(content);

  // const createInitialEditorState = () => {
  //   if (defaultState.serializedLexicalEditorState) return defaultState.serializedLexicalEditorState;
  //   const paragraph = $createParagraphNode();
  //   const text = $createTextNode(defaultState.postText);
  //   paragraph.append(text);
  //   const root = $getRoot().append(paragraph);
  //   root.selectEnd();
  // };

  // TODO: Change to programmatically create editor state when only postText exists
  const initialEditorState = defaultState.serializedLexicalEditorState
    ? defaultState.serializedLexicalEditorState
    : `{"root":{"children":[{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"${defaultState.postText}","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"paragraph","version":1}],"direction":"ltr","format":"","indent":0,"type":"root","version":1}}`;

  return (
    <div
      id="editor-wrapper"
      className={classNames(
          'prose prose-slate dark:prose-invert prose-p:my-0',
          'prose-headings:mb-4 prose-headings:mt-2',
          '[&_s]:line-through [&_u]:underline',
          '[&_h1]:text-2xl [&_h2]:text-xl',
          'border-slate-500 bg-primary border-2 rounded-md focus-within:outline-none',
          'focus-within:border-slate-900 dark:focus-within:border-slate-400',
          'w-full relative z-0 isolate',
      )}
    >
      <LexicalEditor
        defaultState={defaultState}
        placeholderText={placeholderText}
        lexicalEditorProps={{
          config: {
            namespace: EDITOR_NAMESPACE,
            editorState: initialEditorState,
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
          },
        }}
      />
    </div>
  );
}