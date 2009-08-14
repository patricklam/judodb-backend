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
      	     '`server_version` int(5) NOT NULL, ' +
      	     '`server_id` int(5) NOT NULL ' +
      	     ')');
    } catch (ex) {
      setError('Could not create database: ' + ex.message);
    }
  }
}

// overwrites the current entry for cid
function pullEntry(cid, sid) {
  function integrateEntry(status, statusText, responseText, responseXML) {
    var r = responseXML.childNodes[0].childNodes; // entry
    var rs = {};
    for (i = 0; i < r.length; i++) {
        var key = r[i].nodeName;
	rs[key] = r[i].textContent;
    }
    rs.server_id = sid;
    storeOneClient(cid, rs);
  }

  doRequest("GET", "fetch_one_client.php", {id: sid}, integrateEntry, null);
}

function pullFromServer() {
  var rs = db.execute('SELECT id, version, server_id, server_version FROM `client`');
  // create array indexed by server_id
  var localEntries = []; var i = 0;
  while (rs.isValidRow()) {
    localEntries[rs.fieldByName('server_id')] = { 
          id:rs.fieldByName('id'),
	  version:rs.fieldByName('version'),
	  server_version:rs.fieldByName('server_version')
	};
    rs.next();
  }
  rs.close();

  function parseIds(status, statusText, responseText, responseXML) {
      var t = responseXML.childNodes[0].childNodes; // table
      for (i = 0; i < t.length; i++) {
          if (t[i].nodeName != "tr") continue;

	    var sid = t[i].childNodes[0].textContent;
	    var svers = t[i].childNodes[1].textContent;

            if (!(sid in localEntries))
              pullEntry(null, sid); // Can just pull, no merge needed.
	    else if (localEntries[sid].server_version < svers) {
              var cid = localEntries[sid].id;
            
              if (localEntries[sid].version == localEntries[sid].server_version)
		pullEntry(cid, sid); // This too.
              else
		pullEntry(cid, sid); // XXX merge! uh oh!
            }
	}
  }

  doRequest("GET", "allids.php", null, parseIds, null);
}

function pushToServer() {
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
        var r = function(status, statusText, responseText, responseXML) {
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
  clearWhenDone();
}

function storeOneClient(cid, rs) {
  db.execute('INSERT OR REPLACE INTO `client` ' +
             'VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?) ',
              [cid, rs.nom, rs.prenom, rs.ddn, rs.courriel,
              rs.adresse, rs.ville, rs.tel, rs.affiliation, rs.carte_anjou,
              rs.nom_recu_impot, 
              rs.nom_contact_urgence, rs.tel_contact_urgence, rs.RAMQ,
              rs.version, rs.server_version, rs.server_id]);
  return db.lastInsertRowId;
}

DataStore.prototype.sync = function() {
  addStatus("un instant...");

  pullFromServer();
  pushToServer();
}