var store = new DataStore();
store.init();

var cours = getElementById('cours');
for (var i = 0; i < COURS.length; i++)
  cours.add(new Option(COURS[i], i), null);
var cat = getElementById('catSelect');
for (var i = 0; i < CATEGORY_ABBREVS.length; i++)
  cat.add(new Option(CATEGORY_ABBREVS[i], i), null);
var grmin = getElementById('gradeMin');
for (var i = 0; i < GRADE_ORDER.length; i++)
  grmin.add(new Option(GRADE_ORDER[i], i), null);
var grmax = getElementById('gradeMax');
for (var i = 0; i < GRADE_ORDER.length; i++)
  grmax.add(new Option(GRADE_ORDER[i], i), null);

var headNames = ["ft", "nom", "prenom", "sexe", "grade", "dategrade", "tel", "judoqc", "ddn", "cat", "verif", "cours", "cours_id"];

refreshResults();

var act='';
var isFiltering = false;

var inMainMode = true;
var inEditMode = false;
var inFtMode = false;
var inGCoursMode = false;

function addMetaData() {
    var c = getElementById('cours'); var cs = c.selectedIndex;
    if (isFiltering || cs > 0) {
	// single class
	getElementById('multi').value = '0';
	if (isFiltering) {
	    if (c.value != -1)
		getElementById('title').value = c[cs].text;
	    else
		getElementById('title').value = '';

	    getElementById('subtitle').value = '';
	    if (cat.value != -1)
		getElementById('subtitle').value += CATEGORY_NAMES[cat.value] + ' ';
	    if (grmin.value != -1)
		getElementById('subtitle').value += grmin[grmin.selectedIndex].text + ' ';
	    if (grmax.value != -1 && grmax.value != grmin.value)
		getElementById('subtitle').value += 'à ' + grmax[grmax.selectedIndex].text + ' ';
	} else {
	    getElementById('title').value = c[cs].text;
	    getElementById('subtitle').value = 
		('Entraineur: ' + COURS_ENTRAINEURS[cs-1]);
	}
	getElementById('short_title').value = COURS_SHORT[cs-1];
    }
    else {
	// all classes
	getElementById('multi').value = '1';
	getElementById('title').value = '';
	getElementById('subtitle').value = '';
	getElementById('short_title').value = '';
	for (var i = 0; i < COURS.length; i++) {
	    getElementById('title').value += c[i+1].text + '|';
	    getElementById('subtitle').value += 
		'Entraineur: ' + COURS_ENTRAINEURS[i] + '|';
	    getElementById('short_title').value += COURS_SHORT[i] + '|';
	}
    }
}

function chooseAction() {
    getElementById('form').action = 'listes'+act+'.php';
    getElementById('form').target = '_';
}

function refreshResults() {
  var re = getElementById('results');
  var d = getElementById('data');
  var dv = '';

  var c = getElementById('cours'); var cs = c.selectedIndex;
  getElementById('ent').innerHTML = (isFiltering && cs > 0) ? ('Entraineur: ' + COURS_ENTRAINEURS[cs-1]) : '';
  re.removeChild(re.getElementsByTagName('tbody')[0]);

  var resultTab = document.createElement('tbody');

  var cv = getElementById('cours').value;
  var all = (cv == '-1') ? 1 : 0;
  var catv = getElementById('catSelect').value;
  var grmin = getElementById('gradeMin').value;
  var grmax = getElementById('gradeMax').value;

  var clients = doSearch(cv, all);

  var rh = document.createElement("tr");
  function appendTH(t, s, hide) {
      var c = document.createElement("th");
      var ct = document.createTextNode(t);
      c.style.textAlign = "left";
      if (hide) c.style.display = "none";
      if (s != null) {
	  var l = document.createElement("a");
	  l.href = "#";
	  l.className += "notlink-in-print";
	  l.onclick = s;
          l.initialOnClick = s;
	  l.appendChild(ct);
	  ct = l;
      }
      c.appendChild(ct);
      rh.appendChild(c);      
  }

  function tn(t) {
      return document.createTextNode(t);
  }

  function appendTD(row, t, hide) {
      if (hide === undefined) hide = false;

      var c = document.createElement("td");
      if (hide) c.style.display = "none";
      c.style.paddingRight = "1em";
      c.appendChild(t);
      row.appendChild(c);
  }

  function selectMasters(id) {
      var s = document.createElement("select");
      s.add(new Option("Senior", "S", true, false), null);
      s.add(new Option("Masters", "M", false, false), null);
      s.id = id;
      return s;
  }

  function selectCours(id, c) {
      var s = document.createElement("select");
      for (var i = 0; i < COURS_SHORT.length; i++) {
	  s.add(new Option(COURS_SHORT[i], i), null);
      }
      s.selectedIndex = c;
      s.origIndex = c;
      s.id = id;
      return s;
  }

  function checkbox(id) {
      var s = document.createElement("input");
      s.type = "checkbox";
      s.id = id;
      return s;
  }

  function makeSort(i, c) {
      var s = function(a, b) { 
	  var rv = c(a.cells[i].textContent, b.cells[i].textContent);
	  if (rv == 0) rv = stringSort(a.cells[0].textContent, b.cells[i].textContent);
	  if (rv == 0) rv = stringSort(a.cells[1].textContent, b.cells[1].textContent);
	  return rv;
      };
      return function() { 
	  var tb = resultTab.childNodes;
	  var arr = new Array();
	  var head = tb[0];
	  for (var n = 0; n < head.childNodes.length; n++)
              head.childNodes[n].firstChild.onclick = head.childNodes[n].firstChild.initialOnClick;
          head.childNodes[i+1].firstChild.onclick = 
	      makeSort(i, function (a, b) { return -c(a, b); });
	  resultTab.removeChild(head);

	  while (resultTab.hasChildNodes()) {
	      var v = tb[0];
	      arr.push(v);
	      resultTab.removeChild(v);
	  }
	  arr.sort(s);
	  resultTab.appendChild(head);
	  while (arr.length > 0) {
	      resultTab.appendChild(arr.pop());
	  }
	  d.value = collectDV();
      };
  }

  function collectDV() {
      var tb = resultTab.childNodes;
      var dv = '';
      for (var i = 1; i < resultTab.childNodes.length; i++) {
	  for (var j = 0; j < resultTab.childNodes[i].cells.length; j++)
              dv += resultTab.childNodes[i].cells[j].textContent + '|';
	  dv += '*';
      }
      return dv;
  }

  var heads =     ["", "Nom",   "Prenom", "Sexe", "Grade", "DateGrade", "Tel", "JudoQC", "DDN", "Cat", "V", "Cours", ""];
  var widthsForEditing = [-1, -1, -1, 1, 3, 8, -1, 8, -1, -1, -1, -1, -1];
  var onchange = [null, null, null, null, insertDefaultDate, null, null, null, null, null, null, null, null];
  var rawSorts = [null, stringSort, stringSort, null, gradeSort, stringSort,  null,  null, stringSort, catSort, null, coursSort, null];
  var sorts = [];
  var visibilityPredicates = [inFtMode, true, true, inEditMode || inFtMode, true, true, true, true, true, true, inEditMode, all, false];

  for (h in heads) {
    if (rawSorts[h] != null)
      s = makeSort(h-1, rawSorts[h]);
    else 
      s = null;
    appendTH(heads[h], s, !visibilityPredicates[h]);
  }

  resultTab.appendChild(rh);

  var actualClientCount = 0;
  var ddnCol = headNames.indexOf("ddn");
  for (c in clients) {
      var cc = clients[c];

      if (isFiltering) {
	  if (catv != -1 && CATEGORY_ABBREVS[catv] != cc[8])
	      continue;
	  if (grmin != -1) {
	      var g = GRADE_ORDER.indexOf(cc[3]);
	      if (g < grmin || g > grmax)
		  continue;
	  }
      }

      actualClientCount++;

      var row = document.createElement("tr");
      row.cid = cc[0];

      if (inFtMode)  {
	  appendTD(row, checkbox("sel-"+c));
      }

      for (var r = 1; r < cc.length; r++) {
	  var v = tn(cc[r]);
	  if (headNames[r] == "nom" || headNames[r] == "prenom") {
	      var vv = document.createElement("a");
	      vv.href = "editclient.html?cid="+cc[0];
	      vv.target = "_";
	      vv.className += "notlink-in-print";
	      vv.appendChild(v);
	      v = vv;
	  }
	  if (widthsForEditing[r] != -1 && inEditMode) {
	      var vv = document.createElement("input");
	      vv.type = "text";
	      vv.size = widthsForEditing[r];
              vv.onchange = onchange[r];
	      vv.origValue = cc[r];
	      vv.value = cc[r];
	      v = vv;
	  }

	  if (headNames[r] == "verif") {
	      if (inEditMode) {
		  var vv = document.createElement("input");
		  vv.type = "checkbox";
		  vv.origChecked = cc[r] == "true";
		  vv.checked = cc[r] == "true";
		  v = vv;
	      }
	  }

          appendTD(row, v, !visibilityPredicates[r]);
      }
      if (inFtMode) {
	var y = parseInt(cc[ddnCol].substring(0,4));
	if (CURRENT_SESSION_YEAR - y > AGE_MASTERS)
	  appendTD(row, selectMasters("c-"+c));
      }
      if (inGCoursMode) {
	appendTD(row, selectCours("sc-"+c, cc[cc.length-1]));
      }

      resultTab.appendChild(row);
  }
  re.appendChild(resultTab);
  d.value = collectDV();

  getElementById('nb').innerHTML = "Nombre inscrit: "+actualClientCount;
}

function doSearch(c, all) {
  var contains_current_session = '%'+CURRENT_SESSION+'%';
  var rs = db.execute('SELECT client.id,nom,prenom,sexe,grade,date_grade,tel,affiliation,ddn,cours,verification from `client`,`services`,`grades` '+
                      'WHERE deleted <> \'true\' AND '+
                        'client.id = services.client_id AND '+
                        'client.id = grades.client_id AND '+
                        'date_grade = (SELECT max(date_grade) FROM `grades` WHERE grades.client_id=client.id) AND '+
		        'saisons LIKE ? AND ((cours=?) OR ?) '+
		      'ORDER BY nom_stripped COLLATE NOCASE, prenom_stripped COLLATE NOCASE', [contains_current_session, c, all]);
  var clients = [];
  var index = 0;
  while (rs.isValidRow()) {
    clients[index] = [];
    clients[index][0] = rs.field(0);
    clients[index][1] = rs.field(1);
    clients[index][2] = rs.field(2);
    clients[index][3] = rs.field(3);
    clients[index][4] = rs.field(4).substring(0,3);
    clients[index][5] = rs.field(5);
    clients[index][6] = rs.field(6);
    clients[index][7] = rs.field(7);
    clients[index][8] = rs.field(8);
    clients[index][9] = CATEGORY_ABBREVS[computeCategoryId
      (clients[index][8].substring(0,4), clients[index][4])];
    clients[index][10] = rs.field(10);

    var cn = rs.field(9);
    clients[index][11] = COURS_SHORT[cn];
    clients[index][12] = cn;

    ++index;
    rs.next();
  }
  rs.close();

  return clients;
}

function clearFull() {
  getElementById('data_full').value = '';
}

function computeFull() {
  var contains_current_session = '%'+CURRENT_SESSION+'%';
  var rs = db.execute('SELECT nom,prenom,affiliation,ddn,courriel,adresse,ville,code_postal,tel,carte_anjou,nom_contact_urgence,tel_contact_urgence,grade,date_grade,c.short_desc from `client`,`services`,`grades`,`cours` AS c '+
                      'WHERE deleted <> \'true\' AND ' +
		        'c.seqno = services.cours AND ' +
                        'client.id = services.client_id AND '+
                        'client.id = grades.client_id AND '+
                        'date_grade = (SELECT max(date_grade) FROM `grades` WHERE grades.client_id=client.id) AND '+
		        'saisons LIKE ? '+
		      'ORDER BY nom_stripped COLLATE NOCASE, prenom_stripped COLLATE NOCASE', [contains_current_session]);
  var dv = '';
  while (rs.isValidRow()) {
      for (var i = 0; i < rs.fieldCount(); i++) {
	  if (i == 3) // splice in category
	      dv += CATEGORY_ABBREVS[computeCategoryId
				     (rs.fieldByName('ddn').substring(0,4), 
				      rs.fieldByName('grade'))]+'|';

          dv += rs.field(i) + '|';
      }

      dv += '*';
      rs.next();
  }
  rs.close();
  getElementById('data_full').value = dv;
}

function showEditElements() {
  getElementById('date_grade_span').style.display = inEditMode ?
	'block' : 'none';
  getElementById('saveorquit').style.display = inEditMode ?
	'block' : 'none';
  getElementById('clearAction').style.display = inEditMode ?
	'block' : 'none';
  getElementById('returnAction').style.display = inMainMode ?
	'none' : 'block';
  getElementById('actions').style.display = inEditMode ?
	'none' : 'block';
}

function editMode() {
  inEditMode = !inEditMode;
	inMainMode = !inEditMode;
  showEditElements();
  refreshResults();
}

function clearAllV() {
  var rs = getElementById('results').lastChild.childNodes;
  for (var rc = 0; rc < rs.length; rc++) {
    var r = rs[rc];
    if (r.firstChild.tagName == 'TH')
      continue;

    r.cells[7].firstChild.checked = false;
  }
}

function showFilterElements() {
  getElementById('cat').style.display = !isFiltering ? 'none' : 'block';
  getElementById('xls').style.display = isFiltering ? 'none' : 'inline';
  getElementById('xls2').style.display = isFiltering ? 'none' : 'inline';
  getElementById('stdTitle').style.display = isFiltering ? 'none' : '';
  getElementById('filterTitle').style.display = !isFiltering ? 'none' : '';
  getElementById('returnAction').style.display = inMainMode ?
	'none' : 'block';
}

function filterMode() {
  isFiltering = !isFiltering;
  var t = getElementById('filterText').innerHTML;
  getElementById('filterText').innerHTML = getElementById('filterAlt').innerHTML;
  getElementById('filterAlt').innerHTML = t;
  showFilterElements();
  refreshResults();
}

function mainMode() {
  inMainMode = true;
  inEditMode = false;
  inGCoursMode = false;
  inFtMode = false;
  showEditElements();
  showGCoursElements();
  showFTElements();
  refreshResults();
}

function gcoursMode() {
  inGCoursMode = !inGCoursMode;
  inMainMode = !inGCoursMode;
  showGCoursElements();
  refreshResults();
}

function showGCoursElements() {
  getElementById('saveorquit').style.display = inGCoursMode ?
	'block' : 'none';
  getElementById('returnAction').style.display = inMainMode ?
	'none' : 'block';
}

function ftMode() {
  inFtMode = !inFtMode;
  inMainMode = !inFtMode;
  showFTElements();
  refreshResults();
}

function showFTElements() {
  getElementById('ft303_span').style.display = inFtMode ?
	'block' : 'none';
  getElementById('returnAction').style.display = inMainMode ?
	'none' : 'block';
}

function insertDefaultDate() {
  if (this.value == '') return;

  var gd = getElementById('date_grade').value;
  if (gd == '') return;

  this.parentNode.nextSibling.firstChild.value = gd;
}

function updateGrade(cid, nv) {
  // if explicit date entered, just add that to the grades table.
  // no date: replace any existing 0000-00-00 grades.
  db.execute('DELETE FROM `grades` WHERE client_id=? AND date_grade="0000-00-0000"',
	       [cid]);
  db.execute('DELETE FROM `grades` WHERE client_id=? AND grade=?',
	       [cid, nv[0]]);
  db.execute('INSERT INTO `grades` VALUES (?, null, ?, ?)',
	     [cid, nv[0], nv[1]]);
  db.execute('UPDATE `client` SET version=version+1 WHERE id=?', [cid]);
}

function updateJudoQC(cid, nv) {
  db.execute('UPDATE `client` SET version=version+1, affiliation=? ' +
 	       'WHERE id=?', [nv, cid]);
}

function updateSexe(cid, nv) {
  db.execute('UPDATE `client` SET version=version+1, sexe=? '+
               'WHERE id=?', [nv, cid]);
}

function updateVerif(cid, nv) {
  db.execute('UPDATE `services` SET verification=? ' + 
 	       'WHERE client_id=?', [nv, cid]);
  db.execute('UPDATE `client` SET version=version+1 ' +
 	       'WHERE id=?', [cid]);
}

var updaters = [null, null, updateSexe, null, null, null, updateJudoQC, null, null, updateVerif, null, null];

function saveEdits() {
  var rs = getElementById('results').lastChild.childNodes;
  for (var rc = 0; rc < rs.length; rc++) {
    var r = rs[rc];
    if (r.firstChild.tagName == 'TH')
      continue;

    for (var i = 0; i < r.cells.length; i++) {
      var c = r.cells[i];
      if (c.firstChild.tagName == 'INPUT') {
        var inp = c.firstChild;
	if (inp.type == "checkbox") {
	    changed = inp.origChecked != inp.checked;
	    v = inp.checked;
	}
	else {
	    changed = inp.origValue != inp.value;
	    v = inp.value;
	}

	if (changed) {
            if (updaters[i] != null)
              updaters[i](r.cid, v);
	    if (headNames[i+1] == "dategrade")
	      updateGrade(r.cid, [c.previousSibling.firstChild.value, v]);
            if (headNames[i+1] == "grade")
              updateGrade(r.cid, [v, c.nextSibling.firstChild.value]);
	    inp.origValue = inp.value;
	    inp.origChecked = inp.checked;
        }
      }
    }
  }
}

function saveOneCoursChange(cid, newCours) {
  db.execute('UPDATE `client` SET version=version+1 ' +
 	       'WHERE client.id=?', [cid]);
  db.execute('UPDATE `services` SET cours=? ' +
 	       'WHERE services.client_id=? AND ' +
	       'saisons LIKE ?', [newCours, cid, '%'+CURRENT_SESSION+'%']);
}

function saveCoursChanges() {
  var rs = getElementById('results').lastChild.childNodes;
  for (var rc = 0; rc < rs.length; rc++) {
    var r = rs[rc];
    if (r.firstChild.tagName == 'TH')
      continue;

    for (var i = 0; i < r.cells.length; i++) {
      var c = r.cells[i];
      if (c.firstChild.tagName == 'SELECT') {
        var inp = c.firstChild;
	if (inp.origIndex != inp.selectedIndex) {
	    saveOneCoursChange(r.cid, inp.selectedIndex);
	    inp.origIndex = inp.selectedIndex;
        }
      }
    }
  }
}

function handleSubmit() {
  if (inEditMode) saveEdits();
  if (inGCoursMode) saveCoursChanges();
  inEditMode = false; inGCoursMode = false;
  showEditElements(); showGCoursElements();
  refreshResults();
}

function cancel() {
  inEditMode = false;
  inGCoursMode = false;
  showEditElements();
  refreshResults();
}

// integrate user input into data field
function makeFT() {
  var d = getElementById('data').value.split('*');
  var dnew = '';
  var gotOne = false;
  for (var dv in d) {
    var sel = getElementById('sel-'+dv);
    if (sel != null && sel.checked == true) {
      gotOne = true;
      var post = '';
      if (getElementById('s-'+dv).value == 0)
	post += 'M';
      else if (getElementById('s-'+dv).value == 1)
	post += 'F';
      post += '|';
      var cat = getElementById('c-'+dv);
      if (cat != null && cat.value == 'M')
	post += 'M';
      post += '|';
      dnew += d[dv] + post + '*';
    }
  }
  getElementById('data_full').value = dnew;
  getElementById('auxdata').value = CLUB + '|' + CLUBNO;
  if (!gotOne) { alert("Aucun judoka selectionné."); return false; }
  return true;
}