<?php
require_once ('_pdo.php');
require_once ('_authutils.php');
require_once ('_userutils.php');

header('content-type: application/json');

$db = pdo_db_connect();
$db->setAttribute(PDO::ATTR_STRINGIFY_FETCHES, true);
require_authentication($db);

$users = array();
foreach ($db->query('SELECT * FROM `user`') as $r) {
  $user = new stdClass();
  $user->id = $r['id'];
  $user->username = $r['username'];
  if (is_admin($db, get_user_id($db))) $user->email = $r['email'];
  $user->last_update = $r['last_update'];
  $users[] = $user;
}

echo json_encode($users);

?>
