import { useState } from 'react';
import { EditorState } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';

export default function DraftEditor() {
  const [editorState, setEditorState] = useState(
      () => EditorState.createEmpty(),
  );

  return (
    <Editor
      editorState={editorState}
      onEditorStateChange={setEditorState}
    />
  );
}
