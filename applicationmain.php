<?php
session_start();
ini_set( "session.cookie_lifetime", "0" ); // 0 means "until the browser is closed
header('Content-Type: text/html; charset=utf-8');/// set the content charset to utf-8 for php
include_once './php/applicationVars.php';

//error_reporting(E_ALL);
//ini_set('display_errors', '1');
$userID=$_SESSION['user_id'];
//echo $_SESSION['login_status'];die();
include_once './php/session_checker.php';
$userisloggged=sessionchecker($userID);//execute sesssion checker function before proceeding
//echo $userisloggged; 
if($userisloggged){
/////////// check user permisssion to show/ allow application sections
$userPermission=$_SESSION['permission'];
include_once './php/featurepermissions.php';
userpermissionsCheckSet($userPermission);
if($userPermission==1){header('location:./orderscreen/order_screen.php');};
////$_SESSION['accCashierpage']=0;
//$_SESSION['accStockpage']=0;
//$_SESSION['accOrderspage']=0;
//$_SESSION['accAccountpage']=0;
//$_SESSION['accManagepage']=0;

?>

<!------- html content goes here ----------------->
<!doctype html>
<head>
<meta charset="utf-8">
<link rel="stylesheet" href="css/jquery-ui.min.css" type="text/css" />
<link rel="stylesheet" type="text/css" href="css/appmain.css" />
<title>الشاشة الرئيسية - نظام كافيكي - كافيه موكا</title>
 <script type="text/javascript" src="js/jquery-1.11.1.min.js"></script>
 <script type="text/javascript" src="js/jquery-ui.min.js"></script>
 <script type="text/javascript" src="js/appmain.js"></script>
</head>

<body>
<div class="headerarea">
<div class="logo"><img src="images/logoMoka_small.png" alt="Moka" width="86" height="40"></div>
<div class="userinfo">
<ul id="logout-ul">
<li class="wecomtop"><?php echo $_SESSION['fullname'] ?></li>
<li><!--<a href="ttapp/editprofilea.php">تعديل البيانات</a><span> | </span>--><a href="php/logout.php?id=<?php echo $_SESSION['user_id'] ?>">تسجيل خروج</a></li>
</ul>
</div>
</div>
<div id="frameContainer">
<dov id="PageContainer">
<div id="main_btns_selector" class="sub-sub-page-container" style="display: block;">
<h2>مرحبا بك في نظام كافي كي (Cafe Key) لادارة المقاهي</h2>
<div class="frmfieldrow">
<div class="frmfieldrow100">
<?php
////$_SESSION['accCashierpage']=0;
//$_SESSION['accStockpage']=0;
//$_SESSION['accOrderspage']=0;
//$_SESSION['accAccountpage']=0;
//$_SESSION['accManagepage']=0;
if($_SESSION['accOrderspage']==1){
?>
<input class="button green selector_btns" data-id="1" style="font-size:22px; font-weight:bold;color:#FFF;float:right; width:865px;height:60px;" id="addnewuser_btn" type="button" value="شاشة الأوردرات - الكاشير">
<?php
}else{
?>
<input class="button green selector_btns" data-id="0" style="font-size:22px; font-weight:bold;color:#FFF;float:right; width:865px;height:60px;" id="addnewuser_btn" type="button" value="شاشة الأوردرات - الكاشير" disabled>

<?php
};
if($_SESSION['accStockpage']==1){
?>
<input class="button blue selector_btns" data-id="2" style="font-size:22px; font-weight:bold;color:#FFF;float:right; width:865px;height:60px;" id="addnewuser_btn" type="button" value="شاشة المخازن">
<?php
}else{
?>
<input class="button blue selector_btns" data-id="0" style="font-size:22px; font-weight:bold;color:#FFF;float:right; width:865px;height:60px;" id="addnewuser_btn" type="button" value="شاشة المخازن" disabled>
<?php
};
if($_SESSION['accAccountpage']==1){
?>
<input class="button orange selector_btns" data-id="3" style="font-size:22px; font-weight:bold;color:#FFF;float:right; width:865px;height:60px;" id="addnewuser_btn" type="button" value="شاشة الحسابات">
<?php
}else{
?>
<input class="button orange selector_btns" data-id="0" style="font-size:22px; font-weight:bold;color:#FFF;float:right; width:865px;height:60px;" id="addnewuser_btn" type="button" value="شاشة الحسابات" disabled>
<?php
};
if($_SESSION['accManagepage']==1){
?>
<input class="button selector_btns" data-id="4" style="font-size:22px; font-weight:bold;color:#FFF;float:right; width:865px;height:60px;" id="addnewuser_btn" type="button" value="شاشة اعداد النظام">
<?php
}else{
?>
<input class="button selector_btns" data-id="0" style="font-size:22px; font-weight:bold;color:#FFF;float:right; width:865px;height:60px;" id="addnewuser_btn" type="button" value="شاشة ادارة حسابات الدخول" disabled>
<?php
};
?>
</div>
</div>
</div><!----end of page section---->

</div><!----end of page container-->
</div><!----end of framcontainer-->
<div class="clear"></div>
<div id ="footerbar">
<div class="copyrighthome"><div class="social"><a target="_blank" href='https://www.facebook.com/mokacafeegypt'><img src="images/icons/facebook.png" class="socialIcon" alt=""></a><a href='#'><img src="images/icons/Twitter.png" class="socialIcon" alt=""></a><a href='#'><img src="images/icons/email.png" class="socialIcon" alt=""></a></div>
جميع الحقوق محفوظة © 2014  <a href="http://makkcg.com" target="_blank">موكا كافيه بواسطة م. محمد خليفة</a>
</div><!----end of footer---->

</div >
</body>
</html>
<?php
}else{
echo "<META HTTP-EQUIV=\"refresh\" CONTENT=\"0; URL=index.php#login_form\"> ";
exit;
die();	
}
?>>>>>