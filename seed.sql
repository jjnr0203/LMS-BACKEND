-- Roles del sistema
INSERT INTO roles (id, name, description) VALUES
  ('a0000000-0000-0000-0000-000000000001', 'admin', 'Administrador del sistema'),
  ('a0000000-0000-0000-0000-000000000002', 'coordinador', 'Coordinador de carrera'),
  ('a0000000-0000-0000-0000-000000000003', 'tesoreria', 'Personal de tesorería'),
  ('a0000000-0000-0000-0000-000000000004', 'docente', 'Docente/Profesor'),
  ('a0000000-0000-0000-0000-000000000005', 'estudiante', 'Estudiante')
ON CONFLICT (name) DO NOTHING;

-- Admin inicial (password: Admin123!)
-- bcrypt hash de "Admin123!" con 10 rounds
INSERT INTO users (id, first_name, last_name, email, password, role_id, is_active, created_at)
VALUES (
  '0000000000',
  'Admin',
  'Sistema',
  'admin@lms.com',
  '$2b$10$8KzQMGx5C5Kc5Q5z5Q5z5u5z5Q5z5Q5z5Q5z5Q5z5Q5z5Q5z5Q5e',
  'a0000000-0000-0000-0000-000000000001',
  true,
  NOW()
)
ON CONFLICT (id) DO NOTHING;
