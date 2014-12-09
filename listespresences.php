<?php

require ('fpdf/fpdf.php');
require ('_produce_fpdi_output.php');

// no need for authentication on this PHP file.

$pdf = new FPDF('L', 'mm', 'Letter');
$pdf->AddPage();

// to avoid need for backend smarts, use POST params for the data in the list.

$pdf->SetFont('Times', '', 14);

$multi = $_POST["multi"];
if ($multi == "1") {
    $ts = explode("|", iconv("UTF-8", "ISO-8859-1", $_POST['short_title']));
    $sts = "";
    // $sts = explode("|", iconv("UTF-8", "ISO-8859-1", $_POST["subtitle"]));
    $c = count($ts);
} else {
    $ts = array(iconv("UTF-8", "ISO-8859-1", $_POST['short_title']));
    $sts = "";
    // $sts = array(iconv("UTF-8", "ISO-8859-1", $_POST["subtitle"]));
    $c = 1;
}

$data = iconv("UTF-8", "ISO-8859-1", $_POST['data']);
$ds = explode("*", $data);

// [blank, id, nom, prenom, sexe, grade, dategrade, tel, JudoQC, ddn, div, cours-short-desc, cours-id, ?, ?]
$display = array(false, false, true, true, false, false, false, true, false, false, false, false, false, false);
$w = array(-1, -1, 45, 45, -1, -1, -1, 30, -1, -1, -1, -1);
produceOutput($pdf, $ts, $sts, $ds, $c, $multi, $display, $w, true);

$pdf->Output();
?>