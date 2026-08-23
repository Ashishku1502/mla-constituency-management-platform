"use client";

import dynamic from "next/dynamic";

const WarRoomMap = dynamic(() => import("./WarRoomMap"), {
  ssr: false,
  loading: () => <div className="h-full w-full bg-muted/20 flex items-center justify-center">Loading Map...</div>,
});

export default function WarRoomMapDynamic({ filters }: { filters?: any }) {
  return <WarRoomMap filters={filters} />;
}
