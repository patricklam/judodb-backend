<?
header('content-type: text/xml');
echo "<?xml version=\"1.0\"?>";

require ('constants.php');
require ('_database.php');

db_connect() || die;

$rs = db_query_get("SELECT id, version FROM `client`");

print "<table>";
foreach ($rs as $r) {
  $id = $r['id']; $ver = $r['version'];
  print "<tr><id>$id</id><version>$ver</version></tr>\n";
}
print "</table>";

?>
