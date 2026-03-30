# Objetivo del Proyecto: Sistema de Eventos (EventosNorma)

## 1. Propósito General
Crear una plataforma de gestión de eventos donde los usuarios puedan descubrir, visualizar y unirse a eventos de diversas categorías.

## 2. Roles del Sistema
### Usuario Estándar
- Puede registrarse e iniciar sesión.
- Puede explorar eventos disponibles.
- Puede unirse a eventos.
- **Puede crear sus propios eventos.**
- Puede gestionar su perfil.

### Usuario Administrador
- Posee permisos elevados de supervisión.
- **No crea eventos propios**, su rol es de moderación.
- Capacidad para supervisar todos los eventos (incluyendo eventos privados).
- **Puede eliminar o activar/desactivar eventos** según sea necesario.
- Gestión de usuarios y acceso a métricas del sistema.

## 3. Arquitectura y Escalabilidad
- **Clean Architecture:** El sistema separa estrictamente las reglas de negocio (Application/Domain) de los detalles técnicos (Infrastructure).
- **Patrón Mediator:** Se utiliza Wolverine para desacoplar los controladores de la lógica de ejecución.
- **Escalabilidad:** Se utilizan configuraciones de entidad separadas y repositorios para permitir un crecimiento infinito de tablas sin perder legibilidad.
