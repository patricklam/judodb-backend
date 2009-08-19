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

var dateRegexp = /^(\d\d\d\d)-(\d\d)-(\d\d)$/;

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
