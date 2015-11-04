<?php

// Creates a set of SQL commands to store the given POST input,
// store it in $_SESSION and keyed with the provided guid.
// Start the set of SQL commands with the $sid.
// TODO: check that logged-in user gets to modify this client.

function generate_cmds($db, $args) {
  global $GLOBAL_FIELDS, $ALL_FIELDS, $GRADES_FIELDS, $SERVICE_FIELDS, $SESSION_FIELDS, $COURS_FIELDS, $CATEGORIES_FIELDS, $CATEGORIE_SESSION_FIELDS, $ESCOMPTE_FIELDS, $MISC_FIELDS;

  $guid = $args['guid'];

  // Get a server id.
  $nom = $db->quote($args['nom']);
  $prenom = $db->quote($args['prenom']);
  $ddn = $db->quote($args['ddn']);
  if (isset($args['sid']) && $args['sid'] != '') {
    $sid = $db->quote($args['sid']);
    $new_client = FALSE;
  } else {
    $squery = $db->prepare('INSERT INTO `client` (nom, prenom, ddn) VALUES (:nom, :prenom, :ddn)');
    $squery->execute(array('nom' => $nom, 'prenom' => $prenom, 'ddn' => $ddn));
    $sid = $db->lastInsertId();
    $new_client = TRUE;
  }
  $stored_cmds = array($sid);

  // for existing clients, check that user had permission to access previously
  // consequence: only an admin can add a client to a new club
  if (!$new_client) {
    $userid = get_user_id($db);
    if (!is_admin($db, $userid)) {
      $auth_query = $db->prepare('SELECT COUNT(*) FROM `services`, `user_club` '.
                                  'WHERE services.client_id=:id '.
                                   'AND services.club_id=user_club.club_id '.
                                   'AND user_club.user_id=:userid');
      // NOTE: id must be unquoted: execute already quotes
      $aparams=array(':id' => $args['sid'], ':userid' => $userid);
      $auth_query->execute($aparams);
      if ($auth_query->fetchColumn() == 0) return array();
    }
  }

  // Handle 'deleted' requests.
  if ($args['deleted'] == 'true') {
    array_push($stored_cmds,"DELETE FROM `client` WHERE id=$sid");
    array_push($stored_cmds,"DELETE FROM `grades` WHERE client_id=$sid");
    array_push($stored_cmds,"DELETE FROM `services` WHERE client_id=$sid");
    array_push($stored_cmds,"DELETE FROM `payment_group_members` WHERE client_id=$sid");
    array_push($stored_cmds,"DELETE FROM `payment` WHERE client_id=$sid");

    print($stored_cmds);
    $_SESSION[$guid] = $stored_cmds;
    exit();
  }

  // Generate updates to client data.

  $updates = "";
  foreach ($ALL_FIELDS as $f) {
    $v = $db->quote($args[$f]);
    $updates .= ", $f=$v";
  }
  $updates=substr($updates, 1);

  array_push($stored_cmds, "UPDATE `client` SET $updates WHERE id=$sid");

  // update grade: 4D,3D,2D,1D;2009-03-22,2002-11-10,1998-11-08,1996-11-03
  $grades=explode(',', $args['grades_encoded']); 
  $date_grade=explode(',', $args['grade_dates_encoded']);

  array_push($stored_cmds, "DELETE FROM `grades` WHERE client_id=$sid");
  $i = 0;
  foreach ($grades as $g) {
    $gg = $db->quote($g);
    $dg = $db->quote($date_grade[$i]);
    array_push($stored_cmds, 
               "INSERT INTO `grades` (client_id, grade, date_grade) ".
               "VALUES ($sid,$gg,$dg)");
    $i++; 
  }

  // update services info; create lists
  array_push($stored_cmds, "DELETE FROM `services` WHERE client_id=$sid");

  $service_namelist = '(client_id';
  foreach ($SERVICE_FIELDS as $s) {
    $sfs[$s] = explode(',', $args[$s.'_encoded']);
    $service_namelist .= ", $s";
  }
  $service_namelist .= ')';

  $i = 0;
  foreach ($sfs['date_inscription'] as $s) {
    // we definitely generate an empty service at the end, skip it
    if ($sfs['date_inscription'][$i] == '') continue;

    $service_tuple = "VALUES ($sid";
    foreach ($SERVICE_FIELDS as $s) {
      // boolean fields: don't quote them.
      if ($sfs[$s][$i] == 'true' || $sfs[$s][$i] == 'false')
        $service_tuple .= ", ".$sfs[$s][$i] . "";
      else
        $service_tuple .= ", ".$db->quote($sfs[$s][$i]) . "";
    }
    $service_tuple .= ")";

    array_push($stored_cmds, 
               "INSERT INTO `services` $service_namelist $service_tuple");
    $i++; 
  }

  // Delete old payment info.
  array_push($stored_cmds, "DELETE FROM `payment` WHERE client_id=$sid");
  return $stored_cmds;
}

?>
