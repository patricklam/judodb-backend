<?
header('content-type: text/plain');

// Returns the challenge to the client.

session_start();
session_unset();
srand();
$challenge = "";
for ($i = 0; $i < 80; $i++) {
    $challenge .= dechex(rand(0, 15));
}
$_SESSION[challenge] = $challenge;

print $challenge;
?>