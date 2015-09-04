<?php
header('Content-Type: text/html; charset=utf-8');/// set the content charset to utf-8 for php
session_start();
//PHP debugging
//error_reporting(E_ALL);
//ini_set('display_errors', '1');
///// variables to be used in the file
$uname=$_POST['login'];
$upwd=$_POST['password'];
$logkey=$_POST['key'];
//// debugging function to send variable to to ajax
function debug($variabletodebug){
	$msgArr=array();
$msg1= $variabletodebug;
	$msg2="debug";
	$msgArr=array(msg1=>$msg1,msg2=>$msg2);
	echo json_encode($msgArr);
}
$keyin=$logkey;

if (empty($keyin)){
	//echo "You are not allowed to access this file";
	echo "<META HTTP-EQUIV=\"refresh\" CONTENT=\"0; URL=../index.php#login_form\"> ";
	die();
}
//$msgArr=array();
//$_SESSION['login_status']=1;
////////////////////////////////////////////////////////////////////////////////////////////////////////////
//check if user already loged in by chicking his session variables
// if he is already logged in show him the logout button through ajax in index.php

/////Case 1: if user browse to the login screen and tried to login while he is already logged in , 
///check the user login by checking the session variable "login status"
//$_SESSION['login_status']="1"; // for testing if user is logged in without connecting to db (Debug)
///////////////////////////////////////////////SETP 1///////////////////////////////
if(isset($_SESSION['login_status']) && $_SESSION['login_status']==1){
	/// if the user is already logged in according the session variable show the loggin Div (button) in the client side
	/// then stop proceeding in this code
include "db_config.php";
/// check again if anotehr machin logged this user out from database and destroy session if he was logged in from other location
$sql2="SELECT `users`.`userlogin_flag` FROM `users` WHERE `id`=".$_SESSION['user_id'];
		$sqlcon2=   mysqli_query($con, $sql2);
		$userlogin_flag=0;// initialize userlogin flag variable with 0, a flag to check if the user is logged in from other machin or not
		if ($sqlres2 =  mysqli_fetch_row($sqlcon2)){ /// if their is results from the database regarding user login flag
			$userlogin_flag= $sqlres2[0];//set the user lgoin flag as the resulted from the database
			//mysqli_close($con);// close the connection
			if($userlogin_flag>0){ // if user is logged in from any other machine  - flag value is grater than 0
				// if the user is logged in in the database (login flag>0) send him message to redirect to logout screen
				/// return this message ,then stop proceeding in this code 
				$msg1= "تم تسجيل الدخول مسبقا على هذا الجهاز";
	$msg2="logout";
	$msg3=$_SESSION['user_id'];
	$msgArr=array(msg1=>$msg1,msg2=>$msg2,msg3=>$msg3);
	echo json_encode($msgArr);
	die();
			}else{
					//destroy session
 session_destroy();
 $msg1= "تم تسجيل الدخول من خلال جهاز آخر";
	$msg2="err";
	$msg3=$_SESSION['user_id'];
	$msgArr=array(msg1=>$msg1,msg2=>$msg2,msg3=>$msg3);
	echo json_encode($msgArr);
	die();
			}
		}
	

 
	
}//////end of cheking session login statuts variable
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/// if the user is not logged (no session variable set
// do a second validation at php side for non empty values
/////////////////////////////////////////////////SETP 2//////////////////////////////
$message=array();
if(isset($_POST['login']) && !empty($_POST['login'])){
	$login=mysql_real_escape_string($_POST['login']);
}else{ 
	$message[]='من فضلك ادخل اسم المستخدم';
}
if(isset($_POST['password']) && !empty($_POST['password'])){
	$password=mysql_real_escape_string($_POST['password']);
}else{
	$message[]='من فضلك ادخل كلمة المرور';
}

/// check if their is any messages (means that there is an error) and show all the messages , but if there is no errors contenu proceeding
////////////////////////STEP 3/////////////////////////////////////////////////
$countError=count($message);
if($countError > 0){ /// first if container 
//echo $countError;
	/// show all the error messages each in one line
	$msg1= $message[0].'<br/>';
	$msg2="err";
	$msgArr=array(msg1=>$msg1,msg2=>$msg2);
	echo json_encode($msgArr);
	die();
	/////////////////////////////// first else - if their is no error messages
}else{
	/// if their is no error messages
	/// Case 2 :check if their is another person trying to login from another computer or the same person is trying to login from other location,
	//use DB flag "userlogin_flag" if value =1 he is logged in from another computer if "0" he is not
	// connect to the database
	include "db_config.php";
	/// clean the user name from php spcial characters
	$uname = mysql_real_escape_string($uname);/// sanitize username
	// sanitize password and encode the password
	$upwd=mysql_real_escape_string($upwd);
	$temp=sha1($upwd);// sanitize password
	//// create the query to check user and password and get the user id
	//debug($temp);

	$sqlcon1 = mysqli_query($con, "SELECT `users`.`id` FROM `users` WHERE `users`.`username`='".$uname."' AND `users`.`password`='".$temp."'");
	//debug("asdfasd  ".$sqlcon1);
	$uid=0;// initialize user id variable with 0, a flag to check if the user is existing or not
	if ($sqlres1 = mysqli_fetch_row($sqlcon1)){
		
		$uid= $sqlres1[0];//set the user id as the resulted id from the database
		}
		//debug($sqlcon1);
	//mysqli_close($con);// close the connection
	///echo $uid; for debugging
	if($uid==0){ // if the username and password are not in the database
		$msg1="";
		$msg2="none";
		$msg1= "اسم المستخدم أو كلمة السر خاطئة، يرجى اعادة المحاولة";
		$msg2="err";
		$msgArr=array(msg1=>$msg1,msg2=>$msg2);
		echo json_encode($msgArr);
		die();
		////////////////
		/////////////////////if user is existing in the database
	}else{
		///  Case 2 :check the login flag for the same user from the database
		$sql2="SELECT `users`.`userlogin_flag` FROM `users` WHERE `id`=".$uid;
		$sqlcon2=   mysqli_query($con, $sql2);
		$userlogin_flag=0;// initialize userlogin flag variable with 0, a flag to check if the user is logged in from other machin or not
		if ($sqlres2 =  mysqli_fetch_row($sqlcon2)){ /// if their is results from the database regarding user login flag
			$userlogin_flag= $sqlres2[0];//set the user lgoin flag as the resulted from the database
			//mysqli_close($con);// close the connection
			if($userlogin_flag>0){ // if user is logged in from any other machine  - flag value is grater than 0
				// if the user is logged in in the database (login flag>0) send him message to redirect to logout screen
				/// return this message ,then stop proceeding in this code 
				$msg1="";
				$msg2="none";
				$msg1= "تم تسجيل الدخول مسبقا من جهاز آخر، هل تود تسجيل الخروج؟";
				$msg2="logout";//// return message to ajax to show logout button
				$msg3=$uid;
				$msgArr=array(msg1=>$msg1,msg2=>$msg2,msg3=>$msg3);
				echo json_encode($msgArr);
				die();
				/////////////
			}else{/// if the userlogin flag is 0 , the user is NOT logged in in any other machines proceed with login
				//check the user EXPIRATION DATE, if expiration date has passed return message that you will need to renw your account
				/// also show him how many days remaining for expiration if the number of days are less than 30 days
				$today=date('Y-m-d');
				$today=date('Y-m-d', strtotime($today)); // today date
				//echo $today;//debugging
				$expirationDate=$today; // initialize expiration date variable
				//echo $expirationDate;// debugging
				//connect to db to get expiration date
				$sql3="SELECT `users`.`Expiration_Date` FROM `users` WHERE `id`=".$uid;
				$sqlcon3 = mysqli_query($con,$sql3);
				// echo $result3;// for debugging
				if ($sqlres3 =  mysqli_fetch_row($sqlcon3)){
					$expirationDate=$sqlres3[0];
					$_SESSION['expir_date']=$expirationDate;/// update expiration date variable in the session
					//echo $expirationDate;//debugging
					}
				/// calculate the date diff between today and the expiration date and proceed accoding to that
				$expireindays=dateDiff($today,$expirationDate,"days");
				$expireindays=intval($expireindays);
				//echo $expireindays;
				if($expireindays<30){////if remaining days to user expiration is less than 30 days
					if($expireindays<1){//// if user account is expired
						$msgArr=array();
						$msg1="";
						$msg2="none";
						$msg1= "عفوا لقد انتهى تاريخ صلاحية هذا المستخدم ، يرجى الاتصال بخدمة العملاء لتجديد الاشتراك وشكرا!";
						$msg2="err";
						$msgArr=array();
						$msgArr=array(msg1=>$msg1,msg2=>$msg2);
						echo json_encode($msgArr);
						die();
						}
					////if remaining days to user expiration is less than 30 days show him a massage with remaining days
					$msg1= "انتبه يبقى لك حتى انتهاء اشتراكك مدة ".dateDiff($today,$expirationDate,"all")."  يوم  يرجى الانتظار حتى يتم تسجيل دخولك الآن!";
					///////////////////////////////////////////////////do the login - log the user in
					$userloginSucess=douserlogin($uid);
					//debug($userloginSucess);die();
					if ($userloginSucess=="truef"){///if the user is logging for the first time
						$msg2="dologin";
						$msg3="firstlogin"; /// return first login to ajax to redirect to edit profile page
						$msgArr=array(msg1=>$msg1,msg2=>$msg2,msg3=>$msg3);
						echo json_encode($msgArr);
					}else if($userloginSucess=="true"){/// if user login success but not for the first time
						$msg2="dologin";
						$msg3="notfirst";/// return not first to ajax to redirect to apps page
						$msgArr=array(msg1=>$msg1,msg2=>$msg2,msg3=>$msg3);
						echo json_encode($msgArr);	
					}else if($userloginSucess=="false"){/// problem during do login function or failed to connect to db in the funciton
						/// if ther is any problem connecting the database for logging in ( the returned value from the function dologin is false) 
						$msg1= "عفوا : يوجد مشكلة في تسجيل دخولك ، يرجى الاتصال بخدمة العملاء";
						$msg2="err";
						$msgArr=array(msg1=>$msg1,msg2=>$msg2);
						echo json_encode($msgArr);
						die();
						}else{
							$msg1= "عفوا : يوجد مشكلة يرجى الاتصال بخدمة العملاء";
						$msg2="err?";
						$msgArr=array(msg1=>$msg1,msg2=>$msg2);
						echo json_encode($msgArr);
						die();
					}
					////////////////////
				}else{/// else for if user remaining days is less than 30 days
					$msg1= "يتم تسجيل دخولك الآن الرجاء الانتظار";
					///////run do user login function that returns true if loggin success or false if login failed
					//douserlogin($uid) $uid is the user id
					$_SESSION['userid']=$uid;
					$_COOKIE['userid']=$uid;
					
					$userloginSucess=douserlogin($uid);
					if ($userloginSucess=="truef"){///if the user is logging for the first time
						$msg2="dologin";
						$msg3="firstlogin";
						$msgArr=array(msg1=>$msg1,msg2=>$msg2,msg3=>$msg3);
						echo json_encode($msgArr);
					}else if($userloginSucess=="true"){/// user login success but not for first time
						$msg2="dologin";
						$msg3="notfirst";
						$msgArr=array(msg1=>$msg1,msg2=>$msg2,msg3=>$msg3);
						echo json_encode($msgArr);	
					}else if($userloginSucess=="false"){/// problem during do login function or failed to connect to db in the funciton
						$msg1= "عفوا : يوجد مشكلة في تسجيل دخولك ، يرجى الاتصال بخدمة العملاء";
						$msg2="err";
						$msgArr=array(msg1=>$msg1,msg2=>$msg2);
						echo json_encode($msgArr);
						die();
					}else{
							$msg1= "عفوا : يوجد مشكلة يرجى الاتصال بخدمة العملاء";
						$msg2="err?";
						$msgArr=array(msg1=>$msg1,msg2=>$msg2);
						echo json_encode($msgArr);
						die();
					}
					}//////end of user has 30 days left (IF)
					//echo $expireindays;// debugging
				}/// end of user login flag if >0
			}// end of if their is result from dabase for the user login flag
			 else{// if the user id is not found in the in the database to get the login flag
				echo "User id is incorrect"; // debugging  
				}
		// echo $userlogin_flag;/// for debugging echo the flag value for this user
		}////// end of the if & else for username and password check in the database ( if user exist in DB)
	mysqli_close($con);// close the connection


}/// end of if their is no error messages the blank username or password



////// functions to be used in the processing of the login
///////////////////////////////////////do login function that stores all the user information from the database into the session
function douserlogin($userID){
	//$userID=11;
	//return  $userID;
	//mysqli_close($con);
	include "db_config.php";
	//connect to the databse generate information for storing into session
	//if connected successeded open sessions //then contenu proceding to check first login";
	$sql4="SELECT * FROM `users` WHERE `id`='".$userID."'";// get all the fields form the database "user" table for this user 
    $sqlcon4=   mysqli_query($con, $sql4);
	//return mysqli_fetch_row($sqlcon4);
	if ($sqlres4 =  mysqli_fetch_row($sqlcon4)){
		//return $sqlres4[12];
		// if their is returned record from the db for this user, store it in the session vairables
		$_SESSION['user_id']=$sqlres4[0]; //$rec['username']
		$_SESSION['username']=$sqlres4[1];
		$_SESSION['user_ip']=$sqlres4[2]; ////user IP address from (user table)
		$_SESSION['user_type']=$sqlres4[3];
		$_SESSION['permission']=$sqlres4[4];
		$_SESSION['last_login']=$sqlres4[5];
		//$_SESSION['expir_date']//user expiration date set previously int this php	
		$_SESSION['reg_date']=$sqlres4[6];
		//$_SESSION['login_status']=$sqlres4['userlogin_flag'];/// user login status this should be 1 after logging
		
		/////////////session variables form profile table //////////PLEASE COMPLEATE SETTING THE SESSION VARIABLES for all user data
		//mysqli_close($con);
	//include "db_config.php";
		$sql8="SELECT * FROM `profile` WHERE `user_id`='".$userID."'";// get all the fields form the database "profile" table for this user 
    $sqlcon8=   mysqli_query($con, $sql8);
	//echo $sqlcon8;die();
	//return mysqli_fetch_row($sqlcon4);
	if ($sqlres8 =  mysqli_fetch_row($sqlcon8)){
		
		
		$_SESSION['fullname']=$sqlres8[2];
		$_SESSION['mobile']=$sqlres8[3];
		$_SESSION['mobile2']=$sqlres8[4];
		$_SESSION['phone']=$sqlres8[9];// user notes from (profile table)
		$_SESSION['email']=$sqlres8[5];// user email (from profile table)
		$_SESSION['address']=$sqlres8[6]; // user birth date from (profile table)
		$_SESSION['jobtitle']=$sqlres8[7];// user country from (profile table)
		$_SESSION['type']=$sqlres8[8]; // user type (1=system admin, 2=owner, 3=staff member, 4=customer, 5=supplier) from (profile table)
		$_SESSION['notes']=$sqlres8[10];// user notes from (profile table)
		}
		
		////////////////from rank table
	/* not used in this application *****************	
$sql9="SELECT * FROM `rank` WHERE `user_id`='".$userID."'";// get all the fields form the database "rank" table for this user 
    $sqlcon9=   mysqli_query($con, $sql9);
	//return mysqli_fetch_row($sqlcon4);
	if ($sqlres9 =  mysqli_fetch_row($sqlcon9)){
		
		
		$_SESSION['rank_id']=$sqlres9[0];
		$_SESSION['Enum']=$sqlres9[3];
		$_SESSION['Anum']=$sqlres9[4];
		$_SESSION['spnum']=$sqlres9[5];
		$_SESSION['speed_av']=$sqlres9[6];
		$_SESSION['acc_av']=$sqlres9[7];
		$_SESSION['evalue']=$sqlres9[8];
		$_SESSION['avalue']=$sqlres9[9];
		$_SESSION['spvalue']=$sqlres9[10];
		
	}*/
		//// from cresult and from aresutl table
		/*******************not used in this application **********
$sql10="SELECT * FROM `cresult` WHERE `user_id`='".$userID."'";// get all the fields form the database "rank" table for this user 
    $sqlcon10= mysqli_query($con, $sql10);
	
	if (mysqli_num_rows($sqlcon10) != 0){
		//$sqlres10 =  mysqli_fetch_array($sqlcon10);
		//$post[] = $sqlres10;
	$_SESSION['Cresult_id']=array();// contains the Cresults ids in array according to the number of rows for this user
	$_SESSION['Cres_LessonNo']=array();
	$_SESSION['Cres_speed']=array();
	$_SESSION['Cres_accuracy']=array();
while($sqlres10= mysqli_fetch_array($sqlcon10)){
//print_r($sqlres10);


//$_SESSION['Cresult_id']=$sqlres10
		array_push($_SESSION['Cresult_id'], $sqlres10[0]);
		array_push($_SESSION['Cres_LessonNo'],$sqlres10[2]);
		array_push($_SESSION['Cres_speed'],$sqlres10[3]);
		array_push($_SESSION['Cres_accuracy'],$sqlres10[4]);
		//}
	}///end of while
	
	$_SESSION['Cresult_count']=count($_SESSION['Cresult_id']);// count of rows for the Cresult for this user
	//$_SESSION['Cresult_id_0']=$_SESSION['Cresult_id'][0];/// for testing only
	//$_SESSION['Cresult_id_1']=$_SESSION['Cresult_id'][1];// for testing only
	//$_SESSION['Cres_LessonNo1']=$_SESSION['Cres_LessonNo'][0]; //for testubg only - used also to retriev per col/row value for creating results
	}// end of if
	//from aresult table
	$sql11="SELECT * FROM `aresults` WHERE `user_id`='".$userID."'";// get all the fields form the database "rank" table for this user 
    $sqlcon11=   mysqli_query($con, $sql11);
	//return mysqli_fetch_row($sqlcon4);
	if (mysqli_num_rows($sqlcon11) != 0){
		$_SESSION['Aresult_id']=array();
		$_SESSION['Ares_Level']=array();
		$_SESSION['Ares_LessonNo']=array();
		$_SESSION['Ares_speed']=array();
		$_SESSION['Ares_accuracy']=array();
		
		while($sqlres11 =  mysqli_fetch_array($sqlcon11)){/// loop for all rows in this table where user id andd push each row-col in an array for each col
		array_push($_SESSION['Aresult_id'],$sqlres11[0]);
		array_push($_SESSION['Ares_Level'],$sqlres11[2]);
		array_push($_SESSION['Ares_LessonNo'],$sqlres11[3]);
		array_push($_SESSION['Ares_speed'],$sqlres11[4]);
		array_push($_SESSION['Ares_accuracy'],$sqlres11[5]);
		}
		$_SESSION['Aresult_count']=count($_SESSION['Aresult_id']);
		//print_r($_SESSION['Aresult_id']);
	}
		//$_SESSION['user_results']// all user results in multi directional array (key[english]=array (key[arabic]=array  of user scores) from (cresult and aresults table)
*////
		//$sessionID // unique user session id , generated automatically by server for each user login
		$ses_id = session_id();
		$_SESSION['Sess_id']=$ses_id;
	//return "true";die();
	//debug($ses_id);
		/////////// UDATE login status and session id in the db
		$sql5="Update `users` SET `userlogin_flag`='1',`sessionDB_ID`='".$ses_id."' WHERE `id`='".$userID."'";
		$sqlcon5=   mysqli_query($con, $sql5);
		//return $sqlcon5;
		if ($sqlcon5){
			//// check if user is logggining for the first time
			$isloginfirsttime=isfirstlogin($userID);
			//return $isloginfirsttime;
			//$isloginfirsttime=1;
			if($isloginfirsttime==1){
				//////////// set $_SESSION['login_status'] to 1 in the user session
				$_SESSION['login_status']=1;
				return "truef"; /// returned when the user will be successefully login for the first time to be redirected in ajax to edit profile page
			}else{
				//////////// set $_SESSION['login_status'] to 1 in the user session
				$_SESSION['login_status']=1;
				return "true";	/// returned when the user will be successefully login but not for first time
			}
		}else{
			return "false1";
			//die();
		}
	}else{/// if their is no data retrieved from the database for this user, return false
		return "false";
	}// end of first if (their is data recieved for the user id from user table
}//end of dologin function

////////////////////////user first login checkking function//////////////////
///////////////////////function to check user first login , it returns 1 or 0 , 1 means the user is logining for first time
/////if the returned value is true he will be redirected to edit profile page, if false he will be redirected to apps main scren
function isfirstlogin($userID){
$tm=NULL;
$firsttime=1; 
	if($userID>0)
	{
		/////either use the database as source of info or ues the session variables for retrieving the required data "first login"
	//	mysqli_close($con);
	include "db_config.php";
		$sql6="SELECT `users`.`Last_Login` FROM `users` WHERE `id`='".$userID."'" ;
		$sqlcon6 = mysqli_query($con,$sql6);
		if ($sqlres6 =  mysqli_fetch_row($sqlcon6))
		{
			$tm=$sqlres6[0];
		}
	  
		if ($tm!=NULL) $firsttime=0;
		{
			$dd = date('Y-m-d H:i:s');
		$sql7="UPDATE `users` SET `Last_Login`='".$dd."',`ip`='".get_client_ip()."' WHERE `id`='".$userID."'" ;
		$sqlcon7 = mysqli_query($con,$sql7);
		if($sqlcon7){
		return $firsttime;	
		}
		}
		//////update user last login with current time and date also update the db "id" with user client IP
		$dd = date('Y-m-d H:i:s');
		$sql7="UPDATE `users` SET `Last_Login`='".$dd."',`ip`='".get_client_ip()."' WHERE `id`='".$userID."'" ;
		$sqlcon7 = mysqli_query($con,$sql7);
		if($sqlcon7){
		return $firsttime;	
		}
	}
}
///////////////get the user IP 
function get_client_ip() {
     $ipaddress = '';
     if (getenv('HTTP_CLIENT_IP'))
         $ipaddress = getenv('HTTP_CLIENT_IP');
     else if(getenv('HTTP_X_FORWARDED_FOR'))
         $ipaddress = getenv('HTTP_X_FORWARDED_FOR');
     else if(getenv('HTTP_X_FORWARDED'))
         $ipaddress = getenv('HTTP_X_FORWARDED');
     else if(getenv('HTTP_FORWARDED_FOR'))
         $ipaddress = getenv('HTTP_FORWARDED_FOR');
     else if(getenv('HTTP_FORWARDED'))
        $ipaddress = getenv('HTTP_FORWARDED');
     else if(getenv('REMOTE_ADDR'))
         $ipaddress = getenv('REMOTE_ADDR');
     else
         $ipaddress = 'UNKNOWN'; 
     return $ipaddress; 
}
//////////////////////////////////////////////////////////////
///////////////////calculate differance betweeen two dates function//////
function dateDiff($startdate,$enddate,$setting){
/// setting is used to echo either the difference in days only or process it into years,months, days
/// setting options : days ( return difference in days) , any other value will return in year,month,days
$date1 = $startdate;
$date2 = $enddate;
//echo $date1;
////////////////////////////////////
$date1=date_create($startdate);
$date2=date_create($enddate);
$diff=date_diff($date1,$date2);

//////////////////////////////
//echo $diff->format("%R%a days");
return $diff->format("%R%a");/// return number of days as integer
}
?>