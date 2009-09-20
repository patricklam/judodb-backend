var cid;

var cc = gup("cid"); if (cc != null) cid = cc; else cid = null;

var db;
var origBlurb = getElementById("blurb").innerHTML;

var store = new DataStore();
store.init();
localInit();

function localInit() {
  populateCoursEscomptes();
  if (cid)
    populateClient(cid);
  updateBlurb();
  uFrais();
  upct();
  addOrRemoveVersements();
  updateNom();
  clearStatus();
}

function populateCoursEscomptes() {
  var cours = getElementById('cours');
  // get rid of dummy null option first
  cours.remove(0);
  for (var i = 0; i < COURS.length; i++) {
    cours.add(new Option(COURS[i], i), null);
  }

  var escompte = getElementById('escompte');
  escompte.remove(0);
  for (i = 0; i < ESCOMPTE_NAMES.length; i++) {
    escompte.add(new Option(ESCOMPTE_NAMES[i], ESCOMPTE_AMOUNTS[i]), null);
  }
}

function populateClient() {
  var i;

  var rs = executeToObjects(db, 'SELECT * from `client` where id = ?', [cid])[0];
  if (!rs) { addStatus('cid not found'); return; }

  for (i = 0; i < ALL_FIELDS.length; i++) {
    var key = ALL_FIELDS[i];
    getElementById(key).value = rs[key];
  }

  var gs = executeToObjects(db, 'SELECT id, grade, date_grade from `grades` WHERE client_id = ? ORDER BY date_grade DESC', [cid]);

  if (gs[0]) {
    getElementById('grade_id').value = gs[0]['id'];
    getElementById('grade').value = gs[0]['grade'];
    getElementById('date_grade').value = gs[0]['date_grade'];
  }

  var more_grades = '';
  for (i = 0; i < gs.length; i++) {
    more_grades += gs[i]['id'] + '|' + gs[i]['grade'] + '|' + gs[i]['date_grade'] + '#';
  }
  if (more_grades != '')
    getElementById('previous_grades').value = more_grades;
  populateGrades();

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

function handleSubmit() {
  var rs = {};

  stripDollarsById('frais'); stripDollarsById('judogi');
  for (var i = 1; i <= MAX_VERSEMENTS; i++) {
      var l = "versement"+i+"_";

      if (getElementById(l+"montant").value != "")
	  stripDollarsById(l+"montant");
  }

  var f = ALL_FIELDS.concat(SERVICE_FIELDS);

  for (i = 0; i < f.length; i++) {
    var key = f[i];
    rs[key] = getElementById(key).value;
  }

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

  var mg = getElementById('previous_grades').value.split("#");
  rs['grade_id'] = []; rs['grade'] = []; rs['date_grade'] = [];
  for (i in mg) {
    var m = mg[i];
    if (m == '') break;
    f = m.split("|");

    var gid = f[0]; if (gid < 0) gid = null;
    rs['grade_id'] = rs['grade_id'].concat(gid);
    rs['grade'] = rs['grade'].concat(f[1]);
    rs['date_grade'] = rs['date_grade'].concat(f[2]);
  }

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

function populateGrades() {
    var gh = getElementById('gradeHeader').textContent;
    var nom = getElementById("prenom").value + " "+getElementById("nom").value;
    gh = gh.replace("*nom*", nom);
    getElementById('gradeHeader').textContent = gh;

    var gt = getElementById('gradeTable').childNodes[1];
    if (gt.childNodes.length < 10) {
	for (var i = 0; i < MAX_GRADES; i++) {
	    var row = document.createElement("tr");
	    row.id = "gh_r"+i;
            row.style.display="none";
	    
	    var c, ci;
	    
	    c = document.createElement("td");
	    ci = document.createElement("input");
	    ci.onchange = ensureFreeGradeSpace;
	    ci.id = "grade"+i; ci.type="text"; ci.size=5;
	    ci.value = "";
	    c.appendChild(ci); row.appendChild(c);
	    
	    c = document.createElement("td");
	    ci = document.createElement("input");
	    ci.id = "grade"+i+"_date"; ci.type="text"; ci.size=10;
	    ci.value = "";
	    c.appendChild(ci); row.appendChild(c);

	    c = document.createElement("td");
	    ci = document.createElement("input");
	    ci.id = "grade"+i+"_id"; ci.type="hidden";
	    ci.value = "-1";
	    c.appendChild(ci); row.appendChild(c);
	    
	    gt.appendChild(row);
	}
    }

    var mg = getElementById('previous_grades').value.split("#");
    for (i in mg) {
	getElementById("gh_r"+i).style.display="table-row";
	var m = mg[i];
	if (m == '') break;
	var f = m.split("|");
	getElementById("grade"+i).value = f[1];
	getElementById("grade"+i+"_date").value = f[2];
	getElementById("grade"+i+"_id").value = f[0];
    }
}

function ensureFreeGradeSpace() {
    var haveFree = false, firstInvis = -1;
    for (var i = 0; i < MAX_GRADES; i++) {
	var canSee = 
	    getElementById("gh_r"+i).style.display=="table-row";
	var empty = getElementById("grade"+i).value == "";
	if (canSee && empty) haveFree = true;
	if (!canSee && firstInvis == -1) firstInvis = i;
    }
    getElementById("gh_r"+firstInvis).style.display="table-row";
}

function saveGrades() {
    var gs = new Array();
    var c = 0;
    for (var i = 0; i < MAX_GRADES; i++) {
	var gv = getElementById("grade"+i).value;
	var gdv = getElementById("grade"+i+"_date").value;
	var gidv = getElementById("grade"+i+"_id").value;

	if (gv != "")
	    gs[c++] = {g:gv, gd:gdv, gid:gidv};
    }
    gs.sort(function(a,b) { return -compareDate(a.gd, b.gd); });

    // only gs[0] is allowed to have id=-1.
    for (gg in gs) if (gg != 0 && gs[gg].gid == -2) gs[gg].gid = -1;

    var more_grades = '';
    for (gg in gs) {
	more_grades += gs[gg].gid + '|' + gs[gg].g + '|' + gs[gg].gd + '#';
    }
    if (more_grades != '')
	getElementById('previous_grades').value = more_grades;

    getElementById('gradehistory').style.display='none';

    populateGrades();
    if (gs[0].gv != '') {
	getElementById('grade').value = gs[0].g;
	getElementById('date_grade').value = gs[0].gd;
	getElementById('grade_id').value = gs[0].gid;
    }

    updateCategorie();
}

function annulerGrades() {
    for (var i = 0; i < MAX_GRADES; i++) {
	getElementById("grade"+i).value = "";
	getElementById("grade"+i+"_date").value = "";
	getElementById("grade"+i+"_id").value = "-1";
	getElementById("gh_r"+i).style.display = "none";
    }

    populateGrades();
    getElementById('gradehistory').style.display='none';
}

function updateMainPageGrade() {
    // push everything down, unless just a date change.
    if (getElementById("grade0_id").value != "-2" && 
	getElementById("grade0").value != getElementById("grade").value) {
	for (var i = MAX_GRADES-2; i >= 0; i--) {
	    getElementById("grade"+(i+1)).value = 
		getElementById("grade"+i).value;
	    getElementById("grade"+(i+1)+"_date").value =
		getElementById("grade"+i+"_date").value;
	    getElementById("grade"+(i+1)+"_id").value = 
		getElementById("grade"+i+"_id").value;
	    getElementById("gh_r"+(i+1)).style.display =
		getElementById("gh_r"+i).style.display;
	}
    }
    getElementById("grade0_id").value = -2;
    getElementById("grade0").value = getElementById("grade").value;
    getElementById("grade0_date").value = getElementById("date_grade").value;
    getElementById("gh_r0").style.display = 'table-row';
    saveGrades();
}

function showGradeHistory() {
    getElementById('gradehistory').style.display='inline';
}

function updateCarteAnjou() {
  getElementById("non_anjou").value = 
		  (getElementById("carte_anjou").value == '');
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
}

function getCatId() {
  var y = parseInt(getElementById("ddn").value.substring(0,4));
  var grade = getElementById("grade").value;
  return computeCategoryId(y, grade);
}

function updateCategorie() {
  var c = getElementById("categorie");
  c.value = categoryName(getCatId());
  uFrais();
}

// add name, plus parent stuff in blurb, if needed.
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