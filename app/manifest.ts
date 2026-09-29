import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "NovaMart — Modern Shopping",
    short_name: "NovaMart",
    description: "A modern marketplace with global pricing, fast checkout, and order tracking.",
    start_url: "/",
    display: "standalone",
    background_color: "#f7f5f2",
    theme_color: "#1c1917",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml"
      },
      {
        src: "/apple-icon.svg",
        sizes: "180x180",
        type: "image/svg+xml"
      }
    ]
  };
}
