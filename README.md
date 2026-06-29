# Barber — Sitio web de barbería

Aplicación web completa para una barbería. Incluye catálogo de servicios, sistema de reservas con disponibilidad en tiempo real y panel de administración.

## Tecnologías

- **Frontend:** Next.js 16 + TailwindCSS 4
- **Backend:** Express + TypeScript + Prisma + PostgreSQL
- **Imágenes:** Cloudinary
- **Deploy:** Railway

---

## Requisitos

- Node.js 18+
- npm
- Base de datos PostgreSQL (Railway, Neon, Supabase o local)
- Cuenta de Cloudinary (para subida de imágenes)

---

## Instalación local

1. Clonar el repositorio:

```bash
git clone https://github.com/Mateotc1198/Barber.git
cd Barber
```

2. Crear `backend/.env`:

```env
DATABASE_URL="postgresql://usuario:password@host:5432/nombre_db"
JWT_SECRET="tu-secreto-seguro-de-al-menos-32-caracteres"
PORT=4000
ORIGEN_FRONTEND="http://localhost:3000"
ADMIN_USUARIO="admin"
ADMIN_PASSWORD="tu-password"
CLOUDINARY_CLOUD_NAME="tu-cloud-name"
CLOUDINARY_API_KEY="tu-api-key"
CLOUDINARY_API_SECRET="tu-api-secret"
```

3. Crear `frontend/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:4000
```

4. Instalar e iniciar:

```bash
npm install
npm run setup
npm run dev
```

La app queda disponible en **http://localhost:3000**

> Las migraciones y datos de ejemplo se aplican automáticamente al iniciar.

---

## Panel de administración

Ir a **/admin/login**

| Campo    | Valor configurado en `ADMIN_USUARIO` / `ADMIN_PASSWORD` |
|----------|----------------------------------------------------------|
| Usuario  | `admin` (por defecto)                                    |
| Password | `admin1234` (por defecto)                                |

Desde el admin puedes:

- Ver y gestionar la agenda de reservas por barbero y fecha
- Agregar, editar y eliminar barberos
- Gestionar servicios e imágenes (subida directa o por URL)
- Editar la información de contacto
- Administrar categorías

---

## Deploy en Railway

El proyecto está configurado para Railway con autodeploy desde GitHub.

### Variables de entorno requeridas en Railway

**Servicio backend:**

| Variable | Descripción |
|----------|-------------|
| `DATABASE_URL` | URL de la base de datos PostgreSQL (referencia al plugin de Railway) |
| `JWT_SECRET` | Secreto para firmar los tokens JWT |
| `NODE_ENV` | `production` |
| `ORIGEN_FRONTEND` | URL del frontend en Railway |
| `ADMIN_USUARIO` | Usuario del panel de administración |
| `ADMIN_PASSWORD` | Contraseña del panel de administración |
| `CLOUDINARY_CLOUD_NAME` | Cloud name de Cloudinary |
| `CLOUDINARY_API_KEY` | API key de Cloudinary |
| `CLOUDINARY_API_SECRET` | API secret de Cloudinary |

**Servicio frontend:**

| Variable | Descripción |
|----------|-------------|
| `NEXT_PUBLIC_API_URL` | URL del backend en Railway |

Cada `git push` a `master` redeploya automáticamente ambos servicios.

---

## Estructura del proyecto

```
Barber/
├── backend/          # API REST (Express + Prisma)
│   ├── prisma/       # Schema y migraciones de la DB
│   └── src/
│       ├── application/     # Lógica de negocio
│       ├── domain/          # Entidades e interfaces
│       ├── infrastructure/  # DB, seguridad, seed, imágenes
│       └── interfaces/      # Rutas HTTP
└── frontend/         # Aplicación web (Next.js)
    └── src/
        ├── app/             # Páginas
        ├── components/      # Componentes UI
        ├── infrastructure/  # Clientes API
        └── types/           # Tipos TypeScript
```
