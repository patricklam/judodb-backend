<?php
require_once ('_pdo.php');
require_once ('_authutils.php');
require_once ('_userutils.php');

header('content-type: application/json');

$db = pdo_db_connect();
$db->setAttribute(PDO::ATTR_STRINGIFY_FETCHES, true);
require_authentication($db);

$id = $_GET["id"];
if (!isset ($id)) die;

$userid = get_user_id($db);
if (!is_admin($db, $userid)) {
  $auth_query = $db->prepare('SELECT * FROM `services`, `user_club` '.
                              'WHERE services.client_id=:id '.
                                'AND services.club_id=user_club.club_id '.
                                'AND user_club.user_id=:userid');
  $aparams=array(':id' => $id, ':userid' => $userid);
  $auth_query->execute($aparams);
  if ($auth_query->rowCount() == 0) die;
}

$client_query = $db->prepare('SELECT * FROM `client` WHERE id=:id');
$client_query->bindValue(":id", $id, PDO::PARAM_INT);
$client_query->execute();
if ($client_query->rowCount() == 0) die;

$client = $client_query->fetch(PDO::FETCH_OBJ);

$grades_query = $db->prepare('SELECT * FROM `grades` '.
                              'WHERE client_id=:client_id ORDER BY date_grade ASC');
$grades_query->bindValue(":client_id", $id, PDO::PARAM_INT);
$grades_query->execute();
$client->grades = array();
foreach ($grades_query->fetchAll(PDO::FETCH_OBJ) as $g) {
  unset($g->client_id);
  unset($g->id);
  $client->grades[] = $g;
}

$services_query = $db->prepare('SELECT * FROM `services` '.
                               'WHERE client_id=:client_id ORDER BY date_inscription ASC');
$services_query->bindValue(":client_id", $id, PDO::PARAM_INT);
$payments_query = $db->prepare('SELECT * FROM `payment` '.
                               'WHERE service_id=:service_id ORDER BY number ASC');
$services_query->execute();
$client->services = array();
foreach ($services_query->fetchAll(PDO::FETCH_OBJ) as $s) {
  unset($s->client_id);
  $payments_query->bindValue(":service_id", $s->id, PDO::PARAM_INT);
  $payments_query->execute();
  $s->paiements = array();
  foreach ($payments_query->fetchAll(PDO::FETCH_OBJ) as $p) {
    unset($p->service_id);
    $s->paiements[] = $p;
  }
  $client->services[] = $s;
}

echo json_encode($client);

?>
