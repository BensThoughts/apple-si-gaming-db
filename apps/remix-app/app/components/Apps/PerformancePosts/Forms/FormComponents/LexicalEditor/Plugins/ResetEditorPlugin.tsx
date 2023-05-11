import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { CLEAR_EDITOR_COMMAND } from 'lexical';
import { useEffect } from 'react';

export default function ResetEditorPlugin({
  resetEditorState,
}: {
  resetEditorState: boolean;
}) {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    if (resetEditorState) {
      editor.dispatchCommand(CLEAR_EDITOR_COMMAND, undefined);
    }
  }, [editor, resetEditorState]);

  return null;
}
