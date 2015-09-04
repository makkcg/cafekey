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
	/// add 1- add acc movement 2- add invoice value on profile two transactions (+ve) ,3- add acc move, 4- pay invoice value from profile  (-ve),5-add invoice value to cash
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
				////// on condition $param[11] paid status do this if 1 invoice is paid if 0 invoice is not paid
			////////////3 - create sql insert statment for acc profile move +ve value (add the paid invoice value to his balance
			///(acc_mov_id int, prof_mov_dat,prof_mov_time,prof_id ,acc_mov_type = 2 (+ve),prof_mov_value ,prof_mov_balance ,prof_mov_desc )
			if($param[11]==1){
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
			}else{
				$acc_prof_mov_id2=1;
			}
				if($acc_prof_mov_id2>=1){
					if($param[11]==1){
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
					}else{
						$acc_cash_mov_id=1;
					}
					if($acc_cash_mov_id>=1){
					////////////4 - create sql insert statment for sales move +ve value (add the paid invoice value to cash
					//acc_mov_id int,inv_id or OrderID ,sales_dat,sales_time ,sales_value ,sales_paid tinyint,sales_desc text
		
					$sql="CALL `add_sales_mov` ('".$acc_mov_id[0]."','".$param3[6]."','".$param3[0]."','".$param3[1]."','".$param3[3]."','".$param[11]."','".$param3[5]."','".$param3[7]."');";
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
	case 1:
	$JSON_result=1;
	$sql="CALL `populate_exp_list` ('".$param[1]."')";
	   $result = mysqli_query($con,$sql);
	   $sql_results = array();
	   while ($row = $result->fetch_row())
  	{
		$sql_results[]=array("id" => $row[0], "name" => $row[1]);
	}
	
	break;
	case 2:/// get profiles according to the type of profie for populating lists
	$JSON_result=1;
	$sql="CALL `populate_profile_lists` ('".$param[1]."','".$param[2]."','".$param[3]."','".$param[4]."')";
	   $result = mysqli_query($con,$sql);
	   $sql_results = array();
	   while ($row = $result->fetch_row())
  	{
		$sql_results[]=array("id" => $row[0], "name" => $row[1], "mobile" => $row[2]);
	}
	
	break;
	case 3: //// get cash movments and balance for filling the cash movment report table $param[1]= mov type ( 1 added to cash , 2 substracted from cash)
	$JSON_result=1;
	$sql="CALL `get_safe_mov_balance` ('".$param[1]."','".$param[2]."','".$param[3]."')";
	   $result = mysqli_query($con,$sql);
	   $sql_results = array();
	   while ($row = $result->fetch_row())
  	{
		$sql_results[]=array("cashid" => $row[0], "accmovid" => $row[1], "cashdat" => $row[2], "cashtime" => $row[3], "cashvalue" => $row[4], "desc" => $row[5]);
	}
	
	break;
	case 4: //// get sales and balance for filling the sales report table $param[1] : 0 unpaid sales, 1 paid sales , 2 all
	$JSON_result=1;
	$sql="CALL `get_sales_rep` ('".$param[1]."','".$param[2]."','".$param[3]."')";
	   $result = mysqli_query($con,$sql);
	   $sql_results = array();
	   while ($row = $result->fetch_row())
  	{
		/////`sales_id` ,  `acc_mov_id` ,  `inv_id` ,  `sales_value` ,  `sales_dat` ,  `sales_desc` ,  `sales_paid`
		$sql_results[]=array("salesid" => $row[0], "accmovid" => $row[1], "invid" => $row[2], "sales_value" => $row[3], "dat" => $row[4], "desc" => $row[5], "paidstatus" => $row[6]);
	}
	
	break;
	case 5: //// get various income and balance for filling the sales report table 
	$JSON_result=1;
	$sql="CALL `get_varincome_rep` ('".$param[1]."','".$param[2]."')";
	   $result = mysqli_query($con,$sql);
	   $sql_results = array();
	   while ($row = $result->fetch_row())
  	{
		/////``varid`,`accmovid`,`dat`,`times`,`varval`,`desc`
		$sql_results[]=array("varid" => $row[0], "accmovid" => $row[1], "dat" => $row[2], "times" => $row[3], "varval" => $row[4], "desc" => $row[5]);
	}
	
	break;
	case 6: //// get acc movments and balance for filling the profile balance report table $param[4]= mov type (0 all movments types, 1 added to balance , 2 substracted from balance) ///CALL `get_prof_accbalance` (1 , '2014/09/01','2014/09/25' ,2)
	$JSON_result=1;
	////1 profid , 2start date, 3 end date, 4 movtype : 0 all types, 1 added to profile, 2 substracted from account
	$sql="CALL `get_prof_accbalance` ('".$param[1]."','".$param[2]."','".$param[3]."','".$param[4]."')";
	   $result = mysqli_query($con,$sql);
	   $sql_results = array();
	   while ($row = $result->fetch_row())
  	{///`acc_prof_mov_id`,`acc_mov_type`,`acc_mov_id`,`prof_mov_value`,`prof_mov_dat`,`prof_mov_time`,`prof_mov_desc`
		$sql_results[]=array("movid" => $row[0], "movtype" => $row[1], "accmovid" => $row[2], "cashval" => $row[3], "dat" => $row[4], "times" => $row[5], "desc" => $row[6]);
	}
	
	break;
	case 7:
	$JSON_result=1;
	//	itm_id,stock_id,startdat,enddate,balanceonly
//$outputvar=0;
$sql="CALL `get_stok_item_balance` ('".$param[1]."','".$param[2]."','".$param[3]."','".$param[4]."','".$param[5]."',@p5)";
	$result = mysqli_query($con,$sql) or die(mysqli_error($con));
	   $sql_results = array();
	   if($param[5]=='1'){
		   
	   while ($row = $result->fetch_row())
  	{
		$balance=$row[0];
		$sql_results[]=array("balance" => $balance);
	}
	}else{
		while ($row = $result->fetch_row())
  	{
		$itmid=$row[0];
		$bought=$row[1];
		$sold=$row[2];
		$balance=$row[3];
		$sql_results[]=array("itmid" => $itmid, "bought" => $bought, "sold" => $sold, "balance" => $balance);
	}
	}
	break;
	case 8:
	$JSON_result=0;
	//13 parameters
	//	st_itm_mov_typ(1:sell,2:buy,3:transf,4:spoil,5:return)
	//st_itm_mov_usrid, st_itm_mov_itmid,  st_itm_mov_cur_stid,st_itm_mov_qnty , st_itm_mov_qnty_unit,  st_itm_mov_dat, st_itm_mov_notes,  st_itm_mov_to_st,  st_itm_mov_price, st_itm_mov_buyerid ,  st_itm_mov_profid,  
	//st_itm_mov_itm_typ (type of item 1: assets, 2:row material,4: prepared items)
$sql="CALL `buy_trn_spoil_ret_sals_stitem_mov` ('".$param[1]."','".$param[2]."','".$param[3]."','".$param[4]."','".$param[5]."','".$param[6]."','".$param[7]."','".$param[8]."','".$param[9]."','".$param[10]."','".$param[11]."','".$param[12]."','".$param[13]."')";
	$result = mysqli_query($con,$sql) or die(mysqli_error($con));
	$itmtransfered = $result->fetch_row();
	/// clear results////////////
	while($con->more_results()){
    $con->next_result();
    if($res = $con->store_result()) // added closing bracket
    {
    $res->free(); 
    }
	}
	///////////////////////
	if($itmtransfered){
	$sql_results="succeded";   
	}else{
	$sql_results= "failed";//$sqlnew;//"failed to insert prnted inv items";   
	};
	   
	break;
	case 9:
	$JSON_result=1;
	//itm id, option 0 get limit 1 update, new limit 
$sql="Call `get_upd_itm_limits` ('".$param[1]."','".$param[2]."','".$param[3]."')";
	$result = mysqli_query($con,$sql) or die(mysqli_error($con));
	   $sql_results = array();
	   
	   while ($row = $result->fetch_row())
  	{
		if(isset($row[1])){
		$itmid=$row[0];
		$balance=$row[1];
		$sql_results[]=array("itmid"=> $itmid,"limit" => $balance);
		}else{
		$balance=$row[0];
		$sql_results[]=array("limit" => $balance);
		}
	}

	break;
	case 10://get the items stock limit and the current limit and provide flag if exceeded the limit
	$JSON_result=1;
	$sql_results1 = array();
	$sql_results = array();
	////get the list of items from the db and its info
	 $sql="SELECT `itm_id`,`itm_shortname`,`itm_limit`,`st_itm_qnty_unit_name` FROM `stock_items` INNER JOIN `st_item_qnty_unit` ON `stock_items`.`itm_qnty_unit`=`st_item_qnty_unit`.`st_itm_qnty_unit_id` WHERE `itm_type`!=4;";
	$result = mysqli_query($con,$sql) or die(mysqli_error($con));
	    while ($row = $result->fetch_row())
  	{
		$sql_results1[]=array("itmid"=> $row[0],"itmname"=> $row[1],"itmlimit" => $row[2],"itmunit" => $row[3]);
	}
	/// clear results////////////
	while($con->more_results()){
    $con->next_result();
    if($res = $con->store_result()) // added closing bracket
    {
    $res->free(); 
    }
	}
	//////
	foreach($sql_results1 as $key=>$value) {
    $sql1="CALL `get_stok_item_balance` ('".$value['itmid']."','0','0','0','1',@p5)";///get the balance only
	$result = mysqli_query($con,$sql1) or die(mysqli_error($con)); 
	   while ($row1 = $result->fetch_row())
  	{
		$balance=$row1[0];
	}
	/// clear results////////////
	while($con->more_results()){
    $con->next_result();
    if($res = $con->store_result()) // added closing bracket
    {
    $res->free(); 
    }
	}
	///////
	$sql_results[]=array("itmid"=> $value['itmid'],"itmname"=> $sql_results1[$key][ "itmname"],"itmlimit" => $sql_results1[$key][ "itmlimit"],"itmunit" => $sql_results1[$key][ "itmunit"],"balance" => $balance);
}

	break;
	case 11://get the sales item ingr info and limits, and get each ingr balance and return list of ingr balance and limits
	$JSON_result=1;
	$sql_results1 = array();
	$sql_results = array();
	////get the list of items from the db and its info
	 $sql="SELECT `items_ingradients`.`itm_ingrad_id`,`stock_items`.`itm_shortname`,`stock_items`.`itm_limit`,`st_item_qnty_unit`.`st_itm_qnty_unit_name`,`items_ingradients`.`itm_ingrad_qnty` FROM `items_ingradients` inner join `stock_items` on`items_ingradients`.`itm_ingrad_id`= `stock_items`.`itm_id` inner join `st_item_qnty_unit` on `stock_items`.`itm_qnty_unit`=`st_item_qnty_unit`.`st_itm_qnty_unit_id` WHERE `items_ingradients`.`itm_id`='".$param[1]."';";
	$result = mysqli_query($con,$sql) or die(mysqli_error($con));
	    while ($row = $result->fetch_row())
  	{
		$sql_results1[]=array("ingid"=> $row[0],"ingname"=> $row[1],"inglimit" => $row[2],"ingunit" => $row[3],"ingquntyinitem" => $row[4]);
	}
	/// clear results////////////
	while($con->more_results()){
    $con->next_result();
    if($res = $con->store_result()) // added closing bracket
    {
    $res->free(); 
    }
	}
	//////
	foreach($sql_results1 as $key=>$value) {
    $sql1="CALL `get_stok_item_balance` ('".$value['ingid']."','0','0','0','1',@p5)";///get the balance only
	$result = mysqli_query($con,$sql1) or die(mysqli_error($con)); 
	   while ($row1 = $result->fetch_row())
  	{
		$balance=$row1[0];
	}
	/// clear results////////////
	while($con->more_results()){
    $con->next_result();
    if($res = $con->store_result()) // added closing bracket
    {
    $res->free(); 
    }
	}
	///////
	$sql_results[]=array("ingid"=> $value['ingid'],"ingname"=> $sql_results1[$key][ "ingname"],"inglimit" => $sql_results1[$key][ "inglimit"],"ingunit" => $sql_results1[$key][ "ingunit"],"ingbalance" => $balance);
}

	break;
	case 12:
	$JSON_result=0;
	//itm_id, st_id, act_balance, itm_qnty_unit, balance_notes,balance_dat,actbalance_dattime 
$sql="Call `update_st_blance` ('".$param[1]."','".$param[2]."','".$param[3]."','".$param[4]."','".$param[5]."','".$param[6]."','".$param[7]."')";
	$result = mysqli_query($con,$sql) or die(mysqli_error($con));
	  $itmstockupdated = $result->fetch_row();
	/// clear results////////////
	while($con->more_results()){
    $con->next_result();
    if($res = $con->store_result()) // added closing bracket
    {
    $res->free(); 
    }
	}
	///////////////////////
	if($itmstockupdated>0){
	$sql_results="succeded";   
	}else{
	$sql_results= "failed".mysqli_error($con);//$sqlnew;//"failed to insert prnted inv items";   
	};

	break;
	case 13://// when closing the table update sales items table for item sales statistics
	$JSON_result=0;
	//1- get all the full invoice items and quantities
	//param1: full inv number , $param[2] : dat, $param[3]: datetime,$param[4]:custprofid,$param[5]:userid,$param[6]:orderid
	$sql="Call `get_inv_items_data`('".$param[1]."')";
	$invitems=array();
	$result = mysqli_query($con,$sql) or die(mysqli_error($con));
	  //2- loop through each item and update the sales item table
	    while ($row = $result->fetch_row())
  	{
		$invitems[]=array("itmid"=> $row[0],"itmname"=> $row[1],"itmqnt" => $row[3]);
		
	}
	
	/// clear results////////////
	while($con->more_results()){
    $con->next_result();
    if($res = $con->store_result()) // added closing bracket
    {
    $res->free(); 
    }
	}
	//foreach($invitems as $key=>$value) {
		for($i = 0; $i < count($invitems); $i++){
	///`updat_sales_items` (itmid int,dat date,dattime datetime,qnty int,qntyunit int,custprofid int,userid int,invid int,orderid int)
	$sql="Call `updat_sales_items` ('".$invitems[$i]['itmid']."','".$param[2]."','".$param[3]."','".$invitems[$i]['itmqnt']."','".$invitems[$i]['itmname']."','".$param[4]."','".$param[5]."','".$param[1]."','".$param[6]."')";
	$result = mysqli_query($con,$sql) or die(mysqli_error($con));
	}
	///////////////////////
	if($invitems>0){
	$sql_results="succeded";   
	}else{
	$sql_results= "failed".mysqli_error($con);//$sqlnew;//"failed to insert prnted inv items";   
	};

	break;
	case 14://// generate stock report based on the parameters
	$JSON_result=1;
	$sql_results = array();
	////gather all data for all items
	//1- get all the items and its units from stock items
	$sql="SELECT `stock_items`.`itm_id`,`stock_items`.`itm_shortname`,`stock_items`.`itm_type`,`stock_items`.`itm_qnty_unit` as unitid,`st_item_qnty_unit`.`st_itm_qnty_unit_name` from `stock_items` inner join `st_item_qnty_unit` on `st_item_qnty_unit`.`st_itm_qnty_unit_id`= `stock_items`.`itm_qnty_unit` WHERE `itm_type` !=4";
	$result = mysqli_query($con,$sql) or die(mysqli_error($con));
	  //2- loop through each item and update the sales item table
	    while ($row = $result->fetch_row())
  	{
		$stockitems[]=array("id"=> $row[0],"itmname"=> $row[1],"itmtyp" => $row[2],"itmunitid" => $row[3],"unitname" => $row[4]);	
	}
	/// clear sql results////////////
	while($con->more_results()){
    $con->next_result();
    if($res = $con->store_result()) // added closing bracket
    {
    $res->free(); 
    }
	}
	///2- get each item movments all times
	for($i = 0; $i < count($stockitems); $i++){
		$sql="SELECT `st_itm_mov_typ`,`st_itm_mov_usrid`,`st_itm_mov_cur_stid`,`st_itm_mov_to_st`,`st_itm_mov_qnty`,`st_itm_mov_dat`,`st_itm_mov_notes`,`st_itm_mov_profid` FROM `st_item_mov` WHERE `st_itm_mov_itmid`='".$stockitems[$i]["id"]."'";
		$result = mysqli_query($con,$sql) or die(mysqli_error($con));
		 while ($row = $result->fetch_row())
  	{
		$stockitemMov[$stockitems[$i]["id"]][]=array("id"=> $stockitems[$i]["id"],"itmname"=> $stockitems[$i]["itmname"],"itmtyp" => $stockitems[$i]["itmtyp"],"itmunitid" => $stockitems[$i]["itmunitid"],"unitname" => $stockitems[$i]["unitname"],"movtype"=> $row[0],"user"=> $row[1],"curstock" => $row[2],"tostock" => $row[3],"movqnty" => $row[4],"movdat" => $row[5],"movnote" => $row[6],"movprofid" => $row[7],"movbalance" => 0,"movfrombal" => 0,"movtobal" => 0,"soldbal" => 0,"boughtbal" => 0,"spoilbal" => 0,"addcorrbal" => 0,"subcorrbal" => 0);	
	}
	for($rr=0;$rr<count($stockitemMov[$stockitems[$i]["id"]]);$rr++){
		switch ($stockitemMov[$stockitems[$i]["id"]][$rr]["movtype"]){
			case 1:// sold stock
			if($rr<0){
			$stockitemMov[$stockitems[$i]["id"]][$rr]["movbalance"]=-$stockitemMov[$stockitems[$i]["id"]][$rr]["movqnty"];
			$stockitemMov[$stockitems[$i]["id"]][$rr]["soldbal"]=$stockitemMov[$stockitems[$i]["id"]][$rr]["movqnty"];
			}else{
			$stockitemMov[$stockitems[$i]["id"]][$rr]["movbalance"]=$stockitemMov[$stockitems[$i]["id"]][$rr-1]["movbalance"]-$stockitemMov[$stockitems[$i]["id"]][$rr]["movqnty"];
			//$stockitemMov[$stockitems[$i]["id"]][$rr]["soldbal"]=$stockitemMov[$stockitems[$i]["id"]][$rr-1]["soldbal"]+$stockitemMov[$stockitems[$i]["id"]][$rr]["movqnty"];
			$stockitemMov[$stockitems[$i]["id"]][$rr]["soldbal"]=$stockitemMov[$stockitems[$i]["id"]][$rr]["movqnty"];
			//////////////////////////////accumulated 
//			$stockitemMov[$stockitems[$i]["id"]][$rr]["boughtbal"]=$stockitemMov[$stockitems[$i]["id"]][$rr-1]["boughtbal"];
//			$stockitemMov[$stockitems[$i]["id"]][$rr]["spoilbal"]=$stockitemMov[$stockitems[$i]["id"]][$rr-1]["spoilbal"];
//			$stockitemMov[$stockitems[$i]["id"]][$rr]["addcorrbal"]=$stockitemMov[$stockitems[$i]["id"]][$rr-1]["addcorrbal"];
//			$stockitemMov[$stockitems[$i]["id"]][$rr]["subcorrbal"]=$stockitemMov[$stockitems[$i]["id"]][$rr-1]["subcorrbal"];
			}
			break;
			case 2:///bought stock
			if($rr<0){
			$stockitemMov[$stockitems[$i]["id"]][$rr]["movbalance"]=$stockitemMov[$stockitems[$i]["id"]][$rr]["movqnty"];
			$stockitemMov[$stockitems[$i]["id"]][$rr]["boughtbal"]=$stockitemMov[$stockitems[$i]["id"]][$rr]["movqnty"];
			}else{
			$stockitemMov[$stockitems[$i]["id"]][$rr]["movbalance"]=$stockitemMov[$stockitems[$i]["id"]][$rr-1]["movbalance"]+$stockitemMov[$stockitems[$i]["id"]][$rr]["movqnty"];
			//$stockitemMov[$stockitems[$i]["id"]][$rr]["boughtbal"]=$stockitemMov[$stockitems[$i]["id"]][$rr-1]["boughtbal"]+$stockitemMov[$stockitems[$i]["id"]][$rr]["movqnty"];
			$stockitemMov[$stockitems[$i]["id"]][$rr]["boughtbal"]=$stockitemMov[$stockitems[$i]["id"]][$rr]["movqnty"];
			
			////////////////////////
//			$stockitemMov[$stockitems[$i]["id"]][$rr]["soldbal"]=$stockitemMov[$stockitems[$i]["id"]][$rr-1]["soldbal"];
//			$stockitemMov[$stockitems[$i]["id"]][$rr]["spoilbal"]=$stockitemMov[$stockitems[$i]["id"]][$rr-1]["spoilbal"];
//			$stockitemMov[$stockitems[$i]["id"]][$rr]["addcorrbal"]=$stockitemMov[$stockitems[$i]["id"]][$rr-1]["addcorrbal"];
//			$stockitemMov[$stockitems[$i]["id"]][$rr]["subcorrbal"]=$stockitemMov[$stockitems[$i]["id"]][$rr-1]["subcorrbal"];
			}
			break;
			case 3:///transfered stock
			if($rr<0){
			//$stockitemMov[$stockitems[$i]["id"]][$rr]["movbalance"]=$stockitemMov[$stockitems[$i]["id"]][$rr]["movqnty"];
			//$stockitemMov[$stockitems[$i]["id"]][$rr]["boughtbal"]=$stockitemMov[$stockitems[$i]["id"]][$rr]["movqnty"];
			}else{
			$stockitemMov[$stockitems[$i]["id"]][$rr]["movbalance"]=$stockitemMov[$stockitems[$i]["id"]][$rr-1]["movbalance"];
			$stockitemMov[$stockitems[$i]["id"]][$rr]["movfrombal"]=$stockitemMov[$stockitems[$i]["id"]][$rr]["movqnty"];
			$stockitemMov[$stockitems[$i]["id"]][$rr]["movtobal"]=$stockitemMov[$stockitems[$i]["id"]][$rr]["movqnty"];//$stockitemMov[$stockitems[$i]["id"]][$rr]["movbalance"]=$stockitemMov[$stockitems[$i]["id"]][$rr-1]["movbalance"]-$stockitemMov[$stockitems[$i]["id"]][$rr]["movqnty"];
			//$stockitemMov[$stockitems[$i]["id"]][$rr]["boughtbal"]=$stockitemMov[$stockitems[$i]["id"]][$rr-1]["boughtbal"]+$stockitemMov[$stockitems[$i]["id"]][$rr]["movqnty"];
			}
			break;
			case 4://spoiled stock
			if($rr<0){
			$stockitemMov[$stockitems[$i]["id"]][$rr]["movbalance"]=-$stockitemMov[$stockitems[$i]["id"]][$rr]["movqnty"];
			$stockitemMov[$stockitems[$i]["id"]][$rr]["spoilbal"]=$stockitemMov[$stockitems[$i]["id"]][$rr]["movqnty"];
			}else{
			$stockitemMov[$stockitems[$i]["id"]][$rr]["movbalance"]=$stockitemMov[$stockitems[$i]["id"]][$rr-1]["movbalance"]-$stockitemMov[$stockitems[$i]["id"]][$rr]["movqnty"];
			//$stockitemMov[$stockitems[$i]["id"]][$rr]["spoilbal"]=$stockitemMov[$stockitems[$i]["id"]][$rr-1]["spoilbal"]+$stockitemMov[$stockitems[$i]["id"]][$rr]["movqnty"];
			$stockitemMov[$stockitems[$i]["id"]][$rr]["spoilbal"]=$stockitemMov[$stockitems[$i]["id"]][$rr]["movqnty"];
			
			///////////////////////////////
//			$stockitemMov[$stockitems[$i]["id"]][$rr]["boughtbal"]=$stockitemMov[$stockitems[$i]["id"]][$rr-1]["boughtbal"];
//			$stockitemMov[$stockitems[$i]["id"]][$rr]["soldbal"]=$stockitemMov[$stockitems[$i]["id"]][$rr-1]["soldbal"];
//			$stockitemMov[$stockitems[$i]["id"]][$rr]["addcorrbal"]=$stockitemMov[$stockitems[$i]["id"]][$rr-1]["addcorrbal"];
//			$stockitemMov[$stockitems[$i]["id"]][$rr]["subcorrbal"]=$stockitemMov[$stockitems[$i]["id"]][$rr-1]["subcorrbal"];
			}
			break;
			case 5: //returned to supplier stock
			$stockitemMov[$stockitems[$i]["id"]][$rr]["movbalance"]=$stockitemMov[$stockitems[$i]["id"]][$rr-1]["movbalance"];
			break;
			case 6: //addition of sales items (not used)
			$stockitemMov[$stockitems[$i]["id"]][$rr]["movbalance"]=$stockitemMov[$stockitems[$i]["id"]][$rr-1]["movbalance"];
			break;
			case 7:///correct balance by adding stock
			if($rr<0){
			$stockitemMov[$stockitems[$i]["id"]][$rr]["movbalance"]=$stockitemMov[$stockitems[$i]["id"]][$rr]["movqnty"];
			$stockitemMov[$stockitems[$i]["id"]][$rr]["addcorrbal"]=$stockitemMov[$stockitems[$i]["id"]][$rr]["movqnty"];
			}else{
			$stockitemMov[$stockitems[$i]["id"]][$rr]["movbalance"]=$stockitemMov[$stockitems[$i]["id"]][$rr-1]["movbalance"]+$stockitemMov[$stockitems[$i]["id"]][$rr]["movqnty"];
			//$stockitemMov[$stockitems[$i]["id"]][$rr]["addcorrbal"]=$stockitemMov[$stockitems[$i]["id"]][$rr-1]["addcorrbal"]+$stockitemMov[$stockitems[$i]["id"]][$rr]["movqnty"];
			$stockitemMov[$stockitems[$i]["id"]][$rr]["addcorrbal"]=$stockitemMov[$stockitems[$i]["id"]][$rr]["movqnty"];
			
			/////////////////////
//			$stockitemMov[$stockitems[$i]["id"]][$rr]["boughtbal"]=$stockitemMov[$stockitems[$i]["id"]][$rr-1]["boughtbal"];
//			$stockitemMov[$stockitems[$i]["id"]][$rr]["soldbal"]=$stockitemMov[$stockitems[$i]["id"]][$rr-1]["soldbal"];
//			$stockitemMov[$stockitems[$i]["id"]][$rr]["spoilbal"]=$stockitemMov[$stockitems[$i]["id"]][$rr-1]["spoilbal"];
//			$stockitemMov[$stockitems[$i]["id"]][$rr]["subcorrbal"]=$stockitemMov[$stockitems[$i]["id"]][$rr-1]["subcorrbal"];
			}
			break;
			case 8:///correct balance by substracting stock
			if($rr<0){
			$stockitemMov[$stockitems[$i]["id"]][$rr]["movbalance"]=-$stockitemMov[$stockitems[$i]["id"]][$rr]["movqnty"];
			$stockitemMov[$stockitems[$i]["id"]][$rr]["subcorrbal"]=$stockitemMov[$stockitems[$i]["id"]][$rr]["movqnty"];
			}else{
			$stockitemMov[$stockitems[$i]["id"]][$rr]["movbalance"]=$stockitemMov[$stockitems[$i]["id"]][$rr-1]["movbalance"]-$stockitemMov[$stockitems[$i]["id"]][$rr]["movqnty"];
			//$stockitemMov[$stockitems[$i]["id"]][$rr]["subcorrbal"]=$stockitemMov[$stockitems[$i]["id"]][$rr-1]["subcorrbal"]-$stockitemMov[$stockitems[$i]["id"]][$rr]["movqnty"];
			$stockitemMov[$stockitems[$i]["id"]][$rr]["subcorrbal"]=$stockitemMov[$stockitems[$i]["id"]][$rr]["movqnty"];
			
			///////////////////////
//			$stockitemMov[$stockitems[$i]["id"]][$rr]["boughtbal"]=$stockitemMov[$stockitems[$i]["id"]][$rr-1]["boughtbal"];
//			$stockitemMov[$stockitems[$i]["id"]][$rr]["soldbal"]=$stockitemMov[$stockitems[$i]["id"]][$rr-1]["soldbal"];
//			$stockitemMov[$stockitems[$i]["id"]][$rr]["spoilbal"]=$stockitemMov[$stockitems[$i]["id"]][$rr-1]["spoilbal"];
//			$stockitemMov[$stockitems[$i]["id"]][$rr]["addcorrbal"]=$stockitemMov[$stockitems[$i]["id"]][$rr-1]["addcorrbal"];
			}
			break;
		}
	}
	/// clear sql results////////////
	while($con->more_results()){
    $con->next_result();
    if($res = $con->store_result()) // added closing bracket
    {
    $res->free(); 
    }
	}
	////////////////
	}///end looping in all items (for loop)
$sql_results=$stockitemMov;
	break;
	case 15:///get the accounting dashboard data
	$JSON_result=1;
	$sql_results = array();

	$sql="CALL `get_dashboard` ('".$param[1]."')";
	$result = mysqli_query($con,$sql) or die(mysqli_error($con));
	  //2- loop through each item and update the sales item table
	    while ($row = $result->fetch_row())
  	{
		$sql_results[]=array("daycash"=> $row[0],"daysales"=> $row[1],"daycredit" => $row[2],"daypurch" => $row[3],"dayexp" => $row[4],"monthcash" => $row[5],"monthsales" => $row[6],"monthcredit" => $row[7],"monthpurch" => $row[8],"monthexp" => $row[9],"dayexppart" => $row[10],"monthexppart" => $row[11]);	
	}
	/// clear sql results////////////
	while($con->more_results()){
    $con->next_result();
    if($res = $con->store_result()) // added closing bracket
    {
    $res->free(); 
    }
	}
	break;
	case 16://// add expences , process
	//`add_expences_process` (exptype int,exp_code int,exp_dat date,exp_time time,exp_value float,exp_desc longtext,fromcash int,profid int,issalary int)
	$JSON_result=0;
	//param1: exptype (1 exp is salary or pay to partner) , $param[2] : exp_code, $param[3]: exp_dat,$param[4]:exp_time,$param[5]:exp_value,$param[6]:exp_desc , param7:fromcash ( 1 if paid from chasier, profid if paid by any partner),  param8:profid ( the profid for staff or partner paid to), param9:issalary ( 1 if is paid to staff as salary or related type of exp)
	$sql="Call `add_expences_process`('".$param[1]."','".$param[2]."','".$param[3]."','".$param[4]."','".$param[5]."','".$param[6]."','".$param[7]."','".$param[8]."','".$param[9]."')";
	$result = mysqli_query($con,$sql) or die(mysqli_error($con));
	  $expprocess = $result->fetch_row();
	/// clear results////////////
	while($con->more_results()){
    $con->next_result();
    if($res = $con->store_result()) // added closing bracket
    {
    $res->free(); 
    }
	}
	///////////////////////
	if($expprocess>0){
	$sql_results="succeded";   
	}else{
	$sql_results= "failed".mysqli_error($con);//$sqlnew;//"failed to insert prnted inv items";   
	};
	break;
	case 17://// add various income , process
	
	$JSON_result=0;
///parm1: varinctype parm2: varinc_dat, param3 : varinc_time param4 :varinc_value param5 : varinc_desc param6 : tocash, parm7 : varinc name
	
	$sql="Call `add_varincome_process`('".$param[1]."','".$param[2]."','".$param[3]."','".$param[4]."','".$param[5]."','".$param[6]."','".$param[7]."')";
	$result = mysqli_query($con,$sql) or die(mysqli_error($con));
	  $expprocess = $result->fetch_row();
	/// clear results////////////
	while($con->more_results()){
    $con->next_result();
    if($res = $con->store_result()) // added closing bracket
    {
    $res->free(); 
    }
	}
	///////////////////////
	if($expprocess>0){
	$sql_results="succeded";   
	}else{
	$sql_results= "failed".mysqli_error($con);//$sqlnew;//"failed to insert prnted inv items";   
	};
	break;
	case 18:///generate sales items sales report ///parm1: option (1:all items, 0:one item), parm2: itm id)
	////parm3: start date , parm4: end date
	$JSON_result=1;
	$sql_results = array();
	$salesitmslist= array();
	$startdate=$param[3];
	$enddate=$param[4];
	if($param[1]==1){
		///get all items sales report
		////get the sales items list
		$sql="CALL `get_sales_items` ()";
	$result = mysqli_query($con,$sql) or die(mysqli_error($con));
	  //2- loop through each item and update the sales item table
	    while ($row = $result->fetch_row())
  	{
		$salesitmslist[]=array("itmid"=> $row[0],"itmsname"=> $row[1],"itmlname" => $row[2],"itmdesc" => $row[3],"itmprice" => $row[4],"itmgroupid" => $row[5]);	
	}
	/// clear sql results////////////
	while($con->more_results()){
    $con->next_result();
    if($res = $con->store_result()) // added closing bracket
    {
    $res->free(); 
    }
	}
	///// loop through each item to genereate the report
	for($rr=0;$rr<count($salesitmslist);$rr++){
	//`get_salsitm_sums_period` ( itmid INT, startdat DATE, enddate DATE )
	$sql="CALL `get_salsitm_sums_period` ('".$salesitmslist[$rr]['itmid']."','".$startdate."','".$enddate."')";
	$result = mysqli_query($con,$sql) or die(mysqli_error($con));
	  //2- loop through each item and update the sales item table
	    while ($row = $result->fetch_row())
  	{
		$sql_results[]=array("itmid"=> $salesitmslist[$rr]['itmid'],"itmsname"=> $salesitmslist[$rr]['itmsname'],"itmlname" => $salesitmslist[$rr]['itmlname'],"itmdesc" => $salesitmslist[$rr]['itmdesc'],"itmprice" => $salesitmslist[$rr]['itmprice'],"itmgroupid" => $salesitmslist[$rr]['itmgroupid'],"allquantity"=>$row[0],"sumsales"=>$row[1]);	
	}
	while($con->more_results()){
    $con->next_result();
    if($res = $con->store_result()) // added closing bracket
    {
    $res->free(); 
    }
	}
	}//end for
	
	}else{///get one sales item detailed sales report
		//CALL `get_salsitm_mov_period` (99 , "2015-1-1" , "2015-1-16");
		$sql="CALL `get_salsitm_mov_period` ('".$param[2]."','".$startdate."','".$enddate."')";
	$result = mysqli_query($con,$sql) or die(mysqli_error($con));
	  //2- loop through each item and update the sales item table
	    while ($row = $result->fetch_row())
  	{
		$sql_results[]=array("itmdat"=> $row[0],"itmqnty"=> $row[1],"itminvid" => $row[2],"itmorderid" => $row[3],"totprice" => $row[4]);	
	}
	while($con->more_results()){
    $con->next_result();
    if($res = $con->store_result()) // added closing bracket
    {
    $res->free(); 
    }
	}
	}///end if all report parm1

	break;
	case 19:/// 12-7-2015 generate invoices reports based on selection , today, current month invoices, specific inv number, specific order number
	// parm1 : type of search : 1 today invoices , 2 current month invoices, 3 specific invoice number, 4 specific order number
	$JSON_result=1; //the result is array in json object
	$sql_results1 = array();
	$sql_results = array();
	// switch case for the user inv search type 
	switch ($param[1]){
			case 1: // today invoices
			//$param[2] : is required for curr/start date
			//1- get all the invoices of today and all its data
			//2- get all the sub invoices of the above invoices and all its data
//1----
		$sql="SELECT `inv_id`,`inv_dat`,`inv_dattime`,`inv_total`,`inv_discount`,`inv_tax`,`inv_service`,`inv_gtotal`,`inv_status`,`inv_orderno`,profile.fullname as custname,`inv_cashier_id` FROM `invoices` INNER JOIN profile ON invoices.inv_cus_prof_id=profile.profileid where `inv_dat` ='".$param[2]."';";
	   $result = mysqli_query($con,$sql);
	   $sql_results = array();
	   while ($row = $result->fetch_row())
  	{
		$inv_id=$row[0];
		$inv_dat=$row[1];
		$inv_dattime=$row[2];
		$inv_total=$row[3];
		$inv_discount=$row[4];
		$inv_tax=$row[5];
		$inv_service=$row[6];
		$inv_gtotal=$row[7];
		$inv_status=$row[8];
		$inv_orderno=$row[9];
		$inv_custname=$row[10];
		$inv_cashier_id=$row[11];
		
		$sql_results1[]=array("inv_id" => $inv_id, "inv_total" => $inv_total,"inv_discount" => $inv_discount, "inv_tax" => $inv_tax, "inv_service" => $inv_service,"inv_gtotal" => $inv_gtotal,"inv_dattime" => $inv_dattime,"inv_custname" => $inv_custname,"inv_cashier_id" => $inv_cashier_id,"inv_status" => $inv_status,"inv_orderno" => $inv_orderno,"inv_dat" => $inv_dat);
	
	}//end of retriving invoices
	///clear results from query
	while($con->more_results()){
    $con->next_result();
    if($res = $con->store_result()) // added closing bracket
    {
    $res->free(); 
    }
	}///end of clear query resluts
	
	//2---- get the sub invoices count and add it to the results
		//////
	foreach($sql_results1 as $key=>$value) {
    $sql1="SELECT COUNT(`maininv_id`) AS subinvcount FROM `sub_inv`
WHERE `maininv_id`='".$value['inv_id']."';";///get the number of sub invoices for inv id
	$result = mysqli_query($con,$sql1) or die(mysqli_error($con)); 
	   while ($row1 = $result->fetch_row())
  	{
		$num_of_subinv=$row1[0];
	}
	/// clear results////////////
	while($con->more_results()){
    $con->next_result();
    if($res = $con->store_result()) // added closing bracket
    {
    $res->free(); 
    }
	}
	///////
		
	$sql_results[]=array("inv_id" => $sql_results1[$key][ "inv_id"], "inv_total" => $sql_results1[$key][ "inv_total"],"inv_discount" =>   $sql_results1[$key][ "inv_discount"], "inv_tax" => $sql_results1[$key][ "inv_tax"], "inv_service" => $sql_results1[$key][ "inv_service"],"inv_gtotal" => $sql_results1[$key][ "inv_gtotal"],"inv_dattime" => $sql_results1[$key][ "inv_dattime"],"inv_custname" => $sql_results1[$key][ "inv_custname"],"inv_cashier_id" => $sql_results1[$key][ "inv_cashier_id"],"inv_status" => $sql_results1[$key][ "inv_status"],"inv_orderno" =>  $sql_results1[$key][ "inv_orderno"], "inv_subinvcount" =>  $num_of_subinv,"inv_dat" => $sql_results1[$key][ "inv_dat"]);
}//end for each
	
			break;
			case 2: /// cur month/ period between two dates invoices
			//$param[2] : is required for curr/start date
			//SELECT * FROM `invoices` WHERE `inv_dat` between '2015-1-16' and '2015-1-20';
			//$param[2] : is required for curr/start date
			//1- get all the invoices of today and all its data
			//2- get all the sub invoices of the above invoices and all its data
//1----
		$sql="SELECT `inv_id`,`inv_dat`,`inv_dattime`,`inv_total`,`inv_discount`,`inv_tax`,`inv_service`,`inv_gtotal`,`inv_status`,`inv_orderno`,profile.fullname as custname,`inv_cashier_id` FROM `invoices` INNER JOIN profile ON invoices.inv_cus_prof_id=profile.profileid where `inv_dat` between'".$param[2]."' and '".$param[3]."';";
	   $result = mysqli_query($con,$sql);
	   $sql_results = array();
	   while ($row = $result->fetch_row())
  	{
		$inv_id=$row[0];
		$inv_dat=$row[1];
		$inv_dattime=$row[2];
		$inv_total=$row[3];
		$inv_discount=$row[4];
		$inv_tax=$row[5];
		$inv_service=$row[6];
		$inv_gtotal=$row[7];
		$inv_status=$row[8];
		$inv_orderno=$row[9];
		$inv_custname=$row[10];
		$inv_cashier_id=$row[11];
		
		$sql_results1[]=array("inv_id" => $inv_id, "inv_total" => $inv_total,"inv_discount" => $inv_discount, "inv_tax" => $inv_tax, "inv_service" => $inv_service,"inv_gtotal" => $inv_gtotal,"inv_dattime" => $inv_dattime,"inv_custname" => $inv_custname,"inv_cashier_id" => $inv_cashier_id,"inv_status" => $inv_status,"inv_orderno" => $inv_orderno,"inv_dat" => $inv_dat);
	
	}//end of retriving invoices
	///clear results from query
	while($con->more_results()){
    $con->next_result();
    if($res = $con->store_result()) // added closing bracket
    {
    $res->free(); 
    }
	}///end of clear query resluts
	
	//2---- get the sub invoices count and add it to the results
		//////
	foreach($sql_results1 as $key=>$value) {
    $sql1="SELECT COUNT(`maininv_id`) AS subinvcount FROM `sub_inv`
WHERE `maininv_id`='".$value['inv_id']."';";///get the number of sub invoices for inv id
	$result = mysqli_query($con,$sql1) or die(mysqli_error($con)); 
	   while ($row1 = $result->fetch_row())
  	{
		$num_of_subinv=$row1[0];
	}
	/// clear results////////////
	while($con->more_results()){
    $con->next_result();
    if($res = $con->store_result()) // added closing bracket
    {
    $res->free(); 
    }
	}
	///////
		
	$sql_results[]=array("inv_id" => $sql_results1[$key][ "inv_id"], "inv_total" => $sql_results1[$key][ "inv_total"],"inv_discount" =>   $sql_results1[$key][ "inv_discount"], "inv_tax" => $sql_results1[$key][ "inv_tax"], "inv_service" => $sql_results1[$key][ "inv_service"],"inv_gtotal" => $sql_results1[$key][ "inv_gtotal"],"inv_dattime" => $sql_results1[$key][ "inv_dattime"],"inv_custname" => $sql_results1[$key][ "inv_custname"],"inv_cashier_id" => $sql_results1[$key][ "inv_cashier_id"],"inv_status" => $sql_results1[$key][ "inv_status"],"inv_orderno" =>  $sql_results1[$key][ "inv_orderno"], "inv_subinvcount" =>  $num_of_subinv,"inv_dat" => $sql_results1[$key][ "inv_dat"]);
}//end for each
			
			break;
			
			case 3: //specific invoice number
			//$param[2] : is required for inv no
			//1- get all the invoices of today and all its data
			//2- get all the sub invoices of the above invoices and all its data
//1----
		$sql="SELECT `inv_id`,`inv_dat`,`inv_dattime`,`inv_total`,`inv_discount`,`inv_tax`,`inv_service`,`inv_gtotal`,`inv_status`,`inv_orderno`,profile.fullname as custname,`inv_cashier_id` FROM `invoices` INNER JOIN profile ON invoices.inv_cus_prof_id=profile.profileid where `inv_id` ='".$param[2]."';";
	   $result = mysqli_query($con,$sql);
	   $sql_results = array();
	   while ($row = $result->fetch_row())
  	{
		$inv_id=$row[0];
		$inv_dat=$row[1];
		$inv_dattime=$row[2];
		$inv_total=$row[3];
		$inv_discount=$row[4];
		$inv_tax=$row[5];
		$inv_service=$row[6];
		$inv_gtotal=$row[7];
		$inv_status=$row[8];
		$inv_orderno=$row[9];
		$inv_custname=$row[10];
		$inv_cashier_id=$row[11];
		
		$sql_results1[]=array("inv_id" => $inv_id, "inv_total" => $inv_total,"inv_discount" => $inv_discount, "inv_tax" => $inv_tax, "inv_service" => $inv_service,"inv_gtotal" => $inv_gtotal,"inv_dattime" => $inv_dattime,"inv_custname" => $inv_custname,"inv_cashier_id" => $inv_cashier_id,"inv_status" => $inv_status,"inv_orderno" => $inv_orderno,"inv_dat" => $inv_dat);
	
	}//end of retriving invoices
	///clear results from query
	while($con->more_results()){
    $con->next_result();
    if($res = $con->store_result()) // added closing bracket
    {
    $res->free(); 
    }
	}///end of clear query resluts
	
	//2---- get the sub invoices count and add it to the results
		//////
	foreach($sql_results1 as $key=>$value) {
    $sql1="SELECT COUNT(`maininv_id`) AS subinvcount FROM `sub_inv`
WHERE `maininv_id`='".$value['inv_id']."';";///get the number of sub invoices for inv id
	$result = mysqli_query($con,$sql1) or die(mysqli_error($con)); 
	   while ($row1 = $result->fetch_row())
  	{
		$num_of_subinv=$row1[0];
	}
	/// clear results////////////
	while($con->more_results()){
    $con->next_result();
    if($res = $con->store_result()) // added closing bracket
    {
    $res->free(); 
    }
	}
	///////
		
	$sql_results[]=array("inv_id" => $sql_results1[$key][ "inv_id"], "inv_total" => $sql_results1[$key][ "inv_total"],"inv_discount" =>   $sql_results1[$key][ "inv_discount"], "inv_tax" => $sql_results1[$key][ "inv_tax"], "inv_service" => $sql_results1[$key][ "inv_service"],"inv_gtotal" => $sql_results1[$key][ "inv_gtotal"],"inv_dattime" => $sql_results1[$key][ "inv_dattime"],"inv_custname" => $sql_results1[$key][ "inv_custname"],"inv_cashier_id" => $sql_results1[$key][ "inv_cashier_id"],"inv_status" => $sql_results1[$key][ "inv_status"],"inv_orderno" =>  $sql_results1[$key][ "inv_orderno"], "inv_subinvcount" =>  $num_of_subinv,"inv_dat" => $sql_results1[$key][ "inv_dat"]);
}//end for each
			break;
			case 4: // specific order number
			//$param[2] : is required for inv no
			//1- get all the invoices of today and all its data
			//2- get all the sub invoices of the above invoices and all its data
//1----
		$sql="SELECT `inv_id`,`inv_dat`,`inv_dattime`,`inv_total`,`inv_discount`,`inv_tax`,`inv_service`,`inv_gtotal`,`inv_status`,`inv_orderno`,profile.fullname as custname,`inv_cashier_id` FROM `invoices` INNER JOIN profile ON invoices.inv_cus_prof_id=profile.profileid where `inv_orderno` ='".$param[2]."';";
	   $result = mysqli_query($con,$sql);
	   $sql_results = array();
	   while ($row = $result->fetch_row())
  	{
		$inv_id=$row[0];
		$inv_dat=$row[1];
		$inv_dattime=$row[2];
		$inv_total=$row[3];
		$inv_discount=$row[4];
		$inv_tax=$row[5];
		$inv_service=$row[6];
		$inv_gtotal=$row[7];
		$inv_status=$row[8];
		$inv_orderno=$row[9];
		$inv_custname=$row[10];
		$inv_cashier_id=$row[11];
		
		$sql_results1[]=array("inv_id" => $inv_id, "inv_total" => $inv_total,"inv_discount" => $inv_discount, "inv_tax" => $inv_tax, "inv_service" => $inv_service,"inv_gtotal" => $inv_gtotal,"inv_dattime" => $inv_dattime,"inv_custname" => $inv_custname,"inv_cashier_id" => $inv_cashier_id,"inv_status" => $inv_status,"inv_orderno" => $inv_orderno,"inv_dat" => $inv_dat);
	
	}//end of retriving invoices
	///clear results from query
	while($con->more_results()){
    $con->next_result();
    if($res = $con->store_result()) // added closing bracket
    {
    $res->free(); 
    }
	}///end of clear query resluts
	
	//2---- get the sub invoices count and add it to the results
		//////
	foreach($sql_results1 as $key=>$value) {
    $sql1="SELECT COUNT(`maininv_id`) AS subinvcount FROM `sub_inv`
WHERE `maininv_id`='".$value['inv_id']."';";///get the number of sub invoices for inv id
	$result = mysqli_query($con,$sql1) or die(mysqli_error($con)); 
	   while ($row1 = $result->fetch_row())
  	{
		$num_of_subinv=$row1[0];
	}
	/// clear results////////////
	while($con->more_results()){
    $con->next_result();
    if($res = $con->store_result()) // added closing bracket
    {
    $res->free(); 
    }
	}
	///////
		
	$sql_results[]=array("inv_id" => $sql_results1[$key][ "inv_id"], "inv_total" => $sql_results1[$key][ "inv_total"],"inv_discount" =>   $sql_results1[$key][ "inv_discount"], "inv_tax" => $sql_results1[$key][ "inv_tax"], "inv_service" => $sql_results1[$key][ "inv_service"],"inv_gtotal" => $sql_results1[$key][ "inv_gtotal"],"inv_dattime" => $sql_results1[$key][ "inv_dattime"],"inv_custname" => $sql_results1[$key][ "inv_custname"],"inv_cashier_id" => $sql_results1[$key][ "inv_cashier_id"],"inv_status" => $sql_results1[$key][ "inv_status"],"inv_orderno" =>  $sql_results1[$key][ "inv_orderno"], "inv_subinvcount" =>  $num_of_subinv,"inv_dat" => $sql_results1[$key][ "inv_dat"]);
}//end for each
			break;
			
	}//end of select case
	
	
	break;
	//
	
	case 20:/// 17-7-2015 get sub invoices data based on invoice number
	// parm1 : main invoice number
	$JSON_result=1; //the result is array in json object
	$sql_results = array();
	$sql="SELECT `subinvid`,`subinv_no`,`cashierid`,`cust_profid`,`profile`.`fullname`,`paidstatus`,`dat`,`datetime`,`subinvJson` FROM `sub_inv` INNER JOIN `profile` ON `sub_inv`.`cust_profid`= `profile`.`profileid`  WHERE `sub_inv`.`maininv_id` ='".$param[1]."';";
	   $result = mysqli_query($con,$sql);
	   $sql_results = array();
	   while ($row = $result->fetch_row())
  	{
		$subinv_id=$row[0];
		$subinv_no=$row[1];
		$cash_id=$row[2];
		$cust_id=$row[3];
		$cust_name=$row[4];
		$paidstatus=$row[5];
		
		$inv_dat=$row[6];
		$inv_dattime=$row[7];
		
		$subinv_items=$row[8];
				
		$sql_results[]=array("subinv_id" => $subinv_id, "subinv_no" => $subinv_no,"cash_id" => $cash_id, "cust_name" => $cust_name, "paidstatus" => $paidstatus,"inv_dat" => $inv_dat,"inv_dattime" => $inv_dattime,"subinv_items" => $subinv_items);
	
	}//end of retriving invoices
	///clear results from query
	while($con->more_results()){
    $con->next_result();
    if($res = $con->store_result()) // added closing bracket
    {
    $res->free(); 
    }
	}///end of clear query resluts
	break;
	case 21:
	/// 19-7-2015 purchase report ///
	// parm1 : select all items or specific item , 0 if all items
	//parm2:from date
	//parm3:to date
	$JSON_result=1; //the result is array in json object
	$sql_items = array();
	$sql_results = array();
	//$sql="";//intiate sql statment
	switch($param[1]){
			case 0://all items
			
	/*$sql="SELECT `acc_purch`.`purch_id` as purchid,`st_item_mov`.`st_itm_mov_itmid` as itemid,`stock_items`.`itm_shortname` as itemname,`acc_purch`.`purch_type` as purchasetype,`acc_purch`.`purch_dat` as purchdat,`acc_purch`.`purch_timestamp` as purchdattiem,`st_item_mov`.`st_itm_mov_usrid` as purchuserid,`st_item_mov`.`st_itm_mov_qnty` as purchqnty,`st_item_qnty_unit`.`st_itm_qnty_unit_name` as purchqntyname,`acc_purch`.`purch_value` as purchprice,`acc_purch`.`purch_desc` as purchdesc from `acc_purch` inner join `st_item_mov` on `acc_purch`.`st_mov_id` = `st_item_mov`.`st_itm_mov_id` inner join `stock_items` on `st_item_mov`.`st_itm_mov_itmid` =`stock_items`.`itm_id` inner join `st_item_qnty_unit` on `st_item_mov`.`st_itm_mov_qnty_unit`=`st_item_qnty_unit`.`st_itm_qnty_unit_id` where `acc_purch`.`purch_dat` between '".$param[2]."' and '".$param[3]."';";
	*/
	//// get all stock itmes list in array (Item id)
	$sql="SELECT `itm_id` FROM `stock_items` WHERE `itm_type`!=4";
	 $result = mysqli_query($con,$sql);

	   while ($row1 = $result->fetch_row())
  	{
		$itm_id=$row1[0];
		$sql_items[]=array("itm_id" => $itm_id);
		//$sql_results[]=array("itm_id" => $itm_id);
	
	}//end of while retriving rows
	///clear results from query
	while($con->more_results()){
    $con->next_result();
    if($res = $con->store_result()) // added closing bracket
    {
    $res->free(); 
    }
	}///end of clear query resluts
	
	///loop through each item id to get the summation of quantity,prices, descrpitions
	
	foreach($sql_items as $key=>$value) {
   
	$sql2="SELECT `acc_purch`.`purch_id` as purchid,`st_item_mov`.`st_itm_mov_itmid` as itemid,`stock_items`.`itm_shortname` as itemname,`acc_purch`.`purch_type` as purchasetype,`acc_purch`.`purch_dat` as purchdat,`acc_purch`.`purch_timestamp` as purchdattiem,`st_item_mov`.`st_itm_mov_usrid` as purchuserid,`st_item_mov`.`st_itm_mov_qnty` as purchqnty,`st_item_qnty_unit`.`st_itm_qnty_unit_name` as purchqntyname,`acc_purch`.`purch_value` as purchprice,`acc_purch`.`purch_desc` as purchdesc from `acc_purch` inner join `st_item_mov` on `acc_purch`.`st_mov_id` = `st_item_mov`.`st_itm_mov_id` inner join `stock_items` on `st_item_mov`.`st_itm_mov_itmid` =`stock_items`.`itm_id` inner join `st_item_qnty_unit` on `st_item_mov`.`st_itm_mov_qnty_unit`=`st_item_qnty_unit`.`st_itm_qnty_unit_id` where `acc_purch`.`purch_dat` between '".$param[2]."' and '".$param[3]."' and `stock_items`.`itm_id`='".$value['itm_id']."';";
	
	$totquantity=0;
	$totprice=0;
	$totdesc="";
	$purchid="";
	
	$itemid= $value['itm_id'];
	$itemname="";
	$purchasetype="";
	$purchdat="";
	$purchdattiem="";
	$purchuserid="";
	$purchqnty="";
	$purchqntyname="";
	$purchprice="";
	$purchdesc="";
	
	$result2 = mysqli_query($con,$sql2) or die(mysqli_error($con)); 
	   while ($row = $result2->fetch_row())
  	{
		$purchid=$row[0];
		$itemid=$value['itm_id'];//$row[1];
		$itemname=$row[2];
		$purchasetype=$row[3];
		$purchdat=$row[4];
		$purchdattiem=$row[5];
		$purchuserid=$row[6];
		$purchqnty=$row[7];
		$purchqntyname=$row[8];
		$purchprice=$row[9];
		$purchdesc=$row[10];
		
		$totquantity= $totquantity+$purchqnty;
		$totprice=$totprice+$purchprice;
		$totdesc=$totdesc."<br/>* ".$purchdesc;
	}
	/// create the output for all items
	$sql_results[]=array("purchid" => $purchid, "itemid" => $itemid,"itemname" => $itemname, "purchasetype" => $purchasetype, "purchdat" => $purchdat,"purchdattiem" => $purchdattiem,"purchuserid" => $purchuserid,"totquantity" => $totquantity,"purchqntyname" => $purchqntyname,"totprice" => $totprice,"totdesc" => $totdesc);
	//clear results
	while($con->more_results()){
    $con->next_result();
    if($res = $con->store_result()) // added closing bracket
    {
    $res->free(); 
    }
	}///end of clear query resluts
	
	
	}//end for each item id
	
	break;
	
	case $param[1]!= 0://specific item id in parm1
	$sql="SELECT `acc_purch`.`purch_id` as purchid,`st_item_mov`.`st_itm_mov_itmid` as itemid,`stock_items`.`itm_shortname` as itemname,`acc_purch`.`purch_type` as purchasetype,`acc_purch`.`purch_dat` as purchdat,`acc_purch`.`purch_timestamp` as purchdattiem,`st_item_mov`.`st_itm_mov_usrid` as purchuserid,`st_item_mov`.`st_itm_mov_qnty` as purchqnty,`st_item_qnty_unit`.`st_itm_qnty_unit_name` as purchqntyname,`acc_purch`.`purch_value` as purchprice,`acc_purch`.`purch_desc` as purchdesc from `acc_purch` inner join `st_item_mov` on `acc_purch`.`st_mov_id` = `st_item_mov`.`st_itm_mov_id` inner join `stock_items` on `st_item_mov`.`st_itm_mov_itmid` =`stock_items`.`itm_id` inner join `st_item_qnty_unit` on `st_item_mov`.`st_itm_mov_qnty_unit`=`st_item_qnty_unit`.`st_itm_qnty_unit_id` where `acc_purch`.`purch_dat` between '".$param[2]."' and '".$param[3]."' and `stock_items`.`itm_id`='".$param[1]."';";
	
	   $result = mysqli_query($con,$sql);
	   $sql_results = array();
	   $totpurchprice=0;
	   $totpurchqnty=0;
	   
	   while ($row = $result->fetch_row())
  	{
		$purchid=$row[0];
		$itemid=$row[1];
		$itemname=$row[2];
		$purchasetype=$row[3];
		$purchdat=$row[4];
		$purchdattiem=$row[5];
		$purchuserid=$row[6];
		$purchqnty=$row[7];
		$purchqntyname=$row[8];
		$purchprice=$row[9];
		$purchdesc=$row[10];
		
		
		$sql_results[]=array("purchid" => $purchid, "itemid" => $itemid,"itemname" => $itemname, "purchasetype" => $purchasetype, "purchdat" => $purchdat,"purchdattiem" => $purchdattiem,"purchuserid" => $purchuserid,"purchqnty" => $purchqnty,"purchqntyname" => $purchqntyname,"purchprice" => $purchprice,"purchdesc" => $purchdesc);
	
	}//end of while retriving rows
	///clear results from query
	while($con->more_results()){
    $con->next_result();
    if($res = $con->store_result()) // added closing bracket
    {
    $res->free(); 
    }
	}///end of clear query resluts
	break;
	};///end switching specific item or all items
	break;

	case 22:////add money to profiles acc (staff / partners) mosta7akat
	////add acc mov , then add prof mov
	//// parameters : $param[1]: date ,$param[2]:time  ,$param[3]: not used now, $param[4]: prof id,$param[5]: prof added value (money),$param[6]: prof added value descr
	 // 1-  insert a record in the accounting movement table / geniric used by all transactions return inserted acc_mov_id 
	 $JSON_result=0; //the result is text
	   $sql="CALL `add_acc_mov` ('".$param[1]."','".$param[2]."','1','0','0','0','0','0','1','0');";
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

	 ////////////2 - create sql insert statment for acc profile move +ve value add value to his balance
		///(acc_mov_id int, prof_mov_dat,prof_mov_time,prof_id ,acc_mov_type = 1 (+ve),prof_mov_value ,prof_mov_balance ,prof_mov_desc )
		$sql="CALL `add_prof_mov` ('".$acc_mov_id[0]."','".$param[1]."','".$param[2]."','".$param[4]."','1','".$param[5]."','0','".$param[6]."');";
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
		if($result){
			$sql_results="succeded";   
	   					}else{
	   		$sql_results= "adding to profile balance process failed";
				};
	  }///end if acc query is done
	  else{
		$sql_results="failed to insert acc  movement";
			 
	  }
	
	break;
	case 23:///get/update profile data 
	//$param[1]: 1 get profile data , 2 update profile data ---//$param[2]: profile id, 
	//in case param1=2 => $param[3]:fullname,$param[4]`mobile`,$param[5]`mobile2`,$param[6]`email`,$param[7]`address`,$param[8]`jobtitle`,$param[9]`phone`,$param[10]`notes`
	$JSON_result=1; //the result is array in json object
	switch($param[1]){
		case 1://get profile data
	$sql="SELECT `profileid`,`user_id`,`fullname`,`mobile`,`mobile2`,`email`,`address`,`jobtitle`,`phone`,`notes`,`type` FROM `profile` where `profileid`=".$param[2].";";
	   $result = mysqli_query($con,$sql);
	  // $sql_results = array();
	   while ($row = $result->fetch_row())
  	{	
		$sql_results[]=array("profname" => $row[2], "profmob" => $row[3], "profmob2" => $row[4], "profemail" => $row[5], "profaddress" => $row[6], "profjob" => $row[7], "profphone" => $row[8], "profnotes" => $row[9], "user_id" => $row[1], "profileid" => $row[0], "prof_type" => $row[10]);
	}
	break;
	case 2:///update profile data
	$JSON_result=0; //the result is text
	$sql="UPDATE `profile` SET `fullname` = '".$param[3]."', `mobile` = '".$param[4]."', `mobile2` = '".$param[5]."', `email` = '".$param[6]."', `address` = '".$param[7]."', `jobtitle` = '".$param[8]."', `phone` = '".$param[9]."', `notes` = '".$param[10]."' WHERE `profile`.`profileid` = '".$param[2]."';";
	   $result = mysqli_query($con,$sql);
	  // $sql_results = array();
	  //if($result){
	  $sql_results=$result ;
	  //}
	 	
	break;
	};///end switch
	break;
	case 24:///add new staff member profile and user
	$JSON_result=0; //the result is text
	//$user_ID= 2;
	 ///param1 : 0 staff with guest user, 1 staff with cashier user (add new user to users table)
	  ///param2: full name, param3,mobile, param4 mobile2, pram5 email, param6 address, param7 jobtitle, param8 type,param9 phone, param10 notes, 
	   //$param[8]`type` (1 system admin, 2 partner/manager , 3 staff member, 4 client/customer, 5 virtual prof for system use)
	 
	  // param13: current date, param14 expiration date
	 
	  // param11 username, param12 psw

	  //// check if profile with new user id (cashier), then create new user and get its id
	  ///if prof has no account , assign to guest user id
	  ///insert prof data with one of above user ids
	  if((int)$param[1]==0){///user guest user id dont create new user 
	  ///guest user id from db is 2
		$user_ID= 2;
		$usertype="Staff Member";
		$userperm=100;///guest permission
	  }else if((int)$param[1]==1){///creat new user and get its id
	  ///create new user and get the user id
	  $usertype="Staff Member-Cashier";
	  $userperm=1;///cashier permission
	  $sql="CALL `add_newuser` ('".$param[11]."' ,'".$usertype."' , '".$userperm."' , '".$param[13]."' , '".$param[14]."' , '".$param[12]."');";
	  $result = mysqli_query($con,$sql);
	  // $sql_results = array();
	   while ($row = $result->fetch_row())
  	{
		$user_ID=$row[0];
		//$sql_results=$user_ID;
	}
	/*$user_ID=$result->fetch_row();
		  $sql_results=$user_ID;*/
	  /// clear results
	  	while($con->more_results()){
    	$con->next_result();
    	if($res = $con->store_result()) // added closing bracket
    	{
        $res->free(); 
    	}
		}//////
	  }//end if the user is cashier to create new user in users table
	  
	////create the profile record
	///param2: full name, param3,mobile, param4 mobile2, pram5 email, param6 address, param7 jobtitle, param8 type,param9 phone, param10 notes, 
	   //$param[8]`type` (1 system admin, 2 partner/manager , 3 staff member, 4 client/customer, 5 virtual prof for system use)
	 $sql2="CALL `add_newprof` ('".$user_ID."' , '".$param[2]."' , '".$param[3]."' , '".$param[4]."' , '".$param[5]."' ,'".$param[6]."' , '".$param[7]."' ,  '".$param[8]."' ,'".$param[9]."' , '".$param[10]."');";
$result = mysqli_query($con,$sql2);

 while ($row1 = $result->fetch_row())
  	{
		$insertedprofID=$row1[0];
		//$sql_results=$user_ID;
	}
	  /*$insertedprofID=$result->fetch_row();*/
	 // $insertedprofID=0;
	  /// clear results
	  	while($con->more_results()){
    	$con->next_result();
    	if($res = $con->store_result()) // added closing bracket
    	{
        $res->free(); 
    	}
		}//////
		if($insertedprofID>0){
			$sql_results="succeded";
		}else{
			$sql_results="faild";
		}

	break;
	case 25:///get all cash balance now
	$JSON_result=0; //the result is json (earned,spent)
	///get sum of all earned cash
	///get sum of all spent cash
	//
	$sql2="SELECT SUM( IF(  `acc_mov_type` =1, cash_value, 0 ) ) AS  'earned', SUM( IF(  `acc_mov_type` =2, cash_value, 0 ) ) AS  'spent' FROM  `acc_cash` WHERE 1;";
$result = mysqli_query($con,$sql2);
$earned=0;
$spent=0;
 while ($row1 = $result->fetch_row())
  	{
		$earned=$row1[0];
		$spent=$row1[1];
		//$sql_results=$user_ID;
	}
	$cashbalance=($earned-$spent);
	$sql_results=$cashbalance;
	///calculate the balance all earned - all spent
	
	
	break;
};///end of order switch


if($JSON_result==0){// if the returned results is not json, only one value
	echo $sql_results;
}else{///if retrurned resuts is JSON Object
	echo json_encode($sql_results);
}


?>