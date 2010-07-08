<? 

require ('PHPExcel/PHPExcel.php');
require ('PHPExcel/PHPExcel/IOFactory.php');

// no need for authentication on this PHP file.

$objPHPExcel = new PHPExcel();

// to avoid the need for syncronisation before output, use POST params 
// for the data in the list.

if ($_POST["multi"] == "1") {
    $ts = explode("|", $_POST["title"]);
    $sts = explode("|", $_POST["subtitle"]);
    $shts = explode("|", $_POST["short_title"]);
    $c = count($ts);
} else {
    $ts = array($_POST["title"]);
    $sts = array($_POST["subtitle"]);
    $shts = array($_POST["short_title"]);
    $c = 1;
}

$sheetNum = 0;
// ["Nom", "Prenom", "Sexe", "Grade", "DateGrade", "Tel", "JudoQC", "DDN", "Cat", "Masters", "Cours", "Cours_num"];
$COURS = 12;
$display = array(false, true, true, false, true, false, true, true, true, false, false, false);

for ($p = 0; $p < $c; $p++) {
    $data = $_POST['data'];
    $ds = explode("*", $data);
    $allCount = count($ds);

    // extra unnecessary O(n) pass to verify non-emptiness.
    $live = FALSE;
    for ($i = 0; $i < $allCount-1; $i++) {
        $d = explode("|", $ds[$i]);
        if ($d[$COURS] == $p) {
	    $live = TRUE;
	    break;
        }
    }
    
    if (!$live) continue;

    $objPHPExcel->createSheet();
    $objPHPExcel->setActiveSheetIndex(++$sheetNum);
    $s = $objPHPExcel->getActiveSheet();
    $s->getDefaultStyle()->getFont()->setName('Arial');
    $s->setTitle($shts[$p]);
    $s->getPageSetup()->setOrientation
	(PHPExcel_Worksheet_PageSetup::ORIENTATION_PORTRAIT)
	          ->setPaperSize(PHPExcel_Worksheet_PageSetup::PAPERSIZE_LETTER);

    $s->setCellValue('A1', $ts[$p])
      ->getStyle()->getAlignment()
            ->setHorizontal(PHPExcel_Style_Alignment::HORIZONTAL_CENTER);
    $s->getStyle('A1')->getFont()->setSize(14);
    $s->getRowDimension('1')->setRowHeight(17);
    $s->mergeCells('A1:D1');
    $s->setCellValue('A2', $sts[$p]);
    $s->getStyle('A2')->getFont()->setSize(14);
    $s->getRowDimension('2')->setRowHeight(17);
    $s->mergeCells('A2:D2');

    $r = 4;
    $actualCount = 0;
    for ($i = 0; $i < $allCount-1; $i++) {
        $d = explode("|", $ds[$i]);
        if ($d[$COURS] == $p) {
            $s->setCellValue("A$r", $d[1]);
            $s->setCellValue("B$r", $d[2]);
            $s->setCellValue("C$r", $d[4]);
            $s->getCell("D$r")->setValueExplicit($d[6], 
	      	  PHPExcel_Cell_DataType::TYPE_STRING);
            $s->setCellValue("E$r", $d[7]);
	    $dd = (int)(25569 + (strtotime("$d[8] 12:00:00") / 86400));
            $s->setCellValue("F$r", $dd);
	    $s->getStyle("F$r")->
                getNumberFormat()->setFormatCode(PHPExcel_Style_NumberFormat::FORMAT_DATE_YYYYMMDD);
            $s->setCellValue("G$r", $d[9]);
            $actualCount++; $r++;
	}
    }
    $s->getColumnDimension('A')->setWidth(20);
    $s->getColumnDimension('B')->setWidth(20);
    $s->getColumnDimension('C')->setWidth(5);
    $s->getColumnDimension('D')->setWidth(16);
    $s->getColumnDimension('F')->setWidth(14);
    $s->getColumnDimension('G')->setWidth(5);

    $r++;
    $s->setCellValue("A$r", "Nombre inscrit: $actualCount");
}
$objPHPExcel->removeSheetByIndex(0);
$objPHPExcel->setActiveSheetIndex(0);

// redirect output to client browser
header('Content-Type: application/vnd.ms-excel');
header('Content-Disposition: attachment;filename="cours.xls"');
header('Cache-Control: max-age=0');

$objWriter = PHPExcel_IOFactory::createWriter($objPHPExcel, 'Excel5');
$objWriter->save('php://output');
?>
