// See also constants.php for another definition of GLOBAL_FIELDS.
var GLOBAL_FIELDS = ["nom", "prenom", "ddn", "courriel", "adresse", "ville", "tel", "affiliation", "carte_anjou", "nom_recu_impot", "nom_contact_urgence", "tel_contact_urgence", "RAMQ"];
var LOCAL_FIELDS = ["version", "server_version"];
var ALL_FIELDS = LOCAL_FIELDS.concat(GLOBAL_FIELDS);


/* All this stuff should eventually end up in the database. */

var SAISON = 2009;
var CATEGORY_NAMES = ["Mini-Poussin (U-7)", "Poussin (U-9)", "Benjamin (U-11)",
                      "Minime (U-13)", "Juvénile (U-15)", "Cadet (U-17)",
                      "Junior (U-20)", "Sénior"]
var CATEGORY_YEARS = [SAISON-5, SAISON-7, SAISON-9, SAISON-11, SAISON-13,
                      SAISON-15, SAISON-18, 0]

function computeCategoryId(yr) {
    var rv;
    for (var i = 0; i < CATEGORY_YEARS.length; i++) {
	if (yr >= CATEGORY_YEARS[i])
	    { rv = i; break; }
    }
    // if cn, set rv to category_years.length+1 (could be cadet or junior)
    if (i == CATEGORY_YEARS.length) {
	// and ceinture noire
	// then increase rv by one more
    }
    return rv;
}

function categoryName(i) { return CATEGORY_NAMES[i]; }

var FRAIS_PASSEPORT_JUDO_QUEBEC = 5;
var FRAIS_PAS_ANJOU = 5;

var CATEGORY_PRIX_1_SESSION = [100, 100, 115, 150, 185, 185, 185, 210, 135, 135];
var CATEGORY_PRIX_2_SESSION = [175, 175, 196, 225, 290, 290, 300, 345, 135, 135];
var CATEGORY_JUDO_QC = [10, 15, 25, 35, 45, 50, 60, 65, 90, 100];

var ESCOMPTE_NAMES = ["2e membre", "3e membre", "4e membre", "Nouvel(le) ami(e)"];
var ESCOMPTE_AMOUNTS = [10, 15, 20, 10];

function categoryPrix1(i) { return CATEGORY_PRIX_1_SESSION[i]; }
function categoryPrix2(i) { return CATEGORY_PRIX_2_SESSION[i]; }
function categoryPrixJQ(i) { return CATEGORY_JUDO_QC[i]; }

