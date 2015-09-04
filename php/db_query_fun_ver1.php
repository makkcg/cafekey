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
$.post("php/db_query_fun.php",{param:'$order~' +parm1~parm2~parm3 etc..},function(data) { picname=data;});

$.post("php/db_query_fun.php",{param:'35~' + uid},function(data) { picname=data;});
*/
$temp= $_POST["param"];
$param = explode("~", $temp);// convert parm to array and add each seperated word by "~" to the array
$uid=0;
$uid=$_SESSION['user_id'];
$ordr=(int)$param[0]; // put parm first itme into the order var as it is the order number
$sql=""; // initialize sql variable

include "db_config.php"; 


switch ($ordr) {// swich the order cases and create query based on the order
    case 0: // get all the stock item types 
       $sql="SELECT * FROM  `st_items_types` WHERE 1";
	   $result = mysqli_query($con,$sql);
	   $rr="";
	   $rrr="";
	   while ($row = $result->fetch_row())
  	{
		$rr=$row[0]."~".$row[1]."~".$row[2];
	}
    break;
	   
	case 1: // get all the stock names 
       $sql="SELECT * FROM  `st_names` WHERE 1";
	   $result = mysqli_query($con,$sql);
	   $sql_results = array();
	   while ($row = $result->fetch_row())
  	{
		$stock_id=$row[0];
		$stock_name=$row[1];
		$stock_desc=$row[2];	
		$sql_results[]=array("st_id" => $stock_id, "st_name" => $stock_name, "st_desc" => $stock_desc);
	}
    break;  
	case 2: // get all the stock items' quantitiy units 
       $sql="SELECT * FROM  `st_item_qnty_unit` WHERE 1";
	   $result = mysqli_query($con,$sql);
	   $sql_results = array();
	   while ($row = $result->fetch_row())
  	{
		$Fld1=$row[0];
		$Fld2=$row[1];
		$Fld3=$row[2];	
		$sql_results[]=array("unit_id" => $Fld1, "unit_name" => $Fld2, "unit_desc" => $Fld3);
	}
    break; 
	case 3: // get last record id for any table where param[1] is the id field name and param[2] is the table name posted in ajax as
	//// param:3~id_fieldname~table_name/
	///// updated 1 get next auto increment value from any talbe user parm1 for table name
      /* $sql="SHOW TABLE STATUS WHERE `Name` = '".$param[1]."'";
	   $result = mysqli_query($con,$sql);
	    while ($row = $result->fetch_row())
  	{
		$sql_results=$row[10];
	}
*/
$sql="CALL `getnextID` ('".$param[1]."','mokacafe')";//// mokacafe is the database name will be changed when online
	   $result = mysqli_query($con,$sql);
	    while ($row = $result->fetch_row())
  	{
		$sql_results=$row[0];
	}
    break;
	case 4: // get all the stock itmes names and ids
	/// additiona parameter is setting 1= select all stock types, 2- select all types exept type4(sales), 3- select all types exept type1Assets,type4sales, 4-select
	   switch ($param[1]) {
	case 1:   
	   $sql="SELECT `itm_id`,`itm_shortname` FROM `stock_items` WHERE 1";
	break;
	case 2:
	   $sql="SELECT `itm_id`,`itm_shortname` FROM `stock_items` WHERE `itm_type`!=4";
	break;
	case 3:
	   $sql="SELECT `itm_id`,`itm_shortname` FROM `stock_items` WHERE `itm_type`!=4 and `itm_type`!=1";
	break;
	case 4:
	   $sql="SELECT `itm_id`,`itm_shortname` FROM `stock_items` WHERE 1";
	break;
	   
	   }
	   $result = mysqli_query($con,$sql);
	   $sql_results = array();
	   while ($row = $result->fetch_row())
  	{
		$Fld1=$row[0];
		$Fld2=$row[1];
		//$Fld3=$row[2];	
		$sql_results[]=array("itm_id" => $Fld1, "itm_name" => $Fld2);
	}
    break; 
	case 5: // get all profiles whom can buy stock ( admin, owners,staff) 
       $sql="SELECT `profileid`,`fullname` FROM `profile` WHERE `type`!=4 ";
	   $result = mysqli_query($con,$sql);
	   $sql_results = array();
	   while ($row = $result->fetch_row())
  	{
		$Fld1=$row[0];
		$Fld2=$row[1];
		$Fld3=$row[2];	
		$sql_results[]=array("prof_id" => $Fld1, "prof_name" => $Fld2);
	}
    break;
	case 6: // get all profiles to show in the cashier customer  
       $sql="SELECT `profileid`,`fullname`,`user_id`, `type` FROM `profile` WHERE `type`!=5";
	   $result = mysqli_query($con,$sql);
	   $sql_results = array();
	   while ($row = $result->fetch_row())
  	{
		$Fld1=$row[0];
		$Fld2=$row[1];
		$Fld3=$row[2];
		$Fld4=$row[3];	
		$sql_results[]=array("prof_id" => $Fld1, "prof_name" => $Fld2,"user_id" => $Fld3,"prof_type" => $Fld4);
	}
   break;
	case 7: // get the stock item measure unit based on the item id  
       $sql="SELECT `itm_qnty_unit`,`itm_type` FROM `stock_items` WHERE `itm_id`=".$param[1];
	   $result = mysqli_query($con,$sql);
	   $sql_results = array();
	   while ($row = $result->fetch_row())
  	{
		$Fld1=$row[0];
		$Fld2=$row[1];
		//$Fld3=$row[2];
		//$Fld4=$row[3];	
		//$sql_results=$Fld1;
		$sql_results[]=array("itm_qnty_unit" => $Fld1, "itm_type" => $Fld2);
	}
    break;
		
	case 8: // get the stock item types list  
       $sql="SELECT * FROM `st_items_types` WHERE `st_itm_id`!=4";
	   $result = mysqli_query($con,$sql);
	   $sql_results = array();
	   while ($row = $result->fetch_row())
  	{
		$Fld1=$row[0];
		$Fld2=$row[1];
		$Fld3=$row[2];
		//$Fld4=$row[3];	
		//$sql_results=$Fld1;
		$sql_results[]=array("itm_type_id" => $Fld1, "itm_type_name" => $Fld2,"itm_type_desc" => $Fld3,"prof_type" => $Fld4);
	}
    break;	
	case 9: // INSERT new Stock Item into Stock Items table  
       $sql="INSERT INTO `stock_items` (`itm_id`, `itm_shortname`, `itm_longname`, `itm_type`, `itm_data`, `itm_sell_price`, `itm_reg_date`, `itm_userid`, `itm_timestamp`, `itm_qnty_unit`, `group_id`) VALUES (NULL, '".$param[1]."', '".$param[2]."', '".$param[3]."', '".$param[4]."', '".$param[5]."', CURDATE(), '".$param[6]."', CURRENT_TIMESTAMP, '".$param[7]."', '".$param[8]."')";
	   $result = mysqli_query($con,$sql);
	   if($result){
		$sql_results="succeded";   
	   }else{
	   $sql_results="failed to insert";   
	   }
    break;
	case 10: // INSERT Stock Item movement into Stock Items movement table it is multi use query according to parmater setting
	///// parm0= order , parm1=setting (1- sell item, 2- buy item, 3- transfer item, 4- spoil item, 5- return item
	//// 
	switch($param[1]){
		case 2:// buy items to stock new or existing
       $sql="INSERT INTO `st_item_mov` (`st_itm_mov_id` ,`st_itm_mov_typ` ,`st_itm_mov_usrid` ,`st_itm_mov_itmid` ,`st_itm_mov_cur_stid` ,`st_itm_mov_qnty` ,`st_itm_mov_qnty_unit` ,`st_itm_mov_dat` ,`st_itm_mov_timstmp` ,`st_itm_mov_notes` ,`st_itm_mov_to_st` ,`st_itm_mov_st_itm_mov_price` ,`st_itm_mov_buyerid` ,`st_itm_mov_profid`, `st_itm_mov_itm_typ`)VALUES (NULL ,  '".$param[2]."',  '".$param[3]."',  '".$param[4]."',  '".$param[5]."',  '".$param[6]."',  '".$param[7]."',  CURDATE(), CURRENT_TIMESTAMP ,  '".$param[8]."',  '".$param[9]."',  '".$param[10]."',  '".$param[11]."',  '".$param[12]."',  '".$param[13]."')";
	   $result = mysqli_query($con,$sql);
	   if($result){
		$sql_results="succeded";   
	   }else{
	   $sql_results="failed to insert";   
	   }
	   break;
	}
    break;
	
	case 11: // INSERT values to accounts balance movement into acc pers balance table it is multi use query according to parmater setting
	///// parm0= order , parm1=setting (1- subsract sum value, 2- add sum value,
	//// 
	switch($param[1]){
		case 2:// buy items to stock new or existing
       $sql="INSERT INTO `acc_pes_balance_mov` (`balance_mov_id` ,`profile_id` ,`user_id` ,`acc_mov_type` ,`acc_mov_sum` ,`acc_mov_desc` ,`acc_mov_ref_tbl` ,`acc_mov_ref_rowid` ,`acc_mov_date` ,`acc_mov_timestamp`)VALUES (NULL ,  '".$param[2]."',  '".$param[3]."',  '".$param[4]."',  '".$param[5]."',  '".$param[6]."',  '".$param[7]."',  '".$param[8]."',  CURDATE(), CURRENT_TIMESTAMP)";
	   $result = mysqli_query($con,$sql);
	   if($result){
		$sql_results="succeded";   
	   }else{
	   $sql_results="failed to insert";   
	   }
	   break;
	}
    break;	
	case 12: //generic query to gett all rows of 3 fields tables id,name,desc 
	//// paremeters parm1=tablename,  //// parm2=id feild name, parm3=name field name, parm4= description field name
	//// returns .id, .name, .desc to ajax 
       $sql="SELECT * FROM `".$param[1]."` WHERE 1";
	   $result = mysqli_query($con,$sql);
	   $sql_results = array();
	   while ($row = $result->fetch_row())
  	{
		$Fld1=$row[0];
		$Fld2=$row[1];
		$Fld3=$row[2];
		//$Fld4=$row[3];	
		//$sql_results=$Fld1;
		$sql_results[]=array("id" => $Fld1, "name" => $Fld2,"desc" => $Fld3);
	}
	break;
		  
	case 13: //get stock item quantities and it's prices to calculate per unit measure cost 
	//// paremeters parm1=tablename,  //// parm2=id feild name, parm3=name field name, parm4= description field name
	//// returns .id, .name, .desc to ajax 
       $sql="SELECT `st_itm_mov_qnty`,`st_itm_mov_st_itm_mov_price` FROM `st_item_mov` WHERE `st_itm_mov_itmid`=".$param[1]." and `st_itm_mov_typ` = 2";
	   $result = mysqli_query($con,$sql);
	   $sql_results = array();
	   while ($row = $result->fetch_row())
  	{
		$Fld1=$row[0];
		$Fld2=$row[1];
		//$Fld3=$row[2];
		//$Fld4=$row[3];	
		//$sql_results=$Fld1;
		$sql_results[]=array("qnty" => $Fld1, "cost" => $Fld2);
	}
	break;
	case 14: //using array for add multi row to ingradients items of sales item
        $temp2=$_POST["param2"];
		$sql1="INSERT INTO  `items_ingradients` (`item_ingradients_id` ,`itm_id` ,`itm_ingrad_id` ,`itm_ingrad_qnty` ,`itm_ingrad_qnty_unit` ,`itm_updt_date` ,`itm_timestamp` ,`itm_userid`,`itm_ingr_cost`)VALUES  ";
		$sql=$sql1;	
		for($i=0;$i<sizeof($temp2);$i++){
		$ing_itm_parms[]=explode(",",$temp2[$i][0]);
		$sql2[$i]=" (NULL ,  '".$ing_itm_parms[$i][1]."',  '".$ing_itm_parms[$i][0]."',  '".$ing_itm_parms[$i][2]."',  '".$ing_itm_parms[$i][3]."',  'CURDATE()', CURRENT_TIMESTAMP ,  '".$ing_itm_parms[$i][4]."' ,  '".$ing_itm_parms[$i][5]."')";
		if($i<1){
		$sql.=$sql2[$i];
		}else{
		$sql.=",".$sql2[$i];
		}
		};
	//echo $sql;

	   $result = mysqli_query($con,$sql);
	   $sql_results = array();
	   if($result){
		$sql_results="succeded";   
	   }else{
	   $sql_results="failed to insert";   
	   }
	break;
}	
if($ordr==3 or $ordr==9 or $ordr==10 or $ordr==11 or $ordr==14){
	echo $sql_results;
}else{
	echo json_encode($sql_results);
}
//echo $rr; 

?>
