<?php
require_once ('_pdo.php');
require_once ('_authutils.php');
require_once ('_userutils.php');

header('content-type: application/json');

$db = pdo_db_connect();
$db->setAttribute(PDO::ATTR_STRINGIFY_FETCHES, true);
require_authentication($db);

$club_id = $_GET["club_id"];
if (!isset($club_id) || !can_access_club($db, get_user_id($db), $club_id)) die;

$escomptelist = array();
$escompte_query = $db->prepare('SELECT * FROM `escompte` WHERE `club_id`=:club_id ');
$escompte_query->execute(array(':club_id' => $club_id));
foreach ($escompte_query->fetchAll(PDO::FETCH_OBJ) as $escompte) {
  $escomptelist[] = $escompte;
}

echo json_encode($escomptelist);

?>
