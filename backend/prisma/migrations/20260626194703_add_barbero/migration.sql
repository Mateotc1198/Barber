-- CreateTable
CREATE TABLE "Barbero" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nombre" TEXT NOT NULL,
    "fotoUrl" TEXT NOT NULL DEFAULT '',
    "descripcion" TEXT NOT NULL DEFAULT '',
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "orden" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Reserva" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "servicioId" TEXT NOT NULL,
    "barberoId" TEXT,
    "fecha" TEXT NOT NULL,
    "hora" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "telefono" TEXT NOT NULL DEFAULT '',
    "estado" TEXT NOT NULL DEFAULT 'pendiente',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Reserva_servicioId_fkey" FOREIGN KEY ("servicioId") REFERENCES "Servicio" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Reserva_barberoId_fkey" FOREIGN KEY ("barberoId") REFERENCES "Barbero" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Reserva" ("createdAt", "estado", "fecha", "hora", "id", "nombre", "servicioId", "telefono") SELECT "createdAt", "estado", "fecha", "hora", "id", "nombre", "servicioId", "telefono" FROM "Reserva";
DROP TABLE "Reserva";
ALTER TABLE "new_Reserva" RENAME TO "Reserva";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
