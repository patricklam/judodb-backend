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

$prixlist = array();
$prix_query = $db->prepare('SELECT * FROM `club_division_session` WHERE `club_id`=? AND `session_seqno`=?');
$prix_query->execute(array($club_id,$session_seqno));
foreach ($prix_query->fetchAll(PDO::FETCH_OBJ) as $prix) {
  unset($prix->club_id);
  unset($prix->session_seqno);
  $prixlist[] = $prix;
}

$callback = trim($_GET['callback']);
echo $callback;
echo '(';
echo json_encode($prixlist);
echo ');';

?>
