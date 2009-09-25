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
    var id = getElementById('session_id').value;
    if (id != -1)
        db.execute('DELETE FROM `session` WHERE id=?', [id]);

    var r = [];
    for (s in SESSION_FIELDS) {
        var sf = SESSION_FIELDS[s];
        r[sf] = getElementById('session_'+sf).value;
    }

    if (r.id == -1 || r.id == '') r.id = null;
    r.year = '20' + r.abbrev.substr(1,2);
    if (r.abbrev.substr(0,1) == 'H') r.year--;
    db.execute('INSERT INTO `session` '+
                   'VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
              [r.id, r.seqno, r.name, r.year, r.abbrev,
               r.first_class_date, r.first_signup_date,
               r.last_class_date, r.last_signup_date]);
    db.execute('UPDATE `global_configuration` SET version=version+1');

    getElementById('session_id').value = db.lastInsertRowId;
    populateSessions();

    // move selectedIndex back to current
    var sessions = getElementById('sessionSelect');
    for (var i = 0; i < sessions.length; i++) {
	if (sessions[i].value == id)
	    sessions.selectedIndex = i;
    }
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