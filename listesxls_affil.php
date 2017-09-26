<?php
require ('_config.php');
require_once "System.php";

$PRODUIT_PASSEPORT_JUDO_QC = 1;
$PRODUIT_PASSEPORT_JUDO_CA = 2;

function convertGrade($g) {
    switch(substr($g, 0, 3)) {
        case 'Bla': return '6 Kyu';
	case 'B/J': return '6 Kyu +';
	case 'Jau': return '5 Kyu';
	case 'J/O': return '5 Kyu +';
	case 'Ora': return '4 Kyu '; // note extra space due to bug in given Excel file
	case 'O/V': return '4 Kyu +';
	case 'Ver': return '3 Kyu';
	case 'V/B': return '3 Kyu +';
	case 'Ble': return '2 Kyu';
	case 'B/M': return '2 Kyu +';
	case 'Mar': return '1 Kyu';
	case '1D': return 'Shodan';
	case '2D': return 'Nidan';
	case '3D': return 'Sandan';
	case '4D': return 'Yondan';
	case '5D': return 'Godan';
	case '6D': return 'Rokudan';
	case '7D': return 'Shichidan';
	case '8D': return 'Hachidan';
        case '9D': return 'Kudan';
        case '10D': return 'Judan';
  }
}

require ('PHPExcel/PHPExcel.php');
require ('PHPExcel/PHPExcel/IOFactory.php');

// no need for authentication on this PHP file.

$fileType = 'Excel2007';
$fileName = Array();
$fileName['regulier'] = 'files/qc-judoca-2017-18.xlsx';
$fileName['scolaire'] = 'files/qc-judoca-scolaire-2017-18.xlsx';
$fileName['parascolaire'] = 'files/qc-judoca-parascolaire-2017-18.xlsx';
$fileName['initiation'] = 'files/qc-judoca-initiation-2017-18.xlsx';

$SHEET_NAMES = Array();
$SHEET_NAMES['regulier'] = 'REGULIER';
$SHEET_NAMES['initiation'] = 'INITIATION';
$SHEET_NAMES['scolaire'] = 'SCOLAIRE';
$SHEET_NAMES['parascolaire'] = 'SCOLAIRE';

// to avoid need for backend smarts, use POST params for the data in the list.

$data = $_POST['data_full'];
$ds = explode("*", $data);
$allCount = count($ds);
$kinds = 0;
$have = Array();
$have['scolaire'] = false; $have['parascolaire'] = false;
$have['initiation'] = false; $have['regulier'] = false;

$format = explode(",", str_replace("'","", $_POST['format']));
$fs = array_flip($format);

for ($i = 0; $i < $allCount-1; $i++) {
    $d = explode("|", $ds[$i]);
    if ($d[$fs['scolaire']] == 'true') {
        $have['scolaire'] = true; $kinds++;
    } else if ($d[$fs['parascolaire']] == 'true') {
        $have['parascolaire'] = true; $kinds++;
    } else if ($d[$fs['initiation']] == 'true') {
        $have['initiation'] = true; $kinds++;
    } else {
        $have['regulier'] = true; $kinds++;
    }
}

$many = $kinds > 1;
$zip = NULL;

if ($many) {
    $c = explode('|', $_POST['auxdata']);
    $clubno = $c[1];
    $tempdir = System::mktemp("-d affiliations-$clubno");
    $zip = new ZipArchive();
    $zfn = System::mktemp("affiliations.zip");
    if ($zip->open($zfn, ZipArchive::CREATE)!==TRUE) {
        exit("cannot open <$zfn>\n");
    }
}

if ($have['regulier']) {
    output_xls('regulier', $many, $zip);
}

if ($have['scolaire']) {
    output_xls('scolaire', $many, $zip);
}

if ($have['parascolaire']) {
    output_xls('parascolaire', $many, $zip);
}

if ($have['initiation']) {
    output_xls('initiation', $many, $zip);
}

if ($many) {
    $zip->close();
    header("Content-type: application/zip");
    header("Content-Disposition: attachment; filename=affiliations-$clubno.zip");
    header("Pragma: no-cache");
    header("Expires: 0");
    readfile($zfn);
}

function check_kind($d, $kind) {
    global $fs;
    if ($kind == 'regulier') {
        return $d[$fs['scolaire']] != 'true' && $d[$fs['parascolaire']] != 'true' &&
	       $d[$fs['initiation']] != 'true';
    }
    return $d[$fs[$kind]] == 'true';
}

function output_xls($kind, $many, $zip) {
    global $fileType, $fileName, $SHEET_NAMES, $fs, $ds, $PRODUIT_PASSEPORT_JUDO_CA, $PRODUIT_PASSEPORT_JUDO_QC;
    $allCount = count($ds);
    $objReader = PHPExcel_IOFactory::createReader($fileType);
    $objPHPExcel = $objReader->load($fileName[$kind]);

    $s = $objPHPExcel->getSheetByName($SHEET_NAMES[$kind]);
    $s->getProtection()->setSheet(false);

    $r = 6;
    for ($i = 0; $i < $allCount-1; $i++) {
        $d = explode("|", $ds[$i]);
        if (!check_kind($d, $kind)) continue;

        $produits = explode(";", $d[$fs["produits"]]);

        $col = 6;
        $s->setCellValueByColumnAndRow($col++, $r, $d[$fs["JC"]]);
        $s->setCellValueByColumnAndRow($col++, $r, $d[$fs["nom"]]);
        $s->setCellValueByColumnAndRow($col++, $r, $d[$fs["prenom"]]);
        $s->setCellValueByColumnAndRow($col++, $r, $d[$fs["sexe"]]);
        $s->setCellValueByColumnAndRow($col++, $r, convertGrade($d[$fs["grade"]]));
        $col++; // skip hidden

        $s->setCellValueByColumnAndRow($col++, $r, substr($d[$fs["ddn"]], 8, 2));
        $s->setCellValueByColumnAndRow($col++, $r, substr($d[$fs["ddn"]], 5, 2));
        $s->setCellValueByColumnAndRow($col++, $r, substr($d[$fs["ddn"]], 0, 4));
        $rn = empty($d[$fs["JC"]]) ? "N" : "R";
        $s->setCellValueByColumnAndRow($col++, $r, $rn); // if has judo ca then R else N
        $s->setCellValueByColumnAndRow($col++, $r, in_array($PRODUIT_PASSEPORT_JUDO_CA, $produits) ? "O" : "N");
        $s->setCellValueByColumnAndRow($col++, $r, in_array($PRODUIT_PASSEPORT_JUDO_QC, $produits) ? "O" : "N");
        $s->setCellValueByColumnAndRow($col++, $r, $d[$fs["courriel"]]);
        $s->setCellValueByColumnAndRow($col++, $r, ""); // comment
        $s->setCellValueByColumnAndRow($col++, $r, "Athlete/Athlète");
        $s->setCellValueByColumnAndRow($col++, $r, ""); // 2func
        $s->setCellValueByColumnAndRow($col++, $r, ""); // 3func

        $col = 33;
        $s->setCellValueByColumnAndRow($col++, $r, $d[$fs["codepostale"]]);

        $r++;
    }

    // avoid getting 400 21+s
    for (; $r <= 505; $r++) {
        $s->setCellValueByColumnAndRow(23, $r, "");
        $s->setCellValueByColumnAndRow(24, $r, "");
    }

    // huh, iconv does the opposite of the right thing. Weird.
    //$c = explode('|', iconv("UTF-8", "ISO-8859-1", $_POST['auxdata']));
    $c = explode('|', $_POST['auxdata']);
    $club = $c[0];
    $clubno = $c[1];
    $club_addr = str_replace('_', ',', $c[5]);

    $s->setCellValueByColumnAndRow(6, 2, $clubno);
    $s->setCellValueByColumnAndRow(7, 2, $club);

    $s->setCellValueByColumnAndRow(10, 2, $c[2]);
    $s->setCellValueByColumnAndRow(13, 2, $c[3]);
    $s->setCellValueByColumnAndRow(16, 2, $c[4]);
    $s->setCellValueByColumnAndRow(17, 2, $club_addr);

    $datetime = date('Ymd-Hi');
    $filename = "affiliations-$kind-$clubno-$datetime.xlsx";

    if ($many) {
        global $tempdir;
        $objWriter = PHPExcel_IOFactory::createWriter($objPHPExcel, 'Excel2007');
        $objWriter->setPreCalculateFormulas(true);
        $objWriter->save($tempdir . DIRECTORY_SEPARATOR . $filename);
        $zip->addFile($tempdir . DIRECTORY_SEPARATOR . $filename, $filename);
    } else {
        // redirect output to client browser
        header('Content-Type: application/vnd.ms-excel');
        header('Content-Disposition: attachment;filename=' . $filename);
        header('Cache-Control: max-age=0');

        //$objWriter = PHPExcel_IOFactory::createWriter($objPHPExcel, 'Excel5');
        $objWriter = PHPExcel_IOFactory::createWriter($objPHPExcel, 'Excel2007');
        $objWriter->setPreCalculateFormulas(true);
        $objWriter->save('php://output');
    }
}
?>
