import prisma from "@/lib/prisma";
import { DocumentsClient } from "./documents-client";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Documents | MLA Platform",
  description: "Securely manage and share constituency documents",
};

export default async function DocumentsPage() {
  const documents = await prisma.document.findMany({
    orderBy: { createdAt: "desc" }
  });

  return <DocumentsClient initialDocuments={documents} />;
}
