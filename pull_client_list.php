<?
require ('_authutils.php');

require_authentication();

require ('_userutils.php');

header('content-type: application/json');

require ('_dbconfig.php');

$link = mysql_connect($DBI_HOST, $DBI_USERNAME, $DBI_PASSWORD) || die("could not connect to db");
mysql_select_db($DBI_DATABASE) || die("could not select db");

$auth_clubs = get_club_list(); 

$tmpclients = array();
$seen_clients = array();

$userid = get_user_id();
$rs0 = mysql_query("SELECT * from `services` LEFT JOIN `user_club`" .
  "ON services.club_id=user_club.club_id " .
  "WHERE user_club.user_id=$userid");

if (isset($rs0)) {
  while($s = mysql_fetch_object($rs0)) {
    if (in_array($s->club_id, $auth_clubs)) {
      $rs1 = mysql_query("SELECT * FROM `client` WHERE id=" . $s->client_id);

      // deduplicate
      if (in_array($s->client_id, $seen_clients)) {
        foreach ($tmpclients as $cl) {
          if ($cl->id == $s->client_id)
            $cl->clubs[] = $s->club_id;
        }
        continue;
      }
      $seen_clients[] = $s->client_id;
      
      if (isset($rs1)) {
        $client = mysql_fetch_object($rs1);
        $client->clubs[] = $s->club_id;
        $tmpclients[] = $client;
      }
    }
  }
}

$clients = array();
foreach ($tmpclients as $client) { 
  $rs = mysql_query("SELECT saisons FROM `services` " .
                    "WHERE client_id=$client->id");
  if (isset($rs)) {
    $first = true;
    $client->saisons = '';
    while ($s = mysql_fetch_object($rs)) {
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
