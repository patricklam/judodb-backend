<?php
require_once ('_pdo.php');
require_once ('_authutils.php');
require_once ('_userutils.php');

header('content-type: application/json');

$db = pdo_db_connect();
require_authentication($db);

$guid = $_GET['guid'];

if (isset($_SESSION[$guid])) {
 $result['sid'] = array_shift($_SESSION[$guid]);

 foreach ($_SESSION[$guid] as $sq) {
  $stmt = $db->prepare($sq);
  $stmt->execute();
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
 // print diagnostic information...
 $fh = fopen('/tmp/push', 'a');
 fwrite($fh, $a . '\n');
 fclose($fh);
}

?>

