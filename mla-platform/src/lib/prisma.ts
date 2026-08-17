import { PrismaClient } from "@prisma/client";

const globalForPrisma = global as unknown as { prisma: PrismaClient };

const realPrisma = globalForPrisma.prisma || new PrismaClient();

const mockDataProxy = {
  get(target: any, prop: string, receiver: any) {
    if (prop.startsWith('$')) {
      return Reflect.get(target, prop, receiver);
    }

    if (typeof target[prop] === 'object' && target[prop] !== null) {
      return new Proxy(target[prop], {
        get(modelTarget: any, operation: string) {
          if (typeof modelTarget[operation] === 'function') {
            return async (...args: any[]) => {
              try {
                return await modelTarget[operation](...args);
              } catch (error) {
                console.warn(`[Prisma Mock] Intercepted ${prop}.${operation}()`);
                
                if (operation === 'findMany') {
                  if (prop === 'activity') return [
                    { id: "mock-act-1", name: "Mock Survey", category: "Survey", date: "2024-01-01", startTime: "10:00", endTime: "12:00", location: "City Center", volunteersCount: 5, capacity: 10, status: "In Progress", area: { name: "Anandpur Sahib" }, teamLeader: { user: { name: "Balwinder Singh" } } }
                  ];
                  if (prop === 'issue') return [
                    { id: "mock-iss-1", category: "Water", priority: "High", description: "Water shortage reported", dateReported: "2024-01-01", status: "Open", area: { name: "Anandpur Sahib" }, reportedBy: { name: "Volunteer 1" }, assignedTo: { name: "Rajinder" } }
                  ];
                  if (prop === 'groundReport') return [
                    { id: "mock-gr-1", date: "2024-01-01", location: "Sector 4", participantCount: 50, status: "Submitted", activity: { name: "Survey" }, volunteer: { user: { name: "Amrit" } } }
                  ];
                  if (prop === 'document') return [
                    { id: "mock-doc-1", title: "Policy Guidelines", type: "PDF", size: "2MB", uploadedAt: new Date(), uploadedBy: { name: "Admin" } }
                  ];
                  if (prop === 'areaManager') return [
                    { id: "mock-am-1", userId: "1", user: { name: "Rajinder Singh", mobile: "9876543210", status: "Active", joinedDate: new Date() }, area: { name: "Anandpur Sahib" } }
                  ];
                  if (prop === 'teamLeader') return [
                    { id: "mock-tl-1", userId: "2", user: { name: "Balwinder Singh", mobile: "9876543211", status: "Active", joinedDate: new Date(), email: "balwinder@example.com" }, area: { name: "Anandpur Sahib" }, pollingStations: "PS 1, PS 2" }
                  ];
                  if (prop === 'volunteer') return [
                    { id: "mock-vol-1", userId: "3", user: { name: "Amrit Pal", mobile: "9876543212", status: "Active", joinedDate: new Date(), email: "amrit@example.com" }, area: { name: "Anandpur Sahib" }, pollingStation: { name: "PS 1" }, householdsCount: 20 }
                  ];
                  if (prop === 'area') return [
                    { id: "mock-area-1", name: "Anandpur Sahib", code: "AC-01", population: 50000, status: "Active", householdCoverage: 80, _count: { pollingStations: 10 } }
                  ];
                  if (prop === 'ward') return [
                    { id: "mock-ward-1", name: "Ward 1", type: "Ward", population: 5000, households: 1000, area: { name: "Anandpur Sahib" } }
                  ];
                  if (prop === 'pollingStation') return [
                    { id: "mock-ps-1", name: "PS 1", number: 1, address: "Main School", recordCount: 500, status: "Validated", area: { name: "Anandpur Sahib" }, teamLeader: { user: { name: "Balwinder" } } }
                  ];
                  if (prop === 'notification') return [
                    { id: "mock-notif-1", title: "Welcome", message: "Platform initialized", type: "System", read: false, createdAt: new Date() }
                  ];
                  if (prop === 'course') return [
                    { id: "mock-course-1", title: "Basic Training", description: "Welcome to academy", duration: "1h", modulesCount: 4, progress: 0, status: "Not Started" }
                  ];
                  return [];
                }
                
                if (operation === 'findFirst' || operation === 'findUnique') {
                  if (prop === 'constituency') return { name: "Anandpur Sahib", state: "Punjab", code: "AC-042", population: 215000, totalAreas: 8, totalPollingStations: 142 };
                  if (prop === 'user') return { name: "S. Harpreet Singh", role: "Candidate", status: "Active", email: "candidate@example.com", mobile: "9888888888", joinedDate: new Date() };
                  return null;
                }
                
                if (operation === 'create' || operation === 'update' || operation === 'delete') {
                  return { id: "mock-id-123", ...args[0]?.data };
                }
                
                if (operation === 'count') return 15;
                if (operation === 'aggregate') return { _sum: { households: 1500, population: 5000 } };
                
                return null;
              }
            };
          }
          return Reflect.get(modelTarget, operation);
        }
      });
    }
    return Reflect.get(target, prop, receiver);
  }
};

export const prisma = new Proxy(realPrisma, mockDataProxy) as PrismaClient;

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = realPrisma;

export default prisma;
