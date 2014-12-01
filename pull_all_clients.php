<?php
require_once ('_pdo.php');
require_once ('_authutils.php');
require_once ('_userutils.php');

ini_set('zlib.output_compression', 4096);
header('content-type: application/json');

$db = pdo_db_connect();
require_authentication($db);
$user_id = get_user_id($db);

$gquery = $db->prepare('SELECT * FROM `grades` ' .
                       'WHERE client_id=:client_id ORDER BY date_grade ASC');
$squery = $db->prepare('SELECT * FROM `services` ' .
                       'WHERE client_id=:client_id ORDER BY date_inscription ASC');

$clients = array();
foreach ($db->query('SELECT * FROM `client`',PDO::FETCH_OBJ) as $client) {
  $id = $client->id;
  $params = array(':client_id' => $id);

  $client->services = array();
  $squery->execute($params);
  $visible = false;
  foreach ($squery->fetchAll(PDO::FETCH_OBJ) as $s) {
    unset($s->client_id);
    $client->services[] = $s;
    if (can_access_club($db, $user_id, $s->club_id)) $visible = true;
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
