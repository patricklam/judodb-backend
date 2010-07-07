function bail() {
  setError('s.v.p. faire un reset');
}

function createTablesIfNeeded (db) {
    // check for schema version existing
  var rs = db.execute("select * from sqlite_master where name='global_configuration'");
  if (rs.isValidRow()) {
      var s = rs.field(4);
      rs.close();
      if (s.indexOf('schema_version') == -1) {
	  bail(); return;
      }

      // check for schema version correctness
      var rs = db.execute("select schema_version from global_configuration");
      if (rs.isValidRow()) {
	  if (rs.field(0) != SCHEMA_VERSION) {
	      rs.close();
	      bail(); return;
	  }
      }
      rs.close();
  }

  db.execute('create table if not exists `client` (' +
             '`id` INTEGER PRIMARY KEY AUTOINCREMENT, ' +
      	     '`nom` varchar(50) NOT NULL, ' +
      	     '`prenom` varchar(50) NOT NULL, ' +
      	     '`ddn` date, ' +
      	     '`courriel` varchar(255), ' +
      	     '`adresse` varchar(255), ' +
      	     '`ville` varchar(50), ' +
      	     '`code_postal` varchar(10), ' +
      	     '`tel` varchar(20), ' +
      	     '`affiliation` varchar(20), ' +
      	     '`carte_anjou` varchar(20), ' +
      	     '`nom_recu_impot` varchar(255), ' +
      	     '`nom_contact_urgence` varchar(255), ' +
      	     '`tel_contact_urgence` varchar(255), ' +
	     '`sexe` char(1), ' + 
             '`nom_stripped` varchar(50), '+
             '`prenom_stripped` varchar(50), '+
      	     '`version` int(5) NOT NULL, ' +
      	     '`server_version` int(5) NOT NULL, ' +
      	     '`server_id` int(5) NOT NULL, ' +
      	     '`deleted` boolean ' +
      	     ')');
  db.execute('create table if not exists `grades` (' +
             '`client_id` INTEGER, ' +
             '`id` INTEGER PRIMARY KEY AUTOINCREMENT, ' +
             '`grade` varchar(10), '+
             '`date_grade` date' +
             ')');
  db.execute('create table if not exists `services` (' +
	     '`client_id` INTEGER, '+
	     '`id` INTEGER PRIMARY KEY AUTOINCREMENT, '+
	     '`date_inscription` date, '+
             '`saisons` char(10), '+
             '`sans_affiliation` boolean, '+
	     '`cours` varchar(3), '+
	     '`sessions` varchar(1), '+
	     '`passeport` boolean, '+
	     '`non_anjou` boolean, '+
	     '`judogi` varchar(10), '+
             '`escompte` varchar(3), '+
	     '`frais` varchar(10), '+
	     '`cas_special_note` varchar(50), '+
	     '`escompte_special` varchar(10), '+
	     '`horaire_special` varchar(50), ' +
	     '`verification` boolean' + 
             ')');
  rs.close();
  db.execute('create table if not exists `payment_groups` (' +
	     '`id` INTEGER PRIMARY KEY AUTOINCREMENT,' +
      	     '`version` int(5) NOT NULL, ' +
      	     '`server_version` int(5) NOT NULL, ' +
	     '`server_id` INTEGER)');
  db.execute('create table if not exists `deleted_payment_groups` (' +
	     '`id` INTEGER PRIMARY KEY AUTOINCREMENT,' +
	     '`server_id` INTEGER)');
  db.execute('create table if not exists `payment_group_members` (' +
	     '`group_id` INTEGER,' +
	     '`client_id` INTEGER)');
  db.execute('create table if not exists `payment` (' +
	     '`id` INTEGER PRIMARY KEY AUTOINCREMENT,' +
	     '`group_id` INTEGER,' +
	     '`client_id` INTEGER, '+
	     '`mode` INTEGER, '+
	     '`chqno` INTEGER, '+
	     '`date` DATE, '+
	     '`montant` char(10))');
  db.execute('create table if not exists `global_configuration` (' +
      	     '`version` int(5), ' +
      	     '`server_version` int(5), ' +
             '`schema_version` int(5), ' +
  	     '`nom_club` char(30), ' +
  	     '`numero_club` char(30), ' +
  	     '`age_masters` char(10), ' +
  	     '`frais_passeport_judoqc` char(10), ' +
  	     '`frais_nonresident_anjou` char(10), ' +
  	     '`date_versement_1` DATE, ' +
  	     '`date_versement_2` DATE, ' +
  	     '`date_versement_3` DATE, ' +
  	     '`date_versement_4` DATE, ' +
  	     '`date_versement_5` DATE, ' +
  	     '`date_versement_6` DATE)');
  db.execute('insert into `global_configuration` (version, server_version, schema_version) '+
  	       'SELECT 0,0,'+SCHEMA_VERSION+' WHERE NOT EXISTS '+
	         '(SELECT * FROM `global_configuration`)');
  db.execute('create table if not exists `session` (' +
	     '`id` INTEGER PRIMARY KEY AUTOINCREMENT,' +
             '`seqno` INTEGER,' + 
             '`name` char(15),' +
             '`year` char(4),' + /* calculated */
             '`abbrev` char(4),' +
	     '`first_class_date` DATE,' +
	     '`first_signup_date` DATE,' +
	     '`last_class_date` DATE,' +
	     '`last_signup_date` DATE)');
  db.execute('create table if not exists `cours` (' +
	     '`id` INTEGER PRIMARY KEY AUTOINCREMENT,' +
             '`seqno` INTEGER,' + 
	     '`name` varchar(60),'+
	     '`short_desc` varchar(20),'+
	     '`entraineur` varchar(30))');
  db.execute('create table if not exists `cours_session` (' +
	     '`id` INTEGER PRIMARY KEY AUTOINCREMENT,' +
             '`cours_seqno` INTEGER,' + 
             '`session_seqno` INTEGER)');
  db.execute('create table if not exists `categorie` (' +
	     '`id` INTEGER PRIMARY KEY AUTOINCREMENT,' +
	     '`name` varchar(25),' +
	     '`abbrev` char(6),' +
	     '`years_ago` INTEGER,' +
	     '`noire` boolean)');
  db.execute('create table if not exists `categorie_session` (' +
	     '`id` INTEGER PRIMARY KEY AUTOINCREMENT,' +
             '`session_seqno` INTEGER,' + 
	     '`categorie_abbrev` char(6),' +
             '`frais_1_session` char(10),' +
             '`frais_2_session` char(10),' +
             '`frais_judo_qc` char(10))');
  db.execute('create table if not exists `escompte` (' +
	     '`id` INTEGER PRIMARY KEY AUTOINCREMENT,' +
             '`seqno` INTEGER,' + 
	     '`name` varchar(25),' +
	     '`amount` char(6))');

}