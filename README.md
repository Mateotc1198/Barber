# Barber — Sitio web de barbería

Aplicación web completa para una barbería. Incluye catálogo de servicios, sistema de reservas con disponibilidad en tiempo real y panel de administración.

## Tecnologías

- **Frontend:** Next.js 16 + TailwindCSS 4
- **Backend:** Express + TypeScript + Prisma + SQLite

---

## Requisitos

- Node.js 18+
- npm

---

## Instalación

### 1. Clonar el repositorio

```bash
git clone https://github.com/Mateotc1198/Barber.git
cd Barber
```

### 2. Configurar el backend

```bash
cd backend
cp .env.example .env
```

Abrir `backend/.env` y completar los valores:

```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="pon-aqui-una-cadena-larga-de-al-menos-32-caracteres"
PORT=4000
ORIGEN_FRONTEND="http://localhost:3000"
URL_PUBLICA="http://localhost:4000"
ADMIN_USUARIO="admin"
ADMIN_PASSWORD="pon-tu-password-aqui"
```

Instalar dependencias, crear la base de datos y ejecutar el seed:

```bash
npm install
npx prisma migrate deploy
npx tsx prisma/seed.ts
```

### 3. Configurar el frontend

```bash
cd ../frontend
cp .env.local.example .env.local
```

El archivo `.env.local` ya viene listo para desarrollo local:

```env
NEXT_PUBLIC_API_URL=http://localhost:4000
```

Instalar dependencias:

```bash
npm install
```

---

## Correr la aplicación

Necesitas dos terminales abiertas al mismo tiempo.

**Terminal 1 — Backend:**

```bash
cd backend
npm run dev
```

**Terminal 2 — Frontend:**

```bash
cd frontend
npm run dev
```

La app queda disponible en `http://localhost:3000`

---

## Panel de administración

Ir a `http://localhost:3000/admin/login`

Las credenciales son las que configuraste en `backend/.env`:

- **Usuario:** valor de `ADMIN_USUARIO`
- **Password:** valor de `ADMIN_PASSWORD`

Desde el admin puedes:

- Ver y gestionar la agenda de reservas por barbero y fecha
- Agregar, editar y eliminar barberos
- Gestionar servicios e imágenes
- Editar la información de contacto
- Administrar categorías

---

## Estructura del proyecto

```
Barber/
├── backend/          # API REST (Express + Prisma)
│   ├── prisma/       # Schema y migraciones de la DB
│   └── src/
│       ├── application/     # Lógica de negocio
│       ├── domain/          # Entidades e interfaces
│       ├── infrastructure/  # DB, seguridad, seed
│       └── interfaces/      # Rutas HTTP
└── frontend/         # Aplicación web (Next.js)
    └── src/
        ├── app/             # Páginas
        ├── components/      # Componentes UI
        ├── infrastructure/  # Clientes API
        └── types/           # Tipos TypeScript
```
