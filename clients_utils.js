clearStatus();
if (!window.google || !google.gears) {
  location.href = "http://gears.google.com/?action=install&message=Installer Google Gears pour acceder au base de données du club." +
                  "&return=http://www.judo-anjou.qc.ca/anjoudb";
}

var db;

createManagedStore();
store = new DataStore();
store.init();

var clients = [];
var firstToDisplay = 0;

function refreshResults() {
  var resultBox = getElementById('results');
  resultBox.innerHTML = '';
  for (var i = firstToDisplay; i < min(firstToDisplay+10, clients.length); ++i) {
    resultBox.innerHTML += '<a href="editclient.html" onclick="createCookie(\'cid\', '+clients[i].id+', 1)">'+clients[i].nom+', '+clients[i].prenom+'</a><br />';
  }

  if (firstToDisplay > 0 || firstToDisplay + 10 < clients.length) 
    resultBox.innerHTML += '<br />';

  if (firstToDisplay + 10 < clients.length)
    resultBox.innerHTML += '<a href="" onclick="firstToDisplay += 10; refreshResults(); return false;">Résultats suivants<a/>&nbsp;';
  if (firstToDisplay > 0)
    resultBox.innerHTML += '<a href="" onclick="firstToDisplay -= 10; refreshResults(); return false;">Résultats précedents</a>&nbsp;';
}

function doSearch() {
  var f = '%'+getElementById('query').value+'%';
  var rs = db.execute('SELECT id, nom, prenom FROM `client` WHERE prenom||" "||nom LIKE ? OR nom||" "||prenom LIKE ? ORDER BY nom COLLATE NOCASE', [f, f]);
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
