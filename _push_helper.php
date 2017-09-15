<?php

// Creates a set of SQL commands to store the given POST input,
// store it in $_SESSION and keyed with the provided guid.
// Start the set of SQL commands with the $cid.
// TODO: check that logged-in user gets to modify this client.

function generate_cmds($db, $args) {
  global $GLOBAL_FIELDS, $ALL_FIELDS, $GRADES_FIELDS, $SERVICE_FIELDS, $PAYMENT_FIELDS, $SESSION_FIELDS, $COURS_FIELDS, $CATEGORIES_FIELDS, $CATEGORIE_SESSION_FIELDS, $ESCOMPTE_FIELDS, $MISC_FIELDS;

  $guid = $args['guid'];
  // avoid overwriting with empty data, e.g. due to old clients
  if (empty($args["encoded_client"])) die;
  $client = json_decode($args["encoded_client"], true);

  // Get a server id.
  $nom = $db->quote($client['nom']);
  $prenom = $db->quote($client['prenom']);
  $ddn = $db->quote($client['ddn']);
  if (isset($args['sid']) && $args['sid'] != '') {
    $cid = $db->quote($args['sid']);
    $new_client = FALSE;
  } else {
    $squery = $db->prepare('INSERT INTO `client` (nom, prenom, ddn) VALUES (:nom, :prenom, :ddn)');
    $squery->execute(array('nom' => $nom, 'prenom' => $prenom, 'ddn' => $ddn));
    $cid = $db->lastInsertId();
    $new_client = TRUE;
  }
  $stored_cmds = array($cid);

  // for existing clients, check that user had permission to access previously
  // consequence: only an admin can add a client to a new club
  if (!$new_client) {
    $userid = get_user_id($db);
    if (!can_write_client($db, $userid, $args['sid']))
      return array();
  }

  // Handle 'deleted' requests.
  if (array_key_exists("deleted", $args) && $args['deleted'] == 'true') {
    array_push($stored_cmds,"DELETE FROM `client` WHERE id=$cid");
    array_push($stored_cmds,"DELETE FROM `grades` WHERE client_id=$cid");
    array_push($stored_cmds,"DELETE FROM `services` WHERE client_id=$cid");
    array_push($stored_cmds,"DELETE FROM `payment` WHERE client_id=$cid");

    print($stored_cmds);
    $_SESSION[$guid] = $stored_cmds;
    exit();
  }

  // Generate updates to client data.

  $updates = "";
  foreach ($ALL_FIELDS as $f) {
    $v = $db->quote($client[$f]);
    $updates .= ", $f=$v";
  }
  $updates=substr($updates, 1);

  array_push($stored_cmds, "UPDATE `client` SET $updates WHERE id=$cid");

  // update grade: 4D,3D,2D,1D;2009-03-22,2002-11-10,1998-11-08,1996-11-03
  $grades = $client["grades"];

  array_push($stored_cmds, "DELETE FROM `grades` WHERE client_id=$cid");
  $i = 0;
  foreach ($grades as $g) {
    $gg = $db->quote($g["grade"]);
    $dg = $db->quote($g["date_grade"]);
    array_push($stored_cmds,
               "INSERT INTO `grades` (client_id, grade, date_grade) ".
               "VALUES ($cid,$gg,$dg)");
    $i++; 
  }

  // update services info
  $services = $client["services"];
  array_push($stored_cmds, "DELETE FROM `services` WHERE client_id=$cid");

  $service_namelist = '(client_id';
  foreach ($SERVICE_FIELDS as $s) {
    $service_namelist .= ", $s";
  }
  $service_namelist .= ')';

  $payment_namelist = '(client_id, service_id';
  foreach ($PAYMENT_FIELDS as $s) {
    $payment_namelist .= ", $s";
  }
  $payment_namelist .= ')';

  // Delete old payment info.
  array_push($stored_cmds, "DELETE FROM `payment` WHERE client_id=" . $cid);

  foreach ($services as $s) {
    $service_tuple = "VALUES ($cid";
    foreach ($SERVICE_FIELDS as $sf) {
      // boolean fields: don't quote them.
      if ($s[$sf] == 'true' || $s[$sf] == 'false')
        $service_tuple .= ", " . $s[$sf] . "";
      else
        $service_tuple .= ", " . $db->quote($s[$sf]) . "";
    }
    $service_tuple .= ")";

    array_push($stored_cmds, 
               "INSERT INTO `services` $service_namelist $service_tuple");

    if (!empty($s["paiements"])) {
      $payment_tuple = "VALUES ";
      foreach ($s["paiements"] as $pp) {
        $payment_tuple .= "($cid, LAST_INSERT_ID()";
        foreach ($PAYMENT_FIELDS as $pf) {
          $payment_tuple .= ", " . $db->quote($pp[$pf]) . "";
        }
        $payment_tuple .= "),";
      }
      $payment_tuple = substr($payment_tuple, 0, -1);
      array_push($stored_cmds, 
                 "INSERT INTO `payment` $payment_namelist $payment_tuple");
    }
  }

  return $stored_cmds;
}

?>
