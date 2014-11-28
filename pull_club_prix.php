<?
require_once ('_authutils.php');
require_once ('_userutils.php');

require_authentication();

header('content-type: application/json');

require ('_dbconfig.php');

$link = mysql_connect($DBI_HOST, $DBI_USERNAME, $DBI_PASSWORD) || die("could not connect to db");
mysql_select_db($DBI_DATABASE) || die("could not select db");

$numero_club = $_GET["numero_club"];
$session_seqno = $_GET["session_seqno"];
if (!isset ($numero_club) || !isset($session_seqno)) die;

$rs0 = mysql_query("SELECT `id` FROM `club` WHERE `numero_club`='$numero_club'");
if (!isset($rs0)) die;
$rs = mysql_fetch_object($rs0);
$club_id = $rs->id;
if (!can_access_club(get_user_id(), $club_id)) die;

$prixlist = array();
$rs0 = mysql_query("SELECT * FROM `club_division_session` WHERE `club_id`='$club_id'");
if(isset($rs0)) {
  while ($prix = mysql_fetch_object($rs0)) {
    unset($prix->club_id);
    unset($prix->session_seqno);
    $prixlist[] = $prix;
  } 
}

$callback = trim($_GET['callback']);
echo $callback;
echo '(';
echo json_encode($prixlist);
echo ');';

?>
