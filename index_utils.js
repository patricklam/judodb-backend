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
var serverJudokaCount = 0;
var firstToDisplay = 0;

function refreshResults() {
  var resultBox = getElementById('results');
  resultBox.innerHTML = '';
  for (var i = firstToDisplay; i < min(firstToDisplay+10, clients.length); ++i) {
    resultBox.innerHTML += '<a href="editclient.html?cid='+clients[i].id+'">'+clients[i].nom+', '+clients[i].prenom+'</a> ';
    var inf = '';
    if (clients[i].date_inscription != null &&
        clients[i].date_inscription != UNSET_DATE) inf += clients[i].date_inscription;
    if (clients[i].saisons != '') {
      if (inf != '') inf += ', ';
      inf += clients[i].saisons;
    }
    if (inf != '')
      inf = '&nbsp;&nbsp;&nbsp;(' + inf + ')';
    resultBox.innerHTML += inf;
    resultBox.innerHTML += '<br />';
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
  var rs = db.execute('SELECT id,nom_stripped,prenom_stripped,date_inscription,saisons from '+
		        '(SELECT client.id,nom_stripped,prenom_stripped,date_inscription,saisons,deleted '+
		              'FROM `client` LEFT OUTER JOIN `services` ON client.id=services.client_id) ' +
                      'WHERE deleted <> \'true\' AND (prenom_stripped||" "||nom_stripped LIKE ? OR nom_stripped||" "||prenom_stripped LIKE ?) ' +
		      'ORDER BY nom_stripped COLLATE NOCASE', [f, f]);
  var index = 0;
  clients = [];
  while (rs.isValidRow()) {
    clients[index] = {};
    clients[index].id = rs.field(0);
    clients[index].nom = rs.field(1);
    clients[index].prenom = rs.field(2);
    clients[index].date_inscription = rs.field(3);
    clients[index].saisons = rs.field(4);
    ++index;
    rs.next();
  }
  rs.close();

  firstToDisplay = 0;
  refreshResults();
}

var challenge;

function actuallySync() {
    store.sync(serverJudokaCount);
    setTimeout(updateLastSync, 5000);
}

function loginAndSync() {
  doRequest("GET", "authenticate.php", null, lsCheckLogin_, null);

  function lsCheckLogin_(status, statusText, responseText, responseXML) {
    if (status == '200') {
      actuallySync();
      return;
    }
    doRequest("GET", "request_challenge.php", null, lsGotChallenge_, null);
  }

  function lsGotChallenge_(status, statusText, responseText, responseXML) {
    challenge = responseText.trim();
    getElementById('login').style.display="inline";
    getElementById('login').onSubmit = function() { 
        getElementById('login').style.display="none";
        actuallySync();
    };
    return;
  }
}

function computeResponse() {
  var postReq = "username="+getElementById('loginid').value+"&";
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
  var contains_current_session = '%'+CURRENT_SESSION+'%';
  var is = db.execute('SELECT COUNT(client.id) from `client`,`services`,`grades` '+
                      'WHERE deleted <> \'true\' AND '+
                        'client.id = services.client_id AND '+
                        'client.id = grades.client_id AND '+
                        'date_grade = (SELECT max(date_grade) FROM `grades` WHERE grades.client_id=client.id) AND '+
		        'saisons LIKE ? '+
		      'ORDER BY nom_stripped COLLATE NOCASE, prenom_stripped COLLATE NOCASE', [contains_current_session]);
  var inscr = is.field(0); is.close();
  var rs = db.execute('SELECT COUNT(*) FROM `client` WHERE version > server_version');
  var toSync = rs.field(0); rs.close();

  getElementById('toSync').innerHTML = toSync;
  getElementById('totalCount').innerHTML = inscr;

  var bail = doRequest
    ("GET", "update_last_sync.php", {current_session:CURRENT_SESSION}, printLastSync_, null);
  setTimeout(bail, 1000);
  function printLastSync_(status, statusText, responseText, responseXML) {
    if (status == '200' && responseXML != null) {
      var ls = responseXML.childNodes[0].childNodes;
      getElementById("lastSync").innerHTML = 
	    "dernier sync par " + 
	    ls[0].textContent + " à " + 
	    ls[1].textContent;
      serverJudokaCount = ls[2].textContent;
    }
  }
}
