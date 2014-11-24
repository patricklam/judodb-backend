<?
require ('_authutils.php');
require ('_userutils.php');

require_authentication();

require ('_userutils.php');

$id = $_GET["id"];
if (!isset ($id)) die;

header('content-type: application/json');

require ('_dbconfig.php');

$link = mysql_connect($DBI_HOST, $DBI_USERNAME, $DBI_PASSWORD) || die("could not connect to db");
mysql_select_db($DBI_DATABASE) || die("could not select db");

$userid = get_user_id();
$authok = mysql_query("SELECT * from `services`, `user_club` " .
                      "WHERE services.client_id=$id " .
                      "AND services.club_id=user_club.club_id " .
                      "AND user_club.user_id=$userid");

if(!isset($authok)) die;

$rs = mysql_query("SELECT * FROM `client` WHERE id=$id");
$client = mysql_fetch_object($rs);

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
           "WHERE client_id=$id AND club_id=$club ORDER BY date_inscription ASC");
if (isset($rs)) {
  $client->services = array();
  while ($s = mysql_fetch_object($rs)) {
    unset($s->client_id);
    $client->services[] = $s;
  }
}

$callback = trim($_GET['callback']);
echo $callback;
echo '(';
echo json_encode($client);
echo ');';

?>
