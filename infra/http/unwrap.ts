/**
 * O backend pode retornar as respostas em dois formatos:
 *  - Diretamente: { results: [...] }
 *  - Embrulhado:  { success: true, data: { results: [...] } }
 *
 * Esta função normaliza ambos os casos.
 */
export function unwrap<T>(response: T | { success: boolean; data: T }): T {
  if (
    response !== null &&
    typeof response === "object" &&
    "success" in (response as object) &&
    "data" in (response as object)
  ) {
    return (response as { success: boolean; data: T }).data;
  }
  return response as T;
}
