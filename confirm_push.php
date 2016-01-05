<?php
require_once ('_pdo.php');
require_once ('_authutils.php');
require_once ('_userutils.php');
$debug = TRUE;

header('content-type: application/json');

$db = pdo_db_connect();
require_authentication($db);

$guid = $_GET['guid'];
$result['executed'] = 0;

if (isset($_SESSION[$guid])) {
 $result['sid'] = array_shift($_SESSION[$guid]);

 print_debug_timestamp();
 foreach ($_SESSION[$guid] as $sq) {
  $stmt = $db->prepare($sq);
  $result['executed']++;
  $stmt->execute();
  print_debug_info($sq);
 }

 $_SESSION[$guid] = Array(-1);
 $result['result'] = 'OK';
} else {
 $result['result'] = 'NOT_YET';
}

echo json_encode($result);

function print_debug_timestamp() {
 global $debug;
 if (!$debug) return;

 $date = date('Y/m/d H:i:s');
 $fh = fopen('/tmp/push', 'a');
 fwrite($fh, '*** ' . $date . PHP_EOL);
 fclose($fh);
}

function print_debug_info($a) {
 global $debug;
 if (!$debug) return;

 $fh = fopen('/tmp/push', 'a');
 fwrite($fh, $a . PHP_EOL);
 fclose($fh);
}

?>

