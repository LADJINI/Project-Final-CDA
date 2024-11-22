/*==============================================================*/
/* Nom de SGBD :  Sybase SQL Anywhere 11                        */
/* Date de création :  21/11/2024 22:59:15                      */
/*==============================================================*/


if exists(select 1 from sys.sysforeignkey where role='FK_EVALUATI_POSSEDER_LIVRES') then
    alter table EVALUATIONS
       delete foreign key FK_EVALUATI_POSSEDER_LIVRES
end if;

if exists(select 1 from sys.sysforeignkey where role='FK_EVALUATI_REDIGER_UTILISAT') then
    alter table EVALUATIONS
       delete foreign key FK_EVALUATI_REDIGER_UTILISAT
end if;

if exists(select 1 from sys.sysforeignkey where role='FK_LIVRES_T_CONCERNER_LIVRES') then
    alter table LIVRES_TRANSACTIONS
       delete foreign key FK_LIVRES_T_CONCERNER_LIVRES
end if;

if exists(select 1 from sys.sysforeignkey where role='FK_LIVRES_T_CONCERNER_TRANSACT') then
    alter table LIVRES_TRANSACTIONS
       delete foreign key FK_LIVRES_T_CONCERNER_TRANSACT
end if;

if exists(select 1 from sys.sysforeignkey where role='FK_QUESTION_AVOIRQUES_UTILISAT') then
    alter table QUESTIONS_SECURITE
       delete foreign key FK_QUESTION_AVOIRQUES_UTILISAT
end if;

if exists(select 1 from sys.sysforeignkey where role='FK_TRANSACT_ABOUTIR_PAIEMENT') then
    alter table TRANSACTIONS
       delete foreign key FK_TRANSACT_ABOUTIR_PAIEMENT
end if;

if exists(select 1 from sys.sysforeignkey where role='FK_TRANSACT_AVOIR_TYPES_TR') then
    alter table TRANSACTIONS
       delete foreign key FK_TRANSACT_AVOIR_TYPES_TR
end if;

if exists(select 1 from sys.sysforeignkey where role='FK_TRANSACT_FAIRE_UTILISAT') then
    alter table TRANSACTIONS
       delete foreign key FK_TRANSACT_FAIRE_UTILISAT
end if;

if exists(select 1 from sys.sysforeignkey where role='FK_UTILISAT_DISPOSER_ROLES') then
    alter table UTILISATEURS
       delete foreign key FK_UTILISAT_DISPOSER_ROLES
end if;

if exists(
   select 1 from sys.systable 
   where table_name='EVALUATIONS'
     and table_type in ('BASE', 'GBL TEMP')
) then
    drop table EVALUATIONS
end if;

if exists(
   select 1 from sys.systable 
   where table_name='LIVRES'
     and table_type in ('BASE', 'GBL TEMP')
) then
    drop table LIVRES
end if;

if exists(
   select 1 from sys.systable 
   where table_name='LIVRES_TRANSACTIONS'
     and table_type in ('BASE', 'GBL TEMP')
) then
    drop table LIVRES_TRANSACTIONS
end if;

if exists(
   select 1 from sys.systable 
   where table_name='PAIEMENTS'
     and table_type in ('BASE', 'GBL TEMP')
) then
    drop table PAIEMENTS
end if;

if exists(
   select 1 from sys.systable 
   where table_name='QUESTIONS_SECURITE'
     and table_type in ('BASE', 'GBL TEMP')
) then
    drop table QUESTIONS_SECURITE
end if;

if exists(
   select 1 from sys.systable 
   where table_name='ROLES'
     and table_type in ('BASE', 'GBL TEMP')
) then
    drop table ROLES
end if;

if exists(
   select 1 from sys.systable 
   where table_name='TRANSACTIONS'
     and table_type in ('BASE', 'GBL TEMP')
) then
    drop table TRANSACTIONS
end if;

if exists(
   select 1 from sys.systable 
   where table_name='TYPES_TRANSACTION'
     and table_type in ('BASE', 'GBL TEMP')
) then
    drop table TYPES_TRANSACTION
end if;

if exists(
   select 1 from sys.systable 
   where table_name='UTILISATEURS'
     and table_type in ('BASE', 'GBL TEMP')
) then
    drop table UTILISATEURS
end if;

/*==============================================================*/
/* Table : EVALUATIONS                                          */
/*==============================================================*/
create table EVALUATIONS 
(
   ID_EVALUATION        integer                        not null,
   ID_LIVRE             integer                        not null,
   ID_UTILISATEUR       integer                        not null,
   NOTE                 integer                        not null,
   COMMENTAIRE          char(250)                      null,
   DATE_EVALUATION      timestamp                      null,
   constraint PK_EVALUATIONS primary key (ID_EVALUATION)
);

/*==============================================================*/
/* Table : LIVRES                                               */
/*==============================================================*/
create table LIVRES 
(
   ID_LIVRE             integer                        not null,
   TITRE                char(100)                      not null,
   AUTEUR               char(100)                      not null,
   ISBN                 integer                        null,
   EDITEUR              char(100)                      null,
   DATE_PUBLICATION     date                           null,
   NOMBRE_PAGE          integer                        null,
   ETAT_LIVRE           char(50)                       not null,
   DISPONIBILITE        smallint                       not null,
   DESCRIPTION          char(1000)                     not null,
   QUANTITE_DISPONIBLE  integer                        not null,
   PRIX_                decimal                        not null,
   "PUBLICATION"        smallint                       not null,
   IMAGE_ID             char(150)                      not null,
   constraint PK_LIVRES primary key (ID_LIVRE)
);

/*==============================================================*/
/* Table : LIVRES_TRANSACTIONS                                  */
/*==============================================================*/
create table LIVRES_TRANSACTIONS 
(
   ID_TRANSACTION       integer                        not null,
   ID_LIVRE             integer                        not null,
   constraint PK_LIVRES_TRANSACTIONS primary key (ID_TRANSACTION, ID_LIVRE)
);

/*==============================================================*/
/* Table : PAIEMENTS                                            */
/*==============================================================*/
create table PAIEMENTS 
(
   ID_PAIEMENT          integer                        not null,
   DATE_PAIEMENT        timestamp                      not null,
   MONTANT_PAYE         decimal                        not null,
   MODE_PAIEMENT        char(50)                       not null,
   constraint PK_PAIEMENTS primary key (ID_PAIEMENT)
);

/*==============================================================*/
/* Table : QUESTIONS_SECURITE                                   */
/*==============================================================*/
create table QUESTIONS_SECURITE 
(
   ID_QUESTION          integer                        not null,
   ID_UTILISATEUR       integer                        not null,
   QUESTION             char(250)                      not null,
   REPONSE              char(50)                       not null,
   constraint PK_QUESTIONS_SECURITE primary key (ID_QUESTION)
);

/*==============================================================*/
/* Table : ROLES                                                */
/*==============================================================*/
create table ROLES 
(
   ID_ROLE              integer                        not null,
   NAME                 char(10)                       null,
   constraint PK_ROLES primary key (ID_ROLE)
);

/*==============================================================*/
/* Table : TRANSACTIONS                                         */
/*==============================================================*/
create table TRANSACTIONS 
(
   ID_TRANSACTION       integer                        not null,
   ID_UTILISATEUR       integer                        not null,
   ID_TYPE_TRANSACTION  integer                        not null,
   ID_PAIEMENT          integer                        not null,
   DATE_TRANSACTION     timestamp                      not null,
   PRIX                 decimal                        not null,
   STATUT_TRANSACTION   char(50)                       not null,
   DATE_DEBUT_TRANSACTION timestamp                      null,
   DATE_FIN_TRANSACTION timestamp                      null,
   constraint PK_TRANSACTIONS primary key (ID_TRANSACTION)
);

/*==============================================================*/
/* Table : TYPES_TRANSACTION                                    */
/*==============================================================*/
create table TYPES_TRANSACTION 
(
   ID_TYPE_TRANSACTION  integer                        not null,
   TYPE_TRANSACTION     char(50)                       not null,
   constraint PK_TYPES_TRANSACTION primary key (ID_TYPE_TRANSACTION)
);

/*==============================================================*/
/* Table : UTILISATEURS                                         */
/*==============================================================*/
create table UTILISATEURS 
(
   ID_UTILISATEUR       integer                        not null,
   ID_ROLE              integer                        not null,
   NOM                  char(100)                      not null,
   PRENOM               char(100)                      not null,
   SEXE                 char(10)                       null,
   EMAIL                char(128)                      null,
   MOT_DE_PASSE         char(25)                       null,
   ADRESSE              char(250)                      null,
   TELEPHONE            integer                        null,
   DATE_INSCRIPTION     timestamp                      null,
   DATE_NAISSANCE       date                           null,
   ACTIF                smallint                       not null,
   constraint PK_UTILISATEURS primary key (ID_UTILISATEUR)
);

alter table EVALUATIONS
   add constraint FK_EVALUATI_POSSEDER_LIVRES foreign key (ID_LIVRE)
      references LIVRES (ID_LIVRE)
      on update restrict
      on delete restrict;

alter table EVALUATIONS
   add constraint FK_EVALUATI_REDIGER_UTILISAT foreign key (ID_UTILISATEUR)
      references UTILISATEURS (ID_UTILISATEUR)
      on update restrict
      on delete restrict;

alter table LIVRES_TRANSACTIONS
   add constraint FK_LIVRES_T_CONCERNER_LIVRES foreign key (ID_LIVRE)
      references LIVRES (ID_LIVRE)
      on update restrict
      on delete restrict;

alter table LIVRES_TRANSACTIONS
   add constraint FK_LIVRES_T_CONCERNER_TRANSACT foreign key (ID_TRANSACTION)
      references TRANSACTIONS (ID_TRANSACTION)
      on update restrict
      on delete restrict;

alter table QUESTIONS_SECURITE
   add constraint FK_QUESTION_AVOIRQUES_UTILISAT foreign key (ID_UTILISATEUR)
      references UTILISATEURS (ID_UTILISATEUR)
      on update restrict
      on delete restrict;

alter table TRANSACTIONS
   add constraint FK_TRANSACT_ABOUTIR_PAIEMENT foreign key (ID_PAIEMENT)
      references PAIEMENTS (ID_PAIEMENT)
      on update restrict
      on delete restrict;

alter table TRANSACTIONS
   add constraint FK_TRANSACT_AVOIR_TYPES_TR foreign key (ID_TYPE_TRANSACTION)
      references TYPES_TRANSACTION (ID_TYPE_TRANSACTION)
      on update restrict
      on delete restrict;

alter table TRANSACTIONS
   add constraint FK_TRANSACT_FAIRE_UTILISAT foreign key (ID_UTILISATEUR)
      references UTILISATEURS (ID_UTILISATEUR)
      on update restrict
      on delete restrict;

alter table UTILISATEURS
   add constraint FK_UTILISAT_DISPOSER_ROLES foreign key (ID_ROLE)
      references ROLES (ID_ROLE)
      on update restrict
      on delete restrict;

