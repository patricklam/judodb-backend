<?php
require_once ('_pdo.php');
require_once ('_authutils.php');
require_once ('_userutils.php');

header('content-type: application/json');

$db = pdo_db_connect();
require_authentication($db);

$club_id = $_GET["club_id"];
$quoted_club_id = $db->quote($_GET["club_id"]);
if (!isset($_GET["club_id"])) die;

if ($club_id == "0") {
  // sessions only, no dates
  $query = $db->prepare('SELECT `seqno`, `linked_seqno`, `name`, `year`, `abbrev`, -1 AS `id`, 0 AS `club`, "-" AS `first_class_date`, "-" AS `first_signup_date`, "-" AS `last_class_date`, "-" AS `last_signup_date` FROM `session`');
  $query->execute(array($club_id));
  foreach ($query->fetchAll(PDO::FETCH_OBJ) as $session) {
    $sessionlist[] = $session;
  }
} else {
  // sessions which do exist for this club: include signup dates

  $query = $db->prepare('SELECT * FROM `session`, `session_club` WHERE `club` = ? AND `session`.`seqno` = `session_club`.`seqno`');
  $query->execute(array($club_id));
  foreach ($query->fetchAll(PDO::FETCH_OBJ) as $session) {
    $sessionlist[] = $session;
  }
  // sessions which do not exist
  $query = $db->prepare("SELECT `seqno`, `linked_seqno`, `name`, `year`, `abbrev`, -1 AS `id`, $quoted_club_id AS `club`, '-' AS `first_class_date`, '-' AS `first_signup_date`, '-' AS `last_class_date`, '-' AS `last_signup_date` from `session` WHERE NOT EXISTS (SELECT `session`.`seqno` FROM `session_club` WHERE `session`.`seqno` = `session_club`.`seqno` AND `session_club`.`club` = $quoted_club_id);");
  $query->execute(array($club_id));
  foreach ($query->fetchAll(PDO::FETCH_OBJ) as $session) {
    $sessionlist[] = $session;
  }
}

echo json_encode($sessionlist);

?>
