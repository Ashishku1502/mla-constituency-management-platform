-- AlterTable
ALTER TABLE "Area" ADD COLUMN "boundaryData" TEXT;
ALTER TABLE "Area" ADD COLUMN "centerLat" REAL;
ALTER TABLE "Area" ADD COLUMN "centerLng" REAL;

-- AlterTable
ALTER TABLE "Constituency" ADD COLUMN "boundaryData" TEXT;
ALTER TABLE "Constituency" ADD COLUMN "centerLat" REAL;
ALTER TABLE "Constituency" ADD COLUMN "centerLng" REAL;
ALTER TABLE "Constituency" ADD COLUMN "mapZoom" INTEGER;

-- AlterTable
ALTER TABLE "PollingStation" ADD COLUMN "latitude" REAL;
ALTER TABLE "PollingStation" ADD COLUMN "longitude" REAL;

-- AlterTable
ALTER TABLE "Ward" ADD COLUMN "boundaryData" TEXT;
ALTER TABLE "Ward" ADD COLUMN "centerLat" REAL;
ALTER TABLE "Ward" ADD COLUMN "centerLng" REAL;
