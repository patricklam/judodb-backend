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
  `password` varchar(255) NOT NULL, -- deprecated by plus_identity
  `plus_identity` varchar(255),
  `last_update` date,
  PRIMARY KEY  (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

DROP TABLE IF EXISTS `client`;
CREATE TABLE `client` (
  `id` int(11) NOT NULL auto_increment,
  `nom` varchar(50) NOT NULL,
  `prenom` varchar(50) NOT NULL,
  `ddn` date,
  `courriel` varchar(255),
  `adresse` varchar(255),
  `ville` varchar(50),
  `code_postal` varchar(8),
  `tel` varchar(20),
  `affiliation` varchar(20),
  `carte_anjou` varchar(20),
  `nom_recu_impot` varchar(255),
  `nom_contact_urgence` varchar(255),
  `tel_contact_urgence` varchar(255),
  `RAMQ` varchar(20),
  `sexe` char(1),
  `version` int(5) NOT NULL,
  PRIMARY KEY  (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

DROP TABLE IF EXISTS `club`;
CREATE TABLE `club` (
  `id` int(11) NOT NULL auto_increment,
  `nom` varchar(255) NOT NULL,
  `numero_club` varchar(11),
  PRIMARY KEY  (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

DROP TABLE IF EXISTS `client_club`;
CREATE TABLE `client_club` (
  `id` int(11) NOT NULL auto_increment,
  `client_id` int(11) NOT NULL,
  `club_id` int(11) NOT NULL,
  PRIMARY KEY  (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

DROP TABLE IF EXISTS `user_club`;
CREATE TABLE `user_club` (
  `id` int(11) NOT NULL auto_increment,
  `user_id` int(11) NOT NULL,
  `club_id` int(11) NOT NULL,
  PRIMARY KEY  (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

DROP TABLE IF EXISTS `grades`;
CREATE TABLE `grades` (
  `client_id` INTEGER,
  `id` INTEGER PRIMARY KEY auto_increment, 
  `grade` varchar(10),
  `date_grade` date
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

DROP TABLE IF EXISTS `services`;
CREATE TABLE `services` (
  `client_id` INTEGER,
  `id` INTEGER PRIMARY KEY auto_increment, 
  `date_inscription` date,
  `saisons` char(10),
  `sans_affiliation` boolean,
  `affiliation_initiation` boolean,
  `cours` char(3),
  `sessions` char(1),
  `passeport` boolean,
  `non_anjou` boolean,
  `judogi` char(3),
  `escompte` char(3),
  `categorie_frais` char(10),
  `affiliation_frais` char(10),
  `supp_frais` char(10),
  `frais` char(10),
  `cas_special_note` varchar(50),
  `escompte_special` varchar(10),
  `horaire_special` varchar(50),
  `verification` BOOLEAN,
  `solde` BOOLEAN,
  `club_id` int(11)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

DROP TABLE IF EXISTS `payment_groups`;
CREATE TABLE `payment_groups` (
  `id` INTEGER PRIMARY KEY auto_increment,
  `version` int(5) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

DROP TABLE IF EXISTS `payment_group_members`;
CREATE TABLE `payment_group_members` (
  `group_id` INTEGER,
  `client_id` INTEGER
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

DROP TABLE IF EXISTS `payment`;
CREATE TABLE `payment` (
  `id` INTEGER PRIMARY KEY auto_increment,
  `group_id` INTEGER,
  `client_id` INTEGER,
  `mode` INTEGER,
  `chqno` INTEGER,
  `date` DATE,
  `montant` char(10)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

/* Configuration data follows. */

DROP TABLE IF EXISTS `global_configuration`;
CREATE TABLE `global_configuration` (
  `version` INTEGER,
  `nom_club` char(30),
  `numero_club` char(30),
  `age_masters` char(10),
  `frais_passeport_judoqc` char(10),
  `frais_nonresident_anjou` char(10),
  `date_versement_1` DATE,
  `date_versement_2` DATE,
  `date_versement_3` DATE,
  `date_versement_4` DATE,
  `date_versement_5` DATE,
  `date_versement_6` DATE
) ENGINE=MyISAM DEFAULT CHARSET=latin1;
INSERT INTO `global_configuration` VALUES (0, '', '', '', '', '', '0000-00-00', '0000-00-00', '0000-00-00', '0000-00-00', '0000-00-00', '0000-00-00');

DROP TABLE IF EXISTS `session`;
CREATE TABLE `session` (
  `seqno` INTEGER PRIMARY KEY, /* A09 = 0, advance from there; use as real primary key. */
  `name` char(15),
  `year` char(4), /* for category calculations, so that H10 is 2009. */
  `abbrev` char(4),
  `first_class_date` DATE,
  `first_signup_date` DATE,
  `last_class_date` DATE,
  `last_signup_date` DATE
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

DROP TABLE IF EXISTS `cours`;
CREATE TABLE `cours` (
  `seqno` INTEGER PRIMARY KEY,
  `name` varchar(60),
  `short_desc` varchar(20),
  `entraineur` varchar(30)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

DROP TABLE IF EXISTS `cours_session`;
CREATE TABLE `cours_session` (
  `cours_seqno` INTEGER,
  `session_seqno` INTEGER
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

DROP TABLE IF EXISTS `categorie`;
CREATE TABLE `categorie` (
  `name` varchar(25),
  `abbrev` char(6),
  `years_ago` INTEGER,
  `noire` boolean
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

DROP TABLE IF EXISTS `categorie_session`;
CREATE TABLE `categorie_session` (
  `session_seqno` INTEGER,
  `categorie_abbrev` char(6),
  `frais_1_session` char(10),
  `frais_2_session` char(10), /* for session_seqno and session_seqno+1 */
  `frais_judo_qc` char(10)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

DROP TABLE IF EXISTS `escompte`;
CREATE TABLE `escompte` (
  `seqno` INTEGER,
  `name` varchar(25),
  `amount` char(6) /* in percent */
) ENGINE=MyISAM DEFAULT CHARSET=latin1;
