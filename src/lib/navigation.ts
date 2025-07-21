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

export async function getNavigationTree(): Promise<NavItem[]> {
  try {
    const response = (await api.get(`/page/order`)) as {
      success: boolean;
      data: any[];
    };

    if (!response.success) {
      throw new Error(`Failed to fetch navigation data`);
    }

    const pages = response.data;

    const tree: NavItem[] = [];

    // Build the navigation tree
    interface Page {
      slug: string;
      title: string;
      link: string | null;
      showInNav: boolean;
    }

    interface PageResponse {
      data: Page[];
    }

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

    // Fetch current affairs from the database
    const currentAffairsNavItem = await buildCurrentAffairsNavigation();

    // Merge static navigation items with the dynamic ones
    // First, filter out any potential conflicts (items with the same slug)
    const dynamicTopLevelSlugs = tree.map((item) => item.slug);
    // const filteredStaticItems = staticNavigationItems.filter(
    //   item => !dynamicTopLevelSlugs.includes(item.slug) && item.slug !== 'current-affairs' // Exclude static current-affairs
    // );

    // Combine the trees with our dynamic current affairs
    return [...tree, currentAffairsNavItem];
  } catch (error) {
    console.error("Error fetching navigation data:", error);
    return [];
  }
}

// Function to build the current affairs navigation structure from the database
async function buildCurrentAffairsNavigation(): Promise<NavItem> {
  // Create the base current affairs navigation item
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
    // Fetch daily sections
    const dailyResponse = (await api.get(`/currentAffair/type/daily`)) as {
      success: boolean;
      data: any[];
    };

    // Fetch monthly sections
    const monthlyResponse = (await api.get(`/currentAffair/type/monthly`)) as {
      success: boolean;
      data: any[];
    };

    // Fetch yearly sections
    const yearlyResponse = (await api.get(`/currentAffair/type/yearly`)) as {
      success: boolean;
      data: any[];
    };

    // Process daily sections
    if (dailyResponse.success) {
      const dailyData = dailyResponse.data;
      if (dailyResponse.success && dailyData) {
        const dailySections = dailyData;
        const dailyNavItems = currentAffairsNav.children.find(
          (item) => item.slug === "current-affairs/daily"
        );

        if (dailyNavItems) {
          dailyNavItems.children = dailySections
            .filter((section: CurrentAffairSection) => section.showInNav)
            .map((section: CurrentAffairSection) => {
              // Extract the last part of the slug for the path
              const pathSlug = section.slug.split("/").pop() || section.slug;
              const isCustomLink = section.link && section.link !== "";

              return {
                slug: `current-affairs/${pathSlug}`,
                title: section.title,
                link: section.link,
                children: [],
                showInNav: true,
              };
            });
        }
      }
    }

    // Process monthly sections
    if (monthlyResponse.success) {
      const monthlyData = monthlyResponse.data;
      if (monthlyData) {
        const monthlySections = monthlyData;
        const monthlyNavItems = currentAffairsNav.children.find(
          (item) => item.slug === "current-affairs/monthly"
        );

        if (monthlyNavItems) {
          monthlyNavItems.children = monthlySections
            .filter((section: CurrentAffairSection) => section.showInNav)
            .map((section: CurrentAffairSection) => {
              // Extract the last part of the slug for the path
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
      }
    }

    // Process yearly sections
    if (yearlyResponse.success) {
      const yearlyData = yearlyResponse.data;
      if (yearlyData) {
        const yearlySections = yearlyData;
        const yearlyNavItems = currentAffairsNav.children.find(
          (item) => item.slug === "current-affairs/yearly"
        );

        if (yearlyNavItems) {
          yearlyNavItems.children = yearlySections
            .filter((section: CurrentAffairSection) => section.showInNav)
            .map((section: CurrentAffairSection) => {
              // Extract the last part of the slug for the path
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
      }
    }
  } catch (error) {
    console.error("Error fetching current affairs sections:", error);
  }

  return currentAffairsNav;
}

export async function getFooterLinks(): Promise<NavItem[]> {
  try {
    const response = (await api.get(`/page/order`)) as {
      success: boolean;
      data: any[];
    };

    if (!response.success) {
      throw new Error(`Failed to fetch footer links data`);
    }

    const pages = response.data;

    const tree: NavItem[] = [];

    // Build the footer links tree (up to 2 levels)
    interface Page {
      slug: string;
      title: string;
      link: string | null;
    }

    pages?.forEach((page: Page) => {
      const parts: string[] = page.slug.split("/");
      if (parts.length > 2) return; // Skip deeper levels

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
