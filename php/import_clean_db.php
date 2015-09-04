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

//include "db_config_first.php"; 
$mysql_db_database="mokacafetest";
// Name of the file
$filename = 'clean_db.sql';
// MySQL host
$mysql_host = 'localhost';
// MySQL username
$mysql_username = 'root';
// MySQL password
$mysql_password = '';
// Database name
$mysql_database = 'mokacafetest';

// Connect to MySQL server
mysql_connect($mysql_host, $mysql_username, $mysql_password) or die('Error connecting to MySQL server: ' . mysql_error());
// Select database
mysql_select_db($mysql_db_database) or die('Error selecting MySQL database: ' . mysql_error());

// Temporary variable, used to store current query
$templine = '';
// Read in entire file
$lines = file($filename);
// Loop through each line
foreach ($lines as $line)
{
// Skip it if it's a comment
if (substr($line, 0, 2) == '--' || $line == '')
    continue;

// Add this line to the current segment
$templine .= $line;
// If it has a semicolon at the end, it's the end of the query
if (substr(trim($line), -1, 1) == ';')
{
    // Perform the query
    mysql_query($templine) or $sql_results='Error performing query \'<strong>' . $templine . '\': ' . mysql_error() . '<br /><br />';
    // Reset temp variable to empty
    $templine = '';
}
}
$sql_results= "Tables imported successfully";


if($JSON_result==0){// if the returned results is not json, only one value
	echo $sql_results;
}else{///if retrurned resuts is JSON Object
	echo json_encode($sql_results);
}


?>