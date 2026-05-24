export interface CompanyMemberships {
    id_empresa_membresia: string;
    id_empresa: string;
    id_membresia: string;
    fecha_inicio: Date;
    fecha_fin: Date;
    estado_pago: string;
    estado: boolean;
    renovacion_automatica: boolean;
    fecha_registro: Date;
}