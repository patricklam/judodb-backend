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

if (isset($_POST['server_id']))
//fwrite($fh, "server says sid $sid\n");
  $sid = $_POST['server_id'];
else {
  $rs = db_query_get("SELECT (id) FROM `client` WHERE " .
                     "nom='$nom' AND prenom='$prenom' AND ddn='$ddn'");

  if (isset($rs)) {
    $sid = $rs[0]["id"];
//fwrite($fh, "alleged sid $sid\n");
  } else {
//fwrite($fh, "INSERT INTO `client` (nom, prenom, ddn) VALUES ('$nom', '$prenom', '$ddn')\n");
    $sid = db_query_set(
      "INSERT INTO `client` (nom, prenom, ddn) VALUES ('$nom', '$prenom', '$ddn')");
    }
}

//fclose($fh);

$updates = "";
foreach ($ALL_FIELDS as $f) {
  $v = db_escape($_POST[$f]);
  $updates .= ", $f='$v'";
}
$updates=substr($updates, 1);

db_query_set("UPDATE `client` SET $updates WHERE id='$sid'");

print($sid);

?>

