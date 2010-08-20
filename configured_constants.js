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
var CATEGORY_PRIX_1_SESSION = [], CATEGORY_PRIX_2_SESSION = [],
    CATEGORY_PRIX_JUDO_QC = [];

var AGE_MASTERS, CLUB, CLUBNO;
var SUGGESTED_PAIEMENTS = [];
var FRAIS_PASSEPORT_JUDO_QUEBEC, FRAIS_NON_ANJOU;

var ESCOMPTE_NAMES = [];
var ESCOMPTE_AMOUNTS = [];

var GRADE_ORDER = ["", "Bla", "B/J", "J", "J/O", "O", "O/V", "V", "V/B", "B", "B/M", "M", "1D", "2D", "3D", "4D", "5D", "6D", "7D", "8D"];

function initConfig() {
    initSession();
    initCours();
    initCategorie();
    initEscompte();
    initMisc();
}

function initSession() {
    var rs = db.execute("SELECT * FROM `session` WHERE "
			+ "session.first_signup_date <= date() AND "
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
    var rs = db.execute("SELECT * FROM `categorie` as c, `categorie_session` as cs WHERE c.abbrev = cs.categorie_abbrev"); // TODO: and session
    while (rs.isValidRow()) {
	CATEGORY_NAMES = CATEGORY_NAMES.concat(rs.fieldByName('name'));
	CATEGORY_ABBREVS = CATEGORY_ABBREVS.concat(rs.fieldByName('abbrev'));
	CATEGORY_NOIRE = CATEGORY_NOIRE.concat(rs.fieldByName('noire'));

	var sy = 0;
	if (rs.fieldByName('years_ago') != '')
	    sy = CURRENT_SESSION_YEAR - rs.fieldByName('years_ago') + 2;

	CATEGORY_YEARS = CATEGORY_YEARS.concat(sy);

	CATEGORY_PRIX_1_SESSION = CATEGORY_PRIX_1_SESSION.concat
	  (parseFloat(rs.fieldByName('frais_1_session')));
	CATEGORY_PRIX_2_SESSION = CATEGORY_PRIX_2_SESSION.concat
	  (parseFloat(rs.fieldByName('frais_2_session')));
	CATEGORY_PRIX_JUDO_QC = CATEGORY_PRIX_JUDO_QC.concat
	  (parseFloat(rs.fieldByName('frais_judo_qc')));

	rs.next();
    }
    rs.close();
}

function initEscompte() {
    var rs = db.execute("SELECT * FROM `escompte`");    
    while (rs.isValidRow()) {
	ESCOMPTE_NAMES = ESCOMPTE_NAMES.concat(rs.fieldByName('name'));
	ESCOMPTE_AMOUNTS = ESCOMPTE_AMOUNTS.concat(parseFloat(rs.fieldByName('amount')));
	rs.next();
    }
    rs.close();
}

function initMisc() {
    var rs = db.execute("SELECT * FROM `global_configuration`");
    AGE_MASTERS = rs.fieldByName('age_masters');
    CLUB = rs.fieldByName('nom_club');
    CLUBNO = rs.fieldByName('numero_club');
    for (var i = 0; i < MAX_VERSEMENTS; i++)
	SUGGESTED_PAIEMENTS = SUGGESTED_PAIEMENTS.concat
          (rs.fieldByName('date_versement_'+(i+1)));
    FRAIS_PASSEPORT_JUDO_QUEBEC = parseFloat(rs.fieldByName('frais_passeport_judoqc'));
    FRAIS_PAS_ANJOU = parseFloat(rs.fieldByName('frais_nonresident_anjou'));
    rs.close();
}

initConfig();

