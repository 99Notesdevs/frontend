import { Extension } from '@tiptap/core';
import { DOMParser as ProseMirrorDOMParser, Fragment } from '@tiptap/pm/model';
import { Plugin } from '@tiptap/pm/state';

// Helper function to clean up HTML content
function cleanHTML(html: string): string {
  // Create a temporary div to parse the HTML
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = html;

  // Remove all style attributes
  const allElements = tempDiv.getElementsByTagName('*');
  for (let i = 0; i < allElements.length; i++) {
    allElements[i].removeAttribute('style');
    allElements[i].removeAttribute('class');
    allElements[i].removeAttribute('lang');
    allElements[i].removeAttribute('data-mce-style');
  }

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
  const emptyTags = tempDiv.querySelectorAll('p:empty, div:empty, span:empty');
  emptyTags.forEach(el => el.remove());

  // Clean up MS Word specific markup
  const msWordElements = tempDiv.querySelectorAll('[class^="Mso"], [class*=" Mso"], [style*="mso-"]');
  msWordElements.forEach(el => {
    el.removeAttribute('class');
    el.removeAttribute('style');
  });

  // Convert b to strong and i to em
  const bTags = tempDiv.getElementsByTagName('b');
  while (bTags[0]) {
    const b = bTags[0];
    const strong = document.createElement('strong');
    while (b.firstChild) {
      strong.appendChild(b.firstChild);
    }
    b.parentNode?.replaceChild(strong, b);
  }

  const iTags = tempDiv.getElementsByTagName('i');
  while (iTags[0]) {
    const i = iTags[0];
    const em = document.createElement('em');
    while (i.firstChild) {
      em.appendChild(i.firstChild);
    }
    i.parentNode?.replaceChild(em, i);
  }

  // Clean up any remaining empty elements
  const allElementsAgain = tempDiv.getElementsByTagName('*');
  for (let i = 0; i < allElementsAgain.length; i++) {
    const el = allElementsAgain[i];
    if (el.childNodes.length === 0 && !el.textContent?.trim()) {
      el.remove();
    }
  }

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
