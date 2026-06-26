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

## Instalación y uso

```bash
git clone https://github.com/Mateotc1198/Barber.git
cd Barber
npm install
npm run setup
npm run dev
```

La app queda disponible en **http://localhost:3000**

> La base de datos, migraciones y datos de ejemplo se crean automáticamente al iniciar.

---

## Panel de administración

Ir a **http://localhost:3000/admin/login**

| Campo    | Valor      |
|----------|------------|
| Usuario  | `admin`    |
| Password | `admin1234` |

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

---

## Variables de entorno (opcional)

Solo necesarias si quieres cambiar la configuración por defecto.

**`backend/.env`**
```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="tu-secreto-seguro-de-al-menos-32-caracteres"
PORT=4000
ORIGEN_FRONTEND="http://localhost:3000"
ADMIN_USUARIO="admin"
ADMIN_PASSWORD="tu-password"
```

**`frontend/.env.local`**
```env
NEXT_PUBLIC_API_URL=http://localhost:4000
```
