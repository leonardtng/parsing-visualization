import { Apps } from "@/types";

export const APPS: Apps = {
  home: {
    name: `${process.env.NEXT_PUBLIC_SITE_NAME}`,
    favicon: "/favicon.png",
    title: `${process.env.NEXT_PUBLIC_SITE_NAME}`,
    description: "",
    image: "",
    path: "/",
  },
  notFound: {
    name: "404",
    favicon: "/favicon.png",
    title: "Something Went Wrong",
    description: "",
    image: "",
    path: "/404",
  },
};
