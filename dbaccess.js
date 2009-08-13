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
  addStatus("un instant...");
  var rs = db.execute('SELECT * FROM `client` WHERE server_version <> version');
  var conflicts = [];
  var activeReqs = 0;
  while (rs.isValidRow()) {
    var body = "";
    var i;
    for (i = 0; i < ALL_FIELDS.length; i++) {
        var fn = ALL_FIELDS[i];
	body += fn + "=" + rs.fieldByName(fn)+"&";
    }
    activeReqs++;

      // pulling out my COMP302 skillz:
      // create a closure which binds id.
    var makeHandler = function(id) {
        var r = function(status, statusText, responseText) {
	activeReqs--;

	    // we'll need to beef up responseText for conflict handling.
        var newSV = responseText.trim();
	db.execute('UPDATE `client` SET server_version=? WHERE id=?',
		   [newSV, id]);
    }; return r; };
    doRequest("POST", "update.php", null, makeHandler(rs.fieldByName('id')), body);
    rs.next();
  }
  rs.close();
  function clearWhenDone() 
    { if (activeReqs == 0) clearStatus(); else setTimeout(clearWhenDone, 100); }
}