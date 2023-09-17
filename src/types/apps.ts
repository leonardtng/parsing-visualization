export interface App {
  name: string;
  favicon: string;
  title: string;
  description: string;
  image: string;
  path: string;
}

export type PageKey = "home" | "notFound";

export type Apps = Record<PageKey, App>;
