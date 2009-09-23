var store = new DataStore();
store.init();
populateSessions();
loadSession(CURRENT_SESSION);

function populateSessions() {
    var sessions = getElementById('sessionName');
    // clear existing sessions
    while (sessions.length > 0)
	sessions.remove(0);

    var rs = db.execute('SELECT name,id from `session`');
    while (rs.isValidRow()) {
	sessions.add(new Option(rs.field(0), rs.field(1)), null);
	rs.next();
    }
    rs.close();
}

function loadSession(s) {
    
}
