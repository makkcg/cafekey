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

if($_SESSION['accAccountpage']){
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
<link rel="stylesheet" type="text/css" href="css/appmains.css" />
 <link rel="stylesheet" type="text/css" href="css/accounting.css" />
 
 <script type="text/javascript" src="js/appmains.js"></script>
  <script type="text/javascript" src="js/acc_func.js"></script>
     <script type="application/javascript" >
document.loggedinuserid=parseInt('<?php echo $userID; ?>');
document.loggedinusername=('<?php echo $_SESSION['fullname'];?>');
</script>
</head>

<body>
<!---- header area--->
<div class="headerarea">
<div class="logo"><img src="images/logoMoka_small.png" alt="Moka" width="86" height="40"></div>
<div class="menudiv">
<ul class="accmenu">
<li><a data-id="7" href="#">ملخص</a></li>
<li><a data-id="1" href="#">بيانات الحسابات</a></li>
<li><a data-id="2" href="#">بيانات عاملين</a></li>
<li><a data-id="3" href="#">تسجيل مصروفات</a></li>
<li><a data-id="4" href="#">تسجيل ايرادات</a></li>
<li><a data-id="5" href="#">بيانات الفواتير</a></li>
<li><a data-id="6" href="#">تقارير</a></li>
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
<!---sound control div---->

<div style="display:none;">
<audio id="beep-one" controls="controls" preload="auto">
				<source src="audio/beep.mp3"></source>
				<source src="audio/beep.ogg"></source>
				Your browser isn't invited for super fun time.
</audio>
<audio id="beep-two" controls="controls" preload="auto">
				<source src="audio/beep2.mp3"></source>
				<source src="audio/beep2.ogg"></source>
				Your browser isn't invited for super fun time.
</audio>
<audio id="beep-3" controls="controls" preload="auto">
				<source src="audio/beep1.mp3"></source>
				<source src="audio/beep1.ogg"></source>
				Your browser isn't invited for super fun time.
</audio>
</div>
<!-----------end of sound control--->
<!-------------- Accounting main page screen------------->
<div id="accountpage-container1">
<!--Dashboard section sub page----------------->
<div id="accmainbtns-container"  class="sub-sub-page-container sub-sub-acc-div dashboarddiv">
<!----day dashboard--->
<div ><a href="#" class="button blue refreshdash">تحديث البيانات</a></div>
<div class="containersec">
<div style="font-size:22px;font-weight:bold;">ملخص حسابات اليوم</div>
</div>
<div style="width:100%; height:45px;margin-right:7px;">
<div class="dashitmhead">ايرادات اليوم</div>
<div class="dashitmhead">مبيعات اليوم</div>
<div class="dashitmhead">مبيعات آجل</div>
<div class="dashitmhead">مصروفات اليوم</div>
<div class="dashitmhead">مشتريات اليوم</div>
<div class="dashitmhead" style="font-size: 16px;font-weight: bold;">مصروفات من شركاء</div>
<div class="dashitmhead"></div>
<div class="dashitmhead"></div>
</div>
<div style="width:100%; height:45px;margin-right:7px;" class="daydashboard">
<div class="dashitmhead dashitembox daycash">545</div>
<div class="dashitmhead dashitembox daysales">645</div>
<div class="dashitmhead dashitembox daycredit">100</div>
<div class="dashitmhead dashitembox dayexp">150</div>
<div class="dashitmhead dashitembox daypurch">800</div>
<div class="dashitmhead dashitembox dayexppart">500</div>
<div class="dashitmhead"></div>
<div class="dashitmhead"></div>
</div>
<!------month dashboard---->
<div class="containersec">
<div style="font-size:22px;font-weight:bold;">ملخص حسابات الشهر</div>
</div>
<div style="width:100%; height:45px;margin-right:7px;">
<div class="dashitmhead">ايرادات الشهر</div>
<div class="dashitmhead">مبيعات الشهر</div>
<div class="dashitmhead">مبيعات آجل</div>
<div class="dashitmhead">مصروفات الشهر</div>
<div class="dashitmhead">مشتريات الشهر</div>
<div class="dashitmhead" style="font-size: 16px;font-weight: bold;">مصروفات من شركاء</div>
<div class="dashitmhead"></div>
<div class="dashitmhead"></div>
</div>
<div style="width:100%; height:45px;margin-right:7px;" class="daydashboard">
<div class="dashitmhead dashitembox monthcash">5450</div>
<div class="dashitmhead dashitembox monthsales">6450</div>
<div class="dashitmhead dashitembox monthcredit">1000</div>
<div class="dashitmhead dashitembox monthexp">1500</div>
<div class="dashitmhead dashitembox monthpurch">8000</div>
<div class="dashitmhead dashitembox monthexppart">544</div>
<div class="dashitmhead"></div>
<div class="dashitmhead"></div>
</div>
</div>
<!--end of dashboard section sub page----------------->

<!---- view and search for invoices and orders sub page--->
<div id="acc_viewinvoices-container" class="sub-stock-page sub-sub-page-container sub-sub-acc-div" style="display: block;">
<h2>شاشة استعراض فواتير واوردرات</h2>
<div class="frmfieldrow">
<div class="frmfieldrow50">
	<div class="inpboxtitle">اختر البحث عن </div>
    <div class="dropdownlistcss">
  <select id="inv_search_typ_dd" class="dropdownlistcss">
    <option value="0">جميع فواتير اليوم</option>
    <option value="1">جميع فواتير الشهر</option>
    <option value="2">جميع فواتير فترة</option>
    <option value="3">رقم فاتورة</option>
    <option value="4">رقم أوردر</option>
	</select>
</div>
</div>

<div class="frmfieldrow50 inv_search_info" style="display:none">
<div class="inpboxtitle inv_search_infotxt">معلومات</div>
</div>

<div class="frmfieldrow50 order_search_no" style="display:none">
<div class="inpboxtitle">ادخل رقم الأوردر</div>
<input id="search_order_no" type="text" class="inpboxtitle iniResettxt" onkeypress='validate_isNum(event)'>
</div>

<div class="frmfieldrow50 inv_search_no" style="display:none">
<div class="inpboxtitle">ادخل رقم الفاتورة</div>
<input id="search_inv_no" type="text" class="inpboxtitle iniResettxt" onkeypress='validate_isNum(event)'>
</div>

<div class="frmfieldrow50 inv_search_between" style="display:none">
<div class="inpboxtitle">الفترة من <input type="text" id="invsearchfrom_datepick"></div>

<div class="inpboxtitle"> الى <input type="text" id="invsearchto_datepick"></div>

</div>
</div>
<div class="frmfieldrow">
<div  class="accsubmitbtn beeptwo" style="padding:5px;"><input style="font-size:16px; font-weight:bold;" id="search_invs_btn" type="button" value="بحث/استعراض"></div>
</div>
<!----show search results here---->
<div class="frmfieldrow invsearchtable" id="invsearchtable">
<div class="restablerow" style="margin-top:10px;">
<div class="searchres_col1 searchrescol searchreshead">م</div><div class="searchres_col2 searchrescol searchreshead">رقم الفاتورة</div><div class="searchres_col3 searchrescol searchreshead">رقم الاوردر</div><div class="searchres_col4 searchrescol searchreshead">التاريخ</div><div class="searchres_col5 searchrescol searchreshead">القيمة</div><div class="searchres_col6 searchrescol searchreshead">فواتير فرعية</div><div class="searchres_col8 searchrescol searchreshead">حالة الدفع</div><div class="searchres_col7 searchrescol searchreshead">استعرض</div>
</div>
<div class="invrestablerow searchresultsrows">
<div class="searchres_col1 searchrescol">1</div><div class="searchres_col2 searchrescol">250</div><div class="searchres_col3 searchrescol">241</div><div class="searchres_col4 searchrescol">14-01-2015</div><div class="searchres_col5 searchrescol">58.58</div><div class="searchres_col6 searchrescol">1</div><div class="searchres_col8 searchrescol">مدفوعة</div><div class="searchres_col7 searchrescol"><a class="resshowitm" data-clickid="1" href="#">عرض</a></div>
</div>
<div class="restablerow emptysearch" style="display:none;">
<div style="font-size:18px;padding:10px;">......لايوجد نتائج......</div>
</div>

</div>
<div class="frmfieldrow showallinv">
<div  class="accsubmitbtn beeptwo" style="padding:5px;"><input style="font-size:16px; font-weight:bold;" id="showall_inv_btn" type="button" value="استعراض كافة الفواتير"></div>
</div>
</div>
<!---------------End of search invoices sub page--------------------------->
<!--------staff operations sub page sub screen------------>
<div id="acc_staff-container" class="sub-stock-page sub-sub-page-container sub-sub-acc-div" style="display: block;">
<h2>شاشة تسجيل عمليات حسابات العاملين</h2>
</div>
<!-------End of staff operations sub screen sub page-->
<!--------accounting report sub screen------------>
<div id="acc_rep_page" class="sub-stock-page sub-sub-page-container sub-sub-acc-div" style="display: block;">
<h2>شاشة تقارير الحسابات</h2>
<div class="frmfieldrow">
<div class="frmfieldrow100">
<input class="button green reports_btns" data-id="1" style="font-size:18px; font-weight:bold;color:#FFF;float:right; width:225px;" id="incsales_rep_btn" type="button" value="تقرير الايرادات والمبيعات">
<input class="button green reports_btns" data-id="2" style="font-size:18px; font-weight:bold;color:#FFF;float:right; width:225px;" id="itmsales_rep_btn" type="button" value="تقرير مبيعات الأصناف">
<input class="button orange reports_btns" data-id="3" style="font-size:18px; font-weight:bold;color:#FFF;float:right; width:225px;" id="exp_rep_btn" type="button" value="تقرير المصروفات">
<input class="button orange reports_btns" data-id="4" style="font-size:18px; font-weight:bold;color:#FFF;float:right; width:225px;" id="purch_rep_btn" type="button" value="تقرير المشتريات">
</div>
</div>
<div class="frmfieldrow">
<div class="frmfieldrow100">
<input class="button blue reports_btns" data-id="5" style="font-size:18px; font-weight:bold;color:#FFF;float:right; width:470px;" id="cash_rep_btn" type="button" value="تقرير حركة الخزينة">
<input class="button blue reports_btns" data-id="6" style="font-size:18px; font-weight:bold;color:#FFF;float:right; width:470px;" id="profbalance_rep_btn" type="button" value="كشوفات الحساب">
</div>
</div>
</div>
<!--------END accounting report sub screen------------>
<!------------Accounting Screen Sub Sub Pages--------->
<!----------Cash mov report------------>
<div id="acc_safe-container" class="sub-stock-page acc-rep-sub sub-sub-page-container sub-sub-acc-div" style="display: block;">
<h2>شاشة حسابات الصندوق (الخزينة)</h2>
<div class="frmfieldrow">

<div class="frmfieldrow50">
<div class="descr">اختر الفترة :</div>
<div class="dropdownlistcss">
  <select id="safereptyp_dd" class="dropdownlistcss">
    <option value="0">حركة الخزينة اليوم</option>
	<option value="1">حركة الخزينة الشهر</option>
	<option value="3">حركة الخزينة فترة</option>
	<option value="4">حركة الخزينة الكل</option>
  </select>
</div>

<div class="descr"><button id="showsafemovrep">استعرض التقرير</button></div>

</div>
<div id="datediv" class="frmfieldrow50">
<div class="descr">من : <input type="text" id="cashrepfrom_datepick"></div>
<div class="descr">الى : <input type="text" id="cashrepto_datepick"></div>

</div>

</div>
<div id="safemovtblreport">

<div class="reptblcontainer">
<div class="rephead">
<div class="repheadtxt">كشف حركة الخزينة فترة من <div id="cashreportfrom" style="display:inline;"></div> الى <div style="display:inline;" id="cashreportto"></div></div>
</div>

<div class="reprighttbl">
<div class="subtblhead">المقبوضات</div>

<div class="righttblrowh">
<div class="repsubcol1">م</div>
<div class="repsubcol2">البيان</div>
<div class="repsubcol3">تاريخ</div>
<div class="repsubcol4">القيمة</div>
</div>

<div id="insafemovs">
<div class="righttblrow">
<div class="repsubcol1">1</div>
<div class="repsubcol2">فاتورة رقم سيبسيبسيبسي </div>
<div class="repsubcol3">2014/09/24</div>
<div class="repsubcol4">15.54</div>
</div>

<div class="righttblrow">
<div class="repsubcol1">2</div>
<div class="repsubcol2">فاتورة رقم سيبسيبسيبسي </div>
<div class="repsubcol3">2014/09/24</div>
<div class="repsubcol4">15.54</div>
</div>

</div>
</div>
<div class="replefttbl">
<div class="subtblhead">المدفوعات</div>

<div class="lefttblrowh">
<div class="repsubcol1">م</div>
<div class="repsubcol2">البيان</div>
<div class="repsubcol3">تاريخ</div>
<div class="repsubcol4">القيمة</div>
</div>

<div id="outsafemovs">
<div class="lefttblrow">
<div class="repsubcol1">1</div>
<div class="repsubcol2">مشتريات 300 جرام رصيد مخزن من صنف السكر للمخزن الرئيسي</div>
<div class="repsubcol3">2014/09/21</div>
<div class="repsubcol4">140</div>
</div>

<div class="lefttblrow">
<div class="repsubcol1">2</div>
<div class="repsubcol2">مشتريات 300 جرام رصيد مخزن من صنف السكر للمخزن الرئيسي</div>
<div class="repsubcol3">2014/09/21</div>
<div class="repsubcol4">140</div>
</div>
</div>
</div>
<div class="repheadsum">

<div class="reprighttbl">
<div class="righttblrowh">
<div class="repsubcol1"></div>
<div class="repsubcol2">اجمالي المقبوضات</div>
<div class="repsubcol3"></div>
<div id="incashtotal" class="repsubcol4">50</div>
</div>
</div>

<div class="replefttbl">
<div class="lefttblrowh">
<div class="repsubcol1"></div>
<div class="repsubcol2">اجمالي المدفوعات</div>
<div class="repsubcol3"></div>
<div id="outcashtotal" class="repsubcol4">280</div>
</div>
</div>
</div>
<div class="repheadtotal">
<div id="balanceindat" class="repheadtxt">رصيد الخزينة في 2014/9/25</div>
<div id="cashbalance" class="repheadtxt">25455</div>
<div class="repheadtxt">جنيه</div>
</div>

</div>

</div><!-- report table---end--->
<div class="descr"><button id="printsafemovrep">طباعة التقرير</button></div>
</div>
<!-----End of cash mov report----------->
<!----------Sales and Income report------------>
<div id="acc_income-container" class="sub-stock-page acc-rep-sub sub-sub-page-container sub-sub-acc-div" style="display: block;">
<h2>شاشة تقرير الايرادات والمبيعات</h2>

<div class="frmfieldrow">

<div class="frmfieldrow50">
<div class="inpboxtitle">اختر الفترة :</div>
<div class="dropdownlistcss">
  <select id="salesreptyp_dd" class="dropdownlistcss">
    <option value="0">ايرادات ومبيعات اليوم</option>
	<option value="1">ايرادات ومبيعات الشهر</option>
	<option value="3">ايرادات ومبيعات فترة</option>
	<option value="4">ايرادات ومبيعات الكل</option>
  </select>
</div>
</div>
<div id="salesdatediv" class="frmfieldrow50">
<div class="inpboxtitle">من : <input type="text" id="salesrepfrom_datepick"></div>
<div class="inpboxtitle">الى : <input type="text" id="salesrepto_datepick"></div>
</div>
</div>

<div class="frmfieldrow">
<div class="inpboxtitle"><button id="showsalesrep" class="button">استعرض التقرير</button></div>
</div>
<div id="salestblreport">

<div class="reptblcontainer">
<div class="rephead">
<div class="repheadtxt">كشف المبيعات والايرادات فترة من <div id="salesreportfrom" style="display:inline;"></div> الى <div style="display:inline;" id="salesreportto"></div></div>
</div>

<div class="reprighttbl">
<div class="subtblhead">المبيعات</div>

<div class="righttblrowh">
<div class="repsubcol1">م</div>
<div class="repsubcol2">البيان</div>
<div class="repsubcol3">تاريخ</div>
<div class="repsubcol4">القيمة</div>
</div>

<div id="salesreprows">
<div class="righttblrow">
<div class="repsubcol1">1</div>
<div class="repsubcol2">فاتورة رقم14  </div>
<div class="repsubcol3">2014/09/24</div>
<div class="repsubcol4">12.5</div>
</div>

<div class="righttblrow">
<div class="repsubcol1">2</div>
<div class="repsubcol2">فاتورة رقم 25 </div>
<div class="repsubcol3">2014/09/24</div>
<div class="repsubcol4">18.5</div>
</div>
<div class="righttblrow unpaidrow">
<div class="repsubcol1">3</div>
<div class="repsubcol2">فاتورة رقم 28 </div>
<div class="repsubcol3">2014/09/24</div>
<div class="repsubcol4">18.5</div>
</div>

</div>
</div>
<div class="replefttbl">
<div class="subtblhead">الايرادات المتنوعة</div>

<div class="lefttblrowh">
<div class="repsubcol1">م</div>
<div class="repsubcol2">البيان</div>
<div class="repsubcol3">تاريخ</div>
<div class="repsubcol4">القيمة</div>
</div>

<div id="varincomerows">
<div class="lefttblrow">
<div class="repsubcol1">1</div>
<div class="repsubcol2">مردودات مشتريات صنف عصير مانجو 5 كيلو للمورد</div>
<div class="repsubcol3">2014/09/21</div>
<div class="repsubcol4">100</div>
</div>

<div class="lefttblrow">
<div class="repsubcol1">2</div>
<div class="repsubcol2">تبس من عميل</div>
<div class="repsubcol3">2014/09/21</div>
<div class="repsubcol4">100</div>
</div>
</div>
</div>
<div class="repheadsum">

<div class="reprighttbl">
<div class="righttblrowh">
<div class="repsubcol1"></div>
<div class="repsubcol2">اجمالي المبيعات المحصلة</div>
<div class="repsubcol3"></div>
<div id="paidsalestot" class="repsubcol4">21</div>
</div>
</div>


<div class="replefttbl">
<div class="lefttblrowh">
<div class="repsubcol1"></div>
<div class="repsubcol2">اجمالي الايرادات المتنوعة</div>
<div class="repsubcol3"></div>
<div id="varincometot" class="repsubcol4">200</div>
</div>
</div>

</div>
<div class="repheadsum">

<div class="reprighttbl">
<div class="righttblrowh unpaidrow">
<div class="repsubcol1"></div>
<div class="repsubcol2">اجمالي المبيعات الغير محصلة</div>
<div class="repsubcol3"></div>
<div id="unpaidsalestot" class="repsubcol4">18.5</div>
</div>
</div>


</div>
<div class="repheadsum">

<div class="reprighttbl">
<div class="righttblrowh">
<div class="repsubcol1"></div>
<div class="repsubcol2">اجمالي المبيعات</div>
<div class="repsubcol3"></div>
<div id="salestot" class="repsubcol4">39.5</div>
</div>
</div>


</div>

<div class="repheadtotal">
<div id="salesbalancedat" class="repheadtxt">اجمالي المبيعات والايرادات المتنوعة  في 2014/9/25</div>
<div id="grandsalestot" class="repheadtxt">239.5</div>
<div class="repheadtxt">جنيه</div>
</div>

</div>


</div><!-- report table---end--->
<div class="descr"><button id="printsalesrep">طباعة التقرير</button></div>

</div>
<!----------End of sales and Income report------------>

<!----------prof balance report------------>
<div id="acc_prof_bal_type-container" class="sub-stock-page acc-rep-sub sub-sub-page-container sub-sub-acc-div" style="display: block;">
<h2>اختر نوع  كشف الحساب</h2>
<div class="frmfieldrow">
<div class="frmfieldrow100">
<input class="button blue prof_reports_btns" data-id="1" style="font-size:18px; font-weight:bold;color:#FFF;float:right; width:300px;" id="incsales_rep_btn" type="button" value="كشف حساب عملاء">
<input class="button blue prof_reports_btns" data-id="2" style="font-size:18px; font-weight:bold;color:#FFF;float:right; width:300px;" id="itmsales_rep_btn" type="button" value="كشف حساب عاملين">
<input class="button blue prof_reports_btns" data-id="3" style="font-size:18px; font-weight:bold;color:#FFF;float:right; width:300px;" id="exp_rep_btn" type="button" value="كشف حساب شريك">
</div>
</div>
</div>


<div id="acc_cust-container" class="sub-stock-page acc-rep-sub acc-profbal-rep sub-sub-page-container sub-sub-acc-div" style="display: block;">
<h2>كشف حساب العملاء</h2>

<div class="frmfieldrow">
<div class="frmfieldrow50">
<div class="descr">اختر الفترة :</div>
<div class="dropdownlistcss">
  <select id="cust_dd" class="dropdownlistcssCashier">
    <option value="0">اختر العميل</option>
	</select>
</div>
<div class="descr"><button id="showcustrep">استعرض التقرير</button></div>
</div>
<div class="frmfieldrow50">
<div class="descr">من : <input type="text" id="custrepfrom_datepick" class="date_picker"></div>
<div class="descr">الى : <input type="text" id="custrepto_datepick" class="date_picker"></div>

</div>
</div>

<div id="cust_balance_rep">

<div class="reptblcontainer">

<div class="rephead">
<div class="repheadtxt">كشف حركة الحساب الجاري فترة من <div id="custbalreportfrom" style="display:inline;"></div> الى <div style="display:inline;" id="custbalreportto"></div></div>
</div>
<div class="rephead">
<div class="repheadtxt"> الاسم : 
<div id="balprofname" style="display:inline;"></div> الكود : <div id="balprofid" style="display:inline;"></div>
</div>
</div>

<div class="repfulltbl">
<div class="subtblhead">كشف الحساب</div>

<div class="righttblrowh">
<div class="repsubcol01">م</div>
<div class="repsubcol02">مدين</div>
<div class="repsubcol03">دائن</div>
<div class="repsubcol04">الرصيد</div>
<div class="repsubcol05">بيان</div>
<div class="repsubcol06">التاريخ</div>
</div>
<div class="righttblrow">
<div class="repsubcol01">0</div>
<div class="repsubcol02"></div>
<div class="repsubcol03"></div>
<div id="custprevbalance"class="repsubcol04">10</div>
<div class="repsubcol05">رصيد من</div>
<div id="custprevdate" class="repsubcol06">2014/01/01</div>
</div>

<div id="profaccmovs">
<div class="righttblrow">
<div class="repsubcol01">0</div>
<div class="repsubcol02"></div>
<div class="repsubcol03"></div>
<div class="repsubcol04">10</div>
<div class="repsubcol05">رصيد من</div>
<div class="repsubcol06">2014/01/01</div>
</div>

<div class="righttblrow">
<div class="repsubcol01">1</div>
<div class="repsubcol02"></div>
<div class="repsubcol03">10</div>
<div class="repsubcol04">20</div>
<div class="repsubcol05">شراء رصيد 1000 جرام من صنف السكر الى المخزن</div>
<div class="repsubcol06">2014/09/01</div>
</div>

</div>
</div>

<div class="repheadsum">

<div class="repfulltbl">
<div class="righttblrowh">
<div class="repsubcol05">الرصيد في نهاية الفترة</div>
<div id="profbalancetotal" class="repsubcol03">50</div>
<div id="balancedesc" class="repsubcol07">مبلغ مستحق لصاحب الحساب - مبلغ مستحق على صاحب الحساب</div>
</div>
</div>
</div>
</div>
</div>
<div class="descr"><button id="printcustrep">طباعة التقرير</button></div>


</div>

<div id="acc_owners-container" class="sub-stock-page acc-rep-sub acc-profbal-rep sub-sub-page-container sub-sub-acc-div" style="display: block;">
<h2>كشف حساب شركاء</h2>
<div class="frmfieldrow">
<div class="frmfieldrow50">
<div class="descr">اختر الفترة :</div>
<div class="dropdownlistcss">
  <select id="owners_dd" class="dropdownlistcssCashier">
    <option value="0">اختر الشريك</option>
	</select>
</div>
<div class="descr"><button id="showownersrep">استعرض التقرير</button></div>
</div>
<div class="frmfieldrow50">
<div class="descr">من : <input type="text" id="ownersrepfrom_datepick" class="date_picker"></div>
<div class="descr">الى : <input type="text" id="ownersrepto_datepick" class="date_picker"></div>

</div>
</div>

<div id="owners_balance_rep">

<div class="reptblcontainer">

<div class="rephead">
<div class="repheadtxt">كشف حركة حساب جاري شريك فترة من <div id="ownersbalreportfrom" style="display:inline;"></div> الى <div style="display:inline;" id="ownersbalreportto"></div></div>
</div>
<div class="rephead">
<div class="repheadtxt"> الاسم : 
<div id="ownersbalprofname" style="display:inline;"></div> الكود : <div id="ownersbalprofid" style="display:inline;"></div>
</div>
</div>

<div class="repfulltbl">
<div class="subtblhead">كشف الحساب</div>

<div class="righttblrowh">
<div class="repsubcol01">م</div>
<div class="repsubcol02">مدين</div>
<div class="repsubcol03">دائن</div>
<div class="repsubcol04">الرصيد</div>
<div class="repsubcol05">بيان</div>
<div class="repsubcol06">التاريخ</div>
</div>
<div class="righttblrow">
<div class="repsubcol01">0</div>
<div class="repsubcol02"></div>
<div class="repsubcol03"></div>
<div id="ownprevbalance" class="repsubcol04">10</div>
<div class="repsubcol05">رصيد من</div>
<div id="ownprevdate" class="repsubcol06">2014/01/01</div>
</div>

<div id="ownersprofaccmovs">
<div class="righttblrow">
<div class="repsubcol01">0</div>
<div class="repsubcol02"></div>
<div class="repsubcol03"></div>
<div class="repsubcol04">10</div>
<div class="repsubcol05">رصيد من</div>
<div class="repsubcol06">2014/01/01</div>
</div>

<div class="righttblrow">
<div class="repsubcol01">1</div>
<div class="repsubcol02"></div>
<div class="repsubcol03">10</div>
<div class="repsubcol04">20</div>
<div class="repsubcol05">شراء رصيد 1000 جرام من صنف السكر الى المخزن</div>
<div class="repsubcol06">2014/09/01</div>
</div>

</div>
</div>

<div class="repheadsum">

<div class="repfulltbl">
<div class="righttblrowh">
<div class="repsubcol05">الرصيد في نهاية الفترة</div>
<div id="ownprofbalancetotal" class="repsubcol03">50</div>
<div id="ownbalancedesc" class="repsubcol07">مبلغ مستحق لصاحب الحساب - مبلغ مستحق على صاحب الحساب</div>
</div>
</div>
</div>
</div>
</div>
<div class="descr"><button id="printownrep">طباعة التقرير</button></div>

</div>

<div id="acc_staffrep-container" class="sub-stock-page acc-rep-sub acc-profbal-rep sub-sub-page-container sub-sub-acc-div" style="display: block;">
<h2>كشف حساب العاملين</h2>

<div class="frmfieldrow">
<div class="frmfieldrow50">
<div class="descr">اختر الفترة :</div>
<div class="dropdownlistcss">
  <select id="staff_dd" class="dropdownlistcssCashier">
    <option value="0">اختر الموظف</option>
	</select>
</div>
<div class="descr"><button id="showstaffrep">استعرض التقرير</button></div>
</div>
<div class="frmfieldrow50">
<div class="descr">من : <input type="text" id="staffrepfrom_datepick" class="date_picker"></div>
<div class="descr">الى : <input type="text" id="staffrepto_datepick" class="date_picker"></div>

</div>
</div>

<div id="staff_balance_rep">

<div class="reptblcontainer">

<div class="rephead">
<div class="repheadtxt">كشف حركة حساب فترة من <div id="staffbalreportfrom" style="display:inline;"></div> الى <div style="display:inline;" id="staffbalreportto"></div></div>
</div>
<div class="rephead">
<div class="repheadtxt"> الاسم : 
<div id="staffbalprofname" style="display:inline;"></div> الكود : <div id="staffbalprofid" style="display:inline;"></div>
</div>
</div>

<div class="repfulltbl">
<div class="subtblhead">كشف الحساب</div>

<div class="righttblrowh">
<div class="repsubcol01">م</div>
<div class="repsubcol02">مدين</div>
<div class="repsubcol03">دائن</div>
<div class="repsubcol04">الرصيد</div>
<div class="repsubcol05">بيان</div>
<div class="repsubcol06">التاريخ</div>
</div>
<div class="righttblrow">
<div class="repsubcol01">0</div>
<div class="repsubcol02"></div>
<div class="repsubcol03"></div>
<div id="staffprevbalance" class="repsubcol04">10</div>
<div class="repsubcol05">رصيد من</div>
<div id="staffprevdate" class="repsubcol06">2014/01/01</div>
</div>

<div id="staffprofaccmovs">
<div class="righttblrow">
<div class="repsubcol01">0</div>
<div class="repsubcol02"></div>
<div class="repsubcol03"></div>
<div class="repsubcol04">10</div>
<div class="repsubcol05">رصيد من</div>
<div class="repsubcol06">2014/01/01</div>
</div>

<div class="righttblrow">
<div class="repsubcol01">1</div>
<div class="repsubcol02"></div>
<div class="repsubcol03">10</div>
<div class="repsubcol04">20</div>
<div class="repsubcol05">شراء رصيد 1000 جرام من صنف السكر الى المخزن</div>
<div class="repsubcol06">2014/09/01</div>
</div>

</div>
</div>

<div class="repheadsum">

<div class="repfulltbl">
<div class="righttblrowh">
<div class="repsubcol05">الرصيد في نهاية الفترة</div>
<div id="staffprofbalancetotal" class="repsubcol03">50</div>
<div id="staffbalancedesc" class="repsubcol07">مبلغ مستحق لصاحب الحساب - مبلغ مستحق على صاحب الحساب</div>
</div>
</div>
</div>
</div>
</div>
<div class="descr"><button id="printstaffrep">طباعة التقرير</button></div>


</div>



<!-----End of prof balance report----------->

<!----------------End of Accounting Sub Sub Pages------>


<!--- add various income general income sub page --->
<div id="acc_varincome-container" class="sub-stock-page sub-sub-page-container sub-sub-acc-div" style="display: block;">
<h2>شاشة تسجيل ايرادات متنوعة</h2>
<div class="frmfieldrow">
<div class="frmfieldrow50">
	<div class="inpboxtitle">اختر نوع الايراد</div>
    <div class="dropdownlistcss">
  <select id="varinc_typ_dd" class="dropdownlistcss">
    <option value="0">اخرى</option>
    <option value="1">تبس/اكراميات</option>
	</select>
</div>
</div>
</div>
<div class="frmfieldrow">
<div class="frmfieldrow50">  
<div class="inpboxtitle">القيمة :</div>
    <input id="varinc_value" type="text" class="inpboxtitle iniResettxt" onkeypress='validate_isNum(event)'>
  <div class="inpboxtitle">جنيه مصري</div>
</div>
<div class="frmfieldrow50">  
<div class="inpboxtitle">البيان/ملاحظات :</div>
    <input id="varinc_note" type="text" class="inpboxtitle iniResettxt" >
</div>
</div>
<div class="frmfieldrow">

<div  class="accsubmitbtn beeptwo" style="padding:5px;"><input style="font-size:16px; font-weight:bold;" id="save_varinc_btn" type="button" value="حفظ / اضافة"></div>

</div>
</div>
<!---------End of add various income sub page--->

<div id="acc_incomestatment-container" class="sub-stock-page acc-rep-sub sub-sub-page-container sub-sub-acc-div" style="display: block;">
<h2>شاشة قائمة الدخل</h2>
</div>

<div id="acc_purch-container" class="sub-stock-page acc-rep-sub sub-sub-page-container sub-sub-acc-div" style="display: block;">
<h2>شاشة تقرير المشتريات</h2>
<div class="frmfieldrow">
</div>
</div>

<div id="acc_exprep-container" class="sub-stock-page acc-rep-sub sub-sub-page-container sub-sub-acc-div" style="display: block;">
<h2>شاشة تقرير المصروفات</h2>
<div class="frmfieldrow">
</div>
</div>


<!---------Acc Sales items sales report sub screen sub page--->
<div id="acc_salesitm-salesrep-container" class="sub-stock-page acc-rep-sub sub-sub-page-container sub-sub-acc-div" style="display: block;">
<h2>شاشة تقرير مبيعات الأصناف</h2>

<div class="frmfieldrow">

<div class="frmfieldrow50">
<div class="inpboxtitle">اختر الصنف/الأصناف :</div>
<div class="dropdownlistcss">
  <select id="salesitemslist_dd" class="dropdownlistcss">
    <option value="0">كافة الأصناف</option>
  </select>
</div>
</div>

</div>

<div class="frmfieldrow">

<div class="frmfieldrow50">
<div class="inpboxtitle">اختر الفترة :</div>
<div class="dropdownlistcss">
  <select id="salesitmsreptyp_dd" class="dropdownlistcss">
    <option value="0">حركة مبيعات أصناف اليوم</option>
	<option value="1">حركة مبيعات أصناف الشهر</option>
	<option value="3">حركة مبيعات أصناف فترة</option>
	<option value="4">حركة مبيعات أصناف الكل</option>
  </select>
</div>
</div>
<div id="salesitmsdatediv" class="frmfieldrow50">
<div class="inpboxtitle">من : <input type="text" id="salesitmsrepfrom_datepick"></div>
<div class="inpboxtitle">الى : <input type="text" id="salesitmsrepto_datepick"></div>
</div>

</div>
<div class="frmfieldrow">
<div  class="accsubmitbtn beeptwo" style="padding:5px;"><input style="font-size:16px; font-weight:bold;" id="salesitmsrep_btn" type="button" value="استعرض التقرير"></div>
</div>
</div>
<!----End of sales items sales report sub screen----->

<!---------Acc purchased items report sub screen sub page--->
<div id="acc_purchitm-salesrep-container" class="sub-stock-page acc-rep-sub sub-sub-page-container sub-sub-acc-div" style="display: block;">
<h2>شاشة تقرير مشتريات الأصناف</h2>

<div class="frmfieldrow">

<div class="frmfieldrow50">
<div class="inpboxtitle">اختر الصنف/الأصناف :</div>
<div class="dropdownlistcss">
  <select id="stockitemslist_dd" class="dropdownlistcss">
    <option value="0">كافة الأصناف</option>
  </select>
</div>
</div>

</div>

<div class="frmfieldrow">

<div class="frmfieldrow50">
<div class="inpboxtitle">اختر الفترة :</div>
<div class="dropdownlistcss">
  <select id="purchitmsreptyp_dd" class="dropdownlistcss">
    <option value="0">حركة مشتريات أصناف اليوم</option>
	<option value="1">حركة مشتريات أصناف الشهر</option>
	<option value="3">حركة مشتريات أصناف فترة</option>
	<option value="4">حركة مشتريات أصناف الكل</option>
  </select>
</div>
</div>
<div id="purchitmsdatediv" class="frmfieldrow50">
<div class="inpboxtitle">من : <input type="text" id="purchitmsrepfrom_datepick"></div>
<div class="inpboxtitle">الى : <input type="text" id="purchitmsrepto_datepick"></div>
</div>

</div>
<div class="frmfieldrow">
<div  class="accsubmitbtn beeptwo" style="padding:5px;"><input style="font-size:16px; font-weight:bold;" id="purchitmsrep_btn" type="button" value="استعرض التقرير"></div>
</div>
</div>
<!----End of purchased items report sub screen----->

<!---------Acc staff data sub screen sub page--->
<div id="acc_staffdata-container" class="sub-stock-page acc-rep-sub sub-sub-page-container sub-sub-acc-div" style="display: block;">
<h2>شاشة بيانات العاملين والشركاء</h2>

<div class="frmfieldrow">

<div class="frmfieldrow50">
<div class="inpboxtitle">اختر العملية :</div>
<div class="dropdownlistcss">
  <select id="staffoperation_dd" class="dropdownlistcss">
    <option value="0">اختر العملية</option>
     <option value="1">تسجيل مستحقات</option>
    <option value="2">اضافة موظف</option>
    <option value="3">تعديل بيانات</option>
  </select>
</div>
</div>
<div id="selectstaffpartnerdiv" class="frmfieldrow50">
<div class="inpboxtitle">اختر الموظف-الشريك :</div>
<div class="dropdownlistcss">
  <select id="staffpartners_dd" class="dropdownlistcss">
    
  </select>
</div>
</div>
</div>

<div id="staffdepdiv" class="frmfieldrow">

<div  class="frmfieldrow50">
<div class="inpboxtitle">القيمة : </div><input type="text" id="staffdepvalue" class="inpboxtitle iniResettxt" onkeypress='validate_isNum(event)'><div class="inpboxtitle">جنيه </div>
</div>

<div  class="frmfieldrow50">

<div class="inpboxtitle">الوصف : </div><input type="text" id="staffdepdesc" class="inpboxtitle iniResettxt">
</div>

</div>

<div class="frmfieldrow">
<div  class="accsubmitbtn beeptwo" style="padding:5px;"><input style="font-size:16px; font-weight:bold;" id="saveincprof_btn" type="button" value="تسجيل المستحق"><input style="font-size:16px; font-weight:bold;" id="showprofdata_btn" type="button" value="عرض البيانات"></div>
</div>
<!-----edit current staff/partner data---->
<div id="editprofdiv" >
<div class="frmfieldrow">

<div  class="frmfieldrow50">
<div class="inpboxtitle">الاسم الكامل: </div><input type="text" id="profname" class="inpboxtitle iniResettxt" style="float: left;">
</div>

<div  class="frmfieldrow50">
<div class="inpboxtitle">موبايل : </div><input type="text" id="profmob" class="inpboxtitle iniResettxt"  style="float: left;">
</div>

</div>
<div class="frmfieldrow">

<div  class="frmfieldrow50">
<div class="inpboxtitle">موبايل2 : </div><input type="text" id="profmob2" class="inpboxtitle iniResettxt" style="float: left;">
</div>

<div  class="frmfieldrow50">
<div class="inpboxtitle">email : </div><input type="text" id="profemail" class="inpboxtitle iniResettxt" style="float: left;">
</div>

</div>

<div class="frmfieldrow">

<div  class="frmfieldrow50">
<div class="inpboxtitle">العنوان : </div><input type="text" id="profaddress" class="inpboxtitle iniResettxt" style="float: left;">
</div>

<div  class="frmfieldrow50">
<div class="inpboxtitle">الوظيفة : </div><input type="text" id="profjob" class="inpboxtitle iniResettxt"style="float: left;" >
</div>

</div>

<div class="frmfieldrow">

<div  class="frmfieldrow50">
<div class="inpboxtitle">تليفون ارضي : </div><input type="text" id="profphone" class="inpboxtitle iniResettxt" style="float: left;">
</div>

<div  class="frmfieldrow50">
<div class="inpboxtitle">ملاحظات : </div><input type="text" id="profnotes" class="inpboxtitle iniResettxt" style="float: left;">
</div>

</div>

<div class="frmfieldrow">
<div  class="accsubmitbtn beeptwo" style="padding:5px;"><input style="font-size:16px; font-weight:bold;" id="updateprof_btn" type="button" value="حفظ البيانات"></div>
</div>
</div><!-----END edit current staff/partner data---->

<!----add new stuff member ---->
<div id="addprofdiv" >
<div class="frmfieldrow">

<div  class="frmfieldrow50">
<div class="inpboxtitle">الاسم الكامل: </div><input type="text" id="addprofname" class="inpboxtitle iniResettxt" style="float: left;">
</div>

<div  class="frmfieldrow50">
<div class="inpboxtitle">موبايل : </div><input type="text" id="addprofmob" class="inpboxtitle iniResettxt"  style="float: left;">
</div>

</div>
<div class="frmfieldrow">

<div  class="frmfieldrow50">
<div class="inpboxtitle">موبايل2 : </div><input type="text" id="addprofmob2" class="inpboxtitle iniResettxt" style="float: left;">
</div>

<div  class="frmfieldrow50">
<div class="inpboxtitle">email : </div><input type="text" id="addprofemail" class="inpboxtitle iniResettxt" style="float: left;">
</div>

</div>

<div class="frmfieldrow">

<div  class="frmfieldrow50">
<div class="inpboxtitle">العنوان : </div><input type="text" id="addprofaddress" class="inpboxtitle iniResettxt" style="float: left;">
</div>

<div  class="frmfieldrow50">
<div class="inpboxtitle">الوظيفة : </div><input type="text" id="addprofjob" class="inpboxtitle iniResettxt"style="float: left;" >
</div>

</div>

<div class="frmfieldrow">

<div  class="frmfieldrow50">
<div class="inpboxtitle">تليفون ارضي : </div><input type="text" id="addprofphone" class="inpboxtitle iniResettxt" style="float: left;">
</div>

<div  class="frmfieldrow50">
<div class="inpboxtitle">ملاحظات : </div><input type="text" id="addprofnotes" class="inpboxtitle iniResettxt" style="float: left;">
</div>

</div>
<div class="frmfieldrow userpswprofrow">

<div  class="frmfieldrow50">
<div class="inpboxtitle">اسم المستخدم : </div><input type="text" id="addprofusername" class="inpboxtitle iniResettxt" style="float: left;">
</div>

<div  class="frmfieldrow50">
<div class="inpboxtitle">كلمة السر : </div><input type="text" id="addprofpsw" class="inpboxtitle iniResettxt" style="float: left;">
</div>

</div>
<div class="frmfieldrow">

<div  class="frmfieldrow50">
<div class="inpboxtitle">هل المستخدم كاشير؟ : </div><div class="inpboxtitle"><input type="radio" id="chashierprofyes" name="cashierrb" value="1" > نعم </div>
<div class="inpboxtitle"><input type="radio" name="cashierrb" value="0" checked> لا </div>
</div>

<div  class="frmfieldrow50">

</div>

</div>

<div class="frmfieldrow">
<div  class="accsubmitbtn beeptwo" style="padding:5px;"><input style="font-size:16px; font-weight:bold;" id="addupdateprof_btn" type="button" value="اضافة موظف"></div>
</div>
</div>
<!----end add new staff member---->

</div><!----End of staff data sub screen----->



<div id="acc_exp-container" class="sub-stock-page sub-sub-page-container sub-sub-acc-div" style="display: block;">
<h2>شاشة تسجيل مصروفات</h2>

<div class="frmfieldrow">
<div class="frmfieldrow100">
	<div class="inpboxtitle">اختر نوع المصروف</div>
    <div id="exp_salaries"  class="exp_type_btn touchbutton beeptwo">مرتبات وأجور</div>
    <div  id="exp_profile_blance" class="exp_type_btn touchbutton beeptwo">مسحوبات الشريك</div>
    <div  id="exp_all" class="exp_type_btn touchbutton beeptwo active">مصروفات اخرى</div>
</div>
</div>

<div class="frmfieldrow">
<div class="frmfieldrow100">
    <div class="dropdownlistcss"><select id="exp_level1_dd" class="dropdownlistcss initialize"></select></div>
 <div class="dropdownlistcss"><select id="exp_level2_dd" class="dropdownlistcss initialize"></select></div>
 <div class="dropdownlistcss"><select id="exp_level3_dd" class="dropdownlistcss initialize"></select></div>

</div>
</div>
<div class="frmfieldrow">
<div class="frmfieldrow50">  
<div class="inpboxtitle">القيمة :</div>
    <input id="exp_value" type="text" class="inpboxtitle iniResettxt" onkeypress='validate_isNum(event)'>
  <div class="inpboxtitle">جنيه مصري</div>
</div>
<div class="frmfieldrow50">  
<div class="inpboxtitle">البيان/ملاحظات :</div>
    <input id="exp_note" type="text" class="inpboxtitle iniResettxt" >
</div>
</div>
<div class="frmfieldrow">

<div class="frmfieldrow50"> 
<div class="inpboxtitle">الصرف بواسطة :</div>
<div class="dropdownlistcss"><select id="exp_from_dd" class="dropdownlistcss initialize"></select></div>
</div>
<div class="frmfieldrow50"> 
<div id="exp_owner_div" style="display: none;">
<div class="inpboxtitle">اختر الشريك :</div>
<div class="dropdownlistcss"><select id="exp_owners_dd" class="dropdownlistcss initialize"></select></div>
</div>
<div id="exp_staff_div" style="display: none;">
<div class="inpboxtitle">اختر الموظف :</div>
<div class="dropdownlistcss"><select id="exp_staff_dd" class="dropdownlistcss initialize"></select></div>
</div>

</div>
</div>

<div class="frmfieldrow">

<div  class="accsubmitbtn beeptwo" style="padding:5px;"><input style="font-size:16px; font-weight:bold;" id="save_exp_btn" type="button" value="حفظ / اضافة"></div>

</div>

</div>
<?php
/////////// check user permisssion to show/ allow application sections
}else{
	//echo $accCashierpage."  ". $userPermission  ;	
//showpermissionerrmsg(0);	// show the permission err msg
echo "<div class='perm_err_msg'><h2>عفوا .... ليس لك صلاحيات للدخول الى هذه الصفحة.. يرجى تسجيل الدخول بمستخدم  له صلاحيات</h2></div>";
}
?>
</div>
<!------------------------end of accounting main page screen---->
<!----------------------------------------------------------------------->

</div><!------Page Container End (End of all pages ----->
</div>
<div class="clear"></div>
<div id ="footerbar">
<div class="copyrighthome"><div class="social"><a target="_blank" href='https://www.facebook.com/mokacafeegypt'><img src="images/icons/facebook.png" class="socialIcon" alt=""></a><a href='#'><img src="images/icons/Twitter.png" class="socialIcon" alt=""></a><a href='#'><img src="images/icons/email.png" class="socialIcon" alt=""></a></div>
جميع الحقوق محفوظة © 2014  <a href="http://makkcg.com" target="_blank">موكا كافيه بواسطة م. محمد خليفة</a>
</div>
<!--<div class="copyrighthome">
<div class="social">
<a href="#"><img src="images/icons/facebook.png" class="socialIcon" alt=""></a><a href="#"><img src="images/icons/Twitter.png" class="socialIcon" alt=""></a><a href="#"><img src="images/icons/email.png" class="socialIcon" alt=""></a></div>
جميع الحقوق محفوظة © 2014  <a href="http://khalifacomputergroup.com" target="_blank">مجموعة خليفة للكمبيوتر</a>
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
?>