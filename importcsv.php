<?
// Imports the uploaded CSV file into the database.

require ('_constants.php');
require ('_database.php');
require ('_authutils.php');

require_authentication();

db_connect() || die;

?>