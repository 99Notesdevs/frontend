export interface NavItem {
  slug: string;
  title: string;
  children: NavItem[];
  link: string | null;
}
