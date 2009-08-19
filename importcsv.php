<?
// Imports the uploaded CSV file into the database.
// Expected format of CSV: 
//  [0] prenom, [1] nom, [2] ddn, [3] cours, [4] grade, [5] # passeport, [6] tel, [7] tel urgence, [8] adresse, [9] ville, [10] cp, [11] courriel, [12] ramq, [13] carte_anjou

require ('_constants.php');
require ('_database.php');
require ('_authutils.php');

require_authentication();

?>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.or
g/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
 <title>Registration database: import CSV file</title>
 <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
</head>

<body>

<table>
<?
db_connect() || die;
$forReal = true;

if (isset($_FILES["facturation"])) {
 $fh = fopen($_FILES["facturation"]["tmp_name"], "r");
 $clientCount = 0;

 while (!feof($fh) ) {
  $client = fgetcsv($fh, 4096, ',', '"');

  $rs['nom'] = $client[1];
  $rs['prenom'] = $client[0];
  $rs['ddn'] = $client[2];
  $rs['courriel'] = $client[11];
  $rs['adresse'] = $client[8];
  $rs['ville'] = $client[9];
  $rs['code_postal'] = $client[10];
  $rs['tel'] = $client[6];
  $rs['affiliation'] = $client[5];
  $rs['carte_anjou'] = $client[13];
  $rs['nom_recu_input'] = '';
  $rs['nom_contact_urgence'] = '';
  $rs['tel_contact_urgence'] = $client[7];
  $rs['RAMQ'] = $client[12];

  if ($rs['nom'] == '') continue;

  // update main clients table
  $nom = $rs['nom']; $prenom = $rs['prenom']; $ddn = $rs['ddn'];
  $sid = db_query_set("INSERT INTO `client` (nom, prenom, ddn) VALUES ('$nom', '$prenom', '$ddn')");
  $updates = "";
  foreach ($ALL_FIELDS as $f) {
    if ($rs[$f] != 'NULL') {
      $v = db_escape($rs[$f]);
      $updates .= ", $f='$v'";
    }
  }
  $updates=substr($updates, 1);

  if ($forReal)
    db_query_set("UPDATE `client` SET $updates WHERE id='$sid'");

  // update grades table
  $grade = $client[4];
  if ($forReal)
    db_query_set("INSERT INTO `grades` (client_id, grade, date_grade) VALUES ($sid, '$grade', '')");

  // update services table 
  $cours = intval($client[3])-1;
  if ($forReal && $cours != -1)
    db_query_set("INSERT INTO `services` (client_id, date_inscription, saisons, sans_affiliation, cours, sessions, judogi, escompte, passeport, non_anjou, frais, cas_special_note, horaire_special) VALUES ($sid, '2009-01-01', '', 0, $cours, '0', '0', '0', '0', false, false, '', '')");
  $clientCount++;
  print '<tr><td>' . $rs['nom'] . '</td><td>' . $rs['prenom'] . '</td></tr>';
}

 fclose($fh);
 
 print "</table> <p>Import successful! Snarfed $clientCount entries.</p> </body> </html>";
 unlink($_FILES["facturation"]["tmp_name"]);
 exit;
}
?>

<form enctype="multipart/form-data" action="importcsv.php" method="POST">
<input type="hidden" name="MAX_FILE_SIZE" value="12000000" />
Select your .CSV file: <input name="facturation" type="file" /><br />
<input type="submit" value="Upload" />
</form>

</body>
</html>

