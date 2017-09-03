<?php

require ('PHPExcel/PHPExcel.php');
require ('PHPExcel/PHPExcel/IOFactory.php');

// no need for authentication on this PHP file.

$objPHPExcel = new PHPExcel();

// to avoid need for backend smarts, use POST params for the data in the list.

$data = $_POST['data_full'];
$ds = explode("*", $data);
$allCount = count($ds);

$s = $objPHPExcel->getActiveSheet();
$s->getDefaultStyle()->getFont()->setName('Arial');
$s->setTitle('Liste complet membres');
$s->getPageSetup()->setOrientation
	(PHPExcel_Worksheet_PageSetup::ORIENTATION_PORTRAIT)
	          ->setPaperSize(PHPExcel_Worksheet_PageSetup::PAPERSIZE_LETTER);

$s->setCellValue('A1', 'Liste complet des membres')
  ->getStyle()->getAlignment()
        ->setHorizontal(PHPExcel_Style_Alignment::HORIZONTAL_CENTER);
$s->getStyle('A1')->getFont()->setSize(14);
$s->getRowDimension('1')->setRowHeight(17);
$s->mergeCells('A1:D1');
$s->setCellValue('A2', (int)(25569 + time() / 86400))
  ->getStyle()->getAlignment()
        ->setHorizontal(PHPExcel_Style_Alignment::HORIZONTAL_CENTER);
$s->getStyle("A2")->
            getNumberFormat()->setFormatCode(PHPExcel_Style_NumberFormat::FORMAT_DATE_YYYYMMDD);
$s->getStyle('A2')->getFont()->setSize(14);
$s->getRowDimension('2')->setRowHeight(17);
$s->mergeCells('A2:D2');

$r = 5;

$format = explode(",", str_replace("'","", $_POST['format']));
$fs = array_flip($format);

for ($j = 0; $j < count($format); $j++) {
    $s->setCellValueByColumnAndRow($j, 4, $format[$j]);
}

$actualCount = 0;
for ($i = 0; $i < $allCount-1; $i++) {
    $d = explode("|", $ds[$i]);
    for ($j = 0; $j < count($d); $j++)
        $s->setCellValueByColumnAndRow($j, $r, $d[$j]);

    $s->getStyleByColumnAndRow($fs["carteresident"], $r)->getAlignment()->setHorizontal(PHPExcel_Style_Alignment::HORIZONTAL_RIGHT);
    $s->getStyleByColumnAndRow($fs["frais_supp"], $r)->getNumberFormat()->setFormatCode('#,##0.00_-"$"');
    $s->getStyleByColumnAndRow($fs["frais"], $r)->getNumberFormat()->setFormatCode('#,##0.00_-"$"');
    $s->getStyleByColumnAndRow($fs["a_payer"], $r)->getNumberFormat()->setFormatCode('#,##0.00_-"$"');
    $actualCount++; $r++;
}

for ($c = 'A'; $c < 'S'; $c++)
    $s->getColumnDimension($c)->setAutoSize(true);

// some manual fixes:
$letters = 'ABCDEFGHIJKLMN';
$s->getColumnDimension($letters[$fs["id"]])->setAutoSize(false)->setWidth(6);
$s->getColumnDimension($letters[$fs["sexe"]])->setAutoSize(false)->setWidth(6);
$s->getColumnDimension($letters[$fs["JC"]])->setAutoSize(false)->setWidth(11);
$s->getColumnDimension($letters[$fs["ddn"]])->setAutoSize(false)->setWidth(11);
$s->getColumnDimension($letters[$fs["codepostale"]])->setAutoSize(false)->setWidth(10);

$r++;
$s->setCellValue("A$r", "Nombre inscrit: $actualCount");

// redirect output to client browser
header('Content-Type: application/vnd.ms-excel');
header('Content-Disposition: attachment;filename="cours.xls"');
header('Cache-Control: max-age=0');

$objWriter = PHPExcel_IOFactory::createWriter($objPHPExcel, 'Excel5');
$objWriter->save('php://output');
?>
