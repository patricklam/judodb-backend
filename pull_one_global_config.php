<?
require ('_authutils.php');

require_authentication();

header('content-type: text/xml');
echo "<?xml version=\"1.0\"?>";

require ('_constants.php');
require ('_database.php');

db_connect() || die;

print "<config>";

$rs = db_query_get("SELECT * FROM `session`");
for ($i = 0; $i < count($rs); $i++) {
    print "<session>";
    foreach ($SESSION_FIELDS as $f) {
        print "<$f>" . $rs[$i][$f] . "</$f>";
    }
    print "</session>";
}

$rs = db_query_get("SELECT * FROM `cours`");
for ($i = 0; $i < count($rs); $i++) {
    print "<cours>";
    foreach ($COURS_FIELDS as $f) {
        print "<$f>" . $rs[$i][$f] . "</$f>";
    }
    print "</cours>";
}

print "</config>";
?>
