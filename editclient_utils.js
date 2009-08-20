var cid;

// First try the cookie; then override with the GET parameter.
cid = readCookie("cid");

var cc = gup("cid"); if (cc != null) cid = cc;

var catId;
var db;

store = new DataStore();
store.init();
localInit();

function localInit() {
  populateCoursEscomptes();
  if (cid)
    populateClient(cid);
  uFrais();
  enableCustomFrais();
  clearStatus();
}

function populateClient() {
  var rs = executeToObjects(db, 'select * from `client` where id = ?', [cid])[0];
  if (!rs) { addStatus('cid not found'); return; }

  for (i = 0; i < ALL_FIELDS.length; i++) {
    key = ALL_FIELDS[i];
    getElementById(key).value = rs[key];
  }

  var rs = executeToObjects(db, 'select id, grade, date_grade from `grades` where client_id = ?', [cid])[0];
  if (rs) {
    getElementById('grade_id').value = rs['id'];
    getElementById('grade').value = rs['grade'];
    getElementById('date_grade').value = rs['date_grade'];
  }

  updateCategorie();

  var rs = executeToObjects(db, 'select * from `services` where client_id = ?', [cid])[0];
  if (rs) {
    for (i = 0; i < SERVICE_FIELDS.length; i++) {
      key = SERVICE_FIELDS[i];
      if (getElementById(key).type == "select-one")
          getElementById(key).selectedIndex = parseInt(rs[key]);
      else
          getElementById(key).value = rs[key];
    }
    getElementById('service_id').value = rs['id'];
  }

  for (c in CHECKBOX_FIELDS) {
    var cf = CHECKBOX_FIELDS[c];
    if (getElementById(cf).value == 0 || getElementById(cf).value == 'false')
      getElementById(cf).checked = false;
    if (getElementById(cf).value == 1 || getElementById(cf).value == 'true') 
      getElementById(cf).checked = true;
    getElementById(cf).value = getElementById(cf).checked;
  }

  addDollars('frais'); addDollars('judogi');
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

function addDollars(id) {
  var v = getElementById(id).value;
  if (v == '') return;

  stripDollars(id);
  getElementById(id).value += ' $';
}

function stripDollars(id) {
  var v = getElementById(id).value;
  if (v == '') return;

  if (v.substring(v.length-1, v.length) == '$')
    v = v.substring(v, v.length-1);
  getElementById(id).value = v.trim();
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

  var escompte = parseFloat(getElementById("escompte").value);
  var escomptePrice = -(price * escompte/100);
  price -= escomptePrice;
  getElementById("escompteFrais").value = asCurrency(escomptePrice) + ' $';

  var judoQCPrice = categoryPrixJQ(catId);
  if (getElementById("sans_affiliation").checked) judoQCPrice = 0;
  price += judoQCPrice;
  getElementById("affiliationFrais").value = asCurrency(judoQCPrice) + ' $';

  var ppaPrice = 0;
  if (getElementById("passeport").checked)
    ppaPrice += FRAIS_PASSEPORT_JUDO_QUEBEC;
  if (getElementById("non_anjou").checked)
    ppaPrice += FRAIS_PAS_ANJOU;

  var jv = getElementById("judogi").value;
  jv = jv.substring(0, jv.length-1);
  if (parseFloat(jv) > 0)
    ppaPrice += parseFloat(jv);

  price += ppaPrice;
  getElementById("ppaFrais").value = asCurrency(ppaPrice) + ' $';

  if (getElementById("cas_special_note").value != "")
    return getElementById("frais").value;

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
  uSolde();
}

function enableCustomFrais() {
  if (getElementById("cas_special_note").value == "" && 
      getElementById("frais").value != calcFrais())
    if (!confirm("Est-ce que vous voulez effacer le frais special?")) {
      getElementById("cas_special_note").value = 
        getElementById("old_cas_special_note").value;
      return false;
    }

  uFrais();
  getElementById("frais").disabled = 
    (getElementById("cas_special_note").value == "");
  getElementById("saisons").disabled = 
    (getElementById("cas_special_note").value == "");
  getElementById("old_cas_special_note").value = 
    getElementById("cas_special_note").value;
}

function updateModePaiement(i) {
  var dis = false;
  if (getElementById("versement"+i+"_mode").value == "2") dis = true;
  getElementById("versement"+i+"_chqno").disabled = dis;
  getElementById("versement"+i+"_date").disabled = dis;
}

function addOrRemoveVersements() {
  // garbage collect empty versements & add $s
  for (var i = 1; i <= MAX_VERSEMENTS; i++) {
      var l = "versement"+i+"_";

      if (getElementById(l+"montant").value != "")
	  addDollars(l+"montant");

      if (getElementById(l+"chqno").value=="" &&
	  getElementById(l+"date").value=="" &&
	  getElementById(l+"montant").value=="") {
	  for (var j = i; j < MAX_VERSEMENTS; j++) {
	      var l = "versement"+j+"_";
	      var m = "versement"+(j+1)+"_";

	      getElementById(l+"mode").value=getElementById(m+"mode").value;
	      getElementById(l+"chqno").value=getElementById(m+"chqno").value;
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

  for (var i = 2; i <= MAX_VERSEMENTS; i++) {
      var l = "versement"+i;
      getElementById(l).style.display="block";
      if (getElementById(l+"_chqno").value=="" &&
	  getElementById(l+"_date").value=="" &&
	  getElementById(l+"_montant").value=="") {
	  for (var j = i+1; j <= MAX_VERSEMENTS; j++) {
	      var m = "versement"+j;
	      getElementById(m).style.display='none';
	  }
	  break;
      }
  }
}

function uSolde() {
  getElementById("solde").value = getElementById("frais").value;    
}

function handleSubmit() {
  var rs = {};

  stripDollars('frais'); stripDollars('judogi');
  for (var i = 1; i <= MAX_VERSEMENTS; i++) {
      var l = "versement"+i+"_";

      if (getElementById(l+"montant").value != "")
	  stripDollars(l+"montant");
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

  // TODO must List.map once we have a list of services.
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

  cid = storeOneClient(cid, rs);

  addDollars('frais'); addDollars('judogi');

  clearStatus(); addStatus("Sauvegardé."); setTimeout('clearStatus()', 3000);
}

function handleDelete() {
  if (!confirm ("Êtes-vous certain de vouloir supprimer "+
                getElementById("prenom").value+" "+
                getElementById("nom").value+"?"))
    return false;

  db.execute('DELETE FROM `client` WHERE id=?', [cid]);
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
  oldDDN = ddn;
}

function updateCategorie() {
  var c = getElementById("categorie");
  var y = parseInt(getElementById("ddn").value.substring(0,4));
  var grade = getElementById("grade").value;
  catId = computeCategoryId(y, grade);
  c.value = categoryName(catId);
}
