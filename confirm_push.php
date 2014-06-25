<?
// Unconditionally tramples the input on the server-side DB.
// If server_id is not -1, uses it. 
//  Otherwise creates new row on server.
// Returns server_id.
// Guarantees that server_version == c.version on exit.

require ('_constants.php');
require_once ('_database.php');
require ('_authutils.php');

require_authentication();

db_connect() || die;

$guid = $_GET['guid'];

if (isset($_SESSION[$guid])) {
 $result['sid'] = array_shift($_SESSION[$guid]);

 foreach ($_SESSION[$guid] as $sq) {
  db_query_set($sq);
 }

 $_SESSION[$guid] = Array(-1);
 $result['result'] = 'OK';
} else {
 $result['result'] = 'NOT_YET';
}

$callback = trim($_GET['callback']);
echo $callback;
echo '(';
echo json_encode($result);
echo ');';

function print_debug_info($a) {
 $fh = fopen('/tmp/push', 'a');
 fwrite($fh, print_r($a, true));
 fclose($fh);
}

?>

