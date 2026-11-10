import type { MetadataRoute } from "next";
import { site } from "@/content/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: site.name,
    short_name: "CTL",
    description: site.description,
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#07101e",
    theme_color: "#07101e",
    icons: [
      { src: "/assets/brand/favicon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/assets/brand/favicon-512.png", sizes: "512x512", type: "image/png" },
      { src: "/assets/brand/favicon-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
