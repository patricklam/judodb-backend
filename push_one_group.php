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

//$fh = fopen("/tmp/push", "a");

$version = $_POST['version'];
if (isset($_POST['server_id']) && $_POST['server_id'] != '-1') {
  $sid = $_POST['server_id'];
//fwrite($fh, "UPDATE `payment_groups` SET version=$version WHERE id=$sid\n");
  db_query_set("UPDATE `payment_groups` SET version=$version WHERE id=$sid");
} else {
  $sid = db_query_set(
      "INSERT INTO `payment_groups` VALUES (null, $version)");
}

$ids=explode(',', $_POST['id']); 
db_query_set("DELETE FROM `payment_group_members` WHERE group_id='$sid'");
foreach ($ids as $i) {
//fwrite($fh, "INSERT INTO `payment_group_members` ". "VALUES ('$sid','$i')");
  db_query_set("INSERT INTO `payment_group_members` ".
                 "VALUES ('$sid','$i')");
}

// update single-payer info; create lists
$payment_namelist = '(group_id';
foreach ($PAYMENT_FIELDS as $s) {
  $sfs[$s] = explode(',', $_POST[$s]);
  $payment_namelist .= ", $s";
}
$payment_namelist .= ')';

$i = 0;
db_query_set("DELETE FROM `payment` WHERE group_id='$sid'");
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

