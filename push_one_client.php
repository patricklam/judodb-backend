<?php
require_once ('_pdo.php');
require_once ('_authutils.php');
require_once ('_userutils.php');

$db = pdo_db_connect();
require_authentication($db);

require ('_constants.php');
require ('_push_helper.php');

$data = json_decode($_POST["encoded_client"], true);

$stored_cmds = generate_cmds($db, $_POST);

/*echo "<pre>";
print_r($stored_cmds);
echo "</pre>";*/

/* https://code.google.com/p/google-web-toolkit/issues/detail?id=624 */
http_response_code(204);

$guid = $_POST['guid'];
$_SESSION[$guid] = $stored_cmds;

?>

