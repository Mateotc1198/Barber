# Barber — Sitio web de barbería

Aplicación web completa para una barbería con catálogo de servicios, sistema de reservas en tiempo real y panel de administración.

**Stack:** Next.js 16 · Express · TypeScript · Prisma · PostgreSQL · Cloudinary · Railway

---

## Demo en producción

| Servicio | URL |
|----------|-----|
| Sitio web | https://zealous-light-production-afee.up.railway.app |
| API | https://barber-production-3f60.up.railway.app/health |

---

## Funcionalidades

- Catálogo de servicios organizado por categorías con carrusel
- Sistema de reservas con selección de barbero, fecha y hora
- Disponibilidad en tiempo real (bloquea cupos ya reservados)
- Panel de administración protegido con JWT
- Subida de imágenes a Cloudinary o por URL externa
- Diseño responsive (móvil y escritorio)
- Modo oscuro / claro

---

## Instalación local

### Requisitos previos

Antes de comenzar necesitas tener listo:

- **Node.js 18+** — [nodejs.org](https://nodejs.org)
- **Base de datos PostgreSQL** — puedes crear una gratis en [neon.tech](https://neon.tech) o usar la de Railway
- **Cuenta de Cloudinary** — gratis en [cloudinary.com](https://cloudinary.com) (para subir imágenes)

### Pasos

**1. Clonar el repositorio**

```bash
git clone https://github.com/Mateotc1198/Barber.git
cd Barber
```

**2. Configurar el backend**

Crea el archivo `backend/.env` con tus datos:

```env
# Base de datos (obtén la URL desde Neon, Railway o tu instancia local)
DATABASE_URL="postgresql://usuario:password@host:5432/nombre_db"

# Seguridad (pon cualquier string largo y aleatorio)
JWT_SECRET="cambia-esto-por-un-secreto-seguro"

# Puerto del servidor (puedes dejarlo en 4000)
PORT=4000

# URL del frontend (no cambiar en local)
ORIGEN_FRONTEND="http://localhost:3000"

# Credenciales del admin (cámbialas por las tuyas)
ADMIN_USUARIO="admin"
ADMIN_PASSWORD="tu-password-seguro"

# Cloudinary (obtenlas en cloudinary.com → Dashboard)
CLOUDINARY_CLOUD_NAME="tu-cloud-name"
CLOUDINARY_API_KEY="tu-api-key"
CLOUDINARY_API_SECRET="tu-api-secret"
```

**3. Configurar el frontend**

Crea el archivo `frontend/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:4000
```

**4. Instalar e iniciar**

```bash
npm install
npm run setup
npm run dev
```

La app queda disponible en **http://localhost:3000**

> Las migraciones de base de datos y los datos de ejemplo se crean automáticamente al iniciar por primera vez.

---

## Panel de administración

Accede en **/admin/login** con las credenciales que definiste en `ADMIN_USUARIO` y `ADMIN_PASSWORD`.

Por defecto: usuario `admin`, contraseña `admin1234`.

Desde el admin puedes:

- Gestionar la agenda de reservas por barbero y fecha
- Agregar, editar y eliminar barberos
- Gestionar servicios con imágenes (subida directa o por URL)
- Editar información de contacto y redes sociales
- Administrar categorías con imágenes banner

---

## Deploy en Railway

El proyecto usa **Railway** para el hosting. Cada `git push` a `master` redeploya automáticamente el backend y el frontend.

### Estructura en Railway

```
Proyecto Railway
├── Barber (backend)   ← root directory: backend/
├── Frontend           ← root directory: frontend/
└── Postgres           ← plugin de base de datos
```

### Variables de entorno

**Servicio backend** (root: `backend/`):

| Variable | Valor |
|----------|-------|
| `DATABASE_URL` | Referencia al plugin Postgres de Railway |
| `JWT_SECRET` | String largo y aleatorio |
| `NODE_ENV` | `production` |
| `ORIGEN_FRONTEND` | URL del servicio frontend |
| `ADMIN_USUARIO` | Usuario del panel admin |
| `ADMIN_PASSWORD` | Contraseña del panel admin |
| `CLOUDINARY_CLOUD_NAME` | Desde cloudinary.com → Dashboard |
| `CLOUDINARY_API_KEY` | Desde cloudinary.com → Dashboard |
| `CLOUDINARY_API_SECRET` | Desde cloudinary.com → Dashboard |

**Servicio frontend** (root: `frontend/`):

| Variable | Valor |
|----------|-------|
| `NEXT_PUBLIC_API_URL` | URL del servicio backend |

---

## Estructura del proyecto

```
Barber/
├── backend/                   # API REST
│   ├── prisma/
│   │   ├── schema.prisma      # Modelos de la base de datos
│   │   └── migrations/        # Migraciones SQL
│   └── src/
│       ├── application/       # Lógica de negocio (servicios)
│       ├── domain/            # Entidades, interfaces y errores
│       ├── infrastructure/    # DB, seguridad, Cloudinary, seed
│       └── interfaces/        # Rutas HTTP y middlewares
└── frontend/                  # Aplicación web
    └── src/
        ├── app/               # Páginas (Next.js App Router)
        ├── components/        # Componentes UI reutilizables
        ├── infrastructure/    # Clientes de la API
        ├── state/             # Contexto global
        └── types/             # Tipos TypeScript
```
