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

$rs = db_query_get("SELECT * FROM `payment_groups` WHERE id=$id");

print "<group server_id='$id'>";
print "<version>" . $rs[0]['version'] . "</version>";

$rs = db_query_get("SELECT * FROM `payment_group_members` " .
                   "WHERE group_id=$id");
if (isset($rs)) {
 foreach ($rs as $r) {
  print "<client_id>" . $r['client_id'] . "</client_id>";
 }
}

print "</group>";

?>
