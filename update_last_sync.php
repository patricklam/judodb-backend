<?
require ('_constants.php');
require ('_database.php');
require ('_authutils.php');

header('content-type: text/xml');
echo "<?xml version=\"1.0\"?>";

db_connect() || die;

$rs = db_query_get("SELECT * FROM `last_sync`");

print '<sync_info>';
if (isset($rs)) {
  print '<username>' . $rs[0]['username'] . '</username>';
  print '<last_sync>' . $rs[0]['last_sync_time'] . '</last_sync>';
}
print '</sync_info>';

if ($_GET['didSync'] == '1') {
  $u = $_SESSION[username];
  db_query_set("DELETE FROM `last_sync`");
  db_query_set("INSERT INTO `last_sync` (username) VALUE ('$u')");
}
?>
