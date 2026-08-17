"use client";

import dynamic from "next/dynamic";

const AreaDrawMap = dynamic(() => import("./AreaDrawMap"), {
  ssr: false,
  loading: () => <div className="h-[400px] w-full bg-muted rounded-md flex items-center justify-center">Loading map...</div>,
});

export default AreaDrawMap;
