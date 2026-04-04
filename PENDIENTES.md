# Pendientes

## 1. Validación de nombres muy restrictiva

**Descripción:** El regex `[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+` usado en las validaciones de nombres no permite caracteres comunes como:
- Guiones: `"María-Jose"`
- Apóstrofos: `"O'Connor"`
- Puntos: `"Jr."`

**Archivos afectados:**
- `backend/src/EventosNorma.Domain/Entities/User.cs:15` - `NameRegex`
- `backend/src/EventosNorma.Domain/Catalogs/Country.cs:9` - `NameRegex`
- `backend/src/EventosNorma.Domain/Catalogs/State.cs:9` - `NameRegex`
- `backend/src/EventosNorma.Domain/Catalogs/City.cs:10` - `NameRegex`

**Propuesta:** Actualizar el regex para permitir guiones, apóstrofos y puntos. Por ejemplo:
```csharp
[GeneratedRegex(@"^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s\-'.]+$")]
```

---

## 2. Faltan configuraciones de EF para EventComment y UserToken

**Descripción:** Las entidades `EventComment` y `UserToken` no tienen configuraciones en `Configurations/`, lo que puede causar problemas con valores por defecto o conversiones.

**Archivos afectados:**
- `backend/src/EventosNorma.Domain/Entities/EventComment.cs`
- `backend/src/EventosNorma.Domain/Entities/UserToken.cs`

**Propuesta:** Crear `EventCommentConfiguration.cs` y `UserTokenConfiguration.cs` con las configuraciones necesarias.
