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

## 3. UserTokenType (Tabla `user_tokens`, columna `Type`)
Tipo de token de verificación.

| ID | Nombre             | Descripción |
|----|--------------------|-------------|
| 1  | EmailVerification | Token para confirmar email del usuario. |
| 2  | PasswordReset      | Token para restablecer contraseña. |

---

## 4. EnrollmentStatus (Tabla `event_members`, columna `Status`)
Estado de la inscripción a un evento.

| ID | Nombre   | Descripción |
|----|----------|-------------|
| 1  | Pending  | Solicitada, esperando aprobación. |
| 2  | Approved | Aprobada, el usuario ya es miembro. |
| 3  | Rejected | Rechazada, no se unió al evento. |

---

**Nota:** Todos los valores empiezan en 1 para evitar confusiones con el valor por defecto (0) de C#.
