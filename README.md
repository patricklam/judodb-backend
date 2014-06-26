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

