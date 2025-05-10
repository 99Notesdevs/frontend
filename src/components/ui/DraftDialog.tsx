import * as Dialog from "@radix-ui/react-dialog";
import { Cross2Icon } from "@radix-ui/react-icons";

interface DraftDialogProps {
  open: boolean;
  onClose: (open: boolean) => void;
  onLoadDraft: () => void;
  onStartNew: () => void;
  drafts: { 
    title: string; 
    data: { 
      title: string; 
      content: string; 
      imageUrl: string | undefined; 
      showInNav: boolean | undefined; 
      tags?: string[] | undefined; 
    } 
  }[];
  onSelectDraft: (title: string) => void;
}

const DraftDialog: React.FC<DraftDialogProps> = ({ open, onClose, onLoadDraft, onStartNew, drafts, onSelectDraft }) => (
  <Dialog.Root open={open} onOpenChange={onClose}>
    <Dialog.Portal>
      <Dialog.Overlay className="fixed inset-0 bg-black/50" />
      <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
        <Dialog.Title className="text-lg font-bold mb-4">Saved Drafts</Dialog.Title>
        <div className="space-y-4">
          {drafts.length > 0 ? (
            <div className="space-y-2">
              {drafts.map((draft) => (
                <button
                  key={draft.title}
                  onClick={() => onSelectDraft(draft.title)}
                  className="w-full px-4 py-2 flex items-center justify-between border rounded hover:bg-gray-50"
                >
                  <span className="font-medium">{draft.title}</span>
                  <span className="text-sm text-gray-500">
                    {draft.data.tags?.join(', ')}
                  </span>
                </button>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center">No drafts available</p>
          )}
          <div className="mt-4 flex justify-end space-x-2">
            <button
              onClick={onStartNew}
              className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            >
              Start New
            </button>
          </div>
        </div>
        <Dialog.Close asChild>
          <button
            aria-label="Close"
            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
          >
            <Cross2Icon />
          </button>
        </Dialog.Close>
      </Dialog.Content>
    </Dialog.Portal>
  </Dialog.Root>
);

export default DraftDialog;
