<?php
//Contains functions we test in this file
require_once ('../_userutils.php');

// The following files contain helper functions we use
require_once ('../_authutils.php');
require_once ('../_database.php');

class TestUserUtils extends PHPUnit_Framework_TestCase {

/**
 * The test database contains a user that is dedicated
 * for running test cases. The database table 'user'
 * contains its 'email' and 'plus_identity' information.
 *
 * The 'setup' function manually retrieves the test
 * user 'id' to compare it with the value returned by
 * the function 'get_user_id' from '_userutils.php'.
 */

  private $db_testuser_id = -1;

  protected function setup() {
    unset($_SESSION['authenticated']);
    unset($_SESSION['plus_identity']);

    $_SESSION['email'] = 'judodb_tester@gmail.com';
 
    $rs = db_query_get("SELECT `id` FROM `user` WHERE email='$email'");
    $this->assertGreaterThan(0, count($rs), "There must be a test user " . 
      					  "in the 'user' table");

    $db_testuser_id = $rs[0]['id'];
  }

  protected function tearDown() {
  }

  /**
   * The current test is only based on the 'email' address
   * value and does not take into account cases where the
   * 'plus_identity' and 'username' are taken into account.
   */
  public function test_get_user_id() {
    $user_id = get_user_id();
    $this->assertNotEquals(-1, $user_id, "Negative test user if " . 
      "retrieved from the 'user' table");

    $this->assertEquals($user_id, $db_testuser_id, "'get_user_id() returns a " . 
      "different 'id' for the test user if Negative test user if retrieved " . 
      "from the 'user' table");
  }

  public function test_get_club_list() {
  }

}
?>
