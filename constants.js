var SAISON = 2009;
var CATEGORY_NAMES = ["Mini-Poussin (U-7)", "Poussin (U-9)", "Benjamin (U-11)",
                      "Minime (U-13)", "Juvénile (U-15)", "Cadet (U-17)",
                      "Junior (U-20)", "Sénior"]
var CATEGORY_YEARS = [SAISON-5, SAISON-7, SAISON-9, SAISON-11, SAISON-13,
                      SAISON-15, SAISON-18, 0]

function computeCategoryFromYear(yr) {
    for (var i = 0; i < CATEGORY_YEARS.length; i++) {
	if (yr >= CATEGORY_YEARS[i])
	    return CATEGORY_NAMES[i];
    }
}