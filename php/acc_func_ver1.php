<?php
header('Content-Type: text/html; charset=utf-8');/// set the content charset to utf-8 for php

/// restrict direct access based on a checker
session_start();


$temp= $_POST["param"];
$keyin=$temp;
if (empty($keyin)){// key that is the order code e.g. 33~ sent by ajax to confirm the source of post
	//echo "You are not allowed to access this file";
	echo "<META HTTP-EQUIV=\"refresh\" CONTENT=\"0; URL=../index.php#login_form\"> ";
	die();
}


//error_reporting(E_ALL);
//ini_set('display_errors', '1');

//////////////// the ajax call from the client
/* $.ajaxSetup({async:false});
$.post("php/db_query_fun.php",{param:'$order~' +val1~val2~val3 etc..,parm2:[][],param3:val1~val2~val3},function(data) { picname=data;});

$.post("php/db_query_fun.php",{param:'35~' + uid},function(data) { picname=data;});
*/
$temp= $_POST["param"];
$param = explode("~", $temp);// convert parm to array and add each seperated word by "~" to the array
$temp3= $_POST["param3"];
$param3 = explode("~", $temp3);// convert parm to array and add each seperated word by "~" to the array

//printf($param);
$uid=0;
$uid=$_SESSION['user_id'];
$ordr=(int)$param[0]; // put parm first itme into the order var as it is the order number
$sql=""; // initialize sql variable
$JSON_result=0;// returned result as one variable 1: returned result as ana array (key, value)
include "db_config.php"; 

switch ($ordr) {// swich the order cases and create query based on the order

	case 0: //// sales process paid invoice
	/// add 1- add acc movement 2- add invoice value on profile,3- add acc move, 4- pay invoice value from profile,5-add invoice value to cash
	   $JSON_result=0;/// returned result as one variable 1: returned result as ana array (key, value)
       // mov_dat, mov_time, mov_type, sales_table, cust_table, cash_table, purch_table, exp_table, staff_table, othincome_table

	   // 1-  insert a record in the accounting movement table / geniric used by all transactions return inserted acc_mov_id 
	   $sql="CALL `add_acc_mov` ('".$param[1]."','".$param[2]."','".$param[3]."','".$param[4]."','".$param[5]."','".$param[6]."','".$param[7]."','".$param[8]."','".$param[9]."','".$param[10]."');";
	  //echo $sql;
	   $result = mysqli_query($con,$sql);
	   //$prntedinvid=3;
	   $acc_mov_id = $result->fetch_row();
	   
	   //free the results of the first query connection
	  while($con->more_results()){
    	$con->next_result();
    	if($res = $con->store_result()) // added closing bracket
    	{
        $res->free(); 
    	}
		}
	 /////////////////////////////////
	 
	  if($acc_mov_id>=1){

	 ////////////2 - create sql insert statment for acc profile move -ve value (add the unpaid invoice value to his balance
		///(acc_mov_id int, prof_mov_dat,prof_mov_time,prof_id ,acc_mov_type = 2 (-ve),prof_mov_value ,prof_mov_balance ,prof_mov_desc )
		$sql="CALL `add_prof_mov` ('".$acc_mov_id[0]."','".$param3[0]."','".$param3[1]."','".$param3[2]."','2','".$param3[3]."','".$param3[4]."','".$param3[5]."');";
	  	$result = mysqli_query($con,$sql);
		$acc_prof_mov_id = $result->fetch_row();
	   
		/// clear results
	  	while($con->more_results()){
    	$con->next_result();
    	if($res = $con->store_result()) // added closing bracket
    	{
        $res->free(); 
    	}
		}
			if($acc_prof_mov_id>=1){
			////////////3 - create sql insert statment for acc profile move +ve value (add the paid invoice value to his balance
			///(acc_mov_id int, prof_mov_dat,prof_mov_time,prof_id ,acc_mov_type = 2 (+ve),prof_mov_value ,prof_mov_balance ,prof_mov_desc )
			$sql="CALL `add_prof_mov` ('".$acc_mov_id[0]."','".$param3[0]."','".$param3[1]."','".$param3[2]."','1','".$param3[3]."','".$param3[4]."','".$param3[5]."');";
	  		$result = mysqli_query($con,$sql);
			$acc_prof_mov_id2 = $result->fetch_row();
	   
			/// clear results////////////
	  		while($con->more_results()){
    		$con->next_result();
    		if($res = $con->store_result()) // added closing bracket
    		{
        	$res->free(); 
    		}
			}
			///////////////////////
				if($acc_prof_mov_id2>=1){
				////////////4 - create sql insert statment for cash move +ve value (add the paid invoice value to cash
				///acc_mov_id ,cash_dat , cash_time,acc_mov_type =1 add +ve to the cash,cash_openbalance ??? not yet,cash_value invoice gtotal,cash_endbalance ??? not yet,cash_desc
				$sql="CALL `add_cash_mov` ('".$acc_mov_id[0]."','".$param3[0]."','".$param3[1]."','1','0','".$param3[3]."','0','".$param3[5]."');";
	  			$result = mysqli_query($con,$sql);
				$acc_cash_mov_id = $result->fetch_row();
	   //echo $acc_cash_mov_id[0];
				/// clear results////////////
	  			while($con->more_results()){
    			$con->next_result();
				//echo $con->next_result();
    			if($res = $con->store_result()) // added closing bracket
    			{
        		$res->free(); 
    			}
				}
				///////////////////////
					if($acc_cash_mov_id>=1){
					////////////4 - create sql insert statment for cash move +ve value (add the paid invoice value to cash
					//acc_mov_id int,inv_id ,sales_dat,sales_time ,sales_value ,sales_paid tinyint,sales_desc text
		
					$sql="CALL `add_sales_mov` ('".$acc_mov_id[0]."','".$param3[6]."','".$param3[0]."','".$param3[1]."','".$param3[3]."','1','".$param3[5]."');";
	  				//echo $con->store_result();
					$result = mysqli_query($con,$sql) or die(mysqli_error($con));
					$acc_sales_mov_id = $result->fetch_row();

					/// clear results////////////
	  				while($con->more_results()){
    				$con->next_result();
    				if($res = $con->store_result()) // added closing bracket
    				{
        			$res->free(); 
    				}
					}
					///////////////////////
		
						if($result){
						$sql_results="succeded";   
	   					}else{
	   					$sql_results= "sales process failed";//$sqlnew;//"failed to insert prnted inv items";   
	   					//$sql_results=$result;
						};
					}else{
					$sql_results="failed to insert cash +ve  movement";
					}
			}else{
			$sql_results="failed to insert acc profile +ve  movement";
			}
		}else{
		$sql_results="failed to insert acc profile-ve  movement";
		}
	}else{
	$sql_results="failed to insert acc movement";
	};
    break;
	
}


if($JSON_result==0){// if the returned results is not json, only one value
	echo $sql_results;
}else{///if retrurned resuts is JSON Object
	echo json_encode($sql_results);
}


?>