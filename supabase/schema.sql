create table public.tareas (
  id bigint generated always as identity primary key,
  titulo text not null,
  curso text not null,
  fecha_entrega date not null,
  estado text not null default 'pendiente'
    check (estado in ('pendiente', 'completada'))
);

alter table public.tareas enable row level security;

insert into public.tareas (titulo, curso, fecha_entrega, estado) values
  ('Diseño del modelo relacional', 'Bases de Datos', '2026-10-05', 'pendiente'),
  ('Configuración de VLANs', 'Redes', '2026-10-08', 'pendiente'),
  ('Planificador de procesos', 'Sistemas Operativos', '2026-09-30', 'completada'),
  ('Balance general', 'Contabilidad Financiera', '2026-10-12', 'pendiente'),
  ('Método simplex', 'Investigación de Operaciones', '2026-10-15', 'pendiente');
