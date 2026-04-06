# Validaciones de Registro (Backend Sync)

Estas son las validaciones actuales que el backend aplica en el registro de usuarios. Deben reflejarse en el frontend para evitar errores 400 inesperados.

### 1. Nombres (FirstName / LastName)
- **Requerido:** Sí.
- **Longitud Mínima:** 2 caracteres (Dominio).
- **Longitud Máxima:** 50 caracteres (Aplicación).
- **Patrón (Regex):** `^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$`
    - *Descripción:* Solo letras (incluye tildes, eñes, espacios). No permite números ni caracteres especiales como `@#$%`.

### 2. Correo Electrónico (Email)
- **Requerido:** Sí.
- **Formato:** Email estándar.
- **Patrón (Regex):** `^[^@\s]+@[^@\s]+\.[^@\s]+$`
    - *Descripción:* Valida estructura básica de email sin espacios.

### 3. Contraseña (Password)
- **Requerido:** Sí.
- **Longitud Mínima:** 8 caracteres.
- **Restricciones Actuales:** El backend **solo** valida longitud mínima de 8. No está pidiendo obligatoriamente mayúsculas, números o caracteres especiales todavía.

---
*Nota: Si se planea endurecer la seguridad de la contraseña (ej. pedir una mayúscula y un número), se debe avisar para actualizar el `RegisterUserValidator.cs` en el backend.*
