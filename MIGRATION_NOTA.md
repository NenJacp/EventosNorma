# Nota de cambios - 2026-04-13

## Cambios realizados

### Migrations
- Creada migración: `20260413000000_AddMemberBannedFields.cs`
- Agregadas columnas a la tabla `event_members`:
  - `IsBanned` (boolean, default: false)
  - `BannedAt` (timestamp with time zone, nullable)

### Archivos modificados
- `AppDbContextModelSnapshot.cs` - Actualizado para incluir las nuevas columnas

## No toqué diseño
No se modificó ningún archivo de frontend ni de estilos.
