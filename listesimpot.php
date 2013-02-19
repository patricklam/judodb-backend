<? 

require ('fpdf/fpdf.php');
require ('fpdi/fpdi.php');
require ('produceoutput.php');
setlocale(LC_TIME, 'fr_CA.iso88591');

// no need for authentication on this PHP file.

$pdf =& new FPDI('P', 'mm', 'Letter');

$pagecount = $pdf->setSourceFile('recu-impot.pdf'); 
$tplidx = $pdf->importPage(1, '/MediaBox'); 
$pdf->SetAutoPageBreak(false);

$pdf->addPage(); 
$pdf->useTemplate($tplidx); 

$pdf->SetFont('Times', '', 14);

$c = explode('|', $_POST['auxdata']);
$club = $c[0];
$clubno = $c[1];
// ["cid", "Nom", "DDN", "Frais"]
$COLS = 4;
$x = array(170, 76, 152, 48);
$y = array(42, 74.5, 74.5, 68);
$INCREMENT = 133.0;

$actualCount = 0;
$data = iconv("UTF-8", "ISO-8859-1", $_POST['data_full']);
$ds = explode("*", $data);
$allCount = count($ds);
for ($i = 0; $i < $allCount; $i++) {
    if ($ds[$i] == '') continue;

    if (($i % 2 == 0) && ($i > 0)) {
       $pdf->addPage(); 
       $pdf->useTemplate($tplidx); 
    }

    $effOff = ($i % 2) * $INCREMENT;
    $d = explode("|", $ds[$i]);

    $date = strftime("%d %b %Y");
    $pdf->SetXY(134, 94 + $effOff);
    $pdf->Cell(0, 0, $date);

    for ($j = 0; $j < $COLS; $j++) {
        $pdf->SetXY($x[$j], $y[$j] + $effOff);
        $pdf->Cell(0, 0, $d[$j]);
    }
    $actualCount++;
}
$pdf->AddPage();

$pdf->Output();
?>
