/*
Copyright 2009, Patrick Lam.

Redistribution and use in source and binary forms, with or without 
modification, are permitted provided that the following conditions are met:

 1. Redistributions of source code must retain the above copyright notice, 
    this list of conditions and the following disclaimer.
 2. Redistributions in binary form must reproduce the above copyright notice,
    this list of conditions and the following disclaimer in the documentation
    and/or other materials provided with the distribution.
 3. Neither the name of Google Inc. nor the names of its contributors may be
    used to endorse or promote products derived from this software without
    specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE AUTHOR ``AS IS'' AND ANY EXPRESS OR IMPLIED
WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF 
MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO
EVENT SHALL THE AUTHOR BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, 
SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO,
PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS;
OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY,
WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR 
OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF 
ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/

/**
 * Schema for JudoDB. After creating a blank database called 'judoanjou',
 * run with something like:
 *
 * mysql -u anjoudb -p judoanjou < db.sql
 */

DROP TABLE IF EXISTS `user`;
CREATE TABLE `user` (
  `id` int(11) NOT NULL auto_increment,
  `username` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `plus_identity` varchar(255),
  `last_update` date,
  `is_admin` boolean,
  PRIMARY KEY  (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

/** A user has access to a club if a user_club entry exists for 
 *  that user/club combination. */
DROP TABLE IF EXISTS `user_club`;
CREATE TABLE `user_club` (
  `id` int(11) NOT NULL auto_increment,
  `user_id` int(11) NOT NULL,
  `club_id` int(11) NOT NULL,
  `can_write` tinyint(1),
  PRIMARY KEY  (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `client`;
CREATE TABLE `client` (
  `id` int(11) NOT NULL auto_increment,
  `nom` varchar(50) NOT NULL,
  `prenom` varchar(50) NOT NULL,
  `ddn` date,
  `courriel` varchar(255),
  `adresse` varchar(255),
  `ville` varchar(50),
  `personne_contact` varchar(50),
  `personne_contact_courriel` varchar(50),
  `personne_contact_tel` varchar(50),
  `personne_contact_adresse` varchar(50),
  `code_postal` varchar(8),
  `tel` varchar(80),
  `affiliation` varchar(20),
  `carte_resident` varchar(20),
  `nom_recu_impot` varchar(255),
  `nom_contact_urgence` varchar(255),
  `tel_contact_urgence` varchar(255),
  `RAMQ` varchar(20),
  `sexe` char(1),
  `notes` varchar(255),
  PRIMARY KEY  (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `grades`;
CREATE TABLE `grades` (
  `client_id` INTEGER,
  `id` INTEGER PRIMARY KEY auto_increment, 
  `grade` varchar(10),
  `date_grade` date
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `services`;
CREATE TABLE `services` (
  `client_id` INTEGER,
  `id` INTEGER PRIMARY KEY auto_increment, 
  `date_inscription` date,
  `saisons` char(10),
  `date_affiliation_envoye` date,
  `carte_judoca_recu` boolean,
  `sans_affiliation` boolean,
  `affiliation_initiation` boolean,
  `affiliation_ecole` boolean,
  `affiliation_parascolaire` boolean,
  `cours` char(6),
  `no_sessions` char(1),
  `passeport` boolean,
  `resident` boolean,
  `paypal` boolean,
  `judogi` char(20),
  `escompte` char(3),
  `categorie_frais` char(10),
  `affiliation_frais` char(10),
  `supp_frais` char(10),
  `frais` char(10),
  `cas_special_note` varchar(50),
  `escompte_special` varchar(10),
  `horaire_special` varchar(50),
  `affiliation_envoye` BOOLEAN,
  `solde` BOOLEAN,
  `club_id` int(11)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

/** Payments not currently implemented. */
DROP TABLE IF EXISTS `payment_groups`;
CREATE TABLE `payment_groups` (
  `id` INTEGER PRIMARY KEY auto_increment,
  `version` int(5) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `payment_group_members`;
CREATE TABLE `payment_group_members` (
  `group_id` INTEGER,
  `client_id` INTEGER
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `payment`;
CREATE TABLE `payment` (
  `id` INTEGER PRIMARY KEY auto_increment,
  `group_id` INTEGER,
  `client_id` INTEGER,
  `mode` INTEGER,
  `chqno` INTEGER,
  `date` DATE,
  `montant` char(10)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

/** Config information. */
DROP TABLE IF EXISTS `session`;
CREATE TABLE `session` (
  `seqno` INTEGER PRIMARY KEY, /* A09 = 0, advance from there; use as real primary key. */
  `linked_seqno` INTEGER, /* e.g. A09 is linked with H10 */
  `name` char(15),
  `year` char(4), /* for category calculations, so that H10 is 2009. */
  `abbrev` char(4)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `session_club`;
CREATE TABLE `session_club` (
  `id` INTEGER PRIMARY KEY auto_increment,
  `seqno` INTEGER,
  `club` INTEGER,
  `first_class_date` DATE,
  `first_signup_date` DATE,
  `last_class_date` DATE,
  `last_signup_date` DATE
) ENGINE=MyISAM DEFAULT CHARSET=utf8;


/** Club information. */
DROP TABLE IF EXISTS `club`;
CREATE TABLE `club` (
  `id` INTEGER PRIMARY KEY auto_increment,
  `nom` varchar(255),
  `nom_short` varchar(15),
  `numero_club` char(30),
  `ville` char(50),
  `prefix_codepostale` char(7),
  `escompte_resident` char(7),
  `indicatif_regional` char(4),
  `afficher_paypal` char(1),
  `supplement_prorata` char(3),
  `pro_rata` tinyint(1),
  `ajustable_cours` tinyint(1),
  `ajustable_division` tinyint(1),
  `tresorier` char(30),
  `coords` char(30)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `club_cours`;
CREATE TABLE `club_cours` (
  `id` INTEGER PRIMARY KEY auto_increment,
  `club_id` INTEGER,
  `session_seqno` char(30),
  `short_desc` char(30)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `escompte`;
CREATE TABLE `escompte` (
  `id` INTEGER PRIMARY KEY auto_increment,
  `club_id` INTEGER,
  `nom` varchar(25),
  `amount_percent` char(6),
  `amount_absolute` char(6)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `produit`;
CREATE TABLE `produit` (
  `id` INTEGER DEFAULT NULL,
  `club_id` INTEGER DEFAULT NULL,
  `nom` varchar(25),
  `montant` char(6)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `prix`;
CREATE TABLE `prix` (
  `id` INTEGER PRIMARY KEY auto_increment,
  `club_id` INTEGER,
  `session_seqno` char(10),
  `division_abbrev` char(6),
  `cours_id` INTEGER,
  `frais` char(6)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;


/* populate divisions with the defaults as of 2014 */
DROP TABLE IF EXISTS `division`;
CREATE TABLE `division` (
  `name` varchar(25),
  `abbrev` char(6),
  `years_ago` INTEGER,
  `noire` boolean
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

INSERT INTO `division` (`name`, `abbrev`, `years_ago`, `noire`) VALUES ("Mini-Poussin", "U8", 8, false), ("Poussin", "U10", 10, false), ("Benjamin", "U12", 12, false), ("Minime", "U14", 14, false), ("Juvénile", "U16", 16, false), ("Cadet", "U18", 18, false), ("Junior", "U21", 21, false), ("Senior", "S", 0, false), ("Cadet Noire", "U18N", 18, true), ("Junior Noire", "U21N", 21, true), ("Senior Noire", "SN", 0, true);
/* but divisions are currently hardcoded into the client code */
