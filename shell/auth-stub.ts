// Placeholder de auth. Reemplazar por Supabase Auth (@supabase/ssr) al
// conectar el backend. Guia: docs/IMPLEMENTAR.md (seccion 3.8). NUNCA Clerk.
export async function getSession() {
  return { user: { id: "demo", name: "Usuario Demo" } }
}
