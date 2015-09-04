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
if($_SESSION['accManagepage']){// user has access to first setup page 
?>

<!------- html content goes here ----------------->


<!doctype html>
<html>

<head>
<meta charset="utf-8">
<link href="css/owl.carousel.css" rel="stylesheet">
<link href="css/owl.theme.css" rel="stylesheet">
<link href="css/modal.css" rel="stylesheet">

<!------------------------------------->

<title><?php echo $appVar_htmlPageTitle; ?></title>
 <link rel="stylesheet" href="css/jquery-ui.min.css" type="text/css" />

 <script type="text/javascript" src="js/jquery-1.11.1.min.js"></script>
 <script type="text/javascript" src="js/jquery-ui.min.js"></script>
 <script src="js/owl.carousel.min.js"></script>
 <!--------------------- jquery widgets ------->
 <link rel="stylesheet" href="js/jqwidgets/styles/jqx.base.css" type="text/css" />
    <script type="text/javascript" src="js/jqwidgets/jqxcore.js"></script>
<script type="text/javascript" src="js/jqwidgets/jqxbuttons.js"></script>
    <script type="text/javascript" src="js/jqwidgets/jqxscrollbar.js"></script>
 <script type="text/javascript" src="js/jqwidgets/jqxlistbox.js"></script>
    <script type="text/javascript" src="js/jqwidgets/jqxdropdownlist.js"></script>
    

 <!------------------------------------------->

 <link rel="stylesheet" type="text/css" href="css/stockcontrol.css" />
  <script type="text/javascript" src="js/acc_func.js"></script>
  <script type="text/javascript" src="js/firstsetup.js"></script>
   <script type="application/javascript" >
document.loggedinuserid=parseInt('<?php echo $userID; ?>');
document.loggedinusername=('<?php echo $_SESSION['fullname'];?>');
</script>
<style>

ul.setupmenu {
  margin: 10px 0;
  padding: 5px 0;
}

ul.setupmenu li {
  float: right;
  list-style-type: none;
  padding: 15px;
  font-size: 18px;
  border: 1px solid white;
  background-color: rgb(174, 209, 255);
}
ul.setupmenu li a {
  color: black;
  text-decoration: none;
  font-weight: bold;
}
ul.setupmenu li:hover {
  background-color: rgb(255, 253, 134);
}
.repcontainer{
width:100%;
font-family: sans-serif;
background-color:#FFF;	
}
.repheader{
margin:10px 3px;	
}
.reptable{
padding:5px;
border:solid #999 1px;	
}

.boxer {
   display: table;
   border-collapse: collapse;
   width:950px;
   
}
 
.boxer .box-row {
   display: table-row;
   float:right;
   margin:0px 2px;
   width:100%;
}
 
.boxer .box {
   display: table-cell;
   text-align: center;
   vertical-align:middle;
   border: 1px solid #999;
   float:right;
   padding:3px;
   min-height:120px;
   font-size:18px;
}
.tblhead .box {
   display: table-cell;
   text-align: center;
   vertical-align:middle;
   border: 1px solid #999;
   float:right;
   padding:3px;
   min-height:50px;
   font-size:18px;
}
.tblcode{
width:25px;	
}
.tblitmname{
width:105px;	
}
.tblsold{
	width:55px;
}
.tblbought{
	width:55px;
}
.tblspoil{
	width:55px;
}
.tbltrans{
	width:57px;
}
.tblcorrbal{
	width:55px;
}
.tblunit{
	width:40px;
}
.tblnotes{
width:150px;	
}
.tblbal{
width:100px;	
}
.tbldat{
width:100px;	
}
.bld{
	font-weight:bold;
}
.tblhead{
background-color:#CCC;
height:59px;	
}
.opn{
	background-color:#F0F0F0;
}
.headertitle{
width:100%;
font-size:24px;
height:80px;
text-align:right;
direction:rtl;	
}
.headrow{
	float:right;
	width:100%;
}
.headtxttitle{
	font-weight:bold;
	display:inline-block;
	float:right;
	margin:5px;
}
.headtxt{
	display:inline-block;
	float:right;
	margin:5px;
}
.st_itms_row .inpboxtitle {
font-size: 1.1em;	
}
</style>
</head>

<body >
<!---- onUnload="window.navigate('php/logout.php?id=<?php// echo $userID ?>');" header area--->
<div class="headerarea">
<div class="logo"><img src="images/logoMoka_small.png" alt="Moka" width="86" height="40"></div>
<div class="menudiv">
<ul class="setupmenu">
<li><a data-id="3" href="#">مسح قواعد البيانات</a></li>
<li><a data-id="0" href="#">ابدأ اعدادات النظام</a></li>
<li><a data-id="1" href="#">حفظ الاعدادات الحالية</a></li>
<li><a data-id="2" href="#">تحميل الاعدادات المحفوظة</a></li>

<li><a data-id="9" href="applicationmain.php">رجوع</a></li>
</ul>
</div>
<div class="userinfo">
<ul id="logout-ul">
<li class="wecomtop"><?php echo $_SESSION['fullname'] ?></li>
<li><!--<a href="ttapp/editprofilea.php">تعديل البيانات</a><span> | </span>--><a href="php/logout.php?id=<?php echo $_SESSION['user_id'] ?>">تسجيل خروج</a></li>
</ul>
</div>
</div>
<!---------------------------Top Navigation Bar---------------->

<!---------------------------End of top navigation bar------------------>
<div id="frameContainer">
<div id="PageContainer">

<!-------------- Stock control main page screen------------->
<div id="stockpage-container">


<!------------Step 1 Add Stock measurement units----------->
<div class="stockmainbtns-container sub-stock-page st_units_subpage">
<h2>الخطوة الأولى: ادخال وحدات قياس اصناف المخازن</h2>
<div class="frmfieldrow">
<input type="hidden" id="userid" name="userid" value="<?php echo $userID; ?>">
</div>
<div class="frmfieldrow">
<div class="frmfieldrow100">
<div class="inpboxtitle">نقوم في هذه الخطوة بادخال كافة وحدات القياس الخاصة بجميع أصناف المخازن ، ويفضل ادخالها باقل وحدة قياس ، مثلا : جرام ، قطعة ، باكيت، كانز ، مللتر،.... وذلك لاننا سنقوم لاحقا بتحديد الكمية الخاصة بارصدة المخازن وكذلك الكمية المستهلكة في كل صنف في المينيو ، مثلا : كوب القهوة التركي ، يستهلك 10 جرام بن و26 جرام سكر ...</div>
</div>
</div>
<div class="frmfieldrow">
<div class="frmfieldrow50">
<div class="inpboxtitle">اسم وحدة القياس</div>
	<input id="st_itm_qnty_unit_name" type="text" class="inpclass iniResettxt">
</div>
<div class="frmfieldrow50">
	<div class="inpboxtitle">وصف الوحدة</div>
	<input id="st_itm_qnty_unit_desc" type="text" class="inpclass iniResettxt">
</div>
</div>
<div class="frmfieldrow">
<div style="padding:5px;" class="touchbutton beeptwo"><input style="font-size:16px; font-weight:bold;" id="st_itm_qnty_unit_add_btn" type="button" value="اضافة"></div>
</div>
<div class="frmfieldrow">
<div class="frmfieldrow100">
<div class="inpboxtitle ">يظهر هنا البيانات التي قمت بادخالها</div>
</div>
</div>


<div class="frmfieldrow st_itm_qnty_unit_rows">
<div class="frmfieldrow100 st_itm_qnty_unit_row">
<div class="inpboxtitle " style="font-wieght:bold;">الوحدة : </div>
	<div class="inpboxtitle st_itm_qnty_unit_name">جرام</div><div class="inpboxtitle " style="font-wieght:bold;">الوصف  : </div><div class="inpboxtitle st_itm_qnty_unit_desc">جرام = 0.001 كيلوجرام</div><div id="removeStitmUnitbtn" class="inpboxtitle" data-arrid="0" data-arrname=""><img data-arrid="0" align="middle" class="ingr_remove" src="images/del24.png" ></div>
</div>

</div>

<div class="frmfieldrow">
<div style="padding:5px;" class="touchbutton beeptwo"><input style="font-size:16px; font-weight:bold;" id="saveGotoStep2" type="button" value="حفظ - الانتقال الى الخطوة 2"></div>
</div>


</div>
<!------------end step 1----------->

<!------------Step 2 Add Stock Items Row materials----------->
<div class="stockmainbtns-container sub-stock-page st_items_subpage">
<h2>الخطوة الثانية: ادخال اصناف خامات التحضير</h2>
<div class="frmfieldrow">
<input type="hidden" id="userid" name="userid" value="<?php echo $userID; ?>">
</div>
<div class="frmfieldrow">
<div class="frmfieldrow100">
<div class="inpboxtitle">في هذه الخطوة نقوم بادخال كافة الاصناف الى المخازن والتي تستخدم في تحضير اصناف البيع (اصناف المينيو) مثل : البن ، البن المحوج ، السكر ، المعسل ، البيبسي الكانز وغيرها حيث تعتبر هذه الاصناف هي خامات التحضير ، ويجب اختيار وحدة القياس لكل صنف حسب استخدامه في التحضير مثل : بالقطعة او بالجرام او خلافه</div>
</div>
</div>

<div class="frmfieldrow">
<div class="frmfieldrow50">
	<div class="inpboxtitle">اسم الصنف (مختصر) : </div>
	<input id="itm_shortname" type="text" class="inpclass iniResettxt" maxlength="20">
</div>
<div class="frmfieldrow50">
	<div class="inpboxtitle">الاسم الكامل للصنف : </div>
	<input id="itm_longname" type="text"  class="inpclass iniResettxt">
</div>
</div>

<div class="frmfieldrow">
<div class="frmfieldrow50">
	<div class="inpboxtitle">وصف الصنف</div>
	<input id="itm_data" type="text" class="inpclass iniResettxt">
</div>
<div class="frmfieldrow50">
	<div class="inpboxtitle">ملاحظات : </div>
	<input id="itm_notes" type="text" class="inpclass iniResettxt" >
</div>
</div>

<div class="frmfieldrow">
<div class="frmfieldrow50">
	<div class="inpboxtitle">نوع الصنف</div>
	<div class="dropdownlistcss">
  <select id="itm_type_dd" class="dropdownlistcss initialize">
  </select>
</div>

</div>
<div class="frmfieldrow50">
	<div class="inpboxtitle"> </div>
	<div id="itm_type_desc" class="infobox"></div>
	
   </div>
</div>

<div class="frmfieldrow">
<div class="frmfieldrow50">
<div class="inpboxtitle">اقل وحدة لقياس الصنف</div>
    <div class="dropdownlistcss">
  <select id="unit_measure" class="dropdownlistcss initialize">
    <option value="0">اختر وحدة القياس</option>
  </select>
</div>
</div>
<div class="frmfieldrow50">
	<div class="inpboxtitle">الحد الأدنى من الصنف : </div>
    <input id="itm_limit" type="text" class="inpboxtitle iniResettxt" onkeypress='validate_isNum(event)'>
</div>
</div>
<div class="frmfieldrow">
<div style="padding:5px;" class="touchbutton beeptwo"><input style="font-size:16px; font-weight:bold;" id="st_itm_add_btn" type="button" value="اضافة"></div>
</div>
<div class="frmfieldrow">
<div class="frmfieldrow100">
<div class="inpboxtitle ">يظهر هنا البيانات التي قمت بادخالها</div>
</div>
</div>

<div class="frmfieldrow st_itms_rows">
<div class="frmfieldrow100 st_itms_row">
<div class="inpboxtitle " style="font-wieght:bold;">كود:</div>
	<div class="inpboxtitle st_itm_qnty_unit_name">0</div>
<div class="inpboxtitle " style="font-wieght:bold;">اسم الصنف:</div>
	<div class="inpboxtitle st_itm_qnty_unit_name">لبن سايب</div>
    <div class="inpboxtitle " style="font-wieght:bold;">الاسم الكامل:</div>
    <div class="inpboxtitle st_itm_qnty_unit_desc">لبن طبيعي سايب</div>
    <div class="inpboxtitle " style="font-wieght:bold;">نوع الصنف:</div>
    <div class="inpboxtitle st_itm_qnty_unit_desc">خامات تحضير</div>
    <div class="inpboxtitle " style="font-wieght:bold;">الحد الأدنى:</div>
    <div class="inpboxtitle st_itm_qnty_unit_desc">2000</div>
    <div class="inpboxtitle " style="font-wieght:bold;">الوحدة:</div>
    <div class="inpboxtitle st_itm_qnty_unit_desc">مللتر</div>
    <div class="inpboxtitle " style="font-wieght:bold;">تفاصيل:</div>
    <div class="inpboxtitle st_itm_qnty_unit_desc"></div>
    <div id="removeStitmUnitbtn" class="inpboxtitle" data-arrid="0" data-arrname=""><img data-arrid="0" align="middle" class="ingr_remove" src="images/del24.png" ></div>
</div>
<div class="frmfieldrow100 st_itms_row">
<div class="inpboxtitle " style="font-wieght:bold;">كود:</div>
	<div class="inpboxtitle st_itm_qnty_unit_name">0</div>
<div class="inpboxtitle " style="font-wieght:bold;">اسم الصنف:</div>
	<div class="inpboxtitle st_itm_qnty_unit_name">لبن سايب</div>
    <div class="inpboxtitle " style="font-wieght:bold;">الاسم الكامل:</div>
    <div class="inpboxtitle st_itm_qnty_unit_desc">لبن طبيعي سايب</div>
    <div class="inpboxtitle " style="font-wieght:bold;">نوع الصنف:</div>
    <div class="inpboxtitle st_itm_qnty_unit_desc">خامات تحضير</div>
    <div class="inpboxtitle " style="font-wieght:bold;">الحد الأدنى:</div>
    <div class="inpboxtitle st_itm_qnty_unit_desc">2000</div>
    <div class="inpboxtitle " style="font-wieght:bold;">الوحدة:</div>
    <div class="inpboxtitle st_itm_qnty_unit_desc">مللتر</div>
    <div class="inpboxtitle " style="font-wieght:bold;">تفاصيل:</div>
    <div class="inpboxtitle st_itm_qnty_unit_desc"></div>
    <div id="removeStitmUnitbtn" class="inpboxtitle" data-arrid="0" data-arrname=""><img data-arrid="0" align="middle" class="ingr_remove" src="images/del24.png" ></div>
</div>

</div>

<div class="frmfieldrow">
<div style="padding:5px;" class="touchbutton beeptwo"><input style="font-size:16px; font-weight:bold;" id="saveGotoStep3" type="button" value="حفظ - الانتقال الى الخطوة 3"></div>
</div>


</div>
<!------------end step 2----------->



<!------------------add/buy stock item sub page -------->
<div class="stockmainbtns-container sub-stock-page st_buy_subpage">
<h2>شاشة شراء صنف جديد للمخزن</h2>
<div class="frmfieldrow">
<div class="inpboxtitle">بيانات شراء-اضافة الصنف</div>
</div>
<div class="frmfieldrow">
<div class="frmfieldrow50">
	<div class="inpboxtitle">صنف جديد او مسجل </div>
    <div id="stock_new_old" class="dropdownlistcss-jsx"></div>
</div>
</div>

<div class="frmfieldrow">
<div class="frmfieldrow50 existingitem">
	<div class="inpboxtitle">اختر الصنف : </div>
   <input type="hidden" id="userid" name="userid" value="<?php echo $userID ?>"> 
    
<div class="dropdownlistcss">
  <select id="stock_itms" class="dropdownlistcss initialize">
  </select>
</div>

</div>
<div class="frmfieldrow50 existingitem">
<div class="inpboxtitle st_itm_code"></div>
<div class="inpboxtitle st_itm_rem"></div>
</div>
</div>

<div class="frmfieldrow">
<div class="frmfieldrow50">
	<div class="inpboxtitle">الكمية : </div>
    <input id="st_itm_qnty" type="text" class="inpboxtitle iniResettxt" onkeypress='validate_isNum(event)'>
    <div class="dropdownlistcss">
  <select id="unit_measure" class="dropdownlistcss initialize">
    <option value="0">اختر وحدة القياس</option>
  </select>
</div>
</div>
<div class="frmfieldrow50">
	<div class="inpboxtitle">سعر الشراء : </div>
    <input id="itm_price" type="text" class="inpboxtitle iniResettxt" onkeypress='validate_isNum(event)'>
    <div class="inpboxtitle">جنيه </div>
</div>
</div>

<div class="frmfieldrow">
<div class="frmfieldrow50">
	<div class="inpboxtitle">نوع الصنف</div>
	<div class="dropdownlistcss">
  <select id="st_itm_type" class="dropdownlistcss initialize">
  </select>
</div>
</div>
<div class="frmfieldrow50">
	<div class="inpboxtitle">ملاحظات :</div>
	<div id="itm_type_desc" class="infobox"></div>
	
   </div>
</div>

<div class="frmfieldrow">
<div class="frmfieldrow50">
	<div class="inpboxtitle">اضف الى المخزن : </div>
    <div class="dropdownlistcss">
  <select id="stock_names" class="dropdownlistcss initialize">
    
  </select>
</div>
    
</div>
<div class="frmfieldrow50">
	<div class="inpboxtitle">المشتري : </div>
    <div class="dropdownlistcss">
  <select id="stock_buyer" class="dropdownlistcss initialize">
  </select>
</div>
</div>
</div>

<div class="newitmesonly">
<div class="frmfieldrow " >
<div class="inpboxtitle">بيانات صنف جديد</div>
</div>

<div class="frmfieldrow">
<div class="frmfieldrow50">
	<div class="inpboxtitle">كود الصنف : </div>
    <div id="item-code" class="inpboxtitle">5455</div>
</div>
</div>

<div class="frmfieldrow">
<div class="frmfieldrow50">
	<div class="inpboxtitle">اسم الصنف (مختصر) : </div>
	<input id="itm_sname" type="text" class="inpclass iniResettxt" maxlength="20">
</div>
<div class="frmfieldrow50">
	<div class="inpboxtitle">الاسم الكامل للصنف : </div>
	<input id="itm_lname" type="text"  class="inpclass iniResettxt">
</div>
</div>

<div class="frmfieldrow">
<div class="frmfieldrow50">
	<div class="inpboxtitle">وصف الصنف</div>
	<input id="itm_desc" type="text" class="inpclass iniResettxt">
</div>
<div class="frmfieldrow50">
	<div class="inpboxtitle">ملاحظات : </div>
	<input id="itm_notes" type="text" class="inpclass iniResettxt" >
</div>
</div>

</div>
<div class="frmfieldrow">
<div style="padding:5px;" class="touchbutton beeptwo"><input style="font-size:16px; font-weight:bold;" id="save-new-st-itm" type="button" value="حفظ / اضافة"></div>
</div>
</div>
<!------stock limits set and get -------------- sub page------->
<div class="stockmainbtns-container sub-stock-page st_limits_subpage">
<h2>شاشة الحد الأدنى من مخزون الأصناف</h2>
<div class="frmfieldrow">
<input type="hidden" id="userid" name="userid" value="<?php echo $userID; ?>">
</div>
<div class="frmfieldrow">
<div class="frmfieldrow50">
	<div class="inpboxtitle">تحديد الحد الأدنى من الصنف</div>
    <select id="stock_itms_limits" class="dropdownlistcss initialize"></select>
</div>
<div class="frmfieldrow50">
	<div class="inpboxtitle  st_itm_code_limits"></div>
    <div class="inpboxtitle  st_itm_rem_limits"></div>
</div>
</div>

<div class="frmfieldrow">
<div class="frmfieldrow100 itemlimitinfo">
</div>
</div>


<div class="frmfieldrow">
<div class="frmfieldrow50">
	<div class="inpboxtitle">الحد الأدنى من الصنف</div>
	<input id="itm_limits_qnty" type="text" class="inpclass iniResettxt" onkeypress='validate_isNum(event)'>
</div>
<div class="frmfieldrow50">
	<div class="inpboxtitle  st_itm_limits_unit" data-value=0></div>
	
   </div>
</div>
<div class="frmfieldrow">
<div style="padding:5px;" class="touchbutton beeptwo"><input style="font-size:16px; font-weight:bold;" id="limits-st-itm" type="button" value="تسجيل الحد الأدنى"></div>
</div>


</div>
<!----------------------------->

<!------stock reports -------------- sub page------->
<div class="stockmainbtns-container sub-stock-page st_reports_subpage">
<h2>شاشة تقارير المخازن</h2>
<div class="frmfieldrow">
<input type="hidden" id="userid" name="userid" value="<?php echo $userID; ?>">
</div>
<div class="frmfieldrow">
<div class="frmfieldrow50">
<div style="padding:5px;" class="touchbutton beeptwo"><input style="font-size:16px; font-weight:bold;" class="fullstockreport" type="button" value="تقارير مخازن شاملة"></div>
</div>
<div class="frmfieldrow50">
<div style="padding:5px;" class="touchbutton beeptwo"><input style="font-size:16px; font-weight:bold;" class="stockitemssales" type="button" value="تقرير مبيعات الأصناف"></div>
</div>
</div>
<div class="allstreports">
<div class="frmfieldrow">
<div class="frmfieldrow50">
<div class="inpboxtitle">اختر نوع بيانات التقرير</div>
<div class="dropdownlistcss">
  <select id="reptype_dd" class="dropdownlistcss">
    <option value="0">الكل</option>
	<option value="1">المباع</option>
	<option value="2">التالف</option>
	<option value="3">مشتريات</option>
    <option value="4">تحويل ارصدة</option>
  </select>
</div>
</div>
<div class="frmfieldrow50">
<div class="inpboxtitle">اختر نوع التقرير</div>
<div class="dropdownlistcss">
  <select id="repdatatype_dd" class="dropdownlistcss">
   <!-- <option value="0">تقرير مختصر</option>-->
	<option value="0">تقرير تفصيلي</option>
  </select>
</div>
</div>
</div>


<div class="frmfieldrow">
<div class="frmfieldrow50">
	<div class="inpboxtitle" style="margin-left: 37px;">اختر الصنف</div>
    <div class="dropdownlistcss">
  <select id="stock_itms_rep" class="dropdownlistcss initialize"></select>
</div>
</div>
<div class="frmfieldrow50">
<div class="inpboxtitle">اختر المخزن</div>
<div class="dropdownlistcss">
<select id="stock_names_rep" class="dropdownlistcss initialize"></select>
</div>
</div>
</div>
<div class="frmfieldrow">
<div class="frmfieldrow50">
	<div class="inpboxtitle" style="margin-left: 50px;">اختر الفترة</div>
<div class="dropdownlistcss">
  <select id="repperiod_dd" class="dropdownlistcss">
    <option value="0">حركة اليوم</option>
	<option value="1">حركة الشهر</option>
	<option value="2">حركة فترة</option>
	<option value="3">حركة الكل</option>
  </select>
</div>
</div>
<div class="frmfieldrow50">
<div class="periodfromto">
<div class="inpboxtitle">من : <input type="text" id="rep1periodfrom" class="date_picker"></div>
<div class="inpboxtitle">الى : <input type="text" id="rep1periodto" class="date_picker"></div>
</div>
</div>
</div>
<div class="frmfieldrow">
<div style="padding:5px;" class="touchbutton beeptwo"><input style="font-size:16px; font-weight:bold;" id="showallstockrep" type="button" value="استعرض التقرير"></div>
</div>
</div>
<div class="stocksalesreports">
<div class="frmfieldrow">
<div class="frmfieldrow50">
	<div class="inpboxtitle" style="margin-left: 50px;">اختر الفترة</div>
<div class="dropdownlistcss">
  <select id="repperiod_dd" class="dropdownlistcss">
    <option value="0">حركة اليوم</option>
	<option value="1">حركة الشهر</option>
	<option value="3">حركة فترة</option>
	<option value="4">حركة الكل</option>
  </select>
</div>
</div>
<div class="frmfieldrow50">
<div class="periodfromto">
<div class="inpboxtitle">من : <input type="text" id="rep1periodfrom" class="date_picker"></div>
<div class="inpboxtitle">الى : <input type="text" id="rep1periodto" class="date_picker"></div>
</div>
</div>
</div>
<div class="frmfieldrow">
<div class="frmfieldrow50">
	<div class="inpboxtitle" style="margin-left: 37px;">اختر الصنف</div>
    <div class="dropdownlistcss">
  <select id="stock_itms_rep" class="dropdownlistcss initialize"></select>
</div>
</div>

</div>
<div class="frmfieldrow">
<div style="padding:5px;" class="touchbutton beeptwo"><input style="font-size:16px; font-weight:bold;" id="showsalesstockrep" type="button" value="استعرض التقرير"></div>
</div>
</div>

</div>
<!----------------------------->

<!------stock spoil stock itmes  -------------- sub page------->
<div class="stockmainbtns-container sub-stock-page st_spoil_subpage">
<h2>شاشة تسجيل اصناف تالفة</h2>
<div class="frmfieldrow">
<input type="hidden" id="userid" name="userid" value="<?php echo $userID; ?>">
</div>
<div class="frmfieldrow">
<div class="frmfieldrow50">
	<div class="inpboxtitle">تسجيل تلف صنف</div>
    <select id="stock_itms_spoil" class="dropdownlistcss initialize"></select>
</div>
<div class="frmfieldrow50">
	<div class="inpboxtitle  st_itm_code_spoil"></div>
    <div class="inpboxtitle  st_itm_rem_spoil"></div>
</div>
</div>

<div class="frmfieldrow">
<div class="frmfieldrow50">
	<div class="inpboxtitle">تلف من مخزن : </div>
    <div class="dropdownlistcss"><select id="stock_names_spoil" class="dropdownlistcss initialize"></select></div>
</div>

<div class="frmfieldrow50">
	<div class="inpboxtitle">المتسبب في التلف : </div>
    <div class="dropdownlistcss"> <select id="stock_spoil_prof" class="dropdownlistcss initialize"></select></div>
</div>
</div>


<div class="frmfieldrow">
<div class="frmfieldrow50">
	<div class="inpboxtitle">الكمية التالفة</div>
	<input id="itm_spoil_qnty" type="text" class="inpclass iniResettxt" onkeypress='validate_isNum(event)'>
</div>
<div class="frmfieldrow50">
	<div class="inpboxtitle  st_itm_spoil_unit" data-value=0></div>
	
   </div>
</div>
<div class="frmfieldrow">
<div style="padding:5px;" class="touchbutton beeptwo"><input style="font-size:16px; font-weight:bold;" id="spoil-st-itm" type="button" value="تسجيل تلف الكمية من الصنف"></div>
</div>
</div>
<!----------------------------->

<!------record stock actual balance of itmes  -------------- sub page------->
<div class="stockmainbtns-container sub-stock-page st_recbalance_subpage">
<h2>شاشة تسجيل جرد فعلي للمخزن</h2>
<div class="frmfieldrow">
<input type="hidden" id="userid" name="userid" value="<?php echo $userID; ?>">
</div>
<div class="frmfieldrow">
<div class="frmfieldrow50">
	<div class="inpboxtitle">تسجيل جرد صنف</div>
    <select id="stock_itms_recbal" class="dropdownlistcss initialize"></select>
</div>
<div class="frmfieldrow50">
<div class="inpboxtitle">في مخزن : </div>
    <div class="dropdownlistcss"><select id="stock_names_recbal" class="dropdownlistcss initialize"></select></div>
</div>
</div>

<div class="frmfieldrow">
<div class="frmfieldrow50">
<div class="inpboxtitle">كود الصنف : </div>
	<div class="inpboxtitle  st_itm_code_recbal"></div>
    
	</div>

<div class="frmfieldrow50">
	<div class="inpboxtitle st_name_bal">الرصيد الحالي : </div>
    <div class="inpboxtitle  st_itm_actbalance">6555 جرام</div><div class="inpboxtitle  st_itm_recbal_unit" data-value=0>جرام</div>
</div>
</div>


<div class="frmfieldrow">
<div class="frmfieldrow50">
	<div class="inpboxtitle">الرصيد الفعلي بعد الجرد : </div>
	<input id="itm_recbal_qnty" type="text" class="inpclass iniResettxt" onkeypress='validate_isNum(event)'>
</div>
<div class="frmfieldrow50">
	
	<div class="inpboxtitle  st_itm_difnotes">الفرق بين الرصيد الفعلي والرصيد المحسوب هو : الرصيد الفعلي أكثر من الرصيد المحسوب بكمية 4993 جرام</div>
   </div>
</div>
<div class="frmfieldrow">
<div style="padding:5px;" class="touchbutton beeptwo"><input style="font-size:16px; font-weight:bold;" id="recbal-st-itm" type="button" value="تسجيل الجرد وتصحيح الرصيد"></div>
</div>
</div>
<!----------------------------->

<!---------Transfer items stocks ------------------------ sub page ---------->
<div class="stockmainbtns-container sub-stock-page st_trans_subpage">
<h2>شاشة تحويل/صرف ارصدة اصناف بين المخازن</h2>
<div class="frmfieldrow">
<input type="hidden" id="userid" name="userid" value="<?php echo $userID; ?>">
</div>
<div class="frmfieldrow">
<div class="frmfieldrow50">
	<div class="inpboxtitle">اختر الصنف</div>
    <select id="stock_itms_trans" class="dropdownlistcss initialize"></select>
</div>
<div class="frmfieldrow50">
	<div class="inpboxtitle  st_itm_code_trans"></div>
    <div class="inpboxtitle  st_itm_rem_trans"></div>
</div>
</div>

<div class="frmfieldrow">
<div class="frmfieldrow100 itemstockinfo">
</div>
</div>

<div class="frmfieldrow">
<div class="frmfieldrow50">
	<div class="inpboxtitle">تحويل/صرف رصيد من : </div>
    <div class="dropdownlistcss">
  	<select id="stock_names_from" class="dropdownlistcss initialize"></select>
	</div>
</div>
<div class="frmfieldrow50">
	<div class="inpboxtitle">تحويل/صرف رصيد الى : </div>
    <div class="dropdownlistcss">
  	<select id="stock_names_to" class="dropdownlistcss initialize"></select>
	</div>
</div>
</div>

<div class="frmfieldrow">
<div class="frmfieldrow50">
	<div class="inpboxtitle">الكمية</div>
	<input id="itm_trans_qnty" type="text" class="inpclass iniResettxt" onkeypress='validate_isNum(event)'>
</div>
<div class="frmfieldrow50">
	<div class="inpboxtitle  st_itm_unit" data-value=0></div>
	
   </div>
</div>
<div class="frmfieldrow">
<div style="padding:5px;" class="touchbutton beeptwo"><input style="font-size:16px; font-weight:bold;" id="trans-st-itm" type="button" value="تحويل رصيد"></div>
</div>


</div>

</div>
<!--------------------------------->
<!-------------------stock add sales (ready) items sub page ------------>
<div  class="stockmainbtns-container sub-stock-page st_addsalesitem_subpage">
<h2>شاشة اضافة صنف بيع</h2>
<div class="frmfieldrow">
<div class="frmfieldrow50">
<div class="inpboxtitle">كود الصنف : </div>
    <div id="sales_item-code" class="inpboxtitle">5455</div>
    <input type="hidden" id="userid1" name="userid1" value="<?php echo $userID ;?>"> 
   
</div>
</div>

<div class="frmfieldrow">
<div class="frmfieldrow50">
	<div class="inpboxtitle">اسم الصنف (مختصر) : </div>
	<input id="itm_sales_sname" type="text" class="inpclass iniResettxt" maxlength="20">
</div>
<div class="frmfieldrow50">
	<div class="inpboxtitle">الاسم الكامل للصنف : </div>
	<input id="itm_sales_lname" type="text"  class="inpclass iniResettxt">
</div>
</div>

<div class="frmfieldrow">
<div class="frmfieldrow50">
	<div class="inpboxtitle">وصف الصنف</div>
	<input id="itm_sales_desc" type="text" class="inpclass iniResettxt">
</div>
<div class="frmfieldrow50">
	<div class="inpboxtitle">التصنيف</div>
	<select id="itm_typ4_group" class="dropdownlistcss initialize">
	</select>
</div>
</div>

<div class="frmfieldrow">
<div class="frmfieldrow50">
	<div class="inpboxtitle">سعر البيع : </div>
     <input id="itm_sales_price" type="text" class="inpboxtitle iniResettxt" onkeypress='validate_isNum(event)'>
    <div class="inpboxtitle">جنيه </div>
</div>
</div>

<div class="frmfieldrow">
<div class="frmfieldrow50">
	<div class="inpboxtitle">اضف مكونات الصنف من اصناف الخامات</div>
</div>
</div>

<div class="frmfieldrow">
<div class="frmfieldrow100">
<div class="dropdownlistcss">
  <select id="stock_row_itms" class="dropdownlistcss initialize">
  </select>
</div>
<div class="inpboxtitle">الكمية : </div>
    <input id="st_row_itm_qnty" type="text" class="inpboxtitle iniResettxt" onkeypress='validate_isNum(event)'>
    <div class="dropdownlistcss">
  <select id="unit_measure_row" class="dropdownlistcss initialize">
  </select></div>
<div id="addrowitem" class="inpboxtitle"><img align="middle" src="images/add30.png"/></div>
</div>
</div>

<div class="frmfieldrow">
<div class="frmfieldrow50">
	<div class="inpboxtitle">عرض وتعديل مكونات صنف البيع </div>
</div>
</div>

<div class="frmfieldrow">
<!-------- ingradients items teable---->
<div class="frmfieldrow50">

<div class="ingr_table">

<div class="ingr_tbl_head">
<div class="ingr_name_col ingr_row_col">اسم الصنف</div>
<div class="ingr_qunt_col ingr_row_col">الكمية</div>
<div class="ingr_cost_col ingr_row_col">التكلفة - جنيه</div>
<div class="ingr_controls_col ingr_row_col">حذف </div>
</div>

<div id="ingr_tbl_datarows">

</div>
<div class="ingr_tbl_row ingr_id_1">
<div class="ingr_name_col ingr_row_col"><div  class="ingr_name" >الاجمالي</div></div>
<div class="ingr_qunt_col ingr_row_col"><div id="ing_qnty_1" class="ingr_qunty" ></div></div>
<div class="ingr_cost_col ingr_row_col"><div id="ing_cost_1" class="ingr_cost" ></div></div>
<div class="ingr_controls_col ingr_row_col"><div class="ingr_removes" ></div>
</div>

</div><!-----end of ingr tbl datarows-->

</div><!-----end of ingr tbl-->

</div>
</div>
<div class="frmfieldrow">
<div style="padding:5px;" class="touchbutton beeptwo"><input style="font-size:16px; font-weight:bold;" id="save-sales-st-itm" type="button" value="حفظ / اضافة"></div>
</div>
</div>
<!---------------------------------------------------------->
<?php
/////////// check user permisssion to show/ allow application sections
}else{
	//echo $accCashierpage."  ". $userPermission  ;	
showpermissionerrmsg(0);	// show the permission err msg
}
?>
</div>
<!------------------------end of stock control main page screen---->
<!----------------------------------------------------------------------->


</div><!------Page Container End (End of all pages ----->
</div>
<div class="clear"></div>
<div id ="footerbar">
<div class="copyrighthome"><div class="social"><a target="_blank" href='https://www.facebook.com/mokacafeegypt'><img src="images/icons/facebook.png" class="socialIcon" alt=""></a><a href='#'><img src="images/icons/Twitter.png" class="socialIcon" alt=""></a><a href='#'><img src="images/icons/email.png" class="socialIcon" alt=""></a></div>
جميع الحقوق محفوظة © 2014  <a href="http://makkcg.com" target="_blank">موكا كافيه بواسطة م. محمد خليفة</a>
</div>
<!--------------end of copyright and footer ---------->
<!--<div class="copyrighthome">
All Rights Reserved. Copyright © 2014 <a href="http://makkcg.com" target="_blank">Moka Cafe by Eng. Mohammed Khalifa</a>
</div>-->
</div>
</body>
</html>
<?php
}else{
echo "<META HTTP-EQUIV=\"refresh\" CONTENT=\"0; URL=index.php#login_form\"> ";
exit;
die();	
}
?>>>>>>>>