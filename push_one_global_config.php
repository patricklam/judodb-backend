<?
// Unconditionally tramples the input on the server-side DB.
// Returns server_version.

require ('_constants.php');
require ('_database.php');
require ('_authutils.php');

require_authentication();

db_connect() || die;

$version = $_POST['version'];
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

  $i = 0;
  for ($i = 0; $i < count($sfs['seqno']); $i++) {
    $tuple = "VALUES (";
    $first = TRUE;
    foreach ($f as $sf) {
      if (!$first) 
        $tuple .= ", ";
      else
        $first = FALSE;
      $v = $sfs[$sf][$i];
      $tuple .= "'$v'";
    }
    $tuple .= ")";

    $seqno = $sfs['seqno'][$i];
    db_query_set("DELETE FROM `$t` WHERE seqno='$seqno'");
    db_query_set("INSERT INTO `$t` $namelist $tuple");
  }
}

stash_thing('session', $SESSION_FIELDS);
stash_thing('cours', $COURS_FIELDS);

print($version);
