<?php
require_once ('_pdo.php');
require_once ('_authutils.php');
require_once ('_userutils.php');

header('content-type: application/json');

$db = pdo_db_connect();
require_authentication($db);

$numero_club = $_GET["numero_club"];
$session_seqno = $_GET["session_seqno"];
if (!isset ($numero_club) || !isset($session_seqno)) die;

$club_query = $db->prepare('SELECT `id` FROM `club` WHERE `numero_club`=?');
$club_query->execute(array($numero_club));
if ($club_query->rowCount() == 0) die;
$club_id = $club_query->fetch(PDO::FETCH_OBJ)->id;
if (!can_access_club($db, get_user_id($db), $club_id)) die;

$courslist = array();
$cc_query = $db->prepare('SELECT * FROM `club_cours` WHERE `club_id`=? AND `session_seqno`=?');
$cc_query->execute(array($club_id, $session_seqno));
foreach ($cc_query->fetchAll(PDO::FETCH_OBJ) as $club_cours) {
  $courslist[] = $club_cours;
}

$callback = trim($_GET['callback']);
echo $callback;
echo '(';
echo json_encode($courslist);
echo ');';

?>
