<?php
require_once ('_pdo.php');
require_once ('_authutils.php');
require_once ('_userutils.php');

header('content-type: application/json');

$db = pdo_db_connect();
require_authentication($db);

if (isset($_GET["session_seqno"])) {
  $ss_sql_frag = 'AND `session_seqno`=?';
  $session_seqno = $_GET["session_seqno"];
} else {
  $ss_sql_frag = 'AND (`session_seqno`=? OR TRUE)';
  $session_seqno = '';
}

if (!isset($_GET["numero_club"])) {
  $club_query = $db->prepare('SELECT `id` FROM `club`');
  $club_query->execute();
} else {
  $club_query = $db->prepare('SELECT `id` FROM `club` WHERE `numero_club`=?');
  $club_query->execute(array($_GET["numero_club"]));
}

if ($club_query->rowCount() > 0) {
  $courslist = array();
  $cc_query = $db->prepare('SELECT * FROM `club_cours` WHERE `club_id`=? ' . $ss_sql_frag);

  foreach ($club_query->fetchAll(PDO::FETCH_OBJ) as $c) {
    $club_id = $c->id;
    if (!can_access_club($db, get_user_id($db), $club_id)) continue;

    $cc_query->execute(array($club_id, $session_seqno));
    foreach ($cc_query->fetchAll(PDO::FETCH_OBJ) as $club_cours) {
      $courslist[] = $club_cours;
    }
  }
}

echo json_encode($courslist);

?>
