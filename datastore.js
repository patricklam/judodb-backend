var activeRequests = 0; var MAX_REQUESTS = 2;

function DataStore() {
}

var db;

// Open this page's local database.
DataStore.prototype.init = function() {
  if (window.google && google.gears) {
    try {
      db = google.gears.factory.create('beta.database');
      if (!db) {
	  setError("Problème d'initialisation: est-ce que Google Gears est installé?");
          return;
      }

      db.open('anjoudb');
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
      	     '`RAMQ` varchar(20), ' +
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
	     '`horaire_special` varchar(50) '+
             ')');
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
    } catch (ex) {
      setError('Could not create database: ' + ex.message);
    }
  }
}

// overwrites client's current entry for cid with server info
function pullEntry(cid, sid) {
  function integrateEntry(status, statusText, responseText, responseXML) {
    if (status != '200') {
	setError('Problème de connexion: pullEntry ('+status+')');
        setTimeout(clearStatus, 1000);
        return null;
    }

    var r = responseXML.childNodes[0].childNodes; // entry
    var rs = {}; 
    for (f in MULTI_FIELDS) {
	rs[f] = [];
    }
    for (var i = 0; i < r.length; i++) {
        var key = r[i].nodeName;
        if (MULTI_FIELDS[key]) {
	    rs[key] = rs[key].concat(r[i].textContent);
	} else
  	    rs[key] = r[i].textContent;
    }
    rs.server_id = sid;
    rs.server_version = rs.version;
    rs.nom_stripped = stripAccent(rs.nom);
    rs.prenom_stripped = stripAccent(rs.prenom);
    rs.deleted = false;
    // paiement info -- pgm to be updated in group updates
    rs.pgm = [];

    rs.paiements = [];
    for (i = 0; i < rs[PAYMENT_FIELDS[0]].length; i++) {
	rs.paiements[i] = [];
	for (v in PAYMENT_FIELDS) {
	    var vf = PAYMENT_FIELDS[v];
	    rs.paiements[i][vf] = rs[vf][i];
	}
    }
    storeOneClient(cid, rs);
  }

  if (activeRequests >= MAX_REQUESTS)
    setTimer(function() { pullEntry(cid, sid); }, 100);

  activeRequests++;
  doRequest("GET", "pull_one_client.php", {id: sid}, integrateEntry, null);
  activeRequests--;
}

// overwrites client's current entry for gid with server info
function pullGroup(cid, sid) {
  function integrateGroup(status, statusText, responseText, responseXML) {
    if (status != '200') {
	setError('Problème de connexion: pullGroup ('+status+')');
        setTimeout(clearStatus, 1000);
        return null;
    }

    var r = responseXML.childNodes[0].childNodes; // group

    if (cid != null) {
	db.execute('DELETE FROM `payment_group_members` WHERE `group_id`=?',
		   [cid]);
	db.execute('DELETE FROM `payment` WHERE `group_id`=?',
		   [cid]);	
    }

    db.execute('INSERT OR REPLACE INTO `payment_groups`'+ 
               ' VALUES (?,-1,-1,?)', [cid, sid]);
    var newCid = db.lastInsertRowId;
    for (var i = 0; i < r.length; i++) {
        var key = r[i].nodeName;
	var val = r[i].textContent;
        if (key == 'version') { // arrives last now
	    db.execute('UPDATE `payment_groups` SET version=?, '+
		       'server_version=? WHERE id=?', 
                       [val, val, newCid]);
	}
        else if (key == 'client_id') {
	    db.execute('INSERT INTO `payment_group_members`'+
                       ' SELECT ?, id FROM `client` WHERE server_id=?', 
		       [newCid, val]);
	} else if (key == 'payment') {
	    var p = r[i].childNodes;
	    db.execute('INSERT INTO `payment` VALUES (?, ?, ?, ?, ?, ?, ?)',
		 [null, newCid, null, p[0].textContent, p[1].textContent,
		  p[2].textContent, p[3].textContent]);
	}
    }
  }

  if (activeRequests >= MAX_REQUESTS)
    setTimer(function() { pullGroup(cid, sid); }, 100);

  activeRequests++;
  doRequest("GET", "pull_one_group.php", {id: sid}, integrateGroup, null);
  activeRequests--;
}

// Both server and form create rs objects.
// Adds rs information to client db, trampling old cid information.
function storeOneClient(cid, rs) {
  db.execute('INSERT OR REPLACE INTO `client` ' +
             'VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,"false")',
              [cid, rs.nom, rs.prenom, rs.ddn, rs.courriel,
              rs.adresse, rs.ville, rs.code_postal,
              rs.tel, rs.affiliation, rs.carte_anjou,
              rs.nom_recu_impot, 
              rs.nom_contact_urgence, rs.tel_contact_urgence, rs.RAMQ,
	      rs.nom_stripped, rs.prenom_stripped,
              rs.version, rs.server_version, rs.server_id]);

  var newCid = db.lastInsertRowId;

    // XXX eventually write out the whole array
  db.execute('DELETE FROM `grades` WHERE client_id = ?', [newCid]);
  if (rs.grade != null && rs.grade.length > 0) {
    db.execute('INSERT INTO `grades` VALUES (?, ?, ?, ?)',
               [newCid, null, rs.grade[0], rs.date_grade[0]]);
  }

  db.execute('DELETE FROM `services` WHERE client_id = ?', [newCid]);
  if (rs.date_inscription != null && rs.date_inscription.length > 0)
    db.execute('INSERT INTO `services` ' +
               'VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?) ',
               [newCid, null, rs.date_inscription[0], 
                rs.saisons[0], rs.sans_affiliation[0],
                rs.cours[0], rs.sessions[0], rs.passeport[0], rs.non_anjou[0], 
    		rs.judogi[0], rs.escompte[0], rs.frais[0], 
                rs.cas_special_note[0], rs.escompte_special[0], rs.horaire_special[0]]);

  var gidCountRS = db.execute('SELECT COUNT(DISTINCT `group_id`) FROM `payment_group_members` WHERE client_id = ?', [newCid]);
  var count = gidCountRS.field(0);
  gidCountRS.close();

  if (count > 1 || rs.pgm.length < 2) {
    // > 1 group or nogroup: wipe out all payment groups containing cid
      var gids = db.execute('SELECT pgm.`group_id`, pg.server_id FROM `payment_group_members` as pgm, `payment_groups` AS pg WHERE pgm.client_id = ? AND pgm.group_id=pg.id', [newCid]);
      while (gids.isValidRow()) {
	  var gid = gids.field(0);

	  db.execute('DELETE FROM `payment_group_members` WHERE group_id = ?', [gid]);
	  db.execute('DELETE FROM `payment` WHERE client_id = ? OR group_id = ?', 
	     [newCid, gid]);
	  db.execute('DELETE FROM `payment_groups` WHERE id = ?', [gid]);

	  var sgid = gids.field(1);
	  if (sgid != -1)
	      db.execute('INSERT INTO `deleted_payment_groups` VALUES (?, ?)', 
			 [null, sgid]);
	  gids.next();
      }
      gids.close();
  }

  var gid = -1;
  if (count > 1 || count == 0) {
      if (rs.pgm.length > 1) {
	  db.execute('INSERT INTO `payment_groups` VALUES (?, ?, ?, ?)', [null, -1, -1, -1]);
	  gid = db.lastInsertRowId;
      } else gid = -1;
  }
  else {
      var gids = db.execute('SELECT `group_id` FROM `payment_group_members` WHERE client_id = ?', [newCid]);
      gid = gids.field(0);
      if (gid == null) gid = -1; // just wiped out
      gids.close();
  }

  if (gid != -1) {
      db.execute('DELETE FROM `payment_group_members` WHERE group_id = ?', 
		 [gid]);

      for (mi in rs.pgm) {
	  var m = rs.pgm[mi];
	  if (m == null) m = newCid;
	  db.execute('INSERT INTO `payment_group_members` VALUES (?, ?)',
		     [gid, m]);
      }
      db.execute('UPDATE `payment_groups` SET version=version+1 WHERE id=?', [gid]);
  }

  // payments
  if (gid != -1)
      db.execute('DELETE FROM `payment` WHERE group_id = ?', [gid]);

  db.execute('DELETE FROM `payment` WHERE client_id = ?', [newCid]);

  var effectiveCid = (gid == -1 || gid == null) ? newCid : -1;

  for (v in rs.paiements) {
      var rsv = rs.paiements[v];
      db.execute('INSERT INTO `payment` VALUES (?, ?, ?, ?, ?, ?, ?)',
		 [null, gid, effectiveCid, rsv.mode, rsv.chqno,
		 rsv.date, rsv.montant]);
  }

  return newCid;
}

function pullIndex(tableName, requestURL, pullOneCallback, mergeOneCallback, deleteCallback) {
  var rs = db.execute('SELECT id, version, server_id, server_version FROM `'+tableName+'`');
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
          if (t[i].nodeName == "del") {
	      var sid = t[i].textContent;
	      if (sid in localEntries)
		  deleteCallback(localEntries[sid].id);
	  }
          if (t[i].nodeName != "tr") continue;

	  var sid = t[i].childNodes[0].textContent;
	  var svers = t[i].childNodes[1].textContent;
	  
          if (!(sid in localEntries))
              pullOneCallback(null, sid); // Can just pull, no merge needed.
	  else if (localEntries[sid].server_version < svers) {
              var cid = localEntries[sid].id;
              
              if (localEntries[sid].version == localEntries[sid].server_version)
		  pullOneCallback(cid, sid); // This too.
              else
		  mergeOneCallback(cid, sid); // XXX merge! uh oh!
          }
      }
  }

  doRequest("GET", requestURL, null, parseIds, null);
}

function pullClients() {
  pullIndex('client', 'allids.php', pullEntry, pullEntry, deleteEntry);
}

function pullGroups() {
  pullIndex('payment_groups', 'allgids.php', pullGroup, pullGroup, deleteGroup);
}

function deleteEntry(cid) {
  db.execute('DELETE FROM `client` WHERE id=?', [cid]);
  db.execute('DELETE FROM `grades` WHERE client_id=?', [cid]);
  db.execute('DELETE FROM `services` WHERE client_id=?', [cid]);
  db.execute('DELETE FROM `payment_group_members` WHERE client_id=?', [cid]);
  db.execute('DELETE FROM `payment` WHERE client_id=?', [cid]);
}

function deleteGroup(cid) {
  db.execute('DELETE FROM `payment_groups` WHERE id=?', [cid]);
  db.execute('DELETE FROM `deleted_payment_groups` WHERE id=?', [cid]);
  db.execute('DELETE FROM `payment_group_members` WHERE group_id=?', [cid]);
  db.execute('DELETE FROM `payment` WHERE group_id=?', [cid]);
}

function pushClients() {
    // pulling out my COMP302 skillz:
    // create a closure which binds sv+id.
  var makeHandler = function(sv, id, body, r) {
      var r = function(status, statusText, responseText, responseXML) {
          if (status != '200') {
              setError('Problème de connexion:pushToServer.');
              setTimeout(clearStatus, 1000);
              return null;
          }
	  
          var sidp = responseText.trim();
          if (sidp == '' || sidp.length > 20) {
              var retry = function(r) {
		  pushOneEntry(makeHandler(sv, id, body, r-1), body);
	      }
              if (r > 0)
  		  setTimeout(retry, 100);
	  } else {
  	      db.execute
              ('UPDATE `client` SET server_id=?, server_version=? WHERE id=?',
  	       [sidp, sv, id]);
          }
      }; return r; };

    // notify server about deleted clients, but wait to hear back about them
    // on next sync to actually remove them from local db.
  var ds = db.execute('SELECT * FROM `client` WHERE deleted=\'true\' AND version > server_version');
  while (ds.isValidRow()) {
    var cid = ds.fieldByName('id');

    // (unless they never existed on server side)
    if (ds.fieldByName('server_id') == '-1') {
	deleteEntry(cid);
    } else {
	var body = "deleted=true";
	body += "&server_id="+ds.fieldByName('server_id');
	pushOne("client", makeHandler(ds.fieldByName('version'), cid, body, 3), body);
    }
    ds.next();
  }
  ds.close();

  var rs = db.execute('SELECT * FROM `client` WHERE deleted <> \'true\' AND version > server_version');
  while (rs.isValidRow()) {
    var cid = rs.fieldByName('id');
    var body = "";

    // populate client info
    var i;

    for (i in ALL_FIELDS) {
        var fn = ALL_FIELDS[i];
	body += fn + "=" + rs.fieldByName(fn)+"&";
    }

    // populate grade info

    var grades = ['grade', 'date_grade'];
    var gs = db.execute('SELECT * FROM `grades` WHERE client_id=?', [cid]);
    var grade = ''; var date_grade = '';

    var gotRowGS = gs.isValidRow();
    while (gs.isValidRow()) {
        grade = grade + ',' + gs.fieldByName('grade');
        date_grade = date_grade + ',' + gs.fieldByName('date_grade');
	gs.next();
    }
    gs.close();
    if (gotRowGS)
        body += "grade="+grade.substring(1, grade.length)+
                "&date_grade="+date_grade.substring(1, date_grade.length)+"&";

    var r = {};
    for (i in SERVICE_FIELDS)
	r[SERVICE_FIELDS[i]] = '';

    var ss = db.execute('SELECT * from `services` WHERE client_id=?', [cid]);
    var gotRowSS = ss.isValidRow();
    while (ss.isValidRow()) {
        for (i in SERVICE_FIELDS) {
            var fn = SERVICE_FIELDS[i];
	    r[fn] = r[fn] + ',' + ss.fieldByName(fn);
	}
	ss.next();
    }
    ss.close();
    if (gotRowSS) {
	for (i in SERVICE_FIELDS) {
            var fn = SERVICE_FIELDS[i];
	    body += fn + "=" + r[fn].substring(1, r[fn].length) +"&";
	}
    }

    for (i in PAYMENT_FIELDS)
	r[PAYMENT_FIELDS[i]] = '';
    var ps = db.execute('SELECT * from `payment` WHERE client_id=?', [cid]);
    var gotRowPS = ps.isValidRow();
    while (ps.isValidRow()) {
        for (i in PAYMENT_FIELDS) {
            var fn = PAYMENT_FIELDS[i];
	    r[fn] = r[fn] + ',' + ps.fieldByName(fn);
	}
	ps.next();
    }
    ps.close();
    if (gotRowPS) {
	for (i in PAYMENT_FIELDS) {
            var fn = PAYMENT_FIELDS[i];
	    body += fn + "=" + r[fn].substring(1, r[fn].length) +"&";
	}
    }

    pushOne("client", makeHandler(rs.fieldByName('version'), cid, body, 3), body);
    rs.next();
  }
  rs.close();
}

function pushOne(what, handler, body) {
  if (activeRequests >= MAX_REQUESTS)
    setTimer(function() { pushOneEntry(handler, body); }, 100);

  activeRequests++;
  doRequest("POST", "push_one_"+what+".php", null, handler, body);
  activeRequests--;
}

function pushGroups() {
  var makeHandler = function(sv, id, body, r) {
      var r = function(status, statusText, responseText, responseXML) {
          if (status != '200') {
              setError('Problème de connexion: pushGroups.');
              setTimeout(clearStatus, 1000);
              return null;
          }
	  
          var sidp = responseText.trim();
          if (sidp == '' || sidp.length > 20) {
              var retry = function(r) {
		  pushOne("group", makeHandler(sv, id, body, r-1), body);
	      }
              if (r > 0)
  		  setTimeout(retry, 100);
	  } else {
  	      db.execute
              ('UPDATE `payment_groups` SET server_id=?, server_version=? WHERE id=?',
  	       [sidp, sv, id]);
          }
      }; return r; };

  var ds = db.execute('SELECT * from `deleted_payment_groups`');
  while (ds.isValidRow()) {
    var cid = ds.fieldByName('id');
    var body = "deleted=true";
    body += "&server_id="+ds.fieldByName('server_id');
    pushOne("group", makeHandler(-1, cid, body, 3), body);
    ds.next();
  }
  ds.close();

  var rs = db.execute('SELECT * FROM `payment_groups` WHERE version > server_version');
  while (rs.isValidRow()) {
    var cid = rs.fieldByName('id');
    var body = "server_id="+rs.fieldByName('server_id') + 
	       "&version="+rs.fieldByName('version');

    var gs = db.execute('SELECT c.server_id FROM `payment_group_members` AS pgm, `client` as c WHERE group_id=? AND pgm.client_id=c.id', [cid]);

    var gotRowGS = gs.isValidRow();
    var ids = '';
    while (gs.isValidRow()) {
        ids = gs.field(0);
	gs.next();
        if (gs.isValidRow()) ids += ',';
    }
    gs.close();
    if (gotRowGS)
        body += "&id="+ids;

    var r = [];
    for (i in PAYMENT_FIELDS)
	r[PAYMENT_FIELDS[i]] = '';
    var ps = db.execute('SELECT * from `payment` WHERE group_id=?', [cid]);
    var gotRowPS = ps.isValidRow();
    while (ps.isValidRow()) {
        for (i in PAYMENT_FIELDS) {
            var fn = PAYMENT_FIELDS[i];
	    r[fn] = r[fn] + ',' + ps.fieldByName(fn);
	}
	ps.next();
    }
    ps.close();
    if (gotRowPS) {
	for (i in PAYMENT_FIELDS) {
            var fn = PAYMENT_FIELDS[i];
	    body += fn + "=" + r[fn].substring(1, r[fn].length) +"&";
	}
    }

    pushOne("group", makeHandler(rs.fieldByName('version'), cid, body, 3), body);
    rs.next();
  }
  rs.close();
}

function isValidClient(n) {
  var nt = stripAccent(n.trim());
  var rs = db.execute('SELECT COUNT(*) FROM `client` WHERE deleted <> \'true\' AND (UPPER(prenom_stripped||" "||nom_stripped) = UPPER(?) OR UPPER(nom_stripped||" "||prenom_stripped) = UPPER(?))', [nt, nt]);
  var count = rs.field(0);
  rs.close();
  return count;
}

DataStore.prototype.sync = function() {
  addStatus("un instant (lecture des clients)...");

  pullClients();
  setTimeout(phase2, 100);

  function phase2() { 
      if (activeRequests == 0) {
	  clearStatus();
	  addStatus("un instant (écriture des clients)...");
	  pushClients();
	  setTimeout(phase3, 100);
      }
      else setTimeout(phase2, 100); 
  }

  function phase3() { 
      if (activeRequests == 0) {
	  clearStatus();
	  addStatus("un instant (syncronisation des groupes)...");
	  pullGroups();
	  pushGroups();
	  setTimeout(clearWhenDone, 1000);
      }
      else setTimeout(phase3, 100); 
  }

  function clearWhenDone() { 
      if (activeRequests == 0) {
        clearStatus(); 
	addStatus("Syncronisé avec succès.");    
        doRequest("POST", "update_last_sync.php", {didSync:1}, function (s,st,r,rx) {}, null);
        setTimeout(clearStatus, 1000);
      }
      else setTimeout(clearWhenDone, 100); 
  }
}