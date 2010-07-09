var db;

var store = new DataStore();
store.init();
localInit();

function localInit() {
  populateClient();
  clearStatus();
}

function populateClient() {
  var i;
  var c = 0;

  var rs = executeToObjects(db, 'SELECT * from `client` WHERE deleted="false" ORDER BY UPPER(nom_stripped), UPPER(prenom_stripped) DESC');
  var master = getElementById('master');
  for (var cid = 0; cid < rs.length; cid++) {
    for (i = 0; i < ALL_FIELDS.length; i++) {
      var key = ALL_FIELDS[i];
      getElementById(key).value = rs[cid][key];
    }

    var gs = executeToObjects(db, 'SELECT grade, date_grade from `grades` WHERE client_id = ? ORDER BY date_grade DESC LIMIT 1', [rs[cid]['id']]);

    if (gs[0]) {
      getElementById('grade').value = gs[0]['grade'];
      if (gs[0]['date_grade'] != '0000-00-00')
	getElementById('date_grade').value = gs[0]['date_grade'];
    }

    var newCopy = master.cloneNode(true);
    c++;
    if (c % 3 != 2) newCopy.style.pageBreakAfter = "avoid";
    document.getElementsByTagName("body").item(0).appendChild(newCopy);
  }
  document.getElementsByTagName("body").item(0).removeChild(master);
}
