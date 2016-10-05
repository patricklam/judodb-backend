<?php

require ('fpdf/fpdf.php');
require ('fpdi/fpdi.php');
require ('_produce_fpdi_output.php');

// no need for authentication on this PHP file.

$pdf =& new FPDI('P', 'mm', 'Letter');

$pagecount = $pdf->setSourceFile('files/ft303version2013.pdf');
$tplidx = $pdf->importPage(1, '/MediaBox');
$pdf->SetAutoPageBreak(false);

$pdf->addPage();
$pdf->useTemplate($tplidx);

$pdf->SetFont('Times', '', 14);

$catX = array('M' => 52, 'S' => 52, 'U21' => 71.5, 'U18' => 52,
      'U16' => 71.5, 'U14' => 52, 'U12' => 71.5, 'U10' => 52, 'U8' => 71.5);
$catY = array('M' => 21, 'S' => 27, 'U21' => 27, 'U18' => 33.5,
      'U16' => 33.5, 'U14' => 41, 'U12' => 41, 'U10' => 47, 'U8' => 47);

// to avoid need for backend smarts, use POST params for the data in the list.

$format = explode(",", str_replace("'","", $_POST['format']));
$fs = array_flip($format);

$evt = iconv("UTF-8", "ISO-8859-1", $_POST['evt']);
$date = str_replace("/", "     ", str_replace("-", "     ",
                    iconv("UTF-8", "ISO-8859-1", $_POST['date'])));
$c = explode('|', iconv("UTF-8", "ISO-8859-1", $_POST['auxdata']));
$club = $c[0];
$clubno = $c[1];

$display = array("nom", "prenom", "JC", "ddn", "grade");
$x = array(128, 128, 178, 51, 128);
$y = array(20, 27, 41, 56.5, 41);

$INCREMENT = 84;

$actualCount = 0;
$data = iconv("UTF-8", "ISO-8859-1", $_POST['data_full']);
$ds = explode("*", $data);
$allCount = count($ds);
for ($i = 0; $i < $allCount; $i++) {
    if ($ds[$i] == '') continue;
    if (($i % 3 == 0) && ($i > 0)) {
       $pdf->addPage();
       $pdf->useTemplate($tplidx);
    }

    $effOff = ($i % 3) * $INCREMENT;
    $d = explode("|", $ds[$i]);
    $d[$fs["ddn"]] = substr($d[$fs["ddn"]], 0, 4);

    $pdf->SetXY(128, 33.5 + $effOff);
    $pdf->Cell(0, 0, $club);
    $pdf->SetXY(175, 33.5 + $effOff);
    $pdf->Cell(0, 0, $clubno);
    $pdf->SetXY(133, 72.5 + $effOff);
    $pdf->Cell(0, 0, $evt);
    $pdf->SetXY(48, 65 + $effOff);
    $pdf->Cell(0, 0, $date);

    // division
    if (substr($d[$fs["div"]], -1) == 'N') $d[$fs["div"]] = substr($d[$fs["div"]], 0, -1);
    if (substr($d[$fs["sm"]], 0, 1) == 'M') $d[$fs["div"]] = 'M';
    $pdf->SetXY($catX[$d[$fs["div"]]], $catY[$d[$fs["div"]]] + $effOff);
    $pdf->Cell(0, 0, 'X');

    $sx = 0;
    if ($d[$fs["sexe"]] == 'M')
      $sx = 33.2;
    if ($d[$fs["sexe"]] == 'F')
      $sx = 46.2;
    if ($sx > 0) {
      $pdf->SetXY(60 + $sx, 55.7 + $effOff);
      $pdf->Cell(0, 0, "X");
    }

    foreach ($display as $j => $key) {
        $pdf->SetXY($x[$j], $y[$j] + $effOff);
	$pdf->Cell(0, 0, $d[$fs[$key]]);
    }
    $actualCount++;
}
$pdf->AddPage();

$w = array(-1, 45, 45, -1, -1, -1, 35, -1, -1, -1, -1, 30);
$display = array(false, true, true, false, false, false, true, false, false, false, false, true);
produceOutput($pdf, array($evt), array($date), $ds, 1, false, $display, $w, false);

$pdf->Output();
?>
