--
-- PostgreSQL database dump
--

-- Dumped from database version 17.5 (Ubuntu 17.5-1.pgdg20.04+1)
-- Dumped by pg_dump version 17.5 (Ubuntu 17.5-1.pgdg20.04+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: public; Type: SCHEMA; Schema: -; Owner: postgres
--

-- *not* creating schema, since initdb creates it


ALTER SCHEMA public OWNER TO postgres;

--
-- Name: fn_activar_membresia_pago(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.fn_activar_membresia_pago() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    IF NEW.estado_pago = 'PAGADO' THEN
        UPDATE empresa_membresias
        SET
            activa = TRUE,
            estado_pago = 'ACTIVO'
        WHERE id_empresa_membresia = NEW.id_empresa_membresia;
    END IF;
    RETURN NEW;
END;
$$;


ALTER FUNCTION public.fn_activar_membresia_pago() OWNER TO postgres;

--
-- Name: fn_bitacora(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.fn_bitacora() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
    v_registro_id INT;
BEGIN
    -- Identificar dinámicamente cuál ID usar según la tabla que disparó el trigger
    IF TG_TABLE_NAME = 'empresas' THEN
        v_registro_id := NEW.id_empresa;
    ELSIF TG_TABLE_NAME = 'sucursales' THEN
        v_registro_id := NEW.id_sucursal;
    ELSE
        v_registro_id := NULL;
    END IF;

    INSERT INTO bitacora (
        id_administrador,
        id_modulo,
        accion,
        tabla_afectada,
        registro_id,
        fecha
    )
    VALUES (
        NULL,
        NULL,
        TG_OP,
        TG_TABLE_NAME,
        v_registro_id,
        NOW()
    );
    RETURN NEW;
END;
$$;


ALTER FUNCTION public.fn_bitacora() OWNER TO postgres;

--
-- Name: fn_calcular_fecha_fin(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.fn_calcular_fecha_fin() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
    v_duracion INT;
BEGIN
    SELECT duracion_dias
    INTO v_duracion
    FROM membresias
    WHERE id_membresia = NEW.id_membresia;

    NEW.fecha_fin := NEW.fecha_inicio + v_duracion;
    RETURN NEW;
END;
$$;


ALTER FUNCTION public.fn_calcular_fecha_fin() OWNER TO postgres;

--
-- Name: fn_estado_membresia(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.fn_estado_membresia() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    IF NEW.fecha_fin >= CURRENT_DATE THEN
        NEW.activa := TRUE;
        NEW.estado_pago := 'ACTIVO';
    ELSE
        NEW.activa := FALSE;
        NEW.estado_pago := 'VENCIDA';
    END IF;
    RETURN NEW;
END;
$$;


ALTER FUNCTION public.fn_estado_membresia() OWNER TO postgres;

--
-- Name: fn_fecha_registro(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.fn_fecha_registro() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    NEW.fecha_registro := NOW();
    RETURN NEW;
END;
$$;


ALTER FUNCTION public.fn_fecha_registro() OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: administradores; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.administradores (
    id_administrador integer NOT NULL,
    id_usuario integer,
    id_perfil integer,
    estado boolean
);


ALTER TABLE public.administradores OWNER TO postgres;

--
-- Name: administradores_empresas; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.administradores_empresas (
    id_administrador_empresa integer NOT NULL,
    id_administrador integer,
    id_empresa integer,
    fecha_asignacion timestamp without time zone,
    estado boolean
);


ALTER TABLE public.administradores_empresas OWNER TO postgres;

--
-- Name: administradores_empresas_id_administrador_empresa_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.administradores_empresas_id_administrador_empresa_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.administradores_empresas_id_administrador_empresa_seq OWNER TO postgres;

--
-- Name: administradores_empresas_id_administrador_empresa_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.administradores_empresas_id_administrador_empresa_seq OWNED BY public.administradores_empresas.id_administrador_empresa;


--
-- Name: administradores_id_administrador_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.administradores_id_administrador_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.administradores_id_administrador_seq OWNER TO postgres;

--
-- Name: administradores_id_administrador_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.administradores_id_administrador_seq OWNED BY public.administradores.id_administrador;


--
-- Name: bitacora; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.bitacora (
    id_bitacora integer NOT NULL,
    id_administrador integer,
    id_modulo integer,
    accion character varying(255),
    tabla_afectada character varying(100),
    registro_id integer,
    ip_usuario character varying(50),
    dispositivo character varying(255),
    fecha timestamp without time zone
);


ALTER TABLE public.bitacora OWNER TO postgres;

--
-- Name: bitacora_id_bitacora_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.bitacora_id_bitacora_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.bitacora_id_bitacora_seq OWNER TO postgres;

--
-- Name: bitacora_id_bitacora_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.bitacora_id_bitacora_seq OWNED BY public.bitacora.id_bitacora;


--
-- Name: categorias; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.categorias (
    id_categoria integer NOT NULL,
    nombre character varying(100),
    icono character varying(255),
    descripcion text,
    estado boolean
);


ALTER TABLE public.categorias OWNER TO postgres;

--
-- Name: categorias_id_categoria_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.categorias_id_categoria_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.categorias_id_categoria_seq OWNER TO postgres;

--
-- Name: categorias_id_categoria_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.categorias_id_categoria_seq OWNED BY public.categorias.id_categoria;


--
-- Name: ciudades; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.ciudades (
    id_ciudad integer NOT NULL,
    id_municipio integer,
    nombre character varying(100),
    estado boolean
);


ALTER TABLE public.ciudades OWNER TO postgres;

--
-- Name: ciudades_id_ciudad_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.ciudades_id_ciudad_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.ciudades_id_ciudad_seq OWNER TO postgres;

--
-- Name: ciudades_id_ciudad_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.ciudades_id_ciudad_seq OWNED BY public.ciudades.id_ciudad;


--
-- Name: clientes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.clientes (
    id_usuario integer,
    cedula character varying(20),
    fecha_nacimiento date,
    sexo character varying(20),
    estado boolean,
    fecha_registro date,
    id_cliente integer NOT NULL
);


ALTER TABLE public.clientes OWNER TO postgres;

--
-- Name: clientes_id_cliente_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.clientes_id_cliente_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.clientes_id_cliente_seq OWNER TO postgres;

--
-- Name: clientes_id_cliente_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.clientes_id_cliente_seq OWNED BY public.clientes.id_cliente;


--
-- Name: empresa_membresias; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.empresa_membresias (
    id_empresa_membresia integer NOT NULL,
    id_empresa integer,
    id_membresia integer,
    fecha_inicio date,
    fecha_fin date,
    estado_pago character varying(50),
    estado boolean,
    renovacion_automatica boolean,
    fecha_registro timestamp without time zone
);


ALTER TABLE public.empresa_membresias OWNER TO postgres;

--
-- Name: empresa_membresias_id_empresa_membresia_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.empresa_membresias_id_empresa_membresia_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.empresa_membresias_id_empresa_membresia_seq OWNER TO postgres;

--
-- Name: empresa_membresias_id_empresa_membresia_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.empresa_membresias_id_empresa_membresia_seq OWNED BY public.empresa_membresias.id_empresa_membresia;


--
-- Name: empresas; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.empresas (
    id_empresa integer NOT NULL,
    id_usuario integer NOT NULL,
    id_categoria integer,
    id_estado integer NOT NULL,
    id_municipio integer NOT NULL,
    id_ciudad integer NOT NULL,
    nombre_comercial character varying(150),
    razon_social character varying(150),
    rif character varying(30),
    pagina_web character varying(255),
    logo character varying(255),
    descripcion text NOT NULL,
    estado boolean,
    fecha_registro timestamp without time zone
);


ALTER TABLE public.empresas OWNER TO postgres;

--
-- Name: empresas_id_empresa_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.empresas_id_empresa_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.empresas_id_empresa_seq OWNER TO postgres;

--
-- Name: empresas_id_empresa_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.empresas_id_empresa_seq OWNED BY public.empresas.id_empresa;


--
-- Name: estados; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.estados (
    id_estado integer NOT NULL,
    nombre character varying(100),
    codigo character varying(10),
    estado boolean
);


ALTER TABLE public.estados OWNER TO postgres;

--
-- Name: estados_id_estado_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.estados_id_estado_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.estados_id_estado_seq OWNER TO postgres;

--
-- Name: estados_id_estado_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.estados_id_estado_seq OWNED BY public.estados.id_estado;


--
-- Name: horarios; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.horarios (
    id_horario integer NOT NULL,
    id_sucursal integer,
    dia_semana character varying(20),
    hora_apertura time without time zone,
    hora_cierre time without time zone,
    abierto boolean
);


ALTER TABLE public.horarios OWNER TO postgres;

--
-- Name: horarios_id_horario_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.horarios_id_horario_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.horarios_id_horario_seq OWNER TO postgres;

--
-- Name: horarios_id_horario_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.horarios_id_horario_seq OWNED BY public.horarios.id_horario;


--
-- Name: membresias; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.membresias (
    id_membresia integer NOT NULL,
    nombre character varying(100) NOT NULL,
    descripcion text NOT NULL,
    precio numeric(10,2) NOT NULL,
    prioridad_busqueda integer,
    permite_favoritos boolean,
    permite_destacado boolean,
    permite_galeria boolean,
    permite_promociones boolean,
    cantidad_publicidad integer,
    estado boolean NOT NULL,
    fecha_creacion time without time zone DEFAULT CURRENT_TIME NOT NULL,
    fecha_inicio date NOT NULL,
    fecha_final date NOT NULL
);


ALTER TABLE public.membresias OWNER TO postgres;

--
-- Name: membresias_id_membresia_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.membresias_id_membresia_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.membresias_id_membresia_seq OWNER TO postgres;

--
-- Name: membresias_id_membresia_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.membresias_id_membresia_seq OWNED BY public.membresias.id_membresia;


--
-- Name: metodos_pago; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.metodos_pago (
    id_metodo_pago integer NOT NULL,
    nombre character varying(100),
    icono character varying(255),
    descripcion text,
    estado boolean DEFAULT true NOT NULL
);


ALTER TABLE public.metodos_pago OWNER TO postgres;

--
-- Name: metodos_pago_id_metodo_pago_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.metodos_pago_id_metodo_pago_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.metodos_pago_id_metodo_pago_seq OWNER TO postgres;

--
-- Name: metodos_pago_id_metodo_pago_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.metodos_pago_id_metodo_pago_seq OWNED BY public.metodos_pago.id_metodo_pago;


--
-- Name: modulos; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.modulos (
    id_modulo integer NOT NULL,
    nombre character varying(100),
    ruta character varying(255),
    icono character varying(255),
    descripcion text,
    estado boolean
);


ALTER TABLE public.modulos OWNER TO postgres;

--
-- Name: modulos_id_modulo_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.modulos_id_modulo_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.modulos_id_modulo_seq OWNER TO postgres;

--
-- Name: modulos_id_modulo_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.modulos_id_modulo_seq OWNED BY public.modulos.id_modulo;


--
-- Name: municipios; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.municipios (
    id_municipio integer NOT NULL,
    id_estado integer,
    nombre character varying(100),
    estado boolean
);


ALTER TABLE public.municipios OWNER TO postgres;

--
-- Name: municipios_id_municipio_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.municipios_id_municipio_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.municipios_id_municipio_seq OWNER TO postgres;

--
-- Name: municipios_id_municipio_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.municipios_id_municipio_seq OWNED BY public.municipios.id_municipio;


--
-- Name: notificaciones; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.notificaciones (
    id_notificacion integer NOT NULL,
    id_usuario integer,
    titulo character varying(150),
    mensaje text,
    tipo character varying(50),
    leida boolean,
    fecha_envio timestamp without time zone
);


ALTER TABLE public.notificaciones OWNER TO postgres;

--
-- Name: notificaciones_id_notificacion_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.notificaciones_id_notificacion_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.notificaciones_id_notificacion_seq OWNER TO postgres;

--
-- Name: notificaciones_id_notificacion_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.notificaciones_id_notificacion_seq OWNED BY public.notificaciones.id_notificacion;


--
-- Name: pagos_membresias; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.pagos_membresias (
    id_pago integer NOT NULL,
    id_empresa_membresia integer,
    referencia_pago character varying(255),
    paypal_transaction_id character varying(255),
    payer_email character varying(150),
    monto numeric(10,2),
    moneda character varying(10),
    estado_pago character varying(50),
    metodo_pago character varying(50),
    respuesta_paypal text,
    fecha_pago timestamp without time zone
);


ALTER TABLE public.pagos_membresias OWNER TO postgres;

--
-- Name: pagos_membresias_id_pago_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.pagos_membresias_id_pago_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.pagos_membresias_id_pago_seq OWNER TO postgres;

--
-- Name: pagos_membresias_id_pago_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.pagos_membresias_id_pago_seq OWNED BY public.pagos_membresias.id_pago;


--
-- Name: perfil_modulo_privilegio; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.perfil_modulo_privilegio (
    id_perfil_modulo_privilegio integer NOT NULL,
    id_perfil integer,
    id_modulo integer,
    id_privilegio integer
);


ALTER TABLE public.perfil_modulo_privilegio OWNER TO postgres;

--
-- Name: perfil_modulo_privilegio_id_perfil_modulo_privilegio_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.perfil_modulo_privilegio_id_perfil_modulo_privilegio_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.perfil_modulo_privilegio_id_perfil_modulo_privilegio_seq OWNER TO postgres;

--
-- Name: perfil_modulo_privilegio_id_perfil_modulo_privilegio_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.perfil_modulo_privilegio_id_perfil_modulo_privilegio_seq OWNED BY public.perfil_modulo_privilegio.id_perfil_modulo_privilegio;


--
-- Name: perfiles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.perfiles (
    id_perfil integer NOT NULL,
    nombre character varying(100),
    descripcion text,
    nivel_acceso integer,
    estado boolean
);


ALTER TABLE public.perfiles OWNER TO postgres;

--
-- Name: perfiles_id_perfil_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.perfiles_id_perfil_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.perfiles_id_perfil_seq OWNER TO postgres;

--
-- Name: perfiles_id_perfil_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.perfiles_id_perfil_seq OWNED BY public.perfiles.id_perfil;


--
-- Name: privilegios; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.privilegios (
    id_privilegio integer NOT NULL,
    nombre character varying(100),
    descripcion text
);


ALTER TABLE public.privilegios OWNER TO postgres;

--
-- Name: privilegios_id_privilegio_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.privilegios_id_privilegio_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.privilegios_id_privilegio_seq OWNER TO postgres;

--
-- Name: privilegios_id_privilegio_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.privilegios_id_privilegio_seq OWNED BY public.privilegios.id_privilegio;


--
-- Name: products; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.products (
    id_product integer NOT NULL,
    name character varying(255) NOT NULL,
    description text,
    price numeric(10,2) NOT NULL,
    stock integer NOT NULL,
    category_id integer,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.products OWNER TO postgres;

--
-- Name: products_id_product_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.products_id_product_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.products_id_product_seq OWNER TO postgres;

--
-- Name: products_id_product_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.products_id_product_seq OWNED BY public.products.id_product;


--
-- Name: recompensas; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.recompensas (
    id_recompensa integer NOT NULL,
    id_usuario integer,
    titulo character varying(150),
    descripcion text,
    tipo character varying(50),
    fecha_generada timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    estado boolean
);


ALTER TABLE public.recompensas OWNER TO postgres;

--
-- Name: recompensas_id_recompensa_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.recompensas_id_recompensa_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.recompensas_id_recompensa_seq OWNER TO postgres;

--
-- Name: recompensas_id_recompensa_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.recompensas_id_recompensa_seq OWNED BY public.recompensas.id_recompensa;


--
-- Name: sucursal_metodo_pago; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.sucursal_metodo_pago (
    id_sucursal_metodo_pago integer NOT NULL,
    id_sucursal integer,
    id_metodo_pago integer,
    estado boolean DEFAULT true NOT NULL
);


ALTER TABLE public.sucursal_metodo_pago OWNER TO postgres;

--
-- Name: sucursal_metodo_pago_id_sucursal_metodo_pago_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.sucursal_metodo_pago_id_sucursal_metodo_pago_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.sucursal_metodo_pago_id_sucursal_metodo_pago_seq OWNER TO postgres;

--
-- Name: sucursal_metodo_pago_id_sucursal_metodo_pago_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.sucursal_metodo_pago_id_sucursal_metodo_pago_seq OWNED BY public.sucursal_metodo_pago.id_sucursal_metodo_pago;


--
-- Name: sucursales; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.sucursales (
    id_sucursal integer NOT NULL,
    id_empresa integer NOT NULL,
    id_estado integer NOT NULL,
    id_municipio integer,
    id_ciudad integer NOT NULL,
    nombre_sucursal character varying(150) NOT NULL,
    direccion text NOT NULL,
    telefono character varying(20) NOT NULL,
    correo character varying(150) NOT NULL,
    foto_principal character varying(255),
    descripcion text NOT NULL,
    estado boolean NOT NULL,
    fecha_creacion time without time zone DEFAULT CURRENT_TIME NOT NULL
);


ALTER TABLE public.sucursales OWNER TO postgres;

--
-- Name: sucursales_id_sucursal_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.sucursales_id_sucursal_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.sucursales_id_sucursal_seq OWNER TO postgres;

--
-- Name: sucursales_id_sucursal_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.sucursales_id_sucursal_seq OWNED BY public.sucursales.id_sucursal;


--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id_user integer NOT NULL,
    name character varying(15) NOT NULL,
    "lastName" character varying(15) NOT NULL,
    email character varying(20) NOT NULL,
    role character varying(10) NOT NULL,
    password character varying(65) NOT NULL
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Name: users_id_user_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_id_user_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_id_user_seq OWNER TO postgres;

--
-- Name: users_id_user_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_id_user_seq OWNED BY public.users.id_user;


--
-- Name: usuarios; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.usuarios (
    id_usuario integer NOT NULL,
    tipo_usuario character varying(30),
    id_estado integer,
    id_municipio integer,
    id_ciudad integer,
    nombres character varying(100),
    apellidos character varying(100),
    correo character varying(150),
    password_hash character varying(255),
    telefono character varying(20),
    foto_perfil character varying(255),
    ultimo_login timestamp without time zone,
    token_recuperacion character varying(255),
    verificado boolean,
    estado boolean,
    fecha_registro timestamp without time zone
);


ALTER TABLE public.usuarios OWNER TO postgres;

--
-- Name: usuarios_id_usuario_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.usuarios_id_usuario_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.usuarios_id_usuario_seq OWNER TO postgres;

--
-- Name: usuarios_id_usuario_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.usuarios_id_usuario_seq OWNED BY public.usuarios.id_usuario;


--
-- Name: administradores id_administrador; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.administradores ALTER COLUMN id_administrador SET DEFAULT nextval('public.administradores_id_administrador_seq'::regclass);


--
-- Name: administradores_empresas id_administrador_empresa; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.administradores_empresas ALTER COLUMN id_administrador_empresa SET DEFAULT nextval('public.administradores_empresas_id_administrador_empresa_seq'::regclass);


--
-- Name: bitacora id_bitacora; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bitacora ALTER COLUMN id_bitacora SET DEFAULT nextval('public.bitacora_id_bitacora_seq'::regclass);


--
-- Name: categorias id_categoria; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categorias ALTER COLUMN id_categoria SET DEFAULT nextval('public.categorias_id_categoria_seq'::regclass);


--
-- Name: ciudades id_ciudad; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ciudades ALTER COLUMN id_ciudad SET DEFAULT nextval('public.ciudades_id_ciudad_seq'::regclass);


--
-- Name: clientes id_cliente; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.clientes ALTER COLUMN id_cliente SET DEFAULT nextval('public.clientes_id_cliente_seq'::regclass);


--
-- Name: empresa_membresias id_empresa_membresia; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.empresa_membresias ALTER COLUMN id_empresa_membresia SET DEFAULT nextval('public.empresa_membresias_id_empresa_membresia_seq'::regclass);


--
-- Name: empresas id_empresa; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.empresas ALTER COLUMN id_empresa SET DEFAULT nextval('public.empresas_id_empresa_seq'::regclass);


--
-- Name: estados id_estado; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.estados ALTER COLUMN id_estado SET DEFAULT nextval('public.estados_id_estado_seq'::regclass);


--
-- Name: horarios id_horario; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.horarios ALTER COLUMN id_horario SET DEFAULT nextval('public.horarios_id_horario_seq'::regclass);


--
-- Name: membresias id_membresia; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.membresias ALTER COLUMN id_membresia SET DEFAULT nextval('public.membresias_id_membresia_seq'::regclass);


--
-- Name: metodos_pago id_metodo_pago; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.metodos_pago ALTER COLUMN id_metodo_pago SET DEFAULT nextval('public.metodos_pago_id_metodo_pago_seq'::regclass);


--
-- Name: modulos id_modulo; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.modulos ALTER COLUMN id_modulo SET DEFAULT nextval('public.modulos_id_modulo_seq'::regclass);


--
-- Name: municipios id_municipio; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.municipios ALTER COLUMN id_municipio SET DEFAULT nextval('public.municipios_id_municipio_seq'::regclass);


--
-- Name: notificaciones id_notificacion; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notificaciones ALTER COLUMN id_notificacion SET DEFAULT nextval('public.notificaciones_id_notificacion_seq'::regclass);


--
-- Name: pagos_membresias id_pago; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pagos_membresias ALTER COLUMN id_pago SET DEFAULT nextval('public.pagos_membresias_id_pago_seq'::regclass);


--
-- Name: perfil_modulo_privilegio id_perfil_modulo_privilegio; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.perfil_modulo_privilegio ALTER COLUMN id_perfil_modulo_privilegio SET DEFAULT nextval('public.perfil_modulo_privilegio_id_perfil_modulo_privilegio_seq'::regclass);


--
-- Name: perfiles id_perfil; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.perfiles ALTER COLUMN id_perfil SET DEFAULT nextval('public.perfiles_id_perfil_seq'::regclass);


--
-- Name: privilegios id_privilegio; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.privilegios ALTER COLUMN id_privilegio SET DEFAULT nextval('public.privilegios_id_privilegio_seq'::regclass);


--
-- Name: products id_product; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products ALTER COLUMN id_product SET DEFAULT nextval('public.products_id_product_seq'::regclass);


--
-- Name: recompensas id_recompensa; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.recompensas ALTER COLUMN id_recompensa SET DEFAULT nextval('public.recompensas_id_recompensa_seq'::regclass);


--
-- Name: sucursal_metodo_pago id_sucursal_metodo_pago; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sucursal_metodo_pago ALTER COLUMN id_sucursal_metodo_pago SET DEFAULT nextval('public.sucursal_metodo_pago_id_sucursal_metodo_pago_seq'::regclass);


--
-- Name: sucursales id_sucursal; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sucursales ALTER COLUMN id_sucursal SET DEFAULT nextval('public.sucursales_id_sucursal_seq'::regclass);


--
-- Name: users id_user; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN id_user SET DEFAULT nextval('public.users_id_user_seq'::regclass);


--
-- Name: usuarios id_usuario; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios ALTER COLUMN id_usuario SET DEFAULT nextval('public.usuarios_id_usuario_seq'::regclass);


--
-- Data for Name: administradores; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.administradores (id_administrador, id_usuario, id_perfil, estado) VALUES (1, 1, 4, true);
INSERT INTO public.administradores (id_administrador, id_usuario, id_perfil, estado) VALUES (2, 1, 4, false);


--
-- Data for Name: administradores_empresas; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.administradores_empresas (id_administrador_empresa, id_administrador, id_empresa, fecha_asignacion, estado) VALUES (1, 2, 3, '2026-05-23 18:00:00', false);


--
-- Data for Name: bitacora; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.bitacora (id_bitacora, id_administrador, id_modulo, accion, tabla_afectada, registro_id, ip_usuario, dispositivo, fecha) VALUES (1, 1, 1, 'INSERT', 'empresas', 1, '192.168.1.123', 'testing', '2026-05-24 13:28:38.851419');
INSERT INTO public.bitacora (id_bitacora, id_administrador, id_modulo, accion, tabla_afectada, registro_id, ip_usuario, dispositivo, fecha) VALUES (2, 2, 2, 'INSERT', 'empresas', 2, '192.168.1.124', 'testing', '2026-05-24 13:32:51.676414');
INSERT INTO public.bitacora (id_bitacora, id_administrador, id_modulo, accion, tabla_afectada, registro_id, ip_usuario, dispositivo, fecha) VALUES (3, 1, 1, 'INSERT', 'empresas', 3, '192.168.1.123', 'testing', '2026-05-24 13:36:37.354958');
INSERT INTO public.bitacora (id_bitacora, id_administrador, id_modulo, accion, tabla_afectada, registro_id, ip_usuario, dispositivo, fecha) VALUES (4, 1, 1, 'INSERT', 'empresas', 5, '192.168.1.123', 'testing', '2026-05-24 13:36:56.090031');


--
-- Data for Name: categorias; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.categorias (id_categoria, nombre, icono, descripcion, estado) VALUES (1, 'Restaurantes 1', 'utensils-icon', 'Comercios dedicados a la venta de comida preparada y bebidas.', false);


--
-- Data for Name: ciudades; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.ciudades (id_ciudad, id_municipio, nombre, estado) VALUES (10, 10, 'Maracay', true);
INSERT INTO public.ciudades (id_ciudad, id_municipio, nombre, estado) VALUES (11, 11, 'Turmero', true);
INSERT INTO public.ciudades (id_ciudad, id_municipio, nombre, estado) VALUES (12, 12, 'La Victoria', true);
INSERT INTO public.ciudades (id_ciudad, id_municipio, nombre, estado) VALUES (13, 13, 'Barinas', true);
INSERT INTO public.ciudades (id_ciudad, id_municipio, nombre, estado) VALUES (14, 14, 'Socopó', true);
INSERT INTO public.ciudades (id_ciudad, id_municipio, nombre, estado) VALUES (15, 15, 'Sabaneta', true);
INSERT INTO public.ciudades (id_ciudad, id_municipio, nombre, estado) VALUES (16, 16, 'Ciudad Bolívar', true);
INSERT INTO public.ciudades (id_ciudad, id_municipio, nombre, estado) VALUES (17, 17, 'Ciudad Guayana', true);
INSERT INTO public.ciudades (id_ciudad, id_municipio, nombre, estado) VALUES (18, 18, 'Upata', true);
INSERT INTO public.ciudades (id_ciudad, id_municipio, nombre, estado) VALUES (19, 19, 'Valencia', true);
INSERT INTO public.ciudades (id_ciudad, id_municipio, nombre, estado) VALUES (20, 20, 'Puerto Cabello', true);
INSERT INTO public.ciudades (id_ciudad, id_municipio, nombre, estado) VALUES (21, 21, 'Guacara', true);
INSERT INTO public.ciudades (id_ciudad, id_municipio, nombre, estado) VALUES (22, 22, 'San Carlos', true);
INSERT INTO public.ciudades (id_ciudad, id_municipio, nombre, estado) VALUES (23, 23, 'Tinaquillo', true);
INSERT INTO public.ciudades (id_ciudad, id_municipio, nombre, estado) VALUES (24, 24, 'El Baúl', true);
INSERT INTO public.ciudades (id_ciudad, id_municipio, nombre, estado) VALUES (25, 25, 'Tucupita', true);
INSERT INTO public.ciudades (id_ciudad, id_municipio, nombre, estado) VALUES (26, 26, 'Pedernales', true);
INSERT INTO public.ciudades (id_ciudad, id_municipio, nombre, estado) VALUES (27, 27, 'Curiapo', true);
INSERT INTO public.ciudades (id_ciudad, id_municipio, nombre, estado) VALUES (28, 28, 'Gran Roque', true);
INSERT INTO public.ciudades (id_ciudad, id_municipio, nombre, estado) VALUES (29, 29, 'Isla La Tortuga', true);
INSERT INTO public.ciudades (id_ciudad, id_municipio, nombre, estado) VALUES (30, 30, 'Isla La Blanquilla', true);
INSERT INTO public.ciudades (id_ciudad, id_municipio, nombre, estado) VALUES (31, 31, 'Caracas (Centro)', true);
INSERT INTO public.ciudades (id_ciudad, id_municipio, nombre, estado) VALUES (32, 32, 'El Junquito', true);
INSERT INTO public.ciudades (id_ciudad, id_municipio, nombre, estado) VALUES (33, 33, 'Caricuao', true);
INSERT INTO public.ciudades (id_ciudad, id_municipio, nombre, estado) VALUES (34, 34, 'Coro', true);
INSERT INTO public.ciudades (id_ciudad, id_municipio, nombre, estado) VALUES (35, 35, 'Punto Fijo', true);
INSERT INTO public.ciudades (id_ciudad, id_municipio, nombre, estado) VALUES (36, 36, 'Tucacas', true);
INSERT INTO public.ciudades (id_ciudad, id_municipio, nombre, estado) VALUES (37, 37, 'San Juan de los Morros', true);
INSERT INTO public.ciudades (id_ciudad, id_municipio, nombre, estado) VALUES (38, 38, 'Calabozo', true);
INSERT INTO public.ciudades (id_ciudad, id_municipio, nombre, estado) VALUES (39, 39, 'Valle de la Pascua', true);
INSERT INTO public.ciudades (id_ciudad, id_municipio, nombre, estado) VALUES (40, 40, 'La Guaira', true);
INSERT INTO public.ciudades (id_ciudad, id_municipio, nombre, estado) VALUES (41, 41, 'Maiquetía', true);
INSERT INTO public.ciudades (id_ciudad, id_municipio, nombre, estado) VALUES (42, 42, 'Catia La Mar', true);
INSERT INTO public.ciudades (id_ciudad, id_municipio, nombre, estado) VALUES (43, 43, 'Barquisimeto', true);
INSERT INTO public.ciudades (id_ciudad, id_municipio, nombre, estado) VALUES (44, 44, 'Carora', true);
INSERT INTO public.ciudades (id_ciudad, id_municipio, nombre, estado) VALUES (45, 45, 'El Tocuyo', true);
INSERT INTO public.ciudades (id_ciudad, id_municipio, nombre, estado) VALUES (46, 46, 'Mérida', true);
INSERT INTO public.ciudades (id_ciudad, id_municipio, nombre, estado) VALUES (47, 47, 'El Vigía', true);
INSERT INTO public.ciudades (id_ciudad, id_municipio, nombre, estado) VALUES (48, 48, 'Tovar', true);
INSERT INTO public.ciudades (id_ciudad, id_municipio, nombre, estado) VALUES (49, 49, 'Los Teques', true);
INSERT INTO public.ciudades (id_ciudad, id_municipio, nombre, estado) VALUES (50, 50, 'Guatire', true);
INSERT INTO public.ciudades (id_ciudad, id_municipio, nombre, estado) VALUES (51, 51, 'Higuerote', true);
INSERT INTO public.ciudades (id_ciudad, id_municipio, nombre, estado) VALUES (1, 1, 'Puerto Ayacucho', true);
INSERT INTO public.ciudades (id_ciudad, id_municipio, nombre, estado) VALUES (2, 2, 'San Fernando de Atabapo', true);
INSERT INTO public.ciudades (id_ciudad, id_municipio, nombre, estado) VALUES (3, 3, 'San Carlos de Río Negro', true);
INSERT INTO public.ciudades (id_ciudad, id_municipio, nombre, estado) VALUES (4, 4, 'Barcelona', true);
INSERT INTO public.ciudades (id_ciudad, id_municipio, nombre, estado) VALUES (5, 5, 'Puerto La Cruz', true);
INSERT INTO public.ciudades (id_ciudad, id_municipio, nombre, estado) VALUES (6, 6, 'El Tigre', true);
INSERT INTO public.ciudades (id_ciudad, id_municipio, nombre, estado) VALUES (7, 7, 'San Fernando de Apure', true);
INSERT INTO public.ciudades (id_ciudad, id_municipio, nombre, estado) VALUES (8, 8, 'Guasdualito', true);
INSERT INTO public.ciudades (id_ciudad, id_municipio, nombre, estado) VALUES (9, 9, 'Elorza', true);
INSERT INTO public.ciudades (id_ciudad, id_municipio, nombre, estado) VALUES (52, 52, 'Maturín', true);
INSERT INTO public.ciudades (id_ciudad, id_municipio, nombre, estado) VALUES (53, 53, 'Caripito', true);
INSERT INTO public.ciudades (id_ciudad, id_municipio, nombre, estado) VALUES (54, 54, 'Punta de Mata', true);
INSERT INTO public.ciudades (id_ciudad, id_municipio, nombre, estado) VALUES (55, 55, 'Porlamar', true);
INSERT INTO public.ciudades (id_ciudad, id_municipio, nombre, estado) VALUES (56, 56, 'La Asunción', true);
INSERT INTO public.ciudades (id_ciudad, id_municipio, nombre, estado) VALUES (57, 57, 'Juan Griego', true);
INSERT INTO public.ciudades (id_ciudad, id_municipio, nombre, estado) VALUES (58, 58, 'Guanare', true);
INSERT INTO public.ciudades (id_ciudad, id_municipio, nombre, estado) VALUES (59, 59, 'Acarigua', true);
INSERT INTO public.ciudades (id_ciudad, id_municipio, nombre, estado) VALUES (60, 60, 'Araure', true);
INSERT INTO public.ciudades (id_ciudad, id_municipio, nombre, estado) VALUES (61, 61, 'Cumaná', true);
INSERT INTO public.ciudades (id_ciudad, id_municipio, nombre, estado) VALUES (62, 62, 'Carúpano', true);
INSERT INTO public.ciudades (id_ciudad, id_municipio, nombre, estado) VALUES (63, 63, 'Güiria', true);
INSERT INTO public.ciudades (id_ciudad, id_municipio, nombre, estado) VALUES (64, 64, 'San Cristóbal', true);
INSERT INTO public.ciudades (id_ciudad, id_municipio, nombre, estado) VALUES (65, 65, 'Rubio', true);
INSERT INTO public.ciudades (id_ciudad, id_municipio, nombre, estado) VALUES (66, 66, 'San Antonio del Táchira', true);
INSERT INTO public.ciudades (id_ciudad, id_municipio, nombre, estado) VALUES (67, 67, 'Trujillo', true);
INSERT INTO public.ciudades (id_ciudad, id_municipio, nombre, estado) VALUES (68, 68, 'Valera', true);
INSERT INTO public.ciudades (id_ciudad, id_municipio, nombre, estado) VALUES (69, 69, 'Boconó', true);
INSERT INTO public.ciudades (id_ciudad, id_municipio, nombre, estado) VALUES (70, 70, 'San Felipe', true);
INSERT INTO public.ciudades (id_ciudad, id_municipio, nombre, estado) VALUES (71, 71, 'Yaritagua', true);
INSERT INTO public.ciudades (id_ciudad, id_municipio, nombre, estado) VALUES (72, 72, 'Chivacoa', true);
INSERT INTO public.ciudades (id_ciudad, id_municipio, nombre, estado) VALUES (73, 73, 'Maracaibo', true);
INSERT INTO public.ciudades (id_ciudad, id_municipio, nombre, estado) VALUES (74, 74, 'Cabimas', true);
INSERT INTO public.ciudades (id_ciudad, id_municipio, nombre, estado) VALUES (75, 75, 'Ciudad Ojeda', true);


--
-- Data for Name: clientes; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.clientes (id_usuario, cedula, fecha_nacimiento, sexo, estado, fecha_registro, id_cliente) VALUES (1, '30123456', '2004-05-05', 'mas', false, '2026-05-24', 1);


--
-- Data for Name: empresa_membresias; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.empresa_membresias (id_empresa_membresia, id_empresa, id_membresia, fecha_inicio, fecha_fin, estado_pago, estado, renovacion_automatica, fecha_registro) VALUES (3, 3, 3, '2026-05-23', '2026-06-23', 'NO PAGADO', false, false, '2026-05-24 18:57:18.076812');


--
-- Data for Name: empresas; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.empresas (id_empresa, id_usuario, id_categoria, id_estado, id_municipio, id_ciudad, nombre_comercial, razon_social, rif, pagina_web, logo, descripcion, estado, fecha_registro) VALUES (3, 2, 1, 4, 11, 10, NULL, 'Corporación Inversiones del Centro C.A.', 'J-3123456-8', 'https://inversionescentro.com', 'https://images.com/logos/emp-045.png', 'Distribuidora mayorista de insumos médicos y farmacéuticos.', NULL, '2026-05-24 13:36:37.354958');
INSERT INTO public.empresas (id_empresa, id_usuario, id_categoria, id_estado, id_municipio, id_ciudad, nombre_comercial, razon_social, rif, pagina_web, logo, descripcion, estado, fecha_registro) VALUES (7, 2, NULL, 4, 11, 10, NULL, NULL, NULL, 'https://inversionescentro.com', 'https://images.com/logos/emp-045.png', 'Distribuidora mayorista de insumos médicos y farmacéuticos.', NULL, '2026-05-24 13:37:37.276834');
INSERT INTO public.empresas (id_empresa, id_usuario, id_categoria, id_estado, id_municipio, id_ciudad, nombre_comercial, razon_social, rif, pagina_web, logo, descripcion, estado, fecha_registro) VALUES (8, 2, 1, 4, 11, 10, NULL, 'testing', '12345', 'https://inversionescentro.com', 'https://images.com/logos/emp-045.png', 'Distribuidora mayorista de insumos médicos y farmacéuticos.', false, '2026-05-24 13:44:21.627878');


--
-- Data for Name: estados; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.estados (id_estado, nombre, codigo, estado) VALUES (1, 'Amazonas', NULL, NULL);
INSERT INTO public.estados (id_estado, nombre, codigo, estado) VALUES (2, 'Anzoátegui', NULL, NULL);
INSERT INTO public.estados (id_estado, nombre, codigo, estado) VALUES (3, 'Apure', NULL, NULL);
INSERT INTO public.estados (id_estado, nombre, codigo, estado) VALUES (4, 'Aragua', NULL, NULL);
INSERT INTO public.estados (id_estado, nombre, codigo, estado) VALUES (5, 'Barinas', NULL, NULL);
INSERT INTO public.estados (id_estado, nombre, codigo, estado) VALUES (6, 'Bolívar', NULL, NULL);
INSERT INTO public.estados (id_estado, nombre, codigo, estado) VALUES (7, 'Carabobo', NULL, NULL);
INSERT INTO public.estados (id_estado, nombre, codigo, estado) VALUES (8, 'Cojedes', NULL, NULL);
INSERT INTO public.estados (id_estado, nombre, codigo, estado) VALUES (9, 'Delta Amacuro', NULL, NULL);
INSERT INTO public.estados (id_estado, nombre, codigo, estado) VALUES (10, 'Dependencias Federales', NULL, NULL);
INSERT INTO public.estados (id_estado, nombre, codigo, estado) VALUES (11, 'Distrito Capital', NULL, NULL);
INSERT INTO public.estados (id_estado, nombre, codigo, estado) VALUES (12, 'Falcón', NULL, NULL);
INSERT INTO public.estados (id_estado, nombre, codigo, estado) VALUES (13, 'Guárico', NULL, NULL);
INSERT INTO public.estados (id_estado, nombre, codigo, estado) VALUES (14, 'La Guaira', NULL, NULL);
INSERT INTO public.estados (id_estado, nombre, codigo, estado) VALUES (15, 'Lara', NULL, NULL);
INSERT INTO public.estados (id_estado, nombre, codigo, estado) VALUES (16, 'Mérida', NULL, NULL);
INSERT INTO public.estados (id_estado, nombre, codigo, estado) VALUES (17, 'Miranda', NULL, NULL);
INSERT INTO public.estados (id_estado, nombre, codigo, estado) VALUES (18, 'Monagas', NULL, NULL);
INSERT INTO public.estados (id_estado, nombre, codigo, estado) VALUES (19, 'Nueva Esparta', NULL, NULL);
INSERT INTO public.estados (id_estado, nombre, codigo, estado) VALUES (20, 'Portuguesa', NULL, NULL);
INSERT INTO public.estados (id_estado, nombre, codigo, estado) VALUES (21, 'Sucre', NULL, NULL);
INSERT INTO public.estados (id_estado, nombre, codigo, estado) VALUES (22, 'Táchira', NULL, NULL);
INSERT INTO public.estados (id_estado, nombre, codigo, estado) VALUES (23, 'Trujillo', NULL, NULL);
INSERT INTO public.estados (id_estado, nombre, codigo, estado) VALUES (24, 'Yaracuy', NULL, NULL);
INSERT INTO public.estados (id_estado, nombre, codigo, estado) VALUES (25, 'Zulia', NULL, NULL);


--
-- Data for Name: horarios; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.horarios (id_horario, id_sucursal, dia_semana, hora_apertura, hora_cierre, abierto) VALUES (2, 3, 'Lunes', '09:00:00', '14:30:00', true);


--
-- Data for Name: membresias; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.membresias (id_membresia, nombre, descripcion, precio, prioridad_busqueda, permite_favoritos, permite_destacado, permite_galeria, permite_promociones, cantidad_publicidad, estado, fecha_creacion, fecha_inicio, fecha_final) VALUES (2, 'Plan Corporativo Premium', 'Acceso ilimitado a galerías destacadas y mayor visibilidad en búsquedas globales.', 149.99, 3, true, true, true, true, 10, true, '16:58:53.732893', '2026-05-23', '2027-05-23');
INSERT INTO public.membresias (id_membresia, nombre, descripcion, precio, prioridad_busqueda, permite_favoritos, permite_destacado, permite_galeria, permite_promociones, cantidad_publicidad, estado, fecha_creacion, fecha_inicio, fecha_final) VALUES (3, 'Plan Corporativo Premium', 'Acceso ilimitado a galerías destacadas y mayor visibilidad en búsquedas globales.', 149.99, 3, true, true, true, true, 10, false, '16:59:19.330351', '2026-05-23', '2027-05-23');


--
-- Data for Name: metodos_pago; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.metodos_pago (id_metodo_pago, nombre, icono, descripcion, estado) VALUES (1, 'Pago Móvil', 'phone-android', 'Transferencias interbancarias inmediatas usando número de teléfono y cédula.', false);


--
-- Data for Name: modulos; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.modulos (id_modulo, nombre, ruta, icono, descripcion, estado) VALUES (1, 'Empresas', '/empresas', 'business', 'Gestión, registro y vinculación de empresas corporativas y comerciales.', true);
INSERT INTO public.modulos (id_modulo, nombre, ruta, icono, descripcion, estado) VALUES (2, 'Sucursales', '/sucursales', 'storefront', 'Administración de sedes operativas, ubicaciones geográficas y horarios diarios.', true);
INSERT INTO public.modulos (id_modulo, nombre, ruta, icono, descripcion, estado) VALUES (3, 'Membresías', '/membresias', 'card-membership', 'Configuración de planes comerciales, asignaciones y vigencia de contratos.', true);
INSERT INTO public.modulos (id_modulo, nombre, ruta, icono, descripcion, estado) VALUES (4, 'Pagos', '/pagos', 'payments', 'Control de transacciones financieras, verificación de referencias y logs de pasarelas.', true);
INSERT INTO public.modulos (id_modulo, nombre, ruta, icono, descripcion, estado) VALUES (5, 'Usuarios y Accesos', '/usuarios', 'people', 'Administración de perfiles de usuario, administradores y asignación de privilegios.', true);


--
-- Data for Name: municipios; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.municipios (id_municipio, id_estado, nombre, estado) VALUES (1, 1, 'Atures', true);
INSERT INTO public.municipios (id_municipio, id_estado, nombre, estado) VALUES (2, 1, 'Autana', true);
INSERT INTO public.municipios (id_municipio, id_estado, nombre, estado) VALUES (3, 1, 'Manapiare', true);
INSERT INTO public.municipios (id_municipio, id_estado, nombre, estado) VALUES (4, 2, 'Simón Bolívar', true);
INSERT INTO public.municipios (id_municipio, id_estado, nombre, estado) VALUES (5, 2, 'Juan Antonio Sotillo', true);
INSERT INTO public.municipios (id_municipio, id_estado, nombre, estado) VALUES (6, 2, 'Simón Rodríguez', true);
INSERT INTO public.municipios (id_municipio, id_estado, nombre, estado) VALUES (7, 3, 'San Fernando', true);
INSERT INTO public.municipios (id_municipio, id_estado, nombre, estado) VALUES (8, 3, 'Páez', true);
INSERT INTO public.municipios (id_municipio, id_estado, nombre, estado) VALUES (9, 3, 'Pedro Camejo', true);
INSERT INTO public.municipios (id_municipio, id_estado, nombre, estado) VALUES (10, 4, 'Girardot', true);
INSERT INTO public.municipios (id_municipio, id_estado, nombre, estado) VALUES (11, 4, 'Santiago Mariño', true);
INSERT INTO public.municipios (id_municipio, id_estado, nombre, estado) VALUES (12, 4, 'José Félix Ribas', true);
INSERT INTO public.municipios (id_municipio, id_estado, nombre, estado) VALUES (13, 5, 'Barinas', true);
INSERT INTO public.municipios (id_municipio, id_estado, nombre, estado) VALUES (14, 5, 'Alberto Arvelo Torrealba', true);
INSERT INTO public.municipios (id_municipio, id_estado, nombre, estado) VALUES (15, 5, 'Pedraza', true);
INSERT INTO public.municipios (id_municipio, id_estado, nombre, estado) VALUES (16, 6, 'Angostura del Orinoco', true);
INSERT INTO public.municipios (id_municipio, id_estado, nombre, estado) VALUES (17, 6, 'Caroní', true);
INSERT INTO public.municipios (id_municipio, id_estado, nombre, estado) VALUES (18, 6, 'Piar', true);
INSERT INTO public.municipios (id_municipio, id_estado, nombre, estado) VALUES (19, 7, 'Valencia', true);
INSERT INTO public.municipios (id_municipio, id_estado, nombre, estado) VALUES (20, 7, 'Puerto Cabello', true);
INSERT INTO public.municipios (id_municipio, id_estado, nombre, estado) VALUES (21, 7, 'Guacara', true);
INSERT INTO public.municipios (id_municipio, id_estado, nombre, estado) VALUES (22, 8, 'Ezequiel Zamora', true);
INSERT INTO public.municipios (id_municipio, id_estado, nombre, estado) VALUES (23, 8, 'Tinaquillo', true);
INSERT INTO public.municipios (id_municipio, id_estado, nombre, estado) VALUES (24, 8, 'Tinaco', true);
INSERT INTO public.municipios (id_municipio, id_estado, nombre, estado) VALUES (25, 9, 'Tucupita', true);
INSERT INTO public.municipios (id_municipio, id_estado, nombre, estado) VALUES (26, 9, 'Pedernales', true);
INSERT INTO public.municipios (id_municipio, id_estado, nombre, estado) VALUES (27, 9, 'Antonio Díaz', true);
INSERT INTO public.municipios (id_municipio, id_estado, nombre, estado) VALUES (28, 10, 'Archipiélago Los Roques', true);
INSERT INTO public.municipios (id_municipio, id_estado, nombre, estado) VALUES (29, 10, 'Isla La Tortuga', true);
INSERT INTO public.municipios (id_municipio, id_estado, nombre, estado) VALUES (30, 10, 'Archipiélago Las Aves', true);
INSERT INTO public.municipios (id_municipio, id_estado, nombre, estado) VALUES (31, 11, 'Libertador (Catedral)', true);
INSERT INTO public.municipios (id_municipio, id_estado, nombre, estado) VALUES (32, 11, 'Libertador (Sucre)', true);
INSERT INTO public.municipios (id_municipio, id_estado, nombre, estado) VALUES (33, 11, 'Libertador (El Valle)', true);
INSERT INTO public.municipios (id_municipio, id_estado, nombre, estado) VALUES (34, 12, 'Miranda', true);
INSERT INTO public.municipios (id_municipio, id_estado, nombre, estado) VALUES (35, 12, 'Carirubana', true);
INSERT INTO public.municipios (id_municipio, id_estado, nombre, estado) VALUES (36, 12, 'Silva', true);
INSERT INTO public.municipios (id_municipio, id_estado, nombre, estado) VALUES (37, 13, 'Juan Germán Roscio', true);
INSERT INTO public.municipios (id_municipio, id_estado, nombre, estado) VALUES (38, 13, 'Francisco de Miranda', true);
INSERT INTO public.municipios (id_municipio, id_estado, nombre, estado) VALUES (39, 13, 'Leonardo Infante', true);
INSERT INTO public.municipios (id_municipio, id_estado, nombre, estado) VALUES (40, 14, 'Vargas (Maiquetía)', true);
INSERT INTO public.municipios (id_municipio, id_estado, nombre, estado) VALUES (41, 14, 'Vargas (Catia La Mar)', true);
INSERT INTO public.municipios (id_municipio, id_estado, nombre, estado) VALUES (42, 14, 'Vargas (Caruao)', true);
INSERT INTO public.municipios (id_municipio, id_estado, nombre, estado) VALUES (43, 15, 'Iribarren', true);
INSERT INTO public.municipios (id_municipio, id_estado, nombre, estado) VALUES (44, 15, 'Torres', true);
INSERT INTO public.municipios (id_municipio, id_estado, nombre, estado) VALUES (45, 15, 'Morán', true);
INSERT INTO public.municipios (id_municipio, id_estado, nombre, estado) VALUES (46, 16, 'Libertador', true);
INSERT INTO public.municipios (id_municipio, id_estado, nombre, estado) VALUES (47, 16, 'Alberto Adriani', true);
INSERT INTO public.municipios (id_municipio, id_estado, nombre, estado) VALUES (48, 16, 'Tovar', true);
INSERT INTO public.municipios (id_municipio, id_estado, nombre, estado) VALUES (49, 17, 'Guaicaipuro', true);
INSERT INTO public.municipios (id_municipio, id_estado, nombre, estado) VALUES (50, 17, 'Plaza', true);
INSERT INTO public.municipios (id_municipio, id_estado, nombre, estado) VALUES (51, 17, 'Sucre', true);
INSERT INTO public.municipios (id_municipio, id_estado, nombre, estado) VALUES (52, 18, 'Maturín', true);
INSERT INTO public.municipios (id_municipio, id_estado, nombre, estado) VALUES (53, 18, 'Piar', true);
INSERT INTO public.municipios (id_municipio, id_estado, nombre, estado) VALUES (54, 18, 'Bolívar', true);
INSERT INTO public.municipios (id_municipio, id_estado, nombre, estado) VALUES (55, 19, 'Mariño', true);
INSERT INTO public.municipios (id_municipio, id_estado, nombre, estado) VALUES (56, 19, 'Arismendi', true);
INSERT INTO public.municipios (id_municipio, id_estado, nombre, estado) VALUES (57, 19, 'Maneiro', true);
INSERT INTO public.municipios (id_municipio, id_estado, nombre, estado) VALUES (58, 20, 'Guanare', true);
INSERT INTO public.municipios (id_municipio, id_estado, nombre, estado) VALUES (59, 20, 'Páez', true);
INSERT INTO public.municipios (id_municipio, id_estado, nombre, estado) VALUES (60, 20, 'Araure', true);
INSERT INTO public.municipios (id_municipio, id_estado, nombre, estado) VALUES (61, 21, 'Sucre', true);
INSERT INTO public.municipios (id_municipio, id_estado, nombre, estado) VALUES (62, 21, 'Bermúdez', true);
INSERT INTO public.municipios (id_municipio, id_estado, nombre, estado) VALUES (63, 21, 'Valdez', true);
INSERT INTO public.municipios (id_municipio, id_estado, nombre, estado) VALUES (64, 22, 'San Cristóbal', true);
INSERT INTO public.municipios (id_municipio, id_estado, nombre, estado) VALUES (65, 22, 'Junín', true);
INSERT INTO public.municipios (id_municipio, id_estado, nombre, estado) VALUES (66, 22, 'Bolívar', true);
INSERT INTO public.municipios (id_municipio, id_estado, nombre, estado) VALUES (67, 23, 'Trujillo', true);
INSERT INTO public.municipios (id_municipio, id_estado, nombre, estado) VALUES (68, 23, 'Valera', true);
INSERT INTO public.municipios (id_municipio, id_estado, nombre, estado) VALUES (69, 23, 'Boconó', true);
INSERT INTO public.municipios (id_municipio, id_estado, nombre, estado) VALUES (70, 24, 'San Felipe', true);
INSERT INTO public.municipios (id_municipio, id_estado, nombre, estado) VALUES (71, 24, 'Peña', true);
INSERT INTO public.municipios (id_municipio, id_estado, nombre, estado) VALUES (72, 24, 'Bruzual', true);
INSERT INTO public.municipios (id_municipio, id_estado, nombre, estado) VALUES (73, 25, 'Maracaibo', true);
INSERT INTO public.municipios (id_municipio, id_estado, nombre, estado) VALUES (74, 25, 'Cabimas', true);
INSERT INTO public.municipios (id_municipio, id_estado, nombre, estado) VALUES (75, 25, 'Lagunillas', true);


--
-- Data for Name: notificaciones; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: pagos_membresias; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.pagos_membresias (id_pago, id_empresa_membresia, referencia_pago, paypal_transaction_id, payer_email, monto, moneda, estado_pago, metodo_pago, respuesta_paypal, fecha_pago) VALUES (2, 3, 'REF-TRANS-44021', 'TXN77291045X', 'finance-corp@empresa.com', 149.99, 'USD', 'APROBADO', 'PayPal', '{"status":"COMPLETED","intent":"CAPTURE"}', '2026-05-23 17:30:00');


--
-- Data for Name: perfil_modulo_privilegio; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.perfil_modulo_privilegio (id_perfil_modulo_privilegio, id_perfil, id_modulo, id_privilegio) VALUES (2, 4, 2, 2);
INSERT INTO public.perfil_modulo_privilegio (id_perfil_modulo_privilegio, id_perfil, id_modulo, id_privilegio) VALUES (3, 4, 5, 2);


--
-- Data for Name: perfiles; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.perfiles (id_perfil, nombre, descripcion, nivel_acceso, estado) VALUES (4, 'Supervisor de IT', 'Encargado de gestionar incidencias y moderación intermedia.', 50, false);


--
-- Data for Name: privilegios; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.privilegios (id_privilegio, nombre, descripcion) VALUES (1, 'CREAR', 'Permite registrar nuevos elementos, contratos o transacciones en el sistema.');
INSERT INTO public.privilegios (id_privilegio, nombre, descripcion) VALUES (2, 'EDITAR', 'Permite modificar la información de registros existentes en la base de datos.');
INSERT INTO public.privilegios (id_privilegio, nombre, descripcion) VALUES (3, 'ELIMINAR', 'Permite la desactivación o borrado lógico de registros del sistema.');


--
-- Data for Name: products; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.products (id_product, name, description, price, stock, category_id, created_at, updated_at) VALUES (1, 'Mouse Gamer', 'Sensor óptico de 16000 DPI', 25.00, 30, 1, '2026-05-12 14:43:50.664025', '2026-05-12 14:43:50.664025');
INSERT INTO public.products (id_product, name, description, price, stock, category_id, created_at, updated_at) VALUES (2, 'Monitor 24" 144Hz', 'Panel IPS con tiempo de respuesta de 1ms', 180.00, 15, 2, '2026-05-12 14:43:50.664025', '2026-05-12 14:43:50.664025');


--
-- Data for Name: recompensas; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.recompensas (id_recompensa, id_usuario, titulo, descripcion, tipo, fecha_generada, estado) VALUES (3, 1, 'Bienvenida', 'Descuento del 15% aplicable en su primera compra de cualquier sucursal.', 'Aumento', '2026-05-24 11:21:19.839863', false);
INSERT INTO public.recompensas (id_recompensa, id_usuario, titulo, descripcion, tipo, fecha_generada, estado) VALUES (2, 1, 'Bienvenida', 'Descuento del 15% aplicable en su primera compra de cualquier sucursal.', 'Aumento', '2026-05-24 11:15:50.542603', false);


--
-- Data for Name: sucursal_metodo_pago; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: sucursales; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.sucursales (id_sucursal, id_empresa, id_estado, id_municipio, id_ciudad, nombre_sucursal, direccion, telefono, correo, foto_principal, descripcion, estado, fecha_creacion) VALUES (3, 3, 4, 11, 10, 'Sucursal Norte Prados', 'Av. Principal con calle 4, Local 12-A', '02432345678', 'norte@inversionescentro.com', 'https://images.com/sucursales/suc-901.png', 'Sede operativa de distribución para la zona norte.', false, '17:54:15.132928');


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.users (id_user, name, "lastName", email, role, password) VALUES (3, 'luis', 'alvarez', 'luis@gmail.com', 'user', '$2b$10$GWylUzKBCUcariN3eeahN.NYPn3zMuIi1xFVv431Srt5mVghH9Cdi');
INSERT INTO public.users (id_user, name, "lastName", email, role, password) VALUES (4, 'yulieth', 'nieto', 'yulieth@gmail.com', 'user', '$2b$10$7W/wT0kavNVUHHjYeyofg.yYmo07IE8We6AdtY7b0ZvKJJlVjkx5.');


--
-- Data for Name: usuarios; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.usuarios (id_usuario, tipo_usuario, id_estado, id_municipio, id_ciudad, nombres, apellidos, correo, password_hash, telefono, foto_perfil, ultimo_login, token_recuperacion, verificado, estado, fecha_registro) VALUES (2, 'user', 4, 11, 10, 'Luis', 'Alvarez', 'luis@aki.com', '$2b$10$oaqPUKQmEII2Q.jEBzgk3.MFgf55lf3gSYmFWrERBp0LlSMqjyhBC', '04121234567', 'https://example.com/avatar.jpg', NULL, NULL, NULL, NULL, '2026-05-24 08:57:14.812471');
INSERT INTO public.usuarios (id_usuario, tipo_usuario, id_estado, id_municipio, id_ciudad, nombres, apellidos, correo, password_hash, telefono, foto_perfil, ultimo_login, token_recuperacion, verificado, estado, fecha_registro) VALUES (1, 'admin', 4, 11, 10, 'San', 'Alberto', 'juan.perez@aki.com', '$2b$10$sD9dlxWw4t1lZxOGWRf3sebrB.K21eRsss2VZrlu5o3W9RvGxJ3Ki', '04141234567', 'https://example.com/avatar.png', NULL, NULL, NULL, false, '2026-05-24 08:48:21.117751');


--
-- Name: administradores_empresas_id_administrador_empresa_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.administradores_empresas_id_administrador_empresa_seq', 1, true);


--
-- Name: administradores_id_administrador_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.administradores_id_administrador_seq', 2, true);


--
-- Name: bitacora_id_bitacora_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.bitacora_id_bitacora_seq', 21, true);


--
-- Name: categorias_id_categoria_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.categorias_id_categoria_seq', 3, true);


--
-- Name: ciudades_id_ciudad_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.ciudades_id_ciudad_seq', 75, true);


--
-- Name: clientes_id_cliente_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.clientes_id_cliente_seq', 1, true);


--
-- Name: empresa_membresias_id_empresa_membresia_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.empresa_membresias_id_empresa_membresia_seq', 3, true);


--
-- Name: empresas_id_empresa_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.empresas_id_empresa_seq', 8, true);


--
-- Name: estados_id_estado_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.estados_id_estado_seq', 1, false);


--
-- Name: horarios_id_horario_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.horarios_id_horario_seq', 2, true);


--
-- Name: membresias_id_membresia_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.membresias_id_membresia_seq', 3, true);


--
-- Name: metodos_pago_id_metodo_pago_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.metodos_pago_id_metodo_pago_seq', 1, true);


--
-- Name: modulos_id_modulo_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.modulos_id_modulo_seq', 5, true);


--
-- Name: municipios_id_municipio_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.municipios_id_municipio_seq', 1, false);


--
-- Name: notificaciones_id_notificacion_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.notificaciones_id_notificacion_seq', 1, false);


--
-- Name: pagos_membresias_id_pago_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.pagos_membresias_id_pago_seq', 2, true);


--
-- Name: perfil_modulo_privilegio_id_perfil_modulo_privilegio_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.perfil_modulo_privilegio_id_perfil_modulo_privilegio_seq', 3, true);


--
-- Name: perfiles_id_perfil_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.perfiles_id_perfil_seq', 7, true);


--
-- Name: privilegios_id_privilegio_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.privilegios_id_privilegio_seq', 3, true);


--
-- Name: products_id_product_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.products_id_product_seq', 2, true);


--
-- Name: recompensas_id_recompensa_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.recompensas_id_recompensa_seq', 3, true);


--
-- Name: sucursal_metodo_pago_id_sucursal_metodo_pago_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.sucursal_metodo_pago_id_sucursal_metodo_pago_seq', 1, false);


--
-- Name: sucursales_id_sucursal_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.sucursales_id_sucursal_seq', 4, true);


--
-- Name: users_id_user_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_user_seq', 4, true);


--
-- Name: usuarios_id_usuario_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.usuarios_id_usuario_seq', 2, true);


--
-- Name: administradores_empresas administradores_empresas_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.administradores_empresas
    ADD CONSTRAINT administradores_empresas_pkey PRIMARY KEY (id_administrador_empresa);


--
-- Name: administradores administradores_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.administradores
    ADD CONSTRAINT administradores_pkey PRIMARY KEY (id_administrador);


--
-- Name: bitacora bitacora_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bitacora
    ADD CONSTRAINT bitacora_pkey PRIMARY KEY (id_bitacora);


--
-- Name: categorias categorias_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categorias
    ADD CONSTRAINT categorias_pkey PRIMARY KEY (id_categoria);


--
-- Name: ciudades ciudades_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ciudades
    ADD CONSTRAINT ciudades_pkey PRIMARY KEY (id_ciudad);


--
-- Name: clientes clientes_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.clientes
    ADD CONSTRAINT clientes_pkey PRIMARY KEY (id_cliente);


--
-- Name: empresa_membresias empresa_membresias_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.empresa_membresias
    ADD CONSTRAINT empresa_membresias_pkey PRIMARY KEY (id_empresa_membresia);


--
-- Name: empresas empresas_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.empresas
    ADD CONSTRAINT empresas_pkey PRIMARY KEY (id_empresa);


--
-- Name: estados estados_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.estados
    ADD CONSTRAINT estados_pkey PRIMARY KEY (id_estado);


--
-- Name: horarios horarios_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.horarios
    ADD CONSTRAINT horarios_pkey PRIMARY KEY (id_horario);


--
-- Name: membresias membresias_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.membresias
    ADD CONSTRAINT membresias_pkey PRIMARY KEY (id_membresia);


--
-- Name: metodos_pago metodos_pago_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.metodos_pago
    ADD CONSTRAINT metodos_pago_pkey PRIMARY KEY (id_metodo_pago);


--
-- Name: modulos modulos_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.modulos
    ADD CONSTRAINT modulos_pkey PRIMARY KEY (id_modulo);


--
-- Name: municipios municipios_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.municipios
    ADD CONSTRAINT municipios_pkey PRIMARY KEY (id_municipio);


--
-- Name: notificaciones notificaciones_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notificaciones
    ADD CONSTRAINT notificaciones_pkey PRIMARY KEY (id_notificacion);


--
-- Name: pagos_membresias pagos_membresias_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pagos_membresias
    ADD CONSTRAINT pagos_membresias_pkey PRIMARY KEY (id_pago);


--
-- Name: perfil_modulo_privilegio perfil_modulo_privilegio_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.perfil_modulo_privilegio
    ADD CONSTRAINT perfil_modulo_privilegio_pkey PRIMARY KEY (id_perfil_modulo_privilegio);


--
-- Name: perfiles perfiles_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.perfiles
    ADD CONSTRAINT perfiles_pkey PRIMARY KEY (id_perfil);


--
-- Name: privilegios privilegios_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.privilegios
    ADD CONSTRAINT privilegios_pkey PRIMARY KEY (id_privilegio);


--
-- Name: products products_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_pkey PRIMARY KEY (id_product);


--
-- Name: recompensas recompensas_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.recompensas
    ADD CONSTRAINT recompensas_pkey PRIMARY KEY (id_recompensa);


--
-- Name: sucursal_metodo_pago sucursal_metodo_pago_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sucursal_metodo_pago
    ADD CONSTRAINT sucursal_metodo_pago_pkey PRIMARY KEY (id_sucursal_metodo_pago);


--
-- Name: sucursales sucursales_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sucursales
    ADD CONSTRAINT sucursales_pkey PRIMARY KEY (id_sucursal);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id_user);


--
-- Name: usuarios usuarios_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_pkey PRIMARY KEY (id_usuario);


--
-- Name: empresas tr_bitacora_empresas; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER tr_bitacora_empresas AFTER INSERT OR UPDATE ON public.empresas FOR EACH ROW EXECUTE FUNCTION public.fn_bitacora();


--
-- Name: sucursales tr_bitacora_sucursales; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER tr_bitacora_sucursales AFTER INSERT OR UPDATE ON public.sucursales FOR EACH ROW EXECUTE FUNCTION public.fn_bitacora();


--
-- Name: clientes tr_clientes_fecha_registro; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER tr_clientes_fecha_registro BEFORE INSERT ON public.clientes FOR EACH ROW EXECUTE FUNCTION public.fn_fecha_registro();


--
-- Name: empresa_membresias tr_empresa_membresias_fecha_registro; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER tr_empresa_membresias_fecha_registro BEFORE INSERT ON public.empresa_membresias FOR EACH ROW EXECUTE FUNCTION public.fn_fecha_registro();


--
-- Name: empresas tr_empresas_fecha_registro; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER tr_empresas_fecha_registro BEFORE INSERT ON public.empresas FOR EACH ROW EXECUTE FUNCTION public.fn_fecha_registro();


--
-- Name: pagos_membresias tr_pago_membresia; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER tr_pago_membresia AFTER INSERT ON public.pagos_membresias FOR EACH ROW EXECUTE FUNCTION public.fn_activar_membresia_pago();


--
-- Name: usuarios tr_usuarios_fecha_registro; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER tr_usuarios_fecha_registro BEFORE INSERT ON public.usuarios FOR EACH ROW EXECUTE FUNCTION public.fn_fecha_registro();


--
-- Name: administradores_empresas administradores_empresas_id_administrador_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.administradores_empresas
    ADD CONSTRAINT administradores_empresas_id_administrador_fkey FOREIGN KEY (id_administrador) REFERENCES public.administradores(id_administrador);


--
-- Name: administradores_empresas administradores_empresas_id_empresa_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.administradores_empresas
    ADD CONSTRAINT administradores_empresas_id_empresa_fkey FOREIGN KEY (id_empresa) REFERENCES public.empresas(id_empresa);


--
-- Name: administradores administradores_id_perfil_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.administradores
    ADD CONSTRAINT administradores_id_perfil_fkey FOREIGN KEY (id_perfil) REFERENCES public.perfiles(id_perfil);


--
-- Name: administradores administradores_id_usuario_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.administradores
    ADD CONSTRAINT administradores_id_usuario_fkey FOREIGN KEY (id_usuario) REFERENCES public.usuarios(id_usuario);


--
-- Name: bitacora bitacora_id_administrador_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bitacora
    ADD CONSTRAINT bitacora_id_administrador_fkey FOREIGN KEY (id_administrador) REFERENCES public.administradores(id_administrador);


--
-- Name: bitacora bitacora_id_modulo_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bitacora
    ADD CONSTRAINT bitacora_id_modulo_fkey FOREIGN KEY (id_modulo) REFERENCES public.modulos(id_modulo);


--
-- Name: ciudades ciudades_id_municipio_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ciudades
    ADD CONSTRAINT ciudades_id_municipio_fkey FOREIGN KEY (id_municipio) REFERENCES public.municipios(id_municipio);


--
-- Name: clientes clientes_id_usuario_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.clientes
    ADD CONSTRAINT clientes_id_usuario_fkey FOREIGN KEY (id_usuario) REFERENCES public.usuarios(id_usuario);


--
-- Name: empresa_membresias empresa_membresias_id_empresa_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.empresa_membresias
    ADD CONSTRAINT empresa_membresias_id_empresa_fkey FOREIGN KEY (id_empresa) REFERENCES public.empresas(id_empresa);


--
-- Name: empresa_membresias empresa_membresias_id_membresia_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.empresa_membresias
    ADD CONSTRAINT empresa_membresias_id_membresia_fkey FOREIGN KEY (id_membresia) REFERENCES public.membresias(id_membresia);


--
-- Name: empresas empresas_id_categoria_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.empresas
    ADD CONSTRAINT empresas_id_categoria_fkey FOREIGN KEY (id_categoria) REFERENCES public.categorias(id_categoria);


--
-- Name: empresas empresas_id_ciudad_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.empresas
    ADD CONSTRAINT empresas_id_ciudad_fkey FOREIGN KEY (id_ciudad) REFERENCES public.ciudades(id_ciudad);


--
-- Name: empresas empresas_id_estado_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.empresas
    ADD CONSTRAINT empresas_id_estado_fkey FOREIGN KEY (id_estado) REFERENCES public.estados(id_estado);


--
-- Name: empresas empresas_id_municipio_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.empresas
    ADD CONSTRAINT empresas_id_municipio_fkey FOREIGN KEY (id_municipio) REFERENCES public.municipios(id_municipio);


--
-- Name: empresas empresas_id_usuario_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.empresas
    ADD CONSTRAINT empresas_id_usuario_fkey FOREIGN KEY (id_usuario) REFERENCES public.usuarios(id_usuario);


--
-- Name: horarios horarios_id_sucursal_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.horarios
    ADD CONSTRAINT horarios_id_sucursal_fkey FOREIGN KEY (id_sucursal) REFERENCES public.sucursales(id_sucursal);


--
-- Name: municipios municipios_id_estado_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.municipios
    ADD CONSTRAINT municipios_id_estado_fkey FOREIGN KEY (id_estado) REFERENCES public.estados(id_estado);


--
-- Name: notificaciones notificaciones_id_usuario_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notificaciones
    ADD CONSTRAINT notificaciones_id_usuario_fkey FOREIGN KEY (id_usuario) REFERENCES public.usuarios(id_usuario);


--
-- Name: pagos_membresias pagos_membresias_id_empresa_membresia_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pagos_membresias
    ADD CONSTRAINT pagos_membresias_id_empresa_membresia_fkey FOREIGN KEY (id_empresa_membresia) REFERENCES public.empresa_membresias(id_empresa_membresia);


--
-- Name: perfil_modulo_privilegio perfil_modulo_privilegio_id_modulo_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.perfil_modulo_privilegio
    ADD CONSTRAINT perfil_modulo_privilegio_id_modulo_fkey FOREIGN KEY (id_modulo) REFERENCES public.modulos(id_modulo);


--
-- Name: perfil_modulo_privilegio perfil_modulo_privilegio_id_perfil_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.perfil_modulo_privilegio
    ADD CONSTRAINT perfil_modulo_privilegio_id_perfil_fkey FOREIGN KEY (id_perfil) REFERENCES public.perfiles(id_perfil);


--
-- Name: perfil_modulo_privilegio perfil_modulo_privilegio_id_privilegio_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.perfil_modulo_privilegio
    ADD CONSTRAINT perfil_modulo_privilegio_id_privilegio_fkey FOREIGN KEY (id_privilegio) REFERENCES public.privilegios(id_privilegio);


--
-- Name: recompensas recompensas_id_usuario_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.recompensas
    ADD CONSTRAINT recompensas_id_usuario_fkey FOREIGN KEY (id_usuario) REFERENCES public.usuarios(id_usuario);


--
-- Name: sucursal_metodo_pago sucursal_metodo_pago_id_metodo_pago_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sucursal_metodo_pago
    ADD CONSTRAINT sucursal_metodo_pago_id_metodo_pago_fkey FOREIGN KEY (id_metodo_pago) REFERENCES public.metodos_pago(id_metodo_pago);


--
-- Name: sucursal_metodo_pago sucursal_metodo_pago_id_sucursal_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sucursal_metodo_pago
    ADD CONSTRAINT sucursal_metodo_pago_id_sucursal_fkey FOREIGN KEY (id_sucursal) REFERENCES public.sucursales(id_sucursal);


--
-- Name: sucursales sucursales_id_ciudad_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sucursales
    ADD CONSTRAINT sucursales_id_ciudad_fkey FOREIGN KEY (id_ciudad) REFERENCES public.ciudades(id_ciudad);


--
-- Name: sucursales sucursales_id_empresa_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sucursales
    ADD CONSTRAINT sucursales_id_empresa_fkey FOREIGN KEY (id_empresa) REFERENCES public.empresas(id_empresa);


--
-- Name: sucursales sucursales_id_estado_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sucursales
    ADD CONSTRAINT sucursales_id_estado_fkey FOREIGN KEY (id_estado) REFERENCES public.estados(id_estado);


--
-- Name: sucursales sucursales_id_municipio_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sucursales
    ADD CONSTRAINT sucursales_id_municipio_fkey FOREIGN KEY (id_municipio) REFERENCES public.municipios(id_municipio);


--
-- Name: usuarios usuarios_id_ciudad_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_id_ciudad_fkey FOREIGN KEY (id_ciudad) REFERENCES public.ciudades(id_ciudad);


--
-- Name: usuarios usuarios_id_estado_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_id_estado_fkey FOREIGN KEY (id_estado) REFERENCES public.estados(id_estado);


--
-- Name: usuarios usuarios_id_municipio_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_id_municipio_fkey FOREIGN KEY (id_municipio) REFERENCES public.municipios(id_municipio);


--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: postgres
--

REVOKE USAGE ON SCHEMA public FROM PUBLIC;
GRANT ALL ON SCHEMA public TO PUBLIC;


--
-- Name: SEQUENCE clientes_id_cliente_seq; Type: ACL; Schema: public; Owner: postgres
--

REVOKE ALL ON SEQUENCE public.clientes_id_cliente_seq FROM postgres;
GRANT ALL ON SEQUENCE public.clientes_id_cliente_seq TO postgres WITH GRANT OPTION;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: public; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON SEQUENCES TO postgres WITH GRANT OPTION;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: public; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON TABLES TO postgres WITH GRANT OPTION;


--
-- PostgreSQL database dump complete
--

