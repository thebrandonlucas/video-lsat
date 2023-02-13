DROP TABLE IF EXISTS videos;

CREATE SEQUENCE IF NOT EXISTS video_id_seq START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;

CREATE TABLE videos (
    id bigint DEFAULT nextval('video_id_seq'::regclass) NOT NULL PRIMARY KEY,
    video_id character varying(255) NOT NULL UNIQUE,
    video_name character varying(255) NOT NULL,
    views_count int NOT NULL, 
    price_satoshi int NOT NULL,
    invoice_macaroon character varying(586) NOT NULL,
    api_host_port character varying(255) NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);
