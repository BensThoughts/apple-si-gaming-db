import { createHeadlessEditor } from '@lexical/headless';
import { $createParagraphNode, $createTextNode, $getRoot } from 'lexical';

const lexicalEditor = createHeadlessEditor({
  namespace: 'HeadlessServerEditor',
  nodes: [],
  onError: console.error,
});

export async function plainTextToLexicalState(text: string): Promise<string> {
  return new Promise((resolve) => {
    lexicalEditor.registerUpdateListener(({ editorState }) => {
      resolve( JSON.stringify(editorState));
    });

    lexicalEditor.update(() => {
      const paragraph = $createParagraphNode();
      const textNode = $createTextNode(text);

      paragraph.append(textNode);

      $getRoot()
          .clear()
          .append(paragraph);
    });
  });
}
