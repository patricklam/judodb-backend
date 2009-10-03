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
    $seqno = $rs[$i]['seqno'];
    print "<cours>";
    foreach ($COURS_FIELDS as $f) {
        print "<$f>" . $rs[$i][$f] . "</$f>";
    }
    $gs = db_query_get("SELECT session_seqno FROM `cours_session` WHERE cours_seqno=$seqno");
    print "<session>";
    $sss = "";
    for ($j = 0; $j < count($gs); $j++) {
        $s = $gs[$j]['session_seqno'];
    	$sss .= "$s ";
    }
    print trim($sss);
    print "</session>";
    print "</cours>";
}

$rs = db_query_get("SELECT * FROM `categorie`");
for ($i = 0; $i < count($rs); $i++) {
    print "<categorie>";
    foreach ($CATEGORIES_FIELDS as $f) {
        print "<$f>" . $rs[$i][$f] . "</$f>";
    }
    print "</categorie>";
}

print "</config>";
?>
