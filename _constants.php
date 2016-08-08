<?php
$GLOBAL_FIELDS = array("nom", "prenom", "ddn", "courriel", "adresse", "ville", "code_postal", "tel", "affiliation", "carte_resident", "nom_recu_impot", "tel_contact_urgence", "sexe", "notes");
$ALL_FIELDS = $GLOBAL_FIELDS;
$GRADES_FIELDS = array("date_grade", "grade");
$SERVICE_FIELDS = array("date_inscription", "saisons", "date_affiliation_envoye", "carte_judoca_recu", "sans_affiliation", "affiliation_initiation", "affiliation_ecole", "affiliation_parascolaire", "cours", "resident", "paypal", "judogi", "escompte", "frais", "categorie_frais", "affiliation_frais", "supp_frais", "cas_special_note", "escompte_special", "affiliation_envoye", "solde", "club_id");
//$PAYMENT_FIELDS = array("mode", "chqno", "date", "montant");

$SESSION_FIELDS = array("seqno", "name", "year", "abbrev", "first_class_date", "first_signup_date", "last_class_date", "last_signup_date");
$COURS_FIELDS = array("seqno", "name", "short_desc", "entraineur");
$CATEGORIES_FIELDS = array("name", "abbrev", "years_ago", "noire");
$CATEGORIE_SESSION_FIELDS = array("session_seqno", "categorie_abbrev", "frais_1_session", "frais_2_session", "frais_judo_qc");
$ESCOMPTE_FIELDS = array("seqno", "name", "amount");
$MISC_FIELDS=array("nom_club", "numero_club", "age_masters", "frais_passeport_judoqc", "frais_nonresident_anjou", "date_versement_1", "date_versement_2", "date_versement_3", "date_versement_4", "date_versement_5", "date_versement_6");
?>
