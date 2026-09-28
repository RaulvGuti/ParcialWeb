# Tareas: API REST + dashboard (Express + Supabase)

1. Ejecuta `supabase/schema.sql` en el SQL Editor de Supabase.
2. Copia `.env.example` a `.env` y completa `SUPABASE_URL` y `SUPABASE_SECRET_KEY`.
3. `npm install` y luego `npm start`.
4. Abre http://localhost:3000

## Endpoints
| Acción | Método | Endpoint |
|---|---|---|
| Consultar tareas | GET | /api/v1/tareas |
| Consultar una tarea | GET | /api/v1/tareas/{id} |
| Filtrar por estado | GET | /api/v1/tareas?estado=pendiente |
| Completar tarea | PATCH | /api/v1/tareas/{id}/completar |



## Serie 2 FIGMA

https://www.figma.com/make/ASQFRZ6jSX6DWgkLJkpl8X/Redise%C3%B1o-a-panel-principal-estudiantes?fullscreen=1&t=eQBp5G9ycsW7p1T1-1&code-node-id=0-6