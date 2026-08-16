"use client";

import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";

// MapComponent heavily relies on window and Leaflet, which causes SSR errors
// if imported normally. We dynamically import it with ssr: false.
const MapComponent = dynamic(() => import("./MapComponent"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-muted/20">
      <Skeleton className="w-full h-full rounded-md" />
    </div>
  ),
});

export default MapComponent;
