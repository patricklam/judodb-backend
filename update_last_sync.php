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

$current_session = $_GET['current_session'];
if (isset($current_session)) {
  $cs = db_query_get("SELECT COUNT(*) FROM `services` WHERE saisons LIKE '%$current_session%' AND NOT EXISTS (SELECT * FROM `deleted_client` AS dc WHERE client_id = dc.id)");
  print '<inscriptions>' . $cs[0]['COUNT(*)'] . '</inscriptions>';
}

print '</sync_info>';

if (isset($_GET['didSync']) && $_GET['didSync'] == '1') {
  $u = $_SESSION[username];
  db_query_set("DELETE FROM `last_sync`");
  db_query_set("INSERT INTO `last_sync` (username) VALUE ('$u')");
}
?>
