var store = new DataStore();
store.init();

var cours = getElementById('cours');
for (var i = 0; i < COURS.length; i++) {
  cours.add(new Option(COURS[i], i), null);
}
refreshResults();

var act='';

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
  d.value = "";

  var c = getElementById('cours'); var cs = c.selectedIndex;
  getElementById('ent').innerHTML = cs > 0 ? ('Entraineur: ' + COURS_ENTRAINEURS[cs-1]) : '';
  re.removeChild(re.getElementsByTagName('tbody')[0]);

  var resultTab = document.createElement('tbody');

  var cv = getElementById('cours').value;
  var all = (cv == '-1') ? 1 : 0;

  var clients = doSearch(cv, all);

  var rh = document.createElement("tr");
  var heads = ["Nom", "Prenom", "Grade", "Tel"];

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

  for (h in heads)
      appendTH(heads[h]);

  if (all) 
      appendTH("Cours");

  resultTab.appendChild(rh);

  for (c in clients) {
      var cc = clients[c];
      var row = document.createElement("tr");

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
          if (r != 6) // skip cours field
              appendTD(row, v);
          d.value = d.value + cc[r] + '|';
      }
      d.value = d.value + '*';
      resultTab.appendChild(row);
  }
  re.appendChild(resultTab);

  getElementById('nb').innerHTML = "Nombre inscrit: "+clients.length;
}

function doSearch(c, all) {
  var contains_current_session = '%'+CURRENT_SESSION+'%';
  var rs = db.execute('SELECT client.id,nom,prenom,grade,tel,cours from `client`,`services`,`grades` '+
                      'WHERE deleted <> \'true\' AND '+
                        'client.id = services.client_id AND '+
                        'client.id = grades.client_id AND '+
                        'date_grade = (SELECT max(date_grade) FROM `grades` WHERE grades.client_id=client.id) AND '+
		        'saisons LIKE ? AND ((cours=?) OR ?)'+
		      'ORDER BY nom_stripped COLLATE NOCASE, prenom_stripped COLLATE NOCASE', [contains_current_session, c, all]);
  var clients = [];
  var index = 0;
  while (rs.isValidRow()) {
    clients[index] = [];
    clients[index][0] = rs.field(0);
    clients[index][1] = rs.field(1);
    clients[index][2] = rs.field(2);
    clients[index][3] = rs.field(3);
    clients[index][4] = rs.field(4);
    if (all) {
      var cn = rs.field(5);
      clients[index][5] = COURS_SHORT[cn];
      clients[index][6] = cn;
    }
    ++index;
    rs.next();
  }
  rs.close();

  return clients;
}
