<?php
require_once ('_pdo.php');
require_once ('_authutils.php');
require_once ('_userutils.php');

header('content-type: application/json');

$db = pdo_db_connect();
require_authentication($db);

$club = $_GET["club"];
if (!isset ($club)) die;

$query = $db->prepare('SELECT * FROM `session`, `session_club` WHERE `club` = ? AND `session`.`seqno` = `session_club`.`seqno`');
$query->execute(array($club));
foreach ($query->fetchAll(PDO::FETCH_OBJ) as $session) {
  $sessionlist[] = $session;
}

echo json_encode($sessionlist);

?>
