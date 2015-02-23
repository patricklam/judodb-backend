<? 
// declare(encoding='ISO-8859-1');

require ('fpdf/fpdf.php');
require ('fpdi/fpdi.php');
require ('_produce_fpdi_output.php');
setlocale(LC_TIME, 'fr_CA.iso88591');

// no need for authentication on this PHP file.

$pdf =& new FPDI('P', 'mm', 'Letter');

$pagecount = $pdf->setSourceFile('recu-impot.pdf'); 
$tplidx = $pdf->importPage(1, '/MediaBox'); 
$pdf->SetAutoPageBreak(false);

$pdf->addPage(); 
$pdf->useTemplate($tplidx); 

$pdf->SetFont('Times', '', 14);

function createEntry($pdf, $d, $i, $o) {
    // ["cid", "Nom", "DDN", "Frais"]
    $COLS = 4;
    $x = array(170, 78, 172, 48);
    $y = array(39, 72, 72, 66);
    $INCREMENT = 140.5;

    $yr = "2014/2015";
    $pdf->SetXY(175, 25.5 + $o * $INCREMENT);
    $pdf->Cell(0, 0, $yr);

    $date = strftime("%d %b %Y");
    $pdf->SetXY(134, 92 + $o * $INCREMENT);
    $pdf->Cell(0, 0, $date);

    $tresorier = "Bernard Stawarz";
    $pdf->setXY(12, 99 + $o * $INCREMENT);
    $pdf->Cell(0, 0, $tresorier);

    for ($j = 0; $j < $COLS; $j++) {
        $pdf->SetXY($x[$j], $y[$j] + $o * $INCREMENT);
        $pdf->Cell(0, 0, $d[$j]);
    }
}

$data = iconv("UTF-8", "ISO-8859-1", $_POST['data_full']);
$ds = explode("*", $data);
$allCount = count($ds);
for ($i = 0; $i < $allCount; $i++) {
    if ($ds[$i] == '') continue;
    if ($i > 0) $pdf->AddPage();
    $pdf->useTemplate($tplidx); 

    $d = explode("|", $ds[$i]);
    createEntry($pdf, $d, $i, 0);
    createEntry($pdf, $d, $i, 1);
}
$pdf->AddPage();

$pdf->Output();
?>
