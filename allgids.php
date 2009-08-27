<?
require ('_constants.php');
require ('_database.php');
require ('_authutils.php');

require_authentication();

header('content-type: text/xml');
echo "<?xml version=\"1.0\"?>";

db_connect() || die;

$rs = db_query_get("SELECT id, version FROM `payment_groups`");

print "<table>";
if (isset($rs)) {
 foreach ($rs as $r) {
  $id = $r['id']; $ver = $r['version'];
  print "<tr><id>$id</id><version>$ver</version></tr>\n";
 }
}
print "</table>";

?>
