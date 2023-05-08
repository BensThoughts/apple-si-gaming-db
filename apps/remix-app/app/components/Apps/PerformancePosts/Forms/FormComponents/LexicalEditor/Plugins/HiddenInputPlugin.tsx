import {
  // useCallback,
  useEffect,
  useState,
} from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $generateHtmlFromNodes } from '@lexical/html';
import { PerformancePostFormFieldNames } from '~/lib/enums/FormFields/PerformancePost';
import { $getRoot } from 'lexical';

type HiddenInputPluginProps = {
  // namespace: string;
  defaultState: {
    postText: string;
    postHTML?: string;
    serializedLexicalEditorState: string;
  }
};

export function HiddenInputPlugin({
  // namespace,
  defaultState: {
    postText,
    postHTML,
    serializedLexicalEditorState,
  },
}: HiddenInputPluginProps) {
  const [editor] = useLexicalComposerContext();
  const [editorState, setEditorState] = useState(serializedLexicalEditorState);
  const [editorHTML, setEditorHTML] = useState(postHTML ? postHTML : '');
  const [editorText, setEditorText] = useState(postText);

  useEffect(() => {
    return editor.update(() => {
      const htmlString = $generateHtmlFromNodes(editor);
      setEditorHTML(htmlString);
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    return editor.registerUpdateListener(
        ({ editorState, dirtyElements, dirtyLeaves }) => {
          // Don't update if nothing changed
          if (dirtyElements.size === 0 && dirtyLeaves.size === 0) return;

          const serializedState = JSON.stringify(editorState);
          setEditorState(serializedState);
          // debouncedSaveEditorState(serializedState);
          editorState.read(() => {
            const htmlString = $generateHtmlFromNodes(editor);
            const editorText = $getRoot().getTextContent();
            setEditorHTML(htmlString);
            setEditorText(editorText);
          });
        },
    );
  }, [
    // debouncedSaveEditorState,
    editor,
  ]);

  return (
    <>
      <input
        name={PerformancePostFormFieldNames.PostText}
        type="hidden"
        value={editorText}
      />
      <input
        name={PerformancePostFormFieldNames.PostHTML}
        type="hidden"
        value={editorHTML}
      />
      <input
        name={PerformancePostFormFieldNames.SerializedLexicalEditorState}
        type="hidden"
        value={editorState}
      />
    </>
  );
}

// export function debounce<F extends(...params: any[]) => void>(
//     fn: F,
//     delay: number,
// ) {
//   let timeoutID: number | undefined;
//   return function(this: any, ...args: any[]) {
//     clearTimeout(timeoutID);
//     // eslint-disable-next-line no-invalid-this
//     timeoutID = window.setTimeout(() => fn.apply(this, args), delay);
//   } as F;
// }

// const saveEditorState = useCallback(
//     (serializedState: string) => {
//       setEditorState(serializedState);
//       localStorage.setItem(namespace, serializedState);
//     },
//     [namespace],
// );

// const debouncedSaveEditorState = debounce(saveEditorState, 500);
