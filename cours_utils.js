var store = new DataStore();
store.init();

var cours = getElementById('cours');
for (var i = 0; i < COURS.length; i++) {
  cours.add(new Option(COURS[i], i), null);
}
refreshResults();
var PDFlink = getElementById('pdf');
PDFlink.href = PHP_LIST_CREATOR;

function refreshResults() {
  var PDFlink = getElementById('pdf');
  PDFlink.href = PHP_LIST_CREATOR + '?cours=' + getElementById('cours').value;

  var re = getElementById('results');
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

  function appendTD(row, t) {
      var c = document.createElement("td");
      var ct = document.createTextNode(t);
      c.style.paddingRight = "1em";
      c.appendChild(ct);
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
	  appendTD(row, cc[r]);
      }
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
      clients[index][5] = COURS_SHORT[rs.field(5)];
    }
    ++index;
    rs.next();
  }
  rs.close();

  return clients;
}
