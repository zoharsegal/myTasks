# Requirements

1.PHP >= 7.2

2.mySQL

3.IIS/apache(mod rewrite need to be enabled)

# Installation

1.Run in CMD:
```
git clone https://github.com/zoharsegal/myTasks
```

2.Copy myTasks content to your main IIS/apache server

3.Run in mySQL CLI:
```
CREATE DATABASE mytasks
```

4.Open CMD and run

```
CD /var/www/html (or whatever location you extracted the files)
```

5.In the CMD run:

```
php artisan migrate
```
