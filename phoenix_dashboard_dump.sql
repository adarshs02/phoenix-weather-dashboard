--
-- PostgreSQL database dump
--

\restrict TOngkoh4WPGwzhdQZLNFeBJDKj7hWEOoho1Fq5yL4l1N7NwEIo4ZqLZWHMId6tU

-- Dumped from database version 15.14
-- Dumped by pg_dump version 15.14

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: reading; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.reading (
    id integer NOT NULL,
    station_id integer NOT NULL,
    variable_id integer NOT NULL,
    observed_at timestamp without time zone NOT NULL,
    value_num numeric(10,2),
    value_text text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.reading OWNER TO postgres;

--
-- Name: reading_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.reading_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.reading_id_seq OWNER TO postgres;

--
-- Name: reading_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.reading_id_seq OWNED BY public.reading.id;


--
-- Name: source; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.source (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    api_endpoint text
);


ALTER TABLE public.source OWNER TO postgres;

--
-- Name: source_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.source_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.source_id_seq OWNER TO postgres;

--
-- Name: source_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.source_id_seq OWNED BY public.source.id;


--
-- Name: station; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.station (
    id integer NOT NULL,
    external_id character varying(100),
    name character varying(200) NOT NULL,
    latitude numeric(10,7) NOT NULL,
    longitude numeric(10,7) NOT NULL,
    source_id integer,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.station OWNER TO postgres;

--
-- Name: station_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.station_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.station_id_seq OWNER TO postgres;

--
-- Name: station_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.station_id_seq OWNED BY public.station.id;


--
-- Name: variable; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.variable (
    id integer NOT NULL,
    code character varying(50) NOT NULL,
    unit character varying(50) NOT NULL
);


ALTER TABLE public.variable OWNER TO postgres;

--
-- Name: variable_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.variable_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.variable_id_seq OWNER TO postgres;

--
-- Name: variable_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.variable_id_seq OWNED BY public.variable.id;


--
-- Name: reading id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reading ALTER COLUMN id SET DEFAULT nextval('public.reading_id_seq'::regclass);


--
-- Name: source id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.source ALTER COLUMN id SET DEFAULT nextval('public.source_id_seq'::regclass);


--
-- Name: station id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.station ALTER COLUMN id SET DEFAULT nextval('public.station_id_seq'::regclass);


--
-- Name: variable id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.variable ALTER COLUMN id SET DEFAULT nextval('public.variable_id_seq'::regclass);


--
-- Data for Name: reading; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.reading (id, station_id, variable_id, observed_at, value_num, value_text, created_at) FROM stdin;
31200	28	1	2025-12-06 02:47:00	57.20	\N	2025-12-06 04:00:00.966918
31203	30	1	2025-12-06 02:55:00	51.80	\N	2025-12-06 03:27:59.334674
31204	38	1	2025-12-06 03:10:00	50.00	\N	2025-12-06 03:28:25.365072
31206	37	1	2025-12-06 03:10:00	50.00	\N	2025-12-06 03:28:48.755198
31223	34	1	2025-12-06 03:15:00	55.40	\N	2025-12-06 03:29:56.21222
31227	17	1	2025-12-06 03:10:00	57.20	\N	2025-12-06 03:30:03.721883
31302	18	1	2025-12-06 03:30:00	55.40	\N	2025-12-06 03:45:19.100564
31316	37	1	2025-12-06 03:40:00	51.80	\N	2025-12-06 04:00:00.993737
31269	33	1	2025-12-06 02:47:00	60.80	\N	2025-12-06 04:15:40.537959
31234	38	1	2025-12-06 03:15:00	51.80	\N	2025-12-06 03:31:26.56304
31305	20	1	2025-12-06 03:30:00	55.40	\N	2025-12-06 03:45:20.501294
31236	37	1	2025-12-06 03:15:00	51.80	\N	2025-12-06 03:31:28.303363
31315	30	1	2025-12-06 03:35:00	50.00	\N	2025-12-06 04:00:01.003563
31318	38	1	2025-12-06 03:40:00	51.80	\N	2025-12-06 04:00:01.071474
31205	38	3	2025-12-05 20:00:00	30.00	Good	2025-12-06 04:00:01.47406
31210	35	1	2025-12-06 03:10:00	55.40	\N	2025-12-06 03:31:32.405657
31207	37	3	2025-12-05 20:00:00	70.00	Moderate	2025-12-06 04:00:01.612691
31209	23	3	2025-12-05 20:00:00	34.00	Good	2025-12-06 04:00:01.623306
31391	37	1	2025-12-06 03:50:00	50.00	\N	2025-12-06 04:15:00.401084
31392	38	1	2025-12-06 03:50:00	50.00	\N	2025-12-06 04:15:00.410458
31393	30	1	2025-12-06 03:55:00	48.20	\N	2025-12-06 04:15:00.759632
31394	38	3	2025-12-05 21:00:00	27.00	Good	2025-12-06 04:15:00.794647
31395	37	3	2025-12-05 21:00:00	80.00	Moderate	2025-12-06 04:15:01.006579
31208	23	1	2025-12-06 02:47:00	51.80	\N	2025-12-06 04:15:01.086578
31397	23	3	2025-12-05 21:00:00	33.00	Good	2025-12-06 04:15:01.464197
31253	34	1	2025-12-06 03:10:00	55.40	\N	2025-12-06 03:32:56.193608
31398	28	1	2025-12-06 03:47:00	53.60	\N	2025-12-06 04:15:03.05046
31399	28	3	2025-12-05 21:00:00	80.00	Moderate	2025-12-06 04:15:03.576401
31400	29	1	2025-12-06 03:47:00	53.60	\N	2025-12-06 04:15:04.096207
31257	17	1	2025-12-06 03:15:00	57.20	\N	2025-12-06 03:33:07.884219
31401	29	3	2025-12-05 21:00:00	31.00	Good	2025-12-06 04:15:04.65681
31212	24	1	2025-12-06 02:47:00	51.80	\N	2025-12-06 04:15:05.294947
31260	19	1	2025-12-06 03:10:00	55.40	\N	2025-12-06 03:33:18.917235
31262	18	1	2025-12-06 03:15:00	57.20	\N	2025-12-06 03:33:21.575087
31265	20	1	2025-12-06 03:15:00	57.20	\N	2025-12-06 03:33:30.828954
31202	28	3	2025-12-05 20:00:00	70.00	Moderate	2025-12-06 04:00:01.641224
31430	33	3	2025-12-05 21:00:00	31.00	Good	2025-12-06 04:15:40.789264
31233	30	1	2025-12-06 03:15:00	50.00	\N	2025-12-06 03:45:05.067497
31274	38	1	2025-12-06 03:30:00	51.80	\N	2025-12-06 03:45:06.222605
31216	29	1	2025-12-06 02:47:00	57.20	\N	2025-12-06 04:00:02.363856
31276	37	1	2025-12-06 03:30:00	51.80	\N	2025-12-06 03:45:06.941458
31326	35	1	2025-12-06 03:35:00	53.60	\N	2025-12-06 04:00:02.374664
31215	25	3	2025-12-05 20:00:00	70.00	Moderate	2025-12-06 04:00:03.248632
31280	35	1	2025-12-06 03:25:00	55.40	\N	2025-12-06 03:45:09.540659
31211	35	3	2025-12-05 20:00:00	30.00	Good	2025-12-06 04:00:03.560685
31218	31	3	2025-12-05 20:00:00	70.00	Moderate	2025-12-06 04:00:03.828262
31217	29	3	2025-12-05 20:00:00	29.00	Good	2025-12-06 04:00:04.172828
31213	24	3	2025-12-05 20:00:00	34.00	Good	2025-12-06 04:00:05.835827
31337	17	1	2025-12-06 03:35:00	55.40	\N	2025-12-06 04:00:06.072692
31331	34	1	2025-12-06 03:35:00	53.60	\N	2025-12-06 04:00:06.082187
31219	22	1	2025-12-06 02:48:00	55.40	\N	2025-12-06 04:00:06.105551
31220	22	3	2025-12-05 20:00:00	34.00	Good	2025-12-06 04:00:06.526688
31226	26	3	2025-12-05 20:00:00	70.00	Moderate	2025-12-06 04:00:08.219341
31224	34	3	2025-12-05 20:00:00	70.00	Moderate	2025-12-06 04:00:08.579862
31293	34	1	2025-12-06 03:25:00	55.40	\N	2025-12-06 03:45:15.342609
31228	17	3	2025-12-05 20:00:00	70.00	Moderate	2025-12-06 04:00:09.058444
31222	21	3	2025-12-05 20:00:00	34.00	Good	2025-12-06 04:00:09.165248
31229	36	1	2025-12-06 02:48:00	55.40	\N	2025-12-06 04:00:09.361532
31297	17	1	2025-12-06 03:30:00	55.40	\N	2025-12-06 03:45:16.777509
31345	19	1	2025-12-06 03:35:00	53.60	\N	2025-12-06 04:00:09.390428
31381	20	1	2025-12-06 03:40:00	55.40	\N	2025-12-06 04:00:09.394756
31300	19	1	2025-12-06 03:25:00	55.40	\N	2025-12-06 03:45:18.455775
31403	24	3	2025-12-05 21:00:00	33.00	Good	2025-12-06 04:15:05.997541
31404	35	1	2025-12-06 04:00:00	53.60	\N	2025-12-06 04:15:06.640068
31405	35	3	2025-12-05 21:00:00	27.00	Good	2025-12-06 04:15:06.997359
31214	25	1	2025-12-06 02:47:00	60.80	\N	2025-12-06 04:15:07.043598
31407	25	3	2025-12-05 21:00:00	80.00	Moderate	2025-12-06 04:15:07.368748
31408	31	3	2025-12-05 21:00:00	80.00	Moderate	2025-12-06 04:15:08.228453
31409	17	1	2025-12-06 03:50:00	57.20	\N	2025-12-06 04:15:08.523011
31410	17	3	2025-12-05 21:00:00	80.00	Moderate	2025-12-06 04:15:08.854502
31225	26	1	2025-12-06 02:47:00	60.80	\N	2025-12-06 04:15:09.545943
31412	26	3	2025-12-05 21:00:00	80.00	Moderate	2025-12-06 04:15:09.996657
31413	34	1	2025-12-06 04:00:00	53.60	\N	2025-12-06 04:15:10.460972
31340	20	1	2025-12-06 03:35:00	55.40	\N	2025-12-06 03:57:40.692545
31414	34	3	2025-12-05 21:00:00	80.00	Moderate	2025-12-06 04:15:10.856502
31221	21	1	2025-12-06 02:47:00	51.80	\N	2025-12-06 04:15:11.308307
31343	18	1	2025-12-06 03:35:00	55.40	\N	2025-12-06 03:57:45.335747
31416	21	3	2025-12-05 21:00:00	33.00	Good	2025-12-06 04:15:11.635595
31417	22	1	2025-12-06 03:50:00	48.20	\N	2025-12-06 04:15:13.04681
31418	22	3	2025-12-05 21:00:00	33.00	Good	2025-12-06 04:15:13.616486
31419	20	1	2025-12-06 03:50:00	57.20	\N	2025-12-06 04:15:15.764053
31420	20	3	2025-12-05 21:00:00	33.00	Good	2025-12-06 04:15:16.069054
31421	27	3	2025-12-05 21:00:00	31.00	Good	2025-12-06 04:15:17.640481
31382	18	1	2025-12-06 03:40:00	55.40	\N	2025-12-06 04:00:09.402308
31264	27	3	2025-12-05 20:00:00	29.00	Good	2025-12-06 04:00:09.853462
31266	20	3	2025-12-05 20:00:00	34.00	Good	2025-12-06 04:00:10.108454
31261	19	3	2025-12-05 20:00:00	30.00	Good	2025-12-06 04:00:10.248394
31263	18	3	2025-12-05 20:00:00	70.00	Moderate	2025-12-06 04:00:10.360287
31268	32	3	2025-12-05 20:00:00	70.00	Moderate	2025-12-06 04:00:11.678338
31270	33	3	2025-12-05 20:00:00	29.00	Good	2025-12-06 04:00:11.909542
31422	18	1	2025-12-06 03:50:00	57.20	\N	2025-12-06 04:15:18.617007
31423	18	3	2025-12-05 21:00:00	80.00	Moderate	2025-12-06 04:15:18.977014
31424	19	1	2025-12-06 04:00:00	53.60	\N	2025-12-06 04:15:23.490159
31425	19	3	2025-12-05 21:00:00	27.00	Good	2025-12-06 04:15:23.785841
31426	36	1	2025-12-06 03:50:00	48.20	\N	2025-12-06 04:15:25.904482
31267	32	1	2025-12-06 02:47:00	60.80	\N	2025-12-06 04:15:30.16012
31428	32	3	2025-12-05 21:00:00	80.00	Moderate	2025-12-06 04:15:30.427003
\.


--
-- Data for Name: source; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.source (id, name, api_endpoint) FROM stdin;
1	National Weather Service	https://api.weather.gov
2	AirNow	https://www.airnowapi.org
\.


--
-- Data for Name: station; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.station (id, external_id, name, latitude, longitude, source_id, created_at) FROM stdin;
17	85003	Phoenix	33.4484000	-112.0740000	1	2025-12-06 03:24:20.698299
18	85251	Scottsdale (South)	33.4942000	-111.9261000	1	2025-12-06 03:24:20.698299
19	85255	Scottsdale (North)	33.6460000	-111.9255000	1	2025-12-06 03:24:20.698299
20	85281	Tempe	33.4255000	-111.9400000	1	2025-12-06 03:24:20.698299
21	85201	Mesa (West)	33.4152000	-111.8315000	1	2025-12-06 03:24:20.698299
22	85212	Mesa (East)	33.3400000	-111.6400000	1	2025-12-06 03:24:20.698299
23	85225	Chandler	33.3061000	-111.8413000	1	2025-12-06 03:24:20.698299
24	85234	Gilbert	33.3528000	-111.7890000	1	2025-12-06 03:24:20.698299
25	85301	Glendale	33.5387000	-112.1859000	1	2025-12-06 03:24:20.698299
26	85345	Peoria	33.5806000	-112.2374000	1	2025-12-06 03:24:20.698299
27	85374	Surprise	33.6292000	-112.3679000	1	2025-12-06 03:24:20.698299
28	85323	Avondale	33.4353000	-112.3577000	1	2025-12-06 03:24:20.698299
29	85338	Goodyear	33.4353000	-112.3582000	1	2025-12-06 03:24:20.698299
30	85326	Buckeye	33.3703000	-112.5838000	1	2025-12-06 03:24:20.698299
31	85340	Litchfield Park	33.4933000	-112.3577000	1	2025-12-06 03:24:20.698299
32	85353	Tolleson	33.4497000	-112.2619000	1	2025-12-06 03:24:20.698299
33	85363	Youngtown	33.5976000	-112.2982000	1	2025-12-06 03:24:20.698299
34	85253	Paradise Valley	33.5311000	-111.9426000	1	2025-12-06 03:24:20.698299
35	85268	Fountain Hills	33.6017000	-111.7176000	1	2025-12-06 03:24:20.698299
36	85142	Queen Creek	33.2487000	-111.6343000	1	2025-12-06 03:24:20.698299
37	85331	Cave Creek	33.8334000	-111.9507000	1	2025-12-06 03:24:20.698299
38	85377	Carefree	33.8223000	-111.9182000	1	2025-12-06 03:24:20.698299
\.


--
-- Data for Name: variable; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.variable (id, code, unit) FROM stdin;
1	TEMP	°F
2	HEAT_INDEX	°F
3	AQI	US AQI
\.


--
-- Name: reading_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.reading_id_seq', 31430, true);


--
-- Name: source_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.source_id_seq', 6, true);


--
-- Name: station_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.station_id_seq', 38, true);


--
-- Name: variable_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.variable_id_seq', 9, true);


--
-- Name: reading reading_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reading
    ADD CONSTRAINT reading_pkey PRIMARY KEY (id);


--
-- Name: reading reading_station_id_variable_id_observed_at_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reading
    ADD CONSTRAINT reading_station_id_variable_id_observed_at_key UNIQUE (station_id, variable_id, observed_at);


--
-- Name: source source_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.source
    ADD CONSTRAINT source_name_key UNIQUE (name);


--
-- Name: source source_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.source
    ADD CONSTRAINT source_pkey PRIMARY KEY (id);


--
-- Name: station station_external_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.station
    ADD CONSTRAINT station_external_id_key UNIQUE (external_id);


--
-- Name: station station_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.station
    ADD CONSTRAINT station_pkey PRIMARY KEY (id);


--
-- Name: variable variable_code_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.variable
    ADD CONSTRAINT variable_code_key UNIQUE (code);


--
-- Name: variable variable_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.variable
    ADD CONSTRAINT variable_pkey PRIMARY KEY (id);


--
-- Name: idx_reading_latest; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_reading_latest ON public.reading USING btree (station_id, variable_id, observed_at DESC);


--
-- Name: idx_reading_observed_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_reading_observed_at ON public.reading USING btree (observed_at DESC);


--
-- Name: idx_reading_station_variable; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_reading_station_variable ON public.reading USING btree (station_id, variable_id);


--
-- Name: idx_station_location; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_station_location ON public.station USING btree (latitude, longitude);


--
-- Name: reading reading_station_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reading
    ADD CONSTRAINT reading_station_id_fkey FOREIGN KEY (station_id) REFERENCES public.station(id) ON DELETE CASCADE;


--
-- Name: reading reading_variable_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reading
    ADD CONSTRAINT reading_variable_id_fkey FOREIGN KEY (variable_id) REFERENCES public.variable(id) ON DELETE CASCADE;


--
-- Name: station station_source_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.station
    ADD CONSTRAINT station_source_id_fkey FOREIGN KEY (source_id) REFERENCES public.source(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

\unrestrict TOngkoh4WPGwzhdQZLNFeBJDKj7hWEOoho1Fq5yL4l1N7NwEIo4ZqLZWHMId6tU

