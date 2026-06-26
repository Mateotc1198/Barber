export class ErrorApi extends Error {
  constructor(
    public readonly status: number,
    message: string,
    public readonly code?: string
  ) {
    super(message);
    this.name = "ErrorApi";
  }
}

const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

export async function solicitar<T>(
  ruta: string,
  opciones?: RequestInit
): Promise<T> {
  const respuesta = await fetch(`${BASE_URL}${ruta}`, {
    credentials: "include",
    headers: { "Content-Type": "application/json", ...opciones?.headers },
    ...opciones,
  });

  if (!respuesta.ok) {
    const cuerpo = await respuesta.json().catch(() => ({}));
    throw new ErrorApi(
      respuesta.status,
      (cuerpo as Record<string, string>).error ?? respuesta.statusText,
      (cuerpo as Record<string, string>).code
    );
  }

  if (respuesta.status === 204) return undefined as T;
  return respuesta.json() as Promise<T>;
}

export async function solicitarFormData<T>(
  ruta: string,
  formData: FormData
): Promise<T> {
  const respuesta = await fetch(`${BASE_URL}${ruta}`, {
    method: "POST",
    credentials: "include",
    body: formData,
  });

  if (!respuesta.ok) {
    const cuerpo = await respuesta.json().catch(() => ({}));
    throw new ErrorApi(
      respuesta.status,
      (cuerpo as Record<string, string>).error ?? respuesta.statusText,
      (cuerpo as Record<string, string>).code
    );
  }

  return respuesta.json() as Promise<T>;
}
