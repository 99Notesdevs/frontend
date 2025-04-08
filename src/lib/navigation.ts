import { env } from '@/config/env';
import { NavItem } from '@/types/navigation';
// import { staticNavigationItems } from '@/config/staticNavigation';

// Interface for current affairs section from the database
interface CurrentAffairSection {
  id: number;
  title: string;
  content: string;
  type: string; // daily, monthly, yearly
  slug: string;
  createdAt: string;
  updatedAt: string;
}

export async function getNavigationTree(): Promise<NavItem[]> {
  const response = await fetch(`${env.API}/page/order`);
  const res = await response.json();
  const pages = res.data;
  // const pages = await prisma.page.findMany({
  //   select: {
  //     slug: true,
  //     title: true,
  //   },
  //   orderBy: {
  //     slug: 'asc',
  //   },
  // })

  const tree: NavItem[] = []

  // Build the navigation tree
  interface Page {
    slug: string;
    title: string;
  }

  interface PageResponse {
    data: Page[];
  }

  pages?.forEach((page: Page) => {
    const parts: string[] = page.slug.split('/');
    let currentLevel: NavItem[] = tree;

    parts?.forEach((part: string, index: number) => {
      const currentPath: string = parts.slice(0, index + 1).join('/');
      const existing: NavItem | undefined = currentLevel.find(item => item.slug === currentPath);

      if (existing) {
        currentLevel = existing.children;
      } else {
        const newItem: NavItem = {
          slug: currentPath,
          title: index === parts.length - 1 ? page.title : part,
          children: [],
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
  const dynamicTopLevelSlugs = tree.map(item => item.slug);
  // const filteredStaticItems = staticNavigationItems.filter(
  //   item => !dynamicTopLevelSlugs.includes(item.slug) && item.slug !== 'current-affairs' // Exclude static current-affairs
  // );

  // Combine the trees with our dynamic current affairs
  return [...tree, currentAffairsNavItem];
}

// Function to build the current affairs navigation structure from the database
async function buildCurrentAffairsNavigation(): Promise<NavItem> {
  // Create the base current affairs navigation item
  const currentAffairsNav: NavItem = {
    slug: 'current-affairs',
    title: 'Current Affairs',
    children: [
      {
        slug: 'current-affairs/daily',
        title: 'Daily Current Affairs',
        children: []
      },
      {
        slug: 'current-affairs/monthly',
        title: 'Monthly Current Affairs',
        children: []
      },
      {
        slug: 'current-affairs/yearly',
        title: 'Yearly Current Affairs',
        children: []
      }
    ]
  };

  try {
    // Fetch daily sections
    const dailyResponse = await fetch(`${env.API}/currentAffair/type/daily`, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Fetch monthly sections
    const monthlyResponse = await fetch(`${env.API}/currentAffair/type/monthly`, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Fetch yearly sections
    const yearlyResponse = await fetch(`${env.API}/currentAffair/type/yearly`, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Process daily sections
    if (dailyResponse.ok) {
      const dailyData = await dailyResponse.json();
      if (dailyData.status === 'success' && dailyData.data) {
        const dailySections = dailyData.data;
        const dailyNavItems = currentAffairsNav.children.find(item => item.slug === 'current-affairs/daily');
        
        if (dailyNavItems) {
          dailyNavItems.children = dailySections.map((section: CurrentAffairSection) => {
            // Extract the last part of the slug for the path
            const pathSlug = section.slug.split('/').pop() || section.slug;
            return {
              slug: `current-affairs/${pathSlug}`,
              title: section.title,
              children: []
            };
          });
        }
      }
    }

    // Process monthly sections
    if (monthlyResponse.ok) {
      const monthlyData = await monthlyResponse.json();
      if (monthlyData.status === 'success' && monthlyData.data) {
        const monthlySections = monthlyData.data;
        const monthlyNavItems = currentAffairsNav.children.find(item => item.slug === 'current-affairs/monthly');
        
        if (monthlyNavItems) {
          monthlyNavItems.children = monthlySections.map((section: CurrentAffairSection) => {
            // Extract the last part of the slug for the path
            const pathSlug = section.slug.split('/').pop() || section.slug;
            return {
              slug: `current-affairs/${pathSlug}`,
              title: section.title,
              children: []
            };
          });
        }
      }
    }

    // Process yearly sections
    if (yearlyResponse.ok) {
      const yearlyData = await yearlyResponse.json();
      if (yearlyData.status === 'success' && yearlyData.data) {
        const yearlySections = yearlyData.data;
        const yearlyNavItems = currentAffairsNav.children.find(item => item.slug === 'current-affairs/yearly');
        
        if (yearlyNavItems) {
          yearlyNavItems.children = yearlySections.map((section: CurrentAffairSection) => {
            // Extract the last part of the slug for the path
            const pathSlug = section.slug.split('/').pop() || section.slug;
            return {
              slug: `current-affairs/${pathSlug}`,
              title: section.title,
              children: []
            };
          });
        }
      }
    }
  } catch (error) {
    console.error('Error fetching current affairs sections:', error);
  }

  return currentAffairsNav;
}

export async function getFooterLinks(): Promise<NavItem[]> {
  const response = await fetch(`${env.API}/page/order`);
  const res = await response.json();
  const pages = res.data;
  // const pages = await prisma.page.findMany({
  //   select: {
  //     slug: true,
  //     title: true,
  //   },
  //   orderBy: {
  //     slug: 'asc',
  //   },
  // })

  const tree: NavItem[] = []

  // Build the footer links tree (up to 2 levels)
  interface Page {
    slug: string;
    title: string;
  }

  pages?.forEach((page: Page) => {
    const parts: string[] = page.slug.split('/');
    if (parts.length > 2) return; // Skip deeper levels

    let currentLevel: NavItem[] = tree;

    parts?.forEach((part: string, index: number) => {
      const currentPath: string = parts.slice(0, index + 1).join('/');
      const existing: NavItem | undefined = currentLevel.find(item => item.slug === currentPath);

      if (existing) {
        currentLevel = existing.children;
      } else {
        const newItem: NavItem = {
          slug: currentPath,
          title: index === parts.length - 1 ? page.title : part,
          children: [],
        };
        currentLevel.push(newItem);
        currentLevel = newItem.children;
      }
    });
  });

  return tree;
}