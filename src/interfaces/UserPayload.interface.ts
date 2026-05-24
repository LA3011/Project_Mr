export interface UserPayload {
    id_usuario: string;
    correo: string;
    tipo_usuario: string;
    iat?: number;
    exp?: number;
}
