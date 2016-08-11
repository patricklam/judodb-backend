<?php
require_once ('_dbconfig.php');
require_once ('../_pdo.php');
require_once ('../_authutils.php');
require_once ('../_userutils.php');

$db = NULL;
try {
  $db = pdo_db_connect();
  require_authentication($db);
  $userid = get_user_id($db);
  if (!is_admin($db, $userid)) {
    die;
  }
} catch (PDOException $e) {
  // no big deal
}

if ($db != NULL) {
  $d = $db->prepare("DROP DATABASE $DBI_DATABASE");
  $d->execute();
  $db = NULL;
}
$pdo = new PDO("mysql:host=$DBI_HOST", $DBI_USERNAME, $DBI_PASSWORD);
$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
$pdo->query("CREATE DATABASE IF NOT EXISTS $DBI_DATABASE");
$pdo = NULL;

shell_exec("mysql --user=$DBI_USERNAME --password=$DBI_PASSWORD --host=$DBI_HOST $DBI_DATABASE " .
           "< db_empty.sql");
return 0;
?>
