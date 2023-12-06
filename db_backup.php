<?php
require_once ('_dbconfig.php');
require_once ('_pdo.php');
require_once ('_authutils.php');
require_once ('_userutils.php');

$db = pdo_db_connect();
$db->setAttribute(PDO::ATTR_STRINGIFY_FETCHES, true);
require_authentication($db);
$userid = get_user_id($db);
if (!is_admin($db, $userid)) die;

$db = NULL;

exec("mysqldump --user=$DBI_USERNAME --password=$DBI_PASSWORD --host=$DBI_HOST $DBI_DATABASE > backups/db-" . date('Ymd-his'));

echo 'terminé avec succès: backups/db-' . date('Ymd-his') . '';
?>

