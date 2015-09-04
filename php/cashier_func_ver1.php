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
//printf($param);
$uid=0;
$uid=$_SESSION['user_id'];
$ordr=(int)$param[0]; // put parm first itme into the order var as it is the order number
$sql=""; // initialize sql variable
$JSON_result=0;// returned result as one variable 1: returned result as ana array (key, value)
include "db_config.php"; 

switch ($ordr) {// swich the order cases and create query based on the order
    case 0: // get all the stock item types 
	   $JSON_result=1; // returned result as one variable 1: returned result as ana array (key, value)
       $sql="CALL `get_sales_items` ();";
	   $result = mysqli_query($con,$sql);
	   $sql_results = array();
	   while ($row = $result->fetch_row())
  	{
		$sales_itm_id=$row[0];
		$sales_itm_sname=$row[1];
		$sales_itm_lname=$row[2];
		$sales_itm_desc=$row[3];
		$sales_itm_price=$row[4];
		$sales_itm_groupid=$row[5];	
		$sql_results[]=array("itm_id" => $sales_itm_id, "itm_sname" => $sales_itm_sname,"itm_lname" => $sales_itm_lname, "itm_desc" => $sales_itm_desc, "itm_price" => $sales_itm_price,"itm_group" => $sales_itm_groupid);
	
	}
    break;
	case 1: // insert printed invoice and it's items in prnted inv , and prnted inv itms
	   $JSON_result=0;/// returned result as one variable 1: returned result as ana array (key, value)
       //act_inv_id,inv_dattime,inv_cus_prof_id,inv_cus_user_id,inv_cashier_id,inv_total,inv_discount,inv_tax,inv_service,inv_gtotal
	   //echo $param;
	   $temp2=$_POST["param2"];/// the array of items to be added
	   $sql="CALL `save_prnt_inv` ('".$param[1]."','".$param[2]."','".$param[3]."','".$param[4]."','".$param[5]."','".$param[6]."','".$param[7]."','".$param[8]."','".$param[9]."','".$param[10]."');";
	  //echo $sql;
	   $result = mysqli_query($con,$sql);
	   //$prntedinvid=3;
	   $prntedinvid = $result->fetch_row();
	   //free the results of the first query connection
	  while($con->more_results()){
    	$con->next_result();
    	if($res = $con->store_result()) // added closing bracket
    	{
        $res->free(); 
    	}
		}
	 /////////////////////////////////
	  if($prntedinvid>=1){

	 //////////// create sql insert statment for multiple entries to be added into the invoice items table - recieved param2 as array of objects
		$sql1="INSERT INTO `printed_inv_items` (`inv_item_ai_id`,`inv_id`,`act_inv_id`,`inv_itm_id`,`inv_itm_unit_price`,`inv_itm_qnty`,`inv_itm_sum`) VALUES ";
		$sqlnew=$sql1;
		//"(NULL ,  '".$prntedinvid."',  '".$param[1]."',  '".itemid."',  '".itemunitprice."',  '".itemqnty."',  '".itemtotalsum."');";
	   for($i=0;$i<sizeof($temp2);$i++){
		$prnt_inv_items[]=explode(",",$temp2[$i][0]);
		//printf($prnt_inv_items[$i]);
		$sql2[$i]=" (NULL ,'".$prntedinvid[0]."',  '".$param[1]."',  '".$prnt_inv_items[$i][0]."',  '".$prnt_inv_items[$i][1]."',  '".$prnt_inv_items[$i][2]."',  '".$prnt_inv_items[$i][3]."')";
		if($i<1){
		$sqlnew.=$sql2[$i];
		}else{
		$sqlnew.=",".$sql2[$i];
		};
		};
		$sqlnew=$sqlnew.";";
	
	   $result1 = mysqli_query($con,$sqlnew) or die(mysqli_error($con));;
	   if($result1){
		$sql_results="succeded";   
	   }else{
	   $sql_results= $sqlnew;//"failed to insert prnted inv items";   
	   };
	   
	   }else{
	$sql_results="failed to insert prnted inv";
	  	   
	   };
    break;
	case 2: // insert  invoice and it's items in invoices , and invoices itms table
	   $JSON_result=0;/// returned result as one variable 1: returned result as ana array (key, value)
       // inv_dattime, inv_cus_prof_id, inv_cus_user_id, inv_cashier_id, inv_total, inv_discount, inv_tax, inv_service, inv_gtotal, inv_status,inv_dat,inv_time
	  //$myDateTime = DateTime::createFromFormat('Y-m-d h:m:s', $param[1]);
		//$Dateonly = $myDateTime->format('Y-m-d');/// to be used in stock movement
	   $temp2=$_POST["param2"];/// the array of items to be added
	   $sql="CALL `save_inv` ('".$param[1]."','".$param[2]."','".$param[3]."','".$param[4]."','".$param[5]."','".$param[6]."','".$param[7]."','".$param[8]."','".$param[9]."','".$param[10]."','".$param[11]."','".$param[12]."');";
	   $result = mysqli_query($con,$sql);
	   
	   $invid = $result->fetch_row();
	   //free the results of the first query connection
	  while($con->more_results()){
    	$con->next_result();
    	if($res = $con->store_result()) // added closing bracket
    	{
        $res->free(); 
    	}
		}
	 /////////////////////////////////
	  if($invid>=1){ //// add items to the invoice items and add stock movement to substract quantities from each item

	 //////////// create sql insert statment for multiple entries to be added into the invoice items table - recieved param2 as array of objects
		$sql1="INSERT INTO `invoices_items` (`inv_item_ai_id`,`inv_id`,`inv_itm_id`,`inv_itm_unit_price`,`inv_itm_qnty`,`inv_itm_sum`) VALUES ";
		$sqlnew=$sql1;
		//"(NULL ,  '".$prntedinvid."',  '".$param[1]."',  '".itemid."',  '".itemunitprice."',  '".itemqnty."',  '".itemtotalsum."');";
	   for($i=0;$i<sizeof($temp2);$i++){
		$inv_items[]=explode(",",$temp2[$i][0]);
		//printf($prnt_inv_items[$i]);
		$sql2[$i]=" (NULL ,'".$invid[0]."',  '".$inv_items[$i][0]."',  '".$inv_items[$i][1]."',  '".$inv_items[$i][2]."',  '".$inv_items[$i][3]."')";
		if($i<1){
		$sqlnew.=$sql2[$i];
		}else{
		$sqlnew.=",".$sql2[$i];
		};
		};
		$sqlnew=$sqlnew.";";
	
	   $result1 = mysqli_query($con,$sqlnew) or die(mysqli_error($con));
	   if($result1){
		/*   ////insert substract each stock item quanitity from the stock (add to stock item movements
		   ///free the resuts
		   //free the results of the first query connection
	  while($con->more_results()){
    	$con->next_result();
    	if($res = $con->store_result()) // added closing bracket
    	{
        $res->free(); 
    	}
		}
	 /////////////////////////////////
		   /// loop for each item in the array used to insert invoice items
		    $stockmovnotes="بيع اصناف بيع فاتورة رقم  : ".$invid[0];
		   for($i=0;$i<sizeof($temp2);$i++){
			   $st_items[]=explode(",",$temp2[$i][0]);
			  
			   /////`subs_stock_mov_sell` (usrid,st_itm_mov_itmid,st_itm_mov_qnty ,st_itm_mov_qnty_unit,st_itm_mov_dat,st_itm_mov_notes,st_itm_mov_profid
			$sql="CALL `subs_stock_mov_sell` ('".$param[4]."','".$st_items[$i][0]."','".$inv_items[$i][2]."','7','".$Dateonly."','".$stockmovnotes."','".$param[2]."');";
			$result = mysqli_query($con,$sqlnew) or die(mysqli_error($con));
			$insertid = $result->fetch_row();
			//free the results of the first query connection
			  while($con->more_results()){
    			$con->next_result();
    			if($res = $con->store_result()) // added closing bracket
    			{
        		$res->free(); 
    			}
				}
	 			/////////////////////////////////
	 			if($insertid>=1){
		 		$sql_results="succeded";
	 			}else{
	 			$sql_results=$result;
	 			}
			}//// end of for loop
		   */
		   $sql_results="succeded";
	   }else{/// else for if($result) line 140
	   $sql_results= $sqlnew;//"failed to insert prnted inv items";   
	   };
	   
	}else{/// else for if($invid>=1)
	$sql_results="failed to insert inv";
	};
    break;
	case 3: // get all the invoice item ingradients and quantities to substract items from the stock on sell by cashier 
	   $JSON_result=0; //0 returned result as one variable 1: returned result as ana array (key, value)
	   ////param1=invoice id , param2 = userid, parm3=date, param4= prof id
       $sql="CALL `get_inv_ingr_qnty` ('".$param[1]."');";
	   $result = mysqli_query($con,$sql);
	   $sqlArr = array();
	   $stockmovnotes="بيع اصناف بيع فاتورة رقم  : ".$param[1];
	   $rowsindex=0;
	   while ($row = $result->fetch_row())
  	{
		
		$ing_itm_id=$row[0];
		$ing_itm_qnty_unit=$row[1];
		$ing_qnty_to_substract=$row[2];
		 /////`subs_stock_mov_sell` (usrid,st_itm_mov_itmid,st_itm_mov_qnty ,st_itm_mov_qnty_unit,st_itm_mov_dat,st_itm_mov_notes,st_itm_mov_profid
		$sqlArr[$rowsindex]="CALL `subs_stock_mov_sell` ('".$param[2]."','".$ing_itm_id."','".$ing_qnty_to_substract."','".$ing_itm_qnty_unit."','".$param[3]."','".$stockmovnotes."','".$param[4]."');";
		$rowsindex++;	
	}
	//free the results of the first query connection
	  while($con->more_results()){
    	$con->next_result();
    	if($res = $con->store_result()) // added closing bracket
    	{
        $res->free(); 
    	}
		}
	 /////////////////////////////////
	 for($ii=0;$ii<$rowsindex;$ii++){

		 $result = mysqli_query($con,$sqlArr[$ii]) or die(mysqli_error($con));
			$insertid = $result->fetch_row();
			//free the results of the first query connection
			  while($con->more_results()){
    			$con->next_result();
    			if($res = $con->store_result()) // added closing bracket
    			{
        		$res->free(); 
    			}
				}
	 			/////////////////////////////////
	 			if($insertid>=1){
		 		$sql_results="succeded";
	 			}else{
	 			$sql_results=$result;
	 			}
	 }
    break;
	case 4: // get paid unpaid invoices , 
	   $JSON_result=1; // returned result as one variable 1: returned result as ana array (key, value)
	   ///// parameters : invoicestatus =0 unpaid,1 paid; profile id; startdate = 0 all dates, or specific date; enddate
	    $inv_status=$param[1];
		$prof_id=$param[2];
		$startDate=$param[3];
		$endDate=$param[4];
       $sql="CALL `get_paid_unpaid_inv` ( '".$inv_status."','".$prof_id."', '".$startDate."', '".$endDate."');";
	   $result = mysqli_query($con,$sql);
	   $sql_results = array();
	   while ($row = $result->fetch_row())
  	{
		$inv_id=$row[0];
		$inv_total=$row[1];
		$inv_discount=$row[2];
		$inv_tax=$row[3];
		$inv_service=$row[4];
		$inv_gtotal=$row[5];
		$inv_dattime=$row[6];
		$inv_profid=$row[7];
		$inv_prof_fullname=$row[8];
		$inv_itm_id=$row[9];
		$inv_itm_name=$row[10];	
		$inv_itm_unit_price=$row[11];
		$inv_itm_qnty=$row[12];
		$inv_itm_sum=$row[13];
		$sql_results[]=array("inv_id" => $inv_id, "inv_total" => $inv_total,"inv_discount" => $inv_discount, "inv_tax" => $inv_tax, "inv_service" => $inv_service,"inv_gtotal" => $inv_gtotal,"inv_dattime" => $inv_dattime,"inv_profid" => $inv_profid,"inv_prof_fullname" => $inv_prof_fullname,"inv_itm_id" => $inv_itm_id,"inv_itm_name" => $inv_itm_name,"inv_itm_unit_price" => $inv_itm_unit_price,"inv_itm_qnty" => $inv_itm_qnty,"inv_itm_sum" => $inv_itm_sum);
	
	}
    break;
	case 5: // get paid unpaid invoices , 
	   $JSON_result=1; // returned result as one variable 1: returned result as ana array (key, value)
	   ///// parameters : invoicestatus =0 unpaid,1 paid; profile id; startdate = 0 all dates, or specific date; enddate
	    $inv_status=$param[1];
		$prof_id=$param[2];
		$startDate=$param[3];
		$endDate=$param[4];
       $sql="CALL `get_paid_unp_inv` ( '".$inv_status."','".$prof_id."', '".$startDate."', '".$endDate."');";
	   $result = mysqli_query($con,$sql);
	   $sql_results = array();
	   while ($row = $result->fetch_row())
  	{
		$inv_id=$row[0];
		$inv_total=$row[1];
		$inv_discount=$row[2];
		$inv_tax=$row[3];
		$inv_service=$row[4];
		$inv_gtotal=$row[5];
		$inv_dattime=$row[6];
		$inv_profid=$row[7];
		$inv_prof_fullname=$row[8];
		$sql_results[]=array("inv_id" => $inv_id, "inv_total" => $inv_total,"inv_discount" => $inv_discount, "inv_tax" => $inv_tax, "inv_service" => $inv_service,"inv_gtotal" => $inv_gtotal,"inv_dattime" => $inv_dattime,"inv_profid" => $inv_profid,"inv_prof_fullname" => $inv_prof_fullname);
	
	}
    break;
	case 6: // get invoice sold items and data based on inv_id , 
	   $JSON_result=1; // returned result as one variable 1: returned result as ana array (key, value)
	    $inv_id=$param[1];
		
       $sql="CALL `get_inv_items_data` ( '".$inv_id."');";
	   $result = mysqli_query($con,$sql);
	   $sql_results = array();
	   while ($row = $result->fetch_row())
  	{
		
		$inv_itm_id=$row[0];
		$inv_itm_name=$row[1];	
		$inv_itm_unit_price=$row[2];
		$inv_itm_qnty=$row[3];
		$inv_itm_sum=$row[4];
		$sql_results[]=array("inv_itm_id" => $inv_itm_id,"inv_itm_name" => $inv_itm_name,"inv_itm_unit_price" => $inv_itm_unit_price,"inv_itm_qnty" => $inv_itm_qnty,"inv_itm_sum" => $inv_itm_sum);
	
	}
    break;
}


if($JSON_result==0){// if the returned results is not json, only one value
	echo $sql_results;
}else{///if retrurned resuts is JSON Object
	echo json_encode($sql_results);
}


?>