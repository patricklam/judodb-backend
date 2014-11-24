<? 

require ('fpdf/fpdf.php');
require ('fpdi/fpdi.php');
require ('_produce_fpdi_output.php');

// no need for authentication on this PHP file.

$pdf =& new FPDI('P', 'mm', 'Letter');

$pagecount = $pdf->setSourceFile('ft303version2013.pdf'); 
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
// ["CID", "Nom", "Prenom", "Sexe", "JudoQC", "DDN", "Div", "Courriel", "Addr", "Ville", "CodePostal", "Tel", "CarteAnjou", "TelUrg", "Grade", "DateGrade", "Cours"]
$COLS = 15;
$display = array(false, true, true, false, true, true, false, false, false, false, false, false, false, false, true);
$x = array(0, 128, 128, 0, 178, 51, 0, 0, 0, 0, 0, 0, 0, 0, 128);
$y = array(0, 20, 27, 0, 41, 56.5, 0, 0, 0, 0, 0, 0, 0, 0, 41);
$INCREMENT = 84;

$catX = array('M' => 52, 'S' => 52, 'U21' => 71.5, 'U18' => 52, 
      'U16' => 71.5, 'U14' => 52, 'U12' => 71.5, 'U10' => 52, 'U8' => 71.5);
$catY = array('M' => 21, 'S' => 27, 'U21' => 27, 'U18' => 33.5, 
      'U16' => 33.5, 'U14' => 41, 'U12' => 41, 'U10' => 47, 'U8' => 47);

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

    $d[5] = substr($d[5], 0, 4);
    $date = str_replace("/", "     ", 
            str_replace("-", "     ", $_POST['date']));
    $pdf->SetXY(128, 33.5 + $effOff);
    $pdf->Cell(0, 0, $club);
    $pdf->SetXY(175, 33.5 + $effOff);
    $pdf->Cell(0, 0, $clubno);
    $pdf->SetXY(133, 72.5 + $effOff);
    $pdf->Cell(0, 0, $_POST['evt']);
    $pdf->SetXY(48, 65 + $effOff);
    $pdf->Cell(0, 0, $date);

    // division
    if (substr($d[6], -1) == 'N') $d[6] = substr($d[5], 0, -1);
    if ($d[18] == 'M') $d[6] = 'M';
    $pdf->SetXY($catX[$d[6]], $catY[$d[6]] + $effOff);
    $pdf->Cell(0, 0, 'X');

    $sx = 0;
    if ($d[3] == 'M')
      $sx = 33.2;
    if ($d[3] == 'F')
      $sx = 46.2;
    if ($sx > 0) {
      $pdf->SetXY(60 + $sx, 55.7 + $effOff);
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
