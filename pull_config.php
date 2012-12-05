<?
require ('_authutils.php');

require_authentication();

header('content-type: application/json');

require ('_dbconfig.php');

$link = mysql_connect($DBI_HOST, $DBI_USERNAME, $DBI_PASSWORD) || die("could not connect to db");
mysql_select_db($DBI_DATABASE) || die("could not select db");

$callback = trim($_GET['callback']);
echo $callback;
echo '(';
//echo json_encode($client);
echo ');';

?>
