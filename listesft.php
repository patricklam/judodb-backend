<? 

require ('fpdf/fpdf.php');
require ('fpdi/fpdi.php');
require ('produceoutput.php');

// no need for authentication on this PHP file.

$pdf =& new FPDI('P', 'mm', 'Letter');

$pagecount = $pdf->setSourceFile('ft303.pdf'); 
$tplidx = $pdf->importPage(1, '/MediaBox'); 
$pdf->SetAutoPageBreak(false);

$pdf->addPage(); 
$pdf->useTemplate($tplidx); 

// to avoid the need for syncronisation before output, use POST params 
// for the data in the list.

$pdf->SetFont('Times', '', 14);

$c = explode('|', $_POST['auxdata']);
$club = $c[0];
$clubno = $c[1];
// [ignore, "Nom", "Prenom", "Sexe", "Grade", "DateGrade", "Tel", "JudoQC", "DDN", "Cat"];
$COLS = 10;
$display = array(false, true, true, false, true, false, false, true, true, false);
$x = array(0, 130, 130, 0, 130, 0, 0, 190, 50, 60, 60);
$y = array(0, 13, 23, 0, 43, 0, 0, 43, 57, 83, 93);
$INCREMENT = 93.5;

$catX = array('M' => 45, 'S' => 45, 'U20' => 68, 'U17' => 45, 
      'U15' => 68, 'U13' => 45, 'U11' => 68, 'U9' => 45, 'U7' => 68);
$catY = array('M' => 14, 'S' => 24, 'U20' => 24, 'U17' => 31.5, 
      'U15' => 31.5, 'U13' => 40, 'U11' => 40, 'U9' => 48.5, 'U7' => 48.5);

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

    $d[8] = substr($d[8], 0, 4);
    $date = str_replace("/", "      ", 
            str_replace("-", "      ", $_POST['date']));
    $pdf->SetXY(130, 33 + $effOff);
    $pdf->Cell(0, 0, $club);
    $pdf->SetXY(190, 33 + $effOff);
    $pdf->Cell(0, 0, $clubno);
    $pdf->SetXY(140, 73 + $effOff);
    $pdf->Cell(0, 0, $_POST['evt']);
    $pdf->SetXY(43, 68 + $effOff);
    $pdf->Cell(0, 0, $date);

    // division
    if (substr($d[9], -1) == 'N') $d[9] = substr($d[9], 0, -1);
    if ($d[14] == 'M') $d[9] = 'M';
    $pdf->SetXY($catX[$d[9]], $catY[$d[9]] + $effOff);
    $pdf->Cell(0, 0, 'X');

    $sx = 0;
    if ($d[3] == 'M')
      $sx = 30.2;
    if ($d[3] == 'F')
      $sx = 43.2;
    if ($sx > 0) {
      $pdf->SetXY(60 + $sx, 57 + $effOff);
      $pdf->Cell(0, 0, "X");
    }

    for ($j = 0; $j < $COLS; $j++) {
        if (!$display[$j]) continue;
        $pdf->SetXY($x[$j], $y[$j] + $effOff);
        $pdf->Cell(0, 0, $d[$j]);
    }
    $actualCount++;
}
$pdf->AddPage();

$display = array(false, true, true, false, false, false, true, false, false, true, false);
$w = array(0, 45, 45, -1, -1, -1, 35, -1, -1, 10);
produceOutput($pdf, array($_POST['evt']), array($_POST['date']), $ds, 1, $multi, $display, $w, true);

$pdf->Output();
?>