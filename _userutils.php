<?php
if (file_exists('_top_sekrit_debug_mode.php')) include '_top_sekrit_debug_mode.php';

function get_user_id($db) {
  global $DEBUG_MODE;
  if ($DEBUG_MODE) return 1;
  $email = $_SESSION['email'];
  if (isset($_SESSION["authenticated"]) && $_SESSION["authenticated"] == "yes") {
    $id_query = $db->prepare('SELECT count(`id`) FROM `user` WHERE `email`=:email');
    $id_query->bindValue(":email", $email, PDO::PARAM_STR);
    $id_query->execute();
    if ($id_query->fetchColumn() == 0) return -1;
    else {
      $real_id_query = $db->prepare('SELECT `id` FROM `user` WHERE `email`=:email');
      $real_id_query->bindValue(":email", $email, PDO::PARAM_STR);
      $real_id_query->execute();
      return $real_id_query->fetch(PDO::FETCH_OBJ)->id;
    }
  }
  return -1;
}

function is_admin($db, $user_id) {
  $admin_query = $db->prepare('SELECT COUNT(`is_admin`) FROM `user` WHERE id=:id');
  $admin_query->bindValue(":id", $user_id, PDO::PARAM_INT);
  $admin_query->execute();
  if ($admin_query->fetchColumn() > 0) {
    $real_admin_query = $db->prepare('SELECT `is_admin` FROM `user` WHERE id=:id');
    $real_admin_query->bindValue(":id", $user_id, PDO::PARAM_INT);
    $real_admin_query->execute();
    return $real_admin_query->fetch(PDO::FETCH_OBJ)->is_admin;
  }
  return 0;
}

function can_access_client($db, $userid, $cid) {
    if (!is_admin($db, $userid)) {
      $auth_query = $db->prepare('SELECT COUNT(*) FROM `services`, `user_club` '.
                                  'WHERE services.client_id=:id '.
                                   'AND services.club_id=user_club.club_id '.
                                   'AND user_club.user_id=:userid');
      // NOTE: id must be unquoted: execute already quotes its args
      $aparams=array(':id' => $cid, ':userid' => $userid);
      $auth_query->execute($aparams);
      if ($auth_query->fetchColumn() == 0) return false;
    }
    return true;
}

function can_write_client($db, $userid, $cid) {
    if (!is_admin($db, $userid)) {
      $auth_query = $db->prepare('SELECT COUNT(*) FROM `services`, `user_club` '.
                                  'WHERE services.client_id=:id '.
                                   'AND services.club_id=user_club.club_id '.
                                   'AND user_club.user_id=:userid '.
                                   'AND user_club.can_write=1');
      // NOTE: id must be unquoted: execute already quotes its args
      $aparams=array(':id' => $cid, ':userid' => $userid);
      $auth_query->execute($aparams);
      if ($auth_query->fetchColumn() == 0) return false;
    }
    return true;
}

function can_access_club($db, $user_id, $club_id) {
  if (is_admin($db, $user_id)) return TRUE;
  $has_access_query = $db->prepare('SELECT COUNT(*) FROM `user_club` WHERE `user_id`=:user_id AND `club_id`=:club_id');
  $has_access_query->bindValue(":user_id", $user_id, PDO::PARAM_INT);
  $has_access_query->bindValue(":club_id", $club_id, PDO::PARAM_INT);
  $has_access_query->execute();
  return $has_access_query->fetchColumn() > 0;
}

function can_write_club($db, $user_id, $club_id) {
  if (is_admin($db, $user_id)) return TRUE;
  $has_access_query = $db->prepare('SELECT COUNT(*) FROM `user_club` WHERE `user_id`=:user_id AND `club_id`=:club_id AND can_write=1');
  $has_access_query->bindValue(":user_id", $user_id, PDO::PARAM_INT);
  $has_access_query->bindValue(":club_id", $club_id, PDO::PARAM_INT);
  $has_access_query->execute();
  return $has_access_query->fetchColumn() > 0;
}

function get_club_list($db) {
  $user_id = get_user_id($db);
  if (-1 == $user_id) {
    echo 'Please authenticate yourself!';
    die;
  }
  $clubs = array();
  if (is_admin($db, $user_id)) {
    $id_query = $db->prepare('SELECT `id` FROM `club`');
    $id_query->execute();
  } else {
    $id_query = $db->prepare('SELECT DISTINCT `club_id` FROM `user_club` WHERE user_id=:id');
    $id_query->bindValue(":id", $user_id, PDO::PARAM_INT);
    $id_query->execute();
  }
  foreach ($id_query->fetchAll(PDO::FETCH_NUM) as $user_club) {
    $club_id = $user_club[0];
    $clubs[] = $club_id;
  }
  return $clubs;
}
?>
