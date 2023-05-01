import { useCallback, useEffect } from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $generateHtmlFromNodes } from '@lexical/html';
import { $convertToMarkdownString, TRANSFORMERS } from '@lexical/markdown';

export function debounce<F extends(...params: any[]) => void>(
    fn: F,
    delay: number,
) {
  let timeoutID: number | undefined;
  return function(this: any, ...args: any[]) {
    clearTimeout(timeoutID);
    // eslint-disable-next-line no-invalid-this
    timeoutID = window.setTimeout(() => fn.apply(this, args), delay);
  } as F;
}

type LocalStoragePluginProps = {
  namespace: string;
};

export function LocalStoragePlugin({ namespace }: LocalStoragePluginProps) {
  const [editor] = useLexicalComposerContext();

  const saveContent = useCallback(
      (content: string) => {
        localStorage.setItem(namespace, content);
      },
      [namespace],
  );

  const debouncedSaveContent = debounce(saveContent, 500);

  useEffect(() => {
    return editor.registerUpdateListener(
        ({ editorState, dirtyElements, dirtyLeaves }) => {
        // Don't update if nothing changed
          if (dirtyElements.size === 0 && dirtyLeaves.size === 0) return;

          const serializedState = JSON.stringify(editorState);
          debouncedSaveContent(serializedState);
          editorState.read(() => {
            const htmlString = $generateHtmlFromNodes(editor);
            const markDownString = $convertToMarkdownString(TRANSFORMERS);
            console.log(htmlString);
            console.log(markDownString);
          });
        },
    );
  }, [debouncedSaveContent, editor]);

  return null;
}
