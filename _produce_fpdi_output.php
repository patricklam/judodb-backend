<?php
function produceOutput($pdf, $ts, $sts, $ds, $c, $multi, $display, $w, $grid) {
    $allCount = count($ds);
    $notFirst = FALSE;
    // new: ["Nom", "Prenom", "Sexe", "JudoQC", "DDN", "Div", "Courriel", "Addr", "Ville", "CodePostal", "Tel", "CarteAnjou", "TelUrg", "Grade", "DateGrade", "Cours"]
    $COURS = 12;
    $COLS = 11;
    $BOXES = 35;
    $EXTRAS = 5;
    for ($p = 0; $p < $c; $p++) {
        // extra unnecessary O(n) pass to verify non-emptiness.
        $live = FALSE;
        for ($i = 0; $i < $allCount-1; $i++) {
            $d = explode("|", $ds[$i]);
            if ($multi == "0" || $d[$COURS] == $p) {
    	    $live = TRUE;
    	    break;
            }
        }
        
        if (!$live) continue;

        if ($notFirst)
            $pdf->AddPage();
        $notFirst = TRUE;

        $pdf->Cell(0, 6, $ts[$p], 0, 1, 'C');
        // $pdf->Cell(0, 6, $sts[$p], 0, 1, 'C');
        $pdf->Ln();

        $pdf->SetFillColor(224, 235, 255);
        $fill = true;

        $actualCount = 0;

	if ($grid) { // space for dates
	    $fill = false;
            for ($j = 0; $j < $COLS; $j++) {
                if ($display[$j])
                    $pdf->Cell($w[$j], 12, '', '', 0, 'L', $fill);
            }
            $pdf->Cell(4, 12, '', 0, 0, 'C', $fill);
            for ($j = 0; $j < $BOXES; $j++) {
                $pdf->Cell(4, 12, '', 'RB', 0, 'C', $fill);
	    }
	    $pdf->Ln();
	    $fill = true;
	}

        for ($i = 0; $i < $allCount-1; $i++) {
            $d = explode("|", $ds[$i]);
            if ($multi == "0" || $d[$COURS] == $p) {
                for ($j = 0; $j < $COLS; $j++) {
                    if ($display[$j])
                        $pdf->Cell($w[$j], 6, $d[$j], '', 0, 'L', $fill);
                }
		if ($grid) {
		    $pdf->Cell(4, 6, '', 0, 0, 'C', $fill);
		    for ($j = 0; $j < $BOXES; $j++) {
		        $pdf->Cell(4, 6, '', 'R', 0, 'C', $fill);
		    }
		}
                $fill = !$fill;
                $pdf->Ln();
                $actualCount++;
            }
        }

	if ($grid) { // extras
	    for ($i = 0; $i < $EXTRAS; $i++) {
                for ($j = 0; $j < $COLS; $j++) {
                    if ($display[$j])
                        $pdf->Cell($w[$j], 6, '', '', 0, 'L', $fill);
                }
                $pdf->Cell(4, 6, '', 0, 0, 'C', $fill);
                for ($j = 0; $j < $BOXES; $j++) {
                    $pdf->Cell(4, 6, '', 'R', 0, 'C', $fill);
                }
                $fill = !$fill;
                $pdf->Ln();
   	    }
	}

        $pdf->Ln();
        $pdf->Cell(0, 6, "Nombre inscrit: $actualCount");
        if ($multi == "0") break;
    }
}
?>
