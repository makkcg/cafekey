<?php
header('Content-Type: text/html; charset=utf-8');/// set the content charset to utf-8 for php
////////////////Important note ////////
/// when calling logout file you have to send the user id in a GET call using id= xxxxx parameter, xxxxx is the user id stored at the session
//$userId=11;/// used for hard logout for debugging
$userId=$_GET['id'];
if (empty($userId)){
	echo "You are not allowed to access this file";
	echo "<META HTTP-EQUIV=\"refresh\" CONTENT=\"0; URL=../index.php#login_form\"> ";
	die();
}

 session_start();
 //destroy session
 session_destroy();
 //update SESSION ID  user table  to 0 in database or file
 $ses_id = 0;
 
 /// change the userlogin_flag in the database to 0
 //mysqli_close($con);
	include "db_config.php";
 $sqlloggout="Update `users` SET `userlogin_flag`='0',`sessionDB_ID`='".$ses_id."' WHERE `id`='".$userId."'";
		$sqlconlogout=   mysqli_query($con, $sqlloggout);
;

 if($sqlconlogout){
	
echo "<META HTTP-EQUIV=\"refresh\" CONTENT=\"0; URL=../index.php#login_form\"> ";
 }
?>