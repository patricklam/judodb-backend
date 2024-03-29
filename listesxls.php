<?php

require __DIR__ . '/vendor/autoload.php';

use PhpOffice\Spreadsheet;
use PhpOffice\IOFactory;

// no need for authentication on this PHP file.

$objPHPExcel = new \PhpOffice\PhpSpreadsheet\Spreadsheet();

// to avoid need for backend smarts, use POST params for the data in the list.

if ($_POST["multi"] == "1") {
    $ts = explode("|", $_POST["title"]);
    $sts = explode("|", $_POST["subtitle"]);
    $shts = explode("|", $_POST["short_title"]);
    $c = count($shts);
} else {
    $ts = array($_POST["title"]);
    $sts = array($_POST["subtitle"]);
    $shts = array($_POST["short_title"]);
    $c = 1;
}

$sheetNum = 0;
// [*cb*, "Nom", "Prenom", "Courriel", "Sexe", "Grade", "DateGrade", "Tel", "JudoQC", "DDN", "Div", "Cours", "Cours_id"];
$COURS = 13;

$nonEmpty = FALSE;
for ($p = 0; $p < $c; $p++) {
    $data = $_POST['data'];
    $ds = explode("*", $data);
    $allCount = count($ds);

    // extra unnecessary O(n) pass to verify non-emptiness.
    $live = FALSE;
    for ($i = 0; $i < $allCount-1; $i++) {
        $d = explode("|", $ds[$i]);
        if ($c == 1 || $d[$COURS] == $p) {
	    $live = TRUE;
	    break;
        }
    }

    if (!$live) continue;
    $objPHPExcel->createSheet();
    $objPHPExcel->setActiveSheetIndex(++$sheetNum);
    $s = $objPHPExcel->getActiveSheet();
    $s->getParent()->getDefaultStyle()->getFont()->setName('Arial');
    $s->setTitle(str_replace("/","-",$shts[$p]));
    $s->getPageSetup()->setOrientation
	(\PhpOffice\PhpSpreadsheet\Worksheet\PageSetup::ORIENTATION_PORTRAIT)
	          ->setPaperSize(\PhpOffice\PhpSpreadsheet\Worksheet\PageSetup::PAPERSIZE_LETTER);

    $s->setCellValue('A1', $shts[$p])
      ->getStyle('A1')->getAlignment()
            ->setHorizontal(\PhpOffice\PhpSpreadsheet\Style\Alignment::HORIZONTAL_CENTER);
    $s->getStyle('A1')->getFont()->setSize(14);
    $s->getRowDimension('1')->setRowHeight(17);
    $s->mergeCells('A1:D1');
    // $s->setCellValue('A2', $sts[$p]);
    // $s->getStyle('A2')->getFont()->setSize(14);
    // $s->getRowDimension('2')->setRowHeight(17);
    // $s->mergeCells('A2:D2');

    $r = 4;
    $actualCount = 0;
    for ($i = 0; $i < $allCount-1; $i++) {
        $d = explode("|", $ds[$i]);

        if ($c == 1 || $d[$COURS] == $p) {
            $s->setCellValue("A$r", $d[1]); // id number
            $s->setCellValue("B$r", $d[2]); // nom
            $s->setCellValue("C$r", $d[3]); // prenom
            $s->setCellValue("D$r", $d[5]); // sexe
            $s->setCellValue("E$r", $d[6]); // grade
            $s->getCell("F$r")->setValueExplicit($d[8], 
	      	  PhpOffice\PhpSpreadsheet\Cell\DataType::TYPE_STRING); // tel
            $s->setCellValue("G$r", $d[4]); // courriel
            $s->setCellValue("H$r", $d[9]); // judoQC
	    $dd = (int)(25569 + (strtotime("$d[10] 12:00:00") / 86400));
            $s->setCellValue("I$r", $dd); // ddn
	    $s->getStyle("I$r")->
                getNumberFormat()->setFormatCode(PhpOffice\PhpSpreadsheet\Style\NumberFormat::FORMAT_DATE_YYYYMMDD);
            $s->setCellValue("J$r", $d[11]); // cat
            $actualCount++; $r++;
	}
    }
    $s->getColumnDimension('A')->setWidth(10);
    $s->getColumnDimension('B')->setWidth(20);
    $s->getColumnDimension('C')->setWidth(20);
    $s->getColumnDimension('D')->setWidth(5);
    $s->getColumnDimension('E')->setWidth(7);
    $s->getColumnDimension('F')->setWidth(16);
    $s->getColumnDimension('G')->setWidth(20);
    $s->getColumnDimension('H')->setWidth(10);
    $s->getColumnDimension('I')->setWidth(12);
    $s->getColumnDimension('J')->setWidth(5);

    $r++;
    $s->setCellValue("A$r", "Nombre inscrit: $actualCount");
    $nonEmpty = TRUE;
}
if ($nonEmpty) {
  $objPHPExcel->removeSheetByIndex(0);
  $objPHPExcel->setActiveSheetIndex(0);
} else {
  $s = $objPHPExcel->getActiveSheet();
  $s->setCellValue('A1', 'aucun judoka trouve');
}

// redirect output to client browser
header('Content-Type: application/vnd.ms-excel');
header('Content-Disposition: attachment;filename="cours.xls"');
header('Cache-Control: max-age=0');

$objWriter = new \PhpOffice\PhpSpreadsheet\Writer\Xlsx($objPHPExcel);
$objWriter->save('php://output');
?>
