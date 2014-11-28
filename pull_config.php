<?
require ('_pdo.php');
require ('_authutils.php');

require_authentication();

header('content-type: application/json');

$db = pdo_db_connect();

$callback = trim($_GET['callback']);
echo $callback;
echo '(';
// TODO
echo ');';

?>
