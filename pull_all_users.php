<?
require ('_constants.php');
require ('_database.php');
require ('_authutils.php');
require ('_userutils.php');

require_authentication();

db_connect() || die;

$rs = db_query_get("SELECT * FROM `user`");
$users = array();
if (isset($rs)) {
 foreach ($rs as $r) {
  $user = new stdClass();
  $user->id = $r['id'];
  $user->username = $r['username'];
  if (is_admin()) $user->email = $r['email'];
  $user->last_update = $r['last_update'];
  $users[] = $user;
 }
}

$callback = trim($_GET['callback']);
echo $callback;
echo '(';
echo json_encode($users);
echo ')';

?>
