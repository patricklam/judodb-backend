var store = new DataStore();
store.init();

var cours = getElementById('cours');
for (var i = 0; i < COURS.length; i++) {
  cours.add(new Option(COURS[i], i), null);
}
refreshResults();

function refreshResults() {
  var re = getElementById('results');
  re.removeChild(re.getElementsByTagName('tbody')[0]);

  var resultTab = document.createElement('tbody');

  var cv = getElementById('cours').value;
  var all = (cv == '-1') ? 1 : 0;

  var clients = doSearch(cv, all);

  var rh = document.createElement("tr");
  var heads = ["Nom", "Prenom", "Grade", "Tel"];
  for (h in heads) {
      var c = document.createElement("th");
      var ct = document.createTextNode(heads[h]);
      c.appendChild(ct);
      rh.appendChild(c);
  }

  if (all) {
      var c = document.createElement("th");
      var ct = document.createTextNode("Cours");
      c.appendChild(ct);
      rh.appendChild(c);
  }
  resultTab.appendChild(rh);

  for (c in clients) {
      var cc = clients[c];
      var row = document.createElement("tr");

      for (var r = 1; r < cc.length; r++) {
	  var c = document.createElement("td");
	  var ct = document.createTextNode(cc[r]);
	  c.appendChild(ct);
	  row.appendChild(c);
      }
      resultTab.appendChild(row);
  }
  re.appendChild(resultTab);
}

function doSearch(c, all) {
  var contains_current_session = '%'+CURRENT_SESSION+'%';
  var rs = db.execute('SELECT client.id,nom,prenom,grade,tel,cours from `client`,`services`,`grades` '+
                      'WHERE deleted <> \'true\' AND '+
                        'client.id = services.client_id AND '+
                        'client.id = grades.client_id AND '+
                        'date_grade = (SELECT max(date_grade) FROM `grades` WHERE grades.client_id=client.id) AND '+
		        'saisons LIKE ? AND ((cours=?) OR ?)'+
		      'ORDER BY nom_stripped COLLATE NOCASE', [contains_current_session, c, all]);
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
      clients[index][5] = COURS[rs.field(5)];
    }
    ++index;
    rs.next();
  }
  rs.close();

  return clients;
}
