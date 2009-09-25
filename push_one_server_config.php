<?
// Unconditionally tramples the input on the server-side DB.
// Returns server_version.

require ('_constants.php');
require ('_database.php');
require ('_authutils.php');

require_authentication();

db_connect() || die;

$version = $_POST['version'];
db_query_set("UPDATE `global_configuration` SET version=$version");

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

foreach ($sfs['id'] as $s) {
  $session_tuple = "VALUES (";
  foreach ($SESSION_FIELDS as $s) {
    if (!$first) 
      $session_tuple .= ", ";
    else
      $first = FALSE;
    $session_tuple .= ", '".$sfs[$s][$i] . "'";
  }
  $session_tuple .= ")";

  db_query_set("DELETE FROM `sessions` WHERE seqno='$sfs['seqno'][$s]'");
  db_query_set("INSERT INTO `sessions` $session_namelist $session_tuple");
}

print($version);
