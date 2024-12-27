-- CreateTable
CREATE TABLE "Goodie" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "price" REAL NOT NULL,
    "amount" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "AuditLog" (
    "editId" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "goodieId" TEXT NOT NULL,
    "oldName" TEXT NOT NULL,
    "oldPrice" REAL NOT NULL,
    "oldAmount" INTEGER NOT NULL,
    "timestamp" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "AuditLog_goodieId_fkey" FOREIGN KEY ("goodieId") REFERENCES "Goodie" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "AuditLog_goodieId_idx" ON "AuditLog"("goodieId");
