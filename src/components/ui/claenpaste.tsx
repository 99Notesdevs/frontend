import { Extension } from '@tiptap/core';
import { DOMParser as ProseMirrorDOMParser, Fragment } from '@tiptap/pm/model';
import { Plugin } from '@tiptap/pm/state';

// Helper function to clean up HTML content
function cleanHTML(html: string): string {
  // Create a temporary div to parse the HTML
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = html;

  // Remove span tags but keep their content
  const spans = tempDiv.getElementsByTagName('span');
  while (spans[0]) {
    const span = spans[0];
    const parent = span.parentNode;
    if (parent) {
      while (span.firstChild) {
        parent.insertBefore(span.firstChild, span);
      }
      parent.removeChild(span);
    }
  }

  // Remove empty tags
  const emptyTags = tempDiv.querySelectorAll('span:empty');
  emptyTags.forEach(el => el.remove());

  return tempDiv.innerHTML;
}

export const CleanPaste = Extension.create({
  name: 'cleanPaste',

  addProseMirrorPlugins() {
    return [
      new Plugin({
        props: {
          handlePaste: (view: any, event: ClipboardEvent) => {
            // Get HTML content from clipboard
            const clipboardData = event.clipboardData;
            const html = clipboardData?.getData('text/html');

            if (html) {
              event.preventDefault();
              
              try {
                // Clean the HTML
                const cleanedHTML = cleanHTML(html);
                
                // Create a temporary container for the cleaned HTML
                const container = document.createElement('div');
                container.innerHTML = cleanedHTML;
                
                // Convert the cleaned HTML to a ProseMirror fragment
                const fragment = Fragment.from(
                  ProseMirrorDOMParser.fromSchema(view.state.schema)
                    .parse(container)
                    .content
                );
                
                // Insert the cleaned content
                const { state } = view;
                const { from, to } = state.selection;
                const tr = state.tr.replaceWith(from, to, fragment);
                
                view.dispatch(tr);
                return true;
              } catch (error) {
                console.error('Error cleaning pasted content:', error);
                // Fall back to default paste behavior if there's an error
                return false;
              }
            }
            
            return false;
          },
        },
      }),
    ];
  },
});
