export interface Membership {
    id_membresia: string;
    nombre: string;
    descripcion: string;
    precio: number;
    fecha_inicio: Date;
    fecha_final: Date;
    prioridad_busqueda: number;
    permite_favoritos: boolean;
    permite_destacado: boolean;
    permite_galeria: boolean;
    permite_promociones: boolean;
    cantidad_publicidad: number
    estado: boolean;
    fecha_creacion: Date;
}