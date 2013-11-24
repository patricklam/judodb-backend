<?
require ('_authutils.php');

require_authentication();

ini_set('zlib.output_compression', 4096);
header('content-type: application/json');

require ('_dbconfig.php');

$link = mysql_connect($DBI_HOST, $DBI_USERNAME, $DBI_PASSWORD) || die("could not connect to db");
mysql_select_db($DBI_DATABASE) || die("could not select db");

$rs0 = mysql_query("SELECT * FROM `client`");
$clients = array();
while ($client = mysql_fetch_object($rs0)) {
  $id = $client->id;
  $rs = mysql_query("SELECT * FROM `grades` " .
                    "WHERE client_id=$id ORDER BY date_grade ASC");
  if (isset($rs)) {
   $client->grades = array();
   while ($g = mysql_fetch_object($rs)) {
    unset($g->client_id);
    unset($g->id);
    $client->grades[] = $g;
   }
  }

  $rs = mysql_query("SELECT * FROM `services` " .
                   "WHERE client_id=$id ORDER BY date_inscription ASC");
  if (isset($rs)) {
   $client->services = array();
   while ($s = mysql_fetch_object($rs)) {
    unset($s->client_id);
    $client->services[] = $s;
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
