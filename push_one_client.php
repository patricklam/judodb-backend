<?
// Unconditionally tramples the input on the server-side DB.
// If server_id is not -1, uses it. 
//  Otherwise uses nom/prenom/ddn as key, if that matches db.
//  Otherwise creates new row on server.
// Returns server_id.
// Guarantees that server_version == c.version on exit.

require ('_constants.php');
require ('_database.php');
require ('_authutils.php');

require_authentication();

db_connect() || die;

$nom = db_escape($_POST['nom']);
$prenom = db_escape($_POST['prenom']);
$ddn = db_escape($_POST['ddn']);

//$fh = fopen("/tmp/push", "a");
//fwrite($fh, "pushing $prenom $nom\n");
//fwrite($fh, "done\n");

if (isset($_POST['server_id']) && $_POST['server_id'] != '-1') {
//fwrite($fh, "server says sid $sid\n");
  $sid = $_POST['server_id'];
} else {
  $rs = db_query_get("SELECT (id) FROM `client` WHERE " .
                     "nom='$nom' AND prenom='$prenom' AND ddn='$ddn'");

  if (isset($rs) && isset($rs[0])) {
    $sid = $rs[0]["id"];
//fwrite($fh, "alleged sid $sid\n");
}
  else {
//fwrite($fh, "INSERT INTO `client` (nom, prenom, ddn) VALUES ('$nom', '$prenom', '$ddn')\n");
    $sid = db_query_set(
      "INSERT INTO `client` (nom, prenom, ddn) VALUES ('$nom', '$prenom', '$ddn')");
    }
}

if ($_POST['deleted'] == 'true') {
  db_query_set("DELETE FROM `client` WHERE id=$sid");
  db_query_set("DELETE FROM `grades` WHERE client_id=$sid");
  db_query_set("DELETE FROM `services` WHERE client_id=$sid");
  db_query_set("DELETE FROM `payment_group_members` WHERE client_id=$sid");
  db_query_set("DELETE FROM `payment` WHERE client_id=$sid");
  db_query_set("INSERT INTO `deleted_client` VALUE ($sid)");
}

$updates = "";
foreach ($ALL_FIELDS as $f) {
  $v = db_escape($_POST[$f]);
  $updates .= ", $f='$v'";
}
$updates=substr($updates, 1);

db_query_set("UPDATE `client` SET $updates WHERE id='$sid'");

// update grade: 4D,3D,2D,1D;2009-03-22,2002-11-10,1998-11-08,1996-11-03
$grades=explode(',', $_POST['grade']); 
$date_grade=explode(',', $_POST['date_grade']);

$i = 0;
db_query_set("DELETE FROM `grades` WHERE client_id='$sid'");
foreach ($grades as $g) {
  $dg = $date_grade[$i];
  db_query_set("INSERT INTO `grades` (client_id, grade, date_grade) ".
                 "VALUES ('$sid','$g','$dg')");
  $i++; 
}

// update services info; create lists
$service_namelist = '(client_id';
foreach ($SERVICE_FIELDS as $s) {
  $sfs[$s] = explode(',', $_POST[$s]);
  $service_namelist .= ", $s";
}
$service_namelist .= ')';

$i = 0;
db_query_set("DELETE FROM `services` WHERE client_id='$sid'");
foreach ($sfs['date_inscription'] as $s) {
  $service_tuple = "VALUES ($sid";
  foreach ($SERVICE_FIELDS as $s) {
    if ($sfs[$s][$i] == 'true' || $sfs[$s][$i] == 'false')
      $service_tuple .= ", ".$sfs[$s][$i] . "";
    else
      $service_tuple .= ", '".$sfs[$s][$i] . "'";
  }
  $service_tuple .= ")";

  db_query_set("INSERT INTO `services` $service_namelist $service_tuple");
  $i++; 
}

// update single-payer info; create lists
$payment_namelist = '(client_id';
foreach ($PAYMENT_FIELDS as $s) {
  $sfs[$s] = explode(',', $_POST[$s]);
  $payment_namelist .= ", $s";
}
$payment_namelist .= ')';

$i = 0;
db_query_set("DELETE FROM `payment` WHERE client_id='$sid'");
foreach ($sfs['mode'] as $s) {
  $payment_tuple = "VALUES ($sid";
  foreach ($PAYMENT_FIELDS as $s) {
    $payment_tuple .= ", '".$sfs[$s][$i] . "'";
  }
  $payment_tuple .= ")";

  db_query_set("INSERT INTO `payment` $payment_namelist $payment_tuple");
  $i++; 
}

print($sid);

//fclose($fh);

?>

