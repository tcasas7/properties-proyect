# 🏠 Proyecto de Propiedades

Aplicación fullstack para gestión de propiedades y disponibilidad, con autenticación de administrador, subida de imágenes, y panel de control.

---

## 📦 Stack Tecnológico

- **Frontend:** Next.js + Tailwind CSS
- **Backend:** NestJS + Prisma + PostgreSQL
- **Autenticación:** JWT
- **Subida de Imágenes:** Local vía Multer
- **Monorepo:** apps/frontend, apps/backend, shared

---

## 🚀 Cómo levantar el proyecto

### 1. Clonar el repositorio

```bash
git clone https://github.com/tcasas7/properties-proyect.git
cd propiedades-proyect

2. Instalar dependencias 
cd apps/backend && npm install
cd ../frontend && npm install


3. Crear archivos de entorno
Copiar y configurar los archivos .env:

apps/backend/.env
DATABASE_URL=postgresql://usuario:contraseña@localhost:5432/propiedades_db
JWT_SECRET=algoseguro
PORT=4000

apps/frontend/.env.local
NEXT_PUBLIC_BACKEND_URL=http://localhost:4000

4. Crear base de datos
Crear una base de datos local llamada propiedades_db.
DATABASE_URL=postgresql://propiedades_user:propiedades_pass@localhost:5432/propiedades_db

5. Ejecutar migraciones
cd apps/backend
npx prisma migrate dev

Backend (NestJS)
cd apps/backend
npm run start:dev

El backend queda disponible en: http://localhost:4000

Frontend (Next.js)
cd apps/frontend
npm run dev

El frontend queda disponible en: http://localhost:3000