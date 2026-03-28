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

// Define the type for a Current Article
interface CurrentArticle {
  id: number;
  title: string;
  slug: string;
  parentSlug: string;
  content: string;
  author: string;
  order: number;
  level: number;
  isExpanded?: boolean;
  isLoading?: boolean;
}

// Define the type for a Current Affair
interface CurrentAffair {
  id: number;
  title: string;
  slug: string;
  type: "daily" | "monthly" | "yearly";
  order: number;
  children: CurrentArticle[] | null;
  isExpanded?: boolean;
  isLoading?: boolean;
}

// Fetch current affairs by type from the API
const fetchCurrentAffairsByType = async (
  type: "daily" | "monthly" | "yearly"
): Promise<CurrentAffair[]> => {
  const res = (await api.get(`/currentAffair/type/${type}`)) as {
    success: boolean; data: CurrentAffair[];
  };
  if (!res.success) {
    throw new Error(`Failed to fetch ${type} current affairs`);
  }
  return res.data.map(affair => ({
    ...affair,
    children: null,
    isExpanded: false,
    isLoading: false
  }));
};

// Fetch articles by parent slug from the API
const fetchArticlesByParentSlug = async (parentSlug: string): Promise<CurrentArticle[]> => {
  // console.log('Fetching articles for slug:', parentSlug); // Debug log
  // URL encode the slug to handle forward slashes properly
  const encodedSlug = encodeURIComponent(parentSlug);
  // console.log('Encoded slug:', encodedSlug); // Debug log
  const res = (await api.get(`/currentArticle/parent/${encodedSlug}`)) as {
    success: boolean; data: CurrentArticle[];
  };
  if (!res.success) {
    throw new Error(`Failed to fetch articles for ${parentSlug}`);
  }
  // console.log('Articles response:', res.data); // Debug log
  return res.data.map(article => ({
    ...article,
    level: 2,
    isExpanded: false,
    isLoading: false
  }));
};

// Sortable Item Component for Current Affairs
const SortableAffairItem = ({ 
  affair, 
  onToggleExpand, 
  onLoadChildren,
  type 
}: { 
  affair: CurrentAffair;
  onToggleExpand: (id: number) => void;
  onLoadChildren: (slug: string, id: number) => void;
  type: "daily" | "monthly" | "yearly";
}) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: affair.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const hasChildren = affair.children && affair.children.length > 0;
  const isLoading = affair.isLoading;

  return (
    <div className="mb-1">
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        className="bg-[var(--admin-bg-lightest)] shadow rounded-xl p-4 mb-2 border border-[var(--admin-border)] cursor-move hover:bg-[var(--admin-bg-light)] transition-all"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 flex-1">
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onToggleExpand(affair.id);
                if (!affair.isExpanded && (!affair.children || affair.children.length === 0)) {
                  onLoadChildren(affair.slug, affair.id);
                }
              }}
              className="p-1 rounded hover:bg-gray-100"
              aria-label={affair.isExpanded ? 'Collapse' : 'Expand'}
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-gray-500"></div>
              ) : (
                <svg 
                  className={`w-4 h-4 transition-transform ${affair.isExpanded ? 'rotate-90' : ''}`} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24" 
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              )}
            </button>
            <div 
              {...listeners}
              className="flex items-center space-x-2 flex-1 cursor-grab active:cursor-grabbing"
            >
              <div className="w-3 h-3 rounded-full bg-blue-500" />
              <h3 className="text-base font-semibold text-[var(--admin-bg-secondary)]">
                {affair.title}
              </h3>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-xs text-[var(--admin-primary)] bg-[var(--admin-bg-light)] px-2 py-1 rounded">
              Order: {affair.order}
            </span>
            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
              {type}
            </span>
          </div>
        </div>
      </div>
      {affair.children && affair.children.length > 0 && affair.isExpanded && (
        <div className="mt-1 ml-6 border-l-2 border-gray-200 pl-2">
          <SortableContext items={affair.children.map(child => child.id)} strategy={verticalListSortingStrategy}>
            {affair.children.map(child => (
              <SortableArticleItem 
                key={child.id} 
                article={child} 
                parentSlug={affair.slug}
              />
            ))}
          </SortableContext>
        </div>
      )}
    </div>
  );
};

// Sortable Item Component for Current Articles
const SortableArticleItem = ({ article, parentSlug }: { article: CurrentArticle; parentSlug: string }) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: article.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    marginLeft: `${(article.level - 2) * 1.5}rem`,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="bg-green-50 shadow-sm rounded-lg p-3 mb-1 border border-green-200 cursor-move hover:bg-green-100 transition-all"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2 flex-1">
          <div className="w-3 h-3 rounded-full bg-green-500" />
          <h3 className="text-base font-medium text-gray-800">
            {article.title}
          </h3>
        </div>
        <div className="flex items-center space-x-2">
          <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-white border border-gray-200 text-gray-600">
            #{article.order}
          </span>
        </div>
      </div>
    </div>
  );
};

const CurrentAffairsList = () => {
  const [dailyAffairs, setDailyAffairs] = useState<CurrentAffair[]>([]);
  const [monthlyAffairs, setMonthlyAffairs] = useState<CurrentAffair[]>([]);
  const [yearlyAffairs, setYearlyAffairs] = useState<CurrentAffair[]>([]);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [pendingChanges, setPendingChanges] = useState<{
    type: "daily" | "monthly" | "yearly";
    newAffairs: CurrentAffair[];
    updatedSiblings: any[];
    parentSlug?: string;
    updatedArticles?: any[];
  } | null>(null);

  // Load children (articles) for a specific current affair
  const loadChildren = async (parentSlug: string, parentId: number) => {
    // console.log('loadChildren called with:', { parentSlug, parentId }); // Debug log
    try {
      // Set loading state for the specific affair
      const updateLoadingState = (affairs: CurrentAffair[]): CurrentAffair[] => {
        return affairs.map(affair => {
          if (affair.id === parentId) {
            return { ...affair, isLoading: true };
          }
          return affair;
        });
      };
      
      // Update the appropriate affairs array
      const updateAffairsArray = (type: "daily" | "monthly" | "yearly") => {
        if (type === "daily") {
          setDailyAffairs(prev => updateLoadingState(prev));
        } else if (type === "monthly") {
          setMonthlyAffairs(prev => updateLoadingState(prev));
        } else {
          setYearlyAffairs(prev => updateLoadingState(prev));
        }
      };
      
      // Find which type this affair belongs to
      const findAffairType = (id: number): "daily" | "monthly" | "yearly" | null => {
        if (dailyAffairs.find(a => a.id === id)) return "daily";
        if (monthlyAffairs.find(a => a.id === id)) return "monthly";
        if (yearlyAffairs.find(a => a.id === id)) return "yearly";
        return null;
      };
      
      const affairType = findAffairType(parentId);
      if (affairType) {
        updateAffairsArray(affairType);
      }
      
      // Fetch children
      const children = await fetchArticlesByParentSlug(parentSlug);
      
      // Update affair with children
      const updateAffairWithChildren = (affairs: CurrentAffair[]): CurrentAffair[] => {
        return affairs.map(affair => {
          if (affair.id === parentId) {
            return { 
              ...affair, 
              children: children.map(child => ({ ...child, isExpanded: false, isLoading: false })),
              isLoading: false 
            };
          }
          return affair;
        });
      };
      
      if (affairType) {
        if (affairType === "daily") {
          setDailyAffairs(prev => updateAffairWithChildren(prev));
        } else if (affairType === "monthly") {
          setMonthlyAffairs(prev => updateAffairWithChildren(prev));
        } else {
          setYearlyAffairs(prev => updateAffairWithChildren(prev));
        }
      }
    } catch (error) {
      console.error('Error loading children:', error);
      
      // Remove loading state on error
      const removeLoadingState = (affairs: CurrentAffair[]): CurrentAffair[] => {
        return affairs.map(affair => {
          if (affair.id === parentId) {
            return { ...affair, isLoading: false };
          }
          return affair;
        });
      };
      
      const findAffairType = (id: number): "daily" | "monthly" | "yearly" | null => {
        if (dailyAffairs.find(a => a.id === id)) return "daily";
        if (monthlyAffairs.find(a => a.id === id)) return "monthly";
        if (yearlyAffairs.find(a => a.id === id)) return "yearly";
        return null;
      };
      
      const affairType = findAffairType(parentId);
      if (affairType) {
        if (affairType === "daily") {
          setDailyAffairs(prev => removeLoadingState(prev));
        } else if (affairType === "monthly") {
          setMonthlyAffairs(prev => removeLoadingState(prev));
        } else {
          setYearlyAffairs(prev => removeLoadingState(prev));
        }
      }
      
      setAlertMessage('Failed to load articles. Please try again.');
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 3000);
    }
  };
  
  // Toggle expanded state of a current affair
  const toggleExpand = (id: number) => {
    const updateExpanded = (affairs: CurrentAffair[]): CurrentAffair[] => {
      return affairs.map(affair => {
        if (affair.id === id) {
          return { ...affair, isExpanded: !affair.isExpanded };
        }
        return affair;
      });
    };
    
    // Update the appropriate affairs array
    if (dailyAffairs.find(a => a.id === id)) {
      setDailyAffairs(prev => updateExpanded(prev));
    } else if (monthlyAffairs.find(a => a.id === id)) {
      setMonthlyAffairs(prev => updateExpanded(prev));
    } else {
      setYearlyAffairs(prev => updateExpanded(prev));
    }
  };

  useEffect(() => {
    const getCurrentAffairs = async () => {
      try {
        // Fetch current affairs by type
        const [daily, monthly, yearly] = await Promise.all([
          fetchCurrentAffairsByType("daily"),
          fetchCurrentAffairsByType("monthly"),
          fetchCurrentAffairsByType("yearly"),
        ]);

        // Set state for each type
        setDailyAffairs(daily.sort((a, b) => a.order - b.order));
        setMonthlyAffairs(monthly.sort((a, b) => a.order - b.order));
        setYearlyAffairs(yearly.sort((a, b) => a.order - b.order));
      } catch (error) {
        console.error("Error fetching current affairs:", error);
      }
    };
    getCurrentAffairs();
  }, []);

  const showErrorAlert = (message: string) => {
    setAlertMessage(message);
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 5000);
  };

  const handleSaveChanges = async () => {
    if (!pendingChanges) return;
    
    const { type, newAffairs, updatedSiblings, parentSlug, updatedArticles } = pendingChanges;
    
    try {
      // Update current affairs order
      const affairUpdatePromises = updatedSiblings.map((affair) => {
        return api.put(`/currentAffair/update/order`, {
          id: affair.id,
          newOrder: affair.order,
        });
      });
      
      // Update articles order if present
      const articleUpdatePromises = updatedArticles ? [
        api.put(`/currentArticle/order`, {
          parentSlug,
          updates: updatedArticles.map((article) => ({ id: article.id, order: article.order })),
        })
      ] : [];
      
      await Promise.all([...affairUpdatePromises, ...articleUpdatePromises]);
      
      // Update the state after successful API call
      if (type === "daily") {
        setDailyAffairs(newAffairs);
      } else if (type === "monthly") {
        setMonthlyAffairs(newAffairs);
      } else {
        setYearlyAffairs(newAffairs);
      }
      
      setAlertMessage('Order updated successfully!');
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 3000);
    } catch (error) {
      console.error('Error updating order:', error);
      setAlertMessage('Failed to update order. Please try again.');
      setShowAlert(true);
    } finally {
      setShowConfirmDialog(false);
      setPendingChanges(null);
    }
  };

  const handleDragEnd = async (
    event: DragEndEvent,
    type: "daily" | "monthly" | "yearly"
  ) => {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    // Get the list of current affairs for the specific type
    const affairs =
      type === "daily"
        ? dailyAffairs
        : type === "monthly"
        ? monthlyAffairs
        : yearlyAffairs;

    // Check if we're dragging articles within an affair
    const findAffairContainingArticle = (affairs: CurrentAffair[], articleId: number): CurrentAffair | null => {
      for (const affair of affairs) {
        if (affair.children && affair.children.find(child => child.id === articleId)) {
          return affair;
        }
      }
      return null;
    };

    const activeAffair = findAffairContainingArticle(affairs, Number(active.id));
    const overAffair = findAffairContainingArticle(affairs, Number(over.id));

    if (activeAffair && overAffair && activeAffair.id === overAffair.id) {
      // We're reordering articles within the same affair
      const articles = activeAffair.children!;
      const oldIndex = articles.findIndex((article) => article.id === Number(active.id));
      const newIndex = articles.findIndex((article) => article.id === Number(over.id));

      if (oldIndex === -1 || newIndex === -1) return;

      const newArticles = arrayMove(articles, oldIndex, newIndex);
      const updatedArticles = newArticles.map((article, index) => ({
        ...article,
        order: index,
      }));

      // Update the affair with new articles order
      const updatedAffairs = affairs.map(affair => {
        if (affair.id === activeAffair.id) {
          return { ...affair, children: updatedArticles };
        }
        return affair;
      });

      setPendingChanges({
        type,
        newAffairs: updatedAffairs,
        updatedSiblings: [], // No affair changes
        parentSlug: activeAffair.slug,
        updatedArticles
      });
      setShowConfirmDialog(true);
      return;
    }

    // We're reordering current affairs
    const oldIndex = affairs.findIndex((affair) => affair.id === active.id);
    const newIndex = affairs.findIndex((affair) => affair.id === over.id);

    if (oldIndex === -1 || newIndex === -1) return;

    // Reorder the list
    const newAffairs = arrayMove(affairs, oldIndex, newIndex);

    // Update the order property for each item
    const updatedSiblings = newAffairs.map((affair, index) => ({
      ...affair,
      order: index,
    }));

    setPendingChanges({
      type,
      newAffairs: updatedSiblings,
      updatedSiblings
    });
    setShowConfirmDialog(true);
  };

  return (
    <div className="container mx-auto px-4 py-6 max-w-4xl">
      <h1 className="text-2xl font-bold text-[var(--admin-bg-dark)] mb-6 mt-7">
        Sort Current Affairs
      </h1>

      {/* Daily Affairs */}
      <div className="bg-white/90 shadow-xl rounded-2xl border border-[var(--admin-border)] p-6 mb-8">
        <h2 className="text-lg font-bold text-[var(--admin-bg-primary)] mb-4 text-center">
          Daily Affairs
        </h2>
        <DndContext
          collisionDetection={closestCenter}
          onDragEnd={(event) => handleDragEnd(event, "daily")}
        >
          <SortableContext
            items={dailyAffairs.map((affair) => affair.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-4">
              {dailyAffairs.map((affair) => (
                <SortableAffairItem 
                  key={affair.id} 
                  affair={affair} 
                  onToggleExpand={toggleExpand}
                  onLoadChildren={loadChildren}
                  type="daily"
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      </div>

      {/* Monthly Affairs */}
      <div className="bg-white/90 shadow-xl rounded-2xl border border-[var(--admin-border)] p-6 mb-8">
        <h2 className="text-lg font-bold text-[var(--admin-bg-primary)] mb-4 text-center">
          Monthly Affairs
        </h2>
        <DndContext
          collisionDetection={closestCenter}
          onDragEnd={(event) => handleDragEnd(event, "monthly")}
        >
          <SortableContext
            items={monthlyAffairs.map((affair) => affair.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-4">
              {monthlyAffairs.map((affair) => (
                <SortableAffairItem 
                  key={affair.id} 
                  affair={affair} 
                  onToggleExpand={toggleExpand}
                  onLoadChildren={loadChildren}
                  type="monthly"
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      </div>

      {/* Yearly Affairs */}
      <div className="bg-white/90 shadow-xl rounded-2xl border border-[var(--admin-border)] p-6 mb-8">
        <h2 className="text-lg font-bold text-[var(--admin-bg-primary)] mb-4 text-center">
          Yearly Affairs
        </h2>
        <DndContext
          collisionDetection={closestCenter}
          onDragEnd={(event) => handleDragEnd(event, "yearly")}
        >
          <SortableContext
            items={yearlyAffairs.map((affair) => affair.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-4">
              {yearlyAffairs.map((affair) => (
                <SortableAffairItem 
                  key={affair.id} 
                  affair={affair} 
                  onToggleExpand={toggleExpand}
                  onLoadChildren={loadChildren}
                  type="yearly"
                />
              ))}
            </div>
          </SortableContext>
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
              Are you sure you want to save the changes to the order?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4">
            <Button
              variant="outline"
              onClick={() => {
                setShowConfirmDialog(false);
                setPendingChanges(null);
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

export default CurrentAffairsList;
