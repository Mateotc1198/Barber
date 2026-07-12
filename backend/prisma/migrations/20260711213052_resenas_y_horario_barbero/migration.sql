-- AlterTable
ALTER TABLE "Barbero" ADD COLUMN     "horario" TEXT NOT NULL DEFAULT '[]';

-- CreateTable
CREATE TABLE "Resena" (
    "id" TEXT NOT NULL,
    "barberoId" TEXT NOT NULL,
    "nombreCliente" TEXT NOT NULL,
    "calificacion" INTEGER NOT NULL,
    "comentario" TEXT NOT NULL DEFAULT '',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Resena_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Resena" ADD CONSTRAINT "Resena_barberoId_fkey" FOREIGN KEY ("barberoId") REFERENCES "Barbero"("id") ON DELETE CASCADE ON UPDATE CASCADE;
