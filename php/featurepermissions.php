<?php
header('Content-Type: text/html; charset=utf-8');/// set the content charset to utf-8 for php
//// initialize permissions variables
$_SESSION['accCashierpage']=0; // access cashier page 
$_SESSION['accStockpage']=0; // access stock control page
$_SESSION['accAccountpage']=0; /// access accounting page
$_SESSION['accManagepage']=0;/// access manage contacts page
$_SESSION['accOrderspage']=0;//// access orders page

function userpermissionsCheckSet($userpermission){
	// set the user features permissions according to user permision type (0,1,2,3,4,etc..)
	switch($userpermission){
	case 0:// super admin user
$_SESSION['accCashierpage']=1;
$_SESSION['accStockpage']=1;
$_SESSION['accAccountpage']=1;
$_SESSION['accManagepage']=1;
$_SESSION['accOrderspage']=1;
	break;
	case 1: /// cashier only user
$_SESSION['accCashierpage']=0;
$_SESSION['accStockpage']=0;
$_SESSION['accAccountpage']=0;
$_SESSION['accManagepage']=0;
$_SESSION['accOrderspage']=1;
	break;
	case 2: /// accountant only user
$_SESSION['accCashierpage']=0;
$_SESSION['accStockpage']=0;
$_SESSION['accOrderspage']=0;
$_SESSION['accAccountpage']=1;
$_SESSION['accManagepage']=0;
	break;
		case 3: /// stock control only user
$_SESSION['accCashierpage']=0;
$_SESSION['accOrderspage']=0;
$_SESSION['accStockpage']=1;
$_SESSION['accAccountpage']=0;
$_SESSION['accManagepage']=0;
	break;
		case 4: /// manager access stock and accounting only user
$_SESSION['accCashierpage']=0;
$_SESSION['accOrderspage']=0;
$_SESSION['accStockpage']=1;
$_SESSION['accAccountpage']=1;
$_SESSION['accManagepage']=0;
	break;
	case 100: /// guest user
$_SESSION['accCashierpage']=0;
$_SESSION['accStockpage']=0;
$_SESSION['accAccountpage']=0;
$_SESSION['accManagepage']=0;
$_SESSION['accOrderspage']=0;
	break;
	default:
$_SESSION['accCashierpage']=0;
$_SESSION['accStockpage']=0;
$_SESSION['accAccountpage']=0;
$_SESSION['accManagepage']=0;
$_SESSION['accOrderspage']=0;
	break;		
	}
	return 1;
}

////// show permission err msgs
function showpermissionerrmsg($err_type){
switch($err_type){
case 0:
echo "<div class='perm_err_msg'><h2>عفوا .... ليس لك صلاحيات للدخول الى هذه الصفحة.. يرجى تسجيل الدخول بمستخدم  له صلاحيات</h2></div>";
break;	
}
}

?>