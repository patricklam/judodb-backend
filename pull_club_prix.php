<?php
require_once ('_pdo.php');
require_once ('_authutils.php');
require_once ('_userutils.php');

header('content-type: application/json');

$db = pdo_db_connect();
require_authentication($db);

$numero_club = $_GET["numero_club"];
if (isset($_GET["session_seqno"])) {
  $ss_sql_frag = 'AND (`session_seqno`=:seqno)';
  $session_seqno = $_GET["session_seqno"];
} else {
  $ss_sql_frag = 'AND (`session_seqno`=:seqno OR TRUE)';
  $session_seqno = '';
}
if (!isset ($numero_club) || !isset($session_seqno)) die;

$club_query = $db->prepare('SELECT `id` FROM `club` WHERE `numero_club`=?');
$club_query->execute(array($numero_club));
if ($club_query->rowCount() == 0) die;
$club_id = $club_query->fetch(PDO::FETCH_OBJ)->id;
if (!can_access_club($db, get_user_id($db), $club_id)) die;

$prixlist = array();
$prix_query = $db->prepare('SELECT * FROM `club_division_session` WHERE `club_id`=:club_id ' . $ss_sql_frag);
$prix_query->execute(array(':club_id' => $club_id, ':seqno' => $session_seqno));
foreach ($prix_query->fetchAll(PDO::FETCH_OBJ) as $prix) {
  unset($prix->club_id);
  $prixlist[] = $prix;
}

echo json_encode($prixlist);

?>
