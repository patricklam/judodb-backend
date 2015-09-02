<?php
require_once ('_pdo.php');
require_once ('_authutils.php');
require_once ('_userutils.php');

header('content-type: application/json');

$db = pdo_db_connect();
require_authentication($db);

$auth_clubs = get_club_list($db); 

$tmpclients = array();
$seen_clients = array();

$rs0 = NULL;
$userid = get_user_id($db);
$client_query = $db->prepare('SELECT * from `client` WHERE id=? ORDER BY `nom` ASC, `prenom` ASC');
$saisons_query = $db->prepare('SELECT saisons FROM `services` ' .
                               'WHERE client_id=?');

if (is_admin($db, $userid)) {
  $services_query = $db->prepare('SELECT * from `services` ORDER BY `date_inscription` DESC');
}
else {
  $services_query = $db->prepare('SELECT * from `services` ' .
                                     'LEFT JOIN `user_club` ON services.club_id=user_club.club_id ' .
                                     'WHERE user_club.user_id=? ' .
                                     'ORDER BY `date_inscription` DESC');
}
$services_query->execute(array($userid));

foreach ($services_query->fetchAll(PDO::FETCH_OBJ) as $s) {
  if (in_array($s->club_id, $auth_clubs)) {
    // deduplicate
    if (in_array($s->client_id, $seen_clients)) {
      foreach ($tmpclients as $cl) {
        if ($cl->id == $s->client_id)
          $cl->clubs[] = $s->club_id;
      }
      continue;
    }
    $seen_clients[] = $s->client_id;

    $client_query->execute(array($s->client_id));
    $client = $client_query->fetch(PDO::FETCH_OBJ);
    $client->clubs[] = $s->club_id;
    $tmpclients[] = $client;
  }
}

$clients = array();
foreach ($tmpclients as $client) { 
  $saisons_query->execute(array($client->id));
  if ($saisons_query->rowCount() > 0) {
    $first = true;
    $client->saisons = '';
    foreach ($saisons_query->fetchAll(PDO::FETCH_OBJ) as $s) {
      if (!$first) $client->saisons .= ' ';
      $client->saisons .= $s->saisons;
      $first = false;
    }
  }
  $clients[] = $client;
}

echo json_encode($clients);

?>
