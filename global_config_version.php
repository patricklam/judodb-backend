<?
require ('_constants.php');
require ('_database.php');
require ('_authutils.php');

require_authentication();

db_connect() || die;
$vs = db_query_get("SELECT version FROM `global_configuration` ORDER BY version desc");
print $vs[0]['version'];
?>

