var VERSION = '090919b-beta2';

// See also constants.php for another definition of GLOBAL_FIELDS.
var GLOBAL_FIELDS = ["nom", "prenom", "ddn", "courriel", "adresse", "ville", "code_postal", "tel", "affiliation", "carte_anjou", "nom_recu_impot", "nom_contact_urgence", "tel_contact_urgence", "RAMQ", "nom_stripped", "prenom_stripped"];
var LOCAL_FIELDS = ["version", "server_version", "server_id", "deleted"];
var ALL_FIELDS = LOCAL_FIELDS.concat(GLOBAL_FIELDS);

var SERVICE_FIELDS = ["date_inscription", "saisons", "sans_affiliation", 
		      "cours", "sessions",
                      "passeport", "non_anjou", "judogi",
                      "escompte", "frais", "cas_special_note",
                      "escompte_special" , "horaire_special"];

var CHECKBOX_FIELDS = ['non_anjou', 'passeport', 'sans_affiliation'];
var SELECT_FIELDS = ['cours', 'sessions', 'escompte'];
var PAYMENT_FIELDS = ['mode', 'chqno', 'date', 'montant'];

var MULTI_FIELDS = [];
for (sf in SERVICE_FIELDS) {
    MULTI_FIELDS[SERVICE_FIELDS[sf]] = true;
}
for (pf in PAYMENT_FIELDS) {
    MULTI_FIELDS[PAYMENT_FIELDS[pf]] = true;
}
MULTI_FIELDS['grade'] = true;
MULTI_FIELDS['date_grade'] = true;

var STORE_NAME = "anjoudb";
var MAX_VERSEMENTS = 6;
var MAX_GRADES = 20;

/* All this stuff below should eventually end up in the database. */

var SAISON = 2009;
var CURRENT_SESSION="A09"; var NEXT_SESSION="H10";
var CATEGORY_NAMES = ["Mini-Poussin (U-7)", "Poussin (U-9)", "Benjamin (U-11)",
                      "Minime (U-13)", "Juvénile (U-15)", "Cadet (U-17)",
                      "Junior (U-20)", "Sénior", "Junior Noire", "Sénior Noire"];
var CATEGORY_YEARS = [SAISON-5, SAISON-7, SAISON-9, SAISON-11, SAISON-13,
                      SAISON-15, SAISON-18, 0];

var COURS = ["Adultes (LM2015-2145, V2000-2145)", 
             "Équipe compétition (LM1830-2015, V2000-2145)",
             "Intérmediares 7-12 ans (L1730-1830, V1830-2000)",
             "Débutants 7-12 ans (MaJ1730-1830)",
             "Débutants de 5 à 6 ans (S900-1000)",
             "Anciens de 5 à 6 ans (S1000-1100)",
             "Anciens de 7 à 8 ans (S1100-1230)",
             "Anciens de 7 à 9 ans (S1230-1400)",
             "Débutants de 7 à 9 ans (S1400-1530)",
             "Débutants de 7 à 8 ans (S1530-1700)",
             "Débutants de 5 à 6 ans (D900-1000)",
             "Débutants de 7 à 10 ans (D1030-1230)",
             "Débutants de 7 à 11 ans (MV1730-1830)",
             "Autre"];

var COURS_SHORT = ["LM2015 V2000", 
             "LM1830 V2000",
             "L1730 V1830",
             "MaJ1730",
             "S900",
             "S1000",
             "S1100",
             "S1230",
             "S1400",
             "S1530",
             "D900",
             "D1030",
             "MV1730",
             "?"];

var SUGGESTED_PAIEMENTS = ["", "2009-11-13", "2010-02-05", "", "", ""];

function computeCategoryId(yr, grade) {
    var rv;
    for (var i = 0; i < CATEGORY_YEARS.length; i++) {
	if (yr >= CATEGORY_YEARS[i])
	    { rv = i; break; }
    }

    var ndRegexp = /^\dD/;
    // if yudansha, increase rv (could be cadet or junior)
    if (grade.toUpperCase().indexOf('DAN') != -1 ||
        ndRegexp.test(grade))
        rv += 2;
    return rv;
}

function categoryName(i) { return CATEGORY_NAMES[i]; }

var FRAIS_PASSEPORT_JUDO_QUEBEC = 5;
var FRAIS_PAS_ANJOU = 5;

var CATEGORY_PRIX_1_SESSION = [100, 100, 115, 150, 185, 185, 185, 210, 140, 140];
var CATEGORY_PRIX_2_SESSION = [175, 175, 195, 225, 290, 290, 300, 345, 140, 140];
var CATEGORY_JUDO_QC = [10, 15, 25, 35, 45, 50, 60, 65, 90, 100];

var ESCOMPTE_NAMES = ["Aucun", "2e membre", "3e membre", "4e membre", "Nouvel(le) ami(e)", "Membre du CA", "Cas spécial"];
var ESCOMPTE_AMOUNTS = [0, 10, 15, 20, 10, 50, -1];

function categoryPrix1(i) { return CATEGORY_PRIX_1_SESSION[i]; }
function categoryPrix2(i) { return CATEGORY_PRIX_2_SESSION[i]; }
function categoryPrixJQ(i) { return CATEGORY_JUDO_QC[i]; }

var FIRST_2009_INSCRIPTION = '2009-08-28';
