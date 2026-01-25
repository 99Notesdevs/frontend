import { api } from "@/config/api/route";
import { NavItem } from "@/types/navigation";

interface CurrentAffairSection {
  id: number;
  title: string;
  content: string;
  type: string; // daily, monthly, yearly
  slug: string;
  createdAt: string;
  updatedAt: string;
  showInNav: boolean;
  link: string | null;
}

interface Page {
  slug: string;
  title: string;
  link: string | null;
  showInNav: boolean;
}

let pagesPromise: Promise<Page[]> | null = null;

async function fetchOrderedPages(): Promise<Page[]> {
  if (!pagesPromise) {
    pagesPromise = (async () => {
      const response = (await api.get(`/page/order/-1`)) as {
        success: boolean;
        data: any[];
      };

      if (!response.success) {
        throw new Error(`Failed to fetch navigation data`);
      }

      return response.data as Page[];
    })();
  }

  return pagesPromise;
}

let currentAffairsPromise: Promise<CurrentAffairSection[]> | null = null;

async function fetchCurrentAffairs(): Promise<CurrentAffairSection[]> {
  if (!currentAffairsPromise) {
    currentAffairsPromise = (async () => {
      const response = (await api.get(`/currentAffair`)) as {
        success: boolean;
        data: any[];
      };

      if (!response.success) {
        throw new Error("Failed to fetch current affairs data");
      }

      return response.data as CurrentAffairSection[];
    })();
  }

  return currentAffairsPromise;
}

export async function getNavigationTree(): Promise<NavItem[]> {
  try {
    const pages = await fetchOrderedPages();

    const tree: NavItem[] = [];

    pages?.forEach((page: Page) => {
      const parts: string[] = page.slug.split("/");
      let currentLevel: NavItem[] = tree;

      parts?.forEach((part: string, index: number) => {
        const currentPath: string = parts.slice(0, index + 1).join("/");
        const existing: NavItem | undefined = currentLevel.find(
          (item) => item.slug === currentPath
        );

        if (existing) {
          currentLevel = existing.children;
        } else {
          const newItem: NavItem = {
            slug: currentPath,
            title:
              index === parts.length
                ? page.title
                : part
                    .replace(/\-/g, " ")
                    .split(" ")
                    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(" "),
            link: page.link,
            children: [],
            showInNav: page.showInNav,
          };
          currentLevel.push(newItem);
          currentLevel = newItem.children;
        }
      });
    });

    const currentAffairsNavItem = await buildCurrentAffairsNavigation();

    return [...tree, currentAffairsNavItem];
  } catch (error) {
    console.error("Error fetching navigation data:", error);
    return [];
  }
}

async function buildCurrentAffairsNavigation(): Promise<NavItem> {
  const currentAffairsNav: NavItem = {
    slug: "current-affairs",
    title: "Current Affairs",
    link: null,
    showInNav: true,
    children: [
      {
        slug: "current-affairs/daily",
        title: "Daily Current Affairs",
        link: null,
        children: [],
        showInNav: true,
      },
      {
        slug: "current-affairs/monthly",
        title: "Monthly Current Affairs",
        link: null,
        children: [],
        showInNav: true,
      },
      {
        slug: "current-affairs/yearly",
        title: "Yearly Current Affairs",
        link: null,
        children: [],
        showInNav: true,
      },
    ],
  };

  try {
    const sections = await fetchCurrentAffairs();

    const dailySections = sections.filter((s) => s.type === "daily");
    const monthlySections = sections.filter((s) => s.type === "monthly");
    const yearlySections = sections.filter((s) => s.type === "yearly");

    const dailyNavItems = currentAffairsNav.children.find(
      (item) => item.slug === "current-affairs/daily"
    );
    const monthlyNavItems = currentAffairsNav.children.find(
      (item) => item.slug === "current-affairs/monthly"
    );
    const yearlyNavItems = currentAffairsNav.children.find(
      (item) => item.slug === "current-affairs/yearly"
    );

    if (dailyNavItems) {
      dailyNavItems.children = dailySections
        .filter((section: CurrentAffairSection) => section.showInNav)
        .map((section: CurrentAffairSection) => {
          const pathSlug = section.slug.split("/").pop() || section.slug;
          return {
            slug: `current-affairs/${pathSlug}`,
            title: section.title,
            link: section.link,
            children: [],
            showInNav: true,
          };
        });
    }

    if (monthlyNavItems) {
      monthlyNavItems.children = monthlySections
        .filter((section: CurrentAffairSection) => section.showInNav)
        .map((section: CurrentAffairSection) => {
          const pathSlug = section.slug.split("/").pop() || section.slug;
          return {
            slug: `current-affairs/${pathSlug}`,
            title: section.title,
            link: section.link,
            children: [],
            showInNav: true,
          };
        });
    }

    if (yearlyNavItems) {
      yearlyNavItems.children = yearlySections
        .filter((section: CurrentAffairSection) => section.showInNav)
        .map((section: CurrentAffairSection) => {
          const pathSlug = section.slug.split("/").pop() || section.slug;
          return {
            slug: `current-affairs/${pathSlug}`,
            title: section.title,
            link: section.link,
            children: [],
            showInNav: true,
          };
        });
    }
  } catch (error) {
    console.error("Error fetching current affairs sections:", error);
  }

  return currentAffairsNav;
}

export async function getFooterLinks(): Promise<NavItem[]> {
  try {
    const pages = await fetchOrderedPages();

    const tree: NavItem[] = [];

    pages?.forEach((page: Page) => {
      const parts: string[] = page.slug.split("/");
      if (parts.length > 2) return;

      let currentLevel: NavItem[] = tree;

      parts?.forEach((part: string, index: number) => {
        const currentPath: string = parts.slice(0, index + 1).join("/");
        const existing: NavItem | undefined = currentLevel.find(
          (item) => item.slug === currentPath
        );

        if (existing) {
          currentLevel = existing.children;
        } else {
          const newItem: NavItem = {
            slug: currentPath,
            title:
              index === parts.length - 1
                ? page.title
                : part
                    .replace(/\-/g, " ")
                    .split(" ")
                    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(" "),
            link: page.link,
            children: [],
            showInNav: true,
          };
          currentLevel.push(newItem);
          currentLevel = newItem.children;
        }
      });
    });

    return tree;
  } catch (error) {
    console.error("Error fetching footer links data:", error);
    return [];
  }
}
