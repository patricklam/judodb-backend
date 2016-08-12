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
) ENGINE=MyISAM AUTO_INCREMENT=101 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `client`
--

LOCK TABLES `client` WRITE;
/*!40000 ALTER TABLE `client` DISABLE KEYS */;
INSERT INTO `client` VALUES (1,'Berry','Harding','2008-03-21','Aenean.massa@cursusluctusipsum.edu','770-4872 Curabitur Street','Blind River','H2D 8T8','348-550-4618','7254','1097686','luctus','Irene Kirk','872-893-1296',NULL,'M',NULL),(2,'Benton','Brian','1992-08-24','Mauris@Utsemper.ca','6234 Ante St.','San Polo dEnza','N7J 7M2','451-389-1741','108427','3032866','diam.','Adrienne Swanson','415-230-6742',NULL,'F',NULL),(3,'Neal','Rigel','2002-06-02','est@semegestasblandit.co.uk','520-7899 Convallis Rd.','Camborne','Q1X 0J5','137-698-2887','111259','5901455','ipsum.','Hannah Strickland','336-765-1262',NULL,'F',NULL),(4,'Joyce','Rigel','1950-01-25','Donec.porttitor@mollisDuis.edu','2867 Metus. St.','Retford','P1M 6J8','247-862-5775','123942','2295778','metus.','Emma Mcfadden','827-751-3213',NULL,'M',NULL),(5,'Durham','Keane','2004-12-19','sociis.natoque@inconsequat.com','124-8596 Turpis Street','Feira de Santana','O1U 3H0','640-554-7180','9327','3247063','neque.','Genevieve Petersen','323-508-9977',NULL,'M',NULL),(6,'Aguirre','Bo','2005-05-12','senectus.et.netus@tristiqueaceleifend.co.uk','5228 Vestibulum Rd.','Kearny','B4Q 1D1','503-513-0236','50900','2459574','pharetra','Adara Joyce','736-165-7251',NULL,'F',NULL),(7,'Hansen','Claire','1950-01-26','ac.libero@nectempus.edu','700-122 Consectetuer Av.','Cromer','D4G 0F9','660-946-3938','143104','1332116','vulputate,','Madeline Dale','240-453-2243',NULL,'F',NULL),(8,'Langley','Paula','1999-12-19','ultrices@vitae.net','867-6330 Pellentesque Rd.','Charlottetown','J3V 6E6','589-138-7432','197825','3315708','Duis','Jaquelyn Pena','623-844-5186',NULL,'F',NULL),(9,'Odom','Uma','2006-01-06','vel.lectus.Cum@nibhdolor.org','2276 Metus Av.','Frasnes-lez-Gosselies','K0M 0V0','427-326-9154','37282','2462831','ac','Kiona Sampson','773-231-2523',NULL,'F',NULL),(10,'Bradford','Quinn','1986-02-02','Nunc.mauris@vitae.ca','P.O. Box 742, 2723 Id, Rd.','Orléans','U3R 3O2','995-785-7713','31964','7556028','et,','Shelby Howard','715-924-6446',NULL,'M',NULL),(11,'Summers','Zenia','2008-03-10','eget.mollis@velit.net','8004 Auctor Av.','Ri�zes','L5X 5P9','333-151-6633','74171','3461372','Etiam','Jessica Mathis','608-665-9252',NULL,'M',NULL),(12,'Ortega','Daphne','2008-03-31','Integer.aliquam.adipiscing@rhoncusNullam.net','6009 Cursus Av.','Arles','B9Q 3I5','317-436-1641','190670','1031098','penatibus','Dorothy Humphrey','769-477-5493',NULL,'M',NULL),(13,'Mills','Theodore','2005-05-13','fermentum@ligula.edu','4465 Nascetur Rd.','Cholet','F8U 0K6','860-740-8388','101327','6588901','Aliquam','Pearl Mullins','355-816-0582',NULL,'F',NULL),(14,'Macdonald','Mollie','1986-02-18','Aenean@Duisatlacus.com','9861 Integer St.','Patna','K5L 2L6','839-569-4536','76304','1957926','eu','Evelyn Robbins','112-620-7431',NULL,'F',NULL),(15,'Cooke','Lysandra','2005-05-13','ac.fermentum.vel@enimEtiamimperdiet.edu','P.O. Box 797, 1533 Vel, St.','Kansas City','O1M 2T1','806-828-1312','46218','4681932','lorem','Marcia Guerrero','602-736-8983',NULL,'M',NULL),(16,'Lowe','Mia','2010-10-22','sem.vitae@arcuVestibulumante.ca','8942 Mauris St.','Calvello','O8I 1H5','791-798-5699','176919','6700569','molestie','Nora Howe','482-286-9032',NULL,'F',NULL),(17,'Stein','Melinda','2011-09-19','erat.eget@aliquamerosturpis.org','5661 Enim. St.','Brescia','U9L 8W8','237-453-7540','183468','7452000','ligula.','Hedwig Harrington','142-837-2726',NULL,'M',NULL),(18,'Murphy','Mallory','2010-10-19','amet.consectetuer@Donecsollicitudinadipiscing.com','P.O. Box 246, 3643 Morbi Rd.','Boise','I3B 4P8','437-837-9494','195937','7060733','Aliquam','Emi Caldwell','312-105-5589',NULL,'F',NULL),(19,'Howell','Oscar','1950-01-31','lorem.tristique@suscipitest.co.uk','667 Dui Road','Harrison Hot Springs','J5O 7T6','791-686-8436','90961','6478640','adipiscing','Kim Zamora','328-682-1848',NULL,'M',NULL),(20,'Chandler','Benedict','1986-02-27','luctus.Curabitur@purusmauris.ca','P.O. Box 582, 5508 Conubia Road','Montelupo Fiorentino','O3E 7W0','160-975-7473','111695','6107040','libero.','Isadora Dorsey','932-898-3315',NULL,'M',NULL),(21,'Fowler','Tyrone','1986-02-02','mattis@enimCurabitur.com','2016 Eu Road','Sutton','G7S 7K0','888-486-1373','43712','4757882','arcu.','Virginia Parker','362-948-9809',NULL,'F',NULL),(22,'Hensley','Fleur','2006-10-15','sed.facilisis@nequeet.ca','6705 Metus. Street','Cittanova','O9D 1W5','524-866-3721','22312','7663739','Nulla','Minerva Rosario','672-185-3085',NULL,'M',NULL),(23,'Aguilar','Raven','2011-09-14','Donec@placerataugue.net','P.O. Box 199, 2958 Rhoncus Rd.','Tofield','V8B 8D6','663-643-5666','120432','5254286','R Aguilari','Liberty Chan','699-713-5237',NULL,'M',NULL),(24,'Ayala','Amanda','2001-07-02','quis@magnisdis.ca','110-1341 Nisi. Rd.','Buggenhout','E3W 8F5','167-309-4901','49450','2300854','dolor.','Hedda Estrada','280-528-7868',NULL,'M',NULL),(25,'Goodman','Aiko','2006-05-22','Morbi@anteiaculis.edu','P.O. Box 385, 165 Lacus. St.','Rotorua','Q5X 2N5','799-509-0578','120677','1271626','nisi','Nayda Bryan','206-427-0782',NULL,'F',NULL),(26,'Cameron','Penelope','2010-10-31','sem.ut.dolor@egestasAliquamnec.org','425-7888 Integer Ave','Ernage','H3N 1P4','859-887-2454','118782','4118114','sollicitudin','Ruby Frye','324-922-6587',NULL,'M',NULL),(27,'Griffith','Cameran','2004-12-04','posuere.enim.nisl@in.edu','7793 Vel Rd.','Lachine','G4H 5U8','120-792-4593','37177','2850131','egestas.','Isabelle Levine','218-715-6871',NULL,'F',NULL),(28,'Lucas','Ryan','2010-10-03','Sed@ac.edu','840-8235 Ac Road','Jackson','D4T 4I2','385-141-6124','80955','7354654','ipsum','Amy Hays','320-216-2872',NULL,'F',NULL),(29,'Rosales','Ruby','1986-02-13','nibh.vulputate.mauris@sitametrisus.edu','Ap #237-1430 Justo. Ave','Bhiwani','M0R 3N9','219-619-6364','82470','4512245','dui,','Phoebe Everett','620-169-7276',NULL,'M',NULL),(30,'Santos','Libby','2003-11-13','Nulla@semper.com','Ap #560-8317 Donec Avenue','Zerkegem','M8C 1O0','888-318-9633','183563','6519219','molestie','Wendy Boone','970-996-2503',NULL,'M',NULL),(31,'Sharpe','Grady','2003-09-10','in.consectetuer.ipsum@auctorquistristique.ca','5122 In, St.','Duque de Caxias','S5Y 6V6','639-242-6303','85165','5691697','egestas','Justine Franks','900-563-9988',NULL,'M',NULL),(32,'Thompson','Christine','1999-12-27','et@placerataugueSed.org','P.O. Box 420, 9620 Ligula. Road','Chattanooga','E6A 5B1','395-198-5226','69818','3110681','erat.','Margaret Calhoun','265-434-5178',NULL,'M',NULL),(33,'Price','Thaddeus','2006-08-20','fringilla.mi.lacinia@senectuset.com','6246 Pharetra Av.','Darion','G9O 6R7','342-503-6787','83703','7795220','Curabitur','Rhoda Guzman','389-303-3064',NULL,'M',NULL),(34,'Mueller','Fitzgerald','2001-07-17','nulla.Integer@libero.co.uk','185-6766 Risus. Ave','M�hlheim am Main','I1G 3Q0','870-806-9307','81615','8456160','nec','Idona Gentry','912-967-4089',NULL,'F',NULL),(35,'Medina','Anjolie','2006-10-11','in.felis@eueuismod.com','Ap #439-7227 Pede Ave','Nevers','C9L 5V6','172-170-5082','91973','2668949','sollicitudin','Jael Ramsey','217-242-4575',NULL,'M',NULL),(36,'Walsh','Neville','2006-08-08','dui.nec@at.ca','1551 Augue Road','Calestano','C5M 4M4','357-178-5809','128291','8179680','odio','Stella Farmer','371-465-8899',NULL,'F',NULL),(37,'Quinn','Stephen','2004-11-30','dictum.placerat.augue@a.edu','Ap #451-8150 Eu, St.','Suwałki','A6H 5E8','116-622-8203','142404','1565526','mus.','Jessamine Rodriquez','234-920-7949',NULL,'F',NULL),(38,'Larsen','Portia','1992-08-20','convallis.in@variusultrices.org','Ap #615-9786 Egestas. Av.','Monmouth','V1C 7U1','744-802-4280','3615','6559116','Lorem','Wynter Walters','863-972-6244',NULL,'M',NULL),(39,'Houston','Nehru','2006-10-27','felis.purus.ac@sollicitudin.ca','8107 Euismod Av.','Gdańsk','F0V 6S3','683-539-0583','73779','6426695','eu','Janna Glass','661-136-1776',NULL,'M',NULL),(40,'Hammond','Katelyn','2008-03-11','ultrices.posuere@orciUtsemper.co.uk','4430 Malesuada. Avenue','Itterbeek','X2E 2Y0','918-961-5109','168172','5247099','libero.','Judith Barr','749-584-7253',NULL,'F',NULL),(41,'Bird','Leila','1992-08-26','dui.quis@aliquam.org','663 Nisl St.','Boninne','H8R 9C3','296-849-1199','89091','6386183','Sed','Adria Wilder','334-756-9194',NULL,'M',NULL),(42,'Hobbs','Bianca','2003-11-16','semper.erat.in@utnisia.edu','Ap #904-7957 Orci Street','Greenock','B4F 3O8','648-653-7257','172140','6063676','ridiculus','Cynthia Banks','557-122-3398',NULL,'F',NULL),(43,'Day','Buffy','1986-02-07','dis.parturient.montes@eratvolutpatNulla.co.uk','278-4741 Auctor. Rd.','Monguelfo-Tesido/Welsberg-Taisten','Y9I 2Z3','632-782-9921','12703','4783302','nibh','Constance Sparks','229-575-0280',NULL,'F',NULL),(44,'Hays','Vielka','2006-01-04','convallis.convallis.dolor@musDonecdignissim.ca','P.O. Box 496, 7993 A, St.','Mödling','D7L 0L8','574-929-0230','98703','4075875','nec','Olympia House','510-164-7473',NULL,'M',NULL),(45,'Taylor','Leandra','2006-08-26','molestie.in@Nuncullamcorper.org','849-7204 Rhoncus. Rd.','Carmarthen','P7V 6F5','807-132-1684','91530','1200158','accumsan','Rae Valentine','552-751-4507',NULL,'F',NULL),(46,'Ellis','Dale','1950-01-21','scelerisque.neque.Nullam@Proinnislsem.net','P.O. Box 110, 2815 Posuere Street','Birmingham','O6E 9M9','672-320-6167','130413','7231646','ullamcorper','Ursula Bird','178-150-1046',NULL,'M',NULL),(47,'Maxwell','Simone','2002-06-22','a.arcu@Duis.co.uk','Ap #473-5200 Justo. Street','Adoni','V9U 9X7','904-984-3183','66635','5140471','scelerisque','Sarah Gomez','922-553-8402',NULL,'F',NULL),(48,'Tyler','Winter','1950-01-15','Proin@congueInscelerisque.ca','5787 Nunc, Rd.','Memphis','J4E 4M9','390-129-0710','50861','1459433','egestas','Shelby Albert','206-785-6281',NULL,'F',NULL),(49,'Mathis','Kasper','2003-09-18','dictum.augue@nibhdolornonummy.ca','2272 Tempus Rd.','Gonda','H4I 1M7','762-780-3599','1896','8863510','aliquet','Charity Estrada','594-735-1531',NULL,'M',NULL),(50,'Craig','Kay','2001-07-07','Aliquam@ornare.com','Ap #241-6423 Nunc St.','Freux','Y0Z 7O1','261-313-0120','48424','1976541','velit','Lani Mosley','282-781-2809',NULL,'F',NULL),(51,'Bernard','Jada','2003-09-22','imperdiet.ornare@tempor.ca','808-9709 In St.','Salt Lake City','S1Y 6Y0','663-897-5853','24325','8995776','et','Madaline Hudson','620-359-9647',NULL,'F',NULL),(52,'Ryan','Wylie','2004-12-11','risus.odio@Donectempus.edu','673-1574 Gravida Avenue','Dudley','T8C 2F5','505-765-8192','63763','6280561','arcu','Quon Phelps','232-334-4332',NULL,'F',NULL),(53,'Edwards','Lionel','2004-12-08','cursus.et@tortornibh.org','P.O. Box 907, 251 Arcu. Avenue','Townsville','J6J 0A1','201-162-9351','64255','4085820','pede.','Denise Williams','253-810-2927',NULL,'M',NULL),(54,'Paul','Avram','1999-12-05','orci.consectetuer@Nunc.org','P.O. Box 218, 4007 Sed Rd.','Tirrases','X1P 3A7','861-236-2857','189723','5865583','eget','Nelle Powell','744-957-2350',NULL,'M',NULL),(55,'Cantu','Minerva','2010-10-17','nascetur@Cras.org','P.O. Box 794, 7540 Purus. Rd.','Rapone','Y3F 1N2','111-600-7038','83107','6060681','eu','Nicole Houston','331-950-4047',NULL,'F',NULL),(56,'Terrell','Kirestin','1986-02-18','at.arcu@nonduinec.ca','1019 Egestas Avenue','Santa Cesarea Terme','B8J 4E0','604-555-8305','53780','6316689','ornare','Hollee Salas','872-732-6894',NULL,'F',NULL),(57,'Neal','Drew','2011-09-15','auctor.odio.a@Cras.com','334 Justo Road','Kitscoty','X4Z 4X1','461-225-2279','91130','7859238','non,','Scarlet York','976-803-8305',NULL,'M',NULL),(58,'Williams','Ralph','2006-10-01','sed@acurna.edu','Ap #462-8030 Nulla Avenue','Caramanico Terme','P9A 3G1','330-923-3101','45964','7706223','ante.','Rose Mcbride','223-963-9378',NULL,'M',NULL),(59,'Pennington','Juliet','2006-05-17','non@malesuada.ca','4128 Odio Street','Grey County','P8Y 3G4','951-487-9680','157224','1133117','malesuada','Vanna Walters','347-923-5108',NULL,'M',NULL),(60,'King','Dolan','1992-08-20','augue.porttitor.interdum@ornarelibero.org','P.O. Box 103, 3515 Massa. St.','Montelupo Fiorentino','N3O 2D1','605-596-4095','181151','4462993','penatibus','Shaeleigh Meyers','388-365-0765',NULL,'F',NULL),(61,'Oneil','Dakota','1992-08-28','auctor.non.feugiat@lectusquis.co.uk','P.O. Box 810, 8136 Convallis Av.','Fréjus','S2S 4A3','231-396-3304','143921','1740942','enim,','Cassady Patel','569-578-8584',NULL,'M',NULL),(62,'Lamb','Philip','2003-11-28','risus@Proinvelit.net','Ap #252-117 Quisque Rd.','Abbeville','L9Z 6N6','355-223-6981','41167','3622190','lectus','Imani Warren','843-705-9666',NULL,'F',NULL),(63,'Goodwin','Sarah','2006-08-23','dui.nec@malesuadafringilla.org','4894 Facilisis Av.','Castel del Giudice','Q5Y 0K0','580-367-8964','180512','7939796','et,','Jennifer Roth','291-879-0572',NULL,'M',NULL),(64,'Aguirre','Zeph','2004-11-27','Nunc@neque.ca','P.O. Box 113, 5597 Consectetuer St.','Blieskastel','R3O 5V8','372-908-7456','98978','6094896','Nam','Priscilla Maddox','744-803-8241',NULL,'M',NULL),(65,'Taylor','Amir','2004-11-14','ut.odio@Pellentesqueut.ca','6855 Semper Av.','Deventer','T7N 0Z0','717-647-9578','168292','2688440','penatibus','Gail Emerson','554-960-2719',NULL,'M',NULL),(66,'Buckley','Trevor','1999-12-15','enim.sit@Quisquetincidunt.co.uk','653-9229 Faucibus Rd.','A Coruña','J0Z 0W7','174-632-8896','126539','6006771','pharetra.','Phyllis Tate','305-430-6098',NULL,'F',NULL),(67,'Freeman','Hayden','2008-03-04','posuere.vulputate@faucibusid.co.uk','P.O. Box 964, 9722 Placerat, Road','Novo Hamburgo','L9F 2X5','615-815-3977','14312','1462383','elit,','Ingrid Hardin','479-750-4415',NULL,'F',NULL),(68,'Mendoza','Belle','1999-12-05','libero@enim.edu','184-4878 Non Avenue','Bad Nauheim','H2W 5W4','599-426-2612','46804','7634860','Proin','Rae Garrison','687-130-0235',NULL,'M',NULL),(69,'Vincent','Alisa','2003-11-12','et.netus.et@neque.com','P.O. Box 945, 812 Accumsan Ave','Boston','H9U 0A1','861-555-3388','110640','4287039','Fusce','Pandora Bullock','588-554-5966',NULL,'M',NULL),(70,'Shaffer','Hope','2006-10-02','consectetuer.euismod@variuset.net','Ap #889-8918 Dapibus Av.','Vancouver','E7F 2F1','802-306-2200','44738','1045479','Vivamus','Wendy Merrill','461-811-0744',NULL,'M',NULL),(71,'Holland','Elliott','2008-03-19','vulputate.velit.eu@Morbineque.ca','P.O. Box 135, 4449 Mauris Av.','Dresden','X1J 5U6','359-994-9987','86095','3122713','a','Kiona Gutierrez','432-294-9914',NULL,'F',NULL),(72,'Goodman','Fitzgerald','2006-05-24','ridiculus.mus@mollisIntegertincidunt.net','2583 Et Avenue','Dunkerque','Q9O 2I1','634-740-9965','142904','7896629','velit','Chiquita Banks','379-721-7898',NULL,'M',NULL),(73,'Frazier','Lysandra','2008-03-16','mauris.Suspendisse@adui.ca','Ap #411-612 Proin Rd.','Montelupo Fiorentino','R3A 2I7','570-147-4813','122309','7726739','libero','Madeline Grimes','161-483-4132',NULL,'M',NULL),(74,'Bryan','Eliana','2008-03-27','ullamcorper@commodotinciduntnibh.ca','P.O. Box 180, 1122 In St.','Runcorn','N6Z 7U7','367-108-6372','126392','6310996','arcu','Regina Wilder','772-519-8346',NULL,'M',NULL),(75,'Fitzpatrick','Jermaine','2004-12-06','Aliquam.gravida.mauris@feugiat.co.uk','578-8945 Felis, Avenue','Casper','J9D 6Q6','575-665-5426','138764','1026974','vulputate','Xaviera Jensen','244-603-6979',NULL,'M',NULL),(76,'Ross','Beverly','2003-09-04','a.malesuada.id@ipsumSuspendisse.edu','842-1042 Ac Rd.','Westlock','I8J 1K3','324-868-3900','185001','3580690','vitae','Heidi Valdez','100-637-9385',NULL,'F',NULL),(77,'Gilmore','Fiona','2001-07-27','consectetuer@est.net','P.O. Box 870, 9863 Commodo Av.','Etterbeek','Y1N 2I4','456-469-5245','139215','3572353','ac','Anne Whitfield','556-302-2110',NULL,'M',NULL),(78,'Vazquez','Cassandra','2003-09-27','malesuada.id.erat@Donecat.com','857-9688 Venenatis Avenue','Itabuna','J3F 0S7','482-214-8899','154081','6073182','Morbi','Scarlett Mclaughlin','493-124-4396',NULL,'F',NULL),(79,'Saunders','Phelan','1950-01-13','nunc.sed.pede@orciluctus.net','5021 Nisl St.','Minna','D1K 7M4','796-353-2562','151369','1239041','vel,','Hannah Sexton','326-719-8109',NULL,'F',NULL),(80,'Cooley','Blaine','2011-09-20','Phasellus@iaculis.edu','P.O. Box 410, 7404 Non, Street','Fort Collins','T1D 7V4','170-699-1379','100434','8399702','Cras','Mariko Moran','860-613-7299',NULL,'M',NULL),(81,'Gregory','Hanna','2004-11-25','amet.luctus.vulputate@maurisipsum.org','P.O. Box 140, 8085 Varius. St.','Saint-Étienne-du-Rouvray','U8S 8G5','371-247-4171','58739','2926618','eros.','Ulla Schwartz','824-442-9733',NULL,'M',NULL),(82,'Ballard','Patience','2006-05-31','laoreet.lectus@pharetra.ca','704-9977 Et Avenue','Philadelphia','F1O 7K0','451-231-8701','141307','1441920','metus.','Emerald Hurst','978-671-3538',NULL,'F',NULL),(83,'Bradshaw','Alma','2004-12-17','Phasellus.at@Mauris.co.uk','P.O. Box 487, 6318 Ante. Avenue','Gallodoro','Q5T 1L4','548-196-7510','155455','3391172','adipiscing','Christine Curry','310-113-9664',NULL,'M',NULL),(84,'Moore','Quynn','2003-11-01','enim.commodo.hendrerit@orci.edu','Ap #265-9472 Vitae Road','Townsville','S5Z 8G7','626-540-4267','87962','8882097','Duis','Riley Maynard','126-602-6874',NULL,'M',NULL),(85,'Donaldson','Patience','2001-07-10','arcu.Curabitur.ut@semmollis.org','Ap #352-6328 Malesuada Avenue','Brixton','M4S 5Y2','107-193-6267','161574','5987894','varius.','Chantale Barton','871-692-3116',NULL,'M',NULL),(86,'Hopkins','Coby','1992-08-24','Sed.neque@Nuncmaurissapien.co.uk','7661 Aliquam Rd.','Cockburn','Y6Z 0S5','845-243-5490','28572','8884988','ante','Chastity Cleveland','610-181-2036',NULL,'M',NULL),(87,'Glover','Yen','2009-04-27','purus.accumsan@consectetueradipiscing.co.uk','Ap #858-214 Gravida. Rd.','Oderzo','D2J 8R4','369-722-4687','32088','1705838','Aliquam','Susan Saunders','616-149-6977',NULL,'F',NULL),(88,'Harris','Caleb','2010-10-22','dignissim.tempor@rhoncusDonec.ca','3620 Sit St.','Mandela','V9Z 5M0','800-404-5947','138047','5536506','justo.','TaShya Odonnell','513-916-6405',NULL,'F',NULL),(89,'Howe','Chase','2001-07-29','leo@utnullaCras.ca','P.O. Box 318, 5593 Purus Road','Neustadt','Z9Z 5N4','277-993-8545','39781','4959390','elit,','Eliana Underwood','454-807-8657',NULL,'F',NULL),(90,'Russell','Bernard','2004-11-04','Mauris.molestie.pharetra@tellusnonmagna.ca','802 Tempus St.','Bromyard','X5J 1E7','752-775-5026','71432','8231368','pede.','Anastasia Rogers','279-197-2879',NULL,'F',NULL),(91,'Dale','Erasmus','1999-12-30','purus.Maecenas.libero@nullaInteger.com','Ap #404-4005 Ut, Road','Toledo','X7B 4L5','744-105-9435','152690','7309087','diam','Flavia Pickett','946-558-1456',NULL,'F',NULL),(92,'Ashley','Victor','1950-01-27','interdum@non.org','P.O. Box 843, 145 Est Avenue','Durgapur','Y4Y 4F9','210-982-7653','24663','2887251','suscipit','Haley Mercer','183-991-2020',NULL,'F',NULL),(93,'Willis','Laura','2009-04-23','euismod@at.edu','856-4072 Et, Av.','Incourt','R4V 2Z6','320-376-6653','28451','2732932','molestie','Zenaida Wyatt','972-156-0241',NULL,'M',NULL),(94,'Henderson','Deirdre','2004-12-09','lectus.pede@porttitorinterdum.edu','332-3990 Magna Street','Lac La Biche County','B0N 3R1','788-573-2463','131182','6133507','pellentesque.','Regan Kline','637-890-2311',NULL,'F',NULL),(95,'Berger','Theodore','2001-07-13','hymenaeos@duinec.edu','Ap #558-3550 Integer Ave','Burcht','I4X 0T3','747-499-6462','99378','8557178','et','Quynn Pratt','161-948-7290',NULL,'F',NULL),(96,'Mcpherson','Herrod','2010-10-14','at.pede.Cras@amet.org','P.O. Box 521, 4481 Volutpat. Rd.','Roveredo in Piano','O3A 7P0','569-173-9707','153281','5712515','libero','May Flores','909-367-0333',NULL,'M',NULL),(97,'Riggs','Demetria','2008-03-03','non@Duiscursusdiam.edu','P.O. Box 414, 9851 Aliquam Av.','Castel Maggiore','E9M 9T4','605-522-3071','11177','3667001','nonummy','Larissa Soto','486-188-2630',NULL,'M',NULL),(98,'Nguyen','Tate','2006-10-08','lacus@feugiatplaceratvelit.net','P.O. Box 540, 2526 Ante, Rd.','Maria','K1C 7W1','696-183-2441','144856','2930880','nostra,','Shaeleigh Mclean','785-809-7356',NULL,'M',NULL),(99,'Macdonald','Zephania','2003-11-20','sit@augueacipsum.ca','Ap #144-7743 Libero Street','Mont-sur-Marchienne','H2I 6O0','702-998-0823','67390','4343818','turpis.','Rebekah Carter','431-426-0846',NULL,'F',NULL),(100,'Harrison','Stone','2002-06-29','Suspendisse.aliquet@risusodioauctor.net','1691 Felis Av.','Bihain','W6Y 9J8','170-203-2650','20171','3655390','erat','Melyssa Rios','821-244-8819',NULL,'F',NULL);
/*!40000 ALTER TABLE `client` ENABLE KEYS */;
UNLOCK TABLES;

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
) ENGINE=MyISAM AUTO_INCREMENT=4 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `club`
--

LOCK TABLES `club` WRITE;
/*!40000 ALTER TABLE `club` DISABLE KEYS */;
INSERT INTO `club` VALUES (1,'Club Judo Kita','Kita','C000','','J0M','819-',0,NULL,NULL,0,NULL,NULL,NULL),(2,'Club de judo Nishi','Nishi','C001','Chisasibi','J0M','819-',0,NULL,NULL,0,0,NULL,NULL),(3,'Association de judo Higashi','Higashi','C002','Blanc-Sablon','G0G','418-',NULL,NULL,NULL,0,0,NULL,NULL);
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
) ENGINE=MyISAM AUTO_INCREMENT=130 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `club_cours`
--

LOCK TABLES `club_cours` WRITE;
/*!40000 ALTER TABLE `club_cours` DISABLE KEYS */;
INSERT INTO `club_cours` VALUES (1,1,'13','L1730-1900 J1830-2000'),(2,1,'13','Ma1700-1815 S1400-1530'),(3,1,'13','Ma1815-1930 V1730-1900'),(4,1,'13','J1700-1830 S1530-1700'),(5,1,'13','LMeV1900-2100'),(6,1,'13','S0830-0945'),(7,1,'13','S0945-1100'),(8,1,'13','S1100-1215'),(10,2,'13','Poussin'),(11,2,'13','Cadet'),(12,2,'13','Développement'),(13,2,'13','Adulte'),(14,2,'13','Compétition'),(24,3,'13','LMV1900-2030 ado-adulte'),(23,3,'13','MV1800-1900 av'),(22,3,'13','LJ1800-1900 int'),(21,3,'13','M1800-1900 S0930-1030 déb'),(20,3,'13','S0830-0915 init'),(30,1,'13','L1730-1900 J1830-2000'),(31,1,'13','Ma1700-1815 S1400-1530'),(101,1,'15','L1730-1900 J1830-2000'),(102,1,'15','Ma1700-1815 S1400-1530'),(103,1,'15','Ma1815-1930 V1730-1900'),(104,1,'15','J1700-1830 S1530-1700'),(105,1,'15','LMeV1900-2100'),(106,1,'15','S0830-0945'),(107,1,'15','S0945-1100'),(108,1,'15','S1100-1215'),(110,2,'15','Poussin'),(111,2,'15','Cadet'),(112,2,'15','Développement'),(113,2,'15','Adulte'),(114,2,'15','Compétition'),(124,3,'15','LMV1900-2030 ado-adulte'),(123,3,'15','MV1800-1900 av'),(122,3,'15','LJ1800-1900 int'),(121,3,'15','M1800-1900 S0930-1030 déb'),(120,3,'15','S0830-0915 init'),(125,3,'15','test'),(126,3,'15','test2'),(127,3,'15','test3'),(128,3,'15','test4'),(129,3,'15','test5');
/*!40000 ALTER TABLE `club_cours` ENABLE KEYS */;
UNLOCK TABLES;

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
-- Dumping data for table `escompte`
--

LOCK TABLES `escompte` WRITE;
/*!40000 ALTER TABLE `escompte` DISABLE KEYS */;
INSERT INTO `escompte` VALUES (1,1,'2e membre','10',''),(2,1,'3e membre','15',''),(3,1,'4e membre','20',''),(4,1,'5e membre','25',''),(5,1,'Nouvel(le) ami(e)','10',''),(6,1,'Membre du CA','50',''),(7,1,'Cas spécial','-1','');
/*!40000 ALTER TABLE `escompte` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `grades`
--

DROP TABLE IF EXISTS `grades`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `grades` (
  `client_id` int(11) DEFAULT NULL,
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `grade` varchar(10) CHARACTER SET latin1 DEFAULT NULL,
  `date_grade` date DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=7918 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `grades`
--

LOCK TABLES `grades` WRITE;
/*!40000 ALTER TABLE `grades` DISABLE KEYS */;
INSERT INTO `grades` VALUES (1,1,'3D','2001-05-17'),(2,2,'5D','2015-08-12'),(3,3,'5D','2008-10-12'),(4,4,'3D','2002-11-01'),(5,5,'Marron','2011-05-17'),(6,6,'Bleue','2010-04-30'),(7,7,'2D','2006-05-23'),(8,8,'Jaune','2001-04-01'),(9,9,'Bleue','2001-07-19'),(10,10,'4D','2010-12-14'),(11,11,'3D','2004-07-07'),(12,12,'3D','2005-02-08'),(13,13,'Marron','2010-12-29'),(14,14,'1D','2006-11-17'),(15,15,'Jaune','2014-11-13'),(16,16,'Marron','2000-09-11'),(17,17,'Orange','2009-10-20'),(18,18,'Blanche','2005-11-05'),(19,19,'Orange','2002-03-26'),(20,20,'Marron','2002-04-05'),(21,21,'Marron','2010-11-19'),(22,22,'Orange','2015-05-05'),(23,7917,'3D','2014-11-05'),(24,24,'3D','2003-02-25'),(25,25,'Jaune','2014-05-17'),(26,26,'4D','2010-01-16'),(27,27,'1D','2015-11-28'),(28,28,'Orange','2001-02-28'),(29,29,'Marron','2003-09-07'),(30,30,'5D','2009-10-08'),(31,31,'Orange','2008-08-11'),(32,32,'Bleue','2014-10-24'),(33,33,'Blanche','2005-07-29'),(34,34,'5D','2000-03-14'),(35,35,'Marron','2008-02-21'),(36,36,'4D','2009-07-20'),(37,37,'Verte','2014-05-01'),(38,38,'5D','2007-10-16'),(39,39,'Orange','2004-03-08'),(40,40,'Blanche','2000-10-03'),(41,41,'3D','2003-06-11'),(42,42,'Jaune','2003-03-20'),(43,43,'Blanche','2005-09-29'),(44,44,'2D','2009-10-19'),(45,45,'Blanche','2014-05-02'),(46,46,'5D','2001-10-02'),(47,47,'Jaune','2004-03-30'),(48,48,'4D','2002-11-16'),(49,49,'Blanche','2001-02-09'),(50,50,'4D','2001-06-28'),(51,51,'3D','2000-03-26'),(52,52,'Orange','2010-09-27'),(53,53,'5D','2009-03-17'),(54,54,'3D','2002-08-05'),(55,55,'3D','2002-06-11'),(56,56,'1D','2002-09-09'),(57,57,'Jaune','2009-01-15'),(58,58,'Orange','2013-05-04'),(59,59,'4D','2002-06-14'),(60,60,'Orange','2001-01-12'),(61,61,'4D','2013-06-30'),(62,62,'Verte','2012-08-16'),(63,63,'Verte','2001-04-03'),(64,64,'5D','2009-10-19'),(65,65,'Blanche','2015-05-17'),(66,66,'3D','2004-09-02'),(67,67,'Blanche','2015-05-01'),(68,68,'Bleue','2009-03-02'),(69,69,'4D','2001-02-08'),(70,70,'Orange','2012-06-11'),(71,71,'Marron','2003-07-17'),(72,72,'Bleue','2011-05-23'),(73,73,'5D','2009-07-06'),(74,74,'1D','2003-06-25'),(75,75,'Blanche','2007-04-04'),(76,76,'Jaune','2011-01-12'),(77,77,'4D','2011-08-02'),(78,78,'2D','2009-06-03'),(79,79,'Verte','2002-01-15'),(80,80,'Jaune','2002-11-15'),(81,81,'2D','2002-01-04'),(82,82,'Jaune','2010-09-24'),(83,83,'Jaune','2005-07-26'),(84,84,'Bleue','2013-03-17'),(85,85,'Bleue','2005-10-23'),(86,86,'Bleue','2005-11-05'),(87,87,'1D','2012-06-24'),(88,88,'1D','2009-04-15'),(89,89,'4D','2004-10-12'),(90,90,'1D','2015-04-23'),(91,91,'2D','2014-03-28'),(92,92,'Marron','2009-12-10'),(93,93,'2D','2002-05-21'),(94,94,'1D','2008-02-14'),(95,95,'5D','2010-07-18'),(96,96,'1D','2004-04-25'),(97,97,'3D','2000-02-18'),(98,98,'Jaune','2013-05-28'),(99,99,'Blanche','2001-08-05'),(100,100,'Jaune','2001-03-07');
/*!40000 ALTER TABLE `grades` ENABLE KEYS */;
UNLOCK TABLES;

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
) ENGINE=MyISAM AUTO_INCREMENT=66 DEFAULT CHARSET=utf8;
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
INSERT INTO `produit` VALUES (2,0,'Passeport Judo Canada','40'),(1,0,'Passeport Judo Québec','5'),(3,1,'000/00 (55$)','55'),(4,1,'0/1 (60$)','60'),(5,1,'2/3 (65$)','65'),(6,1,'4/5/6 (75$)','75');
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
  `saisons` char(10) CHARACTER SET latin1 DEFAULT NULL,
  `date_affiliation_envoye` date DEFAULT NULL,
  `carte_judoca_recu` tinyint(1) DEFAULT NULL,
  `sans_affiliation` tinyint(1) DEFAULT NULL,
  `affiliation_initiation` tinyint(1) DEFAULT NULL,
  `affiliation_ecole` tinyint(1) DEFAULT NULL,
  `affiliation_parascolaire` tinyint(1) DEFAULT NULL,
  `cours` char(5) CHARACTER SET latin1 DEFAULT NULL,
  `sessions` char(1) DEFAULT NULL,
  `passeport` tinyint(1) DEFAULT NULL,
  `resident` tinyint(1) DEFAULT NULL,
  `paypal` tinyint(1) DEFAULT NULL,
  `judogi` char(3) CHARACTER SET latin1 DEFAULT NULL,
  `escompte` char(3) CHARACTER SET latin1 DEFAULT NULL,
  `categorie_frais` char(10) CHARACTER SET latin1 DEFAULT NULL,
  `affiliation_frais` char(10) CHARACTER SET latin1 DEFAULT NULL,
  `supp_frais` char(10) CHARACTER SET latin1 DEFAULT NULL,
  `frais` char(10) CHARACTER SET latin1 DEFAULT NULL,
  `cas_special_note` varchar(50) CHARACTER SET latin1 DEFAULT NULL,
  `escompte_special` varchar(10) CHARACTER SET latin1 DEFAULT NULL,
  `horaire_special` varchar(50) CHARACTER SET latin1 DEFAULT NULL,
  `affiliation_envoye` tinyint(1) DEFAULT NULL,
  `solde` tinyint(1) DEFAULT NULL,
  `club_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=105 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `services`
--

LOCK TABLES `services` WRITE;
/*!40000 ALTER TABLE `services` DISABLE KEYS */;
INSERT INTO `services` VALUES (1,1,'2016-08-05','A16',NULL,0,0,0,0,0,'2',NULL,0,1,0,'0','0','50','50','0','100','','','',2,1,3),(2,2,'2016-11-24','A16',NULL,0,0,0,0,0,'2',NULL,0,1,0,'0','1','50','50','0','100','','','',1,1,1),(3,3,'2016-11-29','A16 H17',NULL,0,0,0,0,0,'2',NULL,0,1,1,'0','1','50','50','0','100','','','',0,1,1),(4,4,'2016-08-15','A16',NULL,0,0,0,0,0,'1',NULL,0,1,0,'0','0','50','50','0','100','','','',1,1,1),(5,5,'2016-07-06','A16',NULL,0,0,0,0,0,'1',NULL,0,1,0,'0','0','50','50','0','100','','','',1,0,3),(6,6,'2016-08-02','A16',NULL,0,0,0,0,0,'2',NULL,0,1,1,'0','1','50','50','0','100','','','',2,0,1),(7,7,'2016-11-10','A16',NULL,0,0,0,0,0,'2',NULL,0,1,0,'0','1','50','50','0','100','','','',1,0,3),(8,8,'2016-07-07','A16 H17',NULL,0,0,0,0,0,'1',NULL,0,1,1,'0','0','50','50','0','100','','','',2,0,3),(9,9,'2016-07-29','A16 H17',NULL,0,0,0,0,0,'2',NULL,0,1,1,'0','0','50','50','0','100','','','',0,0,1),(10,10,'2016-07-10','A16',NULL,0,0,0,0,0,'2',NULL,0,1,1,'0','1','50','50','0','100','','','',1,0,2),(11,11,'2016-09-28','A16',NULL,0,0,0,0,0,'1',NULL,0,1,0,'0','0','50','50','0','100','','','',1,1,1),(12,12,'2016-11-06','A16',NULL,0,0,0,0,0,'1',NULL,0,1,1,'0','1','50','50','0','100','','','',2,1,3),(13,13,'2016-08-23','A16 H17',NULL,0,0,0,0,0,'2',NULL,0,1,1,'0','1','50','50','0','100','','','',2,0,2),(14,14,'2016-11-03','A16 H17',NULL,0,0,0,0,0,'1',NULL,0,1,1,'0','0','50','50','0','100','','','',0,1,1),(15,15,'2016-10-15','A16 H17',NULL,0,0,0,0,0,'2',NULL,0,1,0,'0','1','50','50','0','100','','','',0,1,1),(16,16,'2016-11-18','A16',NULL,0,0,0,0,0,'2',NULL,0,1,0,'0','1','50','50','0','100','','','',1,1,1),(17,17,'2016-08-27','A16',NULL,0,0,0,0,0,'1',NULL,0,1,0,'0','1','50','50','0','100','','','',2,0,2),(18,18,'2016-06-09','A16',NULL,0,0,0,0,0,'1',NULL,0,1,0,'0','1','50','50','0','100','','','',2,0,3),(19,19,'2016-09-30','A16 H17',NULL,0,0,0,0,0,'1',NULL,0,1,1,'0','0','50','50','0','100','','','',1,1,3),(20,20,'2016-08-15','A16',NULL,0,0,0,0,0,'2',NULL,0,1,1,'0','0','50','50','0','100','','','',2,1,3),(21,21,'2016-06-08','A16',NULL,0,0,0,0,0,'1',NULL,0,1,0,'0','1','50','50','0','100','','','',1,0,1),(22,22,'2016-07-23','A16 H17',NULL,0,0,0,0,0,'1',NULL,0,1,1,'0','0','50','50','0','100','','','',0,1,1),(23,104,'2016-05-29','A16 H17',NULL,0,0,0,0,0,'101',NULL,NULL,1,0,'0','0','377','80','0','457','','0',NULL,0,1,1),(24,24,'2016-06-20','A16',NULL,0,0,0,0,0,'2',NULL,0,1,0,'0','1','50','50','0','100','','','',1,1,3),(25,25,'2016-05-16','A16 H17',NULL,0,0,0,0,0,'2',NULL,0,1,1,'0','0','50','50','0','100','','','',1,0,2),(26,26,'2016-07-27','A16',NULL,0,0,0,0,0,'2',NULL,0,1,1,'0','0','50','50','0','100','','','',2,1,3),(27,27,'2016-08-08','A16',NULL,0,0,0,0,0,'2',NULL,0,1,0,'0','1','50','50','0','100','','','',1,1,3),(28,28,'2016-11-28','A16 H17',NULL,0,0,0,0,0,'1',NULL,0,1,0,'0','0','50','50','0','100','','','',0,1,1),(29,29,'2016-09-03','A16',NULL,0,0,0,0,0,'1',NULL,0,1,1,'0','1','50','50','0','100','','','',2,1,1),(30,30,'2016-09-28','A16 H17',NULL,0,0,0,0,0,'2',NULL,0,1,1,'0','0','50','50','0','100','','','',2,0,2),(31,31,'2016-07-23','A16 H17',NULL,0,0,0,0,0,'1',NULL,0,1,1,'0','1','50','50','0','100','','','',0,1,1),(32,32,'2016-08-12','A16 H17',NULL,0,0,0,0,0,'2',NULL,0,1,1,'0','0','50','50','0','100','','','',0,1,1),(33,33,'2016-12-06','A16 H17',NULL,0,0,0,0,0,'2',NULL,0,1,0,'0','0','50','50','0','100','','','',1,0,3),(34,34,'2016-06-29','A16',NULL,0,0,0,0,0,'1',NULL,0,1,1,'0','1','50','50','0','100','','','',1,0,1),(35,35,'2016-10-22','A16 H17',NULL,0,0,0,0,0,'1',NULL,0,1,0,'0','0','50','50','0','100','','','',0,0,1),(36,36,'2016-11-19','A16 H17',NULL,0,0,0,0,0,'1',NULL,0,1,0,'0','1','50','50','0','100','','','',1,1,3),(37,37,'2016-11-21','A16',NULL,0,0,0,0,0,'1',NULL,0,1,0,'0','1','50','50','0','100','','','',1,0,1),(38,38,'2016-10-23','A16',NULL,0,0,0,0,0,'1',NULL,0,1,1,'0','0','50','50','0','100','','','',1,0,3),(39,39,'2016-05-18','A16',NULL,0,0,0,0,0,'2',NULL,0,1,1,'0','0','50','50','0','100','','','',2,0,3),(40,40,'2016-07-03','A16 H17',NULL,0,0,0,0,0,'2',NULL,0,1,1,'0','0','50','50','0','100','','','',0,1,1),(41,41,'2016-09-11','A16 H17',NULL,0,0,0,0,0,'2',NULL,0,1,0,'0','0','50','50','0','100','','','',2,1,3),(42,42,'2016-12-11','A16',NULL,0,0,0,0,0,'1',NULL,0,1,1,'0','0','50','50','0','100','','','',1,0,1),(43,43,'2016-06-11','A16 H17',NULL,0,0,0,0,0,'2',NULL,0,1,1,'0','1','50','50','0','100','','','',2,0,2),(44,44,'2016-06-23','A16 H17',NULL,0,0,0,0,0,'2',NULL,0,1,1,'0','0','50','50','0','100','','','',1,0,3),(45,45,'2016-07-09','A16',NULL,0,0,0,0,0,'2',NULL,0,1,0,'0','1','50','50','0','100','','','',2,0,2),(46,46,'2016-07-07','A16',NULL,0,0,0,0,0,'1',NULL,0,1,1,'0','1','50','50','0','100','','','',1,0,1),(47,47,'2016-10-07','A16',NULL,0,0,0,0,0,'2',NULL,0,1,1,'0','1','50','50','0','100','','','',1,1,3),(48,48,'2016-08-10','A16',NULL,0,0,0,0,0,'2',NULL,0,1,0,'0','0','50','50','0','100','','','',1,0,2),(49,49,'2016-10-16','A16 H17',NULL,0,0,0,0,0,'2',NULL,0,1,0,'0','1','50','50','0','100','','','',1,1,3),(50,50,'2016-11-08','A16',NULL,0,0,0,0,0,'2',NULL,0,1,0,'0','1','50','50','0','100','','','',1,1,1),(51,51,'2016-11-01','A16',NULL,0,0,0,0,0,'1',NULL,0,1,1,'0','0','50','50','0','100','','','',1,1,3),(52,52,'2016-11-17','A16 H17',NULL,0,0,0,0,0,'2',NULL,0,1,0,'0','0','50','50','0','100','','','',1,1,2),(53,53,'2016-11-28','A16 H17',NULL,0,0,0,0,0,'1',NULL,0,1,0,'0','1','50','50','0','100','','','',1,0,2),(54,54,'2016-08-25','A16',NULL,0,0,0,0,0,'2',NULL,0,1,1,'0','0','50','50','0','100','','','',2,0,2),(55,55,'2016-08-15','A16 H17',NULL,0,0,0,0,0,'2',NULL,0,1,1,'0','1','50','50','0','100','','','',1,1,2),(56,56,'2016-09-30','A16 H17',NULL,0,0,0,0,0,'2',NULL,0,1,0,'0','0','50','50','0','100','','','',0,0,1),(57,57,'2016-11-10','A16 H17',NULL,0,0,0,0,0,'1',NULL,0,1,1,'0','1','50','50','0','100','','','',0,1,1),(58,58,'2016-06-14','A16',NULL,0,0,0,0,0,'1',NULL,0,1,0,'0','0','50','50','0','100','','','',2,0,3),(59,59,'2016-06-03','A16',NULL,0,0,0,0,0,'2',NULL,0,1,1,'0','0','50','50','0','100','','','',2,0,3),(60,60,'2016-11-30','A16 H17',NULL,0,0,0,0,0,'1',NULL,0,1,0,'0','0','50','50','0','100','','','',2,0,2),(61,61,'2016-05-30','A16 H17',NULL,0,0,0,0,0,'1',NULL,0,1,0,'0','0','50','50','0','100','','','',0,1,1),(62,62,'2016-09-16','A16 H17',NULL,0,0,0,0,0,'2',NULL,0,1,0,'0','0','50','50','0','100','','','',0,1,1),(63,63,'2016-10-24','A16',NULL,0,0,0,0,0,'1',NULL,0,1,1,'0','1','50','50','0','100','','','',1,1,2),(64,64,'2016-07-15','A16 H17',NULL,0,0,0,0,0,'2',NULL,0,1,1,'0','1','50','50','0','100','','','',2,1,3),(65,65,'2016-10-04','A16',NULL,0,0,0,0,0,'1',NULL,0,1,0,'0','1','50','50','0','100','','','',1,0,3),(66,66,'2016-07-30','A16',NULL,0,0,0,0,0,'1',NULL,0,1,1,'0','0','50','50','0','100','','','',1,1,1),(67,67,'2016-06-17','A16 H17',NULL,0,0,0,0,0,'2',NULL,0,1,0,'0','1','50','50','0','100','','','',2,0,2),(68,68,'2016-11-17','A16',NULL,0,0,0,0,0,'1',NULL,0,1,0,'0','1','50','50','0','100','','','',1,1,2),(69,69,'2016-11-14','A16',NULL,0,0,0,0,0,'2',NULL,0,1,0,'0','1','50','50','0','100','','','',1,1,2),(70,70,'2016-10-27','A16 H17',NULL,0,0,0,0,0,'1',NULL,0,1,1,'0','0','50','50','0','100','','','',2,0,2),(71,71,'2016-08-26','A16 H17',NULL,0,0,0,0,0,'1',NULL,0,1,1,'0','1','50','50','0','100','','','',2,1,3),(72,72,'2016-11-11','A16 H17',NULL,0,0,0,0,0,'1',NULL,0,1,0,'0','0','50','50','0','100','','','',0,0,1),(73,73,'2016-07-21','A16 H17',NULL,0,0,0,0,0,'2',NULL,0,1,1,'0','0','50','50','0','100','','','',0,1,1),(74,74,'2016-10-21','A16 H17',NULL,0,0,0,0,0,'1',NULL,0,1,1,'0','0','50','50','0','100','','','',2,1,2),(75,75,'2016-06-22','A16 H17',NULL,0,0,0,0,0,'2',NULL,0,1,1,'0','0','50','50','0','100','','','',1,1,3),(76,76,'2016-12-01','A16',NULL,0,0,0,0,0,'1',NULL,0,1,1,'0','0','50','50','0','100','','','',1,1,2),(77,77,'2016-10-17','A16',NULL,0,0,0,0,0,'1',NULL,0,1,1,'0','1','50','50','0','100','','','',2,1,2),(78,78,'2016-06-25','A16',NULL,0,0,0,0,0,'2',NULL,0,1,0,'0','1','50','50','0','100','','','',2,1,1),(79,79,'2016-10-05','A16',NULL,0,0,0,0,0,'1',NULL,0,1,1,'0','1','50','50','0','100','','','',1,1,1),(80,80,'2016-10-04','A16 H17',NULL,0,0,0,0,0,'2',NULL,0,1,0,'0','0','50','50','0','100','','','',2,0,2),(81,81,'2016-07-16','A16',NULL,0,0,0,0,0,'2',NULL,0,1,1,'0','1','50','50','0','100','','','',1,0,2),(82,82,'2016-05-24','A16',NULL,0,0,0,0,0,'1',NULL,0,1,1,'0','1','50','50','0','100','','','',1,1,1),(83,83,'2016-11-21','A16 H17',NULL,0,0,0,0,0,'2',NULL,0,1,0,'0','0','50','50','0','100','','','',2,0,2),(84,84,'2016-06-12','A16',NULL,0,0,0,0,0,'1',NULL,0,1,1,'0','0','50','50','0','100','','','',1,1,2),(85,85,'2016-07-17','A16 H17',NULL,0,0,0,0,0,'1',NULL,0,1,0,'0','0','50','50','0','100','','','',0,1,1),(86,86,'2016-07-12','A16',NULL,0,0,0,0,0,'1',NULL,0,1,1,'0','0','50','50','0','100','','','',1,0,3),(87,87,'2016-11-02','A16',NULL,0,0,0,0,0,'2',NULL,0,1,0,'0','1','50','50','0','100','','','',1,1,2),(88,88,'2016-07-29','A16',NULL,0,0,0,0,0,'2',NULL,0,1,1,'0','1','50','50','0','100','','','',1,0,3),(89,89,'2016-07-24','A16',NULL,0,0,0,0,0,'2',NULL,0,1,0,'0','1','50','50','0','100','','','',1,0,1),(90,90,'2016-10-17','A16',NULL,0,0,0,0,0,'2',NULL,0,1,1,'0','1','50','50','0','100','','','',2,0,2),(91,91,'2016-05-21','A16 H17',NULL,0,0,0,0,0,'1',NULL,0,1,0,'0','1','50','50','0','100','','','',1,1,3),(92,92,'2016-09-26','A16',NULL,0,0,0,0,0,'2',NULL,0,1,1,'0','1','50','50','0','100','','','',1,1,3),(93,93,'2016-05-17','A16',NULL,0,0,0,0,0,'2',NULL,0,1,0,'0','1','50','50','0','100','','','',2,1,3),(94,94,'2016-05-21','A16 H17',NULL,0,0,0,0,0,'2',NULL,0,1,0,'0','1','50','50','0','100','','','',0,1,1),(95,95,'2016-05-25','A16',NULL,0,0,0,0,0,'1',NULL,0,1,1,'0','0','50','50','0','100','','','',1,1,1),(96,96,'2016-12-05','A16',NULL,0,0,0,0,0,'1',NULL,0,1,1,'0','0','50','50','0','100','','','',2,1,1),(97,97,'2016-08-27','A16',NULL,0,0,0,0,0,'2',NULL,0,1,1,'0','1','50','50','0','100','','','',1,1,3),(98,98,'2016-10-01','A16',NULL,0,0,0,0,0,'1',NULL,0,1,1,'0','1','50','50','0','100','','','',1,0,3),(99,99,'2016-11-17','A16',NULL,0,0,0,0,0,'2',NULL,0,1,0,'0','0','50','50','0','100','','','',1,1,2),(100,100,'2016-06-14','A16',NULL,0,0,0,0,0,'1',NULL,0,1,1,'0','0','50','50','0','100','','','',2,0,2);
/*!40000 ALTER TABLE `services` ENABLE KEYS */;
UNLOCK TABLES;

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
INSERT INTO `session` VALUES (0,1,'Automne 2009','2010','A09'),(1,0,'Hiver 2010','2010','H10'),(2,3,'Automne 2010','2011','A10'),(3,2,'Hiver 2011','2011','H11'),(4,5,'Automne 2011','2012','A11'),(5,4,'Hiver 2012','2012','H12'),(6,7,'Automne 2012','2013','A12'),(7,6,'Hiver 2013','2013','H13'),(8,9,'Automne 2013','2014','A13'),(9,8,'Hiver 2014','2014','H14'),(10,11,'Automne 2014','2015','A14'),(11,10,'Hiver 2015','2015','H15'),(13,14,'Automne 2015','2016','A15'),(14,13,'Hiver 2016','2016','H16'),(15,16,'Automne 2016','2017','A16'),(16,15,'Hiver 2017','2017','H17');
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
) ENGINE=MyISAM AUTO_INCREMENT=219 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `session_club`
--

LOCK TABLES `session_club` WRITE;
/*!40000 ALTER TABLE `session_club` DISABLE KEYS */;
INSERT INTO `session_club` VALUES (1,0,1,'2009-09-01','2009-09-01','2010-12-31','2009-12-31'),(2,1,1,'2009-01-01','2010-01-01','2010-05-15','2010-05-15'),(3,2,1,'2010-09-01','2010-09-01','2011-12-31','2010-12-31'),(4,3,1,'2011-01-01','2011-01-01','2011-05-15','2011-05-15'),(5,4,1,'2011-09-01','2011-09-01','2011-05-15','2011-12-31'),(6,5,1,'2012-01-01','2012-01-01','2012-05-15','2012-05-15'),(7,6,1,'2012-09-01','2012-09-01','2012-12-15','2012-12-15'),(8,7,1,'2013-01-05','2013-01-01','2013-05-15','2013-05-15'),(9,8,1,'2013-09-01','2013-09-01','2013-12-31','2013-12-31'),(10,9,1,'2014-01-01','2014-01-01','2014-05-15','2014-05-15'),(11,10,1,'2014-09-01','2014-05-16','2014-12-19','2014-12-19'),(12,11,1,'2015-01-05','2015-01-05','2015-05-15','2015-05-15'),(13,13,1,'2015-09-07','2015-05-16','2015-12-18','2015-12-18'),(14,14,1,'2016-01-04','2015-12-19','2016-05-13','2016-05-13'),(113,13,2,'2015-09-07','2015-05-16','2015-12-18','2015-12-18'),(114,14,2,'2016-01-04','2015-12-19','2016-05-13','2016-05-13'),(213,13,3,'2015-09-07','2015-05-16','2015-12-18','2015-12-18'),(214,14,3,'2016-01-04','2015-12-19','2016-05-13','2016-05-13'),(215,11,0,NULL,NULL,NULL,'2015-05-25'),(216,5,3,'2012-01-02','2011-12-19','2012-05-13','2012-05-13'),(217,15,1,'2016-09-07','2016-05-16','2016-12-18','2016-12-18'),(218,16,1,'2017-01-04','2016-12-19','2017-05-13','2017-05-13'),(219,15,2,'2016-09-01','2016-08-01','2016-12-18','2016-12-18'),(220,16,2,'2017-01-02','2016-12-19','2017-05-13','2017-05-13'),(221,15,3,'2016-09-01','2016-08-01','2016-12-18','2016-12-18'),(222,16,3,'2017-01-02','2016-12-16','2017-05-13','2017-05-13');
/*!40000 ALTER TABLE `session_club` ENABLE KEYS */;
UNLOCK TABLES;

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
) ENGINE=MyISAM AUTO_INCREMENT=9 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (1,'bidon','root@localhost',NULL,NULL,1),(2,'notroot','nobody@localhost',NULL,NULL,0);
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
) ENGINE=MyISAM AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_club`
--

LOCK TABLES `user_club` WRITE;
/*!40000 ALTER TABLE `user_club` DISABLE KEYS */;
INSERT INTO `user_club` VALUES (1,2,2,1),(2,2,3,1);
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

-- Dump completed on 2016-08-03 17:39:11
