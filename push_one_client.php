<?php
require_once ('_pdo.php');
require_once ('_authutils.php');
require_once ('_userutils.php');

$db = pdo_db_connect();
require_authentication($db);

require ('_constants.php');
require ('_push_helper.php');

$stored_cmds = generate_cmds($_POST);

echo "<pre>";
print_r($stored_cmds);
echo "</pre>";

$_SESSION[$guid] = $stored_cmds;

?>

