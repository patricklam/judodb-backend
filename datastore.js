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
    db.execute('create table if not exists `grades` (' +
             '`client_id` INTEGER, ' +
             '`id` INTEGER PRIMARY KEY AUTOINCREMENT, ' +
             '`grade` varchar(10), '+
             '`date_grade` date' +
             ')');
    } catch (ex) {
      setError('Could not create database: ' + ex.message);
    }
  }
}

// overwrites the current entry for cid
function pullEntry(cid, sid) {
  function integrateEntry(status, statusText, responseText, responseXML) {
    if (status != '200') {
	setError('Problème de connexion: pullEntry.');
        setTimeout(clearStatus, 1000);
        return null;
    }

    var r = responseXML.childNodes[0].childNodes; // entry
    var rs = {}; rs['grade'] = []; rs['date_grade'] = [];
    for (i = 0; i < r.length; i++) {
        var key = r[i].nodeName;
	if (key == 'dateGrade') key = 'date_grade';

        if (key == 'grade' || key == 'date_grade') {
	    rs[key] = rs[key].concat(r[i].textContent);
	} else
  	    rs[key] = r[i].textContent;
    }
    rs.server_id = sid;
    rs.server_version = rs.version;
    storeOneClient(cid, rs);
  }

  doRequest("GET", "pull_one_client.php", {id: sid}, integrateEntry, null);
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
      if (status != '200') {
          setError('Problème de connexion: parseIds.');
          setTimeout(clearStatus, 1000);
          return null;
      }

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
  var rs = db.execute('SELECT * FROM `client` WHERE version > server_version');
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
    var makeHandler = function(sv, id) {
      var r = function(status, statusText, responseText, responseXML) {
        activeReqs--;
        if (status != '200') {
          setError('Problème de connexion: pushToServer.');
          setTimeout(clearStatus, 1000);
          return null;
        }

	    // we'll need to beef up responseText for conflict handling.
        var sidp = responseText.trim();
	db.execute
          ('UPDATE `client` SET server_id=?, server_version=? WHERE id=?',
	   [sidp, sv, id]);
    }; return r; };
    doRequest("POST", "push_one_client.php", null, 
              makeHandler(rs.fieldByName('version'), 
                          rs.fieldByName('id')), body);
    rs.next();
  }
  rs.close();

  function clearWhenDone() 
    { if (activeReqs == 0) clearStatus(); else setTimeout(clearWhenDone, 100); }
  setTimeout(clearWhenDone, 1000);
}

function storeOneClient(cid, rs) {
  db.execute('INSERT OR REPLACE INTO `client` ' +
             'VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?) ',
              [cid, rs.nom, rs.prenom, rs.ddn, rs.courriel,
              rs.adresse, rs.ville, rs.tel, rs.affiliation, rs.carte_anjou,
              rs.nom_recu_impot, 
              rs.nom_contact_urgence, rs.tel_contact_urgence, rs.RAMQ,
              rs.version, rs.server_version, rs.server_id]);

  var newCid = db.lastInsertRowId;

    // overwrite old grades information
  db.execute('DELETE FROM `grades` WHERE client_id = ?', [cid]);
  if (rs.grade.length > 0) {
    db.execute('INSERT INTO `grades` VALUES (?, ?, ?, ?)',
               [newCid, null, rs.grade[0], rs.date_grade[0]]);
  }
  return newCid;
}

DataStore.prototype.sync = function() {
  addStatus("un instant...");

  pullFromServer();
  pushToServer();
}