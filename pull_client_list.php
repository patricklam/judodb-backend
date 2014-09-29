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
$rs0 = mysql_query("SELECT * FROM `client_club` JOIN `client` " .
  		   "ON client_club.client_id=client.id");
if (isset($rs0)) {
  while($c = mysql_fetch_object($rs0)) {
    if (in_array($c->club_id, $auth_clubs)) {
      $rs1 = mysql_query("SELECT * FROM `client` WHERE id=" . $c->client_id);

      // deduplicate
      if (in_array($c->client_id, $seen_clients)) {
        foreach ($tmpclients as $cl) {
          if ($cl->id == $c->client_id)
            $cl->clubs[] = $c->club_id;
        }
        continue;
      }
      $seen_clients[] = $c->client_id;
      
      if (isset($rs1)) {
        $client = mysql_fetch_object($rs1);
        $client->clubs[] = $c->club_id;
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
