var store = new DataStore();
store.init();

var cs = doSearch();
refreshResults(cs);

var unpaidOnlyFlag = false;

function onlyUnpaid() {
  unpaidOnlyFlag = true;
  refreshResults(cs);
}

function showAll() {
  unpaidOnlyFlag = false;
  refreshResults(cs);
}


function collectGroups(clients) {
  var idToGroup = [];
  rs = db.execute('SELECT group_id, client_id from `payment_group_members` ORDER BY group_id');
  var prevGid = -1, currentGroup = [];

  for (c in clients) {
      idToGroup[clients[c][0]] = [];
  }

  function finalizeGroup() {
      for (ci in currentGroup) {
	  var c = currentGroup[ci];
	  idToGroup[c] = currentGroup;
      }
  }

  while (rs.isValidRow()) {
    var gid = rs.field(0), cid = rs.field(1);
    if (gid != prevGid) {
	finalizeGroup();
	currentGroup = []; prevGid = gid;
    }
    currentGroup = currentGroup.concat(cid);
    rs.next();
  }
  finalizeGroup();
  rs.close();

  return idToGroup;
}

function doSearch() {
  var contains_current_session = '%'+CURRENT_SESSION+'%';
  var rs = db.execute('SELECT DISTINCT client.id,nom || ", " || prenom,frais,mode,chqno,date,montant from `client`,`services`,`payment`,`payment_group_members` AS pg '+
                      'WHERE deleted <> \'true\' AND '+
                        'client.id = services.client_id AND '+
                        '(client.id = payment.client_id OR '+
                        ' (client.id = pg.client_id AND pg.group_id = payment.group_id)) AND '+
		        'saisons LIKE ? ORDER BY nom, prenom', [contains_current_session]);
  var clients = [];
  var idToIndex = [];
  var index = 0;
  while (rs.isValidRow()) {
    clients[index] = [];
    idToIndex[rs.field(0)] = index;

    for (var j = 0; j < 7; j++)
      clients[index][j] = rs.field(j);

    ++index;
    rs.next();
  }
  rs.close();

  clients.idToIndex = idToIndex;
  clients.idToGroup = collectGroups(clients);
  return clients;
}

function refreshResults(clients) {
  var re = getElementById('results');
  var d = getElementById('data');
  var dv = '';

  re.removeChild(re.getElementsByTagName('tbody')[0]);

  var resultTab = document.createElement('tbody');

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

  var heads = ["Nom", "", "Date", "Montant"];

  for (h in heads)
      appendTH(heads[h]);
  resultTab.appendChild(rh);

  var rowsToAdd = [];
  function buffer(s) {
      rowsToAdd = rowsToAdd.concat(s);
  }
  function dischargeBuffer() {
      for (var i = 0; i < rowsToAdd.length; i++)
	  resultTab.appendChild(rowsToAdd[i]);
      rowsToAdd = [];
  }
  function eraseBuffer() {
      rowsToAdd = [];
  }

  function addSolde(s) {
      var tailRow = document.createElement("tr");
      appendTD(tailRow, tn(''));
      appendTD(tailRow, tn('SOLDE'));
      appendTD(tailRow, tn(''));
      appendTD(tailRow, tn(asCurrency(s)), false, true);
      tailRow.style.backgroundColor = '#ddd';
      if (parseFloat(s) <= 0.0) tailRow.style.backgroundColor = '#eee';
      return tailRow;
  }

  var clientCount = 0;
  function addClient(cc) {
      clientCount++;
      var vv = document.createElement("a");
      vv.href = "editclient.html?cid="+cc[0];
      vv.target = "_";
      vv.className += "notlink-in-print";
      vv.appendChild(tn(cc[1]));
      
      var row = document.createElement("tr");
      appendTD(row, vv);
      appendTD(row, tn('frais'));
      appendTD(row, tn(''));
      appendTD(row, tn(asCurrency(cc[2])), false, true);
      return row;
  }

  var processed = [];
  var prevcid = -1, prevTotalFrais = 0.0, totalPaid = 0.0;
  for (var c = 0; c < clients.length; c++) {
      var cc = clients[c];
      var ccl = cc.length;

      // new person; add 'FRAIS' line
      if (cc[0] != prevcid) {
	  // skip if already in other group
	  if (processed[cc[0]]) continue;

	  if (prevcid != -1) {
	      var s = prevTotalFrais - totalPaid;
	      if (s > 0 || !unpaidOnlyFlag) {
		  buffer(addSolde(prevTotalFrais - totalPaid));
		  dischargeBuffer();
	      } else eraseBuffer();
	  }

	  prevcid = cc[0]; totalPaid = 0.0; 

	  var gr = clients.idToGroup[cc[0]];
	  if (gr.length < 1) {
	      prevTotalFrais = parseFloat(cc[2]);
              buffer(addClient(cc));
	  }
	  else
	      prevTotalFrais = 0.0;

	  for (var gm in gr) {
	      if (clients.idToIndex[gr[gm]] in clients) {
		  processed[gr[gm]] = true;
		  var ccp = clients[clients.idToIndex[gr[gm]]];
		  prevTotalFrais += parseFloat(ccp[2]);
		  buffer(addClient(ccp));
	      }
	  }
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
	  buffer(row);
  }
  var s = prevTotalFrais - totalPaid;
  if (s > 0 || !unpaidOnlyFlag) {
      buffer(addSolde(prevTotalFrais - totalPaid));
      dischargeBuffer();
  }

  re.appendChild(resultTab);
}
