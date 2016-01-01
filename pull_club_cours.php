<?php
require_once ('_pdo.php');
require_once ('_authutils.php');
require_once ('_userutils.php');

header('content-type: application/json');

$db = pdo_db_connect();
require_authentication($db);

function pull_cours($db, $club_id, $session_seqno, $ss_sql_frag, $courslist) {
  if (!can_access_club($db, get_user_id($db), $club_id)) continue;

  $cc_query = $db->prepare('SELECT * FROM `club_cours` WHERE `club_id`=:club_id ' . $ss_sql_frag);
  $cc_query->execute(array(':club_id' => $club_id, ':seqno' => $session_seqno));
  foreach ($cc_query->fetchAll(PDO::FETCH_OBJ) as $club_cours) {
    $courslist[] = $club_cours;
  }
  return $courslist;
}

if (isset($_GET["session_seqno"])) {
  $ss_sql_frag = 'AND (`session_seqno`=:seqno OR session_seqno=(SELECT `seqno` FROM `session` WHERE `linked_seqno`=:seqno))';
  $session_seqno = $_GET["session_seqno"];
} else {
  $ss_sql_frag = 'AND (`session_seqno`=:seqno OR TRUE)';
  $session_seqno = '';
}

$courslist = array();

if (!isset($_GET["club_id"])) {
  $club_query = $db->prepare('SELECT `id` FROM `club`');
  $club_query->execute();

  foreach ($club_query->fetchAll(PDO::FETCH_OBJ) as $c) {
    $courslist = pull_cours($db, $c->id, $session_seqno, $ss_sql_frag, $courslist);
  }
} else {
  $club_id = $_GET["club_id"];
  $courslist = pull_cours($db, $club_id, $session_seqno, $ss_sql_frag, $courslist);
}

echo json_encode($courslist);

?>
