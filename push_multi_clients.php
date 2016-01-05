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
if ($session != "" && !preg_match('/[AH][0-9][0-9]/', $session)) die;
$updates = explode(';', $_POST['data_to_save']);

$stored_cmds = array("-1");
// we set the response code to 403 when permission is denied,
// ... however, the frontend doesn't actually care.
$response_code = 204;
foreach ($updates as $u) {
  if ($u == "") continue;

  $ua = explode(',', $u);
  $cid_unquoted = $ua[0];
  $cid = $db->quote($cid_unquoted);
  $table = $ua[1][0];
  $action = substr($ua[1], 1);
  if (!preg_match('/[A-Za-z0-9_]*/', $action)) {
    $response_code = 403;
    break;
  }
  $newvalue = $db->quote($ua[2]);

  switch ($table) {
  // client info:
  case "S":
    if (!can_write_client($db, $userid, $cid_unquoted)) {
       $response_code = 403;
       break;
    }
    array_push($stored_cmds, 
       "UPDATE `services` SET $action=$newvalue WHERE `client_id`=$cid AND `saisons` LIKE '%$session%';");
    break;
  case "C":
    if (!can_write_client($db, $userid, $cid_unquoted)) {
       $response_code = 403;
       break;
    }
    array_push($stored_cmds, 
       "UPDATE `client` SET $action=$newvalue WHERE `id`=$cid;");
    break;
  case "G":
    if (!can_write_client($db, $userid, $cid_unquoted)) {
       $response_code = 403;
       break;
    }
    $gg = explode('|', $ua[2]);
    $grade = $db->quote($gg[0]);
    $dg = $db->quote($gg[1]);
    array_push($stored_cmds,
       "INSERT INTO `grades` (client_id, grade, date_grade) VALUES ($cid, $grade, $dg)");
    break;
  case "!":
    if (!can_write_client($db, $userid, $cid_unquoted)) {
       $response_code = 403;
       break;
    }
    $gg = explode('|', $ua[2]);
    $grade = $db->quote($gg[0]);
    $dg = $db->quote($gg[1]);
    array_push($stored_cmds,
       "DELETE FROM `grades` WHERE `client_id`=$cid AND `grade`=$grade AND `date_grade`=$dg");
    break;

  // config info:
  case "c": // update per-club info
    $club_id = $ua[3];
    $quoted_club_id = $db->quote($ua[3]);
    if (!can_write_club($db, $userid, $club_id)) {
       $response_code = 403;
       break;
    }
    array_push($stored_cmds,
       "UPDATE `club` SET $action=$newvalue WHERE `id`=$quoted_club_id;");
    break;
    break;
  case "E": // new global session
    if (!is_admin($db, $userid)) {
       $response_code = 403;
       break;
    }
    $seqno = $db->quote($ua[3]);
    array_push($stored_cmds,
       "INSERT INTO `session` (seqno, name) VALUES ($seqno, $newvalue);");
    break;
  case "e": // update global session info
    if (!is_admin($db, $userid)) {
       $response_code = 403;
       break;
    }
    $seqno = $db->quote($ua[3]);
    array_push($stored_cmds,
       "UPDATE `session` SET $action=$newvalue WHERE `seqno`=$seqno;");
    break;
  case "F": // new per-club session info
    $club_id = $ua[3];
    $seqno = $db->quote($ua[4]);
    if (!can_write_club($db, $userid, $club_id)) {
       $response_code = 403;
       break;
    }
    $quoted_club_id = $db->quote($ua[3]);
    array_push($stored_cmds,
       "INSERT INTO `session_club` (`seqno`, `club`, `$action`) VALUES ($seqno, $quoted_club_id, $newvalue);");
    break;
  case "f": // update per-club session info
    $club_id = $ua[3];
    $id = $db->quote($ua[4]);
    if (!can_write_club($db, $userid, $club_id)) {
       $response_code = 403;
       break;
    }
    $quoted_club_id = $db->quote($ua[3]);
    array_push($stored_cmds,
       "UPDATE `session_club` SET $action=$newvalue WHERE `id`=$id AND `club`=$quoted_club_id;");
    break;
  case "R": // new cours
    $session_seqno = $db->quote($ua[2]);
    $short_desc = $db->quote($ua[3]);
    $club_id = $ua[4];
    if (!can_write_club($db, $userid, $club_id)) {
       $response_code = 403;
       break;
    }
    $quoted_club_id = $db->quote($ua[4]);
    array_push($stored_cmds,
       "INSERT INTO `club_cours` (`club_id`, `session_seqno`, `short_desc`) VALUES ($club_id, $session_seqno, $short_desc);");
    break;
  case "r":
    $id = $db->quote($ua[2]);
    $newvalue = $db->quote($ua[3]);
    $club_id = $ua[4];
    if (!can_write_club($db, $userid, $club_id)) {
       $response_code = 403;
       break;
    }
    $quoted_club_id = $db->quote($ua[4]);
    array_push($stored_cmds,
       "UPDATE `club_cours` SET $action=$newvalue WHERE `id`=$id AND `club_id`=$quoted_club_id;");
    break;
  case "O": // delete cours
    $id = $db->quote($ua[2]);
    $club_id = $ua[4];
    if (!can_write_club($db, $userid, $club_id)) {
       $response_code = 403;
       break;
    }
    $quoted_club_id = $db->quote($ua[4]);
    array_push($stored_cmds,
       "DELETE FROM `club_cours` WHERE `id`=$id AND `club_id`=$quoted_club_id;");
    break;
  case "P": // new prix
    $newvalue = $db->quote($ua[2]); // frais
    $club_id = $ua[3];
    $quoted_club_id = $db->quote($ua[3]);
    if ($quoted_club_id == "'null'") {
       $quoted_club_id = 'NULL';
    }
    $session_seqno = $db->quote($ua[4]);
    $division_abbrev = $db->quote($ua[5]);
    $cours_id = $db->quote($ua[6]);

    if (!can_write_club($db, $userid, $club_id)) {
       $response_code = 403;
       break;
    }
    array_push($stored_cmds,
       "INSERT INTO `prix` (`frais`, `club_id`, `session_seqno`, `division_abbrev`, `cours_id`) VALUES ($newvalue, $quoted_club_id, $session_seqno, $division_abbrev, $cours_id);");
    break;
  case "p": // update prix
    $id = $db->quote($ua[2]);
    $newvalue = $db->quote($ua[3]); // frais
    $club_id = $ua[4];
    $quoted_club_id = $db->quote($ua[4]);
    if ($quoted_club_id == "'null'") {
       $club_id_frag = 'IS NULL';
    } else {
       $club_id_frag = '= ' . $quoted_club_id;
    }
    $session_seqno = $db->quote($ua[5]);
    $division_abbrev = $db->quote($ua[6]);
    $cours_id = $db->quote($ua[7]);

    if (!can_write_club($db, $userid, $club_id)) {
       $response_code = 403;
       break;
    }
    array_push($stored_cmds,
       "UPDATE `prix` SET frais=$newvalue WHERE `id`=$id AND `club_id` $club_id_frag AND `session_seqno`=$session_seqno AND `division_abbrev`=$division_abbrev AND `cours_id` = $cours_id;");
    break;
  case "Q": // delete prix
    $id = $db->quote($ua[2]);
    $club_id = $ua[4];
    if (!can_write_club($db, $userid, $club_id)) {
       $response_code = 403;
       break;
    }
    $quoted_club_id = $db->quote($ua[4]);
    // never used, not implemented
    break;
  case "Z": // new escompte
    $id = $db->quote($ua[2]);
    $nom = $db->quote($ua[3]);
    $amount_percent = $db->quote($ua[4]);
    $amount_absolute = $db->quote($ua[5]);
    $club_id = $ua[6];
    if (!can_write_club($db, $userid, $club_id)) {
       $response_code = 403;
       break;
    }
    $quoted_club_id = $db->quote($ua[6]);
    array_push($stored_cmds,
       "INSERT INTO `escompte` (`id`, `club_id`, `nom`, `amount_percent`, `amount_absolute`) VALUES ($id, $quoted_club_id, $nom, $amount_percent, $amount_absolute);");
    break;
  case "z": // update escompte
    $id = $db->quote($ua[2]);
    $newvalue = $db->quote($ua[3]);
    $club_id = $ua[4];
    if (!can_write_club($db, $userid, $club_id)) {
       $response_code = 403;
       break;
    }
    $quoted_club_id = $db->quote($ua[4]);
    array_push($stored_cmds,
       "UPDATE `escompte` SET $action=$newvalue WHERE `id`=$id AND `club_id`=$quoted_club_id;");
    break;
  case "J": // new produit
    $id = $db->quote($ua[2]);
    $nom = $db->quote($ua[3]);
    $montant = $db->quote($ua[4]);
    $club_id = $ua[5];
    if (!can_write_club($db, $userid, $club_id)) {
       $response_code = 403;
       break;
    }
    $quoted_club_id = $db->quote($ua[5]);
    array_push($stored_cmds,
       "INSERT INTO `produit` (`id`, `club_id`, `nom`, `montant`) VALUES ($id, $quoted_club_id, $nom, $montant);");
    break;
  case "j": // update produit
    $id = $db->quote($ua[2]);
    $newvalue = $db->quote($ua[3]);
    $club_id = $ua[4];
    if (!can_write_club($db, $userid, $club_id)) {
       $response_code = 403;
       break;
    }
    $quoted_club_id = $db->quote($ua[4]);
    array_push($stored_cmds,
       "UPDATE `produit` SET $action=$newvalue WHERE `id`=$id AND `club_id`=$quoted_club_id;");
    break;
  }
}

/*echo "<pre>";
print_r ($stored_cmds);
echo "</pre>";*/

/* https://code.google.com/p/google-web-toolkit/issues/detail?id=624 */
http_response_code($response_code);

$_SESSION[$guid] = $stored_cmds;

?>
