<?
// See also constants.js for another definition of GLOBAL_FIELDS.
$GLOBAL_FIELDS = array("nom", "prenom", "ddn", "courriel", "adresse", "ville", "code_postal", "tel", "affiliation", "carte_anjou", "nom_recu_impot", "nom_contact_urgence", "tel_contact_urgence", "RAMQ");
$ALL_FIELDS = $GLOBAL_FIELDS;
array_push($ALL_FIELDS, "version");
$GRADES_FIELDS = array("date_grade", "grade");
$SERVICE_FIELDS = array("date_inscription", "cours", "sessions", "passeport", "non_anjou", "judogi", "escompte", "frais", "cas_special_note", "horaire_special");

function camelCase($s) {
 $p = '/\S[A-Z]/';
 $p1 = '/(.)([A-Z])/';
 $p2 = '/(_)([a-z])/';
 if (preg_match($p, $s))
  return (preg_replace_callback($p1, create_function('$matches', 'return $matches[1] . "_" . strtolower($matches[2]);'), $s));
 else
  return (preg_replace_callback($p2, create_function('$matches', 'return strtoupper($matches[2]);'), $s));
}
?>
