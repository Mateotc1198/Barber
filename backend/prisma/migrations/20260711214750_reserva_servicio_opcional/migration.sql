-- DropForeignKey
ALTER TABLE "Reserva" DROP CONSTRAINT "Reserva_servicioId_fkey";

-- AlterTable
ALTER TABLE "Reserva" ALTER COLUMN "servicioId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Reserva" ADD CONSTRAINT "Reserva_servicioId_fkey" FOREIGN KEY ("servicioId") REFERENCES "Servicio"("id") ON DELETE SET NULL ON UPDATE CASCADE;
