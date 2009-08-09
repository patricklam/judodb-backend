<?
// Copyright 2009, Patrick Lam.
// Based on Gearpad, Copyright 2007, Google Inc.
//
// Redistribution and use in source and binary forms, with or without 
// modification, are permitted provided that the following conditions are met:
//
//  1. Redistributions of source code must retain the above copyright notice, 
//     this list of conditions and the following disclaimer.
//  2. Redistributions in binary form must reproduce the above copyright notice,
//     this list of conditions and the following disclaimer in the documentation
//     and/or other materials provided with the distribution.
//  3. Neither the name of Google Inc. nor the names of its contributors may be
//     used to endorse or promote products derived from this software without
//     specific prior written permission.
//
// THIS SOFTWARE IS PROVIDED BY THE AUTHOR ``AS IS'' AND ANY EXPRESS OR IMPLIED
// WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF 
// MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO
// EVENT SHALL THE AUTHOR BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, 
// SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO,
// PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS;
// OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY,
// WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR 

require("_functions.php");
require("_database.php");
require("_layout.php");
?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
  <title>Facturation Club Judo Anjou: Client</title>
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
  <link rel="shortcut icon" href="/files/favicon.ico" type="image/x-icon" />
  <style type="text/css" media="all">@import "styles.css";</style>
</head>

<body>

<script type="text/javascript"  src="gears_init.js"></script>
<script type="text/javascript"  src="base.js"></script>
<script type="text/javascript"  src="utils.js"></script>

<h1>Recherche client</h1>
<p><span id="status">&nbsp;</span></p>

<script>
var db;
init();

// Open this page's local database.
function init() {
  var success = false;

  if (window.google && google.gears) {
    try {
      db = google.gears.factory.create('beta.database');

      if (db) {
        db.open('anjoudb');
        db.execute('create table if not exists `client` (' +
	             '`id` int(11) NOT NULL, ' +
		     '`saison` int(5) NOT NULL, ' +
		     '`nom` varchar(50) NOT NULL, ' +
		     '`prenom` varchar(50) NOT NULL, ' +
		     '`ddn` date, ' +
		     '`courriel` varchar(255), ' +
		     '`adresse` varchar(255), ' +
		     '`ville` varchar(50), ' +
		     '`tel` varchar(20), ' +
		     '`affiliation` varchar(20), ' +
		     '`nom_recu_impot` varchar(255), ' +
		     '`nom_contact_urgence` varchar(255), ' +
		     '`tel_contact_urgence` varchar(255), ' +
		     'PRIMARY KEY  (`id`) ' +
		     ')');

        success = true;
        // Initialize the UI at startup.
      }
    } catch (ex) {
      setError('Could not create database: ' + ex.message);
    }
  }
}

var fields = ["nom", "prenom", "ddn", "courriel", "adresse", "ville", "tel", "affiliation", "impot", "nomurgence", "telurgence"]

function populateClient(cid) {
  var rs = executeToObjects(db, 'select * from client where id = '+cid)[0];
  for (i = 0; i < fields.length; i++) {
    key = fields[i];
    getElementById(key).value = rs[key];
  }
}

function clientToArray() {
  var rs = {};
  for (i = 0; i < fields.length; i++) {
    key = fields[i];
    rs[key] = getElementById(key).value;
  }
  return rs;
}

function handleSubmit() {
  // Load up all of the data from the form,
  // put it into a PHP array, store it to the database.
  var cid = getElementById('cid').value;
  var rs = clientToArray();

  db.execute('INSERT INTO `client` '+
                'VALUES (' + cid + ', 2009, "' + rs.nom + '", "' +
                rs.prenom + '", "' + rs.ddn + '", "' + rs.courriel + '", "' +
                rs.adresse + '", "' + rs.ville + '", "' + rs.tel + '", "' +
                rs.affiliation + '", "' + rs.impot + '", "' +
                rs.nomurgence + '", "' + rs.telurgence + '")');

//  db.execute('INSERT INTO `client` '+
//                'VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', 
//                [cid, 2009, rs.nom, rs.prenom, rs.ddn, rs.courriel,
//                rs.adresse, rs.ville, rs.tel, rs.affiliation, 
//                rs.impot, rs.nomurgence, rs.telurgence]);

//  db.execute('INSERT INTO `client` '+
//                'VALUES (?, ?, ?, ?, ?, ?)', 
//                [1, 2009, "Lam", "Patrick", "77/09/19", "prof.lam@gmail.com"]);
}

function handleLoad() {
  var cid = getElementById('cid').value;
  populateClient(cid);
}

function onClick() {
  var f = getElementById('nom').value;
  // ... or (nom + prenom) contains f
  var rs = db.execute('SELECT * FROM `client` WHERE nom contains f OR '+
              'prenom contains f');
}
</script>

<form name="findclient">
<input type="hidden" name="cid" value="" />

<div class="sectionBody" style="padding:7px 0 9px 7px;">
 <div style="padding:10px 10px 0px 10px;">
 <div>
  <span class="standardtitle">Nom ou Prenom</span><br />
  <div><input id="nom" type="text" size="60" value="" maxlength="60"></div>
 </div>
 <input type="submit" value="Fureter" onClick="doSearch(); return false;"/>
</form>

<div id="results">
</div>

</body>

</html>

 
