<?
require ('constants.php');
require ('_database.php');

db_connect() || die;

$nom = db_escape($_POST['nom']);
$prenom = db_escape($_POST['prenom']);
$ddn = db_escape($_POST['ddn']);

//$fh = fopen("/tmp/updateResults", 'a');

$rs = db_query_get("SELECT (id) FROM `client` WHERE " .
                   "nom='$nom' AND prenom='$prenom' AND ddn='$ddn'");

if (isset($rs))
  $cid = $rs[0]["id"];
else
  $cid = db_query_set(
    "INSERT INTO `client` (nom, prenom, ddn) VALUES ('$nom', '$prenom', '$ddn')");

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

//fwrite($fh, "$updates\n");
//fclose($fh);

?>

