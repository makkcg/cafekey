////////////////////validation of form fields/////////////////
//////////////////validation of any field lenght///////////////
function validateLength(selector,minlength){
	//alert(selector.val().length);
	if(selector.val().length<=minlength){
		return false;
	}else{
		return true;
	}
}

//////////////validate input is numiric
function validate_isNum(evt) {
  var theEvent = evt || window.event;
  var key = theEvent.keyCode || theEvent.which;
  key = String.fromCharCode( key );
  var regex = /[0-9]|\./;
  if( !regex.test(key) ) {
    theEvent.returnValue = false;
    if(theEvent.preventDefault) theEvent.preventDefault();
  }
}

///////////////date calculation functions
function frmtdatetimesql(optionD1DT0T2){
var d=new Date();
	if(optionD1DT0T2==1){		
	return d.getFullYear()+'-'+(d.getMonth()+1)+'-'+d.getDate();
	}else if (optionD1DT0T2==0){
	return d.getFullYear()+'-'+(d.getMonth()+1)+'-'+d.getDate()+' '+d.getHours()+':'+d.getMinutes()+':'+d.getSeconds();	
	}else if (optionD1DT0T2==2){
	return d.getHours()+':'+d.getMinutes()+':'+d.getSeconds();	
	
	}
}
function addsubsdaysfromdate(dateobj,add1sub0,nodays){
var d=new Date(dateobj);
var newdat= new Date(dateobj)

	if(add1sub0==0){		
	newdat.setDate(d.getDate()-nodays)
	return newdat.getFullYear()+'-'+(newdat.getMonth()+1)+'-'+(newdat.getDate());
	}else if (add1sub0==1){
		newdat.setDate(d.getDate()+nodays)
	return newdat.getFullYear()+'-'+(newdat.getMonth()+1)+'-'+(newdat.getDate());
		
	
	}
}
/// general id query function
function getnextid(tablename){
	var next_id =0;
	$.ajaxSetup({async:false});
$.post("php/db_query_fun.php",{param:'3~'+tablename},function(server_response) {
		next_id =parseInt(server_response);
});	
return next_id;
}
//////// Stock management functions for Cafekey app by Mohammed Khalifa///////
////////////////////////////// navigation and interface related js Cashier screen ////////////////////

function initialize_stock_sub_pages(){
	$(".sub-stock-page").hide();
	populatestunitmeasurelist();///populate measure units dorp down
	populateBuyerlist(); /// populate buyers list
	populatestocknameslist(); //// porpulate stock names list
	populatestockitemtypeslist(); /// populate sotck items list (existing)
	populatesalesitemgroups(); /// populate sales items' groups - add sales item screen
	update_newitem_code();	////update new item code
	populateexistingstockitems(2); //// populate stock items - 
	populateexistingstockitems(3);
	initializesalesitems();//// initialize sales items
	initializeoptions(); /// initializeoptions - reset all dropdowns and text fields
	
}
///////////////////initialize options in with class name initialize
function initializeoptions(){
	$(".initialize").val(0);
	$(".iniResettxt").val("");
	
	$(".initialize").prop('disabled', false);
	$(".initialize_disabled").prop('disabled',true);
	$("#itm_type_desc").html("");
	
	$(".itemstockinfo").find(".stockinforow").remove()
	////initialize spoil subscreen
$("#stock_itms_spoil").val(0)
$("#stock_names_spoil").val(0)
$("#stock_spoil_prof").val(16)
$(".st_itm_spoil_unit").attr("data-value",0)
$(".st_itm_spoil_unit").data("value",0)
$("#itm_spoil_qnty").val("")
$(".st_itm_spoil_unit").html("")
$(".st_itm_code_spoil").html("")
$(".st_itm_rem_spoil").html("")
//////initialize transfer screen
$("#stock_itms_trans").val(0)
$("#stock_names_from").val(0)
$("#stock_names_to").val(0)
$(".st_itm_unit").attr("data-value",0)
$(".st_itm_unit").data("value",0)
$("#itm_trans_qnty").val("")
$(".itemstockinfo").find(".stockinforow").remove()
$(".st_itm_unit").html("")
$(".st_itm_code_trans").html("")
$(".st_itm_rem_trans").html("")
//////initialize record balance screen
$("#stock_itms_recbal").val(0)
$("#stock_names_recbal").val(0)
$(".st_itm_recbal_unit").attr("data-value",0)
$(".st_itm_recbal_unit").data("value",0)
$(".st_itm_recbal_unit").html("")
$("#itm_recbal_qnty").val("")
$(".st_itm_actbalance").html("")
$(".st_itm_code_recbal").html("")
$(".st_itm_difnotes").html("")
/////// initialize reports page
$(".allstreports").hide();
$(".stocksalesreports").hide();
}
initializesalesitems();

$(document).ready(function() {
	
///////////////////////////////////////////////////////////////Initialize and fill Drop down lists from database /////////////////////////

///// initialize out of stock screen/////
$("#stockitems-outoflimit-div").hide()

///initialize controls
$("#save-new-st-itm").jqxButton({ width: '95%',theme: 'energyblue',height:'40',roundedCorners: 'all'});
$("#save-sales-st-itm").jqxButton({ width: '95%',theme: 'energyblue',height:'40',roundedCorners: 'all'});

//////////// initialize dropdown lists 

/////////// jqx dropdown for stock item type New or already existing in the stock 

////////// stock type list
var stocknewold = [
                    { value: "0", label: "صنف جديد" },
					{ value: "1", label: "اصناف مسجلة" }
];			
$("#stock_new_old").jqxDropDownList({ source: stocknewold, width: 250, height: 25, rtl: true});
var setselectedstocknewold = $("#stock_new_old").jqxDropDownList('getItemByValue', '0');
$("#stock_new_old").jqxDropDownList('selectItem', setselectedstocknewold);/// set selected type to new items
$(".newitmesonly").show();
$(".existingitem").hide();

//// initialize stock sub pages 
initialize_stock_sub_pages();		

////// show out of stock items when click on the button/////
$("#showstocklimiteditems").click(function(){
	drawlimitexceededitems(1)
//showoutofstockitemsrows();
$("#stockitems-outoflimit-div1").hide()	
$("#stockitems-outoflimit-div").toggle('slow')
	
})
$("#showstockitemsbalances").click(function(){
	drawlimitexceededitems(0)
//showoutofstockitemsrows();
$("#stockitems-outoflimit-div").hide()	
$("#stockitems-outoflimit-div1").toggle('slow')
	
})
/////////////////////////////stock menu screen ////////////////////
$(".stockmenu li a").click(function(){//// user clicks on any of stock sub menu buttons
var menuitem=$(this).data("id")
	switch(parseInt(menuitem)){
	case 1: ///Stock limits list
	initialize_stock_sub_pages();
	$(".st_limits_subpage").show();
	break;
	case 2: ///Add/buy stock items
	initialize_stock_sub_pages();
	$(".st_buy_subpage").show();
	break;
	case 3://اضافة اصناف بيع
	initialize_stock_sub_pages();
	$(".st_addsalesitem_subpage").show();
	break;
	case 4://تحويل أرصدة مخزن
	initialize_stock_sub_pages();
	
	$(".st_trans_subpage").show();
	break;
	case 5://تعديل بيانات
	initialize_stock_sub_pages();
	$("").show();
	break;
	case 6://تسجيل جرد مخزن
	initialize_stock_sub_pages();
	$(".st_recbalance_subpage").show();
	break;
	case 7://تلف أصناف
	initialize_stock_sub_pages();
	$(".st_spoil_subpage").show();
	break;
	case 8://تقارير
	initialize_stock_sub_pages();
	$(".st_reports_subpage").show();
	break;
		
	}
});
				
///////////////buy stock item screen - select old item from drop down - automatic set the tiem qntity measure unit in the quantitiy unit dropdown

///////////////////////////////////////////// CHANGING SELECT OPTIONS FUNCTIONS///////////////
////// show and hide divs according to the type of stock item (existing , new)
$("#stock_new_old").change(function() {
					var selectedstocknewold = $("#stock_new_old").jqxDropDownList('getSelectedItem');
   					 if(selectedstocknewold.value=="0"){/// new item
						 $(".newitmesonly").show();
						 $(".existingitem").hide();
						 $("#unit_measure").prop('disabled', false);
						 $("#st_itm_type").prop('disabled', false);
						 initializeoptions();	 
					 }else if(selectedstocknewold.value=="1"){////existing itm
						 $(".newitmesonly").hide();
						 $(".existingitem").show();
						 initializeoptions();/// reset all dropdowns and txt inputs
						
					 };
});
///////////changing stock existing items screen
$("#stock_itms").change(function() {
	var selecteditem_id = $('#stock_itms').find(":selected").val();
	/// show the item code in the html beside the selected item
	$(".st_itm_code").html("كود الصنف : "+selecteditem_id)
	/// get item quantity unit from database based on item id
	$.post("php/db_query_fun.php",{param:'7~'+selecteditem_id},function(server_response) {
						data = $.parseJSON(server_response);
						for(var i = 0; i < data.length; i++){
						itm_qnty_unit=data[i].itm_qnty_unit;/// get the selected itm stored measur unit
						itm_type=data[i].itm_type;//// get the selected itm stored type
                  		}
						if(selecteditem_id>0){
						$("#unit_measure").val(itm_qnty_unit);
						$("#unit_measure").prop('disabled', true);
						$("#st_itm_type").val(itm_type);
						$("#st_itm_type").prop('disabled', true);
						}else{
						$("#unit_measure").prop('disabled', false);
						$("#st_itm_type").prop('disabled', false);
						$("#unit_measure").val(0);	
						$("#st_itm_type").val(0);		
						}
						///calculate the current total stock of all stocks for this item
						////	itm_id,stock_id,startdat,enddate,balanceonly
						var postdata=selecteditem_id+'~0~0~0~1'
						$.post("php/acc_func.php",{param:'7~'+postdata},function(server_response) {
						data = $.parseJSON(server_response);
						
						var st_itm_rem=data[0].balance
						$(".st_itm_rem").html("الرصيد الحالي : "+st_itm_rem+" "+$("#unit_measure").find(":selected").text())
						})//end of balance ajax
	});
});//end change dropdown func

///////////changing selected stock item in set limits stocks screen
$("#stock_itms_limits").change(function() {
	var selecteditem_id = $('#stock_itms_limits').find(":selected").val();
	$(".itemlimitinfo").html("")
	$(".st_itm_code_limits").html("كود الصنف : "+selecteditem_id)
	var measurun=""
	$.post("php/acc_func.php",{param:'9~'+selecteditem_id+"~0~0"},function(server_response) {
						data = $.parseJSON(server_response);
						for(var i = 0; i < data.length; i++){
						itm_limit=data[i].limit;/// get the selected itm stored measur unit
						}
						$.post("php/db_query_fun.php",{param:'7~'+selecteditem_id},function(server_response) {
						data = $.parseJSON(server_response);
						for(var i = 0; i < data.length; i++){
						itm_qnty_unit=data[i].itm_qnty_unit;/// get the selected itm stored measur unit
						}
						
						if(selecteditem_id>0){
						measurun=measureunits[itm_qnty_unit]
						}else{
						measurun=""
						}
						})
	$(".itemlimitinfo").html("الحد الأدنى الحالي من الصنف: "+itm_limit+" "+measurun)
	})// end of post
})//end of change func stock limits

///////////////drop down select spoil item
$("#stock_itms_spoil").change(function() {
	var selecteditem_id = $('#stock_itms_spoil').find(":selected").val();
	//$(".itemlimitinfo").html("")
	$(".st_itm_code_spoil").html("كود الصنف : "+selecteditem_id)
	var measurun=""
$.post("php/db_query_fun.php",{param:'7~'+selecteditem_id},function(server_response) {
						data = $.parseJSON(server_response);
						for(var i = 0; i < data.length; i++){
						itm_qnty_unit=data[i].itm_qnty_unit;/// get the selected itm stored measur unit
						}
						
						if(selecteditem_id>0){
						measurun=measureunits[itm_qnty_unit]
						}else{
						measurun=""
						}
						$(".st_itm_spoil_unit").html(measurun)
						$(".st_itm_spoil_unit").attr("data-value",itm_qnty_unit)
						$(".st_itm_spoil_unit").data("value",itm_qnty_unit)
		})//end of post
})///end of dropdown select

///////////////drop down select record balance for item
$("#stock_itms_recbal").change(function() {
	var selecteditem_id = $('#stock_itms_recbal').find(":selected").val();
	//$(".itemlimitinfo").html("")
	$(".st_itm_code_recbal").html("كود الصنف : "+selecteditem_id)
	$(".st_itm_difnotes").html("")
	$("#itm_recbal_qnty").val("")
	var measurun=""
$.post("php/db_query_fun.php",{param:'7~'+selecteditem_id},function(server_response) {
						data = $.parseJSON(server_response);
						for(var i = 0; i < data.length; i++){
						itm_qnty_unit=data[i].itm_qnty_unit;/// get the selected itm stored measur unit
						}
						
						if(selecteditem_id>0){
						measurun=measureunits[itm_qnty_unit]
						}else{
						measurun=""
						}
						$(".st_itm_recbal_unit").html(measurun)
						$(".st_itm_recbal_unit").attr("data-value",itm_qnty_unit)
						$(".st_itm_recbal_unit").data("value",itm_qnty_unit)
						///calculate the current total stock of all stocks for this item
						////	itm_id,stock_id,startdat,enddate,balanceonly
						var postdata=selecteditem_id+'~0~0~0~1'
						$.post("php/acc_func.php",{param:'7~'+postdata},function(server_response) {
						data = $.parseJSON(server_response);
						
						var st_itm_rem=data[0].balance
						$(".st_name_bal").html("جميع المخازن : ")
						$(".st_itm_actbalance").html(st_itm_rem)
						$('#stock_names_recbal').val(0)
						})//end of balance ajax
		})//end of post
})///end of dropdown select

///changing actual value in stock recording balance
$("#itm_recbal_qnty").keyup(function() {
	if(parseInt($('#stock_names_recbal').val())==0 || parseInt($('#stock_itms_recbal').val())==0){alert("يرجى اختيار صنف وختيار مخزن اولا");$("#itm_recbal_qnty").val("");return false;}
	var actbalance=0
	var calcbalance=0
	var calcDifact=0
	actbalance = parseInt($('#itm_recbal_qnty').val());
	calcbalance= parseInt($(".st_itm_actbalance").text());
	calcDifact1= parseInt($(".st_itm_actbalance").text())-parseInt($('#itm_recbal_qnty').val())
	calcDifact=Math.abs(calcDifact1)
	
	if(calcDifact1<0){
	$(".st_itm_difnotes").html(" الرصيد الفعلي <strong style='color:red;'>أكثر</strong> من الرصيد المحسوب بكمية  "+calcDifact+" "+$(".st_itm_recbal_unit").text()+"  في "+$('#stock_names_recbal').find(":selected").text())
	}else if(calcDifact1>0){
	$(".st_itm_difnotes").html(" الرصيد الفعلي <strong style='color:red;'>أقل</strong> من الرصيد المحسوب بكمية "+calcDifact+" "+$(".st_itm_recbal_unit").text()+" في "+$('#stock_names_recbal').find(":selected").text())
	}else if (calcDifact1==0){
		$(".st_itm_difnotes").html(" الرصيد الفعلي <strong style='color:red;'>يساوي</strong> من الرصيد المحسوب بكمية "+calcDifact+" "+$(".st_itm_recbal_unit").text()+" في "+$('#stock_names_recbal').find(":selected").text())
	}
})
/// change the stock in record stock balance screen
$("#stock_names_recbal").change(function() {
	var selecteditem_id = $('#stock_itms_recbal').find(":selected").val();
	var selectedstock_id=$('#stock_names_recbal').find(":selected").val();
	$(".st_itm_difnotes").html("")
	$("#itm_recbal_qnty").val("")
	if(parseInt(selecteditem_id)==0){alert("يرجى اختيار صنف أولا");$('#stock_names_recbal').val(0);return false;}
	if(parseInt(selectedstock_id)==0){
		var postdata=selecteditem_id+'~0~0~0~1'
						$.post("php/acc_func.php",{param:'7~'+postdata},function(server_response) {
						data = $.parseJSON(server_response);
						
						var st_itm_rem=data[0].balance
						$(".st_name_bal").html("جميع المخازن : ")
						$(".st_itm_actbalance").html(st_itm_rem)
						$('#stock_names_recbal').val(0)
						})//end of balance ajax
	}else{
		var postdata=selecteditem_id+'~'+selectedstock_id+'~0~0~1'
						$.post("php/acc_func.php",{param:'7~'+postdata},function(server_response) {
						data = $.parseJSON(server_response);
						
						var st_itm_rem=data[0].balance
						$(".st_name_bal").html("رصيد "+$('#stock_names_recbal').find(":selected").text()+" : ")
						$(".st_itm_actbalance").html(st_itm_rem)
						})//end of balance ajax
		
	}
	
})///end of change stock func in record balance screen

/////// submit record actual balance 
$("#recbal-st-itm").click(function(){
var selecteditem_id = $('#stock_itms_recbal').find(":selected").val();
var selectedstock_id = $('#stock_names_recbal').find(":selected").val();
var actualbalance=$("#itm_recbal_qnty").val()
var actbalance = parseInt($('#itm_recbal_qnty').val());
var calcbalance= parseInt($(".st_itm_actbalance").text());
var calcDifact1= parseInt($(".st_itm_actbalance").text())-parseInt($('#itm_recbal_qnty').val())
var calcDifact=Math.abs(calcDifact1)
/////
var mov_typ,mov_usid,mov_itmid,mov_curstockid,mov_itmqnty,mov_itmunit,movdat,movnote,mov_tostockid,mov_itmprice,mov_buyerid,mov_profid,mov_itmtype
	mov_usid=$("#userid").val();
	mov_itmid=selecteditem_id
	mov_itmqnty=calcDifact
	mov_itmunit=parseInt($(".st_itm_recbal_unit").data("value"))
	movdat=frmtdatetimesql(1)
	movdattime=frmtdatetimesql(0)
	mov_itmprice=0
	mov_buyerid=0
	mov_profid=0
	mov_itmtype=2 /// row items , asset items will be added later
	mov_curstockid=selectedstock_id
	mov_tostockid=selectedstock_id
	
	///// if condition for either adding balance to the current stock or removing stock from the current stock
	if(calcDifact1>0){/// reduce the calcualted balance by adding transfer out stock balance
	
	mov_typ=8//reduce the balance by substracting from current calc balance
	movnote=" تصحيح رصيد نتيجة جرد فعلي للصنف "+$('#stock_itms_recbal').find(":selected").text()+" بحذف كمية "+mov_itmqnty+" "+$(".st_itm_recbal_unit").text()+" من "+$("#stock_names_recbal").find(":selected").text()+"  ملاحظة :  "+$(".st_itm_difnotes").text()
	
	}else if(calcDifact1<0){/// increase the calc balance by dif 
	mov_typ=7//reduce the balance by substracting from current calc balance
	movnote=" تصحيح رصيد نتيجة جرد فعلي للصنف "+$('#stock_itms_recbal').find(":selected").text()+" باضافة كمية "+mov_itmqnty+" "+$(".st_itm_recbal_unit").text()+" الى "+$("#stock_names_recbal").find(":selected").text()+"  ملاحظة :  "+$(".st_itm_difnotes").text()
	}

// verify inputs
if(selecteditem_id==0 || selectedstock_id==0 || actualbalance==""){alert("يرجى اختيار صنف واختيار مخزن وادخال الجرد الصحيح");return false;}
//process record the actual balance movement
/////update the balance table
//itm_id, st_id, act_balance, itm_qnty_unit, balance_notes,balance_dat,actbalance_dattime 
snd_data="12~"+mov_itmid+"~"+selectedstock_id+"~"+actbalance+"~"+mov_itmunit+"~"+movnote+"~"+movdat+"~"+movdattime

$.ajaxSetup({async:false});
$.post("php/acc_func.php",{param:snd_data},function(server_response) {
	if(server_response=="succeded"){
	/////record the item stock movement
buy_trn_spoil_ret_sals_stitem_mov(mov_typ,mov_usid,mov_itmid,mov_curstockid,mov_itmqnty,mov_itmunit,movdat,movnote,mov_tostockid,mov_itmprice,mov_buyerid,mov_profid,mov_itmtype)
/// reset form
$('#stock_itms_recbal').val(0)
$("#stock_names_recbal").val(0)
$("#itm_recbal_qnty").val("")
$(".st_itm_code_recbal").html("")
$(".st_itm_difnotes").html("")
$(".st_itm_actbalance").html("")
$(".st_itm_recbal_unit").html("")
$(".st_itm_recbal_unit").attr("data-value",0)
$(".st_itm_recbal_unit").data("value",0)
	}else{
	alert("عفوا حدث خطا اثناء حفظ البيانات " +server_response );
	}					
	});
	

})//end submit recording actual balance screen

/////// submit new stock itme limit 
$("#limits-st-itm").click(function(){
var selecteditem_id = $('#stock_itms_limits').find(":selected").val();
	
// verify inputs
if(selecteditem_id==0 || parseInt($("#itm_limits_qnty").val())<1){alert("يرجى اختيار صنف وادخال الحد الادنى الصحيح");return false;}
//process update limit
$.ajaxSetup({async:false});
$.post("php/acc_func.php",{param:'9~'+selecteditem_id+"~1~"+$("#itm_limits_qnty").val()},function(server_response) {
						data = $.parseJSON(server_response);
						for(var i = 0; i < data.length; i++){
						itm_limit=data[i].limit;/// get the selected itm stored measur unit
						}
						if(itm_limit==$("#itm_limits_qnty").val()){

						$('#stock_itms_limits').find(":selected").attr('data-limits',itm_limit)
						$('#stock_itms_limits').find(":selected").data('limits',itm_limit)
						alert("تم تحديث الحد الأدنى من رصيد الصنف")
						getitemslimits()//update the limits object
						drawlimitexceededitems(1)
						drawlimitexceededitems(0)
						//clear form
						$(".itemlimitinfo").html("")
						$("#itm_limits_qnty").val("")
						$(".st_itm_code_limits").html("")
						$('#stock_itms_limits').val(0)
						}else{
							alert("حدث خطأ اثناء تسجيل البيانات")
						}
})

})//end submit new itme
/////////////////click on submit spoil item
$("#spoil-st-itm").click(function(){
var selecteditem_id = $('#stock_itms_spoil').find(":selected").val();
// verify inputs
if(selecteditem_id==0 || parseInt($("#itm_spoil_qnty").val())<1 || parseInt($("#stock_names_spoil").val())==0  ){alert("يرجى اختيار صنف وادخال البيانات الصحيحة");return false;}
//process spoil the item quantity from the stock
var mov_typ,mov_usid,mov_itmid,mov_curstockid,mov_itmqnty,mov_itmunit,movdat,movnote,mov_tostockid,mov_itmprice,mov_buyerid,mov_profid,mov_itmtype
	mov_typ=4//spoil item from stock to stock
	mov_usid=$("#userid").val();
	mov_itmid=$('#stock_itms_spoil').find(":selected").val();
	mov_curstockid=$("#stock_names_spoil").find(":selected").val()
	mov_itmqnty=$("#itm_spoil_qnty").val()
	mov_itmunit=parseInt($(".st_itm_spoil_unit").data("value"))////
	movdat=frmtdatetimesql(1)
	mov_tostockid=$("#stock_names_spoil").find(":selected").val()
	mov_itmprice=0
	mov_buyerid=0
	mov_profid=$("#stock_spoil_prof").find(":selected").val()
	mov_itmtype=2 /// row items , asset items will be added later
	movnote=" تلف صنف  "+$("#stock_itms_spoil").find(":selected").text()+" بكمية "+$("#itm_spoil_qnty").val()+" "+$(".st_itm_spoil_unit").text()+" من مخزن "+$("#stock_names_spoil").find(":selected").text()+" تسبب في التلف "+$("#stock_names_spoil").find(":selected").text()
buy_trn_spoil_ret_sals_stitem_mov(mov_typ,mov_usid,mov_itmid,mov_curstockid,mov_itmqnty,mov_itmunit,movdat,movnote,mov_tostockid,mov_itmprice,mov_buyerid,mov_profid,mov_itmtype)
/// reset form
$("#stock_itms_spoil").val(0)
$("#stock_names_spoil").val(0)
$("#stock_spoil_prof").val(16)
$(".st_itm_spoil_unit").attr("data-value",0)
$(".st_itm_spoil_unit").data("value",0)
$("#itm_spoil_qnty").val("")
$(".st_itm_spoil_unit").html("")
$(".st_itm_code_spoil").html("")
$(".st_itm_rem_spoil").html("")

})//end submit spoil itme
///////////changing selected stock item in transfer stocks screen
$("#stock_itms_trans").change(function() {
	var selecteditem_id = $('#stock_itms_trans').find(":selected").val();
	$(".itemstockinfo").find(".stockinforow").remove()
	sel_itm_stocks={}
	/// show the item code in the html beside the selected item
	$(".st_itm_code_trans").html("كود الصنف : "+selecteditem_id)
	/// get item quantity unit from database based on item id
	$.post("php/db_query_fun.php",{param:'7~'+selecteditem_id},function(server_response) {
						data = $.parseJSON(server_response);
						for(var i = 0; i < data.length; i++){
						itm_qnty_unit=data[i].itm_qnty_unit;/// get the selected itm stored measur unit
						}
						var measurun=""
						if(selecteditem_id>0){
						measurun=measureunits[itm_qnty_unit]
						}else{
						measurun=""
						}
						///calculate the current total stock of all stocks for this item
						////	itm_id,stock_id,startdat,enddate,balanceonly
						var postdata=selecteditem_id+'~0~0~0~1'
						$.post("php/acc_func.php",{param:'7~'+postdata},function(server_response) {
						data = $.parseJSON(server_response);
						
						var st_itm_rem_trans=data[0].balance
						$(".st_itm_rem_trans").html("الرصيد الاجمالي : "+st_itm_rem_trans+" "+measurun)
						$(".st_itm_unit").html(measurun)
						$(".st_itm_unit").attr("data-value",itm_qnty_unit)
						$(".st_itm_unit").data("value",itm_qnty_unit)
						})//end of balance ajax
						////get stock of the item in all stocks and append to info div
						///loop in each stock object
						for(var key in stocknamesobj){
							////
						var poststdata=selecteditem_id+'~'+key+'~0~0~1'
						$.post("php/acc_func.php",{param:'7~'+poststdata},function(server_response) {
						data = $.parseJSON(server_response);
						var st_itm_rem_trans=data[0].balance
						var bal="الرصيد  : "+st_itm_rem_trans+" "+measurun
						$(".itemstockinfo").append("<div class='stockinforow'><div class='st_infoname'>"+stocknamesobj[key]+"</div><div class='st_infoval'>"+bal+"</div></div>")
						sel_itm_stocks[key]=st_itm_rem_trans
						//console.log(sel_itm_stocks)
						})//end of balance ajax
							////
						
						}
	});
});//end change dropdown func

////click to process transfer of stock item between stocks

$("#trans-st-itm").click(function(){
	var mov_typ,mov_usid,mov_itmid,mov_curstockid,mov_itmqnty,mov_itmunit,movdat,movnote,mov_tostockid,mov_itmprice,mov_buyerid,mov_profid,mov_itmtype
	mov_typ=3//transfer item from stock to stock
	mov_usid=$("#userid").val();
	mov_itmid=$("#stock_itms_trans").find(":selected").val()
	mov_curstockid=$("#stock_names_from").find(":selected").val()
	mov_itmqnty=$("#itm_trans_qnty").val()
	mov_itmunit=parseInt($(".st_itm_unit").data("value"))
	movdat=frmtdatetimesql(1)
	mov_tostockid=$("#stock_names_to").find(":selected").val()
	mov_itmprice=0
	mov_buyerid=0
	mov_profid=0
	mov_itmtype=2 /// row items , asset items will be added later
	movnote=" تحويل/صرف رصيد صنف "+$("#stock_itms_trans").find(":selected").text()+" بكمية "+$("#itm_trans_qnty").val()+" "+$(".st_itm_unit").text()+" من مخزن "+$("#stock_names_from").find(":selected").text()+" الى مخزن "+$("#stock_names_to").find(":selected").text()
	//sel_itm_stocks
///verify stock balances and inputs to move stocks
if(mov_itmid==0 || mov_curstockid==0 || mov_tostockid==0 || mov_itmqnty<1 ){alert("يرجى اختيار/ادخال البيانات الصحيحة");return false;}
if(mov_curstockid==mov_tostockid){alert("لايمكن تحويل/صرف رصيد من والى نفس المخزن");return false;}
if(parseInt(mov_itmqnty)>parseInt(sel_itm_stocks[mov_curstockid])){alert("لايمكن تحويل/صرف رصيد اكثر من الرصيد المتاح في المخزن");return false;}
buy_trn_spoil_ret_sals_stitem_mov(mov_typ,mov_usid,mov_itmid,mov_curstockid,mov_itmqnty,mov_itmunit,movdat,movnote,mov_tostockid,mov_itmprice,mov_buyerid,mov_profid,mov_itmtype)
/// reset form
$("#stock_itms_trans").val(0)
$("#stock_names_from").val(0)
$("#stock_names_to").val(0)
$(".st_itm_unit").attr("data-value",0)
$(".st_itm_unit").data("value",0)
$("#itm_trans_qnty").val("")
$(".itemstockinfo").find(".stockinforow").remove()
$(".st_itm_unit").html("")
$(".st_itm_code_trans").html("")
$(".st_itm_rem_trans").html("")

})
///////////////// stock item type change function //////

$("#st_itm_type").change(function() {
	var selecteditem_id = $('#st_itm_type').find(":selected").val();
	var selecteditem_desc=$('#st_itm_type').find(":selected").attr('itm_type_desc');
	////alert(selecteditem_desc);
	$("#itm_type_desc").html(selecteditem_desc);

	
});
//////////////////////////////////////////////////////////////////////

///// stock - buy item screen - click on save button
$("#save-new-st-itm").click(function() {
////// the user selected to buy new or existing item - 0- new item , 1- existing item
var sel_itm_knewold = $("#stock_new_old").jqxDropDownList('getSelectedItem');
/////// existing items only variables
var st_exist_item_selected=$('#stock_itms').find(":selected")
var st_exist_item_id=$('#stock_itms').find(":selected").val();
///// buy new items variables
var st_new_item_id=parseInt($("#item-code").text());
var itm_sname=$("#itm_sname");
var itm_lname=$("#itm_lname");
var itm_desc=$("#itm_desc");
var itm_notes=$("#itm_notes");
var itm_price=$("#itm_price");
/// buy new or existing itmes variables
var userid=$("#userid1").val();/// user id value
var itm_qnty=$("#st_itm_qnty"); // quantity of the item
var itm_qnty_unit_selected=$("#unit_measure"); // the measurement unit of the quantity;
var stock_names_selected=$("#stock_names"); // the selected stock
var stock_buyer=$("#stock_buyer");  /// the selected buyer of the item
var st_itm_type=$("#st_itm_type");  // the selected item type

//// check if the item is new or exist to do action based on this and to select wich feilds to save

if(sel_itm_knewold.value=="0"){// selected to buy new itme

//// steps of saving buying new stock item
//// 1- insert item in stock items table
//// 2- insert stock item movment into st mov table

//// 3- update stock balance in st balance table if balance is less than limit show in the dashboard

//// 4- add acc_mov_movment according to bought from cash or by someone
//// 5- if item is bought from cashier insert -ve into cash tbl, if bought by someone, insert +ve to profiles tbl
//// 6- insert purchase in purch table

if(validate_st_items_buy(1)){
	///insert item in stock items table : parameters : itm_sname.val()+'~'+itm_lname.val()+'~'+st_itm_type.val()+'~'+itm_desc.val()+'~'+itm_price.val()+'~'+userid+'~'+itm_qnty_unit_selected.val()+'~'+groupid
	
if (stock_buyer.val()==0){
var boughtby=0
}else{
var boughtby=1

}
var st_itm_mov_typ=2 //// 1 sell , 2 buy , 3 transfer , 4 spoil, 5 return, 6 add sales item
var groupid=0;
var st_itm_mov_qnty
var st_itm_dat=frmtdatetimesql(1);/// now date
var st_itm_time=frmtdatetimesql(2);/// now time
var item_mov_notes="شراء رصيد مخزن من "+itm_sname.val()+" بكمية "+itm_qnty.val()+" "+itm_qnty_unit_selected.find(":selected").text()+" بسعر "+itm_price.val()+" جنيه تم الشراء بواسطة "+stock_buyer.find(":selected").text()+" الى "+stock_names_selected.find(":selected").text(); /// add descriptive notes about the movment 
//alert(boughtby)
/////parameters : boughtby int = cashier 0 or profileid 1
	//itmsname,itmlname,itm_type , itm_desc text ,itm_price , userid , itm_qnty_unit , groupid , st_itm_mov_typ , st_itm_mov_cur_stid  , st_itm_mov_qnty , st_itm_mov_dat , st_itm_mov_time , st_itm_mov_notes , st_itm_mov_to_st , buyerid )

var snddata='15~'+boughtby+'~'+itm_sname.val()+'~'+itm_lname.val()+'~'+st_itm_type.val()+'~'+itm_desc.val()+'~'+parseFloat(itm_price.val())+'~'+userid+'~'+itm_qnty_unit_selected.val()+'~'+groupid+'~'+st_itm_mov_typ+'~'+stock_names_selected.val()+'~'+itm_qnty.val()+'~'+st_itm_dat+'~'+st_itm_time+'~'+item_mov_notes+'~'+stock_names_selected.val()+'~'+stock_buyer.val()+'~'+0;
//alert(snddata)
$.ajaxSetup({async:false});
$.post("php/db_query_fun.php",{param:snddata},function(server_response) {
	if(server_response=="succeded"){
	alert("تم اضافة الصنف بنجاح");
	}else{
	alert("عفوا حدث خطا اثناء حفظ البيانات " +server_response );
	}					
	});
	
	/////////////////////////////// reset all fields values and populate options based on changes, also update the new item code
	
	populateBuyerlist();
	populatestocknameslist();
	populateexistingstockitems(2);
	populateexistingstockitems(3);
	
	//////////////////initialize select options to default
	initializeoptions();
}else{
alert("يرجى ادخال البيانات الصحيحة");	
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

	/////////////////////////////////////////////////BUY EXISTING ITEM /////////////////////////////////////
	
	}else if(sel_itm_knewold.value=="1"){
	//// verify inputs for buying existing item
	
	if(validate_st_items_buy(0)){
		///insert item in stock items table : parameters : itm_sname.val()+'~'+itm_lname.val()+'~'+st_itm_type.val()+'~'+itm_desc.val()+'~'+itm_price.val()+'~'+userid+'~'+itm_qnty_unit_selected.val()+'~'+groupid
	
if (stock_buyer.val()==0){
var boughtby=0
}else{
var boughtby=1

}
var st_itm_mov_typ=2 //// 1 sell , 2 buy , 3 transfer , 4 spoil, 5 return, 6 add sales item
var groupid=0;
var st_itm_mov_qnty
var st_itm_dat=frmtdatetimesql(1);/// now date
var st_itm_time=frmtdatetimesql(2);/// now time
var item_mov_notes="شراء رصيد مخزن من "+st_exist_item_selected.text()+" بكمية "+itm_qnty.val()+" "+itm_qnty_unit_selected.find(":selected").text()+" بسعر "+itm_price.val()+" جنيه تم الشراء بواسطة "+stock_buyer.find(":selected").text()+" الى "+stock_names_selected.find(":selected").text(); /// add descriptive notes about the movment 
//alert(boughtby)
/////parameters : boughtby int = cashier 0 or profileid 1
	//itmsname,itmlname,itm_type , itm_desc text ,itm_price , userid , itm_qnty_unit , groupid , st_itm_mov_typ , st_itm_mov_cur_stid  , st_itm_mov_qnty , st_itm_mov_dat , st_itm_mov_time , st_itm_mov_notes , st_itm_mov_to_st , buyerid )

var snddata='15~'+boughtby+'~'+itm_sname.val()+'~'+itm_lname.val()+'~'+st_itm_type.val()+'~'+itm_desc.val()+'~'+parseFloat(itm_price.val())+'~'+userid+'~'+itm_qnty_unit_selected.val()+'~'+groupid+'~'+st_itm_mov_typ+'~'+stock_names_selected.val()+'~'+itm_qnty.val()+'~'+st_itm_dat+'~'+st_itm_time+'~'+item_mov_notes+'~'+stock_names_selected.val()+'~'+stock_buyer.val()+'~'+st_exist_item_id;
//alert(snddata)
$.ajaxSetup({async:false});
$.post("php/db_query_fun.php",{param:snddata},function(server_response) {
	if(server_response=="succeded"){
	alert("تم اضافة الصنف بنجاح");
	}else{
	alert("عفوا حدث خطا اثناء حفظ البيانات " +server_response );
	}					
	});
	
	/////////////////////////////// reset all fields values and populate options based on changes, also update the new item code
	
	populateBuyerlist();
	populatestocknameslist();
	populateexistingstockitems(2);
	populateexistingstockitems(3);
	
	//////////////////initialize select options to default
	initializeoptions();


	}else{
	alert("يرجى ادخال البيانات الصحيحة");	
	}
	}
	
	/////// 
	
});///// end of save click
	
});//// end of document ready


///////////////////////processing stock functions /////////////////

/////////function to transfer-spoil-buy-return items
function buy_trn_spoil_ret_sals_stitem_mov(mov_typ,usid,itmid,curstockid,itmqnty,itmunit,movdat,movnote,tostockid,itmprice,buyerid,profid,itmtype){
	var posteddata="8~"+mov_typ+"~"+usid+"~"+itmid+"~"+curstockid+"~"+itmqnty+"~"+itmunit+"~"+movdat+"~"+movnote+"~"+tostockid+"~"+itmprice+"~"+buyerid+"~"+profid+"~"+itmtype
//13 parameter
	//	st_itm_mov_typ(1:sell,2:buy,3:transf,4:spoil,5:return)
	//st_itm_mov_usrid, st_itm_mov_itmid,  st_itm_mov_cur_stid,st_itm_mov_qnty , st_itm_mov_qnty_unit,  st_itm_mov_dat, st_itm_mov_notes,  st_itm_mov_to_st,  st_itm_mov_price, st_itm_mov_buyerid ,  st_itm_mov_profid,  
	//st_itm_mov_itm_typ (type of item 1: assets, 2:row material,4: prepared items)	
	$.ajaxSetup({async:false});
$.post("php/acc_func.php",{param:posteddata},function(server_response) {
	if(server_response=="succeded"){
	alert("تمت حركة الصنف بنجاح");
	}else{
	alert("عفوا حدث خطا اثناء حفظ البيانات " +server_response );
	}					
	});
}

///// show and generate out of stock items in rows ////
function showoutofstockitemsrows(){
	
}
////// validate inputs for buy stock screen when saving 
function validate_st_items_buy(exis_new1){
 //////set all input variables for old or new buying item/////
 /// buy existing item only
var ex_stock_itm_selected=$('#stock_itms'); //// option value (integer)
/// buy new item only
var itm_sname=$("#itm_sname");
var itm_lname=$("#itm_lname");
var itm_desc=$("#itm_desc");
var itm_notes=$("#itm_notes");
var itm_price=$("#itm_price");
/// buy new or existing itmes 
var userid=$("#userid1").val();/// user id value
var itm_qnty=$("#st_itm_qnty"); // new or existing
var itm_qnty_unit_selected=$("#unit_measure"); // existing or new itm;
var stock_names_selected=$("#stock_names"); // new or existing
var stock_buyer=$("#stock_buyer");  /// new or existing
var st_itm_type=$("#st_itm_type");

if(exis_new1==1){ //// validate new item fields

//// validate item short name
if(itm_sname.val()=="") {alert("يرجى كتابة الاسم القصير للصنف") ;itm_sname.focus();return false;}
if(!validateLength(itm_sname,4) ){alert("الاسم يجب أن لا يقل عن 5 حروف ولا يزيد عن 20 حرف") ;itm_sname.focus();return false;}

//// validate item long name
if(itm_lname.val()=="") {alert("يرجى كتابة الاسم الكامل للصنف") ;itm_lname.focus();return false;}
if(!validateLength(itm_lname,4) ){alert("الاسم يجب أن لا يقل عن 5 حروف") ;itm_lname.focus();return false;}

// if selecetd item type is ready for sale products validated the price field
var selecteditem_id = $('#st_itm_type').find(":selected").val();
if(parseInt(selecteditem_id)==3){/// if item type is ready for sale item validate price field
	if(itm_price.val()=="") {alert("يرجى كتابة سعر الشراء للصنف") ;itm_price.focus();return false;}
	}else{
		if(itm_price.val()=="") {alert("يرجى كتابة سعر الشراء للصنف") ;itm_price.focus();return false;}
	
	}
	
}else if(exis_new1==0){//// validate existing item fields

////// validate if existing itme  is selected
if(!validateSelection(ex_stock_itm_selected)){ex_stock_itm_selected.focus();return false;}

}
//// validate existing or new items 
/////// validate quantity feild
if(itm_qnty.val()=="") {alert("يرجى كتابة كمية الصنف") ;itm_qnty.focus();return false;}
/////// validate price feild
if(itm_price.val()=="") {alert("يرجى كتابة سعر شراء الكمية من الصنف") ;itm_price.focus();return false;}

/////// validate quantity measure unit is selected
if(!validateSelection(itm_qnty_unit_selected)){return false;}
////// validate if item type is selected
if(!validateSelection(st_itm_type)){return false;}
////////////// validate if stock name is selected
if(!validateSelection(stock_names_selected)){return false;}
////// validate if buyer is selected defult buyer is the cashier
//if(!validateSelection(stock_buyer)){return false;}
if(stock_buyer.find(":selected").val()=="0"){alert(" عمليه الشراء تمت من الخزينة");}




return true;
}

////////////////reset select option selected item to the initial value
function resetselectoptions(selector){
	$(selector).val(0);
						
};
/////////////fucntion to enable and desable elements using parameter=selector
function ena_dis_element(selector,ena1){
	if(ena1==1){
	$(selector).prop('disabled', false);
	}else{
	$(selector).prop('disabled', true);
	}
}
////////////////////validation functions//////////////////
//// validate that user selected option with value not zero
function validateSelection(selector){
	selectedValue=parseInt($(selector).find(":selected").val());
	if(selectedValue==0){
		alert("يرجى اختيار احد الاختيارات") ;selector.focus();
		return false;	
	}else{
	return true;	
	}
	
}

/// update the item code based on the latest item id in stock items table from database
function update_newitem_code(){
$.post("php/db_query_fun.php",{param:'3~stock_items'},function(server_response) {
					$("#item-code").html(parseInt(server_response));
					$("#sales_item-code").html(parseInt(server_response));
					
});
}
/////////// stock units measure list
var measureunits={};// store measure units names in an object
var sel_itm_stocks={} ///store selected items stocks in an object for transfer item stocks sub page

function populatestunitmeasurelist(){
	//// delete all options and regenerate them
	$("#unit_measure").find('option').remove();
 	$("#unit_measure_row").find('option').remove();
 
$.ajaxSetup({async:true});
$.post("php/db_query_fun.php",{param:'2~'},function(server_response) {
					$("#unit_measure").append(' <option value="0">اختر وحدة القياس</option>');
                  	$("#unit_measure_row").append(' <option value="0">اختر وحدة القياس</option>');
                  	measureunits={}
					data = $.parseJSON(server_response);
					for(var i = 0; i < data.length; i++){
						measureunits[data[i].unit_id] = data[i].unit_name;
						
                  	$("#unit_measure").append('<option value='+data[i].unit_id+'>'+data[i].unit_name+'</option>');
                  	$("#unit_measure_row").append('<option value='+data[i].unit_id+'>'+data[i].unit_name+'</option>');
                  	
					}
});
}
/////////// stock buyers list
function populateBuyerlist(){
	//// delete all options and regenerate them
	$("#stock_buyer").find('option').remove();
	$("#stock_spoil_prof").find('option').remove();
 
 	//// regenerate the options list
$.post("php/db_query_fun.php",{param:'5~'},function(server_response) {
						data = $.parseJSON(server_response);
						$("#stock_buyer").append('<option value="0">الخزينة</option>');
						$("#stock_spoil_prof").append('<option value="16">عميل</option>');
                  		<!--$("#stock_buyer").append('<option value="6">الخزينة</option>');-->
                  		
						for(var i = 0; i < data.length; i++){
                  		$("#stock_buyer").append('<option value='+data[i].prof_id+'>'+data[i].prof_name+'</option>');
						$("#stock_spoil_prof").append('<option value='+data[i].prof_id+'>'+data[i].prof_name+'</option>');
                  		}
});
}
////////// populate stock name list
///stock names object
var stocknamesobj={}
function populatestocknameslist(){

//// delete all options and regenerate them
	$("#stock_names").find('option').remove();
	$("#stock_names_from").find('option').remove();
	$("#stock_names_to").find('option').remove();
	$("#stock_names_spoil").find('option').remove();
	$("#stock_names_recbal").find('option').remove();
	$("#stock_names_rep").find('option').remove();
	
	
stocknamesobj={}
//// regenerate the options list
$.ajaxSetup({async:true});
$.post("php/db_query_fun.php",{param:'1~'},function(server_response) {
					data = $.parseJSON(server_response);
					$("#stock_names").append('<option value="0">اختر المخزن</option>');
					$("#stock_names_from").append('<option value="0">اختر المخزن</option>');
					$("#stock_names_to").append('<option value="0">اختر المخزن</option>');
                  	$("#stock_names_spoil").append('<option value="0">اختر المخزن</option>');
					$("#stock_names_recbal").append('<option value="0">اختر المخزن</option>');
					$("#stock_names_rep").append('<option value="0">كل المخازن</option>');
					
					for(var i = 0; i < data.length; i++){
						if(data[i].st_id!=5){
					stocknamesobj[data[i].st_id]=data[i].st_name
					//console.log(stocknamesobj)
                  	$("#stock_names").append('<option value='+data[i].st_id+'>'+data[i].st_name+'</option>');
					$("#stock_names_from").append('<option value='+data[i].st_id+'>'+data[i].st_name+'</option>');
					$("#stock_names_to").append('<option value='+data[i].st_id+'>'+data[i].st_name+'</option>');
					$("#stock_names_spoil").append('<option value='+data[i].st_id+'>'+data[i].st_name+'</option>');
					$("#stock_names_recbal").append('<option value='+data[i].st_id+'>'+data[i].st_name+'</option>');
					$("#stock_names_rep").append('<option value='+data[i].st_id+'>'+data[i].st_name+'</option>');
						}
                  	}
});
}
//////////populate stock item types list

function populatestockitemtypeslist(){
	//// delete all options and regenerate them
	$("#st_itm_type").find('option').remove();

$.ajaxSetup({async:false});
$.post("php/db_query_fun.php",{param:'8~'},function(server_response) {
					data = $.parseJSON(server_response);
					$("#st_itm_type").append('<option value="0">اختر نوع الصنف</option>');
                  	
					for(var i = 0; i < data.length; i++){
                  	$("#st_itm_type").append('<option value='+data[i].itm_type_id+'  itm_type_desc="'+data[i].itm_type_desc+'">'+data[i].itm_type_name+'</option>');
					
                  	}
});
}
// get the list of existing stock items frm db execlude stoc item with type 4 (sales items)
 /// additiona parameter is setting 1= select all stock types, 2- select all types exept type4(sales), 3- select all types exept type1Assets,type4sales, 4-select
 var stockitemslist={}///stockitmes list object

function populateexistingstockitems(setting){
switch(setting){
case 2:/// all items expt sales items
//// delete all options and regenerate them
	$("#stock_itms").find('option').remove();
	$("#stock_itms_trans").find('option').remove();
	$("#stock_itms_limits").find('option').remove();
	$("#stock_itms_spoil").find('option').remove();
	$("#stock_itms_recbal").find('option').remove();
	$("#stock_itms_rep").find('option').remove();
	
//// regenerate the options list
$.post("php/db_query_fun.php",{param:'4~2'},function(server_response) {
						data = $.parseJSON(server_response);
						$("#stock_itms").append(' <option value="0">اختر الصنف</option>');
						$("#stock_itms_trans").append(' <option value="0">اختر الصنف</option>');
						$("#stock_itms_limits").append(' <option value="0">اختر الصنف</option>');
						$("#stock_itms_spoil").append(' <option value="0">اختر الصنف</option>');
						$("#stock_itms_recbal").append(' <option value="0">اختر الصنف</option>');
						$("#stock_itms_rep").append(' <option value="0">كافة الأصناف</option>');
                  	
						for(var i = 0; i < data.length; i++){
                  		$("#stock_itms").append('<option value='+data[i].itm_id+'>'+data[i].itm_name+'</option>');
						$("#stock_itms_spoil").append('<option value='+data[i].itm_id+'>'+data[i].itm_name+'</option>');
                  		$("#stock_itms_trans").append('<option value='+data[i].itm_id+'>'+data[i].itm_name+'</option>');
						$("#stock_itms_limits").append('<option data-limits='+data[i].itm_limit+' value='+data[i].itm_id+'>'+data[i].itm_name+'</option>');
						$("#stock_itms_recbal").append('<option data-limits='+data[i].itm_limit+' value='+data[i].itm_id+'>'+data[i].itm_name+'</option>');
						$("#stock_itms_rep").append('<option data-limits='+data[i].itm_limit+' value='+data[i].itm_id+'>'+data[i].itm_name+'</option>');
						stockitemslist[data[i].itm_id]={"itmname":data[i].itm_name,"itmlimit":data[i].itm_limit}
						//console.log(stockitemslist)
                  		}
});
break;

case 3:///row itmes only
//// delete all options and regenerate them
	$("#stock_row_itms").find('option').remove();
//// regenerate the options list
$.post("php/db_query_fun.php",{param:'4~3'},function(server_response) {
						data = $.parseJSON(server_response);
						$("#stock_row_itms").append(' <option value="0">اختر الصنف</option>');
                  	
						for(var i = 0; i < data.length; i++){
                  		$("#stock_row_itms").append('<option value='+data[i].itm_id+'>'+data[i].itm_name+'</option>');
						}
});
}//switch end
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////Add new Menu Stock Item //////////////////////////////////////////////////////




//////////////////////////////////////////changing selected items code //////////////
$(document).ready(function() {
///// used variables
var itm_sales_sname=$("#itm_sales_sname"); // short name sales item control ///text input
var itm_sales_lname=$("#itm_sales_lname");// long name sales item control ///text input
var itm_sales_desc=$("#itm_sales_desc");// description sales item control ///text input

var itm_typ4_group=$("#itm_typ4_group");// selection of group name of sales item control ///select
var itm_sales_price=$("#itm_sales_price");// sales price of the sales item  - control ///text input
var stock_row_itms=$("#stock_row_itms");// stock existing items execluding sales items - sales item control ///select input

var st_row_itm_qnty=$("#st_row_itm_qnty");// quantity of each row item for creating sales item - sales item control ///select input
var unit_measure_row=$("#unit_measure_row");// measurment of selected row item - sales item control ///select input

//initializesalesitems();
//////// delet a row from ingradients items in the table - add sales item sub page
$(document).on('click','div.ingr_remove',function(){
            var $rows =  $("#ingr_tbl_datarows"),
            rowid = $(this).parent().parent().data('value');
           // //alert(rowid);
		   ingr_id=$(this).parent().parent().find('.ingr_name').data('value');
		  // //alert(ingr_nametxt);
		   ingr_items_row_json(2,rowid,ingr_id,0,0,0,0);
                        
});

$("#save-sales-st-itm").click(function() {
	//savesalesitem();
	//// variables
var userid=$("#userid1").val();/// user id value
var st_new_item_id=parseInt($("#sales_item-code").text());
var salse_itm_id	
var itm_sales_sname=$("#itm_sales_sname"); // short name sales item control ///text input
var itm_sales_lname=$("#itm_sales_lname");// long name sales item control ///text input
var itm_sales_desc=$("#itm_sales_desc");// description sales item control ///text input
var itm_typ4_group=$("#itm_typ4_group");// selection of group name of sales item control ///select
var itm_sales_price=$("#itm_sales_price");// sales price of the sales item  - control ///text input
var stock_row_itms=$("#stock_row_itms");// stock existing items execluding sales items - sales item control ///select input
var st_row_itm_qnty=$("#st_row_itm_qnty");// quantity of each row item for creating sales item - sales item control ///select input
var unit_measure_row=$("#unit_measure_row");// measurment of selected row item - sales item control ///select input
	//// validattion
	
//// validate item short name
if(itm_sales_sname.val()=="") {alert("يرجى كتابة الاسم القصير للصنف") ;itm_sales_sname.focus();return false;}
if(!validateLength(itm_sales_sname,4) ){alert("الاسم يجب أن لا يقل عن 5 حروف ولا يزيد عن 20 حرف") ;itm_sales_sname.focus();return false;}

//// validate item long name
if(itm_sales_lname.val()=="") {alert("يرجى كتابة الاسم الكامل للصنف") ;itm_sales_lname.focus();return false;}
if(!validateLength(itm_sales_lname,4) ){alert("الاسم يجب أن لا يقل عن 5 حروف") ;itm_sales_lname.focus();return false;}
//// validate item desc name
if(itm_sales_desc.val()=="") {alert("يرجى كتابة وصف الصنف") ;itm_sales_desc.focus();return false;}
if(!validateLength(itm_sales_desc,4) ){alert(" يجب أن لا يقل عن 5 حروف") ;itm_sales_desc.focus();return false;}
//// validate item selected group name
if(!validateSelection(itm_typ4_group)){return false;}
//// validate item price
if(itm_sales_price.val()=="") {alert("يرجى كتابة سعر بيع الصنف") ;itm_sales_price.focus();return false;}
///// validated that item includes at least one ingr
//alert(document.ingrs_obj.row.length)
ingarr=parseInt(document.ingrs_obj.row.lenght)
if(!document.ingrs_obj.row.length){alert("يجب ان يتكون صنف البيع على الاقل من صنف واحد");stock_row_itms.focus();return false;}

///prepare variables
//// prepare for stock itmes table
var st_itm_type=4;
itm_qnty_unit_selected=7;
itm_group_name=itm_typ4_group.find(":selected").text()
itm_group_id=itm_typ4_group.val();
///////////////////////////////////////////////////////// insert new items data to stock items table
//alert()
$.post("php/db_query_fun.php",{param:'9~'+itm_sales_sname.val()+'~'+itm_sales_lname.val()+'~'+st_itm_type+'~'+itm_sales_desc.val()+'~'+itm_sales_price.val()+'~'+userid+'~'+itm_qnty_unit_selected+'~'+itm_group_id},function(server_response) {
	if(server_response=="succeded"){
	alert("تم اضافة الصنف بنجاح");
	}else{
	alert("عفوا حدث خطا اثناء حفظ البيانات");
	}					
	});

//////////////////////////////////////////////////////// insert stock movement with buy item movment
	
	var movment_setting=2; //// insert - setting 2=buy item movement
	var ItemMovmentType=6; /// add sales item
	stock_names_id=5;/// imaginary stock for sales items
	itm_qnty=1;
	var item_mov_notes="اضافة صنف بيع - مينيو  "+itm_sales_sname.val()+" نوع الصنف - صنف نحضر للبيع كود وحدة الصنف "+itm_qnty_unit_selected+" تحت مجموعة "+itm_group_name+" بسعر بيع "+itm_sales_price.val()+" جنيه - كود المستخدم مدخل الصنف  "+userid+" الى مخزن "+stock_names_id; /// add descriptive notes about the movment 
	var st_itm_mov_profid=userid;// the id for profile used mostly in damage spoil item to identry who spoiled the itme/ in buying we use buyerid
	$.post("php/db_query_fun.php",{param:'10~'+movment_setting+'~'+ItemMovmentType+'~'+userid+'~'+st_new_item_id+'~'+stock_names_id+'~'+itm_qnty+'~'+itm_qnty_unit_selected+'~'+item_mov_notes+'~'+stock_names_id+'~'+itm_sales_price.val()+'~'+userid+'~'+st_itm_mov_profid+'~'+st_itm_type},function(server_response) {
	if(server_response=="succeded"){
	alert("تم اضافة حركة الصنف بنجاح");
	}else{
	alert("عفوا حدث خطا اثناء حفظ  حركة الصنف");
	}					
	});
//// prepare for items ingradients table
document.ingrs_obj.sales_itm_id=st_new_item_id;
document.ingrs_obj.userid=userid;
var rows=new Array();
for(as=0;as<document.ingrs_obj.row.length;as++){
rows[as]=new Array();	
}
//var =[[0,0,0,0,0]];
//for(i=0;i<document.ingrs_obj.row.length;i++){
	for(a=0;a<document.ingrs_obj.row.length;a++){
rows[a][0]=document.ingrs_obj.row[a].ingr_itm_id
rows[a][1]=document.ingrs_obj.sales_itm_id 
rows[a][2]=document.ingrs_obj.row[a].ingr_itm_qnty 
rows[a][3]=document.ingrs_obj.row[a].ingr_itm_qnty_unit_id 
rows[a][4]=document.ingrs_obj.userid
rows[a][5]=document.ingrs_obj.row[a].ingr_itm_cost 
	}
//}

/// ingitem id , ingitemQnty , ingitemqntUnit , updatedate, timestamp, userid


//////////////////////////////////////////////////////// insert sales item ingradients 
$.post("php/db_query_fun.php",{param:'14~'+st_new_item_id,'param2[][]':rows},function(server_response) {
	//alert(server_response)
	if(server_response=="succeded"){
	alert("تم اضافة مكونات الصنف بنجاح");
	}else{
	alert("عفوا حدث خطا اثناء حفظ  اضافة مكونات الصنف");
	}					
	});

	
initializesalesitems();
initializeoptions();
update_newitem_code();
//-=initialize_stock_sub_pages();

});

$("#addrowitem").click(function() {
	var st_row_itm_qnty=$("#st_row_itm_qnty");// quantity of each row item for creating sales item - sales item control ///select input
if(st_row_itm_qnty.val()==""){alert('يجب كتابة كمية الاستهلاك من الصنف قبل اضافته');st_row_itm_qnty.focus();return false;}
	ingr_id=parseInt($("#stock_row_itms").val());
	ingr_items_row_json(1,0,stock_row_itms.val(),stock_row_itms.find(":selected").text(),st_row_itm_qnty.val(),unit_measure_row.val(),unit_measure_row.find(":selected").text());	

});

///// click on buttons in stock reports screen
$(".fullstockreport").click(function() {
	$(".allstreports").show();
	$(".stocksalesreports").hide();
	///reset optoins
	$(".periodfromto").hide();
	$("#repperiod_dd").val(0);
	$("#reptype_dd").val(0);
	$("#stock_names_rep").val(0);
	$("#stock_itms_rep").val(0);
	
	

})

$(".stockitemssales").click(function() {
	$(".allstreports").hide();
	$(".stocksalesreports").show();
	///reset optoins

})
///////////////////////////////////stock reports events ///////////////////////
///stock report dropdown change
$("#repperiod_dd").change(function() {
	var selectedperiod_id = $('#repperiod_dd').find(":selected").val();
	if(selectedperiod_id==2){
		$(".periodfromto").show();
	}else{
		$(".periodfromto").hide();
	}
})
$("#showallstockrep").click(function(){
	///verify data
	if(parseInt($("#repperiod_dd").find(":selected").val())==2){
		var fromdat=new Date($("#rep1periodfrom").val()).getTime()
		var todate=new Date($("#rep1periodto").val()).getTime()
		if(!isNaN(fromdat) || !isNaN(todate)){alert("يرجى اختيار تاريخ");return false;}
		if(fromdat>todate){alert("يجب ان يكون تاريخ بداية التقرير  قبل تاريخ النهاية");return false;}
	}
	///according to selection show the report
	var selectedperiod_id =parseInt($('#stock_itms_rep').find(":selected").val());
	if(selectedperiod_id==0){
		getreportobj()
		showstockreport(getfulldatastockreportallitems(),"تقرير حركة المخزن")
	}else{
		getreportobj()
		showstockreport(getfulldatastockreport(selectedperiod_id),"تقرير حركة الخزينة")	
	}
})///end click on show report
///////////changing stock existing items to aler quantity unit
$("#stock_row_itms").change(function() {
	var selecteditem_id = $('#stock_row_itms').find(":selected").val();
	/// get item quantity unit from database based on item id
	$.ajaxSetup({async:false});
	$.post("php/db_query_fun.php",{param:'7~'+selecteditem_id},function(server_response) {
						data = $.parseJSON(server_response);
						for(var i = 0; i < data.length; i++){
						itm_qnty_unit=data[i].itm_qnty_unit;/// get the selected itm stored measur unit
						itm_type=data[i].itm_type;//// get the selected itm stored type
                  		}
						if(selecteditem_id>0){
						$("#unit_measure_row").val(itm_qnty_unit);
						$("#unit_measure_row").prop('disabled', true);
						}else{
						$("#unit_measure_row").prop('disabled', false);
						$("#unit_measure_row").val(0);	
						}
	});
});///// end of change function

itm_typ4_group.change(function(){
document.ingrs_obj.groupid=itm_typ4_group.val();
////alert(ingrs_obj.groupid)
});

});///// end of document ready




//function to populate dropdownlist of sales item groups
// make an empty object for containing ingradients parameters for table and to be inserted into database

function populatesalesitemgroups(){
$("#itm_typ4_group").find('option').remove();
$.ajaxSetup({async:false});
$.post("php/db_query_fun.php",{param:'12~st_sales_itm_gropus'},function(server_response) {
					data = $.parseJSON(server_response);
					$("#itm_typ4_group").append(' <option value="0">اختر التصنيف</option>');
                  	
					for(var i = 0; i < data.length; i++){
                  	$("#itm_typ4_group").append('<option value='+data[i].id+'  itm_type_desc="'+data[i].desc+'">'+data[i].name+'</option>');
                  	}
});
}
function calculateperunitcost(itm_id){
////alert(itm_id)
var costperunit
$.ajaxSetup({async:false});
$.post("php/db_query_fun.php",{param:'13~'+itm_id},function(server_response) {
					data = $.parseJSON(server_response);
					////alert(JSON.stringify(data));
					totalquantity=0;
					totalcost=0;
					for(var i = 0; i < data.length; i++){
                  	totalquantity+=parseFloat(data[i].qnty);
					totalcost+=parseFloat(data[i].cost);
					}

					costperunit=totalcost/totalquantity

});
	return costperunit;
}
/// function to view/edit/remove ingradient items in a table
function addingritemtotable(i,rowid){
	//alert("i "+i+" row id "+rowid)
var rowtoadd="<div class='ingr_tbl_row' data-value='"+parseInt(rowid)+"'><div class='ingr_name_col ingr_row_col'><div data-value='"+document.ingrs_obj.row[i].ingr_itm_id+"' class='ingr_name' >"+document.ingrs_obj.row[i].ingr_itm_name+"</div></div><div class='ingr_qunt_col ingr_row_col'><div  class='ingr_qunty' >"+document.ingrs_obj.row[i].ingr_itm_qnty+" "+document.ingrs_obj.row[i].ingr_itm_qnty_unit_name+"</div></div><div class='ingr_cost_col ingr_row_col'><div id='ing_cost_1' class='ingr_cost' >"+document.ingrs_obj.row[i].ingr_itm_cost.toFixed(3)+"</div></div><div class='ingr_controls_col ingr_row_col'><div  row_id='"+rowid+"' class='ingr_remove' ><img id='delet_row"+rowid+"' align='middle' class='ingr_removes' src='images/del24.png'/></div></div></div>"
$("#ingr_tbl_datarows").append(rowtoadd);
}

/// function to view/edit/remove ingradient items in a table
function removeingritemfromtable(rowid){
var $rows =  $("#ingr_tbl_datarows")
$rows.find('div.ingr_tbl_row[data-value="' + rowid +'"]').slideUp("fast", function() 
            {
              $(this).remove();
            });
}

function initializesalesitems(){
//ingrs_obj.row.splice(0,ingrs_obj.row.length)
document.ingrs_obj = {};
document.ingrs_obj.row = new Array();
document.ingrs_obj.userid=0;
document.ingrs_obj.sales_itm_id=0;
document.ingrs_obj.sname="";
document.ingrs_obj.lname="";
document.ingrs_obj.desc="";
document.ingrs_obj.groupid=0;
document.datarow=0
$("#ingr_tbl_datarows").find('div.ingr_tbl_row').remove();
//alert(JSON.stringify(document.ingrs_obj));
}

function ingr_items_row_json(parmeter,rowid,ingr_itmid,ingr_itmname,ingr_itmqnty,ingr_itmuntid,ingr_itmuntname){ // parameter 1=add item 2=delete item , rowid is the row id to delet
////alert(ingr_itmid)
if(parmeter==1){  ///// add new row of ingr item data into json
var i=document.ingrs_obj.row.length

sss=$("#ingr_tbl_datarows").find('div.ingr_name[data-value="' + ingr_itmid +'"]')
if(sss.data('value')==ingr_itmid){
alert("تم اضافة هذا الصنف مسبقا !");
return false;
}
////alert(i)
document.ingrs_obj.row.push({});
document.ingrs_obj.row[i].ingr_itm_id = ingr_itmid;
document.ingrs_obj.row[i].ingr_itm_name = ingr_itmname;
document.ingrs_obj.row[i].ingr_itm_qnty = ingr_itmqnty;
document.ingrs_obj.row[i].ingr_itm_qnty_unit_id = ingr_itmuntid;
document.ingrs_obj.row[i].ingr_itm_qnty_unit_name = ingr_itmuntname;
document.ingrs_obj.row[i].ingr_itm_cost =ingr_itmqnty*parseFloat(calculateperunitcost(ingr_itmid));
addingritemtotable(i,document.datarow);
document.datarow++;
//alert(JSON.stringify(document.ingrs_obj));
}else if(parmeter==2){//// delete row item from the json

//ingrs_obj.row.splice(rowid, 1);
var removed=findAndRemove(document.ingrs_obj, rowid, ingr_itmid)
if(removed){
removeingritemfromtable(rowid);
}else{
alert("noting to remove")	
}
}
}
///// find element with key name and value equal any element in the array and remove it 
function findAndRemove(obj, rowid, value) {
	//var ii=0
	var array=obj.row
	var ingritmid=obj.row[0].ingr_itm_id
	var arrlength=array.length
	for(ii=0;ii<arrlength;ii++){
		ingritmid=obj.row[ii].ingr_itm_id
		ingritmid=parseInt(ingritmid);
		////alert("ii "+ii+" value "+value+"  ingitmid "+ingritmid)
	
	if(ingritmid==value){
			//alert("mached "+ingritmid+" "+value)
			array.splice(ii, 1);
			////alert(JSON.stringify(obj.row))
			//alert(JSON.stringify(document.ingrs_obj.row))
			return true;	
		}
	}
	return false;
}
//object to store all items limits based on itm id
var itmlimits={}
//function to fill item limits object
function getitemslimits(){
	$.ajaxSetup({async:false});//get all items limits
	$.post("php/acc_func.php",{param:'9~0~0~0'},function(server_response) {
						data = $.parseJSON(server_response);
						for(var i = 0; i < data.length; i++){
						itmlimits[data[i].itmid]=data[i].limit;/// get the selected itm stored measur unit
						}
	})//end of ajax
}
getitemslimits()

/// function to get all items current balance
var allitmscurbalance={}
function getallitemscurbalance(){
	$.ajaxSetup({async:false});//get all items limits
	$.post("php/acc_func.php",{param:'10'},function(server_response) {
						data = $.parseJSON(server_response);
						for(var i = 0; i < data.length; i++){
						allitmscurbalance[data[i].itmid]={"itmid":data[i].itmid,"itmname":data[i].itmname,"itmlimit":data[i].itmlimit,"itmunit": data[i].itmunit,"balance":data[i].balance};/// get the selected itm stored measur unit
						}
	})//end of ajax
	////console.log(allitmscurbalance)
}
/// function to check if item exceds the lower limit in specific or all stocks
function drawlimitexceededitems(option){//option :1 exceeded balance items ,0 all items balances
	$(document).ready(function() {
	//stockitemslist itms list and limit
	
	getallitemscurbalance()
	$("#stockitems-outoflimit-div").find(".frmfieldrow").remove()
	$("#stockitems-outoflimit-div1").find(".frmfieldrow").remove()
	for (var item in allitmscurbalance) {
		////console.log(allitmscurbalance[item])
		if(option==1){///exceed limit balance items
  if(parseInt(allitmscurbalance[item].itmlimit)>=parseInt(allitmscurbalance[item].balance)){///exceeded the limit
	   $("#stockitems-outoflimit-div").append("<div class='frmfieldrow'><div class='stockout-row'><div class='inpboxtitle bold'>اسم الصنف: </div><div class='inpboxtitle'> "+allitmscurbalance[item].itmname+"</div>	<div class='inpboxtitle bold'>كود الصنف: </div>	<div class='inpboxtitle'>"+allitmscurbalance[item].itmid+"</div>	<div class='inpboxtitle bold'>الرصيد الحالي: </div><div class='inpboxtitle'>"+allitmscurbalance[item].balance+"</div>	<div class='inpboxtitle bold'>الحد الأدنى: </div>	<div class='inpboxtitle'>"+allitmscurbalance[item].itmlimit+"</div><div class='inpboxtitle bold'>وحدة القياس: </div>	<div class='inpboxtitle'>"+allitmscurbalance[item].itmunit+"</div></div></div>")}
		}else if(option==0){//all balances items
			 
	   $("#stockitems-outoflimit-div1").append("<div class='frmfieldrow'><div class='stockout-row'><div class='inpboxtitle bold'>اسم الصنف: </div><div class='inpboxtitle'> "+allitmscurbalance[item].itmname+"</div>	<div class='inpboxtitle bold'>كود الصنف: </div>	<div class='inpboxtitle'>"+allitmscurbalance[item].itmid+"</div>	<div class='inpboxtitle bold'>الرصيد الحالي: </div><div class='inpboxtitle'>"+allitmscurbalance[item].balance+"</div>	<div class='inpboxtitle bold'>الحد الأدنى: </div>	<div class='inpboxtitle'>"+allitmscurbalance[item].itmlimit+"</div><div class='inpboxtitle bold'>وحدة القياس: </div>	<div class='inpboxtitle'>"+allitmscurbalance[item].itmunit+"</div></div></div>")
		}
}
	})//end of doc ready
}

////function to generate the stock reports it returns the report in an object
var reportobject={}
function getreportobj(){
$.ajaxSetup({async:false});//get all items movments
	$.post("php/acc_func.php",{param:'14'},function(server_response) {
						data = $.parseJSON(server_response);
						reportobject=$.parseJSON(server_response);
	//console.log(data)					
	})	
}
///function to get the length of any object
function ObjectLength_Legacy( object ) {
    var length = 0;
    for( var key in object ) {
        if( object.hasOwnProperty(key) ) {
            ++length;
        }
    }
    return length;
}
////get all items report
function getfulldatastockreportallitems(){
	//getreportobj()
	var fullrephead="<h2 style='text-align:center;'>تقرير جميع الأصناف</h2>"
	var fullrepitems=""
	var fullrep=""
	for(ix=0;ix<ObjectLength_Legacy(reportobject);ix++){
		var items=Object.keys(reportobject)
		fullrepitems+="<p>________________</p>"+getfulldatastockreport(items[ix])
	}
	fullrep=fullrephead+fullrepitems;
	return fullrep;
}
//// this function for generating full report for, all stocks for all periods in detailed format  for one item 
function getfulldatastockreport(items){
	///getreportobj()
	///get the opening balance
	////data types 0 all,1 sold ,2 spoiled,3 bought,4 transfereed
	reportdatatype=parseInt($("#reptype_dd").find(":selected").val())
	reportperiod=parseInt($("#repperiod_dd").find(":selected").val())
	selectedstockid=parseInt($("#stock_names_rep").find(":selected").val())
	var openbal=0;
	///declare variables to be used
	var sumsold,sumbought,sumspoil,sumtransfrom,sumtransto,sumcorr
	sumsold=0
	sumbought=0
	sumspoil=0
	sumtransfrom=0
	sumtransto=0
	sumcorr=0
	var startdate,startdate1
	var enddate,enddate1
	var generatedreport=""
	switch(reportperiod){
	case 0:///day report
	var date1 = new Date();
	startdate= new Date(addsubsdaysfromdate(date1,0,0)).getTime()
	startdate1=addsubsdaysfromdate(date1,0,0)
	enddate= new Date(addsubsdaysfromdate(date1,0,0)).getTime()
	enddate1= addsubsdaysfromdate(date1,0,0)
	break;
	case 1: //month report
	var date = new Date();
	var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
	var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
	startdate=new Date(addsubsdaysfromdate(firstDay,0,0)).getTime()
	enddate=new Date(addsubsdaysfromdate(new Date(reportobject[items][reportobject[items].length-1]["movdat"]),0,0)).getTime()
	startdate1=addsubsdaysfromdate(firstDay,0,0)
	enddate1=addsubsdaysfromdate(new Date(reportobject[items][reportobject[items].length-1]["movdat"]),0,0)
	//addsubsdaysfromdate(lastDay,0,0)
	break;
	case 2: /// period report
	startdate=new Date(addsubsdaysfromdate(new Date($("#rep1periodfrom").val()),0,0)).getTime()
	startdate1=addsubsdaysfromdate(new Date($("#rep1periodfrom").val()),0,0)
	condition=(new Date(addsubsdaysfromdate(new Date($("#rep1periodto").val()),0,0))).getTime()<= new Date(addsubsdaysfromdate(new Date(),0,0)).getTime()
	//console.log(condition)
	if(condition){
	enddate=new Date(addsubsdaysfromdate(new Date($("#rep1periodto").val()),0,0)).getTime()
	enddate1=addsubsdaysfromdate(new Date($("#rep1periodto").val()),0,0)	
	}else{
		
	enddate=new Date(addsubsdaysfromdate(new Date(),0,0)).getTime()
	enddate1=addsubsdaysfromdate(new Date(),0,0)
	$("#rep1periodto").val(enddate1)
	}
	break;
	case 3: //all periods report
	startdate=new Date(addsubsdaysfromdate(new Date(reportobject[items][0]["movdat"]),0,0)).getTime()
	enddate=new Date(addsubsdaysfromdate(new Date(reportobject[items][reportobject[items].length-1]["movdat"]),0,0)).getTime()
	startdate1=addsubsdaysfromdate(new Date(reportobject[items][0]["movdat"]),0,0)
	enddate1=addsubsdaysfromdate(new Date(reportobject[items][reportobject[items].length-1]["movdat"]),0,0)
	
	break;
	}
	var reporthead1="<div class='repcontainer'><div class='boxer'>"+"<div class='headertitle'><div class='headrow'><div class='headtxttitle'>تقرير حركة الصنف : </div><div class='headtxt'>"+items+" - "+reportobject[items][0]["itmname"]+"</div></div><div class='headrow'><div class='headtxttitle'>نوع التقرير : </div><div class='headtxt'>تقرير تفصيلي</div></div><div class='headrow'><div class='headtxttitle'>المخزن : </div><div class='headtxt'>"+$("#stock_names_rep").find(":selected").text()+"</div></div><div class='headrow'><div class='headtxttitle'>الفترة من : </div><div class='headtxt'>"+startdate1+"</div><div class='headtxttitle'>الى : </div><div class='headtxt'>"+enddate1+"</div></div></div>"
	
	var reporttablehead="<div class='box-row tblhead'><div class='box tblcode bld'>كود</div><div class='box tblitmname bld'>اسم الصنف</div><div class='box tblnotes bld'>بيان</div><div class='box tblsold bld'>مباع</div><div class='box tblbought bld'>مشترى</div><div class='box tblspoil bld'>تالف</div><div class='box tbltrans bld'>محول من</div><div class='box tbltrans bld'>محول الى</div><div class='box tblcorrbal bld'>جرد</div><div class='box tblbal bld'>الرصيد</div><div class='box tblunit bld'>الوحدة</div><div class='box tbldat bld'>تاريخ</div>	</div>"
	var reportrows=""
	var reportfooter=""
	//var itemid=items
	//////////////
	/////loop through the rows of stock item movments and generate the report for the item
	for(ais=0;ais<reportobject[items].length;ais++){
		switch(reportdatatype){///swich case for report data type ////data types 0 all,1 sold ,2 spoiled,3 bought,4 transfereed
			case 0:
			//console.log(" start and end dates "+startdate+" "+enddate+" date in item "+addsubsdaysfromdate(new Date(reportobject[items][ais]["movdat"]),0,0))
			//console.log( "   "+addsubsdaysfromdate(new Date(reportobject[items][ais]["movdat"]),0,0) <= enddate && addsubsdaysfromdate(new Date(reportobject[items][ais]["movdat"]),0,0) >= startdate)
			
			if(new Date(addsubsdaysfromdate(new Date(reportobject[items][ais]["movdat"]),0,0)).getTime() <= enddate && new Date(addsubsdaysfromdate(new Date(reportobject[items][ais]["movdat"]),0,0)).getTime() >= startdate)
	{
		if(selectedstockid==0){
	reportrows+="<div class='box-row'><div class='box tblcode'>"+items+"</div><div class='box tblitmname'>"+reportobject[items][ais]["itmname"]+"</div><div class='box tblnotes'>"+reportobject[items][ais]["movnote"]+"</div><div class='box tblsold'>"+reportobject[items][ais]["soldbal"]+"</div><div class='box tblbought'>"+reportobject[items][ais]["boughtbal"]+"</div><div class='box tblspoil'>"+reportobject[items][ais]["spoilbal"]+"</div><div class='box tbltrans'>"+reportobject[items][ais]["movfrombal"]+"</div><div class='box tbltrans'>"+reportobject[items][ais]["movtobal"]+"</div><div class='box tblcorrbal'>"+(parseInt(reportobject[items][ais]["addcorrbal"])-parseInt(reportobject[items][ais]["subcorrbal"]))+"</div><div class='box tblbal'>"+reportobject[items][ais]["movbalance"]+"</div>        <div class='box tblunit'>"+reportobject[items][ais]["unitname"]+"</div><div class='box tbldat'>"+reportobject[items][ais]["movdat"]+"</div></div>"
	
	sumsold+=parseInt(reportobject[items][ais]["soldbal"])
	sumbought+=parseInt(reportobject[items][ais]["boughtbal"])
	sumspoil+=parseInt(reportobject[items][ais]["spoilbal"])
	sumtransfrom+=parseInt(reportobject[items][ais]["movfrombal"])
	sumtransto+=parseInt(reportobject[items][ais]["movtobal"])
	sumcorr+=(parseInt(reportobject[items][ais]["addcorrbal"])-parseInt(reportobject[items][ais]["subcorrbal"]))
		}else{////end if stock
		if(parseInt(reportobject[items][ais]["curstock"])==selectedstockid){
			reportrows+="<div class='box-row'><div class='box tblcode'>"+items+"</div><div class='box tblitmname'>"+reportobject[items][ais]["itmname"]+"</div><div class='box tblnotes'>"+reportobject[items][ais]["movnote"]+"</div><div class='box tblsold'>"+reportobject[items][ais]["soldbal"]+"</div><div class='box tblbought'>"+reportobject[items][ais]["boughtbal"]+"</div><div class='box tblspoil'>"+reportobject[items][ais]["spoilbal"]+"</div><div class='box tbltrans'>"+reportobject[items][ais]["movfrombal"]+"</div><div class='box tbltrans'>"+reportobject[items][ais]["movtobal"]+"</div><div class='box tblcorrbal'>"+(parseInt(reportobject[items][ais]["addcorrbal"])-parseInt(reportobject[items][ais]["subcorrbal"]))+"</div><div class='box tblbal'>"+reportobject[items][ais]["movbalance"]+"</div>        <div class='box tblunit'>"+reportobject[items][ais]["unitname"]+"</div><div class='box tbldat'>"+reportobject[items][ais]["movdat"]+"</div></div>"
	
	sumsold+=parseInt(reportobject[items][ais]["soldbal"])
	sumbought+=parseInt(reportobject[items][ais]["boughtbal"])
	sumspoil+=parseInt(reportobject[items][ais]["spoilbal"])
	sumtransfrom+=parseInt(reportobject[items][ais]["movfrombal"])
	sumtransto+=parseInt(reportobject[items][ais]["movtobal"])
	sumcorr+=(parseInt(reportobject[items][ais]["addcorrbal"])-parseInt(reportobject[items][ais]["subcorrbal"]))
		}
		}
	}//end if period
	break;
	case 1:////sold
	if(new Date(addsubsdaysfromdate(new Date(reportobject[items][ais]["movdat"]),0,0)).getTime() <= enddate && new Date(addsubsdaysfromdate(new Date(reportobject[items][ais]["movdat"]),0,0)).getTime() >= startdate)
	//if(addsubsdaysfromdate(new Date(reportobject[items][ais]["movdat"]),0,0) <= enddate && addsubsdaysfromdate(new Date(reportobject[items][ais]["movdat"]),0,0) >= startdate )
	{
	if(reportobject[items][ais]["soldbal"]>0){
		reportrows+="<div class='box-row'><div class='box tblcode'>"+items+"</div><div class='box tblitmname'>"+reportobject[items][ais]["itmname"]+"</div>        <div class='box tblnotes'>"+reportobject[items][ais]["movnote"]+"</div><div class='box tblsold'>"+reportobject[items][ais]["soldbal"]+"</div><div class='box tblbought'>"+reportobject[items][ais]["boughtbal"]+"</div><div class='box tblspoil'>"+reportobject[items][ais]["spoilbal"]+"</div><div class='box tbltrans'>"+reportobject[items][ais]["movfrombal"]+"</div><div class='box tbltrans'>"+reportobject[items][ais]["movtobal"]+"</div><div class='box tblcorrbal'>"+(parseInt(reportobject[items][ais]["addcorrbal"])-parseInt(reportobject[items][ais]["subcorrbal"]))+"</div><div class='box tblbal'>"+reportobject[items][ais]["movbalance"]+"</div>        <div class='box tblunit'>"+reportobject[items][ais]["unitname"]+"</div><div class='box tbldat'>"+reportobject[items][ais]["movdat"]+"</div></div>"
		sumsold+=parseInt(reportobject[items][ais]["soldbal"])
	}
	}//end if for tiem period
	break;
	case 2://spoiled
	if(new Date(addsubsdaysfromdate(new Date(reportobject[items][ais]["movdat"]),0,0)).getTime() <= enddate && new Date(addsubsdaysfromdate(new Date(reportobject[items][ais]["movdat"]),0,0)).getTime() >= startdate)
	{
	if(reportobject[items][ais]["spoilbal"]>0){
		reportrows+="<div class='box-row'><div class='box tblcode'>"+items+"</div><div class='box tblitmname'>"+reportobject[items][ais]["itmname"]+"</div>        <div class='box tblnotes'>"+reportobject[items][ais]["movnote"]+"</div><div class='box tblsold'>"+reportobject[items][ais]["soldbal"]+"</div><div class='box tblbought'>"+reportobject[items][ais]["boughtbal"]+"</div><div class='box tblspoil'>"+reportobject[items][ais]["spoilbal"]+"</div><div class='box tbltrans'>"+reportobject[items][ais]["movfrombal"]+"</div><div class='box tbltrans'>"+reportobject[items][ais]["movtobal"]+"</div><div class='box tblcorrbal'>"+(parseInt(reportobject[items][ais]["addcorrbal"])-parseInt(reportobject[items][ais]["subcorrbal"]))+"</div><div class='box tblbal'>"+reportobject[items][ais]["movbalance"]+"</div>        <div class='box tblunit'>"+reportobject[items][ais]["unitname"]+"</div><div class='box tbldat'>"+reportobject[items][ais]["movdat"]+"</div></div>"
		sumspoil+=parseInt(reportobject[items][ais]["spoilbal"])
	}
	}///end if period
	break;
	case 3://bought
	//if(new Date(reportobject[items][ais]["movdat"]).getTime() <= new Date(enddate).getTime() && new Date(reportobject[items][ais]["movdat"]).getTime() >= new Date(startdate).getTime() )
	if(new Date(addsubsdaysfromdate(new Date(reportobject[items][ais]["movdat"]),0,0)).getTime() <= enddate && new Date(addsubsdaysfromdate(new Date(reportobject[items][ais]["movdat"]),0,0)).getTime() >= startdate)
	{
	if(reportobject[items][ais]["boughtbal"]>0){
		reportrows+="<div class='box-row'><div class='box tblcode'>"+items+"</div><div class='box tblitmname'>"+reportobject[items][ais]["itmname"]+"</div>        <div class='box tblnotes'>"+reportobject[items][ais]["movnote"]+"</div><div class='box tblsold'>"+reportobject[items][ais]["soldbal"]+"</div><div class='box tblbought'>"+reportobject[items][ais]["boughtbal"]+"</div><div class='box tblspoil'>"+reportobject[items][ais]["spoilbal"]+"</div><div class='box tbltrans'>"+reportobject[items][ais]["movfrombal"]+"</div><div class='box tbltrans'>"+reportobject[items][ais]["movtobal"]+"</div><div class='box tblcorrbal'>"+(parseInt(reportobject[items][ais]["addcorrbal"])-parseInt(reportobject[items][ais]["subcorrbal"]))+"</div><div class='box tblbal'>"+reportobject[items][ais]["movbalance"]+"</div>        <div class='box tblunit'>"+reportobject[items][ais]["unitname"]+"</div><div class='box tbldat'>"+reportobject[items][ais]["movdat"]+"</div></div>"
		sumbought+=parseInt(reportobject[items][ais]["boughtbal"])
	}
	}//end if period
	break;
	case 4://transferred
	if(new Date(addsubsdaysfromdate(new Date(reportobject[items][ais]["movdat"]),0,0)).getTime() <= enddate && new Date(addsubsdaysfromdate(new Date(reportobject[items][ais]["movdat"]),0,0)).getTime() >= startdate)
	{
	if(reportobject[items][ais]["movfrombal"]>0 || reportobject[items][ais]["movtobal"]>0){
		reportrows+="<div class='box-row'><div class='box tblcode'>"+items+"</div><div class='box tblitmname'>"+reportobject[items][ais]["itmname"]+"</div>        <div class='box tblnotes'>"+reportobject[items][ais]["movnote"]+"</div><div class='box tblsold'>"+reportobject[items][ais]["soldbal"]+"</div><div class='box tblbought'>"+reportobject[items][ais]["boughtbal"]+"</div><div class='box tblspoil'>"+reportobject[items][ais]["spoilbal"]+"</div><div class='box tbltrans'>"+reportobject[items][ais]["movfrombal"]+"</div><div class='box tbltrans'>"+reportobject[items][ais]["movtobal"]+"</div><div class='box tblcorrbal'>"+(parseInt(reportobject[items][ais]["addcorrbal"])-parseInt(reportobject[items][ais]["subcorrbal"]))+"</div><div class='box tblbal'>"+reportobject[items][ais]["movbalance"]+"</div>        <div class='box tblunit'>"+reportobject[items][ais]["unitname"]+"</div><div class='box tbldat'>"+reportobject[items][ais]["movdat"]+"</div></div>"
		sumtransfrom+=parseInt(reportobject[items][ais]["movfrombal"])
	sumtransto+=parseInt(reportobject[items][ais]["movtobal"])
	}
	}//end if period
	break;
		}///end switch for data type
	}///end for loop
	reportfooter="<div class='box-row tblhead'><div class='box tblcode'>"+items+"</div><div class='box tblitmname'>"+reportobject[items][0]["itmname"]+"</div><div class='box tblnotes'>المجموع</div><div class='box tblsold'>"+sumsold+"</div><div class='box tblbought'>"+sumbought+"</div><div class='box tblspoil'>"+sumspoil+"</div><div class='box tbltrans'>"+sumtransfrom+"</div><div class='box tbltrans'>"+sumtransto+"</div><div class='box tblcorrbal'>"+sumcorr+"</div><div class='box tblbal'>"+reportobject[items][reportobject[items].length-1]["movbalance"]+"</div><div class='box tblunit'>"+reportobject[items][reportobject[items].length-1]["unitname"]+"</div><div class='box tbldat'>"+reportobject[items][reportobject[items].length-1]["movdat"]+"</div>	</div>	</div></div>"
	
	generatedreport=reporthead1+reporttablehead+reportrows+reportfooter
	return generatedreport;	
}
////to show the report in modal window popup
function showstockreport(reportmsg,title){
	//var defer = $.Deferred();,
	$("#reportdiv").remove()
	//$myDialog="";
	$myDialog=$("<div id='reportdiv'>"+reportmsg+"</div>");
	$myDialog.dialog({
	  appendTo: "#stockpage-container",
	  title: title, 
	  zIndex: 10000,
	  autoOpen: true,
      resizable: false,
      height:600,
	  width:1000,
      modal: true,
      buttons: {
        "طباعة": function() {
			//$( this ).confirmed= true;
			data=$("#reportdiv").html()
			specific_css="<style>.repcontainer{width:100%;font-family: sans-serif;background-color:#FFF;	}.repheader{margin:10px 3px;	}.reptable{padding:5px;border:solid #999 1px;	}.boxer {   display: table;   border-collapse: collapse;   width:950px;   } .boxer .box-row {   display: table-row;   float:right;   margin:0px 2px;   width:100%;} .boxer .box {   display: table-cell;   text-align: center;   vertical-align:middle;   border: 1px solid #999;   float:right;   padding:3px;   min-height:120px;   font-size:18px;}.tblhead .box {   display: table-cell;   text-align: center;   vertical-align:middle;   border: 1px solid #999;   float:right;   padding:3px;   min-height:50px;   font-size:18px;}.tblcode{width:25px;	}.tblitmname{width:105px;	}.tblsold{	width:55px;}.tblbought{	width:55px;}.tblspoil{	width:55px;}.tbltrans{	width:57px;}.tblcorrbal{	width:55px;}.tblunit{	width:40px;}.tblnotes{width:150px;	}.tblbal{width:100px;	}.tbldat{width:100px;	}.bld{	font-weight:bold;}.tblhead{background-color:#CCC;height:59px;	}.opn{	background-color:#F0F0F0;}.headertitle{width:100%;font-size:24px;height:80px;text-align:right;direction:rtl;	}.headrow{	float:right;	width:100%;}.headtxttitle{	font-weight:bold;	display:inline-block;	float:right;	margin:5px;}.headtxt{	display:inline-block;	float:right;	margin:5px;}</style>"
			Popup(data,specific_css)
			 //callbackdialog(true,object,option)
          //$( this ).dialog( "close" );
		 
        },
        "اغلاق": function() {
			//$( this ).confirmed=false;
			//callbackdialog(false,object,option)
          $( this ).dialog( "close" );
		
        }
      }
    });/// end of dialog	
}////end of func

/////print function
function Popup(data,specific_css) 
    {
		var windowobj = {};
		var rand=(Math.random(10)*10)
        windowobj['mywindow' +rand ]=""
		windowobj['mywindow' +rand ] = window.open('', '', 'height=600,width=1000');
		//mywindow.document.clear()
        windowobj['mywindow' +rand ].document.write('<html><head><title>تقرير مخازن</title>');
        /*optional stylesheet*/ //
		//mywindow.document.write(' <link rel="stylesheet" type="text/css" href="../css/tablescash.css" />');
		//mywindow.document.write(' <link rel="stylesheet" type="text/css" href="css/invprint.css" />');
       // mywindow.document.styleSheets="css/invprint.css"
		windowobj['mywindow' +rand ].document.write(specific_css);
		windowobj['mywindow' +rand ].document.write('<style>.button{display:none;}</style>');
		windowobj['mywindow' +rand ].document.write('</head><body >');
        windowobj['mywindow' +rand ].document.write(data);
        windowobj['mywindow' +rand ].document.write('</body></html>');
       setTimeout(windowobj['mywindow' +rand ].print(),5000);
	   // mywindow.print();
		//document.inv_obj.printed= 1;
		windowobj['mywindow' +rand ].close();
		
        //return true;
    }
	
function getitmbalance(itmid,startdate,enddate,stockid){
	testreportobj();
	if(stockid==0){//get all the stocks balance
	var itmrep=reportobject[itmid]
		for(ii=0;ii<reportobject[itmid].length;ii++){
			///according to the mov type update the balance row
			if(ii>0){
			switch(parseInt(reportobject[itmid][ii]["movtype"])){
			case 1:///sold stock
			reportobject[itmid][ii]["movbalance"]=(-parseInt(reportobject[itmid][ii]["movqnty"])+parseInt(reportobject[itmid][(ii-1)]["movbalance"]))
			reportobject[itmid][ii]["soldbal"]=(parseInt(reportobject[itmid][ii]["movqnty"])+parseInt(reportobject[itmid][(ii-1)]["soldbal"]))
			break;
			case 2:///bought stock
			reportobject[itmid][ii]["movbalance"]=(parseInt(reportobject[itmid][ii]["movqnty"])+parseInt(reportobject[itmid][(ii-1)]["movbalance"]))
			break;
			case 3:///transfered balance between stocks
			
			break;
			case 4:///spoil stock
			reportobject[itmid][ii]["movbalance"]=(-parseInt(reportobject[itmid][ii]["movqnty"])+parseInt(reportobject[itmid][(ii-1)]["movbalance"]))
			break;
			case 5:///returned balance
			
			break;
			case 7:///correct balance by adding stock
			reportobject[itmid][ii]["movbalance"]=(parseInt(reportobject[itmid][ii]["movqnty"])+parseInt(reportobject[itmid][(ii-1)]["movbalance"]))
			break;
			case 8:///correct balance by sub stock
			reportobject[itmid][ii]["movbalance"]=(-parseInt(reportobject[itmid][ii]["movqnty"])+parseInt(reportobject[itmid][(ii-1)]["movbalance"]))
			break;		
		}//end of switch
			}else{
				switch(parseInt(reportobject[itmid][ii]["movtype"])){
			case 1:///sold stock
			reportobject[itmid][ii]["movbalance"]=parseInt(reportobject[itmid][ii]["movqnty"])
			break;
			case 2:///bought stock
			reportobject[itmid][ii]["movbalance"]=parseInt(reportobject[itmid][ii]["movqnty"])
			break;
			case 3:/// transfer balances between stocks
			
			break;
			case 4:///spoil stock
			reportobject[itmid][ii]["movbalance"]=parseInt(reportobject[itmid][ii]["movqnty"])
			break;
			case 7:///correct balance by adding stock
			reportobject[itmid][ii]["movbalance"]=parseInt(reportobject[itmid][ii]["movqnty"])
			break;
			case 8:///correct balance by sub stock
			reportobject[itmid][ii]["movbalance"]=parseInt(reportobject[itmid][ii]["movqnty"])
			break;		
		}//end of switch
			}
		}//end for looping in itm movments
		//console.log(reportobject[itmid])
	}else{//not all the stocks
		
	}
}
 function getbalancesbetween(itmid,startdat,enddate,stockid){
	 if(stockid==0){
	 getitmbalance(itmid,startdat,enddate,0)
	 var returnedset=[]
	 //var objj={}
	 for(indexx=0;indexx<reportobject[itmid].length;indexx++){
		 if(new Date(reportobject[itmid][indexx]["movdat"]).getTime() <= new Date(enddate).getTime() && new Date(reportobject[itmid][indexx]["movdat"]).getTime() >= new Date(startdat).getTime() )
	{
		
		returnedset[indexx]={"movbalance":reportobject[itmid][indexx]["movbalance"],"movqnty":reportobject[itmid][indexx]["movqnty"],"movnote":reportobject[itmid][indexx]["movnote"],"movdat":reportobject[itmid][indexx]["movdat"]}
		// returnedset[indexx]=objj
		 //console.log(returnedset)
	}//endif
}///end for loop
return returnedset;
	 }else{///end if stockid =0
		 
	 }
 }
function generatestockreport(repdatatype,reptype,itms,stocks,startdate,enddate){

}//end of generate freport function