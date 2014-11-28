<?
require ('_pdo.php');
require ('_authutils.php');
require ('_userutils.php');

require_authentication();

$db = pdo_db_connect();

$users = array();
foreach ($db->query('SELECT * FROM `user`') as $r) {
  $user = new stdClass();
  $user->id = $r['id'];
  $user->username = $r['username'];
  if (is_admin($db, get_user_id($db))) $user->email = $r['email'];
  $user->last_update = $r['last_update'];
  $users[] = $user;
}

$callback = trim($_GET['callback']);
echo $callback;
echo '(';
echo json_encode($users);
echo ')';

?>
