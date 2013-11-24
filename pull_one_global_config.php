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
    print "<not_cs>true</not_cs>"; // do not store categorie_session!
    foreach ($CATEGORIES_FIELDS as $f) {
        print "<$f>" . $rs[$i][$f] . "</$f>";
    }
    print "</categorie>";
}

$rs = db_query_get("SELECT * FROM `categorie_session`");
for ($i = 0; $i < count($rs); $i++) {
    print "<categorie_session>";
    print "<cs_id>-1</cs_id><not_cat>true</not_cat>";
    foreach ($CATEGORIE_SESSION_FIELDS as $f) {
        print "<cs_$f>" . $rs[$i][$f] . "</cs_$f>";
    }
    print "</categorie_session>";
}

$rs = db_query_get("SELECT * FROM `escompte`");
for ($i = 0; $i < count($rs); $i++) {
    print "<escompte>";
    foreach ($ESCOMPTE_FIELDS as $f) {
        print "<$f>" . $rs[$i][$f] . "</$f>";
    }
    print "</escompte>";
}

$rs = db_query_get("SELECT * FROM `global_configuration` ORDER BY version LIMIT 1");
for ($i = 0; $i < count($rs); $i++) {
    print "<misc>";
    foreach ($MISC_FIELDS as $f) {
        print "<$f>" . $rs[$i][$f] . "</$f>";
    }
    print "</misc>";
}

print "</config>";
?>
