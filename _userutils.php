<?php

function get_user_id() {
  $pid = $_SESSION['plus_identity'];
  $email = $_SESSION['email'];
  if (isset($_SESSION["authenticated"]) && $_SESSION["authenticated"] == "yes") {
    $rsId = db_query_get("SELECT `id` FROM `user` WHERE email='$email' AND `plus_identity`=$pid");
    if (0 == count($rsId)) return -1;
    else {
      return $rsId[0]['id'];
    }
  }
  return -1;
}

function is_admin($user_id) {
  $rs0 = db_query_get("SELECT `is_admin` FROM `user` WHERE id=$user_id");
  if (isset($rs0)) {
    return $rs0[0]['is_admin'];
  }
  return 0;
}

function get_club_list() {
  $user_id = get_user_id();
  if (-1 == $user_id) {
    echo 'Please authenticate yourself!';
    return null;
  }
  if (is_admin($user_id))
    $rs0 = mysql_query("SELECT `club_id` FROM `club`");
  else
    $rs0 = mysql_query("SELECT * FROM `user_club` WHERE user_id=$user_id");
  $clubs = array();
  while ($user_club = mysql_fetch_object($rs0)) {
    $club_id = $user_club->club_id;
    $clubs[] = $club_id;
  }
  return $clubs;
}

function utf8_encode_deep(&$input) {
    if (is_string($input)) {
        $input = utf8_encode($input);
    } else if (is_array($input)) {
        foreach ($input as &$value) {
            utf8_encode_deep($value);
        }

        //unset($value);
    } else if (is_object($input)) {
        $vars = array_keys(get_object_vars($input));

        foreach ($vars as $var) {
            utf8_encode_deep($input->$var);
        }
    }
}

function check_json_error() {
  switch (json_last_error()) {
  	case JSON_ERROR_NONE:
            echo ' - No errors';
        break;
        case JSON_ERROR_DEPTH:
            echo ' - Maximum stack depth exceeded';
        break;
        case JSON_ERROR_STATE_MISMATCH:
            echo ' - Underflow or the modes mismatch';
        break;
        case JSON_ERROR_CTRL_CHAR:
            echo ' - Unexpected control character found';
        break;
        case JSON_ERROR_SYNTAX:
            echo ' - Syntax error, malformed JSON';
        break;
        case JSON_ERROR_UTF8:
            echo ' - Malformed UTF-8 characters, possibly incorrectly encoded';
        break;
        default:
            echo ' - Unknown error';
	    break;
  }
}
?>
