"use client";
import { useEffect, useState } from "react";
import { DndContext, closestCenter, type DragEndEvent } from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { api } from "@/config/api/route";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AlertCircle, CheckCircle2 } from "lucide-react";

// Define the type for a page
interface Page {
  id: number;
  slug: string;
  title: string;
  content: string;
  metadata: string | null;
  status: string;
  imageUrl: string | null;
  templateId: string;
  parentId: number | null;
  children: Page[];
  level: number;
  showInNav: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
  isExpanded?: boolean;
}

// Fetch pages from the API with parent-child relationships
const fetchPages = async (): Promise<Page[]> => {
  const res = (await api.get(`/page/order`)) as {
    success: boolean; data: Page[];
  };
  if (!res.success) {
    throw new Error("Failed to fetch pages");
  }
  return buildHierarchy(res.data);
};

// Helper function to build hierarchical structure from flat array
const buildHierarchy = (pages: Page[]): Page[] => {
  const map = new Map<number, Page>();
  const result: Page[] = [];

  // First pass: create map and set children array
  pages.forEach((page) => {
    map.set(page.id, { ...page, children: [] });
  });

  // Second pass: build hierarchy
  pages.forEach((page) => {
    if (page.parentId !== null) {
      const parent = map.get(page.parentId);
      if (parent) {
        parent.children.push(map.get(page.id)!);
      }
    } else {
      result.push(map.get(page.id)!);
    }
  });

  // Third pass: calculate levels
  const calculateLevels = (pages: Page[], currentLevel = 1) => {
    pages.forEach((page) => {
      page.level = currentLevel;
      calculateLevels(page.children, currentLevel + 1);
    });
  };

  calculateLevels(result);
  return result;
};

// Sortable Item Component
const SortableItem = ({ page, onToggleExpand }: { page: Page, onToggleExpand: (id: number) => void }) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: page.id });
  
  // Different background colors for different levels
  const levelColors = [
    'bg-blue-50 border-blue-200', // Level 1
    'bg-green-50 border-green-200', // Level 2
    'bg-yellow-50 border-yellow-200', // Level 3
    'bg-purple-50 border-purple-200', // Level 4
    'bg-pink-50 border-pink-200', // Level 5
  ];
  
  // Default to first color if level is out of range
  const levelColor = levelColors[Math.min(page.level - 1, levelColors.length - 1)] || levelColors[0];
  const hasChildren = page.children && page.children.length > 0;
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    marginLeft: `${(page.level - 1) * 1.5}rem`, // Slightly reduce indentation
  };

  return (
    <div className="mb-1">
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        className={`article-item ${levelColor} shadow-sm rounded-lg p-3 border cursor-move transition-colors hover:shadow-md`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 flex-1">
            {hasChildren && (
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleExpand(page.id);
                }}
                className="p-1 rounded hover:bg-gray-100"
                aria-label={page.isExpanded ? 'Collapse' : 'Expand'}
              >
                <svg 
                  className={`w-4 h-4 transition-transform ${page.isExpanded ? 'rotate-90' : ''}`} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24" 
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            )}
            {!hasChildren && <div className="w-6"></div>} {/* Spacer for alignment */}
            <div 
              {...listeners}
              className="flex items-center space-x-2 flex-1 cursor-grab active:cursor-grabbing"
            >
              <div className={`w-3 h-3 rounded-full ${
                levelColor.includes('blue') ? 'bg-blue-500' :
                levelColor.includes('green') ? 'bg-green-500' :
                levelColor.includes('yellow') ? 'bg-yellow-500' :
                levelColor.includes('purple') ? 'bg-purple-500' : 'bg-pink-500'
              }`} />
              <h3 className="text-base font-medium text-gray-800">
                {page.title}
              </h3>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-white border border-gray-200 text-gray-600">
              L{page.level}
            </span>
            <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-white border border-gray-200 text-gray-600">
              #{page.order}
            </span>
          </div>
        </div>
      </div>
      {hasChildren && page.isExpanded && (
        <div className="mt-1 ml-6 border-l-2 border-gray-200 pl-2">
          <SortableContext items={page.children.map(child => child.id)} strategy={verticalListSortingStrategy}>
            {page.children.map(child => (
              <SortableItem 
                key={child.id} 
                page={child} 
                onToggleExpand={onToggleExpand}
              />
            ))}
          </SortableContext>
        </div>
      )}
    </div>
  );
};

const ArticleList = () => {
  const [pages, setPages] = useState<Page[]>([]);
  const [flattenedPages, setFlattenedPages] = useState<Page[]>([]);
  const [hasChanges, setHasChanges] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [pendingChanges, setPendingChanges] = useState<{
    newFlattenedPages: Page[];
    updatedSiblings: any[];
    newHierarchy: Page[];
  } | null>(null);
  
  // Toggle expanded state of a page
  const toggleExpand = (id: number) => {
    const updateExpanded = (items: Page[]): Page[] => {
      return items.map(item => {
        if (item.id === id) {
          return { ...item, isExpanded: !item.isExpanded };
        }
        if (item.children && item.children.length > 0) {
          return { ...item, children: updateExpanded(item.children) };
        }
        return item;
      });
    };
    
    setPages(prevPages => updateExpanded(prevPages));
  };
  
  // Set initial expanded state (expand first level by default)
  const setInitialExpandedState = (items: Page[]): Page[] => {
    return items.map(item => ({
      ...item,
      isExpanded: item.level <= 2, // Expand first two levels by default
      children: item.children ? setInitialExpandedState(item.children) : []
    }));
  };

  // Flatten the hierarchy while maintaining level information
  const flattenHierarchy = (pages: Page[]): Page[] => {
    const result: Page[] = [];

    const flatten = (items: Page[]) => {
      items.forEach((item) => {
        result.push(item);
        if (item.children && item.children.length > 0) {
          flatten(item.children);
        }
      });
    };

    flatten(pages);
    return result;
  };

  useEffect(() => {
    const getPages = async () => {
      try {
        const pagesData = await fetchPages();
        const pagesWithExpandedState = setInitialExpandedState(pagesData);
        setPages(pagesWithExpandedState);
        setFlattenedPages(flattenHierarchy(pagesWithExpandedState));
      } catch (error) {
        console.error("Error fetching pages:", error);
      }
    };
    getPages();
  }, []);

  useEffect(() => {
    setFlattenedPages(flattenHierarchy(pages));
  }, [pages]);

  const showErrorAlert = (message: string) => {
    setAlertMessage(message);
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 5000);
  };

  const handleSaveChanges = async () => {
    if (!pendingChanges) return;
    
    const { newFlattenedPages, updatedSiblings, newHierarchy } = pendingChanges;
    
    try {
      // Update the database with the new order
      const updatePromises = updatedSiblings.map((page) => {
        return api.put(`/page/order`, {
          pageId: page.id,
          newOrder: page.order,
        });
      });
      
      await Promise.all(updatePromises);
      
      // Only update the UI state after successful API call
      setPages(newHierarchy);
      setFlattenedPages(newFlattenedPages);
      setHasChanges(true);
      
      setAlertMessage('Page order updated successfully!');
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 3000);
    } catch (error) {
      console.error('Error updating page order:', error);
      setAlertMessage('Failed to update page order. Please try again.');
      setShowAlert(true);
    } finally {
      setShowConfirmDialog(false);
      setPendingChanges(null);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    // Find the pages being dragged and dropped
    const activePage = flattenedPages.find((page) => page.id === active.id);
    const overPage = flattenedPages.find((page) => page.id === over.id);

    if (!activePage || !overPage) return;

    // Only allow reordering within the same level and same parent
    if (
      activePage.level !== overPage.level ||
      activePage.parentId !== overPage.parentId
    ) {
      showErrorAlert("Only pages at the same level and with the same parent can be reordered together.");
      return;
    }

    // Get all siblings (pages at the same level with the same parent)
    const siblings = flattenedPages.filter(
      (page) =>
        page.level === activePage.level && page.parentId === activePage.parentId
    );

    // Find indices within the siblings array
    const oldIndex = siblings.findIndex((page) => page.id === activePage.id);
    const newIndex = siblings.findIndex((page) => page.id === overPage.id);

    if (oldIndex === -1 || newIndex === -1) return;

    // Reorder the siblings
    const newSiblings = arrayMove(siblings, oldIndex, newIndex);

    // Update the order property for each sibling
    const updatedSiblings = newSiblings.map((page, index) => ({
      ...page,
      order: index,
    }));

    // Create a new flattened pages array with the updated siblings
    const newFlattenedPages = flattenedPages.map((page) => {
      const updatedSibling = updatedSiblings.find((s) => s.id === page.id);
      return updatedSibling || page;
    });

    // Rebuild the hierarchy with the updated orders
    const rebuildHierarchy = (flatPages: Page[]): Page[] => {
      // Create a deep copy to avoid mutation issues
      const pagesCopy = JSON.parse(JSON.stringify(flatPages)) as Page[];

      // Reset children arrays
      pagesCopy.forEach((page) => {
        page.children = [];
      });

      // Create a map for quick lookups
      const pageMap = new Map<number, Page>();
      pagesCopy.forEach((page) => {
        pageMap.set(page.id, page);
      });

      // Build the hierarchy
      const result: Page[] = [];
      pagesCopy.forEach((page) => {
        if (page.parentId === null) {
          result.push(page);
        } else {
          const parent = pageMap.get(page.parentId);
          if (parent) {
            parent.children.push(page);
          }
        }
      });

      // Sort children by order
      const sortChildren = (pages: Page[]) => {
        pages.forEach((page) => {
          page.children.sort((a, b) => a.order - b.order);
          sortChildren(page.children);
        });
      };

      sortChildren(result);
      result.sort((a, b) => a.order - b.order);

      return result;
    };

    const newHierarchy = rebuildHierarchy(newFlattenedPages);
    
    // Store the pending changes and show confirmation dialog
    setPendingChanges({
      newFlattenedPages,
      updatedSiblings,
      newHierarchy
    });
    setShowConfirmDialog(true);
  };

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Page Sorter</h1>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
        <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <div className="space-y-1">
            <SortableContext items={pages.map(page => page.id)} strategy={verticalListSortingStrategy}>
              {pages.map(page => (
                <SortableItem 
                  key={page.id} 
                  page={page} 
                  onToggleExpand={toggleExpand}
                />
              ))}
            </SortableContext>
          </div>
        </DndContext>
      </div>

      {/* Alert Toast */}
      {showAlert && (
        <div className="fixed bottom-4 right-4 z-50 max-w-sm">
          <div className={`flex items-center gap-3 p-4 rounded-lg shadow-lg ${
            alertMessage.includes('success') 
              ? 'bg-green-50 border border-green-200 text-green-800' 
              : 'bg-red-50 border border-red-200 text-red-800'
          }`}>
            {alertMessage.includes('success') ? (
              <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />
            ) : (
              <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
            )}
            <span className="text-sm">{alertMessage}</span>
          </div>
        </div>
      )}

      {/* Confirmation Dialog */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent className="sm:max-w-[425px] rounded-lg">
          <DialogHeader>
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-yellow-500" />
              <DialogTitle className="text-lg font-semibold">Confirm Changes</DialogTitle>
            </div>
            <DialogDescription className="pt-2 text-gray-600">
              Are you sure you want to save the changes to the page order?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4">
            <Button
              variant="outline"
              onClick={() => {
                setShowConfirmDialog(false);
                // Reset to previous state when canceling
                if (pendingChanges) {
                  setPendingChanges(null);
                  // Optional: Revert the UI to the previous state
                  // This would require keeping track of the previous state
                }
              }}
              className="border-gray-300 hover:bg-gray-50"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveChanges}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ArticleList;
