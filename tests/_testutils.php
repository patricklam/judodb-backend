<?php 

/**
 * returns the current auto increment
 * index of the table '$tablename'
 */
function my_next_inc($tablename) {
  $rs = mysql_query("SHOW TABLE STATUS WHERE name=$tablename");
  if (isset($rs)) {
    $data = mysql_fetch_assoc($rs);
    return $data['Auto_increment'];
  }
  else return -1;
}

?>
