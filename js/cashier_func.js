
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
function getnextid(tablename){
	var next_id =0;
	$.ajaxSetup({async:false});
$.post("php/db_query_fun.php",{param:'3~'+tablename},function(server_response) {
		next_id =parseInt(server_response);
});	
return next_id;
}

///// function to initialize the invoice object
function initializeInvobj(){
$(document).ready(function() {
document.inv_obj = {};
document.inv_obj.row = new Array();
var invobjlenght=document.inv_obj.row.length;
document.inv_obj.cashiername= $("#cashiername").text();
document.inv_obj.cashierid= $("#cashiername").data('id');
document.inv_obj.customer_profid= $('#customername').find(":selected").val();
document.inv_obj.customer_userid= $('#customername').find(":selected").data('user_id');
document.inv_obj.dattime= frmtdatetimesql(0);
document.inv_obj.dat= frmtdatetimesql(1);
document.inv_obj.time= frmtdatetimesql(2);
document.inv_obj.inv_id= getnextid("invoices");

document.inv_obj.row.splice(0, invobjlenght)
document.inv_obj.total=0;
document.inv_obj.tax= 0;
document.inv_obj.service= 0;
document.inv_obj.discount= 0;
document.inv_obj.gtotal= 0;
document.inv_obj.printed= 0; /// 0 invoice has not been printed before paying , 1 printed

document.inv_obj.status= 0; /// 0 unpaid , 1 paid
//alert(JSON.stringify(document.inv_obj));
document.acc_salesstep=0;
////// initialize invoice top data
document.inv_obj.desc="";
$("#inv_dattime").html(document.inv_obj.dattime);
$('#customername').val(0);
$("#cust_name").html($('#customername').find(":selected").text());
$("#inv_num").html(document.inv_obj.inv_id);
$("#inpdisc").val(0);
$("#inpserv").val(12);
$("#inptax").val(10);
$("#payinv").prop('disabled',true);
$("#payinvlater").prop('disabled',true);
///// initialize other elements
$("#unpaid-inv-container").hide();
$("#unpaidfrom_datepick").text("")
	$("#unpaidto_datepick").text("")
	$("#unpaid_period_dates").hide()
$("#paidunpaidcustinfo").html("")
$("#unpaid-inv-container").find(".alrtmsg").remove();
refreshinvoicetable();

});
}

function initializesalesitems(){
$(document).ready(function() {
	$("#owl1-cashier").find(".item").remove();
	$("#owl2-cashier").find(".item").remove();
	$("#owl3-cashier").find(".item").remove();
	$("#owl4-cashier").find(".item").remove();
$.ajaxSetup({async:false});
$.post("php/cashier_func.php",{param:'0~0'},function(server_response) {
data = $.parseJSON(server_response);
for(var i = 0; i < data.length; i++){
					var rowtoadd="<div class='item'><a data-id='"+data[i].itm_id+"' data-itm_lname='"+data[i].itm_lname+"' data-itm_desc='"+data[i].itm_desc+"' data-itm_price='"+data[i].itm_price+"'  class='clicksound' >"+data[i].itm_sname+"</a></div>"
					
					if(data[i].itm_group==1){
					$("#owl1-cashier").append(rowtoadd);
					}else if (data[i].itm_group==2){
					$("#owl2-cashier").append(rowtoadd);
						
					}else if (data[i].itm_group==3){
					$("#owl3-cashier").append(rowtoadd);
						
					}else if (data[i].itm_group==4){
					$("#owl4-cashier").append(rowtoadd);
						
					}
}			
});
///////////////////////////////////////////////////////////////////

//// cashier slider per category
var owl1 = $("#owl1-cashier");
var owl2 = $("#owl2-cashier");
var owl3 = $("#owl3-cashier");
var owl4 = $("#owl4-cashier");

owl1.owlCarousel({
      items : 8, //10 items above 1000px browser width
      itemsDesktop : [1000,5], //5 items between 1000px and 901px
      itemsDesktopSmall : [900,3], // betweem 900px and 601px
      itemsTablet: [600,2], //2 items between 600 and 0
      itemsMobile : false // itemsMobile disabled - inherit from itemsTablet option
});

owl2.owlCarousel({
      items : 8, //10 items above 1000px browser width
      itemsDesktop : [1000,5], //5 items between 1000px and 901px
      itemsDesktopSmall : [900,3], // betweem 900px and 601px
      itemsTablet: [600,2], //2 items between 600 and 0
      itemsMobile : false // itemsMobile disabled - inherit from itemsTablet option
});
  
owl3.owlCarousel({
      items : 8, //10 items above 1000px browser width
      itemsDesktop : [1000,5], //5 items between 1000px and 901px
      itemsDesktopSmall : [900,3], // betweem 900px and 601px
      itemsTablet: [600,2], //2 items between 600 and 0
      itemsMobile : false // itemsMobile disabled - inherit from itemsTablet option
}); 
 
   
owl4.owlCarousel({
      items : 8, //10 items above 1000px browser width
      itemsDesktop : [1000,5], //5 items between 1000px and 901px
      itemsDesktopSmall : [900,3], // betweem 900px and 601px
      itemsTablet: [600,2], //2 items between 600 and 0
      itemsMobile : false // itemsMobile disabled - inherit from itemsTablet option
}); 
////////////////////////////////////////////////////////////////////////////////////

});
}

initializesalesitems();
//////// cashier functions for Cafekey app by Mohammed Khalifa///////
////////////////////////////// navigation and interface related js Cashier screen ////////////////////
$(document).ready(function() {
////////////////////////////

//// play sound when click
  var beepOne = $("#beep-one")[0];
  //beepOne.play();
$("div.item").click(function() {
	//preventDefaults();
		beepOne.play();
	});
	var beepTwo=$("#beep-two")[0];
	$("div.beeptwo").click(function() {
	//	preventDefaults();
		beepTwo.play();
	});
	
	var beep3=$("#beep-3")[0];
	$(".beep3").click(function() {
		//preventDefaults();
		beep3.play();
	});
/// initial data when load the cashier
	


////////////////////////Add new customer Modal Window control ///////////////////////
//click on close add new customer popup icon x 
$("#addnewcustX").click(function(e) {
	$("#logout").hide();
		$("#spinner").hide();
	$("#login").prop("disabled", false);
	$("#password").prop("disabled",false)
	$("#result").html("");

	
});

$("#addnewcust").click(function(e) {
	$("#login").prop("disabled", false);
	$("#password").prop("disabled",false)
	$("#loginbtn").prop("disabled", false);
	
});
/////////////////////////////////////////////////////////////////////////////////

/// create the customer drop down list in a variable cashier screen
populatecustomerslist();
////// change the invoice customer name according to the selected customer from the dropdown list
$("#customername").change(function() {
					var selectedCust = $('#customername').find(":selected").text();
					$("#cust_name").html(selectedCust);
					document.inv_obj.customer_profid= $('#customername').find(":selected").val();
					document.inv_obj.customer_userid= $('#customername').find(":selected").data('user_id');
					document.inv_obj.inv_id= getnextid("invoices");
					document.inv_obj.dattime= frmtdatetimesql(0);
					document.inv_obj.dat= frmtdatetimesql(1);
					document.inv_obj.time= frmtdatetimesql(2);
					$("#inv_dattime").html(document.inv_obj.dattime);
					//initializeInvobj()
					refreshinvoicetable()
					//alert(JSON.stringify(document.inv_obj));
					checkifhasunpaidinv(document.inv_obj.customer_profid)

});

//////////////////////////////////////////////////////////////////////
/// click on discount all invoice amount
$("#discall").click(function() {
	$("#inpdisc").val(0);
	recalculateInvobj();
	$("#inpdisc").val(document.inv_obj.gtotal)
	recalculateInvobj();
	refreshinvoicetable();
	
});

// changy the discount input value
$("#inpdisc").change(function() {
var discval=$("#inpdisc").val();
if(discval==""){
	$("#inpdisc").val(0);	
	}
recalculateInvobj();
refreshinvoicetable();
});
///////// click on new invoice cashier window
$("#newinv").click(function() {
	
	initializeInvobj();
	refreshinvoicetable();
	
});
/////////////click on payinvoice now //////
$("#payinvlater").click(function(){
	paynow_later(0);
});
/////////////click on payinvoice now //////
$("#payinv").click(function(){
	paynow_later(1);
});

////// show all unpaid invoices
$("#showunpaidinv").click(function(){
  $("#unpaid-inv-container").toggle('slow')
  $("#unpaid-inv-container").find(".unpaid-invoice-container").remove();
  $("#unpaid-inv-container").find(".alrtmsg").remove();
  $("#customername1").val(0)
  $("#paidorunpaid").val(0)
  $("#paid-un-fromto").val(0)
  $("#unpaidfrom_datepick").text("")
	$("#unpaidto_datepick").text("")
	$("#unpaid_period_dates").hide()
//show_paid_unpaid_inv(0,0,0,0);	
})


///////// click on item on the cashier window

$(document).on('click','div.item',function(){
var clicked=$(this).find("a")
var rowindex=document.inv_obj.row.length
var objrowindex=""
	//alert(dd)
	var sss=$("#inv_tbl_datarows").find( 'div.inv_tbl_datarows[data-itmid="' + clicked.data('id') +'"]').data('itmid')
	//alert(sss)
	if(typeof sss == 'undefined'){
	//clicked.data('id')
//rowindex=document.inv_obj.row.length
document.inv_obj.row.push({});
document.inv_obj.row[rowindex].inv_itm_id = clicked.data('id');
document.inv_obj.row[rowindex].inv_itm_name = clicked.text();
document.inv_obj.row[rowindex].inv_itm_qnty = 1;
document.inv_obj.row[rowindex].inv_itm_unit_price = clicked.data('itm_price');
document.inv_obj.row[rowindex].inv_itm_tot_price=parseInt(document.inv_obj.row[rowindex].inv_itm_qnty)*parseInt(document.inv_obj.row[rowindex].inv_itm_unit_price)

                       // alert(JSON.stringify(document.inv_obj.row));
						$("#inpdisc").val(0);
						recalculateInvobj();
						refreshinvoicetable();
	}else{
		for(iii=0;iii<rowindex;iii++){
			if (document.inv_obj.row[iii].inv_itm_id==sss){
				objrowindex=iii;
				document.inv_obj.row[iii].inv_itm_qnty++;
				$("#inpdisc").val(0);
				recalculateInvobj()
				refreshinvoicetable();
			}else{
	//alert("No maches in object and inv table itm ids")			
			}
			
		}
	//alert("add quantity")	
	}
});


//click on add  items in the invoice
$(document).on('click','#inv_tbl_datarows img.ingr_add',function(){
var objrowindex=$(this).data('id');
document.inv_obj.row[objrowindex].inv_itm_qnty++;
$("#inpdisc").val(0);
recalculateInvobj()
refreshinvoicetable();
});

//click on remove  items in the invoice
$(document).on('click','#inv_tbl_datarows img.ingr_remove',function(){
	
var objrowindex=$(this).data('id');
var itmquantity=parseInt(document.inv_obj.row[objrowindex].inv_itm_qnty);
if(itmquantity==1){
document.inv_obj.row.splice(objrowindex, 1);
$("#inpdisc").val(0);
recalculateInvobj()
refreshinvoicetable();
}else{
document.inv_obj.row[objrowindex].inv_itm_qnty--;
$("#inpdisc").val(0);
recalculateInvobj()
refreshinvoicetable();
}
});
$("#addnewcustform").submit(function(event) {
	  event.preventDefault();
});

///////////////////////////////////////////////unpaid events /////////////////////////
	  
////// show all paid unpaid invoices - unpaid-paid invoice screen
$("#showpaidunpaidinv").click(function(){//// show paid unpaid div invoices
	//parameters : paid1 unpaid0,profid if 0=all,st_date if 0=all,end_date
	inv_status=$("#paidorunpaid").val();
	inv_profid=$("#customername1").val();
	var dat_typ_select=$("#paid-un-fromto").val();
	if(dat_typ_select==0){
show_paid_unpaid_inv(inv_status,inv_profid,0,0);	
	}else{
		startdate=$("#unpaidfrom_datepick").val()
		enddate=$("#unpaidto_datepick").val()
		if(startdate=="" || enddate==""){alert("يجب اختيار تاريخ");return false;}
		show_paid_unpaid_inv(inv_status,inv_profid,startdate,enddate);	
	}
})	
$("#paid-un-fromto").change(function(){
	var dat_typ_select=$("#paid-un-fromto").val();
	if(parseInt(dat_typ_select)==1){
	$("#unpaidfrom_datepick").text("")
	$("#unpaidto_datepick").text("")
	$("#unpaid_period_dates").show()
	}else{
	$("#unpaidfrom_datepick").text("")
	$("#unpaidto_datepick").text("")
	$("#unpaid_period_dates").hide()
	}
	
})
  
	  //////click on print unpaid invoice
$(document).on('click','#unpaid-inv-container .printunpaidinv',function(){
		var printinv_index=$(this).data('inv_arr_btn_index')
		//alert(printinv_index)
		//data-inv_arr_index='"+aiix+"'
	   var unpaidinvhtml=$("#unpaid-inv-container").find("[data-inv_arr_index='"+printinv_index+"']")
	  // alert(unpaidinvhtml)
		PrintElem(unpaidinvhtml);
		  //verifyinvcustomerselected_print();
		  
})
$(document).on('click','#unpaid-inv-container .pay_unpaidinv',function(){
	//data-pay_btn_invid data-inv_arr_pay_btn_index data-pay_btn_profid data-pay_btn_gtotal
		var payinv_index=$(this).data('inv_arr_pay_btn_index')
		var payinv_id=$(this).data('pay_btn_invid')
		var payinv_profid=$(this).data('pay_btn_profid')
		var payinv_gtotal=$(this).data('pay_btn_gtotal')
		var payinv_dat=frmtdatetimesql(1);/// now date
		var payinv_time=frmtdatetimesql(2);/// now time
		
		//// confirm user payment
		$("<div>هل انت متأكد من أن العميل دفع الفاتورة رقم  :  '"+payinv_id+"'  والتي قيمتها  :  '"+parseFloat(payinv_gtotal).toFixed(2)+"'</div>").dialog({
	  appendTo: "#invoice-info-container",
	  title: 'تأكيد', 
	  zIndex: 10000,
	  
      resizable: false,
      height:200,
      modal: true,
      buttons: {
        "نعم": function() {
          $( this ).dialog( "close" );
		  paynow_unpaidinv(payinv_id,payinv_profid,payinv_dat,payinv_time,payinv_gtotal)
	
		inv_status=$("#paidorunpaid").val();
		inv_profid=$("#customername1").val();
		dat_typ_select=$("#paid-un-fromto").val();
		if(dat_typ_select==0){
		show_paid_unpaid_inv(inv_status,inv_profid,0,0);	
		}else{
		startdate=0/// will be the value of date picker
		enddate=0/// will be the value of date picker
		show_paid_unpaid_inv(inv_status,inv_profid,startdate,enddate);	
	}
		  
        },
        "لا": function() {
          $( this ).dialog( "close" );
		  
        }
      }
    });
		//// do the payment process
		//paynow_unpaidinv(payinv_id,payinv_profid,payinv_dat,payinv_time,payinv_gtotal)
		//alert(printinv_index)
		//data-inv_arr_index='"+aiix+"'
	   //var unpaidinvhtml=$("#unpaid-inv-container").find("[data-inv_arr_index='"+printinv_index+"']")
	 
		  
})
	  
	  ////// print unpaid invoices
	  $("#printinv").click(function(){
		 
		  verifyinvcustomerselected_print();
		  
	  })
});//// end of document ready


//add new customer from popup window function
function add_new_customer(){
	$(document).ready(function() {
   /////// validation of inputs 
var valid=1;
  
  if($("#cust_fullname").val()=="") {alert("يرجى كتابة اسم العميل الثلاثي") ;$("#cust_fullname").focus();valid=0;}
if(!validateLength($("#cust_fullname"),10) ){alert("الاسم يجب أن لا يقل عن 10 حروف ولا يزيد عن 20 حرف") ;$("#cust_fullname").focus();valid=0;}

if($("#cust_mob1").val()=="") {alert("يرجى كتابة رقم المحمول للعميل") ;$("#cust_mob1").focus();valid=0;}
if(!validateLength($("#cust_mob1"),9) ){alert("رقم المحمول يجب ان لا يقل عن 10 رقما") ;$("#cust_mob1").focus();valid=0;}
 
   
   ///// execute addition of new customer
   if(valid){
var addcustomerform = $( "#addnewcustform" ).serialize();

      $("#spinner").show();
      $("#spinner").fadeIn(400).html('<img src="img/spinner.gif" />');
      $.ajax({
      type: "POST",
	  dataType: 'json',
      url: "php/cashier_func2.php",
      data: addcustomerform,
      cache: false,
      success: function(result){
		  if(result==1){
       alert("تم حفظ العميل");
	   clearaddnewcust();
	   populatecustomerslist();
	   window.location.href ="#";
		  }else{
			alert("عفوا ... هناك خطأ في حفظ العميل");
		  
		  }
	   $("#spinner").hide();
	   
	  }
      });
 
   }
	});
}//END add new customer from popup window function end

function clearaddnewcust(){
	$(document).ready(function() {
		$("#addnewcustform :input").val("");
	});
}
/// create the customer drop down list in a variable cashier screen
function populatecustomerslist(){
	$("#customername").find('option').remove();
	$("#customername1").find('option').remove();
	$("#customername").append('<option value="0">اختر العميل</option>')
	$("#customername1").append('<option value="0">جميع العملاء</option>')
	
	$(document).ready(function() {
$.ajaxSetup({async:true});
$.post("php/db_query_fun.php",{param:'6~'},function(server_response) {
					data = $.parseJSON(server_response);
					for(var i = 0; i < data.length; i++){
                  	$("#customername").append('<option value='+data[i].prof_id+' data-prof_type="'+data[i].prof_type+'" data-user_id="'+data[i].user_id+'" >'+data[i].prof_name+'</option>');
					$("#customername1").append('<option value='+data[i].prof_id+' data-prof_type="'+data[i].prof_type+'" data-user_id="'+data[i].user_id+'" >'+data[i].prof_name+'</option>');
                  	}
});
	});
}
function recalculateInvobj(){
	
	var rowiter=document.inv_obj.row.length;
	var totalnotax=0;
	document.inv_obj.gtotal=0;
	document.inv_obj.service=0;
	document.inv_obj.tax=0;
	document.inv_obj.discount=0;
	document.inv_obj.total=0
	document.inv_obj.dattime= frmtdatetimesql(0);
	document.inv_obj.dat= frmtdatetimesql(1);
	document.inv_obj.time= frmtdatetimesql(2);
for(ix=0;ix<rowiter;ix++){
document.inv_obj.row[ix].inv_itm_tot_price=parseFloat(document.inv_obj.row[ix].inv_itm_qnty)*parseFloat(document.inv_obj.row[ix].inv_itm_unit_price)
totalnotax +=parseFloat( document.inv_obj.row[ix].inv_itm_tot_price)
}
document.inv_obj.total=totalnotax;

//alert(document.inv_obj.gtotal);
document.inv_obj.tax= parseFloat(parseFloat($("#inptax").val())/100)* parseFloat(totalnotax);
document.inv_obj.service= parseFloat(parseFloat($("#inpserv").val())/100)* parseFloat(totalnotax);;
document.inv_obj.discount= parseFloat($("#inpdisc").val());
document.inv_obj.gtotal=totalnotax+document.inv_obj.tax+document.inv_obj.service-document.inv_obj.discount
document.inv_obj.printed= 0;
}

function refreshinvoicetable(){
	 //// delete all rows in the invoice and regenerate them
$("#inv_tbl_datarows").find('.inv_tbl_datarows').remove();

//// append rows based on the invoice object rows
var invrows = document.inv_obj.row.length
for(ii=0;ii<invrows;ii++){
$("#inv_tbl_datarows").append("<div class='inv_tbl_datarows' data-itmid='"+document.inv_obj.row[ii].inv_itm_id+"'><div class='inv_name_col inv_row_col'>"+document.inv_obj.row[ii].inv_itm_name+"</div><div class='inv_unitpr_col inv_row_col'>"+document.inv_obj.row[ii].inv_itm_unit_price+"</div><div class='inv_qunt_col inv_row_col'>"+document.inv_obj.row[ii].inv_itm_qnty+"</div><div class='inv_cost_col inv_row_col'>"+document.inv_obj.row[ii].inv_itm_tot_price+"</div><div class='inv_controls_col inv_row_col'><img data-id='"+ii+"' align='middle' class='ingr_remove' src='images/del24.png'/></div><div class='inv_controls_col inv_row_col'><img data-id='"+ii+"' align='middle' class='ingr_add' src='images/add24.png'/></div></div>")
}
/// update tax , service , desc
$("#taxrow div.inv_cost_col").html(document.inv_obj.tax.toFixed(2));
$("#servrow div.inv_cost_col").html(document.inv_obj.service.toFixed(2));
$("#discrow div.inv_cost_col").html(document.inv_obj.discount.toFixed(2));
$("#gtotalrow div.inv_cost_col").html(document.inv_obj.gtotal.toFixed(2));

}
function verifyinvcustomerselected_print(){
	$(document).ready(function() {
var selectedcustid=	$("#customername").find(":selected").val()
var selectedcust=	$("#customername").find(":selected").text()

if(selectedcustid==0){
alert("ارجوا اختيار عميل");
 $("#customername").focus();	
}else{
	if(document.inv_obj.row.length<1){
	alert("لم يتم اضافة اصناف الى الفاتورة!")	
	}else{
	$("<div>هل أنت متأكد من العميل الذي ستصدر الفاتورة باسمه هو :  '"+selectedcust+"'</div>").dialog({
	  appendTo: "#invoice-info-container",
	  title: 'تأكيد', 
	  zIndex: 10000,
	  
      resizable: false,
      height:200,
      modal: true,
      buttons: {
        "نعم": function() {
          $( this ).dialog( "close" );
		  var elem='#invoice-container';
		  PrintElem(elem);
		  saveprintedinv();
        },
        "لا": function() {
          $( this ).dialog( "close" );
		  $("#customername").focus();
        }
      }
    });/// end of dialog
	}//// end of if document.inv_obj.row.length check
}
	});///end doc ready
}


////////////////////Save printed invoices /////
function saveprintedinv(){
$(document).ready(function() {
var invrows=new Array();
for(as=0;as<document.inv_obj.row.length;as++){
invrows[as]=new Array();	
}
for(a=0;a<document.inv_obj.row.length;a++){
invrows[a][0]=document.inv_obj.row[a].inv_itm_id
invrows[a][1]=document.inv_obj.row[a].inv_itm_unit_price
invrows[a][2]=document.inv_obj.row[a].inv_itm_qnty 
invrows[a][3]=document.inv_obj.row[a].inv_itm_tot_price 
	}	
	
	///act_inv_id,inv_dattime,inv_cus_prof_id,inv_cus_user_id,inv_cashier_id,inv_total,inv_discount,inv_tax,inv_service,inv_gtotal
	 var printedinvdata="1~"+document.inv_obj.inv_id+"~"+document.inv_obj.dattime+"~"+document.inv_obj.customer_profid+"~"+document.inv_obj.customer_userid+"~"+document.inv_obj.cashierid+"~"+document.inv_obj.total+"~"+document.inv_obj.discount+"~"+document.inv_obj.tax+"~"+document.inv_obj.service+"~"+document.inv_obj.gtotal
	
	$.ajaxSetup({async:false});
$.post("php/cashier_func.php",{param:printedinvdata,'param2[][]':invrows},function(server_response) {
//data = $.parseJSON(server_response);
if(server_response=="succeded"){
alert("تم حفظ الفاتورة المطبوعة مؤقتا")
$("#payinv").prop('disabled',false);
	$("#payinvlater").prop('disabled',false);
}
	
});
});///doc ready end
}

////// for printing recipts at cashier

function PrintElem(elem)
    {
        Popup($(elem).html());
    }

    function Popup(data) 
    {
        var mywindow = window.open('', 'Inovice', 'height=400,width=600');
        mywindow.document.write('<html><head><title>فاتورة</title>');
        /*optional stylesheet*/ //
		mywindow.document.write(' <link rel="stylesheet" type="text/css" href="css/appmains.css" />');
		//mywindow.document.write(' <link rel="stylesheet" type="text/css" href="css/invprint.css" />');
       // mywindow.document.styleSheets="css/invprint.css"
		mywindow.document.write('<style>body{background:none !important;}.inv_table {width: 100%;border:none !important;margin-right:10px;};.inv_data_row {width: 100%;text-align: center;}.inv_name_col {width: 40%;}.inv_unitpr_col {width: 15%;}.inv_qunt_col {width: 15%;}.inv_cost_col {width: 20%;}.inv_controls_col{display:none !important;};</style>');
		mywindow.document.write('</head><body >');
        mywindow.document.write(data);
        mywindow.document.write('</body></html>');
        mywindow.print();
		document.inv_obj.printed= 1;
		mywindow.close();
        return true;
    }

/// for paying the current invoice now
function paynow_later(now1later0){
$(document).ready(function() {
/// check if the invoice was printed first
if(document.inv_obj.printed==1){

/////// 1- set status to 1 paid / 0 paylater
document.inv_obj.status=now1later0;
////// 2- save the invoice into invoices tbl and invoice itmes tbl set paid status to now1later0


var invrows=new Array();
for(as=0;as<document.inv_obj.row.length;as++){
invrows[as]=new Array();	
}
for(a=0;a<document.inv_obj.row.length;a++){
invrows[a][0]=document.inv_obj.row[a].inv_itm_id
invrows[a][1]=document.inv_obj.row[a].inv_itm_unit_price
invrows[a][2]=document.inv_obj.row[a].inv_itm_qnty 
invrows[a][3]=document.inv_obj.row[a].inv_itm_tot_price 
}	
	
// inv_dattime, inv_cus_prof_id, inv_cus_user_id, inv_cashier_id, inv_total, inv_discount, inv_tax, inv_service, inv_gtotal, inv_status,,inv_dat,inv_time
var invdata="2~"+document.inv_obj.dattime+"~"+document.inv_obj.customer_profid+"~"+document.inv_obj.customer_userid+"~"+document.inv_obj.cashierid+"~"+document.inv_obj.total+"~"+document.inv_obj.discount+"~"+document.inv_obj.tax+"~"+document.inv_obj.service+"~"+document.inv_obj.gtotal+"~"+document.inv_obj.status+"~"+document.inv_obj.dat+"~"+document.inv_obj.time
	
$.ajaxSetup({async:false});
$.post("php/cashier_func.php",{param:invdata,'param2[][]':invrows},function(server_response) {
//data = $.parseJSON(server_response);
if(server_response=="succeded"){
	if(document.inv_obj.status==1){
alert("تم حفظ ودفع الفاتورة  ")
	}else{
alert("تم حفظ الفاتورة للدفع آجل  ")
	}
document.acc_salesstep=1;
}else{
	if(document.inv_obj.status==1){
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
if(now1later0==1){
document.inv_obj.desc="حفظ ودفع فاتورة رقم : "+document.inv_obj.inv_id

var data="0~"+document.inv_obj.dat+"~"+document.inv_obj.time+"~1~1~1~1~0~0~1~0"+"~"+now1later0
}else{
document.inv_obj.desc="حفظ فاتورة للدفع آجل رقم : "+document.inv_obj.inv_id

var data="0~"+document.inv_obj.dat+"~"+document.inv_obj.time+"~1~1~1~0~0~0~1~0"+"~"+now1later0
}

///////param3 = prof_mov_dat,prof_mov_tim,prof_id,prof_mov_value,prof_mov_balance,prof_mov_desc, invoice id
var data3=document.inv_obj.dat+"~"+document.inv_obj.time+"~"+document.inv_obj.customer_profid+"~"+document.inv_obj.gtotal+"~"+"0"+"~"+document.inv_obj.desc+"~"+document.inv_obj.inv_id

$.ajaxSetup({async:false});
$.post("php/acc_func.php",{param:data,param3:data3},function(server_response) {
//data = $.parseJSON(server_response);
if(server_response=="succeded"){
if(document.inv_obj.status==1){
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

}else{
alert("يجب حفظ الفاتورة أولا")	
return false;
};
///// 8- udate item ingradients stock by substrcting invoice items quantities
if(document.acc_salesstep==2){
 ////param1=invoice id , param2 = userid, parm3=date, param4= prof id
 var data="3~"+document.inv_obj.inv_id+"~"+document.inv_obj.cashierid+"~"+ document.inv_obj.dat+"~"+document.inv_obj.customer_profid
	
 $.ajaxSetup({async:false});
$.post("php/cashier_func.php",{param:data},function(server_response) {
//data = $.parseJSON(server_response);
if(server_response=="succeded"){

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
initializeInvobj();
refreshinvoicetable();
}else{
alert("يجب تسجيل حركة المخازن اولا")	
return false;
}
}else{/// if the invoice was not printed show dialoge to ask him to print first

if(document.inv_obj.status==1){
alert("يجب طباعة الفاتورة أولا قبل الدفع");
	}else{
alert("يجب طباعة الفاتورة أولا قبل الحفظ للدفع آجل");	}
return false;	
}
});///doc ready end
}



//////////////////////////paid unpaid inv functions////////////
function checkifhasunpaidinv(profid){
	$(document).ready(function() {	
	if(profid!=0){
	///// parameters : invoicestatus =0 unpaid,1 paid; profile id; startdate = 0 all dates, or specific date; enddate
var data1="5~"+0+"~"+profid+"~"+0+"~"+0
$.ajaxSetup({async:false});
$.post("php/cashier_func.php",{param:data1},function(server_response) {
var data = $.parseJSON(server_response);
var totalinvsum=0
for(aix=0;aix<data.length;aix++){
totalinvsum=parseFloat(totalinvsum)+parseFloat(data[aix].inv_gtotal)
}///end of for
//alert(totalinvsum)
totalinvsumrounded=(totalinvsum).toFixed(2)
//alert(totalinvsumrounded)
if(data.length>0){
	alrtmsg="عدد الفواتير الغير مدفوعة: "+data.length+" باجمالي: "+totalinvsumrounded+" جنيه"
$("#paidunpaidcustinfo").html(alrtmsg)
}else{
$("#paidunpaidcustinfo").html("")
 totalinvsum=0
}
});
	}else{
		 totalinvsum=0
	$("#paidunpaidcustinfo").html("")	
	}///end if profid 0
})///end of doc ready

}
// for showing unPaid invoices to be paid by customer 
function show_paid_unpaid_inv(paid1unpaid0,profid,st_date,end_date){
$(document).ready(function() {	
	///// parameters : invoicestatus =0 unpaid,1 paid; profile id; startdate = 0 all dates, or specific date; enddate
var data1="5~"+paid1unpaid0+"~"+profid+"~"+st_date+"~"+end_date
//	alert(data1)
document.inv_paid_un_arr = [];
document.inv_paid_un_arr.paid_un_invobj={}
document.inv_paid_un_arr.paid_un_invobj.invitems=[]
document.unpaid_inv_length=0

 $.ajaxSetup({async:false});
$.post("php/cashier_func.php",{param:data1},function(server_response) {
var data = $.parseJSON(server_response);
//alert(data);
document.unpaidinvinfo=data
document.unpaid_inv_length=data.length
//alert("parsed server json       "+JSON.stringify(data));

for(aix=0;aix<data.length;aix++){
//method1
oneinv={inv_id:data[aix].inv_id,inv_total:data[aix].inv_total,inv_discount:data[aix].inv_discount,inv_tax:data[aix].inv_tax,inv_service:data[aix].inv_service,inv_gtotal:data[aix].inv_gtotal,inv_dattime:data[aix].inv_dattime,inv_profid:data[aix].inv_profid,inv_prof_fullname:data[aix].inv_prof_fullname,invitems:[]}
document.inv_paid_un_arr.push(oneinv)

}///end of for
});
for(aiix=0;aiix<document.unpaid_inv_length;aiix++){
inv_data="6~"+document.unpaidinvinfo[aiix].inv_id
$.ajaxSetup({async:false});
$.post("php/cashier_func.php",{param:inv_data},function(server_response) {
var invdata = $.parseJSON(server_response);
//alert(JSON.stringify(invdata))
/////inv_itm_id, inv_itm_name, inv_itm_unit_price, inv_itm_qnty, inv_itm_sum
for(rowind=0;rowind<invdata.length;rowind++){
invorow={inv_itm_id:invdata[rowind].inv_itm_id,inv_itm_name:invdata[rowind].inv_itm_name,inv_itm_unit_price:invdata[rowind].inv_itm_unit_price,inv_itm_qnty:invdata[rowind].inv_itm_qnty,inv_itm_sum:invdata[rowind].inv_itm_sum}
document.inv_paid_un_arr[aiix].invitems.push(invorow)
}

})
}/// end of for param6
//alert(document.inv_paid_un_arr.length)
//alert("result array of invoices       "+JSON.stringify(document.inv_paid_un_arr));
drawpaidunpaidinv();
})///end of doc ready
}
///// function to draw unpaid-paid invoices
function drawpaidunpaidinv(){
$(document).ready(function() {
$("#unpaid-inv-container").find(".unpaid-invoice-container").remove();
$("#unpaid-inv-container").find(".alrtmsg").remove();
if(document.unpaid_inv_length<1){
	$("#unpaid-inv-container ").append("<div class='alrtmsg'> ...عفوا لا يوجد فواتير...</div>")
}
/*
oneinv={inv_id:data[aix].inv_id,inv_total:data[aix].inv_total,inv_discount:data[aix].inv_discount,inv_tax:data[aix].inv_tax,inv_service:data[aix].inv_service,inv_gtotal:data[aix].inv_gtotal,inv_dattime:data[aix].inv_dattime,inv_profid:data[aix].inv_profid,inv_prof_fullname:data[aix].inv_prof_fullname,invitems:[]}
*/
for(aiix=0;aiix<document.unpaid_inv_length;aiix++){
	
var invoicehtml="<div class='unpaid-invoice-container' data-inv_arr_index='"+aiix+"'><div class='inv_data_row'> فاتورة - رقم :  <div class='inlinediv' id='unpaid-inv_num'  data-id='"+document.inv_paid_un_arr[aiix].inv_id+"'>"+document.inv_paid_un_arr[aiix].inv_id+"</div></div><div class='inv_data_row'> تاريخ :  <div class='inlinediv unpaid-inv_dattime' data-invdate='"+document.inv_paid_un_arr[aiix].inv_dattime+"'>"+document.inv_paid_un_arr[aiix].inv_dattime+"</div></div><div class='inv_data_row'> اسم العميل :  <div class='inlinediv unpaid-cust_name' data-profid='"+document.inv_paid_un_arr[aiix].inv_profid+"'>"+document.inv_paid_un_arr[aiix].inv_prof_fullname+"</div></div><div class='inv_table'><div class='inv_tbl_head'><div class='inv_name_col inv_row_col'>اسم الصنف</div><div class='inv_unitpr_col inv_row_col'>سعر الوحدة</div><div class='inv_qunt_col inv_row_col'>الكمية</div><div class='inv_cost_col inv_row_col'>الاجمالي</div></div><div class='unpaid-inv_tbl_datarows' data-inv_arr_index_row='"+aiix+"'></div><!-----end of invoice tbl datarows--><div class='unpaid-taxrow inv_tbl_datarows'><div class='inv_name_col inv_row_col'>الضريبة</div><div class='inv_unitpr_col inv_row_col'>10%</div><div class='inv_qunt_col inv_row_col'></div><div class='inv_cost_col inv_row_col'>"+parseFloat(document.inv_paid_un_arr[aiix].inv_tax).toFixed(2)+"</div></div><div class='unpaid-servrow inv_tbl_datarows'><div class='inv_name_col inv_row_col'>الخدمة</div><div class='inv_unitpr_col inv_row_col'>12%</div><div class='inv_qunt_col inv_row_col'></div><div class='inv_cost_col inv_row_col'>"+parseFloat(document.inv_paid_un_arr[aiix].inv_service).toFixed(2)+"</div></div><div class='unpaid-discrow inv_tbl_datarows'><div class='inv_name_col inv_row_col'>الخصم</div><div class='inv_unitpr_col inv_row_col'></div><div class='inv_qunt_col inv_row_col'></div><div class='inv_cost_col inv_row_col'>"+parseFloat(document.inv_paid_un_arr[aiix].inv_discount).toFixed(2)+"</div></div><div class='unpaid-gtotalrow inv_tbl_datarows'><div class='inv_name_col inv_row_col'>الاجمالي</div><div class='inv_unitpr_col inv_row_col'></div><div class='inv_qunt_col inv_row_col'></div><div class='inv_cost_col inv_row_col'>"+parseFloat(document.inv_paid_un_arr[aiix].inv_gtotal).toFixed(2)+"</div></div></div><!-----end of invoice tbl--><div class='descr'><button class='printunpaidinv' data-inv_arr_btn_index='"+aiix+"'>طباعة</button></div><div class='descr'><button class='pay_unpaidinv' data-pay_btn_invid='"+document.inv_paid_un_arr[aiix].inv_id+"'  data-inv_arr_pay_btn_index='"+aiix+"' data-pay_btn_profid='"+document.inv_paid_un_arr[aiix].inv_profid+"' data-pay_btn_gtotal='"+document.inv_paid_un_arr[aiix].inv_gtotal+"'>ادفع الفاتورة</button></div></div><!----End of invoice-container--->"

	$("#unpaid-inv-container ").append(invoicehtml)
var itemsrows=0
//alert("length  "+document.inv_paid_un_arr[aiix].invitems.length)
for(itemsrows=0;itemsrows<document.inv_paid_un_arr[aiix].invitems.length;itemsrows++){
//	alert(itemsrows)
	/////inv_itm_id, inv_itm_name, inv_itm_unit_price, inv_itm_qnty, inv_itm_sum
var itmrow="<div class='inv_tbl_datarows'><div class='inv_name_col inv_row_col' data-inv_itm_id='"+document.inv_paid_un_arr[aiix].invitems[itemsrows].inv_itm_id+"'>"+document.inv_paid_un_arr[aiix].invitems[itemsrows].inv_itm_name+"</div><div class='inv_unitpr_col inv_row_col'>"+document.inv_paid_un_arr[aiix].invitems[itemsrows].inv_itm_unit_price+"</div><div class='inv_qunt_col inv_row_col'>"+document.inv_paid_un_arr[aiix].invitems[itemsrows].inv_itm_qnty+"</div><div class='inv_cost_col inv_row_col'>"+document.inv_paid_un_arr[aiix].invitems[itemsrows].inv_itm_sum+"</div></div>"
$("#unpaid-inv-container").find("[data-inv_arr_index_row='"+aiix+"']").append(itmrow)

//	$("#unpaid-inv-container[data-inv_arr_index='" + aiix + "'] div.unpaid-inv_tbl_datarows").append(itmrow)
}///end of invoice rows for loop
}//// end of invoices for loop
var invtyp= $("#paidorunpaid").val()
if(invtyp==1){
$(".pay_unpaidinv").hide()
}else{
$(".pay_unpaidinv").show()
	
}
});
}
///////////////////////Pay now for unpaid invoices //////////////
function paynow_unpaidinv(invid,profid,accdat,acctime,inv_gtotal){
	//// update invoice paid status to 1 (paid) parameters req: inv id
	//// update sales paid status to 1 ; req parameters : inv id and or acc_mov_id
	//// insert acc_movement
	/// insert cash to cashier 
	/// insert add to +ver to acc profile id
	$(document).ready(function() {	
///// parameters : invoicestatus =0 unpaid,1 paid; profile id; startdate = 0 all dates, or specific date; enddate
var data01="7~"+invid+"~"+profid+"~"+accdat+"~"+acctime+"~"+inv_gtotal
 $.ajaxSetup({async:false});
$.post("php/cashier_func.php",{param:data01},function(server_response) {
//var data = $.parseJSON(server_response);
if(server_response=="succeded"){
alert("تم دفع الفاتورة، اضافة قيمتها الى الخزينة، رفع قيمتها من على العميل، تسجيل الحركة في الحسابات")
}else{
alert("حدث مشكلة اثناء دفع الفاتورة " +server_response)	
}
})//// post end
	})/// doc ready end
}////function end
/////////////////////////
