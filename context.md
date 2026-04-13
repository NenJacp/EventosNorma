# EventosNorma - Proyecto de Gestión de Eventos

## Descripción General

EventosNorma es una aplicación web completa para la gestión de eventos, construida con un stack tecnológico moderno.

## Stack Tecnológico

### Frontend
- **Framework**: Next.js (App Router)
- **Lenguaje**: TypeScript
- **Estilos**: Tailwind CSS
- **Íconos**: Lucide React
- **Puerto por defecto**: `3001` (expuesto como `3003`)

### Backend
- **Framework**: ASP.NET Core (.NET 9)
- **ORM**: Entity Framework Core
- **Lenguaje**: C#
- **Mensajería**: Wolverine
- **Puerto por defecto**: `8080`

### Base de Datos
- **Motor**: PostgreSQL 17 (Alpine)
- **Puerto por defecto**: `5432` (expuesto como `5434`)

## Infraestructura

### Docker Compose

El proyecto corre completamente en Docker mediante `docker-compose.yml`:

```bash
# Iniciar todos los servicios
sudo docker compose up -d

# Reconstruir un servicio específico
sudo docker compose up -d --build <servicio>

# Ver logs
sudo docker logs -f eventosnorma_backend
sudo docker logs -f eventosnorma_frontend
```

### Servicios

| Servicio   | Puerto interno | Puerto expuesto | Descripción                  |
|------------|----------------|-----------------|-------------------------------|
| `db`       | 5432           | 5434            | Base de datos PostgreSQL       |
| `backend`  | 8080           | 5000            | API REST de ASP.NET Core      |
| `frontend` | 3001           | 3003, 3004      | Aplicación Next.js            |

## Base de Datos

### Migraciones de Entity Framework

**IMPORTANTE**: Cada actualización del esquema de la base de datos requiere una nueva migración y la aplicación del `database update`.

#### Flujo de trabajo para cambios en la base de datos:

1. **Crear la migración** (desde la carpeta del proyecto de infraestructura):
   ```bash
   cd backend/src/EventosNorma.Infrastructure
   dotnet ef migrations add <NombreDeLaMigracion> --project ../EventosNorma.Infrastructure/EventosNorma.Infrastructure.csproj --startup-project ../EventosNorma.Presentation/EventosNorma.Presentation.csproj
   ```

2. **Aplicar la migración manualmente** (opcional, si no se usa auto-migrate):
   ```bash
   cd backend/src/EventosNorma.Presentation
   dotnet run -- migrate
   ```
   O directamente en el contenedor:
   ```bash
   sudo docker exec -it eventosnorma_backend dotnet run -- migrate
   ```

3. **Hacer commit** de la migración en el repositorio.

4. **En producción**: Reconstruir el contenedor del backend para que aplique las migraciones automáticamente al iniciar (si está configurado).

### Gestión de Migraciones en Desarrollo

- El backend tiene `db.Database.Migrate()` en el inicio para aplicar migraciones automáticamente en desarrollo.
- En producción se recomienda separar la aplicación de migraciones del startup de la aplicación.

## Variables de Entorno

El proyecto usa un archivo `.env` en la raíz:

```env
# DATABASE
EVENTOSNORMA_DB_HOST=db
EVENTOSNORMA_DB_PORT=5432
EVENTOSNORMA_DB_NAME=eventosnorma_db
EVENTOSNORMA_DB_USER=admin_eventos
EVENTOSNORMA_DB_PASSWORD=secure_password_123

# BACKEND / SECURITY
ASPNETCORE_ENVIRONMENT=Development
ASPNETCORE_URLS=http://+:80
JWT_SECRET_KEY=super_secret_key_12345678901234567890
JWT_ISSUER=EventosNorma
JWT_AUDIENCE=EventosNormaClient
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001,http://localhost:3003

# SMTP
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=cruzjorge.059.yuc@gmail.com
SMTP_PASS=sbdgolvfssukvuln

# FRONTEND
VITE_API_BASE_URL=/api
```

## URLs de Acceso

- **Frontend (desarrollo local)**: http://localhost:3003
- **Swagger API docs**: http://localhost:5000/swagger
- **Base de datos (desde host)**: `localhost:5434`

## Estructura del Proyecto

```
EventosNorma/
├── backend/                    # API ASP.NET Core
│   └── src/
│       ├── EventosNorma.Application/   # Lógica de aplicación
│       ├── EventosNorma.Domain/       # Entidades y lógica de dominio
│       ├── EventosNorma.Infrastructure/ # Persistencia y migraciones
│       └── EventosNorma.Presentation/  # API Controllers y Program.cs
├── frontend/                  # Aplicación Next.js
│   └── src/
│       ├── app/              # Rutas y páginas
│       ├── components/       # Componentes reutilizables
│       ├── lib/              # Utilidades y configuración
│       └── types/            # Definiciones TypeScript
├── docker-compose.yml        # Orquestación de servicios
└── .env                      # Variables de entorno
```

## Comandos Útiles

```bash
# Construir y levantar todos los servicios
sudo docker compose up -d --build

# Reiniciar solo el backend
sudo docker restart eventosnorma_backend

# Ver logs del backend
sudo docker logs -f eventosnorma_backend

# Acceder a la base de datos directamente
PGPASSWORD=secure_password_123 psql -h localhost -p 5434 -U admin_eventos -d eventosnorma_db

# Recrear la base de datos desde cero
sudo docker compose down -v
sudo docker compose up -d
```

## Notas Importantes

1. **Migraciones**: Cada cambio en entidades del dominio que afecte el esquema de la base de datos debe generar una nueva migración con `dotnet ef migrations add`.

2. **Seguridad**: La cookie JWT (`jwt`) se configura dinámicamente según si la conexión es HTTPS o HTTP.

3. **Tailscale**: El backend puede accederse remotamente mediante Tailscale usando la IP de la red mesh.

4. **Acceso a la DB**: PostgreSQL expone el puerto `5434` en el host para permitir conexiones desde herramientas como DBeaver.
