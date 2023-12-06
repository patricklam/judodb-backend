<?php
require_once ('_pdo.php');
require_once ('_authutils.php');
require_once ('_userutils.php');

header('content-type: application/json');

$db = pdo_db_connect();
$db->setAttribute(PDO::ATTR_STRINGIFY_FETCHES, true);
require_authentication($db);

// TODO

?>
