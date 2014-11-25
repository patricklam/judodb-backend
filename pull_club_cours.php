<?
require_once ('_authutils.php');

require_authentication();

header('content-type: application/json');

require ('_dbconfig.php');

$link = mysql_connect($DBI_HOST, $DBI_USERNAME, $DBI_PASSWORD) || die("could not connect to db");
mysql_select_db($DBI_DATABASE) || die("could not select db");

$numero_club = $_GET["club_id"];
if (!isset ($numero_club)) die;

$courslist = array();
$rs0 = mysql_query("SELECT `club_cours`.* FROM `club_cours` JOIN `club` ON `club_cours`.club_id=`club`.club_id WHERE numero_club='$numero_club'");

if(isset($rs0)) {
  while ($club_cours = mysql_fetch_object($rs0)) {
    $courslist[] = $club_cours;
  } 
}

$callback = trim($_GET['callback']);
echo $callback;
echo '(';
echo json_encode($courslist);
echo ');';

?>
