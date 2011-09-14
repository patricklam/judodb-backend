<?
// Creates a set of SQL commands to store the given POST input,
// store it in $_SESSION and keyed with the provided guid.
// Start the set of SQL commands with the $sid.

require ('_constants.php');
require ('_database.php');
require ('_authutils.php');

require_authentication();

$guid = $_POST['guid'];
$session = db_escape($_POST['current_session']);
$updates = explode(';', $_POST['data_to_save']);

$stored_cmds = array("-1");
foreach ($updates as $u) {
  if ($u == "") continue;

  $ua = explode(',', $u);
  $cid = db_escape($ua[0]);
  $action = db_escape($ua[1]);
  $newvalue = db_escape($ua[2]);

  array_push($stored_cmds, 
   "UPDATE `services` SET $action=\"$newvalue\" WHERE `client_id`=$cid AND `saisons` LIKE '%$session%';");
}

echo "<pre>";
print_r ($stored_cmds);
echo "</pre>";

$_SESSION[$guid] = $stored_cmds;

function print_debug_string($a) {
 $fh = fopen('/tmp/push', 'a');
 fputs($fh, $a);
 fclose($fh);
}

?>

