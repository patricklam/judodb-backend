<?php
require_once ('_database.php');

session_start();
function is_authenticated() {
 if (!isset($_SESSION["authenticated"]) && $_SESSION["authenticated"] == "yes") return false;

 $oid = $_SESSION['identity'];
 $email = $_SESSION['email'];
 // if the openid identity matches something in the db, that's us. 

 $rs = db_query_get("SELECT `username` FROM `user` WHERE openid_identity='$oid'");
 if (count($rs) > 0) return true;

 // otherwise, match on email and set the identity
 $rs = db_query_get("SELECT `id` FROM `user` WHERE email='$email' AND `openid_identity` IS NULL");
 if (count($rs) == 0) return false;
 $id = $rs[0]['id'];

 db_query_set("UPDATE `user` SET `openid_identity` = $oid WHERE `id` = $id");
 return true;
}
function require_authentication() {
 if (!is_authenticated()) {
  header('HTTP/1.0 403 Forbidden');
  print('You must login to access this page.');
  exit;
 }
}
?>
