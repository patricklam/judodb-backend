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
           "WHERE client_id=$id ORDER BY grade_date ASC");
foreach ($rs as $r) {
 print "<grade>" . $r['grade'] . "</grade>";
 print "<dateGrade>" . $r['grade_date'] . "</dateGrade>";
}

print "</client>";

?>
