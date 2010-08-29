function computeCategoryId(yr, grade) {
    var rv;
    for (var i = 0; i < CATEGORY_YEARS.length; i++) {
	if (yr >= CATEGORY_YEARS[i])
	    { rv = i; break; }
    }

    var ndRegexp = /^\dD/;
    // if yudansha, increase rv (could be cadet or junior)
    if (grade.toUpperCase().indexOf('DAN') != -1 ||
        ndRegexp.test(grade))
        rv ++;
    return rv;
}

function isDefined(type) {
  return (type != 'undefined' && type != 'unknown');
}

function childNodes(element) {
  if (isDefined(typeof element.childNodes)) {
    return element.childNodes;
  } else if (isDefined(typeof element.children)) {
    return element.children;
  }
}

function getElementById(element_name) {
  if (isDefined(typeof document.getElementById)) {
    return document.getElementById(element_name);
  } else if(typeof isDefined(document.all)) {
    return document.all[element_name];
  }
}

function setTextContent(elem, content) {
  if (isDefined(typeof elem.innerText)) {
    elem.innerText = content; 
  } else if (isDefined(typeof elem.textContent)) {
    elem.textContent = content;
  }
}

function addStatus(message, opt_class) {
  var elm = getElementById('status');
  var id = 'statusEntry' + (childNodes(elm).length + 1);
  if (!elm) return;
  if (opt_class) {
    elm.innerHTML += '<span id="' + id + '" class="' + opt_class + '"></span>';
  } else {
    elm.innerHTML += '<span id="' + id + '"></span>';
  }
  elm.innerHTML += '<br>';
  setTextContent(getElementById(id), message);
}

function clearStatus() {
  var elm = getElementById('status');
  elm.innerHTML = '';
}

function setError(s) {
  clearStatus();
  addStatus(s, 'error');
}

function executeToObjects(db, sql, args) {
  var rs = db.execute(sql, args);
  try {
    var rv = [];
    if (rs && rs.isValidRow()) {
      var cols = rs.fieldCount();
      var colNames = [];
      for (var i = 0; i < cols; i++) {
        colNames.push(rs.fieldName(i));
      }

      while (rs.isValidRow()) {
        var h = {};
        for (i = 0; i < cols; i++) {
          h[colNames[i]] = rs.field(i);
        }
        rv.push(h);
        rs.next();
      }
    }
  } catch (e) {
    throw e;
  } finally {
    rs.close();
    return rv;
  }
}

var dateRegexp = /^(\d\d\d\d)-(\d?\d)-(\d?\d)$/;

// yyyy/mm/dd
function validateDate(d) {
  if (!dateRegexp.test(d))
    return false;
  var rs = dateRegexp.exec(d);
  var month = parseInt(rs[2], 10), day = parseInt(rs[3], 10);
  if (month == 0 || month > 12) return false;
  if (day == 0 || day > 31) return false;
  return true;
}

function compareDate(d1, d2) {
  if (!dateRegexp.test(d1) || !dateRegexp.test(d2))
    return 1;
  var rs1 = dateRegexp.exec(d1), rs2 = dateRegexp.exec(d2);
  var y1 = parseInt(rs1[1], 10), y2 = parseInt(rs2[1], 10);
  var m1 = parseInt(rs1[2], 10), m2 = parseInt(rs2[2], 10);
  var d1 = parseInt(rs1[3], 10), d2 = parseInt(rs2[3], 10);
  if (y1 != y2) return y1 - y2;
  if (m1 != m2) return m1 - m2;
  if (d1 != d2) return d1 - d2;
  return 0;
}

function max(a,b) { return a > b ? a : b; }
function min(a,b) { return a < b ? a : b; }

String.prototype.trim = function() {
	return this.replace(/^\s+|\s+$/g,"");
}
String.prototype.ltrim = function() {
	return this.replace(/^\s+/,"");
}
String.prototype.rtrim = function() {
	return this.replace(/\s+$/,"");
}

// http://www.web-source.net/web_development/currency_formatting.htm
function asCurrency(amount)
{
	var i = parseFloat(amount);
	if(isNaN(i)) { i = 0.00; }
	var minus = '';
	if(i < 0) { minus = '-'; }
	i = Math.abs(i);
	i = parseInt((i + .005) * 100);
	i = i / 100;
	s = new String(i);
	if(s.indexOf('.') < 0) { s += '.00'; }
	if(s.indexOf('.') == (s.length - 2)) { s += '0'; }
	s = minus + s;
	return s;
}

// http://boonedocks.net/mike/archives/157-Formatting-a-Javascript-Date-for-MySQL.html
function formatDate(date1) {
  return date1.getFullYear() + '-' +
    (date1.getMonth() < 9 ? '0' : '') + (date1.getMonth()+1) + '-' +
    (date1.getDate() < 10 ? '0' : '') + date1.getDate();
}

// Courtesy http://www.netlobo.com/url_query_string_javascript.html
function gup( name )
{
  name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
  var regexS = "[\\?&]"+name+"=([^&#]*)";
  var regex = new RegExp( regexS );
  var results = regex.exec( window.location.href );
  if( results == null )
    return null;
  else
    return results[1];
}

// Courtesy http://bytes.com/topic/javascript/answers/145532-replace-french-characters-form-input
/* (C)Stephen Chalmers
* Strips grave, acute & circumflex accents from vowels
*/

function stripAccent(str)
{
var s=str;

var rExps=[ /[\xC0-\xC2]/g, /[\xE0-\xE2]/g,
/[\xC8-\xCA]/g, /[\xE8-\xEB]/g,
/[\xCC-\xCE]/g, /[\xEC-\xEE]/g,
/[\xD2-\xD4]/g, /[\xF2-\xF4]/g,
/[\xD9-\xDB]/g, /[\xF9-\xFB]/g,
/[\xC7]/g, /[\xE7]/g ];

var repChar=['A','a','E','e','I','i','O','o','U','u','C','c'];

for(var i=0; i<rExps.length; i++)
s=s.replace(rExps[i],repChar[i]);

return s;
}

function inferSexFromRAMQ(r) {
  if (r == '-2008' || r == '2008') return '';
  // strip spaces
  r = r.replace(/\s/g,'');
  // strip 2008- prefix and first four letters
  r = r.replace(/(\d\d\d\d-)?\w\w\w\w/,'');
  // substring from 2-4 above 50
  var m = parseInt(r.substring(2,4));
  if (m > 50)
    return 'F';
  if (m > 0)
    return 'M';
  return '';
}

function gradeSort(a, b) { 
    return GRADE_ORDER.indexOf(a) - GRADE_ORDER.indexOf(b);
}
function catSort(a, b) { 
    var cya = CATEGORY_YEARS[CATEGORY_ABBREVS.indexOf(a)];
    var cyb = CATEGORY_YEARS[CATEGORY_ABBREVS.indexOf(b)];
    if (cya == 0) cya = 999;
    if (cyb == 0) cyb = 999;
    return cya - cyb;
}
function coursSort(a, b) {
    return COURS_SHORT.indexOf(b) - COURS_SHORT.indexOf(a);
}

function stringSort(a, b) {
    var a0 = stripAccent(a).toLowerCase();
    var b0 = stripAccent(b).toLowerCase();
    if (a0 < b0) return 1; 
    if (a0 == b0) return 0;
    return -1;
}
