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

<div class="title"><span><b>Renseignements client</b></div>

<div class="sectionBody" style="padding:7px 0 9px 7px;">
 <div style="padding:10px 10px 0px 10px;"><a name="FullName"></a>
 <div>
  <span class="standardtitle">Nom</span><br />
  <div><input name="nom" type="text" size="32" value="" maxlength="50"></div>
 </div>
 <div>
  <span class="standardtitle">Prenom</span><br />
  <div><input name="prenom" type="text" size="32" value="" maxlength="50"></div>
 </div>
 <div>
  <span class="standardtitle">Date de naissance</span><br />
  <div><input name="ddn" type="text" size="32" value="" maxlength="50"></div>
 </div>
 <br />

 <div>
  <span class="standardtitle">Courriel</span><br />
  <div><input name="courriel" type="text" size="32" value="" maxlength="255"></div>
 </div>
 <br />

 <div>
  <span class="standardtitle">Adresse</span><br />
  <div><input name="adresse" type="text" size="64" value="" maxlength="80"></div>
 </div>
 <br />

 <div>
  <span class="standardtitle">Ville</span><br />
  <div><input name="adresse" type="text" size="32" value="" maxlength="50"></div>
 </div>
 <div>
  <span class="standardtitle">T&eacute;l&eacute;phone</span><br />
  <div><input name="tel" type="text" size="20" value="" maxlength="20"></div>
 </div>
 <div>
  <span class="standardtitle"># Judo Qu&eacute;bec</span><br />
  <div><input name="affiliation" type="text" size="10" value="" maxlength="20"></div>
 </div>

 <br />

 <div>
  <span class="standardtitle">Nom re&ccedil;u imp&ocirc;t</span><br />
  <div><input name="impot" type="text" size="32" value="" maxlength="50"></div>
 </div>
 <br />

 <div>
  <span class="standardtitle">Contact en cas d'urgence</span><br />
  <div><input name="nomurgence" type="text" size="32" value="" maxlength="50"></div>
 </div>
 <div>
  <span class="standardtitle">T&eacute;l&eacute;phone urgence</span><br />
  <div><input name="telurgence" type="text" size="32" value="" maxlength="50"></div>
 </div>

</body>

</html>

 
