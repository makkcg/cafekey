///temporary to be removed later for non redundancy

////initialize some variables
customerslist=[]
cust_unpd_ordinv=[]
/// set total number of tables
var totalnumberoftables=30;
var tableobjarray=[]//// tables array each table is an object in this array	
document.selectedtableobj=null;
document.currentorderno=null
document.taxpers=0.1
document.servicepers=0.12
document.remove_psw="123"
document.paylaterpsw="321"
document.invprinted=0;
document.acc_salesstep=0
document.loggedinuserid
document.loggedinusername
var intervalID
//document.sum_subinvDisc=0
document.totsubpaid=0
console.log(document.loggedinusername+"  "+document.loggedinuserid)

$(document).ready(function() {
var intervalID
$(".pswcol").hide();
$(".sub-inv-div").hide()
initializetableobject(1)
//// calculate tblbox container width to create the scroll
var width = 0;
$('.tables-container .tblcontainer2 div.tblbox').each(function() {width += $(this).outerWidth( true );});
$('.tables-container .tblcontainer2').css('width', width + "px");
/////////////////////////////////
/////initialize showhide controls
initializeordercontrols();
//loadtablesobjarray();   //// to be uncommented when finished
})
/// initialize table invoices object
///// table data class object
function tableobj(){
	
////profid:data[i].prof_id,proftype:data[i].prof_type,profuserid:data[i].user_id,profname:data[i].prof_name
 this.tableno=0
 this.orderno=null
 this.invid=0
 this.fullinv_items=[]
 this.cashiername=document.loggedinusername
 this.cashierid=document.loggedinuserid
 this.customer_profid=0
 this.custname=""
 this.customer_userid=0
 this.dattime=frmtdatetimesql(0)
 this.dat= frmtdatetimesql(1)
 this.time=frmtdatetimesql(2);
 this.total=0
 this.tax=0
 this.service=0
 this.discount=0
 this.gtotal=0
 this.paymentstatus=0
 this.paidvalue=0
 this.desc=""
 this.remsubinvoice=[] /// array of objects (remaining items from creating sub invoices)
 this.remsubinvoice.total=0
 this.remsubinvoice.tax=0
 this.remsubinvoice.service=0
 this.remsubinvoice.discount=0
 this.remsubinvoice.gtotal=0
 this.remsubinvoice.paymentstatus=0
 this.remvalue=0/// will be calcualted for each action in recalculate funciton
 this.subinvoices_arr=[] //// an array of sub invoices it is array of arrays where 0:[{},{}] is sub invoice 1 with objects of items array
 this.no_ofsubinvoices=this.subinvoices_arr.length /// number of sub invoices will be reacalulated in each action
}

///////////////////////////////////////////////////////document events/////////////////////////////////////////

////save table object array 
$(document).on('click','.savetblobj',function(){
	savetablesobjarray()
})
////activate deactivate autosave orders btn

$(document).on('click','#autosavebtn',function(){
	var status=parseInt($(this).data('status'))
	//var intervalID
	
	console.log(status)
	
	if(status==0){//status is off
	intervalID= setInterval(function(){savetablesOBJsilent();},120000);
	$('#autosavebtn').attr('data-status', 1);
	$('#autosavebtn').data('status', 1);
		
		$('#autosavebtn').removeClass('classA').addClass('classB');
	}else{
		////////////////////////////////function to save table orders periodically
		$('#autosavebtn').attr('data-status', 0);
	$('#autosavebtn').data('status', 0);
	$('#autosavebtn').removeClass('classB').addClass('classA');
	clearInterval(intervalID);
	}
	console.log(intervalID)
})
//reload table object array
$(document).on('click','.searchinv',function(){
	//searchinvoices()
})
//search invoices and orders
$(document).on('click','.reloadtblobj',function(){
	if(parseInt(prompt("أدخل رقم تسعة لتأكيد الأمر"))==9){
	loadtablesobjarray()
	}else{
		
	}
})
///// print order/invoice 
//// click on print sub invoice
$(document).on('click','.printsubinv',function(){
	var confirmdialoge=null
	showdialoge("هل تريد الطباعة","تأكيد الطباعة",$(this),1)
})

/////click on print full invoice
$(document).on('click','.printfullinv',function(){
	showdialoge("هل تريد الطباعة","تأكيد الطباعة",$(this),1)
})
//// click on print sub invoice
$(document).on('click','.printunpinv',function(){
	var confirmdialoge=null
	showdialoge("هل تريد الطباعة","تأكيد الطباعة",$(this),5)
})
////////////////////////Add new customer Modal Window control ///////////////////////
//click on close add new customer popup icon x 
$("#addnewcustX").click(function(e) {
	event.preventDefault();
	$("#spinner").hide();
	$("#addnewcustbtn").prop("disabled", false);

	
});
$("#addnewcustbtn").click(function(e) {
	$("#addnewcustbtn").prop("disabled", false);
	
	
});
$("#addnewcustform").submit(function(event) {
	  event.preventDefault();
	  
});

/////////////////////////////////////////////////////////////////////////////////

///// click on one of extract sub invoice buttons
$(document).on('click','.inv-buttons-div .button',function(){
	var selectedbtn=$(this).data('btn_id')
	switch(parseInt(selectedbtn)){
		case 1:///remove item from full invoice
		var psw=prompt("برجاء كتابة كلمة السر")
		if(psw==document.remove_psw){
		$(".pswcol").show()
		timeout = setTimeout('timeout_psw_rem()', 10000);
		}else{
		alert("كلمة السر خاطئة")	
		}
		break;
		case 3:////add new sub invoice button
		resetunpaidinfo()
		///check if the remaining sub inv have items
		var itemsinremsuborder=parseInt(tableobjarray[document.selectedtableobj].remsubinvoice.length);
		//// to check if the currently created sub invoice 
		cleanemptysubinv();
		if(itemsinremsuborder>0){
		createsubinvoicebtns()
		$(".sub-inv-div").show();
		populate_subinv_cust_dd()
		$(".subinvcust_dd").hide()
		}else{
		alert("لا يمكن استخراج فاتورة فرعية من فاتورة بلا أصناف، يرجى اضافة أصناف الى الفاتورة")
		$(".sub-inv-div").hide();	
		}
		break;
		case 4://// change sub invoice customer name
		resetunpaidinfo()
		if(tableobjarray[document.selectedtableobj].subinvoices_arr[document.selectedsubinvarrid].paid>0){///if the sub invoice is paid dont show the dd list
		alert("لايمكن تغير اسم العميل لفاتور فرعية مدفوعة مسبقا")	
		}else{
			
		$(".subinvcust_dd").show()
		}
		break;
	}
event.preventDefault()
})
//// click on move item to sub invoice
$(document).on('click','.table-remsub-invoice .tosubinv',function(){
//$(this).addClass('activtbl').siblings().removeClass('activtbl')
var issubinvbtnselected=$(".sub-invoices-btns").find(".activtbl").data('subbtnarrid')
if(typeof(issubinvbtnselected)=="undefined"){
	alert("يرجى اختيار فاتورة فرعية أولا");
	return false;
}
///if the sub invoice is paid
if(tableobjarray[document.selectedtableobj].subinvoices_arr[document.selectedsubinvarrid].paid==1){
alert("لايمكن اضافة أصناف الى فاتورة مدفوعة مسبقا");
return false;	
}
///reset discount
	tableobjarray[document.selectedtableobj].subinvoices_arr[document.selectedsubinvarrid].discount=0;
	
var selectedsuborder=$(this).data('subbtnarrid')
/// get the quantity of selected tosubinv item
var tosubinv_itm_qnty=$(this).data('itmqnty')
var itmid=$(this).data('itmid')
////remove the selected tosubinv item from the remaining invoice
/// note that if the tosubinv item is grater than 1 decrease the quantity of the item and recalcuale the remaining invoice item
var remsubinvrow=$(this).parent()
	var remsubinvarrindex=parseInt($(this).data('remsubinv_arrid'))
if(tosubinv_itm_qnty<2){
	tableobjarray[document.selectedtableobj].remsubinvoice.splice(remsubinvarrindex,1);
remsubinvrow.remove()
}else{
	tableobjarray[document.selectedtableobj].remsubinvoice[remsubinvarrindex].itm_qnty--
}
recalculate_tableobj(1)
redrow_rem_sub_invoice();
/// get the selected tosubinv item and push its data to the selected sub invoice
//check if the selected tosubinv item is not existing in the selected subinvoice
/// find if the added tosubinv item already exist in the selected sub invoice 
var selectedsubinvitemexist=0
var subinvitemidfoundinsubinv=null
	///	for(aqa=0;aqa<tableobjarray[document.selectedtableobj].subinvoices_arr[document.selectedsubinvarrid].length;aqa++){ //alertedrow
		for(aqa=0;aqa<tableobjarray[document.selectedtableobj].subinvoices_arr[document.selectedsubinvarrid].items.length;aqa++){
		
		//if(tableobjarray[document.selectedtableobj].subinvoices_arr[document.selectedsubinvarrid][aqa].itmid==itmid){//alertedrow
		
		if(tableobjarray[document.selectedtableobj].subinvoices_arr[document.selectedsubinvarrid].items[aqa].itmid==itmid){
			selectedsubinvitemexist=1
			subinvitemidfoundinsubinv=aqa
			//alert(subinvitemidfoundinsubinv)
		}
		}
		
if(!selectedsubinvitemexist){

var itm_lname=$(this).data('itmlname')
var itm_desc=$(this).data('itmdesc')
var itm_price=$(this).data('itmunprice')
var itm_qnty=1
var itm_total=(parseFloat(itm_price)*itm_qnty)

tableobjarray[document.selectedtableobj].subinvoices_arr[document.selectedsubinvarrid].items.push({itmid:itmid,itm_lname:itm_lname,itm_desc:itm_desc,itm_price:itm_price,itm_qnty:itm_qnty,itm_total:itm_total})
}else{
/*tableobjarray[document.selectedtableobj].subinvoices_arr[document.selectedsubinvarrid][subinvitemidfoundinsubinv].itm_qnty++
	tableobjarray[document.selectedtableobj].subinvoices_arr[document.selectedsubinvarrid][subinvitemidfoundinsubinv].itm_total=(parseFloat(tableobjarray[document.selectedtableobj].subinvoices_arr[document.selectedsubinvarrid][subinvitemidfoundinsubinv].itm_price)*parseInt(tableobjarray[document.selectedtableobj].subinvoices_arr[document.selectedsubinvarrid][subinvitemidfoundinsubinv].itm_qnty))
   alertedrow*/
   tableobjarray[document.selectedtableobj].subinvoices_arr[document.selectedsubinvarrid].items[subinvitemidfoundinsubinv].itm_qnty++
	tableobjarray[document.selectedtableobj].subinvoices_arr[document.selectedsubinvarrid].items[subinvitemidfoundinsubinv].itm_total=(parseFloat(tableobjarray[document.selectedtableobj].subinvoices_arr[document.selectedsubinvarrid].items[subinvitemidfoundinsubinv].itm_price)*parseInt(tableobjarray[document.selectedtableobj].subinvoices_arr[document.selectedsubinvarrid].items[subinvitemidfoundinsubinv].itm_qnty))

}
redrowsubinvoice(document.selectedsubinvarrid)
})

///// play sound when click on any sound class button
$(document).ready(function() {
//// play sound when click
$(document).on('click','.clicksound',function(){
	//preventDefaults();
	var beepOne = $("#beep-one")[0];

		beepOne.play();
});
$("div.beeptwo").click(function() {
	//	preventDefaults();
	var beepTwo=$("#beep-two")[0];
		beepTwo.play();
});	
$(".beep3").click(function() {
		//preventDefaults();
	var beep3=$("#beep-3")[0];
		beep3.play();
});
////save tables orders object every 20min
////////////////////////////////////////setInterval(function () {savetablesobjarray()}, 1200000);


/////change sub invoice customer populate_subinv_cust_dd()
$("#ordersubinv_cust_op").change(function() {
var selectedCustop = $('#ordersubinv_cust_op').find(":selected");
tableobjarray[document.selectedtableobj].subinvoices_arr[document.selectedsubinvarrid].custname=selectedCustop.data('profname')
//console.log(tableobjarray[document.selectedtableobj].subinvoices_arr[document.selectedsubinvarrid].custname)
//alert(selectedCustop)
tableobjarray[document.selectedtableobj].subinvoices_arr[document.selectedsubinvarrid].customer_profid=selectedCustop.data('profid')
tableobjarray[document.selectedtableobj].subinvoices_arr[document.selectedsubinvarrid].customer_userid=selectedCustop.data('profuserid')
redrowsubinvoice(document.selectedsubinvarrid)
get_cust_unpaid_inv()
$(".subinvcust_dd").hide()
})
})///end of doc ready
//// click on remove subinv item from the selected sub invoice
$(document).on('click','.table-sub-invoice .subinvitemrow .removesubinvitem',function(){
	var removesubinvitmid=$(this).data('itmid')
	var removesubinvarrindex=parseInt($(this).data('subinv_arrid'))
	var removesubinvitmqnty=parseInt($(this).data('itmqnty'))
	var subinvrow=$(this).parent()
	///reset discount
	tableobjarray[document.selectedtableobj].subinvoices_arr[document.selectedsubinvarrid].discount=0
	
	if(removesubinvitmqnty<2){
	tableobjarray[document.selectedtableobj].subinvoices_arr[document.selectedsubinvarrid].items.splice(removesubinvarrindex,1);
subinvrow.remove()
}else{
	//tableobjarray[document.selectedtableobj].subinvoices_arr[document.selectedsubinvarrid][removesubinvarrindex].itm_qnty--  //alertedrow
tableobjarray[document.selectedtableobj].subinvoices_arr[document.selectedsubinvarrid].items[removesubinvarrindex].itm_qnty--
tableobjarray[document.selectedtableobj].subinvoices_arr[document.selectedsubinvarrid].items[removesubinvarrindex].itm_total=parseFloat(tableobjarray[document.selectedtableobj].subinvoices_arr[document.selectedsubinvarrid].items[removesubinvarrindex].itm_qnty)*parseFloat(tableobjarray[document.selectedtableobj].subinvoices_arr[document.selectedsubinvarrid].items[removesubinvarrindex].itm_price)

}
recalculate_tableobj(1)
redrow_rem_sub_invoice();
redrowsubinvoice(document.selectedsubinvarrid)
/// get the selected subinv item and push its data to the selected rem sub invoice
//check if the selected subinv item is not existing in the selected remaining subinvoice
/// find if the added subinv item already exist in the selected remaining sub invoice 
var selectedremsubinvitemexist=0
var remsubinvitemidfoundinsubinv=null
		for(aqa=0;aqa<tableobjarray[document.selectedtableobj].remsubinvoice.length;aqa++){
		if(tableobjarray[document.selectedtableobj].remsubinvoice[aqa].itmid==removesubinvitmid){
			selectedremsubinvitemexist=1
			remsubinvitemidfoundinsubinv=aqa
			//alert(subinvitemidfoundinsubinv)
		}
		}
		
		if(!selectedremsubinvitemexist){

var itm_lname=$(this).parent().find('.inv_name_col').html()
var itm_desc=itm_lname
var itm_price=$(this).data('itmunprice')
var itm_qnty=1
var itm_total=(parseFloat(itm_price)*itm_qnty)

tableobjarray[document.selectedtableobj].remsubinvoice.push({itmid:removesubinvitmid,itm_lname:itm_lname,itm_desc:itm_desc,itm_price:itm_price,itm_qnty:itm_qnty,itm_total:itm_total})
}else{
	tableobjarray[document.selectedtableobj].remsubinvoice[remsubinvitemidfoundinsubinv].itm_qnty++
	tableobjarray[document.selectedtableobj].remsubinvoice[remsubinvitemidfoundinsubinv].itm_total=(parseFloat(tableobjarray[document.selectedtableobj].remsubinvoice[remsubinvitemidfoundinsubinv].itm_price)*parseInt(tableobjarray[document.selectedtableobj].remsubinvoice[remsubinvitemidfoundinsubinv].itm_qnty))
}


recalculate_tableobj(1)
//var subinvnoofitms=tableobjarray[document.selectedtableobj].subinvoices_arr[document.selectedsubinvarrid].length //alertedrow
var subinvnoofitms=tableobjarray[document.selectedtableobj].subinvoices_arr[document.selectedsubinvarrid].items.length

//alert(subinvnoofitms)
if(parseInt(subinvnoofitms)<1){
$(".sub-inv-div").hide()
}
redrow_rem_sub_invoice();
redrowsubinvoice(document.selectedsubinvarrid)

cleanemptysubinv();
recreatesubinvbtns()
})

//// click on sub invoice button number
$(document).on('click','.sub-invoices-btns .subbtn',function(){
$(".inv-buttons-sub-inv .sub-inv-div").show();
$(this).addClass('activtbl').siblings().removeClass('activtbl')
var selectedsuborder=$(this).data('subbtnarrid')
document.selectedsubinvarrid=selectedsuborder
$(".sub-inv-div").find("[data-subbtnarrid='"+selectedsuborder+"']").show()
redrowsubinvoice(selectedsuborder)
})
////////remove item from remaining sub invoice using -ve icon
$(document).on('click','.table-remsub-invoice .itemsrows div.pswcol',function(){
	remsubinv_itm_arrid=$(this).data('remsubinv_arrid')
    qntyofselecteditm=tableobjarray[document.selectedtableobj].remsubinvoice[remsubinv_itm_arrid].itm_qnty
	var itemidtofind=tableobjarray[document.selectedtableobj].remsubinvoice[remsubinv_itm_arrid].itmid
	var foundinFullinvobjarr=null
	
console.log("qntyofselecteditm "+qntyofselecteditm+ "qntyofselecteditmInFullinv "+qntyofselecteditmInFullinv)
console.log(tableobjarray[document.selectedtableobj].fullinv_items)
	if((parseInt(qntyofselecteditm))<2){
	tableobjarray[document.selectedtableobj].remsubinvoice.splice(remsubinv_itm_arrid,1);
	//console.log(remsubinv_itm_arrid)
	//console.log(tableobjarray[document.selectedtableobj].fullinv_items)
	
	}else{
		tableobjarray[document.selectedtableobj].remsubinvoice[remsubinv_itm_arrid].itm_qnty--
		//tableobjarray[document.selectedtableobj].fullinv_items[remsubinv_itm_arrid].itm_qnty--
	}
	///find the removed item from remsubinvoice and match in the fullinv object array , match by item id
	for(us=0;us<tableobjarray[document.selectedtableobj].fullinv_items.length;us++){
		if(tableobjarray[document.selectedtableobj].fullinv_items[us].itmid==itemidtofind){
			foundinFullinvobjarr=us
		}
		
	}
	console.log(foundinFullinvobjarr)
	var qntyofselecteditmInFullinv=tableobjarray[document.selectedtableobj].fullinv_items[foundinFullinvobjarr].itm_qnty
	if((parseInt(qntyofselecteditmInFullinv))<2){
		tableobjarray[document.selectedtableobj].fullinv_items.splice(foundinFullinvobjarr,1);
	}else{
	tableobjarray[document.selectedtableobj].fullinv_items[foundinFullinvobjarr].itm_qnty--
	}
	
	recalculate_tableobj(1)
	redrow_rem_sub_invoice()
	update_tablebtninfo()
	timeout_psw_rem()
})

//// click on any table button
$(document).on('click','div.tblbox',function(){
 $(this).addClass('activtbl').siblings().removeClass('activtbl')
 initializeordercontrols()
 $(".tables-controlls-container").show();
 document.selectedtableobj=parseInt($(this).data('tableobjid'))
 tableobjarray[document.selectedtableobj].dattime=frmtdatetimesql(0)
 tableobjarray[document.selectedtableobj].dat= frmtdatetimesql(1)
 tableobjarray[document.selectedtableobj].time=frmtdatetimesql(2);
 update_tablebtninfo()
 $(".subinvcust_dd").hide()
 var orderval=parseFloat(tableobjarray[document.selectedtableobj].gtotal)
 if(tableobjarray[document.selectedtableobj].orderno==null && orderval==0){
	 savenewtableorder()
	 //tableobjarray[document.selectedtableobj].orderno=document.currentorderno
 }else{
	 console.log("orderno is not null or currentorderno is not 0  "+tableobjarray[document.selectedtableobj].orderno)
	 document.currentorderno=tableobjarray[document.selectedtableobj].orderno
 }
})
//// click on cashier categories buttons
$(document).on('click','div.cat-item',function(){
 $(this).addClass('activtbl').siblings().removeClass('activtbl')
 var selectedbtn=$(this).data('group_id')
 $(".cashier-items-container").find("[data-group_id='"+selectedbtn+"']").show().siblings().hide();	
})

//// click on cashier sales items buttons	
$(document).on('click','div.cash-item-small',function(){
 var itmid=$(this).data('id')
 var itm_lname=$(this).data('itm_lname')
 var itm_desc=$(this).data('itm_desc')
 var itm_price=$(this).data('itm_price')
 var itemidexist=0
 var itemidexistinreminv=0
 var itemidfoundinfullinv,itemidfoundinremsubinv
 ////check if any of the ingradients stock is below the limit and alert the user
 //1- get the item ingradients ids and balance
 var ingradientsofitm={}
 var ingrexededlimits={}
 ingradientsofitm=getingrbalancelimits(itmid)
 for (var item in ingradientsofitm) {
	 if(parseInt(ingradientsofitm[item].inglimit)>=parseInt(ingradientsofitm[item].ingbalance)){
		 alert("تحذير : صنف قارب على الانتهاء : "+ingradientsofitm[item].ingname+" الرصيد الحالي : "+ingradientsofitm[item].ingbalance+" الحد الأدنى : "+ingradientsofitm[item].inglimit+" "+ingradientsofitm[item].ingunit)
	 }
 }
 console.log(ingrexededlimits)
 //2- loop for each ingradient balance and calculate if the item ingr is below limit then alert user with list of below limit
 
 ////////////////////
 /// find if the added item already exist in the full invoice 
 for(aa=0;aa<tableobjarray[document.selectedtableobj].fullinv_items.length;aa++){
		if(tableobjarray[document.selectedtableobj].fullinv_items[aa].itmid==itmid){
			itemidexist=1
			itemidfoundinfullinv=aa
		}
 }
 /// if item exist in the full invoice increase the quantity of the item and recalculate
 if(itemidexist){
		tableobjarray[document.selectedtableobj].fullinv_items[itemidfoundinfullinv].itm_qnty++
		tableobjarray[document.selectedtableobj].fullinv_items[itemidfoundinfullinv].itm_total=(parseFloat(tableobjarray[document.selectedtableobj].fullinv_items[itemidfoundinfullinv].itm_price)*parseInt(tableobjarray[document.selectedtableobj].fullinv_items[itemidfoundinfullinv].itm_qnty))
 }else{
        tableobjarray[document.selectedtableobj].fullinv_items.push({itmid:itmid,itm_lname:itm_lname,itm_desc:itm_desc,itm_price:itm_price,itm_qnty:1,itm_total:(parseFloat(itm_price)).toFixed(2)})
 }
 /// find if the added item already exist in the remaining sub invoice 
 for(aaa=0;aaa<tableobjarray[document.selectedtableobj].remsubinvoice.length;aaa++){
		if(tableobjarray[document.selectedtableobj].remsubinvoice[aaa].itmid==itmid){
			itemidexistinreminv=1
			itemidfoundinremsubinv=aaa
		}
 }
 /// if item exist in the remaining sub invoice increase the quantity of the item and recalculate
 if(itemidexistinreminv){
        tableobjarray[document.selectedtableobj].remsubinvoice[itemidfoundinremsubinv].itm_qnty++
		tableobjarray[document.selectedtableobj].remsubinvoice[itemidfoundinremsubinv].itm_total=(parseFloat(tableobjarray[document.selectedtableobj].remsubinvoice[itemidfoundinremsubinv].itm_price)*parseInt(tableobjarray[document.selectedtableobj].remsubinvoice[itemidfoundinremsubinv].itm_qnty))
 }else{
			tableobjarray[document.selectedtableobj].remsubinvoice.push({itmid:itmid,itm_lname:itm_lname,itm_desc:itm_desc,itm_price:itm_price,itm_qnty:1,itm_total:(parseFloat(itm_price)).toFixed(2)})
 }
 recalculate_tableobj(1)
 update_tablebtninfo()
 //$(".cashier-items-container").find("[data-group_id='"+selectedbtn+"']").show().siblings().hide();	
 ////save orders object into db
 //savetablesobjarray()
})
//// the three main buttons for each table - the table control buttons
$(document).on('click','.tables-controlls-container a.button',function(){
        $(this).addClass('activtbl').siblings().removeClass('activtbl')
		var selectedbtn=$(this).data('btnid')
		tableobjarray[document.selectedtableobj].invid=getnextid("invoices")
		resetunpaidinfo()
		switch(parseInt(selectedbtn)){
		case 1:
		$(".cashier-main-container").show();
		var selectedbtn=1
		$(".cashier-items-container").find("[data-group_id='"+selectedbtn+"']").show().siblings().hide();
		
		$(".cashier-main-container .cashier-cat-container ").find("[data-group_id='"+selectedbtn+"']").addClass('activtbl').siblings().removeClass('activtbl')

		$(".cashier-invoice-container").hide();
		$(".cashier-cr-sub-inv-container").hide();
		break;	
		case 2:
		$(".sub-inv-div").hide();
		$(".cashier-main-container").hide();
		$(".cashier-invoice-container").hide();
		$(".cashier-cr-sub-inv-container").show();
		redrow_rem_sub_invoice();
		recreatesubinvbtns();
		populate_subinv_cust_dd()
		$(".subinvcust_dd").hide()
		break;	
		case 3:
		$(".cashier-main-container").hide();
		$(".cashier-invoice-container").show();
		$(".cashier-cr-sub-inv-container").hide();
		redrow_full_invoice();
		if(parseInt(tableobjarray[document.selectedtableobj].gtotal)==0 && parseInt(tableobjarray[document.selectedtableobj].discount)==0){
		$(".table-full-view-inv .fullinvbtns").hide()	
		}else{
		$(".table-full-view-inv .fullinvbtns").show()	
		}
		break;
		}
})

$(document).on('click','.payfullinv',function(){
	//|| tableobjarray[document.selectedtableobj].remvalue <0.09
	///if the table haven't sub invoices pay the invoice as full invoice
if(tableobjarray[document.selectedtableobj].subinvoices_arr.length==0){
/// confirm paying full invoice
var txtmsg="هل أنت متأكد من دفع اجمالي الفاتورة المجمعة رقم : "+tableobjarray[document.selectedtableobj].invid+" اوردر رقم : "+tableobjarray[document.selectedtableobj].orderno+"  واغلاق طاولة رقم : "+tableobjarray[document.selectedtableobj].tableno+" باجمالي قيمة : <span style='color:red;'>"+(tableobjarray[document.selectedtableobj].gtotal).toFixed(2)+" جنيه </span> وتخفيض بقيمة : <span style='color:red;'>"+(tableobjarray[document.selectedtableobj].discount).toFixed(2)+" جنيه </span>"
var title="تأكيد دفع الفاتورة المجمعة"
showdialoge(txtmsg,title,$(this),3) /// optin 3 pay full invoice
 
}else{
//// if the table have sub invoices	
if(tableobjarray[document.selectedtableobj].remvalue>0.09){////if any remaining value not paid throgh sub invoices
	
alert("يرجى دفع كافة الفواتير الفرعية لتتمكن من اغلاق الطاولة")
}else{
/// confirm paying full invoice
var txtmsg="هل أنت متأكد من تمام دفع الفواتير الفرعية للفاتورة المجمعة رقم : "+tableobjarray[document.selectedtableobj].invid+" اوردر رقم : "+tableobjarray[document.selectedtableobj].orderno+"  وتريد اغلاق الطاولة رقم : "+tableobjarray[document.selectedtableobj].tableno+" باجمالي قيمة : <span style='color:red;'>"+(tableobjarray[document.selectedtableobj].gtotal).toFixed(2)+" جنيه </span> وتخفيض بقيمة : <span style='color:red;'>"+(tableobjarray[document.selectedtableobj].discount).toFixed(2)+" جنيه </span>"+" وعدد الفواتير الفرعية : " +tableobjarray[document.selectedtableobj].no_ofsubinvoices+" فاتورة فرعية " 
var title="تأكيد اغلاق الطاولة"
showdialoge(txtmsg,title,$(this),3) /// optin 3 pay full invoice	
}
}
})

////pay sub invoice NOW
$(document).on('click','.paysubinv',function(){
	var subinvobj=tableobjarray[document.selectedtableobj].subinvoices_arr[document.selectedsubinvarrid]
	var txtmsg="هل أنت متأكد دفع<span style='color:red;'> كاش</span> الفاتورة الفرعية رقم : "+tableobjarray[document.selectedtableobj].invid+"-"+(parseInt(document.selectedsubinvarrid)+1)+" اوردر فرعي رقم : "+tableobjarray[document.selectedtableobj].orderno+"-"+(parseInt(document.selectedsubinvarrid)+1)+"  للعميل : <span style='color:red;'>"+subinvobj.custname+"</span> باجمالي قيمة : <span style='color:red;'>"+(subinvobj.gtotal).toFixed(2)+" جنيه </span>"+" وتخفيض بقيمة : <span style='color:red;'>" +(subinvobj.discount).toFixed(2)+" جنيه </span>" 
var title="تأكيد دفع فاتورة فرعية كاش"

	showdialoge(txtmsg,title,$(this),2)
})
////pay sub invoice later
$(document).on('click','.paylatersubinv',function(){
	////should make sure the customer is not general customer Done
		var subinvobj=tableobjarray[document.selectedtableobj].subinvoices_arr[document.selectedsubinvarrid]
	var txtmsg="هل أنت متأكد دفع <span style='color:red;'> آجل</span> الفاتورة الفرعية رقم : "+tableobjarray[document.selectedtableobj].invid+"-"+(parseInt(document.selectedsubinvarrid)+1)+" اوردر فرعي رقم : "+tableobjarray[document.selectedtableobj].orderno+"-"+(parseInt(document.selectedsubinvarrid)+1)+"  للعميل : <span style='color:red;'>"+subinvobj.custname+"</span> باجمالي قيمة : <span style='color:red;'>"+(subinvobj.gtotal).toFixed(2)+" جنيه </span>"+" وتخفيض بقيمة : <span style='color:red;'>" +(subinvobj.discount).toFixed(2)+" جنيه </span>" 
var title="تأكيد دفع فاتورة فرعية آجل"
	showdialoge(txtmsg,title,$(this),4)
})

////pay sub invoice NOW
$(document).on('click','.payunpinv',function(){
	var clickedbtn=$(this).data('clickedbtn')
	//var subinvobj=tableobjarray[document.selectedtableobj].subinvoices_arr[document.selectedsubinvarrid]
	var txtmsg="هل أنت متأكد دفع<span style='color:red;'> كاش</span> الفاتورة الفرعية رقم : "+cust_unpd_ordinv[clickedbtn].maininvid+"-"+cust_unpd_ordinv[clickedbtn].subinvid+" اوردر فرعي رقم : "+cust_unpd_ordinv[clickedbtn].orderid+"-"+cust_unpd_ordinv[clickedbtn].suborderid+"  للعميل : <span style='color:red;'>"+cust_unpd_ordinv[clickedbtn].detailsobj.custname+"</span> باجمالي قيمة : <span style='color:red;'>"+(cust_unpd_ordinv[clickedbtn].detailsobj.gtotal).toFixed(2)+" جنيه </span>"+" وتخفيض بقيمة : <span style='color:red;'>" +(cust_unpd_ordinv[clickedbtn].detailsobj.discount).toFixed(2)+" جنيه </span>" 
var title="تأكيد دفع فاتورة فرعية كاش"

	showdialoge(txtmsg,title,$(this),6)
})

$(document).on('click','.showunpaidord',function(){
showunpaidinv_cust()
})
$(document).on('click','.adddisc',function(){
	var discbtnclicked=$(this).data('discinv')
	var valpers=$(this).data('valpers')
	//var fullinvgtotal=(parseFloat(tableobjarray[document.selectedtableobj].total))+(parseFloat(tableobjarray[document.selectedtableobj].service))+(parseFloat(tableobjarray[document.selectedtableobj].tax))
	if(discbtnclicked=="full"){
	if(parseFloat(tableobjarray[document.selectedtableobj].no_ofsubinvoices)>0){
	alert("لايمكن الخصم من الفاتورة المجمعة في وجود فواتير فرعية ، يمكنك الخصم من الفواتير الفرعية فقط!");return false;};
	if(valpers=="val"){
	var discval=prompt("يرجى ادخال قيمة الخصم بالجنيه")
	if(parseFloat(discval)<0){discval=0}
	}else{
	var discpers=prompt("يرجى ادخال نسبة الخصم %")
	if(parseFloat(discval)<0){discval=0}
	var discval=(parseFloat(discpers)/100)*((parseFloat(tableobjarray[document.selectedtableobj].total))+(parseFloat(tableobjarray[document.selectedtableobj].service))+(parseFloat(tableobjarray[document.selectedtableobj].tax)))
	}
	//// should make sure that there is no discounts for the sub invoices or there is no sub invoices
	console.log((parseFloat(tableobjarray[document.selectedtableobj].total))+(parseFloat(tableobjarray[document.selectedtableobj].service))+(parseFloat(tableobjarray[document.selectedtableobj].tax))+"  "+discval)
	if(parseFloat(discval)<=((parseFloat(tableobjarray[document.selectedtableobj].total))+(parseFloat(tableobjarray[document.selectedtableobj].service))+(parseFloat(tableobjarray[document.selectedtableobj].tax)))){
	tableobjarray[document.selectedtableobj].discount=parseFloat(discval);
	recalculate_tableobj(1)
	redrow_full_invoice();
	}else{
	alert("لايمكن خصم أكثر من قيمة الفاتورة")
	tableobjarray[document.selectedtableobj].discount=parseFloat(0);	
	}
	}else{/// if dicount btn is on the sub invoice
	
		if(valpers=="val"){
	var discval=prompt("يرجى ادخال قيمة الخصم بالجنيه")
	if(parseFloat(discval)<0){discval=0}
	}else{///if pressed btn is % btn
	var discpers=prompt("يرجى ادخال نسبة الخصم %")
	if(parseFloat(discval)<0){discval=0}
	var discval=(parseFloat(discpers)/100)*((parseFloat(tableobjarray[document.selectedtableobj].subinvoices_arr[document.selectedsubinvarrid].total))+(parseFloat(tableobjarray[document.selectedtableobj].subinvoices_arr[document.selectedsubinvarrid].service))+(parseFloat(tableobjarray[document.selectedtableobj].subinvoices_arr[document.selectedsubinvarrid].tax)))
	}////end of pressed btn is % else
	
console.log((parseFloat(tableobjarray[document.selectedtableobj].subinvoices_arr[document.selectedsubinvarrid].total))+(parseFloat(tableobjarray[document.selectedtableobj].subinvoices_arr[document.selectedsubinvarrid].service))+(parseFloat(tableobjarray[document.selectedtableobj].subinvoices_arr[document.selectedsubinvarrid].tax))+"  "+discval)

if(parseFloat(discval)<=((parseFloat(tableobjarray[document.selectedtableobj].subinvoices_arr[document.selectedsubinvarrid].total))+(parseFloat(tableobjarray[document.selectedtableobj].subinvoices_arr[document.selectedsubinvarrid].service))+(parseFloat(tableobjarray[document.selectedtableobj].subinvoices_arr[document.selectedsubinvarrid].tax)))){
	
	tableobjarray[document.selectedtableobj].subinvoices_arr[document.selectedsubinvarrid].discount=parseFloat(discval);
	console.log(tableobjarray[document.selectedtableobj].subinvoices_arr[document.selectedsubinvarrid].discount)
	recalculate_tableobj(1)
	redrowsubinvoice(document.selectedsubinvarrid);
	}else{
	alert("لايمكن خصم أكثر من قيمة الفاتورة")
	tableobjarray[document.selectedtableobj].subinvoices_arr[document.selectedsubinvarrid].discount=parseFloat(0);	
	}
	}
})
	
//////////////////////////////////////////////////////////////////// All Functions////////////////////////////////////////////////
//// date and time converter function
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

///////////////////////////////////
///////ADD new customer function
//add new customer from popup window function
function add_new_customer(){
	$(document).ready(function() {
//// reqest password to add allow adding new customer
var psw=prompt("برجاء كتابة كلمة السر")
if(psw==document.paylaterpsw){
		
   /////// validation of inputs 
var valid=1;
  
  if($("#cust_fullname").val()=="") {alert("يرجى كتابة اسم العميل الثلاثي") ;$("#cust_fullname").focus();valid=0;return false;}
if(!validateLength($("#cust_fullname"),10) ){alert("الاسم يجب أن لا يقل عن 10 حروف ولا يزيد عن 20 حرف") ;$("#cust_fullname").focus();valid=0;return false;}

if($("#cust_mob1").val()=="") {alert("يرجى كتابة رقم المحمول للعميل") ;$("#cust_mob1").focus();valid=0;return false;}
if(!validateLength($("#cust_mob1"),9) ){alert("رقم المحمول يجب ان لا يقل عن 10 رقما") ;$("#cust_mob1").focus();valid=0;return false;}
 
   ///// execute addition of new customer
   if(valid){
var addcustomerform = $( "#addnewcustform" ).serialize();

      $("#spinner").show();
      $("#spinner").fadeIn(400).html('<img src="img/spinner.gif" />');
	  $.ajaxSetup({async:false})
      $.ajax({
      type: "POST",
	  dataType: 'json',
      url: "../php/cashier_func2.php",
      data: addcustomerform,
      cache: false,
      success: function(result){
		  if(result==1){
       alert("تم حفظ العميل");
	   clearaddnewcust();
	   getcustomerslist();
	  window.location.href ="#";
		  }else{
			alert("عفوا ... هناك خطأ في حفظ العميل");
			return false;
		  }
	   $("#spinner").hide();
	   
	  }
      });
 
   }
}else{ //wrong entered password
alert("كلمة السر خاطئة");
//window.location.href ="#";	
return false;
}
});///end of doc ready

}//END add new customer from popup window function end

function clearaddnewcust(){
	$(document).ready(function() {
		$("#addnewcustform :input").val("");
	});
}
////// DB get customer list to an array
function getcustomerslist(){
$.ajaxSetup({async:false});
$.post("../php/db_query_fun.php",{param:'6~'},function(server_response) {
			data = $.parseJSON(server_response);
			for(var i = 0; i < data.length; i++){
			customerslist.push({profid:data[i].prof_id,proftype:data[i].prof_type,profuserid:data[i].user_id,profname:data[i].prof_name})
            }
});
populate_subinv_cust_dd()
}
//// get the defult customer (genreic customer profile)
function customersdefultobj(){
for(asi=0;asi<customerslist.length;asi++){
	var cusname=customerslist[asi].profname
	//console.log(customerslist[asi])
	var cusprofid=parseInt(customerslist[asi].profid)
	if(cusname=='عميل عام - غير منتظم' || cusprofid==16){
		return customerslist[asi]
		////console.log(customerslist[asi])
		//alert(customerslist[asi])
	}else{
	//return null;	
	}
}///end for
}
///// print funciton
////// for printing recipts at cashier

function PrintElem(elem,specific_css)
    {
        Popup($(elem).html(),specific_css);
    }

    function Popup(data,specific_css) 
    {
        var mywindow = window.open('', '', 'height=400,width=600');
        mywindow.document.write('<html><head><title>فاتورة</title>');
        /*optional stylesheet*/ //
		mywindow.document.write(' <link rel="stylesheet" type="text/css" href="../css/tablescash.css" />');
		//mywindow.document.write(' <link rel="stylesheet" type="text/css" href="css/invprint.css" />');
       // mywindow.document.styleSheets="css/invprint.css"
		mywindow.document.write(specific_css);
		mywindow.document.write('<style>.button{display:none;}</style>');
		mywindow.document.write('</head><body >');
        mywindow.document.write(data);
        mywindow.document.write('</body></html>');
       setTimeout(mywindow.print(),5000);
	   // mywindow.print();
		//document.inv_obj.printed= 1;
		mywindow.close();
        return true;
    }
/////function call bakc function by selected btn in dialog show dialoge msg with options for each use of dialogue msg
function callbackdialog(returnedval,clickobject,option){
	if(returnedval){///if user click on yes in the dialoge window
	/////options : 1: print , 2: save sub invoice, 3: save full invoice, etc..
	switch(option){
	case 1:
	////check the clicked btn to do action based on it
	var clickedbtn =clickobject.data('clickedbtn')
		switch(clickedbtn){
		case 'printsubinv':
		var specific_css='<style>.inv_controls_col{display:none !important;} .subinvbtns{display:none;}</style>'
		PrintElem($(".table-sub-invoice"),specific_css)
		break;
		case 'printfullinv':
		var specific_css='<style>.fullinvbtns{display:none;}</style>'
		PrintElem($(".table-full-view-inv"),specific_css)
		break;
		}
	break;//case 1 break
	case 2: ///pay now sub invoice
	tableobjarray[document.selectedtableobj].subinvoices_arr[document.selectedsubinvarrid].paid=1
	//update_tableorder()
	//console.log(tableobjarray[document.selectedtableobj].subinvoices_arr[document.selectedsubinvarrid])
	recalculate_tableobj(1)
	update_tablebtninfo();
	paynow_later_subinv(1)
	savetablesobjarray()
	//update_tableorder()
	//redrow_full_invoice();
	break;
	case 3://// pay full invoice
	update_tableorder()
	//savetablesobjarray()
	paynow_Fullinv(1,tableobjarray[document.selectedtableobj].subinvoices_arr.length)
	//closetable()
	recalculate_tableobj(1)
	savenewtableorder()
	redrow_full_invoice();
	update_tablebtninfo();
	savetablesobjarray()
	break;
	case 4: /// pay sub invoice later
	tableobjarray[document.selectedtableobj].subinvoices_arr[document.selectedsubinvarrid].paid=1
	//update_tableorder()
	//console.log(tableobjarray[document.selectedtableobj].subinvoices_arr[document.selectedsubinvarrid])
	recalculate_tableobj(1)
	update_tablebtninfo();
	paynow_later_subinv(0)
	savetablesobjarray()
	break;	
	case 5:///print unpaid invoice
	//get the unpaid inv
	var clickedbtn =clickobject.data('clickedbtn')
	var invtoprint=$(".unpaidinvoice [data-arrobjid='"+clickedbtn+"']")
		var specific_css='<style>.inv_controls_col{display:none !important;} .subinvbtns{display:none;}</style>'
		PrintElem(invtoprint,specific_css)
	break;
	case 6:///pay unpaid invoice for customer
	var clickedbtn =clickobject.data('clickedbtn')
	payunpaidCustInv(clickedbtn,clickobject)
	break;
	}
		
	}else{
	return false;	
	}
	document.callbackmsgdialoge=returnedval
}
function showdialoge(txtmsg,title,object,option){
	//var defer = $.Deferred();,
	
	$myDialog=$("<div>"+txtmsg+"</div>");
	$myDialog.dialog({
	  appendTo: "#orderpagecontainer",
	  title: title, 
	  zIndex: 10000,
	  autoOpen: true,
      resizable: false,
      height:400,
      modal: true,
      buttons: {
        "نعم": function() {
			//$( this ).confirmed= true;
			 callbackdialog(true,object,option)
          $( this ).dialog( "close" );
		 
        },
        "لا": function() {
			//$( this ).confirmed=false;
			callbackdialog(false,object,option)
          $( this ).dialog( "close" );
		
        }
      }
    });/// end of dialog	
}////end of func


///// initialize  controls and objects
function initializetableobject(firsttime1){
	getcustomerslist()
	if(parseInt(firsttime1)==1){
	////initialize tables and its orders
	$(".tables-container div.tblcontainer2").find('.tblbox').remove()
for(ii=0;ii<totalnumberoftables;ii++){
	tableobjarray[ii]= new tableobj//// initialize table 1 to 30
	var tablebutton="<div data-tableid='"+(ii+1)+"' data-tableobjid='"+ii+"' class='tblbox'>"+(ii+1)+"<div class='tblbox-rem clickable-div'>"+tableobjarray[ii].remvalue+"</div></div>"
	$(".tables-container div.tblcontainer2").append(tablebutton)
	tableobjarray[ii].tableno=(ii+1)
	
}//end for
}//end if
///initialize sales (cashier) items
populatesalesitems()
initializedefultcustomer()
}//end func
function initializeordercontrols(){
$(document).ready(function() {
/////initialize showhide controls
$(".subinvcust_dd").hide()
$(".cashier-invoice-container").hide();
$(".cashier-main-container").hide();
$(".tables-controlls-container").hide();
$(".cashier-cr-sub-inv-container").hide();
$("div.cat-item").removeClass('activtbl')
$("a.button").removeClass('activtbl')
$(".items-group").hide();
$(".sub-inv-div").hide()

})	
}
///////populate controls
//////////1- populate sales (menu) items
function populatesalesitems(){
$(document).ready(function() {
	$(".cashier-items-container .items-group .group1").find(".cash-item-small").remove();
	$(".cashier-items-container .items-group .group2").find(".cash-item-small").remove();
	$(".cashier-items-container .items-group .group3").find(".cash-item-small").remove();
	$(".cashier-items-container .items-group .group4").find(".cash-item-small").remove();
	///// for food items
	//$(".cashier-items-container .fooditems .foodgroup1").find(".cash-item-small").remove();
	
$.ajaxSetup({async:false});
$.post("../php/cashier_func.php",{param:'0~0'},function(server_response) {
data = $.parseJSON(server_response);
for(var i = 0; i < data.length; i++){
					
					var salesitemrow ="<div class='cash-item-small clickable-div clicksound' data-id='"+data[i].itm_id+"' data-itm_lname='"+data[i].itm_lname+"' data-itm_desc='"+data[i].itm_desc+"' data-itm_price='"+data[i].itm_price+"'><a>"+data[i].itm_sname+"</a><div class='cash-item-price'>"+data[i].itm_price+"</div></div>"
					
					if(data[i].itm_group==1){
					$(".cashier-items-container .items-group .group1").append(salesitemrow);
					}else if (data[i].itm_group==2){
					$(".cashier-items-container .items-group .group2").append(salesitemrow);
						
					}else if (data[i].itm_group==3){
					$(".cashier-items-container .items-group .group3").append(salesitemrow);
						
					}else if (data[i].itm_group==4){
					$(".cashier-items-container .items-group .group4").append(salesitemrow);
					
					}else if (data[i].itm_group==5){
					$(".cashier-items-container .fooditems .foodgroup1").append(salesitemrow);
					//$(".cashier-items-container .items-group .group4").append(salesitemrow);
							
					}///end of if
}		///end of for	
});///end of ajax call
///////////////////////////////////////////////////////////////////
});///end of doc ready
}/// end of funciton
/////saving all the tables orders (table objects array) for emergency into a file
function savetablesobjarray(){
	//// parameters for saving : date+"~"+time+"~"+dattime+"~"+json string+"~"+comment
	var stringedobjarr=JSON.stringify(tableobjarray)
	var comment="تم الحفظ"
	var parameters=frmtdatetimesql(1)+"~"+frmtdatetimesql(2)+"~"+frmtdatetimesql(0)+"~"+stringedobjarr+"~"+comment
	//alert(parameters)
$.ajaxSetup({async:false});
$.post("../php/cashier_func.php",{param:'9~'+parameters},function(server_response) {
//data = $.parseJSON(server_response);
if(server_response=="succeded"){
alert("تم حفظ بيانات جميع الاوردرات")
}else{
	alert("حدث خطأ اثناء حفظ البيانات     "+server_response)
}
})////end ajax
}////end func

/// silently save tables orders objects in db
function savetablesOBJsilent(){
	//// parameters for saving : date+"~"+time+"~"+dattime+"~"+json string+"~"+comment
	var stringedobjarr=JSON.stringify(tableobjarray)
	var comment="تم الحفظ"
	var parameters=frmtdatetimesql(1)+"~"+frmtdatetimesql(2)+"~"+frmtdatetimesql(0)+"~"+stringedobjarr+"~"+comment
	//alert(parameters)
$.ajaxSetup({async:false});
$.post("../php/cashier_func.php",{param:'9~'+parameters},function(server_response) {
//data = $.parseJSON(server_response);
if(server_response=="succeded"){
//alert("تم حفظ بيانات جميع الاوردرات")
console.log("succeeded")
}else{
	alert("حدث خطأ اثناء حفظ البيانات     "+server_response)
}
})////end ajax
}////end func

//// load the tables array of objects from the database
function loadtablesobjarray(){
var tblobjarrlenght=tableobjarray.length
tableobjarray.splice(0,tableobjarray.length)
$.ajaxSetup({async:false});
$.post("../php/cashier_func.php",{param:'8~0'},function(server_response) {
//data = $.parseJSON(server_response);
data =JSON.parse(server_response)
tableobjarray=data;
})
///
//initializetableobject(1)
//document.currentorderno=1
for(isa=0;isa<tableobjarray.length;isa++){
$(".tables-container .tblcontainer2").find("[data-tableobjid='"+isa+"']").find("div.tblbox-rem").html(parseFloat(tableobjarray[isa].remvalue).toFixed(2))
document.selectedtableobj=isa
document.currentorderno=tableobjarray[isa].orderno
recalculate_tableobj(1)

}
//update_tablebtninfo()
}////end func
/// initialize some controls controls
function timeout_psw_rem(){
	$(document).ready(function() {
	$(".pswcol").hide();
	clearTimeout(timeout);
	})
}

///get defult customer information from the populated array of customers
function initializedefultcustomer(){
defaultcustomerobj={}
defaultcustomerobj=customersdefultobj()
for(si=0;si<tableobjarray.length;si++){
tableobjarray[si].customer_profid=defaultcustomerobj.profid
tableobjarray[si].custname=defaultcustomerobj.profname
tableobjarray[si].customer_userid=defaultcustomerobj.profuserid
tableobjarray[si].remsubinvoice.customer_profid=defaultcustomerobj.profid
tableobjarray[si].remsubinvoice.custname=defaultcustomerobj.profname
tableobjarray[si].remsubinvoice.customer_profid=defaultcustomerobj.profid
////initialize subinv
//for(sia=0;sia<10;sia++){
//tableobjarray[si].subinvoices_arr[sia]={}
//tableobjarray[si].subinvoices_arr[sia]=[]
//}
}///end of for
}/// enf od func

///check if created sub invoices are empty and remove the empty sub invoices from the array and re create the one with itmes with new arrid
function cleanemptysubinv(){
	tableobjarray[document.selectedtableobj].no_ofsubinvoices=tableobjarray[document.selectedtableobj].subinvoices_arr.length
	/// loop in all the created sub invoices in the currently selected table
	for(sa=0;sa<tableobjarray[document.selectedtableobj].subinvoices_arr.length;sa++){
	// alertedrow var subinvnoofitems=tableobjarray[document.selectedtableobj].subinvoices_arr[sa].length
	var subinvnoofitems=tableobjarray[document.selectedtableobj].subinvoices_arr[sa].items.length
	if(parseInt(subinvnoofitems)==0){
		
		$(".sub-inv-div").find("[data-data-subinvarrid='"+sa+"']").remove()
		tableobjarray[document.selectedtableobj].subinvoices_arr.splice(sa,1)
	}
	}
	tableobjarray[document.selectedtableobj].no_ofsubinvoices=tableobjarray[document.selectedtableobj].subinvoices_arr.length
}
//// recalcualte table object and do some actions after reacalcualte 
function recalculate_tableobj(option){
	//// option 1 update order items on click of cashier item to be added to the full invoice and remaining items invoice
	switch(option){
	case 1:
	///set defult customer
tableobjarray[document.selectedtableobj].orderno=document.currentorderno
 //tableobjarray[document.selectedtableobj].invid=getnextid("invoices")
 //tableobjarray[document.selectedtableobj].fullinv_items=[]
 tableobjarray[document.selectedtableobj].cashiername=document.loggedinusername /// to be changed dynamic
 tableobjarray[document.selectedtableobj].cashierid=document.loggedinuserid ///// to be changed dynamic
 //tableobjarray[document.selectedtableobj].customer_profid=6 /// to be changed dynamic
 //tableobjarray[document.selectedtableobj].custname="عميل غير منتظم" /// to be changed dynamic
 //tableobjarray[document.selectedtableobj].customer_userid=3 /// to be changed dynamic
 tableobjarray[document.selectedtableobj].dattime=frmtdatetimesql(0)
 tableobjarray[document.selectedtableobj].dat= frmtdatetimesql(1)
 tableobjarray[document.selectedtableobj].time=frmtdatetimesql(2);
 tableobjarray[document.selectedtableobj].total=0
 tableobjarray[document.selectedtableobj].paidvalue=0
 document.totsubpaid=0
 tableobjarray[document.selectedtableobj].remsubinvoice.total=0
 tableobjarray[document.selectedtableobj].remsubinvoice.tax=0
 tableobjarray[document.selectedtableobj].remsubinvoice.service=0
 tableobjarray[document.selectedtableobj].remsubinvoice.gtotal=0
 tableobjarray[document.selectedtableobj].remvalue=0
var itemsinmainorder=tableobjarray[document.selectedtableobj].fullinv_items.length
var itemsinremsuborder=tableobjarray[document.selectedtableobj].remsubinvoice.length

////calculate the total of the full invoice
///total of full invoice should have 1- ramining subinv 2- all subinv items
 for(ai=0;ai<itemsinmainorder;ai++){
tableobjarray[document.selectedtableobj].fullinv_items[ai].itm_total=(parseFloat(tableobjarray[document.selectedtableobj].fullinv_items[ai].itm_price)*parseInt(tableobjarray[document.selectedtableobj].fullinv_items[ai].itm_qnty))
 tableobjarray[document.selectedtableobj].total+=parseFloat(tableobjarray[document.selectedtableobj].fullinv_items[ai].itm_total)
 }///end for
 
 tableobjarray[document.selectedtableobj].tax=parseFloat(document.taxpers*parseFloat( tableobjarray[document.selectedtableobj].total))
 tableobjarray[document.selectedtableobj].service=parseFloat(document.servicepers*parseFloat( tableobjarray[document.selectedtableobj].total))
///check if there is sub invoices with discount to update full invoice discount value
var subinvoicesSumdiscounts=0
if(tableobjarray[document.selectedtableobj].subinvoices_arr.length>0){
	///////looop through all sub invoices and get the total sum of all sub inv discounts
	for(ors=0;ors<tableobjarray[document.selectedtableobj].subinvoices_arr.length;ors++){
		subinvoicesSumdiscounts+=parseFloat(tableobjarray[document.selectedtableobj].subinvoices_arr[ors].discount)
		//document.sum_subinvDisc//=subinvoicesSumdiscounts
		//console.log(document.sum_subinvDisc+"   "+subinvoicesSumdiscounts)
	}
	///update full inovice discount with the discounts in sub invoices
 tableobjarray[document.selectedtableobj].discount=subinvoicesSumdiscounts
 }
 //tableobjarray[document.selectedtableobj].discount=parseFloat(0) /// the descount input box
 tableobjarray[document.selectedtableobj].gtotal=parseFloat(tableobjarray[document.selectedtableobj].total)+tableobjarray[document.selectedtableobj].tax+tableobjarray[document.selectedtableobj].service-tableobjarray[document.selectedtableobj].discount
 console.log(tableobjarray[document.selectedtableobj].gtotal)
 ///calcualte the total of the rem sub invoice
 for(aai=0;aai<itemsinremsuborder;aai++){
	  tableobjarray[document.selectedtableobj].remsubinvoice[aai].itm_total=(parseFloat(tableobjarray[document.selectedtableobj].remsubinvoice[aai].itm_price)*parseInt(tableobjarray[document.selectedtableobj].remsubinvoice[aai].itm_qnty))
 
 tableobjarray[document.selectedtableobj].remsubinvoice.total+=parseFloat(tableobjarray[document.selectedtableobj].remsubinvoice[aai].itm_total)
 }
  tableobjarray[document.selectedtableobj].remsubinvoice.tax=parseFloat(document.taxpers*parseFloat( tableobjarray[document.selectedtableobj].remsubinvoice.total))
 tableobjarray[document.selectedtableobj].remsubinvoice.service=parseFloat(document.servicepers*parseFloat( tableobjarray[document.selectedtableobj].remsubinvoice.total))
 tableobjarray[document.selectedtableobj].remsubinvoice.discount=parseFloat(0) /// the descount input box
 tableobjarray[document.selectedtableobj].remsubinvoice.gtotal=parseFloat(tableobjarray[document.selectedtableobj].remsubinvoice.total)+tableobjarray[document.selectedtableobj].remsubinvoice.tax+tableobjarray[document.selectedtableobj].remsubinvoice.service-tableobjarray[document.selectedtableobj].remsubinvoice.discount
 
 
 //tableobjarray[document.selectedtableobj].paymentstatus=0
 tableobjarray[document.selectedtableobj].desc=""
 //tableobjarray[document.selectedtableobj].remsubinvoice=[] /// array of objects (remaining items from creating sub invoices)
  tableobjarray[document.selectedtableobj].no_ofsubinvoices=tableobjarray[document.selectedtableobj].subinvoices_arr.length /// number of sub invoices will be reacalulated in each action
  if(parseInt(tableobjarray[document.selectedtableobj].no_ofsubinvoices)==0){
 tableobjarray[document.selectedtableobj].remvalue=tableobjarray[document.selectedtableobj].gtotal
  }else{
	  //document.totsubpaid=0
	  for(iaa=0;iaa<tableobjarray[document.selectedtableobj].no_ofsubinvoices ;iaa++){
		  /// code for getting sub invoices total looping through each item in each sub invoice and calculate total
		  ///reset discount
		 // tableobjarray[document.selectedtableobj].subinvoices_arr[iaa].discount=0;
		 var subinvitemslnth=tableobjarray[document.selectedtableobj].subinvoices_arr[iaa].items.length
		 /*
		 for(gd=0;gd<subinvitemslnth;gd++){
		 tableobjarray[document.selectedtableobj].subinvoices_arr[iaa].total+=(parseFloat(subinvitemslnth=tableobjarray[document.selectedtableobj].subinvoices_arr[iaa].items[gd].itm_total));
		 }
		 tableobjarray[document.selectedtableobj].subinvoices_arr[iaa].tax=parseFloat(document.taxpers*parseFloat( tableobjarray[document.selectedtableobj].subinvoices_arr[iaa].total))
		 */
		 tableobjarray[document.selectedtableobj].subinvoices_arr[iaa].service=parseFloat(document.servicepers*parseFloat( tableobjarray[document.selectedtableobj].subinvoices_arr[iaa].total))
		 //tableobjarray[document.selectedtableobj].subinvoices_arr[iaa].discount=
tableobjarray[document.selectedtableobj].subinvoices_arr[iaa].gtotal=(parseFloat(tableobjarray[document.selectedtableobj].subinvoices_arr[iaa].total))+(parseFloat(tableobjarray[document.selectedtableobj].subinvoices_arr[iaa].service))+(parseFloat(tableobjarray[document.selectedtableobj].subinvoices_arr[iaa].tax))-(parseFloat(tableobjarray[document.selectedtableobj].subinvoices_arr[iaa].discount));
		 /////calculate the remaining unpaid sub invoices and put value in remvalue
		 if(tableobjarray[document.selectedtableobj].subinvoices_arr[iaa].paid==1){
			 document.totsubpaid+=tableobjarray[document.selectedtableobj].subinvoices_arr[iaa].gtotal
			 
		 }
		 
	}
	/////calculate the remaining unpaid sub invoices and put value in remvalue
	tableobjarray[document.selectedtableobj].paidvalue=document.totsubpaid;
	  tableobjarray[document.selectedtableobj].remvalue=(parseFloat(tableobjarray[document.selectedtableobj].gtotal)-parseFloat(tableobjarray[document.selectedtableobj].paidvalue))//-document.sum_subinvDisc//tableobjarray[document.selectedtableobj].gtotal
	  console.log(tableobjarray[document.selectedtableobj].paidvalue+" remaining val  "+tableobjarray[document.selectedtableobj].remvalue)
  }
 //tableobjarray[document.selectedtableobj].subinvoices_arr=[] //// an array of sub invoices it is array of arrays where 0:[{},{}] is sub invoice 1 with objects of items array
 if(tableobjarray[document.selectedtableobj].orderno!=null){
 //update_tableorder()
 }
	break;	
	}//end of switch
}///end of func
/// update table top buttons values and total and remaining values info labels
function update_tablebtninfo(){
	/*
	//document.sum_subinvDisc=0
	//tableobjarray[document.selectedtableobj].subinvoices_arr[document.selectedsubinvarrid]
	/////////////////////////////reacalulate paid and remaining value
	document.sum_subinvDisc=0///total paid sub inv
	tableobjarray[document.selectedtableobj].remvalue=tableobjarray[document.selectedtableobj].gtotal
		  for(iaa=0;iaa<tableobjarray[document.selectedtableobj].no_ofsubinvoices ;iaa++){
		  /// code for getting sub invoices total looping through each item in each sub invoice and calculate total
		  ///reset discount
		 // tableobjarray[document.selectedtableobj].subinvoices_arr[iaa].discount=0;
		 tableobjarray[document.selectedtableobj].subinvoices_arr[iaa].gtotal=(parseFloat(tableobjarray[document.selectedtableobj].subinvoices_arr[iaa].total))+(parseFloat(tableobjarray[document.selectedtableobj].subinvoices_arr[iaa].service))+(parseFloat(tableobjarray[document.selectedtableobj].subinvoices_arr[iaa].tax))-(parseFloat(tableobjarray[document.selectedtableobj].subinvoices_arr[iaa].discount));
		 /////calculate the remaining unpaid sub invoices and put value in remvalue
		 if(tableobjarray[document.selectedtableobj].subinvoices_arr[iaa].paid==1){
			 document.totsubpaid+=tableobjarray[document.selectedtableobj].subinvoices_arr[iaa].gtotal
			 
		 }
		 
	}
	document.sum_subinvDisc=document.totsubpaid
	tableobjarray[document.selectedtableobj].remvalue=tableobjarray[document.selectedtableobj].gtotal-document.totsubpaid*/
	
	////////////////////////////////////////////////
	$(".tables-container .tblcontainer2").find("[data-tableobjid='"+document.selectedtableobj+"']").find("div.tblbox-rem").html(parseFloat(tableobjarray[document.selectedtableobj].gtotal).toFixed(2))	
$(".bigtotal_rem_inv_show .fullinv_val").html(parseFloat(tableobjarray[document.selectedtableobj].gtotal).toFixed(2));
//// calcualte the paid sub invoices and show the value
$(".bigtotal_rem_inv_show .totdisc_val").html((tableobjarray[document.selectedtableobj].paidvalue).toFixed(2));
//////show the remaining value
$(".bigtotal_rem_inv_show .remvalue_val").html((tableobjarray[document.selectedtableobj].remvalue).toFixed(2));

}
/////redrau full invoice
function redrow_full_invoice(){
	//tableobjarray[document.selectedtableobj].invid=getnextid("invoices")
	var fullinvcontainer=$(".table-full-view-inv")
	var fullinv_orderno= $(".table-full-view-inv .inv_data_row .order_num")
	var fullinv_invid= $(".table-full-view-inv .inv_data_row .order_invid")
	var fullinv_orderdattime= $(".table-full-view-inv .inv_data_row .order_dattime")
	var fullinv_tableno= $(".table-full-view-inv .inv_data_row .tableno")
	var fullinv_cashname= $(".table-full-view-inv .inv_data_row .cashiername")
	var fullinv_taxcont= $(".table-full-view-inv .inv_table .taxrow")
	var fullinv_servcont= $(".table-full-view-inv .inv_table .servrow")
	var fullinv_disccont= $(".table-full-view-inv .inv_table .discrow")
	var fullinv_gtotal= $(".table-full-view-inv .inv_table .gtotalrow .inv_cost_col001")

	var fullinv_items_container= $(".table-full-view-inv .itemsrows ")	
	fullinv_items_container.find(".invitemrow").remove();
	
	fullinv_orderno.html(document.currentorderno)
	fullinv_orderno.attr('data-id',document.currentorderno)
	
	fullinv_invid.html(tableobjarray[document.selectedtableobj].invid)
	fullinv_invid.attr('data-id',tableobjarray[document.selectedtableobj].invid)
	
	fullinv_orderdattime.html(tableobjarray[document.selectedtableobj].dattime)
	fullinv_orderdattime.attr('data-id',tableobjarray[document.selectedtableobj].dattime)
	
	fullinv_tableno.html(tableobjarray[document.selectedtableobj].tableno)
	fullinv_tableno.attr('data-id',tableobjarray[document.selectedtableobj].tableno)
	
	fullinv_cashname.html(tableobjarray[document.selectedtableobj].cashiername)
	fullinv_cashname.attr('data-id',tableobjarray[document.selectedtableobj].cashierid)
	
	fullinv_taxcont.find(".inv_unitpr_col001").html((parseFloat(document.taxpers)*100).toFixed(0)+"%")
	fullinv_taxcont.find(".inv_cost_col001").html((tableobjarray[document.selectedtableobj].tax).toFixed(2))
	
	fullinv_servcont.find(".inv_unitpr_col001").html((parseFloat(document.servicepers)*100).toFixed(0)+"%")
	fullinv_servcont.find(".inv_cost_col001").html((tableobjarray[document.selectedtableobj].service).toFixed(2))
	
	fullinv_disccont.find(".inv_cost_col001").html((tableobjarray[document.selectedtableobj].discount).toFixed(2))
	fullinv_gtotal.html((tableobjarray[document.selectedtableobj].gtotal).toFixed(2))
	nuoffullinvitems=tableobjarray[document.selectedtableobj].fullinv_items.length
	
	for(aiai=0;aiai<nuoffullinvitems;aiai++){
		var invitmrow="<div class='inv_tbl_datarows invitemrow'  data-itmid='"+tableobjarray[document.selectedtableobj].fullinv_items[aiai].itmid+"' data-itmqnty='"+tableobjarray[document.selectedtableobj].fullinv_items[aiai].itm_qnty+"' data-itmunprice='"+tableobjarray[document.selectedtableobj].fullinv_items[aiai].itm_price+"' data-itmtot='"+tableobjarray[document.selectedtableobj].fullinv_items[aiai].itm_total+"'><div class='inv_name_col001 inv_row_col'>"+tableobjarray[document.selectedtableobj].fullinv_items[aiai].itm_lname+"</div><div class='inv_unitpr_col001 inv_row_col'>"+tableobjarray[document.selectedtableobj].fullinv_items[aiai].itm_price+"</div><div class='inv_qunt_col001 inv_row_col'>"+tableobjarray[document.selectedtableobj].fullinv_items[aiai].itm_qnty+"</div><div class='inv_cost_col001 inv_row_col'>"+tableobjarray[document.selectedtableobj].fullinv_items[aiai].itm_total+"</div></div>"
		fullinv_items_container.append(invitmrow)
	}
}
///////redraw remaining sub invoices table
function redrow_rem_sub_invoice(){
	var remsubinvcontainer=$(".table-remsub-invoice")
	var remsubinv_orderno= $(".table-remsub-invoice .inv_data_row .order_num")
	var remsubinv_orderdattime= $(".table-remsub-invoice .inv_data_row .order_dattime")
	var remsubinv_tableno= $(".table-remsub-invoice .inv_data_row .tableno")
	var remsubinv_customername= $(".table-remsub-invoice .inv_data_row .customername")
	var remsubinv_cashname= $(".table-remsub-invoice .inv_data_row .cashiername")
	var remsubinv_taxcont= $(".table-remsub-invoice .inv_table .taxrow")
	var remsubinv_servcont= $(".table-remsub-invoice .inv_table .servrow")
	var remsubinv_disccont= $(".table-remsub-invoice .inv_table .discrow")
	var remsubinv_gtotal= $(".table-remsub-invoice .inv_table .gtotalrow .inv_cost_col")

	var remsubinv_items_container= $(".table-remsub-invoice .itemsrows")
	remsubinv_items_container.find(".invitemrow").remove();
	remsubinv_orderno.html(document.currentorderno)
	remsubinv_orderno.attr('data-id',document.currentorderno)
	
	remsubinv_orderdattime.html(tableobjarray[document.selectedtableobj].dattime)
	remsubinv_orderdattime.attr('data-id',tableobjarray[document.selectedtableobj].dattime)
	
	remsubinv_tableno.html(tableobjarray[document.selectedtableobj].tableno)
	remsubinv_tableno.attr('data-id',tableobjarray[document.selectedtableobj].tableno)
	
	remsubinv_customername.html(tableobjarray[document.selectedtableobj].custname)
	remsubinv_customername.attr('data-custprofid',tableobjarray[document.selectedtableobj].customer_profid)
	
	remsubinv_cashname.html(tableobjarray[document.selectedtableobj].cashiername)
	remsubinv_cashname.attr('data-id',tableobjarray[document.selectedtableobj].cashierid)
	
	remsubinv_taxcont.find(".inv_unitpr_col").html((parseFloat(document.taxpers)*100).toFixed(0)+"%")
	remsubinv_taxcont.find(".inv_cost_col").html((tableobjarray[document.selectedtableobj].remsubinvoice.tax).toFixed(2))
	
	remsubinv_servcont.find(".inv_unitpr_col").html((parseFloat(document.servicepers)*100).toFixed(0)+"%")
	remsubinv_servcont.find(".inv_cost_col").html((tableobjarray[document.selectedtableobj].remsubinvoice.service).toFixed(2))
	
	remsubinv_disccont.find(".inv_cost_col").html(tableobjarray[document.selectedtableobj].remsubinvoice.discount)
	remsubinv_gtotal.html((tableobjarray[document.selectedtableobj].remsubinvoice.gtotal).toFixed(2))
	nuofremsubinvitems=tableobjarray[document.selectedtableobj].remsubinvoice.length
	
	for(aiai=0;aiai<nuofremsubinvitems;aiai++){
		////itmid:itmid,itm_lname:itm_lname,itm_desc:itm_desc,itm_price:itm_price,itm_qnty:1,itm_total:
		var subinvitemobj=tableobjarray[document.selectedtableobj].remsubinvoice[aiai]
		var invitmrow="<div class='inv_tbl_datarows invitemrow' data-itmid='"+subinvitemobj.itmid+"' data-remsubinv_arrid='"+aiai+"' data-itmqnty='"+subinvitemobj.itm_qnty+"' data-itmunprice='"+subinvitemobj.itm_price+"' data-itmtot='"+subinvitemobj.itm_total+"'><div class='inv_name_col inv_row_col'>"+subinvitemobj.itm_lname+"</div><div class='inv_unitpr_col inv_row_col'>"+subinvitemobj.itm_price+"</div><div class='inv_qunt_col inv_row_col'>"+subinvitemobj.itm_qnty+"</div><div class='inv_cost_col inv_row_col'>"+subinvitemobj.itm_total+"</div><div class='inv_controls_col inv_row_col pswcol clickable-div' data-itmid='"+subinvitemobj.itmid+"' data-remsubinv_arrid='"+aiai+"' data-itmqnty='"+subinvitemobj.itm_qnty+"' data-itmunprice='"+subinvitemobj.itm_price+"' data-itmtot='"+subinvitemobj.itm_total+"' style='display: none;'><img data-arrid='"+aiai+"' align='middle' class='ingr_remove clickable-div' src='../images/del24.png'></div><div class='inv_controls_col inv_row_col tosubinv clickable-div' data-itmid='"+subinvitemobj.itmid+"' data-remsubinv_arrid='"+aiai+"' data-itmqnty='"+subinvitemobj.itm_qnty+"' data-itmunprice='"+subinvitemobj.itm_price+"' data-itmdesc='"+subinvitemobj.itm_lname+"' data-itmlname='"+subinvitemobj.itm_lname+"' data-itmtot='"+subinvitemobj.itm_total+"'><img data-id='0' align='middle' class='ingr_add' src='../images/toleft_arr_24.png'></div></div>"
		
		
		remsubinv_items_container.append(invitmrow)
	}
}
////////DB get prder number
function getordernumber(){
	
}
////create sub invoice 
function createsubinvoicebtns(){
$(document).ready(function() {
		//// check if the remaining value is zero
var remvalue=tableobjarray[document.selectedtableobj].remvalue
///get defult customer
defaultcustomerobj={}
defaultcustomerobj=customersdefultobj()
tableobjarray[document.selectedtableobj].customer_profid=defaultcustomerobj.profid
tableobjarray[document.selectedtableobj].custname=defaultcustomerobj.profname
tableobjarray[document.selectedtableobj].customer_userid=defaultcustomerobj.profuserid
//////
		if(parseFloat(remvalue)>0){
	var numsubinv=tableobjarray[document.selectedtableobj].subinvoices_arr.length

	$(".inv-buttons-sub-inv .sub-invoices-btns").find('.subbtn').remove()
	//if(numsubinv>0){
		tableobjarray[document.selectedtableobj].subinvoices_arr[numsubinv]={}
		//tableobjarray[document.selectedtableobj].subinvoices_arr[numsubinv]=[]
		tableobjarray[document.selectedtableobj].subinvoices_arr[numsubinv].total=0
		tableobjarray[document.selectedtableobj].subinvoices_arr[numsubinv].tax=0
		tableobjarray[document.selectedtableobj].subinvoices_arr[numsubinv].service=0
		tableobjarray[document.selectedtableobj].subinvoices_arr[numsubinv].discount=0
		tableobjarray[document.selectedtableobj].subinvoices_arr[numsubinv].gtotal=0
		tableobjarray[document.selectedtableobj].subinvoices_arr[numsubinv].customer_profid=0
		tableobjarray[document.selectedtableobj].subinvoices_arr[numsubinv].custname=""
		tableobjarray[document.selectedtableobj].subinvoices_arr[numsubinv].customer_userid=0
		tableobjarray[document.selectedtableobj].subinvoices_arr[numsubinv].paid=0
		tableobjarray[document.selectedtableobj].subinvoices_arr[numsubinv].items=[]
		for(xi=0;xi<(parseInt(numsubinv)+1);xi++){
			var subinvbtn="<div class='button button-flat clickable-div subbtn' data-subbtnarrid='"+xi+"'>"+(parseInt(xi)+1)+"</div>"
			$('.sub-invoices-btns').append(subinvbtn)
			
		}
	//}
	$(".inv-buttons-sub-inv .sub-invoices-btns").find("[data-subbtnarrid='"+numsubinv+"']").addClass('activtbl').siblings().removeClass('activtbl')
	tableobjarray[document.selectedtableobj].no_ofsubinvoices=tableobjarray[document.selectedtableobj].subinvoices_arr.length /// number of sub invoices will be reacalulated in each action
	var selectedsuborder=$(this).data('subbtnarrid')
	document.selectedsubinvarrid=numsubinv
	tableobjarray[document.selectedtableobj].subinvoices_arr[numsubinv].customer_profid=defaultcustomerobj.profid
		tableobjarray[document.selectedtableobj].subinvoices_arr[numsubinv].custname=defaultcustomerobj.profname
		tableobjarray[document.selectedtableobj].subinvoices_arr[numsubinv].customer_userid=defaultcustomerobj.profuserid
	redrowsubinvoice(numsubinv)
	
	}///end of if remaining value > 0
	})
	
}
//////redraw sub invoice table
function redrowsubinvoice(subinvarrayindex){
	/////check if the customer is one of the owners to set discount to 100%
	/*var selectedproftype=null
	for(yy=0;yy<customerslist.length;yy++){
	if(parseInt(tableobjarray[document.selectedtableobj].subinvoices_arr[subinvarrayindex].customer_profid)==parseInt(customerslist[yy].profid)){
	selectedproftype= customerslist[yy].proftype
	}//end if
	}//end for
	if(selectedproftype==2){///if profile type is owner set discount to be 100%
		tableobjarray[document.selectedtableobj].subinvoices_arr[subinvarrayindex].discount=tableobjarray[document.selectedtableobj].subinvoices_arr[subinvarrayindex].gtotal
	}*/
	////////////////////
$(".sub-inv-div").find('.table-sub-invoice').remove()
/////sub invoice header
var subinv_info="<div class='table-sub-invoice' data-subinvarrid='"+subinvarrayindex+"'><div class='inv_data_row'> اوردر رقم :  <div class='inlinediv'  data-ordersubid='"+tableobjarray[document.selectedtableobj].orderno+"-"+(parseInt(subinvarrayindex)+1)+"'>"+tableobjarray[document.selectedtableobj].orderno+"-"+(parseInt(subinvarrayindex)+1)+"</div></div><div class='inv_data_row'> فاتورة رقم :  <div class='inlinediv'  data-invid='"+tableobjarray[document.selectedtableobj].orderno+"-"+tableobjarray[document.selectedtableobj].no_ofsubinvoices+"'>"+tableobjarray[document.selectedtableobj].invid+"-"+(parseInt(subinvarrayindex)+1)+"</div></div><div class='inv_data_row'> تاريخ :  <div class='inlinediv' data-orddat='"+tableobjarray[document.selectedtableobj].dattime+"'>"+tableobjarray[document.selectedtableobj].dattime+"</div></div><div class='inv_data_row'>طاولة رقم :  <div class='inlinediv' data-tableno='"+tableobjarray[document.selectedtableobj].tableno+"'>"+tableobjarray[document.selectedtableobj].tableno+"</div></div><div class='inv_data_row'> اسم العميل :  <div class='inlinediv' data-custname='"+tableobjarray[document.selectedtableobj].subinvoices_arr[subinvarrayindex].custname+"' data-custprofid='"+tableobjarray[document.selectedtableobj].subinvoices_arr[subinvarrayindex].customer_profid+"' data-custprofuserid='"+tableobjarray[document.selectedtableobj].subinvoices_arr[subinvarrayindex].customer_userid+"'>"+tableobjarray[document.selectedtableobj].subinvoices_arr[subinvarrayindex].custname+"</div></div><div class='inv_data_row'> كاشير :  <div class='inlinediv'  data-cashuserid='"+tableobjarray[document.selectedtableobj].cashierid+"' data-cashusername='"+tableobjarray[document.selectedtableobj].cashiername+"'>"+tableobjarray[document.selectedtableobj].cashiername+"</div></div><div class='inv_table'><div class='inv_tbl_head'><div class='inv_name_col inv_row_col'>اسم الصنف</div><div class='inv_unitpr_col inv_row_col'>سعر الوحدة</div><div class='inv_qunt_col inv_row_col'>الكمية</div><div class='inv_cost_col inv_row_col'>الاجمالي</div><div class='inv_controls_col inv_row_col'>حذف </div></div><div class='inv_tbl_datarows subinvitemsrows'>"
	
	//$(".sub-inv-div").append(subinv_info)

var noofitemsinsubinv=tableobjarray[document.selectedtableobj].subinvoices_arr[subinvarrayindex].length
var noofitemsinsubinv=tableobjarray[document.selectedtableobj].subinvoices_arr[subinvarrayindex].items.length ////alertedrow

//$(".sub-inv-div .subinvitemsrows").find('.subinvitemrow').remove()
var subinvitmrow=""
tableobjarray[document.selectedtableobj].subinvoices_arr[subinvarrayindex].total=0
	for(ui=0;ui<noofitemsinsubinv;ui++){
	//alertedrow	var subinvitemobj=tableobjarray[document.selectedtableobj].subinvoices_arr[subinvarrayindex][ui];
	var subinvitemobj=tableobjarray[document.selectedtableobj].subinvoices_arr[subinvarrayindex].items[ui];		
		tableobjarray[document.selectedtableobj].subinvoices_arr[subinvarrayindex].total+=subinvitemobj.itm_total;
		
		subinvitmrow+="<div class='inv_tbl_datarows subinvitemrow' data-itmid='"+subinvitemobj.itmid+"' data-subinv_arrid='"+ui+"' data-itmqnty='"+subinvitemobj.itm_qnty+"' data-itmunprice='"+subinvitemobj.itm_price+"' data-itmtot='"+subinvitemobj.itm_total+"'><div class='inv_name_col inv_row_col'>"+subinvitemobj.itm_lname+"</div><div class='inv_unitpr_col inv_row_col'>"+subinvitemobj.itm_price+"</div><div class='inv_qunt_col inv_row_col'>"+subinvitemobj.itm_qnty+"</div><div class='inv_cost_col inv_row_col'>"+subinvitemobj.itm_total+"</div><div class='inv_controls_col inv_row_col removesubinvitem' data-itmid='"+subinvitemobj.itmid+"' data-subinv_arrid='"+ui+"' data-itmqnty='"+subinvitemobj.itm_qnty+"' data-itmunprice='"+subinvitemobj.itm_price+"' data-itmtot='"+subinvitemobj.itm_total+"'><img data-arrid='"+ui+"' align='middle' class='ingr_remove clickable-div' src='../images/del24.png'></div>";
		
	}
	//$(".sub-inv-div .subinvitemsrows").append(subinvitmrow);
var subinvtot=tableobjarray[document.selectedtableobj].subinvoices_arr[subinvarrayindex].total
var subinvtax=parseFloat(parseFloat(document.taxpers)*parseFloat(subinvtot))
var subinvservice=parseFloat(parseFloat(document.servicepers)*parseFloat(subinvtot))
var subinvdiscount=tableobjarray[document.selectedtableobj].subinvoices_arr[subinvarrayindex].discount;//parseFloat(0)
var subinvgtotal=subinvtot+subinvtax+subinvservice-subinvdiscount
tableobjarray[document.selectedtableobj].subinvoices_arr[subinvarrayindex].tax=subinvtax
		tableobjarray[document.selectedtableobj].subinvoices_arr[subinvarrayindex].service=subinvservice
		tableobjarray[document.selectedtableobj].subinvoices_arr[subinvarrayindex].discount=subinvdiscount
		tableobjarray[document.selectedtableobj].subinvoices_arr[subinvarrayindex].gtotal=subinvgtotal
		var subinvfooter="</div></div><!-----end of inv_table--><div id='taxrow' class='inv_tbl_datarows'><div class='inv_name_col inv_row_col'>الضريبة</div><div class='inv_unitpr_col inv_row_col'>"+(parseFloat(document.taxpers)*100).toFixed(0)+"%</div><div class='inv_qunt_col inv_row_col'></div><div class='inv_cost_col inv_row_col'>"+subinvtax.toFixed(2)+"</div><div class='inv_controls_col inv_row_col'></div></div><div class='inv_tbl_datarows servrow'><div class='inv_name_col inv_row_col'>الخدمة</div><div class='inv_unitpr_col inv_row_col'>"+(parseFloat(document.servicepers)*100).toFixed(0)+"%</div><div class='inv_qunt_col inv_row_col'></div><div class='inv_cost_col inv_row_col'>"+subinvservice.toFixed(2)+"</div><div class='inv_controls_col inv_row_col'></div></div><div class='inv_tbl_datarows discrow'><div class='inv_name_col inv_row_col'>الخصم</div><div class='inv_unitpr_col inv_row_col'><div data-valpers='pers' data-discinv='subinv' class='adddisc clickable-div button'>%</div></div><div class='inv_qunt_col inv_row_col'><div data-valpers='val' data-discinv='sub' class='adddisc clickable-div button'>خصم</div></div><div class='inv_cost_col inv_row_col'>"+subinvdiscount.toFixed(2)+"</div><div class='inv_controls_col inv_row_col'></div></div><div class='inv_tbl_datarows gtotalrow'><div class='inv_name_col inv_row_col'>الاجمالي</div><div class='inv_unitpr_col inv_row_col'></div><div class='inv_qunt_col inv_row_col'></div><div class='inv_cost_col inv_row_col'>"+subinvgtotal.toFixed(2)+"</div><div class='inv_controls_col inv_row_col'></div></div><div class='subinvbtns'><div class='button button-caution paysubbtns clickable-div paysubinv' data-btntype='paynow'>دفع</div><div class='button button-action paysubbtns clickable-div paylatersubinv' data-btntype='paylater'>دفع آجل</div><div class='button paysubbtns clickable-div printsubinv button-primary' data-clickedbtn='printsubinv' data-btntype='print'>طباعة</div></div></div><!-----end of invoice tbl--></div><!-----end of sub-inv-divl-->"
	
	//$(".sub-inv-div").append(subinvfooter)
	
	$(".sub-inv-div").append(subinv_info+subinvitmrow+subinvfooter)
	//tableobjarray[document.selectedtableobj].no_ofsubinvoices=tableobjarray[document.selectedtableobj].subinvoices_arr.length /// number of 
	//alert(subinvarrayindex)
	if((parseInt(tableobjarray[document.selectedtableobj].subinvoices_arr[subinvarrayindex].length))<1 || ( tableobjarray[document.selectedtableobj].subinvoices_arr[subinvarrayindex].gtotal<0.09 && tableobjarray[document.selectedtableobj].subinvoices_arr[subinvarrayindex].discount==0)){
	$(".table-sub-invoice .paysubbtns").hide()
	}else{
	$(".table-sub-invoice .paysubbtns").show()
	}
	/// if the selected user is general user dont show pay later
	if(parseInt(tableobjarray[document.selectedtableobj].subinvoices_arr[subinvarrayindex].customer_profid)==16){
		$(".table-sub-invoice .paylatersubinv").hide()
	}else{
		if(tableobjarray[document.selectedtableobj].subinvoices_arr[document.selectedsubinvarrid].gtotal>0){
		$(".table-sub-invoice .paylatersubinv").show()
		}
	}
	/////hide controls for paid sub invoices
	hidesubinvcontrols_forpaid()
	
}//end of function

///populate sub inv customers select options 
function populate_subinv_cust_dd(){
	$(document).ready(function() {
	$("#ordersubinv_cust_op").find('option').remove()
	for(os=0;os<customerslist.length;os++){
		$("#ordersubinv_cust_op").append("<option value='"+customerslist[os].profid+"' data-profid='"+customerslist[os].profid+"' data-profname='"+customerslist[os].profname+"' data-custtype='"+customerslist[os].proftype+"' data-custuserid='"+customerslist[os].profuserid+"' >"+customerslist[os].profname+"</option>")
	}
	var defultcust=$("#ordersubinv_cust_op").find("[data-profid='16']").val()
	$("#ordersubinv_cust_op").val(16)
	})
}//end func

/////recreate sub inv buttons
function recreatesubinvbtns(){
cleanemptysubinv();
		//redrowsubinvoice(document.selectedsubinvarrid)
		var numsubinv=tableobjarray[document.selectedtableobj].subinvoices_arr.length
		$(".inv-buttons-sub-inv .sub-invoices-btns").find('.subbtn').remove()
		//alert(numsubinv)
		//if(numsubinv>0){
		//tableobjarray[document.selectedtableobj].subinvoices_arr[numsubinv]=[]
		for(xi=0;xi<(parseInt(numsubinv));xi++){
			var subinvbtn="<div class='button button-flat subbtn' data-subbtnarrid='"+xi+"'>"+(parseInt(xi)+1)+"</div>"
			$('.sub-invoices-btns').append(subinvbtn)
			
		}	
}///// end function

/////DB save new order
function savenewtableorder(){
	//order_dattime datetime,order_dat date,order_time time,table_no int,sub_orders_no int,table_json longtext,userid int
var parameters= tableobjarray[document.selectedtableobj].dattime+'~'+tableobjarray[document.selectedtableobj].dat+'~'+tableobjarray[document.selectedtableobj].time+'~'+(parseInt(document.selectedtableobj)+1)+'~'+tableobjarray[document.selectedtableobj].no_ofsubinvoices+'~'+JSON.stringify(tableobjarray[document.selectedtableobj])+'~'+tableobjarray[document.selectedtableobj].cashierid;

$.ajaxSetup({async:false});
$.post("../php/cashier_func.php",{param:'10~'+parameters},function(server_response) {
			data = parseInt(server_response);
			document.currentorderno=data
			tableobjarray[document.selectedtableobj].orderno=data
});
}

///DB update order
function update_tableorder(){
	//param = orderno, tableno, dattim, dat, time, suborders no, table json, userid
	   
var parameters= tableobjarray[document.selectedtableobj].orderno+'~'+(parseInt(document.selectedtableobj)+1)+"~"+tableobjarray[document.selectedtableobj].dattime+'~'+tableobjarray[document.selectedtableobj].dat+'~'+tableobjarray[document.selectedtableobj].time+'~'+tableobjarray[document.selectedtableobj].no_ofsubinvoices+'~'+JSON.stringify(tableobjarray[document.selectedtableobj])+'~'+tableobjarray[document.selectedtableobj].cashierid;

$.ajaxSetup({async:false});
$.post("../php/cashier_func.php",{param:'11~'+parameters},function(server_response) {

if(server_response=="succeded"){
//alert("تم تحديث الاوردر")
}else{
//alert("حدث خطأ اثناء حفظ البيانات     "+server_response)
}

});
}

///close table order
function closetable(){
	tableobjarray[document.selectedtableobj].orderno=null
	tableobjarray[document.selectedtableobj].invid=null
	tableobjarray[document.selectedtableobj].cashiername=document.loggedinusername
	tableobjarray[document.selectedtableobj].cashierid=document.loggedinuserid
	tableobjarray[document.selectedtableobj].discount=0
	tableobjarray[document.selectedtableobj].gtotal=0
	tableobjarray[document.selectedtableobj].no_ofsubinvoices=0
	tableobjarray[document.selectedtableobj].paymentstatus=0
	tableobjarray[document.selectedtableobj].remvalue=0
	tableobjarray[document.selectedtableobj].service=0
	tableobjarray[document.selectedtableobj].tax=0
	tableobjarray[document.selectedtableobj].total=0
	tableobjarray[document.selectedtableobj].subinvoices_arr.splice(0,(tableobjarray[document.selectedtableobj].subinvoices_arr.length))
	tableobjarray[document.selectedtableobj].remsubinvoice.splice(0,(tableobjarray[document.selectedtableobj].remsubinvoice.length))
	tableobjarray[document.selectedtableobj].fullinv_items.splice(0,(tableobjarray[document.selectedtableobj].fullinv_items.length))
	document.currentorderno=null
	////hide paynow and print btns
	$(".table-full-view-inv .fullinvbtns").hide();
}
function hidesubinvcontrols_forpaid(){
	
	////check if the selected sub invoice is paid then hide controls
	if(tableobjarray[document.selectedtableobj].subinvoices_arr[document.selectedsubinvarrid].paid==1){
		$(".sub-inv-div [data-subinvarrid='"+(parseInt(document.selectedsubinvarrid))+"']").find(".removesubinvitem").hide()
$(".sub-inv-div [data-subinvarrid='"+(parseInt(document.selectedsubinvarrid))+"']").find(".adddisc").hide()
$(".sub-inv-div [data-subinvarrid='"+(parseInt(document.selectedsubinvarrid))+"']").find(".paylatersubinv").hide()
$(".sub-inv-div [data-subinvarrid='"+(parseInt(document.selectedsubinvarrid))+"']").find(".paysubinv").hide()
	}
}

function closesubinvoice(){
////set the selected sub invoice paid status to 1 (paid)
tableobjarray[document.selectedtableobj].subinvoices_arr[document.selectedsubinvarrid].paid=1;
////hide all controls dont forget to disable moving item to this sub invoice
///make this function for paid invoices
hidesubinvcontrols_forpaid()
////check if all sub invoices are paid and there is no ramianing values to close the table

if(tableobjarray[document.selectedtableobj]<0.09){//if all sub invoices are paid
alert("تم دفع جميع الفواتير على هذه الطاولة - يرجى الذهاب الى الفاتورة المجمعة لاغلاق الطاولة")
}
}
////function to get next id of any table
function getnextid(tablename){
	var next_id =0;
	$.ajaxSetup({async:false});
$.post("../php/db_query_fun.php",{param:'3~'+tablename},function(server_response) {
		next_id =parseInt(server_response);
});	
return next_id;
}

function paynow_later_subinv(now1later0){
	document.subinvpaystep=1
	//intialize variables
	var selsubinvtableobj=tableobjarray[document.selectedtableobj].subinvoices_arr[document.selectedsubinvarrid]
	var orderno=tableobjarray[document.selectedtableobj].orderno
	var suborderno=parseInt(document.selectedsubinvarrid)+1
	var invno=tableobjarray[document.selectedtableobj].invid
	var subinvno=parseInt(document.selectedsubinvarrid)+1
	var tblno=tableobjarray[document.selectedtableobj].tableno
	var subinvdat=frmtdatetimesql(1)
	var subinvtime=frmtdatetimesql(2)
	var subinvdattime=frmtdatetimesql(0)
	var cashierid=tableobjarray[document.selectedtableobj].cashierid
	var cashiername=tableobjarray[document.selectedtableobj].cashiername
	var cust_profid=selsubinvtableobj.customer_profid
	var cust_userid=selsubinvtableobj.customer_userid
	var subinvjson=JSON.stringify(tableobjarray[document.selectedtableobj].subinvoices_arr[document.selectedsubinvarrid])
	var sub_inv_desc=""
		///step 1 : save sub invoice
////maininv_id, subinv_no, orderid, suborderid, cashierid, cust_profid, cust_userid, total, tax, service, disc, gtotal, paidstatus, dat, tim, dattime,subinvjson
		var subinvdata="12~"+invno+"~"+subinvno+"~"+orderno+"~"+suborderno+"~"+cashierid+"~"+cust_profid+"~"+cust_userid+"~"+selsubinvtableobj.total+"~"+selsubinvtableobj.tax+"~"+selsubinvtableobj.service+"~"+selsubinvtableobj.disc+"~"+selsubinvtableobj.gtotal+"~"+now1later0+"~"+subinvdat+"~"+subinvtime+"~"+subinvdattime+"~"+subinvjson
	
$.ajaxSetup({async:false});
$.post("../php/cashier_func.php",{param:subinvdata},function(server_response) {
//data = $.parseJSON(server_response);
if(server_response=="succeded"){
alert("تم حفظ الفاتورة الفرعية  ")
document.subinvpaystep=2 //// do the sales process
	}else{
alert("حدث خطأ اثناء حفظ الفاتورةالفرعية")
document.subinvpaystep=1
	}
});
///step 2 : add acc movement , add profile acc movment , add cash movment , add sales movment ,
if(document.subinvpaystep==2){
if(now1later0==1){/// set description based on paynow paylater
sub_inv_desc=" حفظ ودفع كاش اوردر فرعي رقم  : "+orderno+"-"+suborderno+" فاتورة فرعية رقم : "+invno+"-"+subinvno+" على طاولة رقم : "+tblno+" مسجلة باسم عميل : "+ selsubinvtableobj.custname+" بتخفيض "+selsubinvtableobj.discount+" بواسطة كاشير : "+cashiername

var data="0~"+subinvdat+"~"+subinvtime+"~1~1~1~1~0~0~1~0"+"~"+now1later0
}else{
sub_inv_desc=" حفظ للدفع آجل اوردر فرعي رقم  : "+orderno+"-"+suborderno+" فاتورة فرعية رقم : "+invno+"-"+subinvno+" على طاولة رقم : "+tblno+" مسجلة باسم عميل : "+ selsubinvtableobj.custname+" بتخفيض "+selsubinvtableobj.discount+" بواسطة كاشير : "+cashiername

var data="0~"+subinvdat+"~"+subinvtime+"~1~1~1~0~0~0~1~0"+"~"+now1later0
}		
////profile acc move data
///////param3 = prof_mov_dat,prof_mov_tim,prof_id,prof_mov_value,prof_mov_balance,prof_mov_desc, invoice id or orderid
var data3=subinvdat+"~"+subinvtime+"~"+cust_profid+"~"+selsubinvtableobj.gtotal+"~"+"0"+"~"+sub_inv_desc+"~"+orderno+"~"+suborderno

////////start saving sales process add acc movement , add profile acc movment , add cash movment , add sales movment ,
$.ajaxSetup({async:false});
$.post("../php/acc_func.php",{param:data,param3:data3},function(server_response) {
//data = $.parseJSON(server_response);
if(server_response=="succeded"){
	
if(now1later0==1){
alert("تم حفظ القيد رفع القيمة على العميل ,دفع العميل للقيمة ، اضافة المبلغ الى الخزينة اضافة الفاتورة الفرعية (الأوردر) الى المبيعات ")
	}else{
alert("تم حفظ القيد رفع القيمة على العميل ، للدفع آجل ، اضافة الفاتورة الفرعية (الأوردر) الى المبيعات ")
	}
document.subinvpaystep=3;///close the sub invoice
}else{
alert(server_response)
document.subinvpaystep=2;/////sales process failed
}
});
if(document.subinvpaystep==3){
	closesubinvoice()
}
}else{///if step is 1 not 2
alert("حدث خطأ اثناء حفظ الفاتورةالفرعية")
}

}///end of paynow later sub invoice


/// Function  for paying the current full invoice now
function paynow_Fullinv(now1later0,subinvoices){
$(document).ready(function() {
	///initialize variables
var seltblobj=tableobjarray[document.selectedtableobj]
document.invprinted=1;
document.acc_salesstep=0
var invrows=new Array();
for(as=0;as<seltblobj.fullinv_items.length;as++){
invrows[as]=new Array();	
}
for(a=0;a<seltblobj.fullinv_items.length;a++){
invrows[a][0]=seltblobj.fullinv_items[a].itmid
invrows[a][1]=seltblobj.fullinv_items[a].itm_price
invrows[a][2]=seltblobj.fullinv_items[a].itm_qnty 
invrows[a][3]=seltblobj.fullinv_items[a].itm_total 
}


var next_inv_id=getnextid("invoices")
seltblobj.invid=next_inv_id

if(document.invprinted==1){

/////// 1- set status to 1 paid / 0 paylater
seltblobj.paymentstatus=now1later0
////////document.inv_obj.status=now1later0;

////// 2- save the invoice into invoices tbl and invoice itmes tbl set paid status to now1later0
///////////Case 1 : will pay for the full table invoice once without any sub invoices

	
	
// inv_dattime, inv_cus_prof_id, inv_cus_user_id, inv_cashier_id, inv_total, inv_discount, inv_tax, inv_service, inv_gtotal, inv_status,,inv_dat,inv_time
var invdata="2~"+seltblobj.dattime+"~"+seltblobj.customer_profid+"~"+seltblobj.customer_userid+"~"+seltblobj.cashierid+"~"+seltblobj.total+"~"+seltblobj.discount+"~"+seltblobj.tax+"~"+seltblobj.service+"~"+seltblobj.gtotal+"~"+ seltblobj.paymentstatus+"~"+seltblobj.dat+"~"+ seltblobj.time+"~"+seltblobj.orderno
	
$.ajaxSetup({async:false});
$.post("../php/cashier_func.php",{param:invdata,'param2[][]':invrows},function(server_response) {
//data = $.parseJSON(server_response);
if(server_response=="succeded"){
	if(seltblobj.paymentstatus==1){
alert("تم حفظ ودفع الفاتورة  ")
	}else{
alert("تم حفظ الفاتورة للدفع آجل  ")
	}
document.acc_salesstep=1;
}else{
	if(seltblobj.paymentstatus==1){
alert("حدث خطأ اثناء حفظ ودفع الفاتورة")
	}else{
alert("حدث خطأ اثناء حفظ الفاتورة للدفع آجل")
	}

document.acc_salesstep=0;
}
});
///// 4- save the acc movement into acc mov and use the acc_mov_id
//// 5- save the sales into sales table
/// 6- save the invoice value -ve  or type 1 into profiles acc movement
//// 7- save the invoice value +ve or type 1 into profiles acc movement so the customer have paid
/// 8- save the sales value in received cash
if(document.acc_salesstep==1){
///// 4- add acc movement
// mov_dat, mov_time, mov_type = 1 sales process, sales_table=1, cust_table=1, cash_table=1 if paid now 0 if paid later, purch_table, exp_table, staff_table=1, othincome_table
///
if(subinvoices<1){///if there is NO subinvoices
var suborderno=0
if(now1later0==1){
seltblobj.desc=" حفظ ودفع كاش واغلاق اوردر رقم : "+seltblobj.orderno+"فاتورة رقم : "+seltblobj.invid +" على طاولة رقم : "+seltblobj.tableno +" مسجلة باسم عميل : "+ seltblobj.custname+" تخفيض "+seltblobj.discount+" بواسطة كاشير : "+seltblobj.cashiername

var data="0~"+seltblobj.dat+"~"+seltblobj.time+"~1~1~1~1~0~0~1~0"+"~"+now1later0
}else{
seltblobj.desc="حفظ للدفع آجل واغلاق اوردر رقم : "+seltblobj.orderno +" فاتورة رقم : "+seltblobj.invid +" على طاولة رقم : "+seltblobj.tableno +" مسجلة باسم عميل : "+ seltblobj.custname+" تخفيض "+seltblobj.discount+" بواسطة كاشير : "+seltblobj.cashiername

var data="0~"+seltblobj.dat+"~"+seltblobj.time+"~1~1~1~0~0~0~1~0"+"~"+now1later0
}

///////param3 = prof_mov_dat,prof_mov_tim,prof_id,prof_mov_value,prof_mov_balance,prof_mov_desc, invoice id or orderid
var data3=seltblobj.dat+"~"+seltblobj.time+"~"+seltblobj.customer_profid+"~"+seltblobj.gtotal+"~"+"0"+"~"+seltblobj.desc+"~"+seltblobj.invid+"~"+suborderno

$.ajaxSetup({async:false});
$.post("../php/acc_func.php",{param:data,param3:data3},function(server_response) {
//data = $.parseJSON(server_response);
if(server_response=="succeded"){
if(seltblobj.paymentstatus==1){
alert("تم حفظ القيد رفع القيمة على العميل ,دفع العميل للقيمة ، اضافة المبلغ الى الخزينة اضافة الفاتورة الى المبيعات ")
	}else{
alert("تم حفظ القيد رفع القيمة على العميل ، للدفع آجل ، اضافة الفاتورة الى المبيعات ")
	}
document.acc_salesstep=2;
}else{
alert(server_response)
document.acc_salesstep=1;
}
});
///end of paynow with no sub invoices
	}else{///else if there is sub invoices
//alert(" closing table with no sub invoices- no acc move , no prof mov, no cash mov, no sales mov")
document.acc_salesstep=2;
	}///end if paynow if sub invoices or not
}else{
alert("يجب حفظ الفاتورة أولا")	
return false;
};
///// 8- udate item ingradients stock by substrcting invoice items quantities
if(document.acc_salesstep==2){
 ////param1=invoice id , param2 = userid, parm3=date, param4= prof id
 var data="3~"+seltblobj.invid+"~"+seltblobj.cashierid+"~"+ seltblobj.dat+"~"+seltblobj.customer_profid
	
 $.ajaxSetup({async:false});
$.post("../php/cashier_func.php",{param:data},function(server_response) {
//data = $.parseJSON(server_response);
if(server_response=="succeded"){
////////add sales items to sales table
//param1: full inv number , $param[2] : dat, $param[3]: datetime,$param[4]:custprofid,$param[5]:userid,$param[6]:orderid
 $.ajaxSetup({async:false});
 var datapost="13~"+seltblobj.invid+"~"+seltblobj.dat+"~"+seltblobj.dattime+"~"+seltblobj.customer_profid+"~"+seltblobj.cashierid+"~"+seltblobj.orderno
$.post("../php/acc_func.php",{param:datapost},function(server_response) {
	if(server_response=="succeded"){
alert("تم تسجيل مبيعات الاصناف")
	}else{
	alert("خطأ اثناء تسجيل مبيعات الاصناف")	
	}
})///end of post
alert("تمت حركة المخازن بنجاح")
document.acc_salesstep=3
}else{
alert(server_response)
document.acc_salesstep=2;
}
});
}else{
	alert("يجب تسجيل حركة الحسابات للعملية البيعية اولا");
	return false;
}
////9- reset invoice data
if(document.acc_salesstep==3){
closetable()
}else{
alert("يجب تسجيل حركة المخازن اولا")	
return false;
}
}else{/// if the invoice was not printed show dialoge to ask him to print first

if(seltblobj.paymentstatus==1){
alert("يجب طباعة الفاتورة أولا قبل الدفع");
	}else{
alert("يجب طباعة الفاتورة أولا قبل الحفظ للدفع آجل");	}
return false;	
}

});///doc ready end
}////end of function
/// Function  for paying the current full invoice now
function get_cust_unpaid_inv(){
$(document).ready(function() {
var selectedprofid=tableobjarray[document.selectedtableobj].subinvoices_arr[document.selectedsubinvarrid].customer_profid	
cust_unpd_ordinv.splice(0,cust_unpd_ordinv.length)
ordinv_items=[]
$.ajaxSetup({async:false});
$.post("../php/cashier_func.php",{param:'13~'+selectedprofid},function(server_response) {
			data = $.parseJSON(server_response);
			for(var i = 0; i < data.length; i++){
				orderinvobj=$.parseJSON(data[i].subinvjson)
			cust_unpd_ordinv.push({maininvid:data[i].maininv_id,subinvid:data[i].subinvno,orderid:data[i].orderid,suborderid:data[i].suborderid,dattime:data[i].dattime,cashierid:data[i].casheirid,detailsobj:orderinvobj})
}
$(".notpaidinv-div .notpaid-inv-no").html(cust_unpd_ordinv.length)
///calculating sum of unpaid invoices
var sumunpaid=0.00
for(jo=0;jo<cust_unpd_ordinv.length;jo++){
	sumunpaid+=cust_unpd_ordinv[jo].detailsobj.gtotal
}
$(".notpaidinv-div .notpaid-inv-sum").html(sumunpaid.toFixed(2))
$(".notpaidinv-div").show()
});
	
})//end doc ready
}//end func

//reset the unpaid info dashboard
function resetunpaidinfo(){
	$(".notpaid-inv-no").html(0)
	$(".notpaid-inv-sum").html(0.00)
	$(".notpaidinv-div").hide()
	
}

///function show unpaid orders and invoices for selected customer
function showunpaidinv_cust(){
	var sumunp=parseFloat($(".notpaidinv-div .notpaid-inv-sum").html())
	if(sumunp<0.09){
		alert("لايوجد فواتير غير مدفوعة");return false;
	}
	var title="الفواتير الغير مدفوعة للعميل "+cust_unpd_ordinv[0].detailsobj.custname
	var txtmsg=""
	//var invhead="",itmsrow="",invfoot="",btns=""
	for(oq=0;oq<cust_unpd_ordinv.length;oq++){
		///initialize vars
		var invhead="",itmsrow="",invfoot="",btns=""
		invhead="<div class='table-sub-invoice unpaidinv-cont' data-arrobjid='"+oq+"'><div class='inv_data_row'> اوردر رقم :  <div class='inlinediv' data-ordersubid='223-1'>"+cust_unpd_ordinv[oq].orderid+"-"+cust_unpd_ordinv[oq].suborderid+"</div></div><div class='inv_data_row'> فاتورة رقم :  <div class='inlinediv' data-invid='223-1'>"+cust_unpd_ordinv[oq].maininvid+"-"+cust_unpd_ordinv[oq].subinvid+"</div></div><div class='inv_data_row'> تاريخ :  <div class='inlinediv' data-orddat='"+cust_unpd_ordinv[oq].dattime+"'>"+cust_unpd_ordinv[oq].dattime+"</div></div><div class='inv_data_row'> اسم العميل :  <div class='inlinediv' data-custname='"+cust_unpd_ordinv[oq].detailsobj.custname+"' data-custprofid='"+cust_unpd_ordinv[oq].detailsobj.customer_profid+"'>"+cust_unpd_ordinv[oq].detailsobj.custname+"</div></div><div class='inv_data_row'> كاشير رقم :  <div class='inlinediv' data-cashuserid='"+cust_unpd_ordinv[oq].cashierid+"' data-cashusername='noone'>"+cust_unpd_ordinv[oq].cashierid+"</div></div><div class='inv_table'><div class='inv_tbl_head'><div class='inv_name_col inv_row_col'>اسم الصنف</div><div class='inv_unitpr_col inv_row_col'>سعر الوحدة</div><div class='inv_qunt_col inv_row_col'>الكمية</div><div class='inv_cost_col inv_row_col'>الاجمالي</div><div class='inv_controls_col inv_row_col' style='display:none;'>حذف </div></div>"
		
		for(ais=0;ais<cust_unpd_ordinv[oq].detailsobj.items.length;ais++){////for looping invoice items
			
			itmsrow+="<div class='inv_tbl_datarows subinvitemsrows'><div class='inv_tbl_datarows subinvitemrow' data-itmid='"+cust_unpd_ordinv[oq].detailsobj.items[ais].itmid+"' data-subinv_arrid='"+ais+"' data-itmqnty='"+cust_unpd_ordinv[oq].detailsobj.items[ais].itm_qnty+"' data-itmunprice='"+cust_unpd_ordinv[oq].detailsobj.items[ais].itm_price+"' data-itmtot='"+cust_unpd_ordinv[oq].detailsobj.items[ais].itm_total+"'><div class='inv_name_col inv_row_col'>"+cust_unpd_ordinv[oq].detailsobj.items[ais].itm_lname+"</div><div class='inv_unitpr_col inv_row_col'>"+cust_unpd_ordinv[oq].detailsobj.items[ais].itm_price+"</div><div class='inv_qunt_col inv_row_col'>"+cust_unpd_ordinv[oq].detailsobj.items[ais].itm_qnty+"</div><div class='inv_cost_col inv_row_col'>"+cust_unpd_ordinv[oq].detailsobj.items[ais].itm_total+"</div><div class='inv_controls_col inv_row_col removesubinvitem' style='display:none;' data-itmid='93' data-subinv_arrid='0' data-itmqnty='2' data-itmunprice='5' data-itmtot='10'><img data-arrid='0' align='middle' class='ingr_remove clickable-div' src='../images/del24.png'></div></div></div><!-----end of inv_table-->"
			
		}
		invfoot="<div id='taxrow' class='inv_tbl_datarows'><div class='inv_name_col inv_row_col'>الضريبة</div><div class='inv_unitpr_col inv_row_col'>10%</div><div class='inv_qunt_col inv_row_col'></div><div class='inv_cost_col inv_row_col'>"+(cust_unpd_ordinv[oq].detailsobj.tax).toFixed(2)+"</div><div class='inv_controls_col inv_row_col'></div></div><div class='inv_tbl_datarows servrow'><div class='inv_name_col inv_row_col'>الخدمة</div><div class='inv_unitpr_col inv_row_col'>12%</div><div class='inv_qunt_col inv_row_col'></div><div class='inv_cost_col inv_row_col'>"+(cust_unpd_ordinv[oq].detailsobj.service).toFixed(2)+"</div><div class='inv_controls_col inv_row_col'></div></div><div class='inv_tbl_datarows discrow'><div class='inv_name_col inv_row_col'>الخصم</div><div class='inv_unitpr_col inv_row_col'><div data-valpers='pers' style='display:none;' data-discinv='subinv' class='adddisc clickable-div button'>%</div></div><div class='inv_qunt_col inv_row_col'><div data-valpers='val' style='display:none;' data-discinv='sub' class='adddisc clickable-div button'>خصم</div></div><div class='inv_cost_col inv_row_col'>"+(cust_unpd_ordinv[oq].detailsobj.discount).toFixed(2)+"</div><div class='inv_controls_col inv_row_col'></div></div><div class='inv_tbl_datarows gtotalrow'><div class='inv_name_col inv_row_col'>الاجمالي</div><div class='inv_unitpr_col inv_row_col'></div><div class='inv_qunt_col inv_row_col'></div><div class='inv_cost_col inv_row_col'>"+(cust_unpd_ordinv[oq].detailsobj.gtotal).toFixed(2)+"</div><div class='inv_controls_col inv_row_col'></div></div>"

 btns="<div class='subinvbtns'><div data-clickedbtn='"+oq+"' class='button button-caution paysubbtns payunpinv' data-btntype='paynow'>دفع</div><div class='button button-action paysubbtns paylatersubinv' data-btntype='paylater' style='display: none;'>دفع آجل</div><div class='button paysubbtns printunpinv button-primary' data-clickedbtn='"+oq+"' data-btntype='print'>طباعة</div></div></div><!-----end of invoice tbl--></div>"
		txtmsg+="<div class='unpaidinvoice' data-arrobjid='"+oq+"' style='text-align:center;'>"+invhead+itmsrow+invfoot+btns+"</div>"
	}//end main for

	$myDialog2=$("<div style='padding:10px;overflow:auto;'>"+txtmsg+"</div>");
	$myDialog2.dialog({
	  appendTo: "#orderpagecontainer",
	  title: title, 
	  zIndex: 10000,
	  autoOpen: true,
      resizable: false,
      height:550,
	  width:450,
      modal: true,
      buttons: {
        "رجوع": function() {
			//$( this ).confirmed= true;
			 
          $( this ).dialog( "close" );
		 
        }
      }
    });/// end of dialog	
}///end func

///function pay unpaid customer invoice 
function payunpaidCustInv(unpaid_arr_id,clickobject){
	//alert(JSON.stringify(cust_unpd_ordinv[unpaid_arr_id]))
	///steps : 1- add acc mov ,2- add acc prof mov, 3- add cash mov, 4- update subinv paid flag , 5-update sales unpaid flag
//	(invno,subinv_no , orderid ,sales_desc ,mov_dat,mov_time ,inv_gtotal ,profid )
var subinv_no,invno,orderid,sales_desc,mov_dat,mov_time,inv_gtotal,profid
invno=parseInt(cust_unpd_ordinv[unpaid_arr_id].maininvid)
subinv_no=parseInt(cust_unpd_ordinv[unpaid_arr_id].subinvid)
orderid=parseInt(cust_unpd_ordinv[unpaid_arr_id].orderid)
sales_desc="فاتورة فرعية آجل رقم "+invno+"-"+subinv_no+" اوردر فرعي رقم "+orderid+"-"+subinv_no+ " بتاريخ " +cust_unpd_ordinv[unpaid_arr_id].dattime+ "  على العميل " +cust_unpd_ordinv[unpaid_arr_id].detailsobj.custname+" رقم "+cust_unpd_ordinv[unpaid_arr_id].detailsobj.customer_profid
mov_dat=frmtdatetimesql(1)
mov_time=frmtdatetimesql(2)
inv_gtotal=cust_unpd_ordinv[unpaid_arr_id].detailsobj.gtotal
profid=cust_unpd_ordinv[unpaid_arr_id].detailsobj.customer_profid
 var data="14~"+invno+"~"+subinv_no+"~"+ orderid+"~"+sales_desc+"~"+mov_dat+"~"+mov_time+"~"+inv_gtotal+"~"+profid
	
 $.ajaxSetup({async:false});
$.post("../php/cashier_func.php",{param:data},function(server_response) {
//data = $.parseJSON(server_response);
if(server_response=="succeded"){

 alert("تمت دفع الفاتورة الآجلة بنجاح")
// refresh the customer unpaid invoice and close the dialog
clickobject.hide();
get_cust_unpaid_inv();

}else{
alert(server_response)

}
});
}
/////function to get the limits and balances of ingradients of sales items and returns object of ing balance limits
function getingrbalancelimits(salesitmid){
	var ingrbalancelimits={}
	$.ajaxSetup({async:false});//get all items limits
	$.post("../php/acc_func.php",{param:'11~'+salesitmid},function(server_response) {
						data = $.parseJSON(server_response);
						for(var i = 0; i < data.length; i++){
						ingrbalancelimits[data[i].ingid]={"ingid":data[i].ingid,"ingname":data[i].ingname,"inglimit":data[i].inglimit,"ingunit": data[i].ingunit,"ingbalance":data[i].ingbalance};///
						}
	})//end of ajax
	return ingrbalancelimits;
}

/*
(function(){
    // do some stuff
	
    setTimeout(savetablesOBJsilent(), 5000);
})();
*/

