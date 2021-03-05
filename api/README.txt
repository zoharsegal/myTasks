copy the folder to your apache/iis host:

1.First create database
in mySQL :

CREATE DATABASE myTasks;

2.in CMD write cd /var/www/html/myTasks (or whatever location you put it)

3.run:

php artisan migrate
