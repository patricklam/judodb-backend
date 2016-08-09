judodb-backend
==============

PHP code for JudoDB backend.

Requires PHP, some SQL database, FPDF for PDF generation, PHPExcel for XLS generation.

Create a _dbconfig.php file with the following fields:

$DBI_DATABASE="judoanjou";
$DBI_USERNAME="anjoudb";
$DBI_PASSWORD="y9km3jd#m";
$DBI_HOST="";

Backup strategy: here's what I do.

0. Create a passwordless ssh key (~/.ssh/backup_dsa) on the backup
slave and a user on the server. I tried to set its shell to
/bin/false, but that doesn't work.

1. Dump the database to /xtra/judoanjou-backups on the server.

58 04 * * * /usr/bin/mysqldump --user=anjoudb --password=y9km3jd#m judoanjou > /xtra/judoanjou-backups/db-`/bin/date +\%Y\%m\%d`

2. rsync from the server to a backup slave.

57 05 * * * /usr/bin/rsync -e "/usr/bin/ssh -i /home/plam/.ssh/backup_dsa" -a "backups@anjou.uwaterloo.ca:/xtra/judoanjou-backups/" /xtra/judoanjou-backups

Design documentation
====================

The PHP scripts expose information to the frontend by constructing
JSON responses. The core scripts are the `pull_*` and `push_*`
scripts, which pull data from/push data to the database. There are
also helper scripts which provide authentication and database
services, plus the `listes*` scripts which don't access the database
at all; they simply convert their input into PDF or XLS formats, which
we can't easily do in the frontend.

pull scripts
------------

Prefix: `pull_*.php`

These scripts grab data from the database and send it to the frontend
in JSON format. They should always require_authentication() and, if
they are pulling client data, should check that the user has
permission to access the specific client being pulled. That last
condition should be required for all pull scripts which contain
'client'.

* `pull_one_client.php`: Returns client info for the selected client.
* `pull_all_clients.php`: Returns information on all clients and all
  signups over all time.
* `pull_client_list.php`: Returns a list of client IDs + nom/prenom
  pairs + seasons for which the client has signed up.
* `pull_club_cours.php`: Returns a list of classes for the given club (and session).
* `pull_club_list.php`: Returns a list of clubs.
* `pull_all_users.php`: Returns all users that may connect to the DB.
* `pull_config.php`: Not implemented yet.

push scripts
------------

Prefix: `push_*.php`

These scripts write data to the database. The data is transmitted in
POST arguments.

* `push_multi_clients.php`: Push a number of updates to the database
  in a single request. Used in the list front-end widget.
* `push_one_client.php`: Push client data for a single client to the database.
* `confirm_push.php`: Actually carries out the requested write. Must be
  called after push_*.php.

Binary output scripts
---------------------

Prefix: `listes*.php`

These scripts do not require authentication, since they do not perform any
database access. They use the fpdi and PHPExcel libraries to produce output,
based on the POST input.

Input files: 

    ft303version2013.pdf

* `listesft.php`: creates an FT-303 form for tournament entry.
* `listespdf.php`: creates a PDF listing of a class or multiple classes.
* `listespresences.php`: creates a PDF usable as a class list.
* `listesxls.php`: creates an XLS containing class lists.
* `listesxlsfull.php`: creates an XLS containing all client information from the database for a season.

Helper scripts
--------------

Prefix: `_*.php`

* `_authutils.php`: rely on $_SESSION to read off the current user info.
* `_constants.php`: defines lists of db columns to be used when writing to the database.
* `_pdo.php`: pdo DB helper functions.
* `_dbconfig.php`: DB configuration.
* `_produce_fpdi_output.php`: helper function for producing PDF output with fpdi.
* `_userutils.php`: helper functions for access control; also UTF encoding.
