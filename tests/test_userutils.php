<?php
require_once ('PHPUnit/Autoload.php');

//Contains functions we test in this file
require_once ('../_userutils.php');

// The following files contain helper functions we use
require_once ('../_authutils.php');
require_once ('../_database.php');

require_once ('_testutils.php');

class TestUserUtils extends PHPUnit_Framework_TestCase {

/**
 * The test database contains a user that is dedicated
 * for running test cases. The database table 'user'
 * contains its 'email' information.
 *
 * The 'setup' function manually retrieves the test
 * user 'id' to compare it with the value returned by
 * the function 'get_user_id' from '_userutils.php'.
 */

  private $link;
  private $db_testuser_id = -1;
  private $test_club_id;
  private $test_club_nom = 'test_Waterloo Club';
  private $test_club_numero = '0987654321';

  protected function setup() {
    global $DBI_DATABASE, $DBI_HOST, $DBI_USERNAME, $DBI_PASSWORD;

    $_SESSION['authenticated'] = 'yes';
  
    $this->link = mysql_connect($DBI_HOST, $DBI_USERNAME, $DBI_PASSWORD) || die("could not connect to db");    
    mysql_select_db($DBI_DATABASE) || die("could not select db");

    $email = $_SESSION['email'] = 'judodb_tester@gmail.com';
 
    $rs = db_query_get("SELECT `id` FROM `user` WHERE email='$email'");
    $this->assertGreaterThan(0, count($rs), "There must be a test user " . 
      					  "in the 'user' table");
    $this->db_testuser_id = $rs[0]['id'];

    //test_get_club_list
    if (-1 != $this->db_testuser_id) {
      $q0 = "INSERT INTO `club` (`nom`, `numero_club`) " .
	"VALUES ('$this->test_club_nom', $this->test_club_numero)";

      $rs0 = mysql_query($q0);
      $this->test_club_id = 1 + my_next_inc($this->link);
      
      $q1 = "INSERT INTO `user_club` (`user_id`, `club_id`) " . 
	"VALUES ($this->db_testuser_id,  $this->test_club_id)";
      $rs1 = mysql_query($q1);

      $this->assertEquals(true, $rs0, "Could not insert test club into the table 'user'.");
      $this->assertEquals(true, $rs1, "Could not insert test club into the table 'user_club'.");
    }
  }

  protected function tearDown() {
    if (-1 != $this->db_testuser_id) {
      $rs0 = mysql_query("DELETE FROM `club` WHERE id=$this->test_club_id"); 
      $rs1 = mysql_query("DELETE FROM `user_club` WHERE " . 
	"user_id=$this->db_testuser_id AND club_id=$this->test_club_id`");      
    }
  }

  /**
   * The current test is only based on the 'email' address
   * value and does not take into account cases where the
   * 'username' is taken into account.
   */
  public function test_get_user_id() {
    $user_id = get_user_id();
    $this->assertNotEquals(-1, $user_id, "Negative test user is " . 
      "retrieved from the 'user' table");

    $this->assertEquals($user_id, $this->db_testuser_id, "'get_user_id() returns a " . 
      "different 'id' for the test user if Negative test user if retrieved " . 
      "from the 'user' table");
  }

  public function test_get_club_list() {
    $found_test_club = false;
    $rs0 = mysql_query("SELECT * FROM `user_club` WHERE user_id=$this->db_testuser_id");
    $all_clubs = array();
    while ($user_club = mysql_fetch_object($rs0)) {
      if ($this->test_club_id == $user_club->club_id) {
	$found_test_club = true;
	break;
      }
    }
    $this->assertEquals(true, $found_test_club, "Could not find the club with id: $this->test_club_id");
  }

}
?>
