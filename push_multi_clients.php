<?
// Creates a set of SQL commands to store the given POST input,
// store it in $_SESSION and keyed with the provided guid.
// Start the set of SQL commands with the $sid.

require ('_constants.php');
require ('_database.php');
require ('_authutils.php');

require_authentication();

$guid = $_POST['guid'];
$session = $_POST['current_session'];
$updates = explode(';', $_POST['data_to_save']);

$stored_cmds = array();
foreach ($updates as $u) {
  $ua = explode(',', $u);
  $cid = $ua[0];
  $action = $ua[1];
  $newvalue = $ua[2];

  // array_push($stored_cmds, 
  print_debug_string("UPDATE `services` SET $action=$newvalue WHERE `client_id`=$cid AND `session` LIKE '%$session%'");
}

function print_debug_string($a) {
 $fh = fopen('/tmp/push', 'a');
 fputs($fh, $a);
 fclose($fh);
}

$_SESSION[$guid] = $stored_cmds;

?>

