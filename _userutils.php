<?php

function get_user_id($db) {
  $email = $_SESSION['email'];
  $pid = $_SESSION['plus_identity'];
  if (isset($_SESSION["authenticated"]) && $_SESSION["authenticated"] == "yes") {
    $id_query = $db->prepare('SELECT count(`id`) FROM `user` WHERE `email`=? AND `plus_identity`=?');
    $id_query->execute(array($email, $pid));
    if ($id_query->fetchColumn() == 0) return -1;
    else {
      return $id_query->fetch(PDO::FETCH_OBJ)->id;
    }
  }
  return -1;
}

function is_admin($db, $user_id) {
  $admin_query = $db->prepare('SELECT COUNT(`is_admin`) FROM `user` WHERE id=?');
  $admin_query->execute(array($user_id));
  if ($admin_query->fetchColumn() > 0) {
    $real_admin_query = $db->prepare('SELECT `is_admin` FROM `user` WHERE id=?');
    $real_admin_query->execute(array($user_id));
    return $real_admin_query->fetch(PDO::FETCH_OBJ)->is_admin;
  }
  return 0;
}

function can_access_club($db, $user_id, $club_id) {
  if (is_admin($db, $user_id)) return TRUE;
  $has_access_query = $db->prepare('SELECT COUNT(*) FROM `user_club` WHERE `user_id`=? AND `club_id`=?');
  $has_access_query->execute(array($user_id, $club_id));
  return $has_access_query->fetchColumn() > 0;
}

function get_club_list($db) {
  $user_id = get_user_id($db);
  if (-1 == $user_id) {
    echo 'Please authenticate yourself!';
    die;
  }
  $clubs = array();
  if (is_admin($db, $user_id))
    $id_query = $db->prepare('SELECT `id` FROM `club`');
  else
    $id_query = $db->prepare('SELECT `club_id` FROM `user_club` WHERE user_id=?');
  $id_query->execute(array($user_id));
  foreach ($id_query->fetchAll(PDO::FETCH_NUM) as $user_club) {
    $club_id = $user_club[0];
    $clubs[] = $club_id;
  }
  return $clubs;
}
?>
