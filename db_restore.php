<!DOCTYPE html>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
<title>Chargement d'une base des donn&eacute;es</title>
<style>
td { padding-right:1em; }
</style>
</head>
<body>

<?php
require_once ('_dbconfig.php');
require_once ('_pdo.php');
require_once ('_authutils.php');
require_once ('_userutils.php');

$db = NULL;
try {
  $db = pdo_db_connect();
  require_authentication($db);
  $userid = get_user_id($db);
  if (!is_admin($db, $userid)) {
    echo '<h1>Restoration</h1> <p>Accès administrateur requis for charger une base des données.</p></body></html>';
    die;
  }
} catch (PDOException $e) {
  // no big deal
}

if(isset($_POST["submit"])) {
  if ($db != NULL) {
    $d = $db->prepare("DROP DATABASE $DBI_DATABASE");
    $d->execute();
    $db = NULL;
  }
  $pdo = new PDO("mysql:host=$DBI_HOST", $DBI_USERNAME, $DBI_PASSWORD);
  $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
  $pdo->query("CREATE DATABASE IF NOT EXISTS $DBI_DATABASE");
  $pdo = NULL;

  shell_exec("mysql --user=$DBI_USERNAME --password=$DBI_PASSWORD --host=$DBI_HOST $DBI_DATABASE < " .
       $_FILES["dbfile"]["tmp_name"]);

  echo '<h1>Restoration</h1> <p>Chargé avec succès.</p></body></html>';
} else {
  $form = <<<EOF
<h1>Restoration: Sélection du fichier</h1> 
<p>
<form method="post" enctype="multipart/form-data">
    <label for="db">Fichier &agrave; importer: </label>
    <input type="file" name="dbfile" id="db" />
    <input type="submit" value="Charger" name="submit">
<pre id="out"></pre>
</form>

</body>
</html>
EOF;
  echo $form;
}
?>
