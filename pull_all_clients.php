<?php
require_once ('_pdo.php');
require_once ('_authutils.php');
require_once ('_userutils.php');

ini_set('zlib.output_compression', 4096);
header('content-type: application/json');

$db = pdo_db_connect();
require_authentication($db);
$user_id = get_user_id($db);

$club_id = $_GET["club_id"];
if (!isset ($club_id)) die;

$gquery = $db->prepare('SELECT * FROM `grades` ' .
                       'WHERE client_id=:client_id ORDER BY date_grade ASC');
$squery = $db->prepare('SELECT * FROM `services` ' .
                       'WHERE client_id=:client_id ORDER BY date_inscription ASC');
$payments_query = $db->prepare('SELECT * FROM `payment` '.
                               'WHERE service_id=? ORDER BY number ASC');

$clients = array();
$clients_query = $db->prepare('SELECT * FROM `client` WHERE EXISTS (SELECT `client_id` FROM `services` WHERE `club_id`=? AND `services`.`client_id` = `client`.`id`)');
$clients_query->execute(array($club_id));
foreach ($clients_query->fetchAll(PDO::FETCH_OBJ) as $client) {
  $id = $client->id;
  $params = array(':client_id' => $id);

  $client->services = array();
  $squery->execute($params);
  $visible = false;
  foreach ($squery->fetchAll(PDO::FETCH_OBJ) as $s) {
    unset($s->client_id);
    $client->services[] = $s;
    if (can_access_club($db, $user_id, $s->club_id)) $visible = true;
    $payments_query->execute(array($s->id));
    $s->paiements = array();
    foreach ($payments_query->fetchAll(PDO::FETCH_OBJ) as $p) {
      unset($p->service_id);
      $s->paiements[] = $p;
    }
  }

  $gquery->execute($params);
  $client->grades = array();
  foreach ($gquery->fetchAll(PDO::FETCH_OBJ) as $g) {
    unset($g->client_id);
    unset($g->id);
    $client->grades[] = $g;
  }

  if ($visible)
    $clients[] = $client;
}

echo json_encode($clients);

?>
