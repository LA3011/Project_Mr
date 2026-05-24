export interface User {
  id_usuario: string;
  tipo_usuario: string;
  id_estado: string;
  id_municipio: string;
  id_ciudad: string;
  nombres: string;
  apellidos: string;
  correo: string;
  password_hash: string;
  telefono: string;
  foto_perfil: string;
  ultimo_login: Date;
  verificado: boolean;
  estado: boolean;
  fecha_registro: Date;
}
