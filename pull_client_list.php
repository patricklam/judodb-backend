<?
require ('_pdo.php');
require ('_authutils.php');

require_authentication();

require ('_userutils.php');

header('content-type: application/json');

$db = pdo_db_connect();

$auth_clubs = get_club_list($db); 

$tmpclients = array();
$seen_clients = array();

$rs0 = NULL;
$userid = get_user_id($db);
$client_query = $db->prepare('SELECT * from `client` WHERE id=?');
$saisons_query = $db->prepare('SELECT saisons FROM `services` ' .
                               'WHERE client_id=?');

if (is_admin($db, $userid)) {
  $services_query = $db->prepare('SELECT * from `services`');
}
else {
  $services_query = $db->prepare('SELECT * from `services` LEFT JOIN `user_club` ' .
                                                           'ON services.club_id=user_club.club_id ' .
                                     'WHERE user_club.user_id=?');
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

foreach ($clients as $c) {
  utf8_encode_deep($c);
}

$callback = trim($_GET['callback']);
echo $callback;
echo '(';
echo json_encode($clients);
echo ');';

?>
