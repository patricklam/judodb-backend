var db;
var store = new DataStore();
store.init();

var CURRENT_SESSION; 
var CURRENT_SESSION_YEAR;
var CURRENT_SESSION_SEQNO;
var CURRENT_SESSION_FIRST_SIGNUP;
var NEXT_SESSION;

var COURS = [], COURS_SHORT = [], COURS_ENTRAINEURS = [];
var CATEGORY_NAMES = [], CATEGORY_YEARS = [], CATEGORY_ABBREVS = [],
    CATEGORY_NOIRE = [];

initConfig();
function initConfig() {
    initSession();
    initCours();
    initCategorie();
}

function initSession() {
    var rs = db.execute("SELECT * FROM `session` WHERE "
			+ "session.first_signup_date < date() AND "
			+ "session.last_signup_date > date()");
    if (!rs.isValidRow()) {
	setError('Aucun session en cours! Veuillez modifier la configuration.');
	return;
    }
    CURRENT_SESSION = rs.fieldByName('abbrev');
    CURRENT_SESSION_YEAR = parseInt(rs.fieldByName('year'));
    CURRENT_SESSION_SEQNO = rs.fieldByName('seqno');
    CURRENT_SESSION_FIRST_SIGNUP = rs.fieldByName('first_signup_date');
    rs.close();

    // next session
    rs = db.execute("SELECT abbrev FROM `session` WHERE "
		    + "session.seqno = ?", [CURRENT_SESSION_SEQNO + 1]);
    if (rs.isValidRow())
	NEXT_SESSION = rs.field(0);
    rs.close();
}

function initCours() {
    var rs = db.execute("SELECT * FROM `cours`, `cours_session` WHERE "
			+ "cours.seqno = cours_session.cours_seqno AND "
			+ "cours_session.session_seqno = ? "
			+ "ORDER BY seqno", 
		       [CURRENT_SESSION_SEQNO]);
    while (rs.isValidRow()) {
	COURS = COURS.concat(rs.fieldByName('name'));
	COURS_SHORT = COURS_SHORT.concat(rs.fieldByName('short_desc'));
	COURS_ENTRAINEURS = COURS_ENTRAINEURS.concat(rs.fieldByName('entraineur'));
	rs.next();
    }
    rs.close();
}

function initCategorie() {
    var rs = db.execute("SELECT * FROM `categorie`");    
    while (rs.isValidRow()) {
	CATEGORY_NAMES = CATEGORY_NAMES.concat(rs.fieldByName('name'));
	CATEGORY_ABBREVS = CATEGORY_ABBREVS.concat(rs.fieldByName('abbrev'));
	CATEGORY_NOIRE = CATEGORY_NOIRE.concat(rs.fieldByName('noire'));

	var sy = 0;
	if (rs.fieldByName('years_ago') != '')
	    sy = CURRENT_SESSION_YEAR - rs.fieldByName('years_ago') + 2;

	CATEGORY_YEARS = CATEGORY_YEARS.concat(sy);
	rs.next();
    }
    rs.close();
}

// not currently in db.
var AGE_MASTERS = 35;
var SUGGESTED_PAIEMENTS = ["", "2009-11-13", "2010-02-05", "", "", ""];

var FRAIS_PASSEPORT_JUDO_QUEBEC = 5;
var FRAIS_PAS_ANJOU = 5;

var CATEGORY_PRIX_1_SESSION = [100, 100, 115, 150, 185, 185, 185, 210, 140, 140];
var CATEGORY_PRIX_2_SESSION = [175, 175, 195, 225, 290, 290, 300, 345, 140, 140];
var CATEGORY_PRIX_JUDO_QC = [10, 15, 25, 35, 45, 50, 60, 65, 90, 100];

var ESCOMPTE_NAMES = ["Aucun", "2e membre", "3e membre", "4e membre", "Nouvel(le) ami(e)", "Membre du CA", "Cas spécial"];
var ESCOMPTE_AMOUNTS = [0, 10, 15, 20, 10, 50, -1];
