<?php
require_once ('_pdo.php');
require_once ('_authutils.php');
require_once ('_userutils.php');

header('content-type: application/json');

$db = pdo_db_connect();
require_authentication($db);

$club_id = $_GET["club_id"];
if ($club_id != "0" && !can_access_club($db, get_user_id($db), $club_id)) die;

$tariflist = array();
$tarif_query = $db->prepare('SELECT * FROM `nom_tarif` WHERE (`club_id`=:club_id)');
$tarif_query->execute(array(':club_id' => $club_id));
foreach ($tarif_query->fetchAll(PDO::FETCH_OBJ) as $tarif) {
  $tariflist[] = $tarif;
}

echo json_encode($tariflist);

?>
