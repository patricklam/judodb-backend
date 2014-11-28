<?php
require_once ('_pdo.php');
require_once ('_authutils.php');
require_once ('_userutils.php');

require_authentication();

ini_set('zlib.output_compression', 4096);
header('content-type: application/json');

$db = pdo_db_connect();
$gquery = $db->prepare('SELECT * FROM `grades` ' .
                       'WHERE client_id=:client_id ORDER BY date_grade ASC');
$squery = $db->prepare('SELECT * FROM `services` ' .
                       'WHERE client_id=:client_id ORDER BY date_inscription ASC');

$clients = array();
foreach ($db->query('SELECT * FROM `client`',PDO::FETCH_OBJ) as $client) {
  $id = $client->id;
  $params = array(':client_id' => $id);
  $gquery->execute($params);
  $client->grades = array();
  foreach ($gquery->fetchAll(PDO::FETCH_OBJ) as $g) {
    unset($g->client_id);
    unset($g->id);
    $client->grades[] = $g;
  }

  $client->services = array();
  $squery->execute($params);
  foreach ($squery->fetchAll(PDO::FETCH_OBJ) as $s) {
    unset($s->client_id);
    $client->services[] = $s;
  }
  $clients[] = $client;
}

$callback = trim($_GET['callback']);
echo $callback;
echo '(';
echo json_encode($clients);
echo ');';

?>
