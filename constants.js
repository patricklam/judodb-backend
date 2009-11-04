var VERSION = '091102-beta4';

// See also constants.php for another definition of GLOBAL_FIELDS.
var GLOBAL_FIELDS = ["nom", "prenom", "ddn", "courriel", "adresse", "ville", "code_postal", "tel", "affiliation", "carte_anjou", "nom_recu_impot", "nom_contact_urgence", "tel_contact_urgence", "RAMQ", "nom_stripped", "prenom_stripped"];
var LOCAL_FIELDS = ["version", "server_version", "server_id", "deleted"];
var ALL_FIELDS = LOCAL_FIELDS.concat(GLOBAL_FIELDS);

var SERVICE_FIELDS = ["date_inscription", "saisons", "sans_affiliation", 
		      "cours", "sessions",
                      "passeport", "non_anjou", "judogi",
                      "escompte", "frais", "cas_special_note",
                      "escompte_special" , "horaire_special", "verification"];

var CHECKBOX_FIELDS = ['non_anjou', 'passeport', 'sans_affiliation', 'verification'];
var SELECT_FIELDS = ['cours', 'sessions', 'escompte'];
var PAYMENT_FIELDS = ['mode', 'chqno', 'date', 'montant'];

var MULTI_FIELDS = [];
for (sf in SERVICE_FIELDS) {
    MULTI_FIELDS[SERVICE_FIELDS[sf]] = true;
}
for (pf in PAYMENT_FIELDS) {
    MULTI_FIELDS[PAYMENT_FIELDS[pf]] = true;
}
MULTI_FIELDS['grade_id'] = true;
MULTI_FIELDS['grade'] = true;
MULTI_FIELDS['date_grade'] = true;

var SESSION_FIELDS = ['id', 'seqno', 'name', 'year', 'abbrev',
		     'first_class_date', 'first_signup_date',
		     'last_class_date', 'last_signup_date'];
var COURS_FIELDS = ['id', 'seqno', 'name', 'short_desc', 'entraineur'];
var CATEGORIES_FIELDS = ['id', 'name', 'abbrev', 'years_ago', 'noire'];
var CATEGORIE_SESSION_FIELDS = ['id',
				'frais_1_session', 'frais_2_session',
				'frais_judo_qc'];
var MISC_FIELDS = ['version', 'server_version', 'nom_club', 'numero_club', 
		   'age_masters',
		   'frais_passeport_judoqc', 'frais_nonresident_anjou',
		   'date_versement_1', 'date_versement_2', 
		   'date_versement_3', 'date_versement_4',
		   'date_versement_5', 'date_versement_6'];
var ESCOMPTE_FIELDS = ['id', 'seqno', 'name', 'amount'];

var MAX_VERSEMENTS = 6;
var MAX_GRADES = 20;

var UNSET_DATE = '2009-01-01';