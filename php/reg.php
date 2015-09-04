<?php
$replyindays=4;
$keyin=$_GET['key'];

if (empty($keyin)){
	//echo "You are not allowed to access this file";
	echo "<META HTTP-EQUIV=\"refresh\" CONTENT=\"0; URL=../index.php#login_form\"> ";
	die();
}else{
	if(isset($_POST['email'])){
$ml=$_POST['email'];
$pwd=$_POST['pwd'];
$fullname=$_POST['fullname'];
$phone=$_POST['phone'];
$street=$_POST['street'];
$city=$_POST['city'];
$country=$_POST['country'];
$web=$_POST['web'];
$male="0";
$today = date('Y-m-d');
$today=date('Y,m,d', strtotime($today));
//echo $ml;
if( isset($_POST['male']))
{
	$male="1";
}
$birthdate=$_POST['bod'];
$birthdate = date('Y/m/d', strtotime($birthdate)); 
$chld='0';	
if( isset($_POST['children']) )
{
	$chld="1";
}

$rply=$_POST['terms'];

$ofrs="0";

if( isset($_POST['offers']) )
{
	$ofrs="1";
}

$srv="0";

if( isset($_POST['service']) )
{
	$srv="1";
}

include "db_config.php";

if (mysqli_connect_errno($con))
  {
  echo "Failed to connect to MySQL: " . mysqli_connect_error();
  
  }
  else
  {
 $sql="INSERT INTO `requests`( `Name`, `country`, `city`, `address`, `username`,  `password`, `phone`, `Nationality`, `Gender`, `birthdate`, `children`, `offers`, `fromothers`,`Reg_request_Date` ) VALUES ('".$fullname."','".$country."','".$city."','".$street."','".$ml."','".$pwd."','".$phone."','".$country."','".$male."','".$birthdate."','".$chld."','".$ofrs."','".$srv."','".$today."')";

$result = mysqli_query($con,$sql);
  }
  $bdy="name: ".$fullname."\n country: ".$country."\n city: ".$city."\n Address: ".$street."\n E-mail: ".$ml."\n password: ".$pwd."\n phone: ".$phone."\n Nationality: ".$country."\n Gender: ".$male."\n Birth Date: ".$birthdate."\n Children: ".$chld."\n Accept receiving offers From company".$ofrs."\n Accept receiving offers From others".$srv;
 // mail("pm1.kcg@gmail.com","new request for tt",$bdy);
  echo  $new_date_format." Thank you for registeration we call you back within".$replyindays." days";
  mysqli_close($con);
	}else{
		
	echo "You are not allowed to access this file";	
	}
};
?>