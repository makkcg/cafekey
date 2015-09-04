<?php
header('Content-Type: text/html; charset=utf-8');/// set the content charset to utf-8 for php

/// restrict direct access based on a checker
session_start();


$temp= $_POST['key1'];
$keyin=$temp;
if (empty($keyin)){// key that is the order code e.g. 33~ sent by ajax to confirm the source of post
	//echo "You are not allowed to access this file";
	echo "<META HTTP-EQUIV=\"refresh\" CONTENT=\"0; URL=../index.php#login_form\"> ";
	die();
}

include "db_config.php"; 

///// specific for add new customer modal window post/////////////////////////////

if(isset($_POST['cust_fullname'])){
//echo $_POST['cust_fullname'];
if($_POST['key1']=="addnewcustform"){
$sql = "INSERT INTO `profile` (`user_id`, `profileid`, `fullname`, `mobile`, `mobile2`, `email`, `address`, `jobtitle`, `type`, `phone`, `notes`) VALUES ('".$_POST['cust_user_id']."', NULL,'".$_POST['cust_fullname']."', '".$_POST['cust_mob1']."','".$_POST['cust_mob2']."','".$_POST['cust_email']."','".$_POST['cust_addr']."','".$_POST['cust_job']."','".$_POST['cust_prof_type']."','".$_POST['cust_phone']."','".$_POST['cust_notes']."');";
$result = mysqli_query($con,$sql);
//$sql_results=$row[0];
//echo $_POST['cust_fullname']."   ".$_POST['cust_user_id']."   ".$_POST['cust_mob2'] ."   ".$_POST['cust_email'] ."   ".$_POST['cust_job'];

echo $result;
}

}
//////////////////////////////////////////////////////////////////////

//error_reporting(E_ALL);
//ini_set('display_errors', '1');


?>