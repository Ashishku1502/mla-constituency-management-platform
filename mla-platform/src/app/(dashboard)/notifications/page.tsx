import prisma from "@/lib/prisma";
import { NotificationsClient } from "./notifications-client";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Notifications | MLA Platform",
  description: "Stay updated on activities, reports, issues, and assignments",
};

export default async function NotificationsPage() {
  try {
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
  } catch (error) {
    console.warn("Database connection error on Notifications. Falling back to mock data.");
    const mockNotifications = [
      { id: "1", type: "Issue", title: "New Critical Issue", message: "Water supply disrupted in North Hills.", time: "10 mins ago", read: false },
      { id: "2", type: "Activity", title: "Activity Completed", message: "Health camp organized in Westside Valley.", time: "1 hour ago", read: false },
      { id: "3", type: "System", title: "System Update", message: "Platform maintenance scheduled for tonight.", time: "3 hours ago", read: true },
      { id: "4", type: "Report", title: "New Ground Report", message: "Survey completed by Team Alpha.", time: "1 day ago", read: true }
    ];

    return <NotificationsClient initialNotifications={mockNotifications} />;
  }
}
