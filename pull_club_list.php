<?
require_once ('_authutils.php');

require_authentication();

header('content-type: application/json');

require ('_dbconfig.php');

require ('_userutils.php');

$link = mysql_connect($DBI_HOST, $DBI_USERNAME, $DBI_PASSWORD) || die("could not connect to db");
mysql_select_db($DBI_DATABASE) || die("could not select db");

$clublist_ids = get_club_list(); 
$clublist = array();
foreach ($clublist_ids as $id) {
  $rs = mysql_query("SELECT * FROM `club` WHERE id=$id");
  while($club = mysql_fetch_object($rs)) {
    $clublist[] = $club;
  }
}

$callback = trim($_GET['callback']);
echo $callback;
echo '(';
echo json_encode($clublist);
echo ');';

?>
