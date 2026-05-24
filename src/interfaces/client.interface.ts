export interface Client {
    id_cliente: string;
    id_usuario: string;
    cedula: number;
    fecha_nacimiento: Date;
    sexo: 'mas' | 'fem'
    estado: boolean
}