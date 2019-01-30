<?php
if (file_exists('_top_sekrit_debug_mode.php')) include '_top_sekrit_debug_mode.php';

require_once ('_pdo.php');

session_start();
function is_authenticated($db) {
 global $DEBUG_MODE;
 if ($DEBUG_MODE) return 1;
 if (!isset($_SESSION["authenticated"]) && $_SESSION["authenticated"] == "yes") return false;

 $email = $_SESSION['email'];
 // if the openid identity matches something in the db, that's us. 

 $email_query = $db->prepare('SELECT COUNT(`id`) FROM `user` WHERE email=?');
 $email_query->execute(array($email));
 if ($email_query->fetchColumn() == 0) return false;

 $update_query = $db->prepare('UPDATE `user` SET `last_update` = curdate() WHERE `id` = :id');
 $update_query->execute(array('id' => $id));
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
