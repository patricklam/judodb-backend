var cid;

// First try the cookie; then override with the GET parameter.
// cid = readCookie("cid");

var cc = gup("cid"); if (cc != null) cid = cc; else cid = null;

var catId;
var db;
var origBlurb = getElementById("blurb").innerHTML;

store = new DataStore();
store.init();
localInit();

function localInit() {
  populateCoursEscomptes();
  if (cid)
    populateClient(cid);
  updateBlurb();
  uFrais();
  addOrRemoveVersements();
  updateNom();
  clearStatus();
}

function populateClient() {
  var rs = executeToObjects(db, 'SELECT * from `client` where id = ?', [cid])[0];
  if (!rs) { addStatus('cid not found'); return; }

  for (var i = 0; i < ALL_FIELDS.length; i++) {
    var key = ALL_FIELDS[i];
    getElementById(key).value = rs[key];
  }

  var gs = executeToObjects(db, 'SELECT id, grade, date_grade from `grades` where client_id = ?', [cid])[0];
  if (gs) {
    getElementById('grade_id').value = gs['id'];
    getElementById('grade').value = gs['grade'];
    getElementById('date_grade').value = gs['date_grade'];
  }

  updateCategorie();

  var ss = executeToObjects(db, 'SELECT * from `services` where client_id = ?', [cid])[0];
  if (ss) {
    for (i = 0; i < SERVICE_FIELDS.length; i++) {
      var key = SERVICE_FIELDS[i];
      if (getElementById(key).type == "select-one")
          getElementById(key).selectedIndex = parseInt(ss[key]);
      else
          getElementById(key).value = ss[key];
    }
    getElementById('service_id').value = ss['id'];
  }

  for (c in CHECKBOX_FIELDS) {
    var cf = CHECKBOX_FIELDS[c];
    if (getElementById(cf).value == 0 || getElementById(cf).value == 'false')
      getElementById(cf).checked = false;
    if (getElementById(cf).value == 1 || getElementById(cf).value == 'true') 
      getElementById(cf).checked = true;
    getElementById(cf).value = getElementById(cf).checked;
  }

  var pgs = db.execute('SELECT distinct c.prenom, c.nom from `payment_group_members` as o, `payment_group_members` as p, `client` as c where p.client_id = ? and o.group_id = p.group_id and o.client_id=c.id and c.id <> p.client_id', [cid]);
  if (pgs) {
    var p = '';
    while (pgs.isValidRow()) {
	p += pgs.field(0)+' '+pgs.field(1);
        pgs.next();
        if (pgs.isValidRow()) p += ', ';
    }
    pgs.close();
    getElementById('copay').value = p;
  }

  var pm = db.execute('SELECT distinct p.* from `payment` as p left outer join `payment_group_members` as pgm where p.client_id = ? or (pgm.client_id = ? and p.group_id=pgm.group_id)', [cid, cid]);

  if (pm) {
    var paiementNumber = 1;
    while (pm.isValidRow()) {
	var l = "versement"+paiementNumber+"_";
	for (v in PAYMENT_FIELDS) {
	    var vf = PAYMENT_FIELDS[v];
	    getElementById(l+vf).value = pm.fieldByName(vf);
	}

	pm.next();
	paiementNumber++; if (paiementNumber > MAX_VERSEMENTS) break;
    }
    pm.close();
  }


  addDollarsById('frais'); addDollarsById('judogi');
}

function populateCoursEscomptes() {
  var cours = getElementById('cours');
  // get rid of dummy null option first
  cours.remove(0);
  for (i = 0; i < COURS.length; i++) {
    cours.add(new Option(COURS[i], i), null);
  }

  var escompte = getElementById('escompte');
  escompte.remove(0);
  for (i = 0; i < ESCOMPTE_NAMES.length; i++) {
    escompte.add(new Option(ESCOMPTE_NAMES[i], ESCOMPTE_AMOUNTS[i]), null);
  }
}

function updateCarteAnjou() {
  getElementById("non_anjou").value = 
		  (getElementById("carte_anjou").value == '');
}

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
  var basePrice;
  if (getElementById("sessions").value == '1')
    basePrice = categoryPrix1(catId);
  else
    basePrice = categoryPrix2(catId);
  var price = basePrice;
  getElementById("categorieFrais").value = asCurrency(basePrice) + ' $';

  var escomptePct = parseFloat(getElementById("escompte").value);
  getElementById("escompte_special").readOnly = 
    (getElementById("cas_special_note").value == "");
  getElementById("saisons").readOnly = 
    (getElementById("cas_special_note").value == "");

  if (getElementById("cas_special_note").value == "")
    getElementById("escompte_special").value = "";

  var escomptePrice;

  if (escomptePct != -1) {
    getElementById("cas_special_note").parentNode.style.display="none";
    escomptePrice = -(price * escomptePct/100);
    getElementById("escompte_special").value = asCurrency(escomptePrice) + ' $';
  } else {
    getElementById("cas_special_note").parentNode.style.display="block";
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

var selfNom, selfPrenom, selfName1, selfName2;

function updateNom() {
  selfNom = stripAccent(getElementById("nom").value);
  selfPrenom = stripAccent(getElementById("prenom").value);
  selfName1 = (selfNom + " " + selfPrenom).toUpperCase();
  selfName2 = (selfPrenom + " " + selfNom).toUpperCase();
  getElementById("nom_stripped").value = selfNom;
  getElementById("prenom_stripped").value = selfPrenom;
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

function handleSubmit() {
  var rs = {};

  stripDollarsById('frais'); stripDollarsById('judogi');
  for (var i = 1; i <= MAX_VERSEMENTS; i++) {
      var l = "versement"+i+"_";

      if (getElementById(l+"montant").value != "")
	  stripDollarsById(l+"montant");
  }

  var f = ALL_FIELDS.concat(SERVICE_FIELDS);
  // XXX TODO special case grades (keep history) 
  f = f.concat(['grade_id', 'grade', 'date_grade']);

  for (i = 0; i < f.length; i++) {
    var key = f[i];
    rs[key] = getElementById(key).value;
  }

  // more grades stuff below; for now only one field for multi-fields
  if (rs['grade_id'] == -1) rs['grade_id'] = null;
  if (rs['service_id'] == -1) rs['service_id'] = null;

  // TODO must List.map once we have a list of services over multiple terms.
  for (c in CHECKBOX_FIELDS) {
    var cf = CHECKBOX_FIELDS[c];
    rs[cf] = getElementById(cf).checked;
  }

  for (s in SELECT_FIELDS) {
    var sf = SELECT_FIELDS[s];
    rs[sf] = getElementById(sf).selectedIndex;
  }

  for (f in MULTI_FIELDS) {
    rs[f] = [rs[f]];
  }
  rs['grade_id'] = [rs['grade_id']];

  rs.version++; getElementById("version").value = rs.version;

  var group = computePaymentGroup();
  rs.pgm = [];
  for (g in group) {
    var nt = stripAccent(group[g].trim().toUpperCase());

    if (nt == selfName1 || nt == selfName2) {
	rs.pgm = rs.pgm.concat(cid);
    } else {
        var cc = db.execute('SELECT id FROM `client` WHERE deleted <> \'true\' and (UPPER(prenom_stripped||" "||nom_stripped) = ? OR UPPER(nom_stripped||" "||prenom_stripped) = ?)', [nt, nt]);
	var id = cc.field(0);
	cc.close();
	rs.pgm = rs.pgm.concat(id);
    }
  }

  rs.paiements = [];
  for (i = 1; i <= MAX_VERSEMENTS; i++) {
      var l = "versement"+i+"_";
      if (!paiementEmpty(i)) {
	  rs.paiements[i-1] = {};
	  for (v in PAYMENT_FIELDS) {
	      var vf = PAYMENT_FIELDS[v];
	      rs.paiements[i-1][vf] = getElementById(l+vf).value;
	  }
      }
      addDollarsById(l+'montant');
  }

  cid = storeOneClient(cid, rs);

  addDollarsById('frais'); addDollarsById('judogi');
  clearStatus(); addStatus("Sauvegardé."); setTimeout('clearStatus()', 3000);
}

function handleDelete() {
  if (!confirm ("Êtes-vous certain de vouloir supprimer "+
                getElementById("prenom").value+" "+
                getElementById("nom").value+"?"))
    return false;

  db.execute('UPDATE `client` SET deleted=\'true\',version=version+1 WHERE id=?', [cid]);
  return true;
}

var oldDDN = getElementById("ddn").value;
function ddnChange() {
  var ddn = getElementById("ddn").value;
  if (validateDate(ddn)) {
    updateCategorie(); 
    clearStatus();
  }
  else {
    getElementById("ddn").value = oldDDN;
    setError("Date de naissance invalide.");
    setTimeout(function () { getElementById("ddn").focus(); }, 1);
  }
  var newDDN = getElementById("ddn").value;
  oldDDN = newDDN;
  updateBlurb();
  uFrais();
}

function updateBlurb() {
  var newDDN = getElementById("ddn").value;
  var today = new Date();
  var d = newDDN.split("-");
  var by = parseInt(d[0]), bm = parseInt(d[1], 10)-1, bd = parseInt(d[2], 10);
  var ny = today.getFullYear(), nm = today.getMonth(), nd = today.getDate();

  var y = ny - by; if (bm > nm || (bm == nm && bd > nd)) y--;

  var newBlurb = origBlurb;
  var nom = getElementById("prenom").value + " " + getElementById("nom").value;
  if (y >= 18) {
    newBlurb = newBlurb.replace("*nom*", nom);
    newBlurb = newBlurb.replace("*mp*", "membre");
  } else {
    newBlurb = newBlurb.replace("*nom*", 
		     "__________________________, parent ou tuteur du membre,");
    newBlurb = newBlurb.replace("*mp*", "parent");
  }
  newBlurb = newBlurb.replace("*today*", formatDate(today));
  getElementById("blurb").innerHTML = newBlurb;
}

function updateCategorie() {
  var c = getElementById("categorie");
  var y = parseInt(getElementById("ddn").value.substring(0,4));
  var grade = getElementById("grade").value;
  catId = computeCategoryId(y, grade);
  c.value = categoryName(catId);
}

function verificationView() {
  var vw = window.open('', 'verif', 'modal=yes,alwaysRaised=yes');
  vw.document.write('<title>Verification formulaire: '+getElementById('prenom').value+' '+getElementById('nom').value+'</title>');
  vw.document.write('<body><table width=\'100%\'><col width=\'15%\'');
  vw.document.write('<tr><td>Nom</td><td>' + getElementById('nom').value+'</td>');
  vw.document.write('<tr><td>Prenom</td><td>' + getElementById('prenom').value+'</td>');
  vw.document.write('<tr><td>Adresse</td><td>' + getElementById('adresse').value+'</td>');
  vw.document.write('<tr><td>Ville</td><td>' + getElementById('ville').value+'</td>');
  vw.document.write('<tr><td>Code Postal</td><td>' + getElementById('code_postal').value+'</td>');
  vw.document.write('<tr><td>T&eacute;l&eacute;phone</td><td>' + getElementById('tel').value+'</td>');
  vw.document.write('<tr><td>T&eacute;l&eacute;phone urgence</td><td>' + getElementById('tel_contact_urgence').value+'</td>');
  vw.document.write('<tr><td>Date de naissance</td><td>' + getElementById('ddn').value+'</td>');
  vw.document.write('<tr><td>No ass-maladie</td><td>' + getElementById('RAMQ').value+'</td>');
  vw.document.write('<tr><td>No r&eacute;sident Anjou</td><td>' + getElementById('carte_anjou').value+'</td>');
  vw.document.write('<tr><td>Courriel</td><td>' + getElementById('courriel').value+'</td>');

  vw.document.write('<tr><td>Cours</td><td>' + COURS[getElementById('cours').value]+'</td>');
  vw.document.write('<tr></tr><tr><td>Nom recu impot</td><td>' + getElementById('nom_recu_impot').value+'</td>');

  vw.document.write('</table>');
  vw.document.write('</body>');
  vw.document.write('</html>');
  vw.document.close();
}