<?
// Unconditionally tramples the input on the server-side DB.
// Returns server_version.

require ('_constants.php');
require ('_database.php');
require ('_authutils.php');

require_authentication();

db_connect() || die;

$version = $_POST['version'];
db_query_set("DELETE FROM `global_configuration`");
db_query_set("INSERT INTO `global_configuration` VALUES ($version)");

/* reads the matching FIELDS $f from the POST args and stores them into db */
function stash_thing($t, $f) {
  // create lists of fields and field values
  $namelist = '(';
  $first = TRUE;
  foreach ($f as $s) {
    $sfs[$s] = explode('|', $_POST[$t . '_' . $s]);
    if (!$first) 
      $namelist .= ", ";
    else
      $first = FALSE;
    $namelist .= "$s";
  }
  $namelist .= ')';

  for ($i = 0; $i < count($sfs['name']); $i++) {
    $tuple = "VALUES (";
    $first = TRUE;
    foreach ($f as $sf) {
      if (!$first) 
        $tuple .= ", ";
      else
        $first = FALSE;
      $v = $sfs[$sf][$i];
      if ($v == 'true' || $v == 'false')
        $tuple .= $v;
      else
        $tuple .= "'$v'";
    }
    $tuple .= ")";

    db_query_set("INSERT INTO `$t` $namelist $tuple");
  }
}

db_query_set("DELETE FROM `session`");
db_query_set("DELETE FROM `cours`");
db_query_set("DELETE FROM `cours_session`");
db_query_set("DELETE FROM `categorie`");
stash_thing('session', $SESSION_FIELDS);
stash_thing('cours', $COURS_FIELDS);
stash_thing('categorie', $CATEGORIES_FIELDS);

$cs = explode('|', $_POST['cours_session']);
for ($i = 0; $i < count($cs); $i++) {
  $cc = explode(',', $cs[$i]);
  $c = $cc[0]; $s = $cc[1];
  db_query_set("INSERT INTO `cours_session` (cours_seqno, session_seqno) VALUES ($c, $s)");
}

print($version);
