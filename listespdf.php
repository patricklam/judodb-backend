<? 

require ('fpdf/fpdf.php');
require ('_produce_fpdi_output.php');

// no need for authentication on this PHP file.

$pdf = new FPDF('P', 'mm', 'Letter');
$pdf->AddPage();

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

$data = iconv("UTF-8", "ISO-8859-1", $_POST['data']);
$ds = explode("*", $data);


$display = array(false, false, true, true, false, true, false, true, false, false, false, false, false, false);
$w = array(-1, -1, 45, 45, -1, 18, -1, 35, -1, -1, -1, -1, 70);
produceOutput($pdf, $ts, $sts, $ds, $c, $multi, $display, $w, false);

$pdf->Output();
?>