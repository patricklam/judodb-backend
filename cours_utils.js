var store = new DataStore();
store.init();

var cours = getElementById('cours');
for (var i = 0; i < COURS.length; i++) {
  cours.add(new Option(COURS[i], i), null);
}
refreshResults();

var act='';
var inEditMode = false;
var inFtMode = false;

function addMetaData() {
    var c = getElementById('cours'); var cs = c.selectedIndex;
    if (cs > 0) {
	// single class
	getElementById('multi').value = '0';
	getElementById('title').value = c[cs].text;
	getElementById('subtitle').value = 
	    ('Entraineur: ' + COURS_ENTRAINEURS[cs-1]);
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
  getElementById('ent').innerHTML = cs > 0 ? ('Entraineur: ' + COURS_ENTRAINEURS[cs-1]) : '';
  re.removeChild(re.getElementsByTagName('tbody')[0]);

  var resultTab = document.createElement('tbody');

  var cv = getElementById('cours').value;
  var all = (cv == '-1') ? 1 : 0;

  var clients = doSearch(cv, all);

  var rh = document.createElement("tr");
  function appendTH(t) {
      var c = document.createElement("th");
      var ct = document.createTextNode(t);
      c.style.textAlign = "left";
      c.appendChild(ct);
      rh.appendChild(c);      
  }

  function tn(t) {
      return document.createTextNode(t);
  }

  function appendTD(row, t) {
      var c = document.createElement("td");
      c.style.paddingRight = "1em";
      c.appendChild(t);
      row.appendChild(c);
  }

  function selectSex(id, d) {
      var s = document.createElement("select");
      s.add(new Option("", "-1", false, false), null);
      s.add(new Option("M", "0", d == 'M', false), null);
      s.add(new Option("F", "1", d == 'F', false), null);
      if (d == 'M')
	  s.selectedIndex = 1;
      if (d == 'F')
	  s.selectedIndex = 2;
      s.id = id;
      return s;
  }

  function selectMasters(id) {
      var s = document.createElement("select");
      s.add(new Option("Senior", "S", true, false), null);
      s.add(new Option("Masters", "M", false, false), null);
      s.id = id;
      return s;
  }

  function checkbox(id) {
      var s = document.createElement("input");
      s.type = "checkbox";
      s.id = id;
      return s;
  }

  var heads = ["Nom", "Prenom", "Grade", "Tel", "JudoQC", "DDN", "Cat"];
  var widthsForEditing = [-1, -1, -1, 3, -1, 8, -1, -1, -1];

  if (inFtMode) 
      appendTH("");

  for (h in heads)
      appendTH(heads[h]);

  if (all) 
      appendTH("Cours");

  resultTab.appendChild(rh);

  for (c in clients) {
      var cc = clients[c];
      var row = document.createElement("tr");
      row.cid = cc[0];

      if (inFtMode)  {
	  appendTD(row, checkbox("sel-"+c));
      }
      for (var r = 1; r < cc.length; r++) {
	  var v = tn(cc[r]);
	  if (r == 1 || r == 2) {
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
	      vv.origValue = cc[r];
	      vv.value = cc[r];
	      v = vv;
	  }
          if (r < 9) // skip cours field
              appendTD(row, v);
          dv += cc[r] + '|';
      }
      if (inFtMode) {
	var y = parseInt(cc[6].substring(0,4));
	appendTD(row, selectSex("s-"+c, inferSexFromRAMQ(cc['RAMQ'])));
	if (CURRENT_SESSION_YEAR - y > AGE_MASTERS)
	  appendTD(row, selectMasters("c-"+c));
      }

      dv += '*';
      resultTab.appendChild(row);
  }
  re.appendChild(resultTab);
  d.value = dv;

  getElementById('nb').innerHTML = "Nombre inscrit: "+clients.length;
}

function doSearch(c, all) {
  var contains_current_session = '%'+CURRENT_SESSION+'%';
  var rs = db.execute('SELECT client.id,nom,prenom,grade,tel,affiliation,ddn,cours,RAMQ from `client`,`services`,`grades` '+
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
    clients[index][3] = rs.field(3).substring(0,3);
    clients[index][4] = rs.field(4);
    clients[index][5] = rs.field(5);
    clients[index][6] = rs.field(6);
    clients[index][7] = CATEGORY_ABBREVS[computeCategoryId
      (clients[index][6].substring(0,4), clients[index][3])];
    clients[index]['RAMQ'] = rs.field(8);
    if (all) {
      var cn = rs.field(7);
      clients[index][8] = COURS_SHORT[cn];
      clients[index][9] = cn;
    }
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
  var rs = db.execute('SELECT nom,prenom,affiliation,ddn,courriel,adresse,ville,code_postal,tel,carte_anjou,nom_contact_urgence,tel_contact_urgence,RAMQ,grade,date_grade,c.short_desc from `client`,`services`,`grades`,`cours` AS c '+
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
  getElementById('rightbar').style.display = inEditMode ?
	'none' : 'block';
}

function editMode() {
  inEditMode = !inEditMode;
  showEditElements();
  refreshResults();
}

function showFTElements() {
  getElementById('ft303_span').style.display = inFtMode ?
	'block' : 'none';
  getElementById('rightbar').style.display = inFtMode ?
	'none' : 'block';
}

function ftMode() {
  inFtMode = !inFtMode;
  showFTElements();
  refreshResults();
}

function updateGrade(cid, nv) {
  // if explicit date entered, just add that to the grades table.
  // no date: replace any existing 0000-00-00 grades.
  var gd = getElementById('date_grade').value;
  if (gd == '') {
    gd = '0000-00-00';
    db.execute('DELETE FROM `grades` WHERE client_id=? AND date_grade=?',
	       [cid, gd]);
  }
  db.execute('DELETE FROM `grades` WHERE client_id=? AND grade=?',
	       [cid, nv]);
  db.execute('INSERT INTO `grades` VALUES (?, null, ?, ?)',
	     [cid, nv, gd]);
  db.execute('UPDATE `client` SET version=version+1', [cid]);
}

function updateJudoQC(cid, nv) {
  db.execute('UPDATE `client` SET version=version+1, affiliation=? ' +
 	       'WHERE id=?', [nv, cid]);
}

var updaters = [null, null, updateGrade, null, updateJudoQC, null, null, null];

function handleSubmit() {
  var rs = getElementById('results').lastChild.childNodes;
  for (var rc = 0; rc < rs.length; rc++) {
    var r = rs[rc];
    if (r.firstChild.tagName == 'TH')
      continue;

    for (var i = 0; i < r.cells.length; i++) {
      var c = r.cells[i];
      if (c.firstChild.tagName == 'INPUT') {
        var inp = c.firstChild;
	if (inp.origValue != inp.value) {
	    updaters[i](r.cid, inp.value);
	    inp.origValue = inp.value;
        }
      }
    }
  }
  inEditMode = false;
  showEditElements();
  refreshResults();
}

function cancel() {
  inEditMode = false;
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