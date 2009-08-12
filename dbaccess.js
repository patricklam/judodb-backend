function DataStore() {
}

// Open this page's local database.
DataStore.prototype.init = function() {
  if (window.google && google.gears) {
    try {
      db = google.gears.factory.create('beta.database');

      db.open('anjoudb');
      db.execute('create table if not exists `client` (' +
             '`id` INTEGER PRIMARY KEY AUTOINCREMENT, ' +
      	     '`saison` int(5) NOT NULL, ' +
      	     '`nom` varchar(50) NOT NULL, ' +
      	     '`prenom` varchar(50) NOT NULL, ' +
      	     '`ddn` date, ' +
      	     '`courriel` varchar(255), ' +
      	     '`adresse` varchar(255), ' +
      	     '`ville` varchar(50), ' +
      	     '`tel` varchar(20), ' +
      	     '`affiliation` varchar(20), ' +
      	     '`carte_anjou` varchar(20), ' +
      	     '`nom_recu_impot` varchar(255), ' +
      	     '`nom_contact_urgence` varchar(255), ' +
      	     '`tel_contact_urgence` varchar(255), ' +
      	     '`RAMQ` varchar(20), ' +
      	     '`version` int(5) NOT NULL, ' +
      	     '`server_version` int(5) NOT NULL ' +
      	     ')');
    } catch (ex) {
      setError('Could not create database: ' + ex.message);
    }
  }
}

DataStore.prototype.sync = function() {
  var rs = db.execute('SELECT * FROM `client` WHERE server_version != version');
  var index = 0;
  var conflicts = [];
  while (rs.isValidRow()) {
    rs.next();
  }
  rs.close();
}