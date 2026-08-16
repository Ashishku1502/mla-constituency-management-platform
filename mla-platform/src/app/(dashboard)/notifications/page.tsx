import prisma from "@/lib/prisma";
import { NotificationsClient } from "./notifications-client";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Notifications | MLA Platform",
  description: "Stay updated on activities, reports, issues, and assignments",
};

export default async function NotificationsPage() {
  const notifications = await prisma.notification.findMany({
    orderBy: { createdAt: "desc" }
  });

  const formattedNotifications = notifications.map(n => ({
    id: n.id,
    type: n.type,
    title: n.title,
    message: n.message,
    time: n.time,
    read: n.read,
  }));

  return <NotificationsClient initialNotifications={formattedNotifications} />;
}
