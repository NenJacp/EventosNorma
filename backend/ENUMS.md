# Documentación de Enums del Sistema

Este documento sirve como referencia para entender los valores numéricos almacenados en la base de datos para los diferentes estados y roles.

## 1. UserRole (Tabla `users`, columna `Role`)
Define los permisos del usuario dentro del sistema.

| ID | Nombre | Descripción |
|----|--------|-------------|
| 1  | User   | Usuario estándar. Puede crear y unirse a eventos. |
| 2  | Admin  | Administrador. Puede moderar usuarios y eventos. |

---

## 2. EventStatus (Tabla `events`, columna `Status`)
Define el estado actual de un evento.

| ID | Nombre | Descripción |
|----|--------|-------------|
| 1  | Open   | El evento está abierto y acepta inscripciones. |
| 2  | Closed | El evento ha sido cerrado o finalizado. |

---

**Nota:** Estos valores empiezan en 1 para evitar confusiones con el valor por defecto (0) de C#.
