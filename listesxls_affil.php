<?php
require ('_config.php');

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

$format = str_replace("'","", $_POST['format']);
$fs = array_flip(explode(",", $format));

$s = $objPHPExcel->getSheetByName('REGULIER');

$r = 6;
for ($i = 0; $i < $allCount-1; $i++) {
    $d = explode("|", $ds[$i]);
    $col = 6;
    $s->setCellValueByColumnAndRow($col++, $r, $d[$fs["JC"]]);
    $s->setCellValueByColumnAndRow($col++, $r, $d[$fs["nom"]]);
    $s->setCellValueByColumnAndRow($col++, $r, $d[$fs["prenom"]]);
    $s->setCellValueByColumnAndRow($col++, $r, $d[$fs["sexe"]]);
    $s->setCellValueByColumnAndRow($col++, $r, $d[$fs["grade"]]);
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
