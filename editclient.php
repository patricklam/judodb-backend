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
<script type="text/javascript"  src="constants.js"></script>

<h1>Renseignements client</h1>
<p><span id="status">&nbsp;</span></p>

<form name="client" onSubmit="handleSubmit(); return false;">
<input type="hidden" id="cid" value="" />

<div class="sectionBody" style="padding:7px 0 9px 7px;">
 <div style="padding:10px 10px 0px 10px;">
 <div>
  <span class="standardtitle">Nom</span><br />
  <div><input id="nom" type="text" size="32" value="" maxlength="50"></div>
 </div>
 <div>
  <span class="standardtitle">Prenom</span><br />
  <div><input id="prenom" type="text" size="32" value="" maxlength="50"></div>
 </div>
 <div>
  <span class="standardtitle">Date de naissance (aa/mm/jj) </span><br />
  <div><input id="ddn" type="text" size="32" value="" maxlength="50"></div>
 </div>
 <br />

 <div>
  <span class="standardtitle">Courriel</span><br />
  <div><input id="courriel" type="text" size="32" value="" maxlength="255"></div>
 </div>
 <br />

 <div>
  <span class="standardtitle">Adresse</span><br />
  <div><input id="adresse" type="text" size="64" value="" maxlength="80"></div>
 </div>
 <br />

 <div>
  <span class="standardtitle">Ville</span><br />
  <div><input id="ville" type="text" size="32" value="" maxlength="50"></div>
 </div>
 <div>
  <span class="standardtitle">T&eacute;l&eacute;phone(s)</span><br />
  <div><input id="tel" type="text" size="20" value="" maxlength="20"></div>
 </div>
 <div>
  <span class="standardtitle"># Judo Qu&eacute;bec</span><br />
  <div><input id="affiliation" type="text" size="10" value="" maxlength="20"></div>
 </div>

 <br />

 <div>
  <span class="standardtitle">Nom re&ccedil;u imp&ocirc;t</span><br />
  <div><input id="nom_recu_impot" type="text" size="32" value="" maxlength="50"></div>
 </div>
 <br />

 <div>
  <span class="standardtitle">Contact en cas d'urgence</span><br />
  <div><input id="nom_contact_urgence" type="text" size="32" value="" maxlength="50"></div>
 </div>
 <div style="display:none">
  <span class="standardtitle">T&eacute;l&eacute;phone urgence</span><br />
  <div><input id="tel_contact_urgence" type="text" size="32" value="" maxlength="50"></div>
 </div>

 <div>
 <input type="submit" value="Submit" />
</form>

<script>
var cid = <? if (isset($_GET["cid"]) && $_GET["cid"] != "") 
   { 
     echo $_GET["cid"];
   } else echo "-1";
?>;

var db;
var fields = ["nom", "prenom", "ddn", "courriel", "adresse", "ville", "tel", "affiliation", "nom_recu_impot", "nom_contact_urgence", "tel_contact_urgence"]

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
	if (cid != -1)
	  populateClient(cid);
      }
    } catch (ex) {
      setError('Could not create database: ' + ex.message);
    }
  }
}

function populateClient() {
  var rs = executeToObjects(db, 'select * from client where id = '+cid)[0];
  for (i = 0; i < fields.length; i++) {
    key = fields[i];
    getElementById(key).value = rs[key];
  }
}

function handleSubmit() {
  var rs = {};
  for (i = 0; i < fields.length; i++) {
    key = fields[i];
    rs[key] = getElementById(key).value;
  }
  return rs;

  // This is not atomic transaction, fix later.
  db.execute('DELETE from `client` WHERE id=?', [cid]);
  db.execute('INSERT INTO `client` ' +
                'VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?) ',
                [cid, SAISON, rs.nom, rs.prenom, rs.ddn, rs.courriel,
                rs.adresse, rs.ville, rs.tel, rs.affiliation, 
                rs.nom_recu_impot, rs.nom_contact_urgence, rs.tel_contact_urgence]);
}
</script>

</body>

</html>

 
