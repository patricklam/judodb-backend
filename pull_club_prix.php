<?php
require_once ('_pdo.php');
require_once ('_authutils.php');
require_once ('_userutils.php');

header('content-type: application/json');

$db = pdo_db_connect();
$db->setAttribute(PDO::ATTR_STRINGIFY_FETCHES, true);
require_authentication($db);

if (isset($_GET["session_seqno"])) {
  $ss_sql_frag = 'AND (`session_seqno`=:seqno)';
  $session_seqno = $_GET["session_seqno"];
} else {
  $ss_sql_frag = 'AND (`session_seqno`=:seqno OR TRUE)';
  $session_seqno = '';
}
if (!isset($session_seqno)) die;

$club_id = $_GET["club_id"];
if ($club_id != "0" && !can_access_club($db, get_user_id($db), $club_id)) die;

$prixlist = array();
$prix_query = $db->prepare('SELECT * FROM `prix` WHERE (`club_id` IS NULL OR `club_id`=:club_id) ' . $ss_sql_frag);
// you always get all of the divisions and cours
$prix_query->execute(array(':club_id' => $club_id, ':seqno' => $session_seqno));
foreach ($prix_query->fetchAll(PDO::FETCH_OBJ) as $prix) {
  $prixlist[] = $prix;
}

echo json_encode($prixlist);

?>
