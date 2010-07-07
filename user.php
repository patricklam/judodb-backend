<?
require ('_constants.php');
require ('_database.php');
require ('_authutils.php');

require_authentication();

header('content-type: text/xml');
echo "<?xml version=\"1.0\"?>";

db_connect() || die;

print "<table>";
$rs = db_query_get("SELECT * FROM `user`");
if (isset($rs)) {
 foreach ($rs as $r) {
  $id = $r['id']; $username = $r['username'];
  $email = $r['email']; $last_update = $r['last_update'];
  print "<tr><id>$id</id><username>$username</username><email>$email</email>";
  print "<last_update>$last_update</last_update></tr>\n";
 }
}

print "</table>";

?>
