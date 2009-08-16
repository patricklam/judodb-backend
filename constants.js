// See also constants.php for another definition of GLOBAL_FIELDS.
var GLOBAL_FIELDS = ["nom", "prenom", "ddn", "courriel", "adresse", "ville", "code_postal", "tel", "affiliation", "carte_anjou", "nom_recu_impot", "nom_contact_urgence", "tel_contact_urgence", "RAMQ"];
var LOCAL_FIELDS = ["version", "server_version", "server_id"];
var ALL_FIELDS = LOCAL_FIELDS.concat(GLOBAL_FIELDS);

var SERVICE_FIELDS = ["date_inscription", "cours", "sessions",
                      "passeport", "non_anjou", "judogi",
                      "escompte", "frais", "cas_special_note",
                      "horaire_special"];

var STORE_NAME = "anjoudb";

/* All this stuff should eventually end up in the database. */

var SAISON = 2009;
var CATEGORY_NAMES = ["Mini-Poussin (U-7)", "Poussin (U-9)", "Benjamin (U-11)",
                      "Minime (U-13)", "Juvénile (U-15)", "Cadet (U-17)",
                      "Junior (U-20)", "Sénior", "Junior Noire", "Sénior Noire"];
var CATEGORY_YEARS = [SAISON-5, SAISON-7, SAISON-9, SAISON-11, SAISON-13,
                      SAISON-15, SAISON-18, 0];

var COURS = ["Adultes (LM2015-2145, V1930-2130)", 
             "Équipe compétition (LM1830-2015, V1930-2130)",
             "Intérmediares 7-12 ans (LM1730-1830, V1800-1930)",
             "Débutants 7-12 ans (MJ1730-1845)",
             "Débutants de 5 à 6 ans (S900-1000)",
             "Anciens de 6 à 7 ans (S1000-1130)",
             "Anciens de 7 à 9 ans (S1130-1300)",
             "Débutants de 7 à 12 ans (S1300-1430)",
             "Anciens de 7 à 12 ans (S1430-1600)",
             "Anciens de 5 à 6 ans (D930-1030)",
             "Anciens de 7 à 9 ans (D1030-1230)",
             "Filles 7-11"];

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

var CATEGORY_PRIX_1_SESSION = [100, 100, 115, 150, 185, 185, 185, 210, 135, 135];
var CATEGORY_PRIX_2_SESSION = [175, 175, 196, 225, 290, 290, 300, 345, 135, 135];
var CATEGORY_JUDO_QC = [10, 15, 25, 35, 45, 50, 60, 65, 90, 100];

var ESCOMPTE_NAMES = ["Aucun", "2e membre", "3e membre", "4e membre", "Nouvel(le) ami(e)"];
var ESCOMPTE_AMOUNTS = [0, 10, 15, 20, 10];

function categoryPrix1(i) { return CATEGORY_PRIX_1_SESSION[i]; }
function categoryPrix2(i) { return CATEGORY_PRIX_2_SESSION[i]; }
function categoryPrixJQ(i) { return CATEGORY_JUDO_QC[i]; }

