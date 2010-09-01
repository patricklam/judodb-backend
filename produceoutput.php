<?
function produceOutput($pdf, $ts, $sts, $ds, $c, $multi, $display, $w, $only_selected) {
    $allCount = count($ds);
    $notFirst = FALSE;
    // ["Nom", "Prenom", "Sexe", "Grade", "DateGrade", "Tel", "JudoQC", "DDN", "Cat", "Masters", "Cours", "Cours_num"];
    $COLS = 10;
    for ($p = 0; $p < $c; $p++) {
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

        $actualCount = 0;
        for ($i = 0; $i < $allCount-1; $i++) {
            $d = explode("|", $ds[$i]);
            if ($onlyselected && $d[0] == '') continue;
            if ($multi == "0" || $d[$COLS+1] == $p) {
                for ($j = 0; $j < $COLS; $j++) {
                    if ($display[$j])
                        $pdf->Cell($w[$j], 6, $d[$j], '', 0, 'L', $fill);
                }
                $fill = !$fill;
                $pdf->Ln();
                $actualCount++;
            }
        }

        $pdf->Ln();
        $pdf->Cell(0, 6, "Nombre inscrit: $actualCount");
        if ($multi == "0") break;
    }
}
?>
