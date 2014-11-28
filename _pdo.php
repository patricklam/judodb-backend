<?php

require('_dbconfig.php');

if ($DBI_USERNAME == '') {
  die('Database configuration not set up. Please modify ' .
      '_dbconfig.php to specify a database to use. Template: _dbconfig_template.php.');
}

function pdo_db_connect() {
  global $DBI_DATABASE, $DBI_USERNAME, $DBI_PASSWORD, $DBI_HOST;
  return new PDO("mysql:host=$DBI_HOST;dbname=$DBI_DATABASE;charset=utf8",
                 $DBI_USERNAME, $DBI_PASSWORD, array(PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION));
}



?>
