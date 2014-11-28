<?php
require_once ('_pdo.php');
require_once ('_authutils.php');
require_once ('_userutils.php');

header('content-type: application/json');

$db = pdo_db_connect();
require_authentication($db);

$clublist_ids = get_club_list($db); 
$clublist = array();
$cquery = $db->prepare('SELECT * FROM `club` WHERE id=?');
foreach ($clublist_ids as $id) {
  $cquery->execute(array($id));
  foreach ($cquery->fetchAll(PDO::FETCH_OBJ) as $club) {
    $clublist[] = $club;
  }
}

$callback = trim($_GET['callback']);
echo $callback;
echo '(';
echo json_encode($clublist);
echo ');';

?>
