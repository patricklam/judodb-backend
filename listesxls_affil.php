<?php
require ('_config.php');

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
$fileName = 'files/qc-judoca-2016-17.xlsx';

$objReader = PHPExcel_IOFactory::createReader($fileType);
$objPHPExcel = $objReader->load($fileName);

// to avoid need for backend smarts, use POST params for the data in the list.

$data = $_POST['data_full'];
$ds = explode("*", $data);
$allCount = count($ds);

$format = explode(",", str_replace("'","", $_POST['format']));
$fs = array_flip($format);

$s = $objPHPExcel->getSheetByName('REGULIER');
$s->getProtection()->setSheet(false);

$r = 6;
for ($i = 0; $i < $allCount-1; $i++) {
    $d = explode("|", $ds[$i]);
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
    $s->setCellValueByColumnAndRow($col++, $r, ""); // passport judo ca
    $s->setCellValueByColumnAndRow($col++, $r, ""); // passport judo qc
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
for (; $r < 505; $r++) {
    $s->setCellValueByColumnAndRow(23, $r, "");
    $s->setCellValueByColumnAndRow(24, $r, "");
}

$c = explode('|', iconv("UTF-8", "ISO-8859-1", $_POST['auxdata']));
$club = $c[0];
$clubno = $c[1];

$s->setCellValueByColumnAndRow(6, 2, $clubno);
$s->setCellValueByColumnAndRow(7, 2, $club);

$datetime = date('Ymd-Hi');
$filename = "affiliations-$clubno-$datetime.xlsx";

// redirect output to client browser
header('Content-Type: application/vnd.ms-excel');
header('Content-Disposition: attachment;filename=' . $filename);
header('Cache-Control: max-age=0');

//$objWriter = PHPExcel_IOFactory::createWriter($objPHPExcel, 'Excel5');
$objWriter = PHPExcel_IOFactory::createWriter($objPHPExcel, 'Excel2007');
$objWriter->setPreCalculateFormulas(true);
$objWriter->save('php://output');
?>
