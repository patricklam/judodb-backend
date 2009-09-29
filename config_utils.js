var store = new DataStore();
store.init();
populateSessions();
loadSessionID();
loadSession();

function populateSessions() {
    var sessions = getElementById('sessionSelect');
    // clear existing sessions
    while (sessions.length > 0)
        sessions.remove(0);

    var rs = db.execute('SELECT name,id from `session` ORDER BY seqno');
    while (rs.isValidRow()) {
        sessions.add(new Option(rs.field(0), rs.field(1)), null);
        rs.next();
    }
    rs.close();
}

function loadSessionID() {
    var ss = getElementById('sessionSelect');
    getElementById('session_id').value = ss[ss.selectedIndex].value;
}

function loadSession() {
    var id = getElementById('session_id').value;
    if (id == -1) {
	for (s in SESSION_FIELDS) {
            var sf = SESSION_FIELDS[s];
            getElementById('session_'+sf).value = '';
	}
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
    // check uniqueness of seqno
    var seqno = getElementById('session_seqno').value;
    var id = getElementById('session_id').value;

    var rs = db.execute('SELECT COUNT(seqno) FROM `session` WHERE seqno=? AND id <> ?', [seqno, id]);
    if (seqno == '' || rs.isValidRow() && rs.field(0) > 0) {
        setError('Erreur: seqno doit être defini et unique.');
	rs.close();
	return;
    }
    rs.close();

    clearStatus();

    var r = [];
    for (s in SESSION_FIELDS) {
        var sf = SESSION_FIELDS[s];
        r[sf] = getElementById('session_'+sf).value;
    }

    storeOneSession(r);
    bumpConfigurationVersion();

    rs = db.execute('SELECT id FROM `session` WHERE seqno=?', [seqno]);
    getElementById('session_id').value = rs.field(0);
    rs.close();
    populateSessions();

    // move selectedIndex back to current
    var sessions = getElementById('sessionSelect');
    for (var i = 0; i < sessions.length; i++) {
	if (sessions[i].value == id)
	    sessions.selectedIndex = i;
    }
}

function bumpConfigurationVersion() {
    db.execute('UPDATE `global_configuration` SET version=version+1');
    db.execute('INSERT INTO `global_configuration` VALUES (1,0)');
    db.execute('DELETE FROM `global_configuration` WHERE version < (SELECT MAX(version) FROM `global_configuration`)');
}

function newSession() {
    getElementById('session_id').value = -1;
    var sessions = getElementById('sessionSelect');
    sessions.add(new Option('', -1), null);
    sessions.selectedIndex = sessions.length-1;
    loadSession();
}

function rmSession() {
    var id = getElementById('session_id').value;
    if (id != -1)
        db.execute('DELETE FROM `session` WHERE id=?', [id]);
    populateSessions();
    loadSessionID();
    loadSession();
}