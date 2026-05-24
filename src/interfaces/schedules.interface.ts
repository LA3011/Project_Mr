export interface Schedules {
    id_horario: string;
    id_sucursal: string;
    dia_semana: string;
    hora_apertura: Date;
    hora_cierre: Date;
    abierto: boolean;
}