<?
// Thanks to http://marakana.com/blog/examples/php-implementing-secure-login-with-php-javascript-and-sessions-without-ssl.html
// We'll later improve it with http://pajhome.org.uk/crypt/md5/auth.html

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

$userDB = array("plam" => md5("portcartier"),
                "rejean"  => md5("portcartier"),
                "degyve" => md5("portcartier"),
                "bgenier" => md5("auvers")); 

function getPasswordForUser($username) {
  // get password from a simple associative array
  // but this could be easily rewritten to fetch user info from a real DB
  global $userDB;     return $userDB[$username];
} 

function validate($challenge, $response, $password) {
  return md5($challenge . $password) == $response;
}
 
function authenticate() {
  if ($_SESSION[authenticated] == "yes")
    exit();

  if (isset($_SESSION[challenge]) &&
      isset($_REQUEST[username]) &&
      isset($_REQUEST[response])) {
    $password = getPasswordForUser($_REQUEST[username]);
    if (validate($_SESSION[challenge], $_REQUEST[response], $password)) {
      $_SESSION[authenticated] = "yes";
      $_SESSION[username] = $_REQUEST[username];;
      unset($_SESSION[challenge]);
    } else {
      header('HTTP/1.0 403 Forbidden');
      print('<b>Authentication failed.</b>');
      exit;
    }
  } else {
    header('HTTP/1.0 403 Forbidden');
    print('<b>Session expired.</b>');
    exit;
  }
}

session_start();
authenticate();
// return 200, which signals "OK".
exit();
?>
