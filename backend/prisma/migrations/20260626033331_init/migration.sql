-- CreateTable
CREATE TABLE "Servicio" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "price" REAL NOT NULL,
    "category" TEXT NOT NULL,
    "imageUrls" TEXT NOT NULL DEFAULT '[]',
    "cupos" INTEGER NOT NULL DEFAULT 5,
    "duracionMinutos" INTEGER NOT NULL DEFAULT 30,
    "customOptions" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Admin" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "username" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Categoria" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nombre" TEXT NOT NULL,
    "imagenBanner" TEXT NOT NULL DEFAULT '',
    "orden" INTEGER NOT NULL DEFAULT 0,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "ContactInfo" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nombre" TEXT NOT NULL DEFAULT '',
    "fotoUrl" TEXT NOT NULL DEFAULT '',
    "instagram" TEXT,
    "facebook" TEXT,
    "whatsapp" TEXT,
    "tiktok" TEXT,
    "twitter" TEXT,
    "gmail" TEXT,
    "youtube" TEXT,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Admin_username_key" ON "Admin"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Categoria_nombre_key" ON "Categoria"("nombre");
