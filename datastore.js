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
      createTablesIfNeeded(db);
    } catch (ex) {
      setError('Could not create database: ' + ex.message);
    }
  }
};

// overwrites client's current entry for cid with server info
function pullClient(cid, sid) {
  function integrateClient(status, statusText, responseText, responseXML) {
    if (status != '200') {
	setError('Problème de connexion: pullClient ('+status+')');
        setTimeout(clearStatus, 1000);
        return;
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
    setTimer(function() { pullClient(cid, sid); }, 100);

  activeRequests++;
  doRequest("GET", "pull_one_client.php", {id: sid}, integrateClient, null);
  activeRequests--;
}

// overwrites client's current entry for gid with server info
function pullGroup(cid, sid) {
  function integrateGroup(status, statusText, responseText, responseXML) {
    if (status != '200') {
	setError('Problème de connexion: pullGroup ('+status+')');
        setTimeout(clearStatus, 1000);
        return;
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
	    // always update server version; update version if < than server_version
	    db.execute('UPDATE `payment_groups` SET '+
		       'server_version=? WHERE id=?', 
                       [val, newCid]);
	    db.execute('UPDATE `payment_groups` SET '+
		       'version=? WHERE id=? AND version < server_version', 
                       [val, newCid]);
	}
        else if (key == 'member_id') {
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

  db.execute('DELETE FROM `grades` WHERE client_id = ?', [newCid]);
  for (gg in rs.grade) {
    var gid = "grade_id" in rs ? null : rs.grade_id[gg];
    db.execute('INSERT INTO `grades` VALUES (?, ?, ?, ?)',
               [newCid, gid, rs.grade[gg], rs.date_grade[gg]]);
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

function storeOneSession(r) {
    if (r.id != -1 || r.seqno != -1)
        db.execute('DELETE FROM `session` WHERE id=? OR seqno=?', [r.id,r.seqno]);

    if (r.id == -1 || !('id' in r)) r.id = null;
    r.year = '20' + r.abbrev.substr(1,2);
    if (r.abbrev.substr(0,1) == 'H') r.year--;
    db.execute('INSERT INTO `session` '+
                   'VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
              [r.id, r.seqno, r.name, r.year, r.abbrev,
               r.first_class_date, r.first_signup_date,
               r.last_class_date, r.last_signup_date]);
}

/* precondition: seqno is not -1 and unique. */
function storeOneCours(r) {
    if (r.id != -1)
        db.execute('DELETE FROM `cours` WHERE id=?', [r.id]);
    db.execute('DELETE FROM `cours` WHERE seqno=?', [r.seqno]);
    db.execute('DELETE FROM `cours_session` WHERE cours_seqno=?', [r.seqno]);

    if (r.id == -1 || !('id' in r)) r.id = null;
    db.execute('INSERT INTO `cours` '+
                   'VALUES (?, ?, ?, ?, ?)',
              [r.id, r.seqno, r.name, r.short_desc, r.entraineur]);

    if (r.session.length > 0) {
	var sessions = r.session.split(' ');
	for (s in sessions) {
	    var sn = sessions[s];
	    db.execute('INSERT INTO `cours_session` '
		       + '(cours_seqno, session_seqno) VALUES (?, ?)', 
		       [r.seqno, sn]);
	}
    }
}

function storeOneCategorie(r) {
    if (r.id != -1)
        db.execute('DELETE FROM `categorie` WHERE id=?', [r.id]);

    if (r.id == -1 || !('id' in r)) r.id = null;
    db.execute('INSERT INTO `categorie` '+
                   'VALUES (?, ?, ?, ?, ?)',
              [r.id, r.name, r.abbrev, r.years_ago, r.noire]);
    return db.lastInsertRowId;
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
          return;
      }

      var t = responseXML.childNodes[0].childNodes; // table
      for (i = 0; i < t.length; i++) {
          if (t[i].nodeName == "del") {
	      var sid = t[i].textContent;
	      if (sid in localEntries)
		  deleteCallback(localEntries[sid].id);
	      continue;
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
  pullIndex('client', 'allids.php', pullClient, pullClient, deleteClient);
}

function pullGroups() {
  pullIndex('payment_groups', 'allgids.php', pullGroup, pullGroup, deleteGroup);
}

function pullGlobalConfig() {
  var rs = db.execute('SELECT version, server_version FROM `global_configuration`');
  var localv = rs.field(0), localsv = rs.field(1);
  rs.close();

  function updateGlobalConfig(status, statusText, responseText, responseXML) {
    var svers = parseInt(responseText);
    if (localsv < svers) {
      if (localv == localsv)
	actuallyPullGlobalConfig();
      else
	actuallyPullGlobalConfig(); // XXX merge
    }
  }

  doRequest("GET", 'global_config_version.php', null, updateGlobalConfig, null);
}

function actuallyPullGlobalConfig() {
    // overwrites client's global config with server info
  function integrateGlobalConfig(status, statusText, responseText, responseXML) {
    if (status != '200') {
	setError('Problème de connexion: pullGlobalConfig ('+status+')');
        setTimeout(clearStatus, 1000);
        return;
    }

    var r = responseXML.childNodes[0].childNodes; 

    function storeSubtree(s, f) {
	var obj = [];

	for (var j = 0; j < s.length; j++) {
		obj[s[j].nodeName] = s[j].textContent;
	}
	// assign new ID
	obj['id'] = -1;
	f(obj);	
    }

      // categorie has no seqno, so we must explicitly delete.
    db.execute('DELETE FROM `categorie`');
    for (var i = 0; i < r.length; i++) {
        var key = r[i].nodeName;
        if (key == 'session')
	    storeSubtree(r[i].childNodes, storeOneSession);
        if (key == 'cours')
	    storeSubtree(r[i].childNodes, storeOneCours);
        if (key == 'categorie')
	    storeSubtree(r[i].childNodes, storeOneCategorie);
	if (key == 'version')
	    db.execute('UPDATE global_configuration SET version=?, server_version=?', [r[i].textContent, r[i].textContent]);
    }
  }

  if (activeRequests >= MAX_REQUESTS)
    setTimer(actuallyPullGlobalConfig, 100);

  activeRequests++;
  doRequest("GET", "pull_one_global_config.php", {}, 
	    integrateGlobalConfig, null);
  activeRequests--;
}

function deleteClient(cid) {
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

function makeHandler(what, successCallback) {
    var q = function(sv, id, body, r) {
	return function(status, statusText, responseText, responseXML) {
            if (status != '200') {
		setError('Problème de connexion: push'+what+'.');
		setTimeout(clearStatus, 1000);
		return;
            }
	  
            var sidp = responseText.trim();
            if (sidp == '' || sidp.length > 20) {
		var retry = function(r) {
		    pushOne(what, q(sv, id, body, r-1), body);
		};
		if (r > 0)
  		    setTimeout(retry, 100);
	    } else {
		successCallback(sidp, sv, id);
            }
	};
    };
    return q;
}

function pushClients() {
    // pulling out my COMP302 skillz:
    // create a closure which binds sidp, sv, and id.
  var h = makeHandler('client', 
		     function(sidp, sv, id) {
  			 db.execute
			 ('UPDATE `client` SET server_id=?, server_version=? WHERE id=?',
  			  [sidp, sv, id]);
			 });

    // notify server about deleted clients, but wait to hear back about them
    // on next sync to actually remove them from local db.
  var ds = db.execute('SELECT * FROM `client` WHERE deleted=\'true\' AND version > server_version');
  while (ds.isValidRow()) {
    var cid = ds.fieldByName('id');

    // (unless they never existed on server side)
    if (ds.fieldByName('server_id') == '-1') {
	deleteClient(cid);
    } else {
	var body = "deleted=true";
	body += "&server_id="+ds.fieldByName('server_id');
	pushOne("client", h(ds.fieldByName('version'), cid, body, 3), body);
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
        body += "have_payment=true&";
	for (i in PAYMENT_FIELDS) {
            var fn = PAYMENT_FIELDS[i];
	    body += fn + "=" + r[fn].substring(1, r[fn].length) + "&";
	}
    } else body += "have_payment=false&";

    pushOne("client", h(rs.fieldByName('version'), cid, body, 3), body);
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
  var h = makeHandler('group', function(sidp, sv, id) {
  			  db.execute
			  ('UPDATE `payment_groups` SET server_id=?, version=?, server_version=? WHERE id=?',
  			   [sidp, sv, sv, id]);
		      });

  var ds = db.execute('SELECT * from `deleted_payment_groups`');
  while (ds.isValidRow()) {
    var cid = ds.fieldByName('id');
    var body = "deleted=true&version=0";
    body += "&server_id="+ds.fieldByName('server_id');
    pushOne("group", h(-1, cid, body, 3), body);
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
        ids += gs.field(0);
	gs.next();
        if (gs.isValidRow()) ids += ',';
    }
    gs.close();
    if (gotRowGS)
        body += "&id="+ids+"&";

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

    pushOne("group", h(rs.fieldByName('version'), cid, body, 3), body);
    rs.next();
  }
  rs.close();
}

function collectThing(t, f) {
    var r = [];
    var body = '';

    for (i in f)
	r[f[i]] = '';

    var ss = db.execute('SELECT * from `'+t+'`');
    while (ss.isValidRow()) {
	for (i in f) {
            var fn = f[i];
	    r[fn] = r[fn] + '|' + ss.fieldByName(fn);
	}
	ss.next();
    }
    ss.close();

    for (i in f) {
        var fn = f[i];
	body += t+'_'+fn + "=" + r[fn].substring(1, r[fn].length) +"&";
    }
    return body;
}

function collectCoursSessions() {
    var body = '';
    var rs = 
	db.execute('SELECT cours_seqno, session_seqno FROM `cours_session`');
    while (rs.isValidRow()) {
	body += '|' + rs.field(0) + ',' + rs.field(1);
	rs.next();
    }
    rs.close();
    return 'cours_session=' + body.substring(1, body.length);
}

function pushGlobalConfig() {
  var h = makeHandler('global_config',
		     function(sidp, sv, id) { 
  			 db.execute
			 ('UPDATE `global_configuration` SET version=?, server_version=?',
  			  [sv, sv]);
		     });

  var rs = db.execute('SELECT * FROM `global_configuration` '+
		        'WHERE version > server_version');
  var mustUpdateConfig = rs.isValidRow();

  var sv = -1;
  if (mustUpdateConfig)  
    sv = rs.fieldByName('version');

  rs.close();
  if (mustUpdateConfig) {
    var body = 'version='+sv + '&'; 
    body += collectThing('session', SESSION_FIELDS);
    body += collectThing('cours', COURS_FIELDS);
    body += collectThing('categorie', CATEGORIES_FIELDS);
    body += collectCoursSessions();
    pushOne("global_config", h(sv, null, body, 3), body);
  }
}

function isValidClient(n) {
  var nt = stripAccent(n.trim());
  var rs = db.execute('SELECT COUNT(*) FROM `client` WHERE deleted <> \'true\' AND (UPPER(prenom_stripped||" "||nom_stripped) = UPPER(?) OR UPPER(nom_stripped||" "||prenom_stripped) = UPPER(?))', [nt, nt]);
  var count = rs.field(0);
  rs.close();
  return count;
}

DataStore.prototype.sync = function(target) {
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
	  setTimeout(phase4, 1000);
      }
      else setTimeout(phase3, 100); 
  }

  function phase4() { 
      if (activeRequests == 0) {
	  clearStatus();
	  addStatus("un instant (syncronisation de la configuration)...");
	  pullGlobalConfig();
	  pushGlobalConfig();
	  setTimeout(clearWhenDone, 1000);
      }
      else setTimeout(phase4, 100); 
  }

  function clearWhenDone() { 
      if (activeRequests == 0) {
        initConfig();
        clearStatus(); 
	var rs = 
	      db.execute('SELECT COUNT(*) FROM `services` WHERE saisons LIKE ?', ['%'+CURRENT_SESSION+'%']);
	var inscr = rs.field(0); rs.close();

	  // we might be adding new people, so use >=
	if (inscr >= target) {
          addStatus("Syncronisé avec succès.");
          doRequest("POST", "update_last_sync.php", {didSync:1}, function (s,st,r,rx) {}, null);
	  setTimeout(updateLastSync, 100);
	}
	else
	  setError("Syncronisation incomplet: "+(inscr-target)+" inscriptions non syncronisés. Veuillez re-essayer.");
        setTimeout(clearStatus, 5000);
      }
      else setTimeout(clearWhenDone, 100); 
  }
};