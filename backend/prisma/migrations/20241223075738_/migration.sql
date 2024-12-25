-- CreateTable
CREATE TABLE "Goodie" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "price" REAL NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "editedAt" DATETIME NOT NULL,
    "originalPrice" REAL,
    "updatedPrice" REAL
);
