import csv
club_id = 911
club_name = 'test.csv'
with open (club_name, 'rb') as csvfile:
    f = csv.reader(csvfile, delimiter=',')
    for row in f:
        print "UPDATE `client` INNER JOIN `services` ON `client`.id = `services`.client_id SET ddn='{}' WHERE nom='{}' AND prenom='{}' AND club_id={};".format(row[2].replace('/', '-'), row[0], row[1], club_id)
