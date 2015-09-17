<?php
require_once ('_pdo.php');
require_once ('_authutils.php');
require_once ('_userutils.php');

header('content-type: application/json');

$db = pdo_db_connect();
require_authentication($db);

$club_id = $_GET["club_id"];
if (!isset($club_id) || !can_access_club($db, get_user_id($db), $club_id)) die;

$produitlist = array();
$produit_query = $db->prepare('SELECT * FROM `produit` WHERE `club_id`=:club_id');
$produit_query->execute(array(':club_id' => $club_id));
foreach ($produit_query->fetchAll(PDO::FETCH_OBJ) as $produit) {
  $produitlist[] = $produit;
}

echo json_encode($produitlist);

?>
