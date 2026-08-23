import { WarRoomMapClient } from "./war-room-map-client";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Live War Room Map | MLA Platform",
  description: "Full-screen real-time live map of ground reports and critical issues",
};

export default function LiveMapPage() {
  return <WarRoomMapClient />;
}
