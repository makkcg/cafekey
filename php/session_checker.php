<?php
function sessionchecker($userID){
//start the session after succesfull login include the session checker in all files
 //session_start();
 if($userID>0){
//check if there is an active session exist on the current computer
$userisloggged=0;
$local_session_id = session_id();
	//echo $local_session_id ;die();
	//get active session id for user from DB
 	$current_session_id_from_DB=0;//initialize seession id from db variable
	include "db_config.php";
	//connect to the databse generate information for storing into session
	//if connected successeded open sessions //then contenu proceding to check first login";
	$sqlsession="SELECT `users`.`sessionDB_ID` FROM `users` WHERE `id`='".$userID."'";// get all the fields form the database "user" table for this user 
    $sqlconSess=   mysqli_query($con, $sqlsession);
	//return mysqli_fetch_row($sqlcon4);
	if ($sqlresSess =  mysqli_fetch_row($sqlconSess)){
		$current_session_id_from_DB=	$sqlresSess[0];
	}
 if(!isset($_SESSION['login_status'])){
    header('location:index.php#login_form');
 }else{
	//echo $current_session_id_from_DB;die();
 //check if id is not valid
 	if($local_session_id != $current_session_id_from_DB){
  		session_destroy();
 		header('location:index.php#login_form');
 		die();
 	}
	 $userisloggged=1;
 }
  
  return $userisloggged;
  // echo $userisloggged;die();
 }else{// if user id is empty or equal to 0 , this means that their is no session
	 $userisloggged=0;
	 return $userisloggged;
 }
}
?>