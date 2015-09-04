<?php
$mysql_db_hostname = "localhost";
$mysql_db_user = "root";
$mysql_db_password = "";
$mysql_db_database = "mokacafeop";

//mysqli_close($con);

// online
// $mysql_db_hostname = "localhost";
// $mysql_db_user = "root";
// $mysql_db_password = "";
// $mysql_db_database = "khalifa";
//$con->set_charset('utf8');
$con = mysqli_connect($mysql_db_hostname, $mysql_db_user, $mysql_db_password,$mysql_db_database) or die("يوجد مشكلة في الاتصال بقاعدة البيانات ، يرجى اعادة المحاولة لاحقا أو الاتصال بخدمة العملاء" .mysqli_connect_error());
$con->set_charset('utf8');


?>