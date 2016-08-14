<?php
if (file_exists('_top_sekrit_debug_mode.php')) include '_top_sekrit_debug_mode.php';

require_once ('_pdo.php');

session_start();
function is_authenticated($db) {
 global $DEBUG_MODE;
 if ($DEBUG_MODE) return 1;
 if (!isset($_SESSION["authenticated"]) && $_SESSION["authenticated"] == "yes") return false;

 $pid = $_SESSION['plus_identity'];
 $email = $_SESSION['email'];
 // if the openid identity matches something in the db, that's us. 

 $pi_query = $db->prepare('SELECT COUNT(`username`) FROM `user` WHERE plus_identity=?');
 $pi_query->execute(array($pid));
 if ($pi_query->fetchColumn() > 0) return true;

 // otherwise, match on email and set the identity
 $email_query = $db->prepare('SELECT COUNT(`id`) FROM `user` WHERE email=? AND `plus_identity` IS NULL');
 $email_query->execute(array($email));
 if ($email_query->fetchColumn() == 0) return false;

 $real_email_query = $db->prepare('SELECT `id` FROM `user` WHERE email=? AND `plus_identity` IS NULL');
 $real_email_query->execute(array($email));
 $id = $real_email_query->fetch(PDO::FETCH_NUM)[0];

 $update_query = $db->prepare('UPDATE `user` SET `plus_identity` = :pid, `last_update` = curdate() WHERE `id` = :id');
 $update_query->execute(array('pid' => $pid, 'id' => $id));
 return true;
}
function require_authentication($db) {
 if (!is_authenticated($db)) {
  header('HTTP/1.0 403 Forbidden');
  print('You must login to access this page.');
  exit;
 }
}
?>
