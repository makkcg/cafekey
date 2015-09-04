<?php
header('Content-Type: text/html; charset=utf-8');/// set the content charset to utf-8 for php

/// restrict direct access based on a checker
session_start();

//$obj= $_POST['jsonobj'];
//printf($obj);
$obj=json_decode($_POST['jsonobj'], true);
// print_r($obj);
 //var_dump($obj);
 //echo $obj["stitmUnits"][0]["st_itm_qnty_unit_name"];
//die();$keyin=$obj;
$temp= $_POST["step"];
$keyin=$temp;
if (empty($keyin)){// key that is the order code e.g. 33~ sent by ajax to confirm the source of post
	//echo "You are not allowed to access this file";
	echo "<META HTTP-EQUIV=\"refresh\" CONTENT=\"0; URL=../index.php#login_form\"> ";
	die();
}


//error_reporting(E_ALL);
//ini_set('display_errors', '1');

$temp= $_POST["step"];
$param = explode("~", $temp);// convert parm to array and add each seperated word by "~" to the array
$temp3= $_POST["param3"];
$param3 = explode("~", $temp3);// convert parm to array and add each seperated word by "~" to the array

//die($obj);
$uid=0;
$uid=$_SESSION['user_id'];
$step=(int)$param[0]; // put parm first itme into the order var as it is the order number
$sql=""; // initialize sql variable
$JSON_result=0;// returned result as one variable 1: returned result as ana array (key, value)
include "db_config_first.php"; 

///steps to setup first time

///1- clear the stock measuremnts units , save new added units from the obj , return units in the object to updated for next step

switch ($step) {// swich the order cases and create query based on the order
	case 0: //retrive current data from db for every step
	switch((int)$param3[0]){
		case 1://retrive stock measurements items
		$JSON_result=1;/// returned result as one variable 1: returned result as ana array (key, value)
       //free the results of the first query connection
	  while($con1->more_results()){
    	$con1->next_result();
    	if($res = $con1->store_result()) // added closing bracket
    	{
        $res->free(); 
    	}
		}
		
		$sql="SELECT * FROM  `st_item_qnty_unit`;"; 
	$result = mysqli_query($con1,$sql);
	
	 while ($row = $result->fetch_row())
  	{	
		$sql_results[]=array("st_itm_qnty_unit_id" => $row[0], "st_itm_qnty_unit_name" => $row[1], "st_itm_qnty_unit_desc" => $row[2]);
	}
	
	 //free the results of the first query connection
	  while($con1->more_results()){
    	$con1->next_result();
    	if($res = $con1->store_result()) // added closing bracket
    	{
        $res->free(); 
    	}
		}
		
		break;
		case 2:/// retrive all stock items
		$JSON_result=1;/// returned result as one variable 1: returned result as ana array (key, value)
       //free the results of the first query connection
	  while($con1->more_results()){
    	$con1->next_result();
    	if($res = $con1->store_result()) // added closing bracket
    	{
        $res->free(); 
    	}
		}
		
		$sql="SELECT * FROM `stock_items` where `itm_type`!=4;"; 
	$result = mysqli_query($con1,$sql);
	
	 while ($row = $result->fetch_row())
  	{	/////////////{arritmindex:0,itm_id:0,itm_shortname:0,itm_longname:0,itm_type_dd itm_type:0,itm_typename:0,itm_data:0,itm_sell_price:0,itm_reg_date:0,itm_userid:0,itm_timestamp:0,unit_measure itm_qnty_unit:0,itm_qnty_unitname:0,group_id:0,itm_limit:0} ///types 1 osol,2 row material, 3 row for sale items, 4 sales menu item

		$sql_results[]=array("itm_id" => $row[0], "itm_shortname" => $row[1], "itm_longname" => $row[2], "itm_type" => $row[3], "itm_data" => $row[4], "itm_sell_price" => $row[5], "itm_reg_date" => $row[6], "itm_userid" => $row[7], "itm_timestamp" => $row[8], "itm_qnty_unit" => $row[9], "group_id" => $row[10], "itm_limit" => $row[11]);
	}
	
	 //free the results of the first query connection
	  while($con1->more_results()){
    	$con1->next_result();
    	if($res = $con1->store_result()) // added closing bracket
    	{
        $res->free(); 
    	}
		}
		
		break;
	};////end retrive data switch
	
	break;
	case 1: //// empty stock measurements units then insert new rows then retrieve the inserted rows
	
	   $JSON_result=1;/// returned result as one variable 1: returned result as ana array (key, value)
       $nuofrows= count($obj['stitmUnits']);
	   $sql0="DELETE FROM `st_item_qnty_unit` WHERE 1;";
	   $result = mysqli_query($con1,$sql0);
	//$insertedID=$result->fetch_row();
	 //free the results of the first query connection
	  while($con1->more_results()){
    	$con1->next_result();
    	if($res = $con1->store_result()) // added closing bracket
    	{
        $res->free(); 
    	}
		}////end free results
		$sql0="ALTER TABLE `st_item_qnty_unit` AUTO_INCREMENT = 1;";
	   $result = mysqli_query($con1,$sql0);
	//$insertedID=$result->fetch_row();
	 //free the results of the first query connection
	  while($con1->more_results()){
    	$con1->next_result();
    	if($res = $con1->store_result()) // added closing bracket
    	{
        $res->free(); 
    	}
		}////end free results
		
	   for($i = 0; $i < $nuofrows; $i++){
	///`updat_sales_items` (itmid int,dat date,dattime datetime,qnty int,qntyunit int,custprofid int,userid int,invid int,orderid int)
	$sql="INSERT INTO `st_item_qnty_unit` (`st_itm_qnty_unit_id`, `st_itm_qnty_unit_name`, `st_itm_qnty_unit_desc`) VALUES (NULL, '".$obj['stitmUnits'][$i]['st_itm_qnty_unit_name']."', '".$obj['stitmUnits'][$i]['st_itm_qnty_unit_desc']."');"; 
	
	$result = mysqli_query($con1,$sql);
	//$insertedID=$result->fetch_row();
	 //free the results of the first query connection
	  while($con1->more_results()){
    	$con1->next_result();
    	if($res = $con1->store_result()) // added closing bracket
    	{
        $res->free(); 
    	}
		}
	 /////////////////////////////////
	//$sql_results=$sql_results."  -  ".$obj['stitmUnits'][$i]['st_itm_qnty_unit_name']." - ".$insertedID;
	}//end for
	///////////////////////
	////retrive the inserted stock measument units to json file 
	
	$sql="SELECT * FROM  `st_item_qnty_unit`;"; 
	$result = mysqli_query($con1,$sql);
	
	 while ($row = $result->fetch_row())
  	{	
		$sql_results[]=array("st_itm_qnty_unit_id" => $row[0], "st_itm_qnty_unit_name" => $row[1], "st_itm_qnty_unit_desc" => $row[2]);
	}
	
	 //free the results of the first query connection
	  while($con1->more_results()){
    	$con1->next_result();
    	if($res = $con1->store_result()) // added closing bracket
    	{
        $res->free(); 
    	}
		}////end free resutls
	 
    break;
	case 2://// empty Stock Items then insert new rows then retrieve the inserted rows
	 $JSON_result=1;/// returned result as one variable 1: returned result as ana array (key, value)
       $nuofrows= count($obj['stockitems']);
	   $sql0="DELETE FROM `stock_items` WHERE `itm_type`!=4;";
	   $result = mysqli_query($con1,$sql0);

	 //free the results of the first query connection
	  while($con1->more_results()){
    	$con1->next_result();
    	if($res = $con1->store_result()) // added closing bracket
    	{
        $res->free(); 
    	}
		}////end free results
	   /*$sql0="ALTER TABLE `st_item_qnty_unit` AUTO_INCREMENT = 1;";
	   $result = mysqli_query($con1,$sql0);
	//$insertedID=$result->fetch_row();
	 //free the results of the first query connection
	  while($con1->more_results()){
    	$con1->next_result();
    	if($res = $con1->store_result()) // added closing bracket
    	{
        $res->free(); 
    	}
		}////end free results
		*/
		////$obj['stockitems'][$i]['itm_limit']
	   for($i = 0; $i < $nuofrows; $i++){
	///`updat_sales_items` (itmid int,dat date,dattime datetime,qnty int,qntyunit int,custprofid int,userid int,invid int,orderid int)
	$sql="INSERT INTO `stock_items` (`itm_id`, `itm_shortname`, `itm_longname`, `itm_type`, `itm_data`, `itm_sell_price`, `itm_reg_date`, `itm_userid`, `itm_timestamp`, `itm_qnty_unit`, `group_id`, `itm_limit`) VALUES (NULL, '".$obj['stockitems'][$i]['itm_shortname']."', '".$obj['stockitems'][$i]['itm_longname']."', '".$obj['stockitems'][$i]['itm_type']."', '".$obj['stockitems'][$i]['itm_data']."', '".$obj['stockitems'][$i]['itm_sell_price']."', '".$obj['stockitems'][$i]['itm_reg_date']."', '".$obj['stockitems'][$i]['itm_userid']."', CURRENT_TIMESTAMP, '".$obj['stockitems'][$i]['itm_qnty_unit']."', '".$obj['stockitems'][$i]['group_id']."', '".$obj['stockitems'][$i]['itm_limit']."');"; 
	
	$result = mysqli_query($con1,$sql);
	//$insertedID=$result->fetch_row();
	 //free the results of the first query connection
	  while($con1->more_results()){
    	$con1->next_result();
    	if($res = $con1->store_result()) // added closing bracket
    	{
        $res->free(); 
    	}
		}
	 /////////////////////////////////
	//$sql_results=$sql_results."  -  ".$obj['stitmUnits'][$i]['st_itm_qnty_unit_name']." - ".$insertedID;
	}//end for
	///////////////////////
	////retrive the inserted stock measument units to json file 
	
	$sql="SELECT * FROM `stock_items` where `itm_type`!=4;"; 
	$result = mysqli_query($con1,$sql);
	
	 while ($row = $result->fetch_row())
  	{	/////////////{arritmindex:0,itm_id:0,itm_shortname:0,itm_longname:0,itm_type_dd itm_type:0,itm_typename:0,itm_data:0,itm_sell_price:0,itm_reg_date:0,itm_userid:0,itm_timestamp:0,unit_measure itm_qnty_unit:0,itm_qnty_unitname:0,group_id:0,itm_limit:0} ///types 1 osol,2 row material, 3 row for sale items, 4 sales menu item

		$sql_results[]=array("itm_id" => $row[0], "itm_shortname" => $row[1], "itm_longname" => $row[2], "itm_type" => $row[3], "itm_data" => $row[4], "itm_sell_price" => $row[5], "itm_reg_date" => $row[6], "itm_userid" => $row[7], "itm_timestamp" => $row[8], "itm_qnty_unit" => $row[9], "group_id" => $row[10], "itm_limit" => $row[11]);
	}
	 //free the results of the first query connection
	  while($con1->more_results()){
    	$con1->next_result();
    	if($res = $con1->store_result()) // added closing bracket
    	{
        $res->free(); 
    	}
		}////end free resutls
	break;
	
};///end of order switch


if($JSON_result==0){// if the returned results is not json, only one value
	echo $sql_results;
}else{///if retrurned resuts is JSON Object
	echo json_encode($sql_results);
}


?>