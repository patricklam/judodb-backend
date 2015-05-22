<?php
require_once ('_pdo.php');
require_once ('_authutils.php');
require_once ('_userutils.php');

$db = pdo_db_connect();
require_authentication($db);
$userid = get_user_id($db);

require ('_constants.php');

// Creates a set of SQL commands to store the given POST input,
// store it in $_SESSION and keyed with the provided guid.
// Start the set of SQL commands with the $sid.

$guid = $_POST['guid'];
$session = $_POST['current_session'];
if (!preg_match('/[AH][0-9][0-9]/', $session)) die;
$updates = explode(';', $_POST['data_to_save']);

$stored_cmds = array("-1");
foreach ($updates as $u) {
  if ($u == "") continue;

  $ua = explode(',', $u);
  $cid = $db->quote($ua[0]);
  $table = $ua[1][0];
  $action = substr($ua[1], 1);
  if (!preg_match('/[A-Za-z0-9_]*/', $action)) die;
  $newvalue = $db->quote($ua[2]);

  switch ($table) {
  case "S":
    array_push($stored_cmds, 
       "UPDATE `services` SET $action=$newvalue WHERE `client_id`=$cid AND `saisons` LIKE '%$session%';");
    break;
  case "C":
    array_push($stored_cmds, 
       "UPDATE `client` SET $action=$newvalue WHERE `id`=$cid;");
    break;
  case "G":
    $gg = explode('|', $ua[2]);
    $grade = $db->quote($gg[0]);
    $dg = $db->quote($gg[1]);
    array_push($stored_cmds,
       "INSERT INTO `grades` (client_id, grade, date_grade) VALUES ($cid, $grade, $dg)");
    break;
  case "!":
    $gg = explode('|', $ua[2]);
    $grade = $db->quote($gg[0]);
    $dg = $db->quote($gg[1]);
    array_push($stored_cmds,
       "DELETE FROM `grades` WHERE `client_id`=$cid AND `grade`=$grade AND `date_grade`=$dg");
    break;
  case "e":
    if (!is_admin($db, $userid))
       break;
    $seqno = $db->quote($ua[3]);
    array_push($stored_cmds,
       "UPDATE `session` SET $action=$newvalue WHERE `seqno`=$seqno;");
    break;
  case "f":
    $club_id = $db->quote($ua[3]);
    $id = $db->quote($ua[4]);
    if (!can_access_club($db, $userid, $club_id))
       break;
    array_push($stored_cmds,
       "UPDATE `session_club` SET $action=$newvalue WHERE `id`=$id AND `club`=$id;");
    break;
  case "E":
    if (!is_admin($db, $userid))
       break;
    $seqno = $db->quote($ua[3]);
    array_push($stored_cmds,
       "INSERT INTO `session` (seqno, name) VALUES ($seqno, $newvalue);");
    break;
  }
}

echo "<pre>";
print_r ($stored_cmds);
echo "</pre>";

$_SESSION[$guid] = $stored_cmds;

?>

