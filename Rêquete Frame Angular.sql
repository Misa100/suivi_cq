-- Table: menu

-- DROP TABLE menu;

CREATE TABLE menu
(
  id_menu serial NOT NULL,
  nom_menu character varying(100),
  route_menu character varying(100),
  rang_menu character varying(20),
  icon_menu character varying(100),
  sous_menu text DEFAULT ''::text,
  accessibilite integer,
  CONSTRAINT primary_key_table_menu PRIMARY KEY (id_menu)
)
WITH (
  OIDS=FALSE
);
ALTER TABLE menu
  OWNER TO postgres;


INSERT INTO public.menu(nom_menu, route_menu, rang_menu, icon_menu, sous_menu, accessibilite)VALUES ('Accueil', 'accueil', '1', 'bi bi-house-fill', '[]', 1);
INSERT INTO public.menu(nom_menu, route_menu, rang_menu, icon_menu, sous_menu, accessibilite)VALUES ('Paramètres', '', '2', 'bi bi-gear-wide-connected', '[{"icon_sous_menu":"bi bi-person-fill","nom_sous_menu":"Gestion des Utilisateurs","route_sous_menu":"users","accessibilite_sous_menu":"2"},{"icon_sous_menu":"bi bi-list","nom_sous_menu":"Gestion des Menus","route_sous_menu":"gestion-menu","accessibilite_sous_menu":"3"}]', 2);


-- Table: utilisateur

-- DROP TABLE utilisateur;

CREATE TABLE utilisateur
(
  id_utilisateur serial NOT NULL,
  nom_user character varying(100),
  prenom_user character varying(100),
  matricule character varying(20),
  password_user character varying(20),
  role_user character varying(60),
  CONSTRAINT primary_key_table_utilisateur PRIMARY KEY (id_utilisateur)
)
WITH (
  OIDS=FALSE
);
ALTER TABLE utilisateur
  OWNER TO postgres;


INSERT INTO public.utilisateur(nom_user, prenom_user, matricule, password_user, role_user)VALUES ('ANDRIANANTOANDRO', 'Barilalaina Joelisoa', '00005', 'L@laina11', 'Administrateur');
INSERT INTO public.utilisateur(nom_user, prenom_user, matricule, password_user, role_user)VALUES ('RAZAFINDRAMANANA', 'Tovonirina Nandrianina', '13115', 'LexxLexx2018', 'Administrateur');
INSERT INTO public.utilisateur(nom_user, prenom_user, matricule, password_user, role_user)VALUES ('RAKOTONINDRIANA', 'Tsiory Herilanto Luc', '33347', '33347thl', 'Administrateur');
INSERT INTO public.utilisateur(nom_user, prenom_user, matricule, password_user, role_user)VALUES ('RASOLOHERY', 'Ny Vahatrin Ny Aina', '33346', 'anon1649', 'Administrateur');
INSERT INTO public.utilisateur(nom_user, prenom_user, matricule, password_user, role_user)VALUES ('Développeur', 'App', 'T9000', 'admin', 'Administrateur');


-- Table: titre

-- DROP TABLE titre;

CREATE TABLE titre
(
  "titreLogin" character varying NOT NULL,
  "titreMenuMax" character varying NOT NULL,
  "titreMenuMin" character varying NOT NULL
)
WITH (
  OIDS=FALSE
);
ALTER TABLE titre
  OWNER TO postgres;
ALTER TABLE titre ALTER COLUMN "titreLogin" SET STATISTICS 0;
ALTER TABLE titre ALTER COLUMN "titreMenuMax" SET STATISTICS 0;
ALTER TABLE titre ALTER COLUMN "titreMenuMin" SET STATISTICS 0;

INSERT INTO public.titre("titreLogin", "titreMenuMax", "titreMenuMin")VALUES ('Application', 'Dashboard', 'TDB');
