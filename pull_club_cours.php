<?
require_once ('_authutils.php');

require_authentication();

header('content-type: application/json');

require ('_dbconfig.php');

$link = mysql_connect($DBI_HOST, $DBI_USERNAME, $DBI_PASSWORD) || die("could not connect to db");
mysql_select_db($DBI_DATABASE) || die("could not select db");

$club_id = $_GET["club_id"];
if (!isset ($club_id)) die;

$courslist = array();
$rs0 = mysql_query("SELECT * FROM `club_cours` WHERE club_id=$club_id");

if(isset($rs0)) {
  while ($club_cours = mysql_fetch_object($rs0)) {
    $courslist[] = $club_cours->seq_no;
  } 
}

$callback = trim($_GET['callback']);
echo $callback;
echo '(';
echo json_encode($courslist);
echo ');';

?>
