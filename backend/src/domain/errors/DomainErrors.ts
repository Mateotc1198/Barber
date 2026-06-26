export class DomainError extends Error {
  constructor(
    message: string,
    public readonly code: string
  ) {
    super(message);
    this.name = new.target.name;
  }
}

export class ServicioNotFound extends DomainError {
  constructor(id: string) {
    super(`Servicio con id ${id} no encontrado`, "SERVICIO_NOT_FOUND");
  }
}

export class InvalidCredentials extends DomainError {
  constructor() {
    super("Usuario o contraseña incorrectos", "INVALID_CREDENTIALS");
  }
}

export class InvalidToken extends DomainError {
  constructor() {
    super("Sesión inválida o expirada", "INVALID_TOKEN");
  }
}
