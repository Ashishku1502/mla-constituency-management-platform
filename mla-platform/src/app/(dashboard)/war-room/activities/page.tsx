import { WarRoomActivitiesClient } from "./war-room-activities-client";

export const metadata = {
  title: "War Room Activities | MLA Platform",
  description: "Live tracking of activities and dynamic winning score calculation.",
};

const mockMetrics = {
  winningPrediction: 30,
  voterSentiment: 24,
  activityExecution: 40,
  completedActivities: 2,
  totalActivitiesTarget: 5,
  totalActivities: 5,
  completed: 2,
  pending: 3,
  votersTagged: 5,
};

const mockActivities: any[] = [
  {
    id: "act-1",
    name: "100 aadmi ko khane pe bulaye",
    location: "Mustafabad (Demo) - Ward 2",
    assignedTo: "vasu",
    status: "running"
  },
  {
    id: "act-2",
    name: "vraksharopan",
    location: "Mustafabad (Demo) - Ward 2",
    assignedTo: "vasu",
    status: "cancelled"
  },
  {
    id: "act-3",
    name: "100 aadmi ko khane pe bulaye",
    location: "Mustafabad (Demo) - Ward 1",
    assignedTo: "janu",
    status: "created"
  },
  {
    id: "act-4",
    name: "vraksharopan",
    location: "Mustafabad (Demo) - Ward 1",
    assignedTo: "janu",
    status: "completed"
  },
  {
    id: "act-5",
    name: "vraksharopan",
    location: "Mustafabad (Demo) - Ward 1",
    assignedTo: "janu",
    status: "completed"
  }
];

export default function WarRoomActivitiesPage() {
  return (
    <WarRoomActivitiesClient metrics={mockMetrics} activities={mockActivities} />
  );
}
