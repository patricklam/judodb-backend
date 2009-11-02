var store = new DataStore();
store.init();

refreshResults();

function refreshResults() {
  var re = getElementById('results');
  var d = getElementById('data');
  var dv = '';

  re.removeChild(re.getElementsByTagName('tbody')[0]);

  var resultTab = document.createElement('tbody');

  var clients = doSearch();

  var rh = document.createElement("tr");
  function appendTH(t, s) {
      var c = document.createElement("th");
      var ct = document.createTextNode(t);
      c.style.textAlign = "left";
      if (s != null) {
	  var l = document.createElement("a");
	  l.href = "#";
	  l.className += "notlink-in-print";
	  l.onclick = s;
	  l.appendChild(ct);
	  ct = l;
      }
      c.appendChild(ct);
      rh.appendChild(c);      
  }

  function tn(t) {
      return document.createTextNode(t);
  }

  function appendTD(row, t, hide, right) {
      if (hide === undefined) hide = false;
      if (right === undefined) right = false;

      var c = document.createElement("td");
      if (hide) c.style.display = "none";
      if (right) c.style.textAlign = "right";
      c.style.paddingRight = "1em";
      c.appendChild(t);
      row.appendChild(c);
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
	      head.childNodes[n].firstChild.onclick = sorts[n];
	  head.childNodes[i].firstChild.onclick = makeSort(i, function (a, b) { return -c(a, b); });
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

  var heads = ["Nom", "", "Date", "Montant"];
  var sorts = [makeSort(0, stringSort), makeSort(1, stringSort), makeSort(2, stringSort), makeSort(3, stringSort)];

  for (h in heads)
      appendTH(heads[h], sorts[h]);
  resultTab.appendChild(rh);

  function addSolde(s) {
      var tailRow = document.createElement("tr");
      appendTD(tailRow, tn(''));
      appendTD(tailRow, tn('SOLDE'));
      appendTD(tailRow, tn(''));
      appendTD(tailRow, tn(asCurrency(s)), false, true);
      tailRow.style.backgroundColor = '#ddd';
      if (s == '0.00') tailRow.style.backgroundColor = '#eee';
      resultTab.appendChild(tailRow);
  }

  var prevcid = -1, prevTotalFrais = 0.0, totalPaid = 0.0;
  for (c in clients) {
      var cc = clients[c];
      var ccl = cc.length;

      // add 'FRAIS' line
      if (cc[0] != prevcid) {
	  if (prevcid != -1)
	      addSolde(prevTotalFrais - totalPaid);

	  prevcid = cc[0]; totalPaid = 0.0; prevTotalFrais = cc[2];

	  var vv = document.createElement("a");
	  vv.href = "editclient.html?cid="+cc[0];
	  vv.target = "_";
	  vv.className += "notlink-in-print";
	  vv.appendChild(tn(cc[1]));

	  var headRow = document.createElement("tr");
          appendTD(headRow, vv);
	  appendTD(headRow, tn('frais'));
	  appendTD(headRow, tn(''));
	  appendTD(headRow, tn(asCurrency(cc[2])), false, true);
	  resultTab.appendChild(headRow);
// XXX here add other people in the same payment group and
// increase prevTotalFrais
      }

      var row = document.createElement("tr");
      appendTD(row, tn(''));
      if (cc[3] == '0') { // CASH
	  appendTD(row, tn('comptant'));
	  appendTD(row, tn(''));
      } else {
	  appendTD(row, tn('chq #'+cc[4]));
	  appendTD(row, tn(cc[5]));
      }

      var thisPaid = parseFloat(cc[6]);
      if (cc[6] == '') thisPaid = 0.0;
      totalPaid += thisPaid;
      appendTD(row, tn('('+asCurrency(thisPaid)+')'), false, true);
      if (thisPaid != '' && thisPaid > 0)
	  resultTab.appendChild(row);
  }
  addSolde(prevTotalFrais - totalPaid);

  re.appendChild(resultTab);
}

function doSearch() {
  var contains_current_session = '%'+CURRENT_SESSION+'%';
  var rs = db.execute('SELECT client.id,nom || ", " || prenom,frais,mode,chqno,date,montant from `client`,`services`,`payment` '+
                      'WHERE deleted <> \'true\' AND '+
                        'client.id = services.client_id AND '+
                        'client.id = payment.client_id AND '+
		        'saisons LIKE ? '+
		      'ORDER BY nom_stripped COLLATE NOCASE, prenom_stripped COLLATE NOCASE', [contains_current_session]);
  var clients = [];
  var index = 0;
  while (rs.isValidRow()) {
    clients[index] = [];
    for (var j = 0; j < 7; j++)
      clients[index][j] = rs.field(j);

    ++index;
    rs.next();
  }
  rs.close();

  return clients;
}
