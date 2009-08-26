clearStatus();
if (!window.google || !google.gears) {
  location.href = "http://gears.google.com/?action=install&message=Installer Google Gears pour acceder au base de données du club." +
                  "&return=http://www.judo-anjou.qc.ca/anjoudb";
}

var db;

createManagedStore();
var store = new DataStore();
store.init();
updateLastSync();
getElementById('version').innerHTML = 'version ' + VERSION;

var clients = [];
var firstToDisplay = 0;

function refreshResults() {
  var resultBox = getElementById('results');
  resultBox.innerHTML = '';
  for (var i = firstToDisplay; i < min(firstToDisplay+10, clients.length); ++i) {
    resultBox.innerHTML += '<a href="editclient.html?cid='+clients[i].id+'">'+clients[i].prenom+' '+clients[i].nom+'</a><br />';
  }

  if (firstToDisplay > 0 || firstToDisplay + 10 < clients.length) 
    resultBox.innerHTML += '<br />';

  if (firstToDisplay + 10 < clients.length)
    resultBox.innerHTML += '<a href="" onclick="firstToDisplay += 10; refreshResults(); return false;">Résultats suivants<a/>&nbsp;';
  if (firstToDisplay > 0)
    resultBox.innerHTML += '<a href="" onclick="firstToDisplay -= 10; refreshResults(); return false;">Résultats précedents</a>&nbsp;';
}

function doSearch() {
  var f = '%'+stripAccent(getElementById('query').value)+'%';
  var rs = db.execute('SELECT id, nom, prenom FROM `client` WHERE prenom_stripped||" "||nom_stripped LIKE ? OR nom_stripped||" "||prenom_stripped LIKE ? ORDER BY nom COLLATE NOCASE', [f, f]);
  var index = 0;
  clients = [];
  while (rs.isValidRow()) {
    clients[index] = {};
    clients[index].id = rs.field(0);
    clients[index].nom = rs.field(1);
    clients[index].prenom = rs.field(2);
    ++index;
    rs.next();
  }
  rs.close();

  firstToDisplay = 0;
  refreshResults();
}

var challenge;

function loginAndSync() {
  doRequest("GET", "authenticate.php", null, lsCheckLogin_, null);

  function lsCheckLogin_(status, statusText, responseText, responseXML) {
    if (status == '200') {
      store.sync();
      doRequest("POST", "update_last_sync.php", {didSync:1}, function (s,st,r,rx) {}, null);
      return;
    }
    doRequest("GET", "request_challenge.php", null, lsGotChallenge_, null);
  }

  function lsGotChallenge_(status, statusText, responseText, responseXML) {
    challenge = responseText.trim();
    getElementById('login').style.display="inline";
    getElementById('login').onSubmit = function() { 
        getElementById('login').style.display="none";
        store.sync();
    }
    return;
  }
}

function computeResponse() {
  postReq = "username="+getElementById('loginid').value+"&";
  postReq += "response="+
    hex_md5(challenge+getElementById('password').value);
  return postReq;
}

function doLogin(arg, successContinuation) {
  doRequest("POST", "authenticate.php", null, lAuthenticated_, arg);
  function lAuthenticated_(status, statusText, responseText, responseXML) {
    if (status == '200') {
      successContinuation();
    } else {
      setError("Mot de passe invalide.");
      setTimeout(clearStatus, 1000);
    }
  }
}

function updateLastSync() {
  var bail = doRequest
    ("POST", "update_last_sync.php", null, printLastSync_, null);
  setTimeout(bail, 1000);
  function printLastSync_(status, statusText, responseText, responseXML) {
    if (status == '200') {
      var ls = responseXML.childNodes[0].childNodes;
      getElementById("lastSync").innerHTML = 
	    "dernier sync par " + 
	    ls[0].textContent + " à " + 
	    ls[1].textContent;
    }
  }
}