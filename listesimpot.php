<?php
// declare(encoding='ISO-8859-1');

require ('fpdf/fpdf.php');
require ('fpdi/fpdi.php');
require ('_produce_fpdi_output.php');
setlocale(LC_TIME, 'fr_CA.iso88591');

// no need for authentication on this PHP file.

$pdf =& new FPDI('P', 'mm', 'Letter');

$numero_club = $_GET["numero_club"];
preg_match("/^C\d*$/", $numero_club, $output_array);
$numero_club_sanitized = $output_array[0];

$pagecount = $pdf->setSourceFile("files/recu-impot-$numero_club_sanitized.pdf");
$tplidx = $pdf->importPage(1, '/MediaBox'); 
$pdf->SetAutoPageBreak(false);

$pdf->addPage(); 
$pdf->useTemplate($tplidx); 

$pdf->SetFont('Times', '', 14);

function createEntry($pdf, $d, $i, $o) {
    // ["cid", "Nom", "nom impot", "DDN", "Frais", "Saison"]
    $coords = json_decode(str_replace('_', '.', $_POST['coords']));
    $COLS = sizeof($coords);
    $INCREMENT = 147;

    $date = strftime("%d %b %Y");
    $pdf->SetXY(134, 86 + $o * $INCREMENT);
    $pdf->Cell(0, 0, $date);

    $tresorier = iconv("UTF-8", "ISO-8859-1", $_POST["tresorier"]);
    $pdf->setXY(14, 98 + $o * $INCREMENT);
    $pdf->Cell(0, 0, $tresorier);

    for ($j = 0; $j < $COLS; $j++) {
        $pdf->SetXY($coords[$j][0], $coords[$j][1] + $o * $INCREMENT);
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
