<?
require ('_authutils.php');

require_authentication();

header('content-type: application/json');

require ('_dbconfig.php');

$link = mysql_connect($DBI_HOST, $DBI_USERNAME, $DBI_PASSWORD) || die("could not connect to db");
mysql_select_db($DBI_DATABASE) || die("could not select db");

$rs0 = mysql_query("SELECT id,nom,prenom FROM `client`");
$clients = array();
while ($client = mysql_fetch_object($rs0)) {
  $id = $client->id;

  $rs = mysql_query("SELECT saisons FROM `services` " .
                    "WHERE client_id=$id");
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

$callback = trim($_GET['callback']);
echo $callback;
echo '(';
echo json_encode($clients);
echo ');';

?>
