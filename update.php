<?
require ('constants.php');
require ('_database.php');

db_connect() || die;

$nom = db_escape($_POST['nom']);
$prenom = db_escape($_POST['prenom']);
$ddn = db_escape($_POST['ddn']);

$fh = fopen("/tmp/updateResults", 'a');

// Let's handle conflicts like this:
// When we have a conflict per nom/prenom/ddn, we compare each field.
// Fields which are not equal (e.g. values x, y) get x || y.
// Merging x with w||x||y should give w||x||y.
// This only applies if we know we're not updating with an actual later version.

$sv = $_POST['server_version'];
if ($sv == '-1') {
  // XXX handle merge conflicts here: two people might try to add the same client.
  $cid = db_query_set(
    "INSERT INTO `client` (nom, prenom, ddn) VALUES ('$nom', '$prenom', '$ddn')");
}
else {
  $rs = db_query_get("SELECT (id) FROM `client` WHERE " .
                      "nom='$nom' AND prenom='$prenom' AND ddn='$ddn'");
  $cid = $rs[0]["id"];
}

$new_version = $_POST['version'];
$updates = "";
foreach ($ALL_FIELDS as $f) {
  if ($f == 'nom' || $f == 'prenom' || $f == 'ddn')
    continue;

  $v = db_escape($_POST[$f]);
  $updates .= ", $f='$v'";
}
$updates=substr($updates, 1);

db_query_set("UPDATE `client` SET $updates WHERE id='$cid'");

print($new_version);

fwrite($fh, "$updates\n");
fclose($fh);

?>

