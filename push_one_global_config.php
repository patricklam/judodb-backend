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

// create lists of fields and field values
$session_namelist = '(';
$first = TRUE;
foreach ($SESSION_FIELDS as $s) {
  $sfs[$s] = explode(',', $_POST[$s]);
  if (!$first) 
    $session_namelist .= ", ";
  else
    $first = FALSE;
  $session_namelist .= "$s";
}
$session_namelist .= ')';

$i = 0;
for ($i = 0; $i < count($sfs['seqno']); $i++) {
  $session_tuple = "VALUES (";
  $first = TRUE;
  foreach ($SESSION_FIELDS as $sf) {
    if (!$first) 
      $session_tuple .= ", ";
    else
      $first = FALSE;
    $v = $sfs[$sf][$i];
    $session_tuple .= "'$v'";
  }
  $session_tuple .= ")";

  $seqno = $sfs['seqno'][$i];
  db_query_set("DELETE FROM `session` WHERE seqno='$seqno'");
  db_query_set("INSERT INTO `session` $session_namelist $session_tuple");
}

print($version);
