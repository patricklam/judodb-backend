var store = new DataStore();
store.init();

function bumpConfigurationVersion() {
    db.execute('UPDATE `global_configuration` SET version=version+1');
    db.execute('INSERT INTO `global_configuration` VALUES (1,0, "", "", 0, 0, 0, "", "", "", "", "", "")');
    db.execute('DELETE FROM `global_configuration` WHERE version < (SELECT MAX(version) FROM `global_configuration`)');
    loadMisc();
}

if (location.hash)
    selectTab(location.hash.substring(1, location.hash.length));

/**** nav stuff ****/

function selectTab(t) {
    var te = getElementById('tab_' + t);
    for (var tc in te.parentNode.childNodes) {
	var sib = te.parentNode.childNodes[tc];
	sib.className = '';

	if (typeof(sib) == 'object' && 'id' in sib) {
	    var si = sib.id;
	    var st = getElementById(si.substring(4, si.length));
	    st.style.display = 'none';
	}
    }
    te.className += 'selected';
    var tt = getElementById(t);
    tt.style.display = '';
}

/**** generic stuff ****/
function loadIDFromSelect(t) {
    var ss = getElementById(t+'Select');
    if (ss.selectedIndex in ss.options) 
	getElementById(t+'_id').value = ss[ss.selectedIndex].value;
    else
	getElementById(t+'_id').value = -1;
}

function loadIDFromSeqNo(t) {
    var seqno = getElementById(t+'_seqno').value;
    var rs = db.execute('SELECT id FROM `'+t+'` WHERE seqno=?', [seqno]);
    getElementById(t+'_id').value = rs.field(0);
    rs.close();
}

function adjustSelectorToID(t) {
    // move selectedIndex back to t_id
    var things = getElementById(t+'Select');
    var id = getElementById(t+'_id').value;
    for (var i = 0; i < things.length; i++) {
	if (things[i].value == id)
	    things.selectedIndex = i;
    }
}

function haveUniqueSeqNo(t) {
    var seqno = getElementById(t+'_seqno').value;
    var id = getElementById(t+'_id').value;
    var rs = db.execute('SELECT COUNT(seqno) FROM `'+t+'` WHERE seqno=? AND id <> ?', [seqno, id]);
    var rv = !(seqno == '' || seqno == '-1' || rs.isValidRow() && rs.field(0) > 0);
    rs.close();
    return rv;
}

function populateSelect(t, src, order) {
    if (src === undefined) src = t;
    if (order === undefined) order = 'seqno';
    var things = getElementById(t+'Select');
    // clear existing things
    while (things.length > 0)
        things.remove(0);

    var rs = db.execute('SELECT name,id from `'+src+'` ORDER BY '+order);
    while (rs.isValidRow()) {
        things.add(new Option(rs.field(0), rs.field(1)), null);
        rs.next();
    }
    rs.close();
}

function newThing(t) {
    getElementById(t+'_id').value = -1;
    var things = getElementById(t+'Select');
    things.add(new Option('', -1), null);
    things.selectedIndex = things.length-1;
}

function rmThing(t) {
    var id = getElementById(t+'_id').value;
    if (id != -1)
        db.execute('DELETE FROM `'+t+'` WHERE id=?', [id]);
    populateSelect(t);
    loadIDFromSelect('session');
}

/**** sessions stuff ****/
populateSelect('session');
loadIDFromSelect('session');
loadSession();

function loadSession() {
    var id = getElementById('session_id').value;
    if (id == -1) {
	for (s in SESSION_FIELDS) {
            var sf = SESSION_FIELDS[s];
            getElementById('session_'+sf).value = '';
	}
	getElementById('session_id').value = -1;
	return;
    }
    var rs = db.execute('SELECT * from `session` where id=?', [id]);

    for (s in SESSION_FIELDS) {
        var sf = SESSION_FIELDS[s];
        getElementById('session_'+sf).value = rs.fieldByName(sf);
    }
    rs.close();
}

function saveSession() {
    if (!haveUniqueSeqNo('session')) {
        setError('Erreur: seqno doit être defini et unique.');
	return;
    }
    clearStatus();

    var r = [];
    for (s in SESSION_FIELDS) {
        var sf = SESSION_FIELDS[s];
        r[sf] = getElementById('session_'+sf).value;
    }

    storeOneSession(r);
    bumpConfigurationVersion();

    loadIDFromSeqNo('session');
    populateSelect('session');
    adjustSelectorToID('session');
    initConfig();
}

/**** cours stuff ****/
populateSelect('cours');
loadIDFromSelect('cours');
loadCours();

function loadCours() {
    var id = getElementById('cours_id').value;
    if (id == -1) {
	for (s in COURS_FIELDS) {
            var sf = COURS_FIELDS[s];
            getElementById('cours_'+sf).value = '';
	}
	getElementById('cours_id').value = -1;
	getElementById('cours_session').value = '';
	return;
    }
    var rs = db.execute('SELECT * FROM `cours` WHERE id=?', [id]);

    for (s in COURS_FIELDS) {
        var sf = COURS_FIELDS[s];
        getElementById('cours_'+sf).value = rs.fieldByName(sf);
    }
    rs.close();
    var seqno = getElementById('cours_seqno').value;
    var t = '';

    rs = db.execute('SELECT abbrev FROM `session`, `cours_session` WHERE cours_seqno=? AND session.seqno = cours_session.session_seqno ORDER BY session.seqno',
		   [seqno]);
    while (rs.isValidRow()) {
	t += rs.field(0);
	rs.next();
	if (rs.isValidRow()) t += ' ';
    }
    getElementById('cours_session').value = t;
    rs.close();
}

function saveCours() {
    if (!haveUniqueSeqNo('cours')) {
        setError('Erreur: seqno doit être defini et unique.');
	return;
    }
    clearStatus();

    var r = [];
    for (s in COURS_FIELDS) {
        var sf = COURS_FIELDS[s];
        r[sf] = getElementById('cours_'+sf).value;
    }
    // session is not part of COURS_FIELDS but storeOneCours also stores it.
    var sessions = getElementById('cours_session').value.split(' ');
    var ns = '';
    for (s in sessions) {
	var sn = sessions[s];
	var rs = 
	    db.execute('SELECT seqno FROM `session` WHERE abbrev=?', [sn]);
	ns += ' ' + rs.field(0);
	rs.close();
    }
    r['session'] = ns.substring(1, ns.length);

    storeOneCours(r);
    bumpConfigurationVersion();

    loadIDFromSeqNo('cours');
    populateSelect('cours');
    adjustSelectorToID('cours');
    initConfig();
}

/**** categorie stuff ****/
populateSelect('categorie', 'categorie', 'years_ago');
populateSelect('fraisSession', 'session');
loadIDFromSelect('categorie');
loadCategorie();

function loadCategorie() {
    var id = getElementById('categorie_id').value;
    if (id == -1) {
	for (c in CATEGORIES_FIELDS) {
            var cf = CATEGORIES_FIELDS[c];
            getElementById('categorie_'+cf).value = '';
	}
	getElementById('categorie_id').value = -1;
        getElementById('categorie_noire').checked = false;
	adjustYALabel();
	return;
    }
    var rs = db.execute('SELECT * from `categorie` where id=?', [id]);

    for (s in CATEGORIES_FIELDS) {
        var sf = CATEGORIES_FIELDS[s];
        getElementById('categorie_'+sf).value = rs.fieldByName(sf);
    }
    if (getElementById('categorie_noire').value == 1 || getElementById('categorie_noire').value == 'true') 
      getElementById('categorie_noire').checked = true;
    else
      getElementById('categorie_noire').checked = false;

    rs.close();
    adjustYALabel();

    var abbr = getElementById('categorie_abbrev').value;
    var fsi = getElementById('fraisSessionSelect').value;
    var rs = db.execute('SELECT seqno FROM `session` WHERE id=?', [fsi]);
    var sseq = rs.field(0);
    rs.close();
    rs = db.execute('SELECT * from `categorie_session` WHERE categorie_abbrev=? AND session_seqno=?', [abbr, sseq]);
    if (rs.isValidRow()) {
	for (s in CATEGORIE_SESSION_FIELDS) {
            var sf = CATEGORIE_SESSION_FIELDS[s];
            getElementById('categorie_sess_'+sf).value = rs.fieldByName(sf);
	}
    } else {
	for (s in CATEGORIE_SESSION_FIELDS) {
            var sf = CATEGORIE_SESSION_FIELDS[s];
            getElementById('categorie_sess_'+sf).value = '';
	}
	getElementById('categorie_sess_id').value = -1;
    }
    rs.close();
}

function saveCategorie() {
    var r = [];
    for (s in CATEGORIES_FIELDS) {
        var sf = CATEGORIES_FIELDS[s];
        r[sf] = getElementById('categorie_'+sf).value;
    }
    for (s in CATEGORIE_SESSION_FIELDS) {
        var sf = CATEGORIE_SESSION_FIELDS[s];
        r['cs_'+sf] = getElementById('categorie_sess_'+sf).value;
    }
    r['cs_categorie_abbrev'] = r['abbrev'];

    var fsi = getElementById('fraisSessionSelect').value;
    var rs = db.execute('SELECT seqno FROM `session` WHERE id=?', [fsi]);
    r['cs_session_seqno'] = rs.field(0);
    rs.close();

    r['noire'] = getElementById('categorie_noire').checked;

    var rv = storeOneCategorie(r);
    getElementById('categorie_id').value = rv.c;
    getElementById('categorie_sess_id').value = rv.cs;
    bumpConfigurationVersion();

    populateSelect('categorie', 'categorie', 'years_ago');
    populateSelect('fraisSession', 'session');
    adjustSelectorToID('categorie');
    initConfig();
}

var origYALabel;
function adjustYALabel() {
    var ya = getElementById('categorie_years_ago');

    if (origYALabel === undefined) 
	origYALabel = ya.parentNode.firstChild.textContent;
    var q = ya.parentNode.firstChild;
    q.textContent = origYALabel;
    if (ya.value != '')
	q.textContent += ' (→ né en '+ (CURRENT_SESSION_YEAR+2-ya.value) +' et après)';
}

/**** escompte stuff ****/
populateSelect('escompte');
loadIDFromSelect('escompte');
loadEscompte();

function loadEscompte() {
    var id = getElementById('escompte_id').value;
    if (id == -1) {
	for (s in ESCOMPTE_FIELDS) {
            var sf = ESCOMPTE_FIELDS[s];
            getElementById('escompte_'+sf).value = '';
	}
	getElementById('escompte_id').value = -1;
	return;
    }
    var rs = db.execute('SELECT * from `escompte` where id=?', [id]);

    for (s in ESCOMPTE_FIELDS) {
        var sf = ESCOMPTE_FIELDS[s];
        getElementById('escompte_'+sf).value = rs.fieldByName(sf);
    }
    rs.close();
}

function saveEscompte() {
    if (!haveUniqueSeqNo('escompte')) {
        setError('Erreur: seqno doit être defini et unique.');
	return;
    }
    clearStatus();

    var r = [];
    for (s in ESCOMPTE_FIELDS) {
        var sf = ESCOMPTE_FIELDS[s];
        r[sf] = getElementById('escompte_'+sf).value;
    }

    storeOneEscompte(r);
    bumpConfigurationVersion();

    loadIDFromSeqNo('escompte');
    populateSelect('escompte');
    adjustSelectorToID('escompte');
    initConfig();
}

/**** user stuff ****/
loadUser();

function loadUser() {
  doRequest("GET", "user.php", null, populateUser_, null);

  function populateUser_(status, statusText, responseText, responseXML) {
    if (status == '200' && responseXML != null) {
	var resultTab = document.createElement('tbody');

	var t = responseXML.childNodes[0].childNodes; // table
	for (i = 0; i < t.length; i++) {
	    var row = document.createElement("tr");
            if (t[i].nodeName != "tr") continue;
	    
	    for (j = 1; j < 4; j++) 
		addNode(t[i].childNodes[j].textContent, row);
	    resultTab.appendChild(row);
	}
	getElementById('usertable').appendChild(resultTab);
    }
  }
}

function addNode(t, row) {
    var c = document.createElement("td");
    c.style.paddingRight = "1em";
    c.appendChild(document.createTextNode(t));
    row.appendChild(c);
}

/**** misc stuff ****/
loadMisc();

function loadMisc() {
    var rs = db.execute('SELECT * from `global_configuration`');

    for (m in MISC_FIELDS) {
        var mf = MISC_FIELDS[m];
        getElementById(mf).value = rs.fieldByName(mf);
    }

    rs.close();
}

function saveMisc() {
    clearStatus();
    getElementById('version').value++;

    var r = [];
    for (m in MISC_FIELDS) {
        var mf = MISC_FIELDS[m];
        r[mf] = getElementById(mf).value;
    }

    storeMisc(r);

    populateSelect('escompte');
    adjustSelectorToID('escompte');
    initConfig();
}

