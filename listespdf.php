<? 

require ('fpdf/fpdf.php');

// no need for authentication on this PHP file.

$pdf = new FPDF('P', 'mm', 'Letter');
$pdf->AddPage();

// to avoid the need for syncronisation before output, use POST params 
// for the data in the list.

$pdf->SetFont('Times', '', 14);

$multi = $_POST["multi"];
if ($multi == "1") {
    $ts = explode("|", iconv("UTF-8", "ISO-8859-1", $_POST["title"]));
    $sts = explode("|", iconv("UTF-8", "ISO-8859-1", $_POST["subtitle"]));
    $c = count($ts);
} else {
    $ts = array(iconv("UTF-8", "ISO-8859-1", $_POST["title"]));
    $sts = array(iconv("UTF-8", "ISO-8859-1", $_POST["subtitle"]));
    $c = 1;
}

$notFirst = FALSE;
$COLS = 7;
for ($p = 0; $p < $c; $p++) {
    $data = iconv("UTF-8", "ISO-8859-1", $_POST['data']);
    $ds = explode("*", $data);
    $allCount = count($ds);

    // extra unnecessary O(n) pass to verify non-emptiness.
    $live = FALSE;
    for ($i = 0; $i < $allCount-1; $i++) {
        $d = explode("|", $ds[$i]);
        if ($multi == "0" || $d[$COLS+1] == $p) {
	    $live = TRUE;
	    break;
        }
    }
    
    if (!$live) continue;

    if ($notFirst)
        $pdf->AddPage();
    $notFirst = TRUE;

    $pdf->Cell(0, 6, $ts[$p], 0, 1, 'C');
    $pdf->Cell(0, 6, $sts[$p], 0, 1, 'C');
    $pdf->Ln();

    $pdf->SetFillColor(224, 235, 255);
    $fill = true;

    $w = array(45, 45, 12, 30, 20, 25, 0);
    $actualCount = 0;
    for ($i = 0; $i < $allCount-1; $i++) {
        $d = explode("|", $ds[$i]);
        if ($multi == "0" || $d[$COLS+1] == $p) {
            for ($j = 0; $j < $COLS; $j++) 
                $pdf->Cell($w[$j], 6, $d[$j], '', 0, 'L', $fill);
            $fill = !$fill;
            $pdf->Ln();
            $actualCount++;
	}
    }

    $pdf->Ln();
    $pdf->Cell(0, 6, "Nombre inscrit: $actualCount");
    if ($multi == "0") break;
}

$pdf->Output();
?>