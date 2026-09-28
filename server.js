require("dotenv").config({ override: true });
const express = require("express");
const { createClient } = require("@supabase/supabase-js");

const { SUPABASE_URL, SUPABASE_SECRET_KEY, PORT = 3000 } = process.env;
if (!SUPABASE_URL || !SUPABASE_SECRET_KEY) {
  console.error("Faltan SUPABASE_URL o SUPABASE_SECRET_KEY en el archivo .env");
  process.exit(1);
}

// The secret key stays on the server; the browser only talks to this API.
const baseUrl = new URL(SUPABASE_URL.trim().replace(/^["']|["']$/g, "")).origin;
console.log("Conectando a:", baseUrl);
const supabase = createClient(baseUrl, SUPABASE_SECRET_KEY.trim());
const app = express();
const ESTADOS = ["pendiente", "completada"];

// DB row (snake_case) -> API contract (camelCase)
const toDto = (r) => ({
  id: r.id,
  titulo: r.titulo,
  curso: r.curso,
  fechaEntrega: r.fecha_entrega,
  estado: r.estado,
});

const fail = (res, status, codigo, mensaje) =>
  res.status(status).json({ error: { codigo, mensaje } });

const notFound = (res, id) =>
  fail(res, 404, "TAREA_NO_ENCONTRADA", `No existe una tarea con id ${id}.`);

const isId = (v) => /^\d+$/.test(v);

// GET /api/v1/tareas?estado=pendiente|completada
app.get("/api/v1/tareas", async (req, res) => {
  const { estado } = req.query;
  if (estado !== undefined && !ESTADOS.includes(estado)) {
    return fail(res, 400, "ESTADO_INVALIDO", "El estado debe ser 'pendiente' o 'completada'.");
  }
  let q = supabase.from("tareas").select("*").order("fecha_entrega").order("id");
  if (estado) q = q.eq("estado", estado);
  const { data, error } = await q;
  if (error) {
  console.error(error);
  return fail(res, 500, "ERROR_INTERNO", "No se pudieron consultar las tareas.");
}
  res.status(200).json(data.map(toDto));
});

// GET /api/v1/tareas/:id
app.get("/api/v1/tareas/:id", async (req, res) => {
  const { id } = req.params;
  if (!isId(id)) return notFound(res, id);
  const { data, error } = await supabase.from("tareas").select("*").eq("id", id).maybeSingle();
  if (error) return fail(res, 500, "ERROR_INTERNO", "No se pudo consultar la tarea.");
  if (!data) return notFound(res, id);
  res.status(200).json(toDto(data));
});

// PATCH /api/v1/tareas/:id/completar
app.patch("/api/v1/tareas/:id/completar", async (req, res) => {
  const { id } = req.params;
  if (!isId(id)) return notFound(res, id);
  const { data, error } = await supabase
    .from("tareas")
    .update({ estado: "completada" })
    .eq("id", id)
    .select()
    .maybeSingle();
  if (error) return fail(res, 500, "ERROR_INTERNO", "No se pudo actualizar la tarea.");
  if (!data) return notFound(res, id);
  res.status(200).json(toDto(data));
});

// Unknown API routes -> JSON 404
app.use("/api", (req, res) =>
  fail(res, 404, "RUTA_NO_ENCONTRADA", "El recurso solicitado no existe.")
);

app.use(express.static("public"));

app.listen(PORT, () => console.log(`Servidor listo en http://localhost:${PORT}`));
