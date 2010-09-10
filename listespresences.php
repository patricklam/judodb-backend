<? 

require ('fpdf/fpdf.php');
require ('produceoutput.php');

// no need for authentication on this PHP file.

$pdf = new FPDF('L', 'mm', 'Letter');
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
        $pdf->Cell(0, 6, "multifalse");
    $ts = array(iconv("UTF-8", "ISO-8859-1", $_POST["title"]));
    $sts = array(iconv("UTF-8", "ISO-8859-1", $_POST["subtitle"]));
    $c = 1;
}

$data = iconv("UTF-8", "ISO-8859-1", $_POST['data']);
$ds = explode("*", $data);

    // ["Nom", "Prenom", "Sexe", "Grade", "DateGrade", "Tel", "JudoQC", "DDN", "Cat", "Masters", "Cours", "Cours_num"];
$display = array(true, true, false, false, false, true, false, false, false, false, false, false);
$w = array(45, 45, -1, -1, -1, 30, -1, -1, -1, -1);
produceOutput($pdf, $ts, $sts, $ds, $c, $multi, $display, $w, false, true);

$pdf->Output();
?>