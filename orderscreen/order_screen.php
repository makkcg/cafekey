<?php
session_start();
ini_set( "session.cookie_lifetime", "0" ); // 0 means "until the browser is closed
header('Content-Type: text/html; charset=utf-8');/// set the content charset to utf-8 for php
include_once '../php/applicationVars.php';
//error_reporting(E_ALL);
//ini_set('display_errors', '1');
$userID=$_SESSION['user_id'];
//echo $_SESSION['login_status'];die();
include_once '../php/session_checker.php';
$userisloggged=sessionchecker($userID);//execute sesssion checker function before proceeding
//echo $userisloggged; 
//echo $userisloggged;
if($userisloggged){
/////////// check user permisssion to show/ allow application sections
$userPermission=$_SESSION['permission'];
include_once '../php/featurepermissions.php';
userpermissionsCheckSet($userPermission);
$accessorderperm=$_SESSION['accOrderspage'];
//echo $accessorderperm;
if(!$accessorderperm){
	showpermissionerrmsg(0);
}else{
?>
<!DOCTYPE HTML>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
 <link rel="stylesheet" href="../css/jquery-ui.min.css" type="text/css" />
<!-- <link href="//netdna.bootstrapcdn.com/font-awesome/4.2.0/css/font-awesome.css" rel="stylesheet">-->
<link rel="stylesheet" href="../css/buttons.css">
<link rel="stylesheet" href="../css/tablescash.css">
<link href="../css/modal.css" rel="stylesheet">

 <script type="text/javascript" src="../js/jquery-1.11.1.min.js"></script>
 <script type="text/javascript" src="../js/jquery-ui.min.js"></script>
 <script type="text/javascript" src="../js/buttons.js"></script>
 <script type="application/javascript" >
document.loggedinuserid=parseInt('<?php echo $userID; ?>');
document.loggedinusername=('<?php echo $_SESSION['fullname'];?>');
</script>
  <script type="text/javascript" src="../js/tablescash.js"></script>
<title>شاشة الطلبات</title>

</head>

<body>

<div id="orderpagecontainer" class="orderpagecontainer">
<div style="display:none;">
<audio id="beep-one" controls="controls" preload="auto">
				<source src="../audio/beep.mp3"></source>
				<source src="../audio/beep.ogg"></source>
				Your browser isn't invited for super fun time.
</audio>
<audio id="beep-two" controls="controls" preload="auto">
				<source src="../audio/beep2.mp3"></source>
				<source src="../audio/beep2.ogg"></source>
				Your browser isn't invited for super fun time.
</audio>
<audio id="beep-3" controls="controls" preload="auto">
				<source src="../audio/beep1.mp3"></source>
				<source src="../audio/beep1.ogg"></source>
				Your browser isn't invited for super fun time.
</audio>
</div>
<!----header Nav btns Area-->
<div class="ordersheadDiv">
<!-- Save current table orders tbleobj-->
<div class="saverestoreojbbtns">
<div class="reloadtblobj button orderhbtn clickable-div">اعادة تحميل الاوردرات</div> 
<div class="savetblobj button orderhbtn clickable-div">حفظ الاوردرات</div>
<div class="back button orderhbtn clickable-div"><a href="#regnewcust_form">اضافة عميل جديد</a></div>

<div class="logout button orderhbtn"><a href="../php/logout.php?id=<?php echo $userID ?>">تسجيل خروج المستخدم</a></div>
<div id="autosavebtn" class="autosavebtn button orderhbtn classA clickable-div" data-status="0">الحفظ التلقائي</div>
<?php
if($_SESSION['accStockpage']==1 || $_SESSION['accAccountpage']==1 ||$_SESSION['accManagepage']==1){
?>
<div class="gohome button orderhbtn"><a href="../applicationmain.php">الشاشة الرئيسية</a></div>
<?php
}else{
};
?>
</div>

</div>
<!-----table div ------------>
<div class="tables-container">
<div class="tblcontainer2">
</div>
<!-----tbl boxes ------------>
</div>
<!-- Add new customer screen pop up------->
        <a href="#x" class="overlay" id="regnewcust_form"></a>
        <div class="popup">
        <h1>اضافة عميل جديد</h1>
      <form id="addnewcustform" method="post">
        <p><input type="text" id="cust_fullname" name="cust_fullname" value="" placeholder="اسم العميل الثلاثي"></p>
        <p><input type="text" id="cust_mob1" onkeypress='validate_isNum(event)' name="cust_mob1" value="" placeholder="رقم المحمول"></p>
        <p><input type="text" id="cust_addr" name="cust_addr" value="" placeholder="عنوان"></p>
        <p><input type="text" id="cust_job" name="cust_job" value="" placeholder="الوظيفة"></p>
        <p><input type="text" id="cust_phone" onkeypress='validate_isNum(event)' name="cust_phone" value="" placeholder="تليفون"></p>
        
        <p><input type="text" id="cust_mob2" onkeypress='validate_isNum(event)' name="cust_mob2" value="" placeholder="رقم المحمول2"></p>
        <p><input type="text" id="cust_email" name="cust_email" value="" placeholder="بريد الكتروني"></p>
        <p><input type="text" id="cust_notes" name="cust_notes" value="" placeholder="ملاحظات"></p>
        
        <input type="hidden" id="cust_user_id" name="cust_user_id" value="2">
		<input type="hidden" id="cust_prof_type" name="cust_prof_type" value="4">
       
        <input type="hidden" id="key1" name="key1" value="addnewcustform">
        <p><input id="addnewcustbtn" type="submit" onClick="event.preventDefault();add_new_customer();" name="commit" value="حفظ العميل"></p>
		<div id="spinner"></div>
		<div id="result" class="loginresult"></div>
		
        
      </form>
            <a id="addnewcustX" class="close" href="#"></a>
        </div>

<!-----------------------end of Add new customer screen pop up------------->

<div class="tables-controlls-container">
<div class="bigtotal_rem_inv_show"><div class="fullinv_txt">اجمالي الطاولة  : <div class="fullinv_val"></div></div>
<div class="totdisc_txt">اجمالي المدفوع <div class="totdisc_val"></div></div>
<div class="remvalue_txt">الحساب الباقي : <div class="remvalue_val"></div></div>
</div></div>
<!-----table div ------------>
<!-------- table controls buttons div---------->
<div class="tables-controlls-container">
<a href="#" data-btnid="1" class="button button-highlight">الأصناف</a>
<a href="#" data-btnid="2" class="button button-highlight">استخرج فاتورة فرعية</a>
<a href="#" data-btnid="3" class="button button-highlight">الفاتورة المجمعة</a>
<!--<a href="#" data-btnid="4" class="button button-highlight">الفواتير الفرعية</a>-->
</div>
<!--------- end table controls buttons div--------->
<!----------cashier cat & itmes div--------->
<div class="cashier-main-container">
<div class="cashier-cat-container">
<div data-group_id="1" class="cat-item">جميع الأصناف</div>
<!--<div data-group_id="2" class="cat-item">مشروبات ساخنة</div>
<div data-group_id="3" class="cat-item">شيشة</div>-->
<div data-group_id="4" class="cat-item">مأكولات</div>
</div>
<div class="cashier-items-container">
<div data-group_id="1" class="items-group">
<div class="hor-group group1">
<div class='cash-item-small clicksound' data-id='1' data-itm_lname='عصير تفاح طبيعي 100%' data-itm_desc='عصير تفاح طبيعي 100% لمار معلب ديد' data-itm_price='10'><a>عصير تفاح طبيعي</a><div class="cash-item-price">10</div></div>
<div class='cash-item-small clicksound' data-id='2' data-itm_lname='عصير موز طبيعي 100%' data-itm_desc='عصير موز طبيعي 100% لمار معلب ديد' data-itm_price='12'><a>عصير موز طبيعي</a><div class="cash-item-price">12</div></div>
<div class='cash-item-small clicksound' data-id='3' data-itm_lname='عصير مانجو طبيعي' data-itm_desc='عصير مانجو طبيعي 100%' data-itm_price='8'><a>عصير مانجو طبيعي</a><div class="cash-item-price">8</div></div>
<div class="cash-item-small">عصير مانجو فريش<div class="cash-item-price">7</div></div>
<div class="cash-item-small">عصير مانجو فريش<div class="cash-item-price">7</div></div>
<div class="cash-item-small">عصير مانجو فريش<div class="cash-item-price">7</div></div>
<div class="cash-item-small">عصير مانجو فريش<div class="cash-item-price">7</div></div>
<div class="cash-item-small">عصير مانجو فريش<div class="cash-item-price">7</div></div>
<div class="cash-item-small">عصير مانجو فريش<div class="cash-item-price">7</div></div>
<div class="cash-item-small">عصير مانجو فريش<div class="cash-item-price">7</div></div>
<div class="cash-item-small">عصير مانجو فريش<div class="cash-item-price">7</div></div>
<div class="cash-item-small">عصير مانجو فريش<div class="cash-item-price">7</div></div>
<div class="cash-item-small">عصير مانجو فريش<div class="cash-item-price">7</div></div>
<div class="cash-item-small">عصير مانجو فريش<div class="cash-item-price">7</div></div>


</div>
<div class="hor-group group2">
<div class='cash-item-small clicksound' data-id='9' data-itm_lname='قهوة تركي' data-itm_desc='قهوة تركي' data-itm_price='7'><a>قهوة تركي</a><div class="cash-item-price">7</div></div>
<div class="cash-item-small">قهوة تركي<div class="cash-item-price">5</div></div>
<div class="cash-item-small">قهوة تركي<div class="cash-item-price">5</div></div>
<div class="cash-item-small">قهوة تركي<div class="cash-item-price">5</div></div>
<div class="cash-item-small">قهوة تركي<div class="cash-item-price">5</div></div>
<div class="cash-item-small">قهوة تركي<div class="cash-item-price">5</div></div>
</div>

<div class="hor-group group3">
<div class="cash-item-small">حجر معسل فواكه<div class="cash-item-price">4</div></div>
<div class="cash-item-small">حجر معسل قص<div class="cash-item-price">2.5</div></div>
<div class="cash-item-small">حجر معسل سلوم<div class="cash-item-price">2.5</div></div>
</div>

<div class="hor-group group4">
</div>
</div><!-----end of group section 1-->
<!--
<div data-group_id="2" class="items-group">
<div class='cash-item clicksound' data-id='9' data-itm_lname='قهوة تركي' data-itm_desc='قهوة تركي' data-itm_price='7'><a>قهوة تركي</a><div class="cash-item-price">7</div></div>
<div class="cash-item">قهوة تركي<div class="cash-item-price">5</div></div>
<div class="cash-item">قهوة تركي<div class="cash-item-price">5</div></div>
<div class="cash-item">قهوة تركي<div class="cash-item-price">5</div></div>
<div class="cash-item">قهوة تركي<div class="cash-item-price">5</div></div>
<div class="cash-item">قهوة تركي<div class="cash-item-price">5</div></div>
</div><!-----end of group 2-->
<!--
<div data-group_id="3" class="items-group">
<div class="cash-item">حجر معسل فواكه<div class="cash-item-price">4</div></div>
<div class="cash-item">حجر معسل قص<div class="cash-item-price">2.5</div></div>
<div class="cash-item">حجر معسل سلوم<div class="cash-item-price">2.5</div></div>

</div><!-----end of group 3-->

<div data-group_id="4" class="items-group fooditems">
<div class="hor-group foodgroup1">
<div class="cash-item-small">ساندويتش برجر<div class="cash-item-price">5</div></div>
<div class="cash-item-small">ساندويتش كبدة<div class="cash-item-price">7</div></div>
<div class="cash-item-small">ساندويتش هوت دوج<div class="cash-item-price">8</div></div>
</div>
</div><!-----end of group -->
</div>
</div>
<!-------------end of cashier items-------->

<!-------- grand table invoice div---------->
<div class="cashier-invoice-container">
<div class="table-invoice-frame">
<div class="table-invoice-frame2">
<div class="table-full-view-inv">
<div class="inv_data_row"> اوردر رقم :  <div class="inlinediv order_num" data-id="0">0</div></div>
<div class="inv_data_row"> فاتورة رقم :  <div class="inlinediv order_invid" data-id="0">0</div></div>
<div class="inv_data_row"> تاريخ :  <div class="inlinediv order_dattime" data-id="0">2014-10-4 20:59:8</div></div>
<div class="inv_data_row"> طاولة رقم :  <div class="inlinediv tableno"  data-id="0">1</div></div>
<div class="inv_data_row"> كاشير :  <div class="inlinediv cashiername" data-id="1">محمد عادل خليفة</div></div>

<div class="inv_table">

<div class="inv_tbl_head">
<div class="inv_name_col001 inv_row_col">اسم الصنف</div>
<div class="inv_unitpr_col001 inv_row_col">سعر الوحدة</div>
<div class="inv_qunt_col001 inv_row_col">الكمية</div>
<div class="inv_cost_col001 inv_row_col">الاجمالي</div>

</div>

<div class="inv_tbl_datarows itemsrows">

<div class="inv_tbl_datarows invitemrow"  data-itmid="51" data-itmqnty="" data-itmunprice="" data-itmtot="">
<div class="inv_name_col001 inv_row_col">مياه معدنية صغير</div><div class="inv_unitpr_col001 inv_row_col">5</div>
<div class="inv_qunt_col001 inv_row_col">1</div>
<div class="inv_cost_col001 inv_row_col">5</div>
</div>

</div><!-----end of invoice tbl datarows-->

<div class="inv_tbl_datarows taxrow">
<div class="inv_name_col001 inv_row_col">الضريبة</div>
<div class="inv_unitpr_col001 inv_row_col">10%</div>
<div class="inv_qunt_col001 inv_row_col"></div>
<div class="inv_cost_col001 inv_row_col">4.30</div>
</div>

<div class="inv_tbl_datarows servrow">
<div class="inv_name_col001 inv_row_col">الخدمة</div>
<div class="inv_unitpr_col001 inv_row_col">12%</div>
<div class="inv_qunt_col001 inv_row_col"></div>
<div class="inv_cost_col001 inv_row_col">5.16</div>
</div>



<div class="inv_tbl_datarows discrow">
<div class="inv_name_col001 inv_row_col">الخصم</div>
<div class="inv_unitpr_col001 inv_row_col"><div data-valpers="pers" data-discinv="full" class="adddisc button">خصم%</div></div>
<div class="inv_qunt_col001 inv_row_col"><div data-discinv="full"  data-valpers="val" class="adddisc button">خصم</div></div>
<div class="inv_cost_col001 inv_row_col">0.00</div>
</div>



<div class="inv_tbl_datarows gtotalrow">
<div class="inv_name_col001 inv_row_col">الاجمالي</div>
<div class="inv_unitpr_col001 inv_row_col"></div>
<div class="inv_qunt_col001 inv_row_col"></div>
<div class="inv_cost_col001 inv_row_col">52.46</div>
</div>

</div><!-----end of invoice tbl-->
<div class="fullinvbtns">
<div class="button paysubbtns button-caution clickable-div  payfullinv" data-btntype="paynow">دفع واغلاق الطاولة</div>
<!--<div class="button paysubbtns paysubinv" data-btntype="paylater">دفع آجل</div>-->
<div class="button button-primary paysubbtns clickable-div printfullinv" data-clickedbtn="printfullinv" data-btntype="print">طباعة</div>
</div>
</div><!---- end of table-full-view-inv--->
</div>
</div>
</div><!--------- end of invoice div--------->

<!-------- create sub invoice div---------->
<div class="cashier-cr-sub-inv-container">

<div class="table-invoice-container">
<div class="table-remsub-invoice">
<div class="inv_data_row"> اوردر رقم :  <div class="inlinediv order_num"  data-id="0">63</div></div>
<div class="inv_data_row"> تاريخ :  <div class="inlinediv order_dattime"  data-id="0">2014-10-4 20:59:8</div></div>
<div class="inv_data_row"> طاولة رقم :  <div class="inlinediv tableno"  data-id="0">1</div></div>
<div class="inv_data_row"> العميل :  <div class="inlinediv customername"  data-custprofid="1">عميل غير منتظم</div></div>
<div class="inv_data_row"> كاشير :  <div class="inlinediv cashiername"  data-id="1">محمد عادل خليفة</div></div>

<div class="inv_table">

<div class="inv_tbl_head">
<div class="inv_name_col inv_row_col">اسم الصنف</div>
<div class="inv_unitpr_col inv_row_col">سعر الوحدة</div>
<div class="inv_qunt_col inv_row_col">الكمية</div>
<div class="inv_cost_col inv_row_col">الاجمالي</div>
<div class="inv_controls_col inv_row_col pswcol">حذف </div>
<div class="inv_controls_col inv_row_col">الى الفرعية</div>
</div>

<div class="inv_tbl_datarows itemsrows">

<div class="inv_tbl_datarows invitemrow" data-itmid="51" data-remsubinv_arrid="" data-itmqnty="" data-itmunprice="" data-itmtot="">

<div class="inv_name_col inv_row_col">مياه معدنية صغير</div>
<div class="inv_unitpr_col inv_row_col">5</div>
<div class="inv_qunt_col inv_row_col">1</div>
<div class="inv_cost_col inv_row_col">5</div>
<div class="inv_controls_col inv_row_col pswcol" data-itmid="51" data-remsubinv_arrid="" data-itmqnty="" data-itmunprice="" data-itmtot=""><img data-id="0" align="middle" class="ingr_remove" src="../images/del24.png"></div>
<div class="inv_controls_col inv_row_col tosubinv clickable-div" data-itmid="51" data-remsubinv_arrid="" data-itmqnty="" data-itmunprice="" data-itmtot=""><img data-id="0" align="middle" class="ingr_add" src="../images/toleft_arr_24.png"></div>
</div>

</div><!-----end of inv_tbl_datarows-->

<div class="inv_tbl_datarows taxrow">
<div class="inv_name_col inv_row_col">الضريبة</div>
<div class="inv_unitpr_col inv_row_col">10%</div>
<div class="inv_qunt_col inv_row_col"></div>
<div class="inv_cost_col inv_row_col">4.30</div>
<div class="inv_controls_col inv_row_col pswcol"></div>
<div class="inv_controls_col inv_row_col"></div>
</div>

<div class="inv_tbl_datarows servrow">
<div class="inv_name_col inv_row_col">الخدمة</div>
<div class="inv_unitpr_col inv_row_col">12%</div>
<div class="inv_qunt_col inv_row_col"></div>
<div class="inv_cost_col inv_row_col">5.16</div>
<div class="inv_controls_col inv_row_col pswcol"></div>
<div class="inv_controls_col inv_row_col"></div>
</div>

<div class="inv_tbl_datarows discrow">
<div class="inv_name_col inv_row_col">الخصم</div>
<div class="inv_unitpr_col inv_row_col"></div>
<div class="inv_qunt_col inv_row_col"></div>
<div class="inv_cost_col inv_row_col">0.00</div>
<div class="inv_controls_col inv_row_col pswcol"></div>
<div class="inv_controls_col inv_row_col"></div>
</div>

<div class="inv_tbl_datarows gtotalrow">
<div class="inv_name_col inv_row_col">الاجمالي</div>
<div class="inv_unitpr_col inv_row_col"></div>
<div class="inv_qunt_col inv_row_col"></div>
<div class="inv_cost_col inv_row_col">52.46</div>
<div class="inv_controls_col inv_row_col pswcol"></div>
<div class="inv_controls_col inv_row_col"></div>
</div>

</div><!-----end of invoice tbl inv_table-->

</div><!---- end of table-full-invoice--->

<div class="inv-buttons-sub-inv">
<div class="inv-buttons-div">
<a href="#" data-btn_id="1" class="button sub-inv-buttons button-caution">حذف صنف من الفاتورة الرئيسية</a>
</div>
<div class="inv-buttons-div">

<a href="#" data-btn_id="3" class="button sub-inv-buttons button-royal button-pill"> اضافة فاتورة فرعية جديدة</a>
<a href="#" data-btn_id="4" class="button sub-inv-buttons button-pill button-royal">تغيير اسم العميل</a>
<!--<a href="#" data-btn_id="2" class="button sub-inv-buttons button-pill button-royal">استعراض الفواتير الفرعية</a>-->
</div>
<div class="inv-buttons-div subinvcust_dd">
<select id="ordersubinv_cust_op" class="ui-selectmenu-button ui-widget ui-state-default ui-corner-all cust_dd">
    <option value="0">جميع العملاء</option>
</select>
<!--<a href="#" data-btn_id="2" class="button sub-inv-buttons button-pill button-royal">استعراض الفواتير الفرعية</a>-->
</div>
<div class="inv-buttons-div notpaidinv-div">
<div style="display:inline-block;font-weight:bold;">عدد الفواتير الغير مدفوعة على العميل : </div>
<div style="display:inline-block;font-weight:bold;color:red;" class="notpaid-inv-no"></div>
<div class="" style="display:inline-block; font-weight:bold;"> باجمالي :  </div>
<div style="display:inline-block;font-weight:bold;color:red;" class="notpaid-inv-sum"></div>
<div style="display:inline-block;font-weight:bold;margin:0 10px;" class="button showunpaidord">استعرض</div>
</div>
<div class="sub-invoices-btns clickable-div">
<div class="button button-flat subbtn" data-subbtnid="1">1</div>
<div class="button button-flat subbtn" data-subbtnid="2">2</div>
<div class="button button-flat subbtn" data-subbtnid="3">3</div>
</div>
<div class="sub-inv-div">

<div class="table-sub-invoice">

<div class="inv_data_row"> اوردر رقم :  <div class="inlinediv"  data-ordersubid="0">63-1</div></div>
<div class="inv_data_row"> فاتورة رقم :  <div class="inlinediv"  data-invid="0">63-1</div></div>
<div class="inv_data_row"> تاريخ :  <div class="inlinediv"  data-orddat="0">2014-10-4 20:59:8</div></div>
<div class="inv_data_row"> طاولة رقم :  <div class="inlinediv" data-tableno="0">1</div></div>
<div class="inv_data_row"> اسم العميل :  <div class="inlinediv" data-custname="0" data-custprofid="0">عميل غير منتظم</div></div>
<div class="inv_data_row"> كاشير :  <div class="inlinediv"  data-cashuserid="1" data-cashusername="">محمد عادل خليفة</div></div>

<div class="inv_table">

<div class="inv_tbl_head">
<div class="inv_name_col inv_row_col">اسم الصنف</div>
<div class="inv_unitpr_col inv_row_col">سعر الوحدة</div>
<div class="inv_qunt_col inv_row_col">الكمية</div>
<div class="inv_cost_col inv_row_col">الاجمالي</div>
<div class="inv_controls_col inv_row_col">حذف </div>
</div>

<div class="inv_tbl_datarows subinvitemsrows">

<div class="inv_tbl_datarows" data-itmid="51"><div class="inv_name_col inv_row_col">مياه معدنية صغير</div><div class="inv_unitpr_col inv_row_col">5</div><div class="inv_qunt_col inv_row_col">1</div><div class="inv_cost_col inv_row_col">5</div><div class="inv_controls_col inv_row_col"><img data-id="0" align="middle" class="ingr_remove" src="../images/del24.png"></div>

</div>

</div><!-----end of inv_table-->

<div id="taxrow" class="inv_tbl_datarows">
<div class="inv_name_col inv_row_col">الضريبة</div>
<div class="inv_unitpr_col inv_row_col">10%</div>
<div class="inv_qunt_col inv_row_col"></div>
<div class="inv_cost_col inv_row_col">4.30</div>
<div class="inv_controls_col inv_row_col"></div>
</div>

<div id="servrow" class="inv_tbl_datarows">
<div class="inv_name_col inv_row_col">الخدمة</div>
<div class="inv_unitpr_col inv_row_col">12%</div>
<div class="inv_qunt_col inv_row_col"></div>
<div class="inv_cost_col inv_row_col">5.16</div>
<div class="inv_controls_col inv_row_col"></div>
</div>

<div id="discrow" class="inv_tbl_datarows">
<div class="inv_name_col inv_row_col">الخصم</div>
<div class="inv_unitpr_col inv_row_col"></div>
<div class="inv_qunt_col inv_row_col"></div>
<div class="inv_cost_col inv_row_col">0.00</div>
<div class="inv_controls_col inv_row_col"></div>
</div>

<div id="gtotalrow" class="inv_tbl_datarows">
<div class="inv_name_col inv_row_col">الاجمالي</div>
<div class="inv_unitpr_col inv_row_col"></div>
<div class="inv_qunt_col inv_row_col"></div>
<div class="inv_cost_col inv_row_col">52.46</div>
<div class="inv_controls_col inv_row_col"></div>
</div>

</div><!-----end of invoice tbl-->

</div><!-----end of sub-inv-divl-->

</div><!-----end of table-invoice-container-->
</div><!-- end of cashier-cr-sub-inv-container--->
<!--------- end of create sub invoice div--------->

</div>
</body>
</html>
<?php
};////end of user permission if statment
}else{//end of if user logged in
echo "<META HTTP-EQUIV=\"refresh\" CONTENT=\"0; URL=../index.php#login_form\"> ";
exit;
};
?>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>