<?
// XXX require authentication

$id = $_GET["id"];
if (!isset ($id)) die;

header('content-type: text/xml');
echo "<?xml version=\"1.0\"?>";

require ('constants.php');
require ('_database.php');

db_connect() || die;

$rs = db_query_get("SELECT * FROM `client` WHERE id=$id");

print "<client server_id='$id'>";

foreach ($ALL_FIELDS as $f) {
 print "<$f>" . $rs[0][$f] . "</$f>";
}

print "</client>";

?>
