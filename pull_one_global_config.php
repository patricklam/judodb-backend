<?
require ('_authutils.php');

require_authentication();

header('content-type: text/xml');
echo "<?xml version=\"1.0\"?>";

require ('_constants.php');
require ('_database.php');

db_connect() || die;

$rs = db_query_get("SELECT * FROM `session`");

print "<config>";
for ($i = 0; $i < count($rs); $i++) {
    print "<session>";
    foreach ($SESSION_FIELDS as $f) {
        print "<$f>" . $rs[$i][$f] . "</$f>";
    }
    print "</session>";
}
print "</config>";
?>
