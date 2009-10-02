
function addDollarsById(id) {
  var v = getElementById(id).value;
  if (v == '') return;

  stripDollarsById(id);
  getElementById(id).value = asCurrency(getElementById(id).value) + ' $';
}

function stripDollars(v) {
  if (v == '') return v;

  if (v.substring(v.length-1, v.length) == '$')
    v = v.substring(v, v.length-1);

  if (v.substring(0, 1) == '$')
    v = v.substring(1);

  return v.trim();    
}

function stripDollarsById(id) {
  getElementById(id).value = stripDollars(getElementById(id).value);
}

// Does not modify the frais field, but does update all other subtotalling.
function calcFrais() {
  var catId = getCatId();
  var basePrice;
  if (getElementById("sessions").value == '1')
    basePrice = categoryPrix1(catId);
  else
    basePrice = categoryPrix2(catId);
  var price = basePrice;
  getElementById("categorieFrais").value = asCurrency(basePrice) + ' $';
  upval();

  var escomptePct = parseFloat(getElementById("escompte").value);
  getElementById("escompte_special").readOnly = 
    (getElementById("cas_special_note").value == "");
  getElementById("cas_special_pct").readOnly = 
    (getElementById("cas_special_note").value == "");
  getElementById("saisons").readOnly = 
    (getElementById("cas_special_note").value == "");

  if (getElementById("cas_special_note").value == "") {
    getElementById("escompte_special").value = "";
    getElementById("cas_special_pct").value = "";      
  }

  var escomptePrice;

  if (escomptePct != -1) {
    getElementById("cas_special_note").parentNode.style.display="none";
    getElementById("cas_special_pct").parentNode.style.display="none";
    escomptePrice = -(price * escomptePct/100);
    getElementById("escompte_special").value = asCurrency(escomptePrice) + ' $';
  } else {
    getElementById("cas_special_note").parentNode.style.display="block";
    getElementById("cas_special_pct").parentNode.style.display="block";
    var e = stripDollars(getElementById("escompte_special").value);
    if (e != '')
	escomptePrice = parseFloat(e);
    else escomptePrice = 0;
    addDollarsById("escompte_special");
  }
  price += escomptePrice;

  var judoQCPrice = categoryPrixJQ(catId);
  if (getElementById("sans_affiliation").checked) judoQCPrice = 0;
  price += judoQCPrice;
  getElementById("affiliationFrais").value = asCurrency(judoQCPrice) + ' $';

  var ppaPrice = 0;
  if (getElementById("passeport").checked)
    ppaPrice += FRAIS_PASSEPORT_JUDO_QUEBEC;
  if (getElementById("non_anjou").checked)
    ppaPrice += FRAIS_PAS_ANJOU;

  var jv = stripDollars(getElementById("judogi").value);
  if (parseFloat(jv) > 0)
    ppaPrice += parseFloat(jv);

  price += ppaPrice;
  getElementById("ppaFrais").value = asCurrency(ppaPrice) + ' $';

  return asCurrency(price)+" $";
}

function calcSaison() {    
  if (getElementById("cas_special_note").value != "")
    return getElementById("saisons").value;

  var s = CURRENT_SESSION;
  if (getElementById("sessions").value == "2")
    s += " " + NEXT_SESSION;
  return s;
}

function upval() {
  getElementById("escompte_special").value = 
	stripDollars(getElementById("categorieFrais").value) * 
        getElementById("cas_special_pct").value / 100;
}

function upct() {
  getElementById("cas_special_pct").value = 
	Math.round(stripDollars(getElementById("escompte_special").value) / 
		   stripDollars(getElementById("categorieFrais").value)
		   * 100);
}

// autoupdate for date_inscription field
function ud() {
  getElementById("date_inscription").value = formatDate(new Date());
}

// autoupdate for frais field
function uFrais() {
  getElementById("saisons").value = calcSaison();
  getElementById("frais").value = calcFrais();
  uFraisFamille();
  uSolde();
  addOrRemoveVersements();
}

function updateModePaiement(i) {
  var dis = "block";
  if (getElementById("versement"+i+"_mode").value == "2") dis = "none";
  getElementById("versement"+i+"_chqno").parentNode.style.display = dis;
  getElementById("versement"+i+"_date").parentNode.style.display = dis;
}

function addOrRemoveVersements() {
  // garbage collect empty versements & add $s
  for (var i = 1; i <= MAX_VERSEMENTS; i++) {
      var l = "versement"+i+"_";

      if (getElementById(l+"montant").value != "")
	  addDollarsById(l+"montant");

      if (paiementEmpty(i)) {
	  for (var j = i; j < MAX_VERSEMENTS; j++) {
	      var l = "versement"+j+"_";
	      var m = "versement"+(j+1)+"_";

	      getElementById(l+"mode").value=getElementById(m+"mode").value;
	      getElementById(l+"chqno").value=getElementById(m+"chqno").value;
	      if (!paiementEmpty(j+1))
		  getElementById(l+"date").value=getElementById(m+"date").value;
	      getElementById(l+"montant").value=getElementById(m+"montant").value;
	  }

	  var m = "versement"+(MAX_VERSEMENTS)+"_";
	  getElementById(m+"mode").value="1";
	  getElementById(m+"mode").selectedIndex=0;
	  getElementById(m+"chqno").value='';
	  getElementById(m+"date").value='';
	  getElementById(m+"montant").value='';
      }
  }

  if (getElementById("versement1_date").value == "")
    getElementById("versement1_date").value = formatDate(new Date());

  var needMore = parseFloat(stripDollars(getElementById("solde").value)) > 0.0;

  for (var i = 1; i <= MAX_VERSEMENTS; i++) {
      var l = "versement"+i;
      getElementById(l).style.display="block";
      if (getElementById(l+"_date").value=="")
	  getElementById(l+"_date").value = SUGGESTED_PAIEMENTS[i-1];
      if (paiementEmpty(i)) {
	  for (var j = i + (needMore ? 1 : 0); j <= MAX_VERSEMENTS; j++) {
	      var m = "versement"+j;
	      getElementById(m).style.display='none';
	  }
	  break;
      }
  }
}

function uSolde() {
  var versements = 0;
  for (var i = 1; i <= MAX_VERSEMENTS; i++) {
    var fn = "versement"+i+"_montant";
    stripDollarsById(fn);
    var v = getElementById(fn).value.trim();
    addDollarsById(fn);
    if (v != '')
      versements += parseFloat(v);
  }
  var total = stripDollars(getElementById("frais").value);
  if (getElementById("frais_famille").parentNode.style.display != "none")
      total = stripDollars(getElementById("frais_famille").value);

  getElementById("solde").value = 
	parseFloat(total) - versements;
  addDollarsById("solde");
}

function hidePaiementGroup() {
  var ff = getElementById("frais_famille");
  ff.parentNode.style.display = "none";
  ff.value = "";
}

function computePaymentGroup() {
  updateNom();
  getElementById("copayError").style.display = "none";
  var gs = getElementById("copay").value;
  if (gs == "") { 
    hidePaiementGroup();
    return -1;
  }

  var group = gs.split(",");
  var foundSelf = false;

  // validate
  for (g in group) {
    var gn = stripAccent(group[g]);
    if (!isValidClient(gn)) {
	hidePaiementGroup(); 
	getElementById("copayError").style.display = "inline";
	return -1;
    }
    if (gn.toUpperCase() == selfName1 || 
	gn.toUpperCase() == selfName2)
	foundSelf = true;
  }

  if (!foundSelf) { group = group.concat(selfName2); }
  return group;
}

function uFraisFamille() {
  var group = computePaymentGroup();
  if (group == -1) return;

  var fraisTotal = 0.0;
  for (g in group) {
    var nt = stripAccent(group[g].trim().toUpperCase());

    // for self, services in db is not updated yet; take immediate value
    if (nt == selfName1 || nt == selfName2) {
	fraisTotal += parseFloat(getElementById("frais").value);
    } else {
        var rs = db.execute('SELECT frais FROM `client` JOIN `services` WHERE client.deleted <> \'true\' and ((UPPER(prenom_stripped||" "||nom_stripped) = ? OR UPPER(nom_stripped||" "||prenom_stripped) = ?) AND services.client_id=client.id)', [nt, nt]);
	var f = rs.field(0);
	rs.close();
        fraisTotal += parseFloat(f);
    }
  }

  getElementById("frais_famille").parentNode.style.display = "block";
  getElementById("frais_famille").value = fraisTotal;
  addDollarsById("frais_famille");
  uSolde();
}

function paiementEmpty(p) {
    var l = "versement"+p+"_";
    return getElementById(l+"chqno").value=="" &&
	getElementById(l+"montant").value=="";
}
