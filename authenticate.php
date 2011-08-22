<?
// Thanks to http://marakana.com/blog/examples/php-implementing-secure-login-with-php-javascript-and-sessions-without-ssl.html
// TODO: Improved as per http://pajhome.org.uk/crypt/md5/auth.html
//  i.e. don't store cleartext passwords

/////////////////////////////////////////////////////////////////////////////
//
// AUTHENTICATE PAGE
//
//   Server-side:
//     1. Get the challenge from the user session
//     2. Get the password for the supplied user (local lookup)
//     3. Compute expected_response = MD5(challenge+password)
//     4. If expected_response == supplied response:
//        4.1. Mark session as authenticated and forward to secret.php
//        4.2. Otherwise, authentication failed. Go back to login.php
//////////////////////////////////////////////////////////////////////////////////
header('content-type: text/html');
require ('_database.php');

db_connect() || die;

function getPasswordForUser($username) {
  $rs = db_query_get("SELECT `password` FROM `user` WHERE username='$username'");
  return $rs[0]["password"];
} 

function validate($challenge, $response, $password) {
  return md5($challenge . $password) == $response;
}
 
function authenticate() {
  if ($_SESSION[authenticated] == "yes")
    return '"OK"';

  if (isset($_SESSION[challenge]) &&
      isset($_REQUEST[username]) &&
      isset($_REQUEST[response])) {
    $password = getPasswordForUser($_REQUEST[username]);
    if (validate($_SESSION[challenge], $_REQUEST[response], $password)) {
      $_SESSION[authenticated] = "yes";
      $_SESSION[username] = $_REQUEST[username];;
      unset($_SESSION[challenge]);
      return '"OK"';
    } else {
      return '"BAD"';
    }
  } else {
    return '"EXPIRED"';
  }
}

session_start();
header('content-type: application/json');
$callback = trim($_GET['callback']);
echo $callback . '({"authenticated":' . authenticate() . '})';

?>
