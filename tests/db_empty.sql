-- MySQL dump 10.13  Distrib 5.5.46, for debian-linux-gnu (i686)
--
-- Host: localhost    Database: judodb
-- ------------------------------------------------------
-- Server version	5.5.46-0ubuntu0.14.04.2

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `client`
--

DROP TABLE IF EXISTS `client`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `client` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nom` varchar(50) NOT NULL,
  `prenom` varchar(50) NOT NULL,
  `ddn` date DEFAULT NULL,
  `courriel` varchar(255) DEFAULT NULL,
  `adresse` varchar(255) DEFAULT NULL,
  `ville` varchar(50) DEFAULT NULL,
  `code_postal` varchar(8) DEFAULT NULL,
  `tel` varchar(80) DEFAULT NULL,
  `affiliation` varchar(20) DEFAULT NULL,
  `carte_resident` varchar(20) DEFAULT NULL,
  `nom_recu_impot` varchar(255) DEFAULT NULL,
  `nom_contact_urgence` varchar(255) DEFAULT NULL,
  `tel_contact_urgence` varchar(255) DEFAULT NULL,
  `RAMQ` varchar(20) DEFAULT NULL,
  `sexe` char(1) DEFAULT NULL,
  `notes` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `club`
--

DROP TABLE IF EXISTS `club`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `club` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nom` varchar(255) DEFAULT NULL,
  `nom_short` varchar(15) DEFAULT NULL,
  `numero_club` char(30) DEFAULT NULL,
  `ville` char(50) DEFAULT NULL,
  `prefix_codepostale` char(7) DEFAULT NULL,
  `indicatif_regional` char(4) DEFAULT NULL,
  `pro_rata` tinyint(1) DEFAULT NULL,
  `debut_session` date DEFAULT NULL,
  `fin_session` date DEFAULT NULL,
  `ajustable_cours` tinyint(1) DEFAULT NULL,
  `ajustable_division` tinyint(1) DEFAULT NULL,
  `tresorier` char(30) DEFAULT NULL,
  `coords` char(120) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `club`
--

LOCK TABLES `club` WRITE;
/*!40000 ALTER TABLE `club` DISABLE KEYS */;
INSERT INTO `club` VALUES (1,'Club Judo Bidon','Bidon','C000','Bidonville','G0A','111-',0,NULL,NULL,0,NULL,NULL,NULL);
/*!40000 ALTER TABLE `club` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `club_cours`
--

DROP TABLE IF EXISTS `club_cours`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `club_cours` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `club_id` int(11) DEFAULT NULL,
  `session_seqno` char(30) DEFAULT NULL,
  `short_desc` char(30) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=32 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `division`
--

DROP TABLE IF EXISTS `division`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `division` (
  `name` varchar(25) DEFAULT NULL,
  `abbrev` char(6) DEFAULT NULL,
  `years_ago` int(11) DEFAULT NULL,
  `noire` tinyint(1) DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `division`
--

LOCK TABLES `division` WRITE;
/*!40000 ALTER TABLE `division` DISABLE KEYS */;
INSERT INTO `division` VALUES ('Mini-Poussin','U8',8,0),('Poussin','U10',10,0),('Benjamin','U12',12,0),('Minime','U14',14,0),('Juvénile','U16',16,0),('Cadet','U18',18,0),('Junior','U21',21,0),('Senior','S',0,0),('Cadet Noire','U18N',18,1),('Junior Noire','U21N',21,1),('Senior Noire','SN',0,1);
/*!40000 ALTER TABLE `division` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `escompte`
--

DROP TABLE IF EXISTS `escompte`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `escompte` (
  `id` int(11) DEFAULT NULL,
  `club_id` int(11) DEFAULT NULL,
  `nom` varchar(25) DEFAULT NULL,
  `amount_percent` char(6) DEFAULT NULL,
  `amount_absolute` char(6) DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `grades`
--

DROP TABLE IF EXISTS `grades`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `grades` (
  `client_id` int(11) DEFAULT NULL,
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `grade` varchar(10) DEFAULT NULL,
  `date_grade` date DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=60 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `payment`
--

DROP TABLE IF EXISTS `payment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `payment` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `group_id` int(11) DEFAULT NULL,
  `client_id` int(11) DEFAULT NULL,
  `mode` int(11) DEFAULT NULL,
  `chqno` int(11) DEFAULT NULL,
  `date` date DEFAULT NULL,
  `montant` char(10) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `payment`
--

LOCK TABLES `payment` WRITE;
/*!40000 ALTER TABLE `payment` DISABLE KEYS */;
/*!40000 ALTER TABLE `payment` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `payment_group_members`
--

DROP TABLE IF EXISTS `payment_group_members`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `payment_group_members` (
  `group_id` int(11) DEFAULT NULL,
  `client_id` int(11) DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `payment_group_members`
--

LOCK TABLES `payment_group_members` WRITE;
/*!40000 ALTER TABLE `payment_group_members` DISABLE KEYS */;
/*!40000 ALTER TABLE `payment_group_members` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `payment_groups`
--

DROP TABLE IF EXISTS `payment_groups`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `payment_groups` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `version` int(5) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `payment_groups`
--

LOCK TABLES `payment_groups` WRITE;
/*!40000 ALTER TABLE `payment_groups` DISABLE KEYS */;
/*!40000 ALTER TABLE `payment_groups` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `prix`
--

DROP TABLE IF EXISTS `prix`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `prix` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `club_id` int(11) DEFAULT NULL,
  `session_seqno` char(10) DEFAULT NULL,
  `division_abbrev` char(6) DEFAULT NULL,
  `cours_id` int(11) DEFAULT NULL,
  `frais` char(6) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=63 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `prix`
--

LOCK TABLES `prix` WRITE;
/*!40000 ALTER TABLE `prix` DISABLE KEYS */;
INSERT INTO `prix` VALUES (1,NULL,'14 15','U6',-1,'35'),(2,NULL,'14 15','U8',-1,'35'),(3,NULL,'14 15','U10',-1,'35'),(4,NULL,'14 15','U12',-1,'65'),(5,NULL,'14 15','U14',-1,'65'),(6,NULL,'14 15','U16',-1,'65'),(7,NULL,'14 15','U18',-1,'90'),(8,NULL,'14 15','U21',-1,'90'),(9,NULL,'14 15','S',-1,'90'),(10,NULL,'14 15','U18N',-1,'100'),(11,NULL,'14 15','U21N',-1,'100'),(12,NULL,'14 15','SN',-1,'100'),(13,NULL,'14 15','O65',-1,'26'),(14,NULL,'14 15','O65N',-1,'36');
/*!40000 ALTER TABLE `prix` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `produit`
--

DROP TABLE IF EXISTS `produit`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `produit` (
  `id` int(11) DEFAULT NULL,
  `club_id` int(11) DEFAULT NULL,
  `nom` varchar(25) DEFAULT NULL,
  `montant` char(6) DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `produit`
--

LOCK TABLES `produit` WRITE;
/*!40000 ALTER TABLE `produit` DISABLE KEYS */;
INSERT INTO `produit` VALUES (2,0,'Passeport Judo Canada','40'),(1,0,'Passeport Judo Québec','5');
/*!40000 ALTER TABLE `produit` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `services`
--

DROP TABLE IF EXISTS `services`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `services` (
  `client_id` int(11) DEFAULT NULL,
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `date_inscription` date DEFAULT NULL,
  `saisons` char(10) DEFAULT NULL,
  `date_affiliation_envoye` date DEFAULT NULL,
  `carte_judoca_recu` tinyint(1) DEFAULT NULL,
  `sans_affiliation` tinyint(1) DEFAULT NULL,
  `affiliation_initiation` tinyint(1) DEFAULT NULL,
  `affiliation_ecole` tinyint(1) DEFAULT NULL,
  `affiliation_parascolaire` tinyint(1) DEFAULT NULL,
  `cours` char(5) DEFAULT NULL,
  `sessions` char(1) DEFAULT NULL,
  `passeport` tinyint(1) DEFAULT NULL,
  `resident` tinyint(1) DEFAULT NULL,
  `paypal` tinyint(1) DEFAULT NULL,
  `judogi` char(3) DEFAULT NULL,
  `escompte` char(3) DEFAULT NULL,
  `categorie_frais` char(10) DEFAULT NULL,
  `affiliation_frais` char(10) DEFAULT NULL,
  `supp_frais` char(10) DEFAULT NULL,
  `frais` char(10) DEFAULT NULL,
  `cas_special_note` varchar(50) DEFAULT NULL,
  `escompte_special` varchar(10) DEFAULT NULL,
  `horaire_special` varchar(50) DEFAULT NULL,
  `verification` tinyint(1) DEFAULT NULL,
  `solde` tinyint(1) DEFAULT NULL,
  `club_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=58 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `session`
--

DROP TABLE IF EXISTS `session`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `session` (
  `seqno` int(11) NOT NULL,
  `linked_seqno` int(11) DEFAULT NULL,
  `name` char(15) DEFAULT NULL,
  `year` char(4) DEFAULT NULL,
  `abbrev` char(4) DEFAULT NULL,
  PRIMARY KEY (`seqno`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `session`
--

LOCK TABLES `session` WRITE;
/*!40000 ALTER TABLE `session` DISABLE KEYS */;
INSERT INTO `session` VALUES (14,15,'Automne 2016','2017','A16'),(15,14,'Hiver 2017','2017','H17');
/*!40000 ALTER TABLE `session` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `session_club`
--

DROP TABLE IF EXISTS `session_club`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `session_club` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `seqno` int(11) DEFAULT NULL,
  `club` int(11) DEFAULT NULL,
  `first_class_date` date DEFAULT NULL,
  `first_signup_date` date DEFAULT NULL,
  `last_class_date` date DEFAULT NULL,
  `last_signup_date` date DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=13 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `user` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `plus_identity` varchar(255) DEFAULT NULL,
  `last_update` date DEFAULT NULL,
  `is_admin` tinyint(1) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=MyISAM AUTO_INCREMENT=8 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (1,'root','root@localhost',NULL,NULL,1);
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_club`
--

DROP TABLE IF EXISTS `user_club`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `user_club` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `club_id` int(11) NOT NULL,
  `can_write` tinyint(1) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=6 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_club`
--

LOCK TABLES `user_club` WRITE;
/*!40000 ALTER TABLE `user_club` DISABLE KEYS */;
INSERT INTO `user_club` VALUES (1,1,1,1);
/*!40000 ALTER TABLE `user_club` ENABLE KEYS */;

UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2016-08-03 17:43:46
