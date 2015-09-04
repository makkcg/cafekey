<?php
header('Content-Type: text/html; charset=utf-8');/// set the content charset to utf-8 for php
////////////////////////////// THIS FILE NEEDS TO BE OPTIMIZED ///////////////////////
///////////////// OPTIMIZATIONS REQUIRED :
////////Connection string to db using include
/////// remove none used functions and codes i.e. IP based functions
/////// remove any expiration checking functions as this check is done at login
/////// use of session variables instated of database connection each time
////// if data will be uploaded to the database from session do the session check first

/// restrict direct access based on a checker
session_start();
$temp= $_POST["param"];
$keyin=$temp;

if (empty($keyin)){
	//echo "You are not allowed to access this file";
	echo "<META HTTP-EQUIV=\"refresh\" CONTENT=\"0; URL=../index.php#login_form\"> ";
	die();
}
// if any errors show on the screen
//// Function to check if the email is existing in the the database for updating the userprofile, the function uses the POST[emailtocheck] and echo "exist" if the user exists otherwise echo "notexist"
/// IMPORTANT : dont check the email for the same user id as it will return exist
function checkifemailexist(){
	///Please write the code
}

//// Function to check if the username is existing in the the database for updating the userprofile, the function uses the POST[usertocheck] and echo "exist" if the user exists otherwise echo "notexist"
/// IMPORTANT : dont check the user name for the same user id as it will return exist
function checkifuserexist(){
	///Please write the code
}
///////////////


//error_reporting(E_ALL);
//ini_set('display_errors', '1');
$temp= $_POST["param"];
$param = explode("~", $temp);
$uid=0;
$uid=$_SESSION['user_id'];



$ordr=(int)$param[0];

$sql="";
switch ($ordr) {
    case 0:
       $sql="SELECT DISTINCT  `country` FROM `companies`";
        break;
	case 1:
       $sql="SELECT DISTINCT  `city` FROM `companies` WHERE `country`='".$param[1]."'";
       break;
	   case 2:
       $sql="SELECT DISTINCT  `province` FROM `companies` WHERE `city`='".$param[1]."'";
       break;
	   case 3:
       $sql="SELECT `CName` FROM `companies` WHERE `province`='".$param[1]."'";
       break;
	   case 4:
	   $sql="SELECT `address`,`phone1`,`phone2`,`phone3` ,`lic_num`, `website` ,`logo`,`admin`,`adminpwd` , `email` FROM `companies` WHERE `CName`='".$param[1]."'";
	break;
	   case 5:
       $sql="SELECT `intro` FROM `companies` WHERE `CName`='".$param[1]."'"; break;  
	   case 6 :
	   $sql=$param[1];
	   $sql=str_replace("yoyo",strval($uid),$sql);
	   break;
	   case 7: 
	   $sql="SELECT `ID` FROM `companies` WHERE `CName`='".$param[1]."'"; break;
	   case 8:
	   $sql="SELECT COUNT(`ID`) FROM `companies` WHERE `CName`='".$param[1]."'"; break;
	   case 9:if (!file_exists('logo/'.$param[1])) { mkdir('logo/'.$param[1], 0777, true);};break;
	   case 10:
	   $sql="DELETE FROM `companies` WHERE `ID`=".$param[1]; break;
	   case 11:
	   $sql="INSERT INTO `users`(`username`,`password`,`user_type`,`company_id`) VALUES('".$param[1]."','".$param[2]."','".$param[3]."',".$param[4].")";break;
	   case 12:
	   $sql="SELECT `id`,`username`FROM `users` WHERE `company_id`=".$param[1]." AND `user_type`='user'" ; break;
	    case 13:
	   $sql="SELECT `users`.`base_pwd`,`profile`.`First_name` , `profile`.`last_name`,`profile`.`email`  FROM `users` inner join `profile` on (`users`.`id`=`profile`.`user_id`) WHERE `users`.`id`=".$param[1]." AND `user_type`='user'"; break;
	    case 14:
		 $sql="SELECT `base_pwd` FROM `users`  WHERE `id`=".$uid; break;
		case 15:
		$sql="SELECT `First_name`  FROM `profile`  WHERE `user_id`=".$param[1]; break;
		case 16:
		$sql="UPDATE `users` SET `username`='".$param[1]."', `password`='".$param[2]."' , `base_pwd`='".$param[3]."' WHERE `id`=".$param[4];break;
		case 17:
		$sql="INSERT INTO `users`(`username`,`password`,`base_pwd`,`company_id`,`user_type`) VALUES('".$param[1]."','".$param[2]."','".$param[3]."',".$param[4].",'user')";break;
		case 18:
		$sql="UPDATE `profile` SET `First_name`='".$param[1]."', `last_name`='".$param[2]."' ,`email`='".$param[3]."' WHERE `user_id`=".$param[4];break;
		case 19:
		$sql="INSERT INTO `profile`(`First_name`,`last_name`,`email`,`user_id`) VALUES('".$param[1]."','".$param[2]."','".$param[3]."',".$param[4].")";break;

case 20:
$sql="SELECT `id` FROM `users`  WHERE `username`='".$param[1]."' AND `password`='".$param[2]."' AND `company_id`=".$param[3];break;
 case 21:
	   $sql="DELETE FROM `users` WHERE `id`=".$param[1]; break;
case 22:
	   $sql="DELETE FROM `profile` WHERE `user_id`=".$param[1]; break;	
case 23:
	   $sql="DELETE FROM `results` WHERE `user_id`=".$param[1]; break;	 
case 24:
	   $sql="DELETE FROM `aresults` WHERE `user_id`=".$param[1]; break;  
case 25:
	   $sql="SELECT `lic_num` FROM `companies` WHERE `ID`=".$param[1]; break; 
case 26:
	   $sql="SELECT COUNT(`id`) FROM `users` WHERE `username`='".$param[1]."'";
	    break;	
case 27:if (!file_exists('personal/'.$param[1])) { mkdir('personal/'.$param[1], 0777, true);}; 
if (!copy('../images/personal.gif', 'personal/'.$param[1].'/'.$param[1].'.gif')) {
    echo "failed to copy the file...\n";
}
break;    
    case 28:
	$sql="SELECT `id`,`company_id` FROM `users` WHERE `username`='".$param[1]."' AND  `password`='".$param[2]."'";break;

 	case 29:
	$sql="SELECT `CName` FROM `companies` WHERE `ID`=".$param[1];break;
	
	
	case 30:
	//get the first and last name of the user id
	$sql="SELECT `First_name`,`last_name` FROM `profile` WHERE `user_id`=".$uid;break;
	
	case 31:
	//get the user type if admin or normal user by checking his user name and password
	$sql="SELECT `user_type` FROM `users` WHERE `username`='".$param[1]."' AND  `password`='".$param[2]."'";break;
	case 32:
	$sql="SELECT `logo` FROM `companies` WHERE `ID`=".$param[1];break;
	///// param 33 :check user profiles with in profile table that has the same user id , also used to check if the user has a profile or not
	case 33:
	$sql="SELECT count(`user_id`) FROM `profile` WHERE `user_id`=".$uid;break;
	///// get all the user data from profile table according to user id
	case 34:
	$sql="SELECT `fullname`, `mobile`,`email` , `mobile2`, `address`, `jobtitle`, `type`, `notes`, `phone`, `profileid` FROM `profile` WHERE `user_id`=".$uid;break;
	///photo is not used now
	case 35:
	$sql="SELECT `photo` FROM `profile` WHERE `user_id`=".$uid;break;
   
	case 36:
	$sql="SELECT `ID`, `ex_title` FROM `custex` WHERE `company_id`=".$param[1];break;
	case 37:
	$sql="SELECT `ex` FROM `custex` WHERE `ID`=".$param[1];break;
	case 38:
	$sql="SELECT `exercises`.`exercise_level`, `exercises`.`exercise_title`, `results`.`speed`, `results`.`accuracy` FROM  `exercises` inner join `results` on ( `exercises`.`exercise_level` = `results`.`level` AND `exercises`.`exercise_number`=`results`.`lesson_number`) WHERE `results`.`user_id`=".$uid;break;
	case 39:
	$sql="SELECT  `custex`.`ex_title`, `cresult`.`speed`, `cresult`.`accuracy` FROM  `custex` inner join `cresult` on (`custex`.`ID`=`cresult`.`lesson_number` ) WHERE `cresult`.`user_id`=".$param[1];break;
	
case 40:
	$sql="SELECT `First_name`,`last_name` FROM `profile` WHERE `user_id`=".$uid;break;
case 41:
	$sql="SELECT COUNT( DISTINCT `exercises`.`exercise_id`) FROM `exercises` inner join `results`  on (`exercises`.`exercise_number`= `results`.`lesson_number` AND `exercises`.`exercise_level` = `results`.`level`) inner join `users` on (`results`.`user_id` = `users`.`id`) WHERE `results`.`speed` > 10 AND `results`.`accuracy` > 60 AND `users`.`id`=".$uid." AND `exercises`.`exercise_level`=".$param[2] ;break;	
case 42:
	$sql="SELECT `exercise_number`,`exercise_title` FROM `exercises` WHERE `exercise_level`=".$param[1]." ORDER BY `exercise_number`";break;
	
case 43:
	$sql="SELECT COUNT(`exercise_id`) FROM `exercises` WHERE `exercise_level`=".$param[1];break;
	
case 44:

$sql="SELECT COUNT(`lesson_number`) FROM `results` WHERE  `level`=".$param[2]." AND `user_id`=".$uid;break;

case 45:

$sql="SELECT COUNT(DISTINCT `lesson_number`) FROM `results` WHERE  `level`=".$param[2]." AND `user_id`=".$uid;break;

case 46:
$sql="SELECT COUNT(`lesson_number`) FROM `results` WHERE   `speed` > 10 AND `accuracy` > 60 AND `level`=".$param[2]." AND `user_id`=".$uid;break;

case 47:
$sql="SELECT COUNT(DISTINCT `lesson_number`) FROM `results` WHERE   `speed` > 10 AND `accuracy` > 60 AND `level`=".$param[2]." AND `user_id`=".$uid;break;
case 48:
$sql="SELECT COUNT(`lesson_number`)  FROM `cresult`   WHERE `user_id`=".$uid;break;

case 49:
$sql="SELECT COUNT(DISTINCT `lesson_number`)  FROM `cresult` WHERE `user_id`=".$uid;break;

case 50:
$sql="SELECT COUNT(`lesson_number`)  FROM `cresult`   WHERE `speed` > 10 AND `accuracy` > 60 AND `user_id`=".$uid;break;
case 51:
$sql="SELECT COUNT(DISTINCT `lesson_number`)  FROM `cresult`  WHERE `speed` > 10 AND `accuracy` > 60 AND `user_id`=".$uid;break;
case 52:
$sql="SELECT `id` FROM `users` WHERE `company_id`=20";break;
case 53:
$sql="SELECT `intro` FROM `companies` WHERE `ID`=".$param[1];break;

case 54:
$sql="SELECT COUNT( DISTINCT `exercises`.`exercise_id`) FROM `exercises` inner join `results`  on (`exercises`.`exercise_number`= `results`.`lesson_number` AND `exercises`.`exercise_level` = `results`.`level`) inner join `users` on (`results`.`user_id` = `users`.`id`) WHERE `results`.`speed` > 10 AND `results`.`accuracy` > 60 AND `users`.`id`=".$uid ;break;	
case 55:
$sql="SELECT `id`,(`escore` + `espscore`)  FROM `users` WHERE `company_id`=20 ORDER BY (`escore` + `espscore` ) desc";
case 56:
$sql="SELECT count(`exercise_id`) FROM `exercises`";break;
case 57:
$sql="SELECT count(`ID`) FROM `custex` WHERE `company_id`=20";break;
case 58:
$sql="SELECT AVG(`speed`) FROM `results` WHERE `user_id` =".$uid;break;
case 59:
$sql="SELECT AVG(`accuracy`) FROM `results` WHERE `user_id`=".$uid;break;
case 60:
$sql="SELECT AVG(`speed`) FROM `cresult` WHERE `user_id`=".$uid;break;
case 61:
$sql="SELECT AVG(`accuracy`) FROM `results` WHERE `user_id`=".$uid;break;
case 62:
$sql="CALL prepare_rank(".$param[1].")";break;
case 63:
$sql="CALL update_rank(".$param[1].")";break;
case 64:
$sql="SELECT  `rank`.`evalue`, `profile`.`First_name` ,`profile`.`last_name` FROM `rank` inner join `profile` on (`rank`.`user_id`= `profile`.`user_id`) WHERE `rank`.`company_id`=20  ORDER BY `rank`.`evalue` desc";break;

case 65:
$sql="SELECT count(`ID`) FROM `requests` WHERE `username`='".$param[1]."'";break;
case 66:
$sql="SELECT count(`id`) FROM `users` WHERE `username`='".$param[1]."'";break;
case 67:
	$sql="SELECT `username` FROM `users`  WHERE `id`=".$uid; break;
case 68:
$sql="UPDATE `users` SET `password`='".sha1($param[1])."' WHERE `id`=".$uid; break;
case 69:
$sql="SELECT COUNT( DISTINCT `exa`.`ex_id`) FROM `exa` inner join `aresults`  on (`exa`.`ex_number`= `aresults`.`lesson_number` AND `exa`.`ex_gno` = `aresults`.`level`) inner join `users` on (`aresults`.`user_id` = `users`.`id`) WHERE `aresults`.`speed` > 10 AND `aresults`.`accuracy` > 60 AND `users`.`id`=".$uid." AND `exa`.`ex_gno`=".$param[2] ; break;
case 70:
$sql="SELECT COUNT(`ex_id`) FROM `exa` WHERE  `ex_gno`=".$param[1] ; break;
case 71:
$sql="SELECT `ex_number`,`ex_title` FROM `exa` WHERE `ex_gno`=".$param[1]." ORDER BY `ex_number`" ; break;
case 72:
$sql="SELECT `ex_group` FROM `exa` WHERE `ex_gno`=".$param[1] ; break;
case 73:
	$sql="SELECT `exa`.`ex_group`, `exa`.`ex_title`, `aresults`.`speed`, `aresults`.`accuracy` FROM  `exa` inner join `aresults` on ( `exa`.`ex_gno` = `aresults`.`level` AND `exa`.`ex_number`=`aresults`.`lesson_number`) WHERE `aresults`.`user_id`=".$uid;break;
case 74:
// get the last login date
	$sql="SELECT `Last_Login` FROM `users` WHERE `id`=".$uid;break;
case 75:
	$sql=$_SESSION['expir_date'];break;

}
include "db_config.php"; 
$result = mysqli_query($con,$sql);
$rr="";
$rrr="";
if($ordr< 4)
{
while ($row = $result->fetch_row())
  {
if($rr=="") $rr=$row[0]; else $rr=$rr."~".$row[0];
  
  }
}
if($ordr== 4)
{
	if ($row = $result->fetch_row())
	{
		$rr=$row[0]."~".$row[1]."~".$row[2]."~".$row[3]."~".$row[4]."~".$row[5]."~".$row[6]."~".$row[7]."~".$row[8]."~".$row[9];
	}

}
if($ordr== 5)
{
	if ($row = $result->fetch_row())
	{
		$rr=$row[0];
	}
}
if($ordr== 7 )
{
	if ($row = $result->fetch_row())
	{
		$rr=strval($row[0]);
	}
	else $rr=$sql;
}
if($ordr== 8)
{
	if ($row = $result->fetch_row())
	{
		$rr=strval($row[0]);
	}
}
$rrr="";
if($ordr== 12)
{
	while ($row = $result->fetch_row())
	{
		if($rr=="") $rr=strval($row[0]); else $rr=$rr."~".strval($row[0]);
		if($rrr=="") $rrr=$row[1]; else $rrr=$rrr."~".$row[1];
		
	}
	if($rr!="") $rr=$rr.",".$rrr;
}

if($ordr== 13)
{
	if ($row = $result->fetch_row())
	{
		$rr=$row[0]."~".$row[1]."~".$row[2]."~".$row[3];
	}
	else  $rr="none";

}

if($ordr== 14)
{
	if ($row = $result->fetch_row())
	{
		$rr=$row[0];
	}
}
if($ordr== 15)
{
	if ($row = $result->fetch_row()) $rr="Found";
	else $rr="Not Found";
}
if($ordr== 20 )
{
	if ($row = $result->fetch_row())
	{
		$rr=strval($row[0]);
	}
	else $rr=$sql;
}
if($ordr== 25)
{
	if ($row = $result->fetch_row())
	{
		$rr=strval($row[0]);
	}
}

if($ordr== 26)
{
	if ($row = $result->fetch_row())
	{
		$rr=strval($row[0]);
	}
}

if($ordr== 28)
{
	if ($row = $result->fetch_row())
	{
		$rr=strval($row[0])."~".strval($row[1]);
	}
}

if($ordr== 29)
{
	if ($row = $result->fetch_row())
	{
		$rr=$row[0];
	}
	
}

if($ordr== 30)
{
	if ($row = $result->fetch_row())
	{
		$rr=strval($row[0])." ".strval($row[1]);
	}
	else $rr="None";
}

if($ordr== 31)
{
	if ($row = $result->fetch_row())
	{
		$rr=$row[0];
	}
}

if($ordr== 32)
{
	if ($row = $result->fetch_row())
	{
		$rr=$row[0];
	}
}

if($ordr== 33)
{
	if ($row = $result->fetch_row())
	{
		$rr=strval($row[0]);
	}
}

if($ordr==34)
{
	if ($row = $result->fetch_row())
	{
		if(!$row[0]) $row[0]='None';
		if(!$row[1]) $row[1]='None';
		if(!$row[2]) $row[2]='None';
		if(!$row[3]) $row[3]='None';
		if(!$row[4]) $row[4]='None';
		if(!$row[5]) $row[5]='None';
		if(!$row[6]) $row[6]='None';
		if(!$row[7]) $row[7]='None';
		if(!$row[8]) $row[8]='None';
		if(!$row[9]) $row[9]='None';
		if(!$row[10]) $row[10]='None';
		if(!$row[11]) $row[11]='None';
		if(!$row[12]) $row[12]='None';
		if(!$row[13]) $row[13]='None';
		if(!$row[14]) $row[14]='None';
		if(!$row[15]) $row[15]='None';
		if(!$row[16]) $row[16]='None';
		if(!$row[17]) $row[17]='None';
		
	$rr = $row[0]."~".$row[1]."~".$row[2]."~".strval($row[3])."~".$row[4]."~".$row[5]."~".$row[6]."~".$row[7]."~".$row[8]."~".$row[9]."~".$row[10]."~".$row[11]."~".$row[12]."~".$row[13]."~".$row[14]."~".$row[15]."~".$row[16]."~".$row[17];
	}
}

if($ordr==35)
{
	if($result)
	{
	if ($row = $result->fetch_row())
	{
		if(!$row[0]) $rr="user.jpg";
		else $rr=$uid."/".$row[0];
	}
	else  $rr="user.jpg";
	}
	else  $rr="user.jpg";
}

if($ordr== 36)
{
	while ($row = $result->fetch_row())
	{
		if($rr=="") $rr=strval($row[0]); else $rr=$rr."~".strval($row[0]);
		if($rrr=="") $rrr=$row[1]; else $rrr=$rrr."~".$row[1];
		
	}
	if($rr!="") $rr=$rr.",".$rrr;
}

if($ordr== 37)
{
	if ($row = $result->fetch_row())
	{
		$rr=$row[0];
	}
}

if($ordr== 38)
{
	while ($row = $result->fetch_row())
	{
		if($rr=="") $rr=strval($row[0])."~".strval($row[1])."~".strval($row[2]) ."~".strval($row[3]); 
		else $rr=$rr.",".strval($row[0])."~".strval($row[1])."~".strval($row[2]) ."~".strval($row[3]); 
	
		
	}

}

if($ordr== 39)
{
	while ($row = $result->fetch_row())
	{
	if($rr=="") $rr=strval($row[0])."~".strval($row[1])."~".strval($row[2]) ; 
	else $rr=$rr.",".strval($row[0])."~".strval($row[1])."~".strval($row[2]) ; 
			
	}

}

if($ordr== 40)
{
	if ($row = $result->fetch_row())
	{
		$rr=$row[0]." ".$row[1];
	}
}
if($ordr== 41)
{
	if ($row = $result->fetch_row())
	{
		$rr=strval($row[0]);
	}
}

if($ordr== 42)
{
	while ($row = $result->fetch_row())
	{
		if($rr=="") $rr=strval($row[0]); else $rr=$rr."~".strval($row[0]);
		if($rrr=="") $rrr=$row[1]; else $rrr=$rrr."~".$row[1];
		
	}
	if($rr!="") $rr=$rr.",".$rrr;
}

if(($ordr> 42) && ( $ordr<52))
{
	if ($row = $result->fetch_row())
	{
		$rr=strval($row[0]);
	}
}

if($ordr== 52)
{
	while ($row = $result->fetch_row())
	{
		if($rr=="") $rr=strval($row[0]); else $rr=$rr."~".strval($row[0]);
		
		
	}
}

if($ordr== 53)
{
	if ($row = $result->fetch_row())
	{
		$rr=$row[0];
	}
}

if($ordr== 54)
{
	if ($row = $result->fetch_row())
	{
		$rr=strval($row[0]);
	}
}

if($ordr== 55)
{
	while ($row = $result->fetch_row())
	{
		if($rr=="") $rr=strval($row[0]); else $rr=$rr."~".strval($row[0]);
		if($rrr=="") $rrr=strval($row[1]); else $rrr=$rrr."~".strval($row[1]);
		
	}
	if($rr!="") $rr=$rr.",".$rrr;
}
if($ordr== 56)
{
	if ($row = $result->fetch_row())
	{
		$rr=strval($row[0]);
	}
}
if($ordr== 57)
{
	if ($row = $result->fetch_row())
	{
		$rr=strval($row[0]);
	}
}
if($ordr==64)
{
	while ($row = $result->fetch_row())
	{
		if($rr=="") $rr=strval($row[0]); else $rr=$rr."~".strval($row[0]);
		if($rrr=="") $rrr=$row[1]." ".$row[2]; else $rrr=$rrr."~".$row[1]." ".$row[2];
		
	}
	if($rr!="") $rr=$rr.",".$rrr;
}

if($ordr== 65)
{
	if ($row = $result->fetch_row())
	{
		$rr=strval($row[0]);
	}
}

if($ordr== 66)
{
	if ($row = $result->fetch_row())
	{
		$rr=strval($row[0]);
	}
}
if($ordr== 69)
{
	if ($row = $result->fetch_row())
	{
		$rr=strval($row[0]);
	}
}

if($ordr== 71)
{
	while ($row = $result->fetch_row())
	{
		if($rr=="") $rr=strval($row[0]); else $rr=$rr."~".strval($row[0]);
		if($rrr=="") $rrr=$row[1]; else $rrr=$rrr."~".$row[1];
		
	}
	if($rr!="") $rr=$rr.",".$rrr;
}

if($ordr== 70)
{
	if ($row = $result->fetch_row())
	{
		$rr=strval($row[0]);
	}
}

if($ordr== 72)
{
	if ($row = $result->fetch_row())
	{
		$rr=$row[0];
	}
}

if($ordr== 73)
{
	while ($row = $result->fetch_row())
	{
		if($rr=="") $rr=strval($row[0])."~".strval($row[1])."~".strval($row[2]) ."~".strval($row[3]); 
		else $rr=$rr.",".strval($row[0])."~".strval($row[1])."~".strval($row[2]) ."~".strval($row[3]); 
	
		
	}

}

if($ordr== 16) $rr=$sql;
if($ordr== 17) $rr=$sql;
mysqli_close($con);
if($ordr== 6) if($result ) $rr="Record saved"; else $rr=$sql;
if($ordr== 10) if($result ) $rr="Company Deleted"; else $rr=$sql;
if($ordr== 75)// return expiration date from session varialbe
{
$rr=$sql;
}
if($ordr== 67)
{
	if ($row = $result->fetch_row())
	{
		$rr=$row[0];
	}
}

echo $rr;

?>
