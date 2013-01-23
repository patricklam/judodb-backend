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
// ["Nom", "Prenom", "Sexe", "JudoQC", "DDN", "Div", "Courriel", "Addr", "Ville", "CodePostal", "Tel", "CarteAnjou", "TelUrg", "Grade", "DateGrade", "Cours"]
$COLS = 14;
$display = array(true, true, false, true, true, false, false, false, false, false, false, false, false, true);
$x = array(128, 128, 0, 178, 51, 0, 0, 0, 0, 0, 0, 0, 0, 128);
$y = array(20, 27.5, 0, 42, 57, 0, 0, 0, 0, 0, 0, 0, 0, 42);
$INCREMENT = 81.5;

$catX = array('M' => 52, 'S' => 52, 'U21' => 71.5, 'U18' => 52, 
      'U15' => 71.5, 'U13' => 52, 'U11' => 71.5, 'U9' => 52, 'U7' => 71.5);
$catY = array('M' => 21, 'S' => 27, 'U21' => 27, 'U18' => 33.5, 
      'U15' => 33.5, 'U13' => 41, 'U11' => 41, 'U9' => 48, 'U7' => 48);

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

    $d[4] = substr($d[4], 0, 4);
    $date = str_replace("/", "     ", 
            str_replace("-", "     ", $_POST['date']));
    $pdf->SetXY(128, 34.5 + $effOff);
    $pdf->Cell(0, 0, $club);
    $pdf->SetXY(175, 34.5 + $effOff);
    $pdf->Cell(0, 0, $clubno);
    $pdf->SetXY(133, 73 + $effOff);
    $pdf->Cell(0, 0, $_POST['evt']);
    $pdf->SetXY(48, 65 + $effOff);
    $pdf->Cell(0, 0, $date);

    // division
    if (substr($d[5], -1) == 'N') $d[5] = substr($d[5], 0, -1);
    if ($d[16] == 'M') $d[5] = 'M';
    $pdf->SetXY($catX[$d[5]], $catY[$d[5]] + $effOff);
    $pdf->Cell(0, 0, 'X');

    $sx = 0;
    if ($d[2] == 'M')
      $sx = 33.2;
    if ($d[2] == 'F')
      $sx = 46.2;
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

$w = array(45, 45, -1, -1, -1, 35, -1, -1, -1, -1, 30);
$display = array(true, true, false, false, false, true, false, false, false, false, true);
produceOutput($pdf, array($_POST['evt']), array($_POST['date']), $ds, 1, false, $display, $w, false);

$pdf->Output();
?>
