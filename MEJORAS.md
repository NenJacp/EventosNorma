# Plan de Mejoras - EventosNorma (Backend)

Este documento detalla las áreas de oportunidad detectadas para elevar la calidad, seguridad y madurez arquitectónica del proyecto.

## 1. Seguridad: Implementación de JWT (Prioridad Alta) ✅ IMPLEMENTADO
Actualmente el endpoint de `Login` valida las credenciales pero no emite un token de sesión.
- **Estado**: ✅ Implementado
- Servicio de generación de **JSON Web Tokens (JWT)** (`JwtProvider`).
- Middleware de Autenticación y Autorización en `Program.cs`.
- Endpoints protegidos mediante `[Authorize]`.
- Token entregado en el cuerpo de la respuesta de Login.

## 2. DDD: Salir de Entidades Anémicas ✅ IMPLEMENTADO

La entidad `User` es actualmente un contenedor de datos con setters públicos.
- **Estado**: ✅ Implementado
    - Propiedades con `private set`.
    - **Constructor de Fábrica** (Static Factory Method `User.Create()`).
    - Lógica de validación en el modelo de dominio.

## 3. Middleware: Estandarización de Respuestas (ProblemDetails) ✅ IMPLEMENTADO
El manejo de errores actual devuelve formatos inconsistentes entre validaciones de FluentValidation y excepciones manuales.
- **Estado**: ✅ Implementado
    - `ExceptionHandlingMiddleware` con estructura unificada.
    - `AddProblemDetails()` configurado en `Program.cs`.
    - Todas las respuestas de error siguen la estructura RFC 7807 (Type, Title, Status, Detail, Errors).

## 4. Infraestructura: Simplificación "Lean Wolverine" ✅ IMPLEMENTADO
Se está utilizando el patrón tradicional de Repositorio + Unit of Work sobre EF Core.
- **Estado**: ✅ Implementado
    - `AppDbContext` inyectado directamente en los Handlers de Wolverine.
    - Sin capas Repository/UnitOfWork innecesarias.

## 5. Extras Limpiados
- Archivos vacíos `Class1.cs` eliminados.

---
*Documento actualizado: todas las mejoras han sido implementadas.*
