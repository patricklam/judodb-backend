<?
require ('_authutils.php');

require_authentication();

$id = $_GET["id"];
if (!isset ($id)) die;

header('content-type: text/xml');
echo "<?xml version=\"1.0\"?>";

require ('_constants.php');
require ('_database.php');

db_connect() || die;

$rs = db_query_get("SELECT * FROM `client` WHERE id=$id");

print "<client server_id='$id'>";

foreach ($ALL_FIELDS as $f) {
 print "<$f>" . $rs[0][$f] . "</$f>";
}

$rs = db_query_get("SELECT * FROM `grades` " .
           "WHERE client_id=$id ORDER BY date_grade ASC");
foreach ($rs as $r) {
 print "<grade>" . $r['grade'] . "</grade>";
 print "<dateGrade>" . $r['date_grade'] . "</dateGrade>";
}

$rs = db_query_get("SELECT * FROM `services` " .
           "WHERE client_id=$id ORDER BY date_inscription ASC");
foreach ($rs as $r) {
 foreach ($SERVICE_FIELDS as $f) {
  print "<$f>" . $r[camelCase($f)] . "</$f>";
 }
}

print "</client>";

// http://4umi.com/web/javascript/camelcase.php
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
