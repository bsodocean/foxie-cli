-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_AuditLog" (
    "editId" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "goodieId" TEXT NOT NULL,
    "oldName" TEXT NOT NULL,
    "oldPrice" REAL NOT NULL,
    "oldAmount" INTEGER NOT NULL,
    "timestamp" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "AuditLog_goodieId_fkey" FOREIGN KEY ("goodieId") REFERENCES "Goodie" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_AuditLog" ("editId", "goodieId", "oldAmount", "oldName", "oldPrice", "timestamp") SELECT "editId", "goodieId", "oldAmount", "oldName", "oldPrice", "timestamp" FROM "AuditLog";
DROP TABLE "AuditLog";
ALTER TABLE "new_AuditLog" RENAME TO "AuditLog";
CREATE INDEX "AuditLog_goodieId_idx" ON "AuditLog"("goodieId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
