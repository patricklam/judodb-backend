<?
require ('_authutils.php');

require_authentication();

$id = $_GET["id"];
if (!isset ($id)) die;

header('content-type: application/json');

require ('_dbconfig.php');

$link = mysql_connect($DBI_HOST, $DBI_USERNAME, $DBI_PASSWORD) || die("could not connect to db");
mysql_select_db($DBI_DATABASE) || die("could not select db");

$rs = mysql_query("SELECT * FROM `payment_groups` WHERE id=$id");
$group = mysql_fetch_object($rs);

$rs = mysql_query("SELECT * FROM `payment_group_members` " .
                   "WHERE group_id=$id");
if (isset($rs)) {
 $group->members = array();
 while ($m = mysql_fetch_object($rs)) {
  unset($m->group_id);
  $group->members[] = $m;
 }
}

echo '{"group":'.json_encode($group).'}';

?>
