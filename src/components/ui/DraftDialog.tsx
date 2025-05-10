import * as Dialog from "@radix-ui/react-dialog";
import { Cross2Icon } from "@radix-ui/react-icons";

interface DraftDialogProps {
  open: boolean;
  onClose: (open: boolean) => void;
  onLoadDraft: () => void;
  onStartNew: () => void;
}

const DraftDialog: React.FC<DraftDialogProps> = ({ open, onClose, onLoadDraft, onStartNew }) => (
  <Dialog.Root open={open} onOpenChange={onClose}>
    <Dialog.Portal>
      <Dialog.Overlay className="fixed inset-0 bg-black/50" />
      <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg shadow-lg">
        <Dialog.Title className="text-lg font-bold">Load Draft</Dialog.Title>
        <Dialog.Description className="mt-2 text-gray-700">
          A saved draft is available. Would you like to load the draft here or continue?
        </Dialog.Description>
        <div className="mt-4 flex justify-end space-x-2">
          <button
            onClick={onLoadDraft}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Load Draft
          </button>
          <button
            onClick={onStartNew}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          >
            Continue
          </button>
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
