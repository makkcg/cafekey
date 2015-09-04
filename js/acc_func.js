
/////////////////////////////////////////////// generic functions all subsctions ////////////////////
/////////////// show modal popup dialoge
function showconfirmmsg(html){
$(document).ready(function() {
		//// confirm user payment
		$("<div>"+html+"</div>").dialog({
	  appendTo: "#invoice-info-container",
	  title: 'تأكيد', 
	  zIndex: 10000,
	  
      resizable: false,
      height:200,
      modal: true,
      buttons: {
        "نعم": function() {
          $( this ).dialog( "close" );
		 
		  return true;
        },
        "لا": function() {
          $( this ).dialog( "close" );
		  return false;
        }
      }
    });
})///// end doc ready
}////end function

/////// genral print function for any report
function printreport(title,reporthtml,spcificss){
 var mywindow = window.open('', title, 'height=450,width=650');
        mywindow.document.write('<html><head><title>'+title+'</title>');
        /*optional stylesheet*/ //
		mywindow.document.write(' <link rel="stylesheet" type="text/css" href="css/appmains.css" />');
		//mywindow.document.write(' <link rel="stylesheet" type="text/css" href="css/invprint.css" />');
       // mywindow.document.styleSheets="css/invprint.css"
	    printstyle='<style>body{background:none !important;};'+spcificss+'</style>'
		mywindow.document.write(printstyle);
		mywindow.document.write('</head><body >');
        mywindow.document.write(reporthtml);
        mywindow.document.write('</body></html>');
        mywindow.print();
		mywindow.close();
        return true;	
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
//// function to refresh and update dashboard data
function updatedashboard(){
$.ajaxSetup({async:false});
var dat=frmtdatetimesql(1)
$.post("php/acc_func.php",{param:'15~'+dat},function(server_response) {
	//"daycash""daysales""daycredit""daypurch""dayexp""monthcash""monthsales""monthcredit""monthpurch""monthexp"
					data=$.parseJSON(server_response)
					$(".daycash").html(parseFloat(data[0].daycash).toFixed(2))
					$(".daysales").html(parseFloat(data[0].daysales).toFixed(2))
					$(".daycredit").html(parseFloat(data[0].daycredit).toFixed(2))
					$(".dayexp").html(parseFloat(data[0].dayexp).toFixed(2))
					$(".daypurch").html(parseFloat(data[0].daypurch).toFixed(2))
					$(".dayexppart").html(parseFloat(data[0].dayexppart).toFixed(2))
					
					//////
					$(".monthcash").html(parseFloat(data[0].monthcash).toFixed(2))
					$(".monthsales").html(parseFloat(data[0].monthsales).toFixed(2))
					$(".monthcredit").html(parseFloat(data[0].monthcredit).toFixed(2))
					$(".monthexp").html(parseFloat(data[0].monthexp).toFixed(2))
					$(".monthpurch").html(parseFloat(data[0].monthpurch).toFixed(2))
					$(".monthexppart").html(parseFloat(data[0].monthexppart).toFixed(2))		
});	
}
///// initialize all contorls in acc menu
function initializeaccscreen(){
$(document).ready(function() {	
	$('#accmainbtns-container').find('div.touchbutton').removeClass('active');
	$(".sub-sub-acc-div").hide()
	$("#exp_owner_div").hide()
	$("#exp_staff_div").hide()
	$('.exp_type_btn').removeClass('active');
	
	$("#exp_level1_dd").prop("disabled",false)
	$("#exp_level2_dd").prop("disabled",false)
	$("#exp_level3_dd").prop("disabled",false)
	$(".date_picker").datepicker()
	$(".date_picker").datepicker("option", "dateFormat", "yy-mm-dd")
	populateexpenceslist(0,1);
	/// cash report options and date picker
	$("#datediv").hide()
	$("#cashrepfrom_datepick").datepicker()
	$("#cashrepfrom_datepick").datepicker("option", "dateFormat", "yy-mm-dd")
	$("#cashrepto_datepick").datepicker()
	$("#cashrepto_datepick").datepicker("option", "dateFormat", "yy-mm-dd")
	///invoice search options and date picker
	$("#invsearchfrom_datepick").datepicker()
	$("#invsearchfrom_datepick").datepicker("option", "dateFormat", "yy-mm-dd")
	$("#invsearchto_datepick").datepicker()
	$("#invsearchto_datepick").datepicker("option", "dateFormat", "yy-mm-dd")
	
	/// sales report options and date picker
	$("#salesdatediv").hide()
	
	$("#salesrepfrom_datepick").datepicker()
	$("#salesrepfrom_datepick").datepicker("option", "dateFormat", "yy-mm-dd")
	$("#salesrepto_datepick").datepicker()
	$("#salesrepto_datepick").datepicker("option", "dateFormat", "yy-mm-dd")
	/////sales items sales report options and date picker
	populatesalesitmes()
	$("#salesitmsdatediv").hide()
	
	$("#salesitmsrepfrom_datepick").datepicker()
	$("#salesitmsrepfrom_datepick").datepicker("option", "dateFormat", "yy-mm-dd")
	$("#salesitmsrepto_datepick").datepicker()
	$("#salesitmsrepto_datepick").datepicker("option", "dateFormat", "yy-mm-dd")
	
	/////purch items purch report options and date picker
	//populatepurchitmes()
	$("#purchitmsdatediv").hide()
	
	$("#purchitmsrepfrom_datepick").datepicker()
	$("#purchitmsrepfrom_datepick").datepicker("option", "dateFormat", "yy-mm-dd")
	$("#purchitmsrepto_datepick").datepicker()
	$("#purchitmsrepto_datepick").datepicker("option", "dateFormat", "yy-mm-dd")
})/// end of doc ready
	
	
}
//////// acc functions for Cafekey app by Mohammed Khalifa///////
////////////////////////////// navigation and interface related js ACC screen ////////////////////
$(document).ready(function() {
////////////////////////////
updatedashboard();
//////////////dash board data//////////////////
$(document).on('click','.refreshdash',function(event){
	event.preventDefault();
	updatedashboard();
})//end click

/////click on show sales items sales report
$(document).on('click','#salesitmsrep_btn',function(event){
	
	gen_show_salesitmsrep($("#salesitemslist_dd"),$("#salesitmsreptyp_dd"),$("#salesitmsrepfrom_datepick"),$("#salesitmsrepto_datepick"))
});//end click show sales items sales rep

/////click on show sales items sales report
$(document).on('click','#purchitmsrep_btn',function(event){
	
	gen_show_purchitmsrep($("#stockitemslist_dd"),$("#purchitmsreptyp_dd"),$("#purchitmsrepfrom_datepick"),$("#purchitmsrepto_datepick"))
});//end click show sales items sales rep

/////profile data page//////
///save profile income

$(document).on('click','#saveincprof_btn',function(event){
	//verify inputs
	var profname=$("#staffpartners_dd").find(":selected").text()
	var profid=$("#staffpartners_dd").find(":selected").val()
	var addvalue=$("#staffdepvalue").val()
	var incomedesc=$("#staffdepdesc").val()
	var dat=frmtdatetimesql(1)
	var proftime=frmtdatetimesql(2)
	
	if(parseInt(addvalue)<1 || addvalue=="" ){alert("يرجى ادخال القيمة المستحقة");$("#staffdepvalue").focus();return false;}
	if(incomedesc=="" || incomedesc<1){alert("يرجى ادخال وصف القيمة المستحقة ، مرتب ، عمولة ...");$("#staffdepdesc").focus();return false;}
	
	profinc_desc="تسجيل مستحق  "+incomedesc+" بقيمة "+addvalue+" جنيه ، ل: "+profname+" في تاريخ "+dat+" في الساعة "+proftime
	/////dialoge to confirm the profile
	//$("#reportdiv").remove()
	var title='تسجيل مستحقات ل'+profname
	txtmsg="<br/>هل تريد تسجيل مستحق ل "+profname +" بقيمة "+addvalue+" جنيه ، وبيانه : "+profinc_desc +" ؟ "
	
	showconfsaveincprof(title,txtmsg,dat,proftime,profname,profid,addvalue,profinc_desc)

	//
	
	//set the variables to save the income to profile
	
});//end click save profile income
////
////////////////Expences page control////////////
////////click on submit expences btn////
$(document).on('click','#save_exp_btn',function(){
var exptype,exp_code,exp_dat,exp_time,exp_value,exp_desc,fromcash,profid,issalary,expnotes,level1,level2,level3,desclvl1,desclvl2,desclvl3,desclvls,whopay
exp_value=$("#exp_value").val()
expnotes=$("#exp_note").val()
level1=$("#exp_level1_dd").find(":selected").val()
level2=$("#exp_level2_dd").find(":selected").val()
level3=$("#exp_level3_dd").find(":selected").val()
whopayid=$("#exp_from_dd").find(":selected").val()
if(parseInt(whopayid)==0){
	fromcash=10000
}else{
	fromcash=parseInt($("#exp_from_dd").find(":selected").val())
}
//// verify inputs
if(parseInt(exp_value)<1){alert("يرجى ادخال قيمة المصروف");return false;}
if(parseInt(level1)==0){alert("يرجى اختيار نوع المصروف");$("#exp_level1_dd").focus();return false;
}else if(parseInt(level1)==2){///salaries 
	if(parseInt(level2)==0){alert("يرجى اختيار التصنيف الفرعي - واختيار الموظف");$("#exp_level2_dd").focus();return false;}
}else if(parseInt(level1)==21){///partners
	if(parseInt(level2)==0){alert("يرجى اختيار الشريك");$("#exp_level2_dd").focus();return false;}
}else if(parseInt(level1)==1){///partners
	if(parseInt(level2)==0){alert("يرجى اختيار التصنيف الفرعي الاول");$("#exp_level2_dd").focus();return false;}
	if(parseInt(level3)==0){alert("يرجى اختيار التصنيف الفرعي الثاني");$("#exp_level2_dd").focus();return false;}
}

if(parseInt(exp_value)<1){alert("يرجى ادخال قيمة المصروف");return false;}
if(expnotes==""){alert("يرجى ادخال الملاحظات او وصف المصروف");return false;}
///postexpences(exptype,exp_code,exp_dat,exp_time,exp_value,exp_desc,fromcash,profid,issalary){
////param1: exptype (1 exp is salary or pay to partner) , $param[2] : exp_code, $param[3]: exp_dat,$param[4]:exp_time,$param[5]:exp_value,$param[6]:exp_desc , param7:fromcash ( 1 if paid from chasier, profid if paid by any partner),  param8:profid ( the profid for staff or partner paid to), param9:issalary ( 1 if is paid to staff as salary or related type of exp)
//// get the expences code based on selections levels
exp_code=0;
desclvl1=$("#exp_level1_dd").find(":selected").text()
desclvl2=$("#exp_level2_dd").find(":selected").text()
desclvl3=$("#exp_level3_dd").find(":selected").text()
if(parseInt($("#exp_level3_dd").find(":selected").val())>0){
exp_code=parseInt($("#exp_level3_dd").find(":selected").val())
desclvl3=$("#exp_level3_dd").find(":selected").text()
}else{
	if(parseInt($("#exp_level2_dd").find(":selected").val())>0){
	exp_code=parseInt($("#exp_level2_dd").find(":selected").val())
	desclvl2=$("#exp_level2_dd").find(":selected").text()
	}else{
	exp_code=parseInt($("#exp_level1_dd").find(":selected").val())
	desclvl1=$("#exp_level1_dd").find(":selected").text()
	}
}

if(!exp_code){alert("يرجى الاختيار الصحيح لبنود المصروفات");return false;}
desclvls=desclvl1+" - "+desclvl2+" - "+desclvl3
exp_dat=frmtdatetimesql(1)
exp_time=frmtdatetimesql(2)
/////////////////////////////
switch (parseInt(level1)){
case 1:/// general expences
///postexpences(exptype,exp_code,exp_dat,exp_time,exp_value,exp_desc,fromcash,profid,issalary){
////param1: exptype (1 exp is salary or pay to partner) , $param[2] : exp_code, $param[3]: exp_dat,$param[4]:exp_time,$param[5]:exp_value,$param[6]:exp_desc , param7:fromcash ( 1 if paid from chasier, profid if paid by any partner),  param8:profid ( the profid for staff or partner paid to), param9:issalary ( 1 if is paid to staff as salary or related type of exp)
issalary=0

profid=0
exptype=0///not salary or pay to partner
exp_value=parseFloat($("#exp_value").val());
exp_desc="مصروفات  "+desclvls+" بقيمة "+exp_value+" جنيه ،تم الصرف من: "+$("#exp_from_dd").find(":selected").text()+" في تاريخ "+exp_dat+" ملاحظات: "+expnotes
var result=postexpences(exptype,exp_code,exp_dat,exp_time,exp_value,exp_desc,fromcash,profid,issalary)
if(result){
	alert("تم تسجيل المصروف")
}
break;
case 2:///salaries
issalary=1
profid=parseInt($("#exp_staff_dd").find(":selected").val())
exptype=1///salary 
exp_value=parseFloat($("#exp_value").val());
exp_desc="مصروفات  "+desclvls+" بقيمة "+exp_value+" جنيه ،تم الصرف من: "+$("#exp_from_dd").find(":selected").text()+"  تم الصرف ل "+$("#exp_staff_dd").find(":selected").text()+" في تاريخ "+exp_dat+" ملاحظات: "+expnotes
var result=postexpences(exptype,exp_code,exp_dat,exp_time,exp_value,exp_desc,fromcash,profid,issalary)
if(result){
	alert("تم تسجيل المصروف")
}
break;
case 21://partners accounts expences
issalary=0
profid=parseInt($("#exp_owners_dd").find(":selected").val())
exptype=1///pay from partner 
exp_value=parseFloat($("#exp_value").val());
exp_desc="مصروفات  "+desclvls+" بقيمة "+exp_value+" جنيه ،تم الصرف من: "+$("#exp_from_dd").find(":selected").text()+"  تم الصرف من الحساب الجاري ل "+$("#exp_owners_dd").find(":selected").text()+" في تاريخ "+exp_dat+" ملاحظات: "+expnotes
var result=postexpences(exptype,exp_code,exp_dat,exp_time,exp_value,exp_desc,fromcash,profid,issalary)
if(result){
	alert("تم تسجيل المصروف")
}
break;
case 23://taxes
issalary=0
profid=0
exptype=0///not salary or pay to partner
exp_value=parseFloat($("#exp_value").val());
exp_desc="مصروفات  "+desclvls+" بقيمة "+exp_value+" جنيه ،تم الصرف من: "+$("#exp_from_dd").find(":selected").text()+" في تاريخ "+exp_dat+" ملاحظات: "+expnotes
var result=postexpences(exptype,exp_code,exp_dat,exp_time,exp_value,exp_desc,fromcash,profid,issalary)
if(result){
	alert("تم تسجيل المصروف")
}
break;
case 26:///insurance
issalary=0
profid=0
exptype=0///not salary or pay to partner
exp_value=parseFloat($("#exp_value").val());
exp_desc="مصروفات  "+desclvls+" بقيمة "+exp_value+" جنيه ،تم الصرف من: "+$("#exp_from_dd").find(":selected").text()+" في تاريخ "+exp_dat+" ملاحظات: "+expnotes
var result=postexpences(exptype,exp_code,exp_dat,exp_time,exp_value,exp_desc,fromcash,profid,issalary)
if(result){
	alert("تم تسجيل المصروف")
}
break;
	
	
}
})//end click save expences
/////////////click on save various income //////
$(document).on('click','#save_varinc_btn',function(){
///se variables
var varinctypid=$("#varinc_typ_dd").find(":selected").val();
var varinctyptxt=$("#varinc_typ_dd").find(":selected").text();
var varincvalue=$("#varinc_value").val();
var curdat=frmtdatetimesql(1)
var curtime=frmtdatetimesql(2)
var innotes=$("#varinc_note").val()
var tocash=1
if(tocash==1){
var varincnotes= "تسجيل ايرادات متنوعة نوع "+varinctyptxt+" بقيمة  "+varincvalue+" جنيه . ملاحظات :  "+$("#varinc_note").val()+" في تاريخ : "+curdat+" وتم التوريد الى الخزينة ";
}else{
var varincnotes= "تسجيل ايرادات متنوعة نوع "+varinctyptxt+" بقيمة  "+varincvalue+" جنيه . ملاحظات :  "+$("#varinc_note").val()+" في تاريخ : "+curdat;	
}

///verify inputs
if(parseInt(varincvalue)<0){alert("يرجى ادخال قيمة الايراد");$("#varinc_value").focus();return false};
if(innotes==""){alert("يرجى ادخال ملاحظات / وصف الايراد المتنوع");$("#varinc_note").focus();return false};
///save the various income process
postvarincome(varincvalue,curdat,curtime,varincvalue,varincnotes,tocash,varinctyptxt);
//reset form
$("#varinc_typ_dd").val(0)
$("#varinc_value").val("")
$("#varinc_note").val("")
});//////////////end click save various income btn



//////////////////////////
///////////////////////////main acc buttons selection ////
$(document).on('click','ul.accmenu li a',function(){
var btnid=parseInt($(this).data('id'))
//alert(btnid)
switch(btnid) {
    case 7:///acc summary page
        $(".sub-sub-acc-div").hide()
		$(".dashboarddiv").addClass('shown').show();
		$("ul.accmenu li").removeClass('active');
		$(this).parent().addClass('active')
        break;
	case 1: /// accounting data setup page
        $(".sub-sub-acc-div").hide()
		$("ul.accmenu li").removeClass('active');
		$(this).parent().addClass('active')
        
		
		break;
    case 2:///staff accounting data page
        $(".sub-sub-acc-div").hide()
		$("#staffdepdiv").hide()
		$("#saveincprof_btn").hide()
		$('#editprofdiv').hide()
		$('#addprofdiv').hide()
		$('#showprofdata_btn').hide()
		
		
		$("#selectstaffpartnerdiv").hide()
		
		$("#acc_staffdata-container").addClass('shown').show();
		
		$('#staffoperation_dd').val(0);
		$("#staffdepvalue").val("")
		$("#staffdepdesc").val("")
		$("ul.accmenu li").removeClass('active');
		$(this).parent().addClass('active')
		/// accounting Safe report page
		//$("#acc_safe-container").addClass('shown').show();
		//getcashmovementsinrep(frmtdatetimesql(1),frmtdatetimesql(1))
        break;
    case 3:///Expences accounting page
        $(".sub-sub-acc-div").hide()
		$("ul.accmenu li").removeClass('active');
		$(this).parent().addClass('active')
		$("#acc_exp-container").addClass('shown').show();
		populateprofdd()
		$("#exp_owner_div").hide()
		$("#exp_staff_div").hide()
		$("#exp_all").click()
		
		break;
	case 4:///// various income page 
        $(".sub-sub-acc-div").hide()
		$("ul.accmenu li").removeClass('active');
		$(this).parent().addClass('active')
		$("#acc_varincome-container").addClass('shown').show();
		//reset var income form
		$("#varinc_typ_dd").val(0)
		$("#varinc_value").val("")
		$("#varinc_note").val("")
		//sales  and various income report
		//$("#acc_income-container").addClass('shown').show();
		//getsalesreport(frmtdatetimesql(1),frmtdatetimesql(1))
	
		break;
	case 5:// invoices management page
        $("#invsearchtable").find(".invrestablerow").remove()
        $(".sub-sub-acc-div").hide()
		$("ul.accmenu li").removeClass('active');
		$(this).parent().addClass('active')
		$("#acc_viewinvoices-container").addClass('shown').show();
		///reset view invoices forms
		$('.inv_search_info').show()
		$('.inv_search_no').hide()
		$('.order_search_no').hide()
		infotoshow=" تاريخ اليوم : "+frmtdatetimesql(1)
		$('.inv_search_infotxt').html(infotoshow)
		$("#search_order_no").val("")
		$("#search_inv_no").val("")
		
		// expences report
		//$("#acc_exprep-container").addClass('shown').show();
		break;
    case 6://// all accounting reports page
        $(".sub-sub-acc-div").hide()
		$("ul.accmenu li").removeClass('active');
		$(this).parent().addClass('active')
		$("#acc_rep_page").addClass('shown').show();
		/////reset items and forms
		$(".reports_btns").removeClass('active');
		$(".reports_btns").removeClass('disabled');
		///purchases accounting page
		//$("#acc_purch-container").addClass('shown').show();
		break;
	case 24://owners balance report
        
        $(".sub-sub-acc-div").hide()
		$("#accmainbtns-container div.touchbutton").removeClass('active');
		$(this).addClass('active')
		$("#acc_owners-container").addClass('shown').show();
		$("#ownersprofaccmovs").find('div.righttblrow').remove();
	document.custaccsub=0
	document.custaccadd=0
	document.custbalance=0
	document.custprevcashbalance=0
$("#ownprofbalancetotal").html(document.custbalance)
$("#ownbalancedesc").html("")
		populateprofdd()
		break;
	case 10://// staff balance report
        
        $(".sub-sub-acc-div").hide()
		$("#accmainbtns-container div.touchbutton").removeClass('active');
		$(this).addClass('active')
		$("#acc_staffrep-container").addClass('shown').show();
		$("#staffprofaccmovs").find('div.righttblrow').remove();
	document.custaccsub=0
	document.custaccadd=0
	document.custbalance=0
	document.custprevcashbalance=0
$("#staffprofbalancetotal").html(document.custbalance)
$("#staffbalancedesc").html("")
		populateprofdd()
		break;
    case 33://// customer balance report
        
        $(".sub-sub-acc-div").hide()
		$("#accmainbtns-container div.touchbutton").removeClass('active');
		$(this).addClass('active')
		$("#acc_cust-container").addClass('shown').show();
		$("#profaccmovs").find('div.righttblrow').remove();
	document.custaccsub=0
	document.custaccadd=0
	document.custbalance=0
	document.custprevcashbalance=0
$("#profbalancetotal").html(document.custbalance)
$("#balancedesc").html("")
		populateprofdd()
		break;

    case 37:
        $(".sub-sub-acc-div").hide()
		$("#accmainbtns-container div.touchbutton").removeClass('active');
		$(this).addClass('active')
		$("#acc_incomestatment-container").addClass('shown').show();
		break;

} 
})
/// initial data 
	initializeaccscreen()

/////click selector of accounting reports btns///
$(document).on('click','.reports_btns',function(){
var btnid=parseInt($(this).data('id'))
$(".reports_btns").removeClass('active').removeClass('disabled')
$(this).addClass('disabled').addClass('active')
//alert(btnid)
$(".acc-rep-sub").hide()
switch(btnid){
case 1://sales and income reports
$("#acc_income-container").show()
$("#showsalesrep").click()
break;	
case 2://sales items sales reports
populatesalesitemsdd($("#salesitemslist_dd"),1,"كافة الأصناف")
$("#acc_salesitm-salesrep-container").show()
break;	
case 3://expences reports

break;	
case 4://purchases reports
populatestockitemsdd($("#stockitemslist_dd"),1,"كافة الأصناف")
$("#acc_purchitm-salesrep-container").show()
break;	
case 5://cash mov reports

$("#acc_safe-container").show()
$("#showsafemovrep").click()


break;	
case 6://prof balance mov reports
$(".prof_reports_btns").removeClass('active').removeClass('disabled')
$("#acc_prof_bal_type-container").show()
break;	

}
});//end of click selector for accoutning reports btns

///////profile balance report type selector/////
$(document).on('click','.prof_reports_btns',function(){
var btnid=parseInt($(this).data('id'))
$(".prof_reports_btns").removeClass('active').removeClass('disabled')
$(this).addClass('disabled').addClass('active')
$(".acc-profbal-rep").hide()
switch(btnid){
case 1:////customers balance mov rep
document.custaccsub=0
	document.custaccadd=0
	document.custbalance=0
	document.custprevcashbalance=0
$("#profbalancetotal").html(document.custbalance)
$("#balancedesc").html("")
		populateprofdd()
$("#acc_cust-container").show()
////to get the period from first day of month to today
//// get today date //
		today=frmtdatetimesql(1);
		todayobj=new Date(today)
		/// get number of days to the first day of the month
		nodays=parseInt(parseInt(todayobj.getDate())-1)
		///// set the first day of the month
		firstdayinthismonth=addsubsdaysfromdate(today,0,nodays)
		//alert(firstdayinthismonth)
	startdat=firstdayinthismonth
	enddate=today
/////////
$("#custrepfrom_datepick").val(startdat)
$("#custrepto_datepick").val(enddate)
$("#showcustrep").click()

break;
case 2:////staff balance mov rep
document.custaccsub=0
	document.custaccadd=0
	document.custbalance=0
	document.custprevcashbalance=0
$("#staffprofbalancetotal").html(document.custbalance)
$("#staffbalancedesc").html("")
		populateprofdd()
$("#acc_staffrep-container").show()
////to get the period from first day of month to today
//// get today date //
		today=frmtdatetimesql(1);
		todayobj=new Date(today)
		/// get number of days to the first day of the month
		nodays=parseInt(parseInt(todayobj.getDate())-1)
		///// set the first day of the month
		firstdayinthismonth=addsubsdaysfromdate(today,0,nodays)
		//alert(firstdayinthismonth)
	startdat=firstdayinthismonth
	enddate=today
/////////
$("#staffrepfrom_datepick").val(startdat)
$("#staffrepto_datepick").val(enddate)
$("#showstaffrep").click()
break;
case 3:////partners balance mov rep
document.custaccsub=0
	document.custaccadd=0
	document.custbalance=0
	document.custprevcashbalance=0
$("#staffprofbalancetotal").html(document.custbalance)
$("#staffbalancedesc").html("")
		populateprofdd()
$("#acc_owners-container").show()
////to get the period from first day of month to today
//// get today date //
		today=frmtdatetimesql(1);
		todayobj=new Date(today)
		/// get number of days to the first day of the month
		nodays=parseInt(parseInt(todayobj.getDate())-1)
		///// set the first day of the month
		firstdayinthismonth=addsubsdaysfromdate(today,0,nodays)
		//alert(firstdayinthismonth)
	startdat=firstdayinthismonth
	enddate=today
/////////
$("#ownersrepfrom_datepick").val(startdat)
$("#ownersrepto_datepick").val(enddate)
$("#showownersrep").click()

break;	
}

})///end of click for selecting prof balance report///////

//////////////////search invoices screen//////
///click on show spcific invoice from search results
$(document).on('click','.resshowitm',function(){
	var btnid=parseInt($(this).data('clickid'))
	var invno=parseInt($(this).data('invno'))
	show_inv_sub(invno)
	
})//end of click show specific invoice

////click on print invoice
$(document).on('click','div.printunpinv',function(){
///  var sss=$("#inv_tbl_datarows").find( 'div.inv_tbl_datarows[data-itmid="' + clicked.data('id') +'"]').data('itmid')
var invhtml=''
var btnid=parseInt($(this).data('clickedbtn'))
var invtype=$(this).data('invtype')
var subinvid=parseInt($(this).data('subinvid'))
if(invtype=='maininv'){
	//alert(invtype)
var invhtml=$(".ui-dialog").find("[ data-invtype='"+invtype+"']")
}else{
var invhtml=$(".ui-dialog").find("[ data-subinvid='"+subinvid+"']")
}
	  
	  var specific_css=""
	PrintElems(invhtml,specific_css);
//alert( $(invhtml).html())
})


////////click on search/show invoices btn////
$(document).on('click','#search_invs_btn',function(){
	///check the selected dropdown menu item inv_search_typ_dd
	selinvsearchtype=$('#inv_search_typ_dd').find(":selected").val();
	//today=frmtdatetimesql(1);
	//alert(selinvsearchtype)
	switch(parseInt(selinvsearchtype)){
	case 0:
	///call the get inv results function with current date parm and parm1=1
	today=frmtdatetimesql(1);
	invsearchfnc(1,today,0,0);
	break;
	case 1:
	///call the get inv results function with first day of month and current day date parm and parm1=2
	////to get the period from first day of month to today
//// get today date //
		today=frmtdatetimesql(1);
		todayobj=new Date(today)
		/// get number of days to the first day of the month
		nodays=parseInt(parseInt(todayobj.getDate())-1)
		///// set the first day of the month
		firstdayinthismonth=addsubsdaysfromdate(today,0,nodays)
		//alert(firstdayinthismonth)
	startdat=firstdayinthismonth
	enddate=today
/////////
	////invsearchfnc(searchtype,startdat,enddat,invorderno)
	invsearchfnc(2,startdat,enddate,0);
	break;
	case 2:
	///call the get inv results function with period between two dates parm and parm1=2
	//// get today date //
		today=frmtdatetimesql(1);
if($("#invsearchfrom_datepick").val()=="" || $("#invsearchfrom_datepick").val()==""){
	alert("ارجو ادخال تاريخ صحيح")
}else{
	startdat= $("#invsearchfrom_datepick").val();
	enddate= $("#invsearchto_datepick").val();
/////////
	////invsearchfnc(searchtype,startdat,enddat,invorderno)
	invsearchfnc(2,startdat,enddate,0);
}
	break;
	case 3:
	///call the get inv results function with current date parm and parm1=1
	today=frmtdatetimesql(1);
	search_inv_no=$('#search_inv_no').val();
	invsearchfnc(3,today,0,parseInt(search_inv_no));
	break;	
	
	case 4:
	///call the get inv results function with current date parm and parm1=1
	today=frmtdatetimesql(1);
	search_order_no=$('#search_order_no').val();
	invsearchfnc(4,today,0,parseInt(search_order_no));
	break;
	
	}
	
});

//////////////////////////end of search inv screen////////////

//////////////////////////////////////////EXPENCES SUB PAGE //////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////

/////////////////////////// add EXPENCES SUB SCREEN//////////////////
/// create the Expences items in each level in drop down lists in a expences
///initialize acc controls


///// selected type of expences buttons
$('.exp_type_btn').click(function() {
	 $(this).addClass('active').siblings().removeClass('active');
	 ////reset values
	 $("#exp_value").val("");
	 $("#exp_note").val("");
	 $("#exp_from_dd").val(0);
	 
}); 
$("#exp_all").click(function(){
	$("#exp_owner_div").hide()
	$("#exp_staff_div").hide()
	$("#exp_level1_dd").prop("disabled",false)
	$("#exp_level2_dd").prop("disabled",false)
	$("#exp_level3_dd").prop("disabled",false)
	$("#exp_level1_dd").val(1)
	parentid=$('#exp_level1_dd').find(":selected").val();
	populateexpenceslist(parentid,2)
	//populateprofdd()
})

$("#exp_salaries").click(function(){
	$("#exp_staff_div").show()
	$("#exp_owner_div").hide()
	$("#exp_level1_dd").val(2)
	//$("#exp_level1_dd").prop("disabled",true)
	parentid=$('#exp_level1_dd').find(":selected").val();
	populateexpenceslist(parentid,2)
	
	//populateprofdd()
	
})

$("#exp_profile_blance").click(function(){
	$("#exp_staff_div").hide()
	$("#exp_owner_div").show()
	$("#exp_level1_dd").val(21)
	//$("#exp_level1_dd").prop("disabled",true)
	parentid=$('#exp_level1_dd').find(":selected").val();
	populateexpenceslist(parentid,2);

})
//// change invoice search type invoice and orders search sub page
$("#inv_search_typ_dd").change(function() {
	selid=$('#inv_search_typ_dd').find(":selected").val()
	$("#invsearchtable").find(".invrestablerow").remove()
	switch(parseInt(selid)){
	case 0:
	$('.inv_search_between').hide()
	$('.inv_search_info').show()
	$('.inv_search_no').hide()
	$('.order_search_no').hide()
	infotoshow=" تاريخ اليوم : "+frmtdatetimesql(1)
	$('.inv_search_infotxt').html(infotoshow)
	break;
	case 1:
	$('.inv_search_between').hide()
	$('.inv_search_info').show()
	$('.inv_search_no').hide()
	$('.order_search_no').hide()
	infotoshow=" تاريخ اليوم : "+frmtdatetimesql(1)
	$('.inv_search_infotxt').html(infotoshow)
	break;		
	case 2:
	$('.inv_search_between').show()
	$('.inv_search_info').hide()
	$('.inv_search_no').hide()
	$('.order_search_no').hide()
	
	break;
	case 3:
	$('.inv_search_between').hide()
	$('.inv_search_info').hide()
	$('.order_search_no').hide()
	$('.inv_search_no').show()
	
	break;
	case 4:
	$('.inv_search_between').hide()
	$('.inv_search_info').hide()
	$('.order_search_no').show()
	$('.inv_search_no').hide()
	
	break;
	}
	
});////end of change of invoice search type

////staff data management sub screen - add new staff is user cashier checkbox
$(document).on('click',"input[name='cashierrb']",function(){
var ischash=$("input[name='cashierrb']:checked").val()
if(parseInt(ischash)){$('.userpswprofrow').show();$('#addprofusername').val("");$('#addprofpsw').val("")}else{$('.userpswprofrow').hide()}
    })
/////
/////staff data management sub screen on change
$("#staffoperation_dd").change(function() {
	selid=parseInt($('#staffoperation_dd').find(":selected").val())
	//alert(selid)
	switch(selid){
	case 0:///please select operation (hide all divs)
	$('#selectstaffpartnerdiv').hide()
	$('#staffdepdiv').hide()
	$("#saveincprof_btn").hide()
	$('#editprofdiv').hide()
	$('#addprofdiv').hide()
	break;
	case 1:///save /insert deposit to profile accounting balance
	$('#selectstaffpartnerdiv').hide()
	$('#staffdepdiv').hide()
	$("#saveincprof_btn").hide()
	$("#showprofdata_btn").hide()
	$('#editprofdiv').hide()
	$('#addprofdiv').hide()
	
	populatestaffpartnersdd($('#staffpartners_dd'))
	$('#selectstaffpartnerdiv').show()
	$('#staffdepdiv').show()
	$("#saveincprof_btn").show()
	break;
	case 2:///add new employee
	$('#selectstaffpartnerdiv').hide()
	$('#staffdepdiv').hide()
	$("#saveincprof_btn").hide()
	$('#editprofdiv').hide()
	$("#saveincprof_btn").hide()
	$("#showprofdata_btn").hide()
	$('#addprofdiv').hide()
	$('.userpswprofrow').hide()//hide user name and psw boxes
	//reset username psw boxes 
	$('#addprofdiv').val("addprofusername")
	$('#addprofdiv').val("addprofpsw")
	
	
	$('#addprofdiv').show()
	break;
	case 3:////edit current employee data
	$('#selectstaffpartnerdiv').hide()
	$('#staffdepdiv').hide()
	$("#saveincprof_btn").hide()
	$('#addprofdiv').hide()
	populatestaffpartnersdd($('#staffpartners_dd'))
	$('#selectstaffpartnerdiv').show()
	//$('#editprofdiv').show()
	$("#showprofdata_btn").show()
	
	break;	
	
	}//end of switch 
	
});
////
////change the selected profile to show data for edit 
$("#staffpartners_dd").change(function() {
$('#editprofdiv').hide()
$('#addprofdiv').hide()
});///end change dd 
////

////// change the invoice customer name according to the selected customer from the dropdown list
$("#exp_level1_dd").change(function() {
	parentid=$('#exp_level1_dd').find(":selected").val();
	if(parentid==0){
		
		$("#exp_level2_dd").find('option').remove();
		$("#exp_level3_dd").find('option').remove();
		$("#exp_value").val("")
		$("#exp_note").val("")
		$("#exp_from_dd").val(0)
		
	}else{
	populateexpenceslist(parentid,2);
	}
	switch(parseInt(parentid)){
		case 1:// general expences
		$("#exp_all").click()
		break;
		case 2:////salaries
		$("#exp_salaries").click()
		break;
		case 21:///partners expences
		$("#exp_profile_blance").click()
		break;
		case 23: ///taxes expences
		$("#exp_value").val("")
		$("#exp_note").val("")
		$("#exp_from_dd").val(0)
		$("#exp_owner_div").hide()
		$("#exp_staff_div").hide()
		$(".exp_type_btn").removeClass('active');
		
		break;
		case 26:
		$("#exp_value").val("")
		$("#exp_note").val("")
		$("#exp_from_dd").val(0)
		$("#exp_owner_div").hide()
		$("#exp_staff_div").hide()
		$(".exp_type_btn").removeClass('active');
		
		break;
		
	}
});
$("#exp_level2_dd").change(function() {
	parentid=$('#exp_level2_dd').find(":selected").val();
	if(parentid==0){
		$("#exp_level3_dd").find('option').remove();
		$('#exp_level1_dd').focus();
	}else{
	populateexpenceslist(parentid,3);
	}
	switch(parseInt(parentid)){
	case 28:
	
	break;	
		
	}
});
$("#exp_level3_dd").change(function() {
	parentid=$('#exp_level3_dd').find(":selected").val();
	if(parentid==0){
		$('#exp_level2_dd').focus();
	}else{
	
	}

});
//// change the cash report type 
$("#safereptyp_dd").change(function() {
selectedtreptype=$('#safereptyp_dd').find(":selected").val();
if(parseInt(selectedtreptype)==3){
	$("#datediv").show()
}else{
	$("#datediv").hide()
}
});

//// change the sales report type 
$("#salesreptyp_dd").change(function() {
selectedtreptype=$('#salesreptyp_dd').find(":selected").val();
if(parseInt(selectedtreptype)==3){
	$("#salesdatediv").show()
}else{
	$("#salesdatediv").hide()
}
});
/// change the sales items sales report period
$("#salesitmsreptyp_dd").change(function() {
selectedtreptype=$('#salesitmsreptyp_dd').find(":selected").val();
if(parseInt(selectedtreptype)==3){
	$("#salesitmsdatediv").show()
}else{
	$("#salesitmsdatediv").hide()
}
});

/// change the purch items sales report period
$("#purchitmsreptyp_dd").change(function() {
selectedtreptype=$('#purchitmsreptyp_dd').find(":selected").val();
if(parseInt(selectedtreptype)==3){
	$("#purchitmsdatediv").show()
}else{
	$("#purchitmsdatediv").hide()
}
});

/// click on show cash movment button
$("#showsafemovrep").click(function() {
	var selectedopt=$("#safereptyp_dd").find(":selected").val();
	if(parseInt(selectedopt)==0){
		getcashmovementsinrep(frmtdatetimesql(1),frmtdatetimesql(1))
	}else if (parseInt(selectedopt)==1){
		today=frmtdatetimesql(1);
		todayobj=new Date(today)
		nodays=parseInt(parseInt(todayobj.getDate())-1)
		firstdayinthismonth=addsubsdaysfromdate(today,0,nodays)
		//alert(firstdayinthismonth)
		getcashmovementsinrep(firstdayinthismonth,today)
	}else if (parseInt(selectedopt)==2){
		
	}else if (parseInt(selectedopt)==3){
		fromdat=$("#cashrepfrom_datepick").val()
		todat=$("#cashrepto_datepick").val()
		if(fromdat==""){alert("يجب اختيار تاريخ بداية التقرير");return false}
		if(todat==""){alert("يجب اختيار تاريخ نهاية التقرير");return false}
		getcashmovementsinrep(fromdat,todat)
	}else if (parseInt(selectedopt)==4){
		fromdat='2014/01/01'
		todat=frmtdatetimesql(1)
		
		getcashmovementsinrep(fromdat,todat)

		}//// end of if case 4
	$("#cashbalance").html((parseFloat($("#incashtotal").html())-parseFloat($("#outcashtotal").html())).toFixed(2))
	$("#balanceindat").html("رصيد الخزينة في  :  " + frmtdatetimesql(1))
	
});//// end of onclikc


////// print cash report
$('#printsafemovrep').click(function() {	
printcontent=$('#safemovtblreport').html()
spcificss=""
printreport("تقرير حركة الخزينة",printcontent,spcificss)
});


///////////////////// sales reports

/// click on show sales report button
$("#showsalesrep").click(function() {
	var selectedopt=$("#salesreptyp_dd").find(":selected").val();
	if(parseInt(selectedopt)==0){
		//// call get sales report for tday
		getsalesreport(frmtdatetimesql(1),frmtdatetimesql(1))
	
	}else if (parseInt(selectedopt)==1){
		//// get today date //
		today=frmtdatetimesql(1);
		todayobj=new Date(today)
		/// get number of days to the first day of the month
		nodays=parseInt(parseInt(todayobj.getDate())-1)
		///// set the first day of the month
		firstdayinthismonth=addsubsdaysfromdate(today,0,nodays)
		//alert(firstdayinthismonth)
		///// get the report from the first day of the current month to today
		getsalesreport(firstdayinthismonth,today)
	}else if (parseInt(selectedopt)==2){/// no option with value 2 
		
	}else if (parseInt(selectedopt)==3){//// for selecting specific period
		fromdat=$("#salesrepfrom_datepick").val()
		todat=$("#salesrepto_datepick").val()
		if(fromdat==""){alert("يجب اختيار تاريخ بداية التقرير");return false}
		if(todat==""){alert("يجب اختيار تاريخ نهاية التقرير");return false}
		getsalesreport(fromdat,todat)
	}else if (parseInt(selectedopt)==4){/// get all sales from the firsd day of the year to today
		fromdat='2014/01/01'
		todat=frmtdatetimesql(1)
		
		getsalesreport(fromdat,todat)

		}//// end of if case 4
			
});//// end of onclikc sales report



////// print sales report
$('#printsalesrep').click(function() {	
printcontent=$('#salestblreport').html()
spcificss=""
printreport("تقرير المبيعات",printcontent,spcificss)
});

///// show customer balance report
$("#showcustrep").click(function() {
var selectedopt=$("#cust_dd").find(":selected").val();
if(parseInt(selectedopt)==0){
	alert("يرجى اختيار العميل")
}else{
	repdatefrom=$("#custrepfrom_datepick").val()
	repdateto=$("#custrepto_datepick").val()
	if(repdatefrom=="" || repdateto==""){alert("يجب اختيار تاريخ");return false}
	getprofbalance(selectedopt,repdatefrom,repdateto,$("#profaccmovs"),$("#custbalreportfrom"),$("#custbalreportto"),$("#custprevbalance"),$("#custprevdate"),$("#profbalancetotal"),$("#balancedesc"))
	var selectedopt=$("#cust_dd").find(":selected").val();
var profname=$("#cust_dd").find(":selected").text();
$("#balprofname").html(profname)
$("#balprofid").html(selectedopt)
	
}
})
/////print customer balance report
$('#printcustrep').click(function() {	
printcontent=$('#cust_balance_rep').html()
spcificss=""
printreport("كشف حساب",printcontent,spcificss)
});
///// change customer dd in customer balance
$("#cust_dd").change(function() {
var selectedopt=$("#cust_dd").find(":selected").val();
var profname=$("#cust_dd").find(":selected").text();
$("#balprofname").html(profname)
$("#balprofid").html(selectedopt)
$("#profaccmovs").find('div.righttblrow').remove();
document.custaccsub=0
	document.custaccadd=0
	document.custbalance=0
	document.custprevcashbalance=0
$("#profbalancetotal").html(document.custbalance)
$("#balancedesc").html("")
})

///////// owners balance report control/////
///// show owners balance report
$("#showownersrep").click(function() {
var selectedopt=$("#owners_dd").find(":selected").val();
if(parseInt(selectedopt)==0){
	alert("يرجى اختيار الشريك")
}else{
	repdatefrom=$("#ownersrepfrom_datepick").val()
	repdateto=$("#ownersrepto_datepick").val()
	if(repdatefrom=="" || repdateto==""){alert("يجب اختيار تاريخ");return false}
	getprofbalance(selectedopt,repdatefrom,repdateto,$("#ownersprofaccmovs"),$("#ownersbalreportfrom"),$("#ownersbalreportto"),$("#ownprevbalance"),$("#ownprevdate"),$("#ownprofbalancetotal"),$("#ownbalancedesc"))
	var selectedopt=$("#owners_dd").find(":selected").val();
var profname=$("#owners_dd").find(":selected").text();
$("#ownersbalprofname").html(profname)
$("#ownersbalprofid").html(selectedopt)
}
})

///// change owners dd in customer balance
$("#owners_dd").change(function() {
var selectedopt=$("#owners_dd").find(":selected").val();
var profname=$("#owners_dd").find(":selected").text();
$("#ownersbalprofname").html(profname)
$("#ownersbalprofid").html(selectedopt)
$("#ownersprofaccmovs").find('div.righttblrow').remove();
document.custaccsub=0
	document.custaccadd=0
	document.custbalance=0
	document.custprevcashbalance=0
$("#ownprofbalancetotal").html(document.custbalance)
$("#ownbalancedesc").html("")
})

/////print owners balance report
$('#printownrep').click(function() {	
printcontent=$('#owners_balance_rep').html()
spcificss=""
printreport("كشف حساب",printcontent,spcificss)
});
/////////

///////// Staff balance report control/////
///// show staff balance report
$("#showstaffrep").click(function() {
var selectedopt=$("#staff_dd").find(":selected").val();
if(parseInt(selectedopt)==0){
	alert("يرجى اختيار الموظف")
}else{
	repdatefrom=$("#staffrepfrom_datepick").val()
	repdateto=$("#staffrepto_datepick").val()
	if(repdatefrom=="" || repdateto==""){alert("يجب اختيار تاريخ");return false}
	getprofbalance(selectedopt,repdatefrom,repdateto,$("#staffprofaccmovs"),$("#staffbalreportfrom"),$("#staffbalreportto"),$("#staffprevbalance"),$("#staffprevdate"),$("#staffprofbalancetotal"),$("#staffbalancedesc"))
	var selectedopt=$("#staff_dd").find(":selected").val();
var profname=$("#staff_dd").find(":selected").text();
$("#staffbalprofname").html(profname)
$("#staffbalprofid").html(selectedopt)
}
})

///// change staff dd in customer balance
$("#staff_dd").change(function() {
var selectedopt=$("#staff_dd").find(":selected").val();
var profname=$("#staff_dd").find(":selected").text();
$("#staffbalprofname").html(profname)
$("#staffbalprofid").html(selectedopt)
$("#staffprofaccmovs").find('div.righttblrow').remove();
document.custaccsub=0
	document.custaccadd=0
	document.custbalance=0
	document.custprevcashbalance=0
$("#staffprofbalancetotal").html(document.custbalance)
$("#staffbalancedesc").html("")
})

/////print owners balance report
$('#printstaffrep').click(function() {	
printcontent=$('#staff_balance_rep').html()
spcificss=""
printreport("كشف حساب",printcontent,spcificss)
});
/////////
$(document).on('click','div.item',function(){

});

/////////////////////////////////////END ADD EXP SUB SCREEN/////////////////////////////////

///////////////////////////////////// EXP SUB SCREEN/////////////////////////////////

/////accounting profile data ////


$(document).on('click','#showprofdata_btn',function(){

var profid=parseInt($("#staffpartners_dd").find(":selected").val())
var profdata=show_updateprofiledata(1,profid,0,0,0,0,0,0,0,0)
$('#editprofdiv').show()
$('#profname').val(profdata[0].profname)
$('#profmob').val(profdata[0].profmob)
$('#profmob2').val(profdata[0].profmob2)
$('#profemail').val(profdata[0].profemail)
$('#profaddress').val(profdata[0].profaddress)
$('#profjob').val(profdata[0].profjob)
$('#profphone').val(profdata[0].profphone)
$('#profnotes').val(profdata[0].profnotes)

});
////
$(document).on('click','#updateprof_btn',function(){
///set variables
var profname=$('#profname')
var profmob=$('#profmob')
var profmob2=$('#profmob2')
var profemail=$('#profemail')
var profaddress=$('#profaddress')
var profjob=$('#profjob')
var profphone=$('#profphone')
var profnotes=$('#profnotes')

////verify inputs
////name
if(profname.val()=="" || profname.val().length<4){alert("يرجى ادخال الاسم الكامل");profname.focus();return false}
if(profmob.val()=="" || profmob.val().length<8){alert("يرجى ادخال رقم الموبايل");profmob.focus();return false}
if(profjob.val()=="" || profjob.val().length<4){alert("يرجى ادخال الوظيفة");profjob.focus();return false}

var profid=parseInt($("#staffpartners_dd").find(":selected").val())
///
var profdata=show_updateprofiledata(2,profid,profname.val(),profmob.val(),profmob2.val(),profemail.val(),profaddress.val(),profjob.val(),profphone.val(),profnotes.val())
});
////
////add new staff member btn
$(document).on('click','#addupdateprof_btn',function(){
///set variables
var profname=$('#addprofname')
var profmob=$('#addprofmob')
var profmob2=$('#addprofmob2')
var profemail=$('#addprofemail')
var profaddress=$('#addprofaddress')
var profjob=$('#addprofjob')
var profphone=$('#addprofphone')
var profnotes=$('#addprofnotes')

var regdat=frmtdatetimesql(1)
var expdat=addsubsdaysfromdate(regdat,1,400)/// 400 days from registration date
console.log(expdat)

var usernameprof=$('#addprofusername')
var pswprof=$('#addprofpsw')
var proftype=3 ///`type` (1 system admin, 2 partner/manager , 3 staff member, 4 client/customer, 5 virtual prof for system use)
var iscashier=0
var UserName="0"
var UserPSW="0"
if($("input[name='cashierrb']:checked").val()==1){
	iscashier=1
UserName=usernameprof.val()
UserPSW=pswprof.val()
}
////verify inputs
////name
if(profname.val()=="" || profname.val().length<4){alert("يرجى ادخال الاسم الكامل");profname.focus();return false}
if(profmob.val()=="" || profmob.val().length<8){alert("يرجى ادخال رقم الموبايل");profmob.focus();return false}
if(profjob.val()=="" || profjob.val().length<4){alert("يرجى ادخال الوظيفة");profjob.focus();return false}
if(iscashier && (usernameprof.val()=="" || pswprof.val()=="")){alert("يرجى ادخال اسم مستخدم وكلمة سر (حساب دخول للكاشير)");usernameprof.focus();return false}

if(iscashier && (usernameprof.val().length < 4 || pswprof.val().length < 4)){alert("يجب ان يكون اسم المستخدم وكلمة السر اكثر من 4 حروف او ارقام");usernameprof.focus();return false}
//////send the information to php for saving 
///consider if the user is not cashier assign prof to guest user in php
var staffdata=iscashier+"~"+profname.val()+"~"+profmob.val()+"~"+profmob2.val()+"~"+profemail.val()+"~"+profaddress.val()+"~"+profjob.val()+"~"+proftype+"~"+profphone.val()+"~"+profnotes.val()+"~"+UserName+"~"+UserPSW+"~"+regdat+"~"+expdat

$.ajaxSetup({async:false});
$.post("php/acc_func.php",{param:'24~'+staffdata},function(server_response) {
	if(server_response=="succeded"){
		alert("تم تسجيل الموظف الجديد")
		return true;
		///clear the inputs
		$("#addprofdiv").find(".iniResettxt").val("")
	}else{
		alert("حدث مشكلة اثناء التسجيل")
		return false;
	}
});//end of post

});
////

});//// end of document ready

/////////////////////////// ALL ACC FUNCTIONS ///////////////////////////////////////////////
////function to return inv search results
//parameters : searchtype = 1 all today invoices , 2 all current month inv, 3 specific invoice number, 4 sepcific order number
/// startdat,enddat,inv-order number
function invsearchfnc(searchtype,startdat,enddat,invorderno){
	switch(searchtype){
		case 1:
		var data=searchtype+'~'+startdat+'~'+enddat
	$.ajaxSetup({async:false});
$.post("php/acc_func.php",{param:'19~'+data},function(server_response) {
					document.invsearchres=$.parseJSON(server_response)
					drowinvsearch(document.invsearchres)
});
		break;
		case 2:
		var data=searchtype+'~'+startdat+'~'+enddat
	$.ajaxSetup({async:false});
$.post("php/acc_func.php",{param:'19~'+data},function(server_response) {
					document.invsearchres=$.parseJSON(server_response)
					drowinvsearch(document.invsearchres)
});
		break;
		case 3:
		var data=searchtype+'~'+invorderno
	$.ajaxSetup({async:false});
$.post("php/acc_func.php",{param:'19~'+data},function(server_response) {
					document.invsearchres=$.parseJSON(server_response)
					drowinvsearch(document.invsearchres)
});
		break;
		case 4:
		var data=searchtype+'~'+invorderno
	$.ajaxSetup({async:false});
$.post("php/acc_func.php",{param:'19~'+data},function(server_response) {
					document.invsearchres=$.parseJSON(server_response)
					drowinvsearch(document.invsearchres)
});
		break;
	}
};///end of inv search function

function populateprofilylists(allprofiles,type1,type2,type3){
	//	CALL `populate_profile_lists` ( 0, 2, 3, 0 )
	document.retprofdata=0
	var profdata=allprofiles+'~'+type1+'~'+type2+'~'+type3
	$.ajaxSetup({async:false});
	
$.post("php/acc_func.php",{param:'2~'+profdata},function(server_response) {
					document.retprofdata=$.parseJSON(server_response)
});
////returned properties : "id", "name", "mobile"
return document.retprofdata
}
//////function to populate dropdown list for partners and staff
function populatestaffpartnersdd(ddlistobj){
	var staffpartners=populateprofilylists(0,3,2,0) 
	   ddlistobj.find('option').remove();
	//ddlistobj.append(' <option value="0">الخزينة</option>');
for(var i = 0; i < staffpartners.length; i++){
ddlistobj.append('<option data-mobile="'+staffpartners[i].mobile+'" value='+staffpartners[i].id+'>'+staffpartners[i].name+'</option>');
}
}

////function to show/update profile data option:1- show data, 2- update data
function show_updateprofiledata(option,profid,profname,profmob,profmob2,profemail,profaddress,profjob,profphone,profnotes){
	var profiledata
	switch(parseInt(option)){
		case 1://showdata
		//$param[1]: 1 get profile data , 2 update profile data ---//$param[2]: profile id, 
	//in case param1=2 => $param[3]:fullname,$param[4]`mobile`,$param[5]`mobile2`,$param[6]`email`,$param[7]`address`,$param[8]`jobtitle`,$param[9]`phone`,$param[10]`notes`
	var profdata=option+'~'+profid
	$.ajaxSetup({async:false});
	
$.post("php/acc_func.php",{param:'23~'+profdata},function(server_response) {
					profiledata=$.parseJSON(server_response)
});
////returned properties : "id", "name", "mobile"
return profiledata
	
		break;
		case 2://update profile data
		
		var profdata=option+'~'+profid+'~'+profname+'~'+profmob+'~'+profmob2+'~'+profemail+'~'+profaddress+'~'+profjob+'~'+profphone+'~'+profnotes
	$.ajaxSetup({async:false});
	
$.post("php/acc_func.php",{param:'23~'+profdata},function(server_response) {
					updatedrows=server_response
					if(updatedrows==true){alert("تم تحديث البيانات");}else{alert("حدث مشكلة اثناء تحديث البيانات");}
});
		
		break;
		
	}//end switch
}
/////
//////////////////get profile balance report function///
function getprofbalance(profid,fromdat,todate,rowscont,repheadfromdatcont,repheadtodatcont,prevbalancecont,prevdatcont,balancetotcont,balancedesccont){
//// initialize the table
	rowscont.find('div.righttblrow').remove();
	repheadfromdatcont.html(fromdat)
	repheadtodatcont.html(todate)
	
	//$("#cashbalance").html((parseFloat($("#incashtotal").html())-parseFloat($("#outcashtotal").html())).toFixed(2))
	//$("#balanceindat").html("رصيد الخزينة في  :  " + enddate)
	document.custaccsub=0
	document.custaccadd=0
	document.custbalance=0
	document.custprevcashbalance=0
	prevdatestart=addsubsdaysfromdate(fromdat,0,1)
	//$("#cashreportto").html(enddate)
	//$("#cashreportfrom").html(startdat)

//// 1 calculate opening balance for the selected start date
/////////1 profid , 2start date, 3 end date, 4 movtype : 0 all types, 1 added to profile, 2 substracted from account
var rep_calldata= profid+'~'+'2010/01/01'+'~'+prevdatestart+"~0";
$.ajaxSetup({async:false});
$.post("php/acc_func.php",{param:'6~'+rep_calldata},function(server_response) {
expdata = $.parseJSON(server_response);
for(var i = 0; i < expdata.length; i++){
	// "movid" => $row[0], "movtype" => $row[1], "accmovid" => $row[2], "cashval" => $row[3], "dat" => $row[4], "times" => $row[5], "desc"
	if(parseInt(expdata[i].movtype)==1){
	document.custprevcashbalance=(parseFloat(document.custprevcashbalance)+parseFloat(expdata[i].cashval)).toFixed(2)
	
	}else if(parseInt(expdata[i].movtype)==2){
		document.custprevcashbalance=(parseFloat(document.custprevcashbalance)-parseFloat(expdata[i].cashval)).toFixed(2)
	
	}
}
if(expdata.length<1){
document.custprevcashbalance=0
}
});//// end of ajax call
prevbalancecont.html(document.custprevcashbalance)
prevdatcont.html(prevdatestart)
document.custbalance=document.custprevcashbalance
//////2 - append each movement of profile account into the table and calculate the balance

/////////1 profid , 2start date, 3 end date, 4 movtype : 0 all types, 1 added to profile, 2 substracted from account
var rep_calldata= profid+'~'+fromdat+'~'+todate+"~0";
$.ajaxSetup({async:false});
$.post("php/acc_func.php",{param:'6~'+rep_calldata},function(server_response) {
expdata = $.parseJSON(server_response);
for(var i = 0; i < expdata.length; i++){
	// "movid" => $row[0], "movtype" => $row[1], "accmovid" => $row[2], "cashval" => $row[3], "dat" => $row[4], "times" => $row[5], "desc"
	if(parseInt(expdata[i].movtype)==1){
	document.custbalance=(parseFloat(document.custbalance)+parseFloat(expdata[i].cashval)).toFixed(2)

var prfrow="<div class='righttblrow' data-movid='"+expdata[i].movid+"' data-accmovid='"+expdata[i].accmovid+"' data-movtype='"+expdata[i].movtype+"' data-times='"+expdata[i].times+"'><div class='repsubcol01'>"+(i+1)+"</div><div class='repsubcol02'>"+"</div><div class='repsubcol03'>"+expdata[i].cashval+"</div><div class='repsubcol04'>"+document.custbalance+"</div><div class='repsubcol05'>"+expdata[i].desc+"</div><div class='repsubcol06'>"+expdata[i].dat+"</div></div>"
		
	
	}else if(parseInt(expdata[i].movtype)==2){
	document.custbalance=(parseFloat(document.custbalance)-parseFloat(expdata[i].cashval)).toFixed(2)

var prfrow="<div class='righttblrow' data-movid='"+expdata[i].movid+"' data-accmovid='"+expdata[i].accmovid+"' data-movtype='"+expdata[i].movtype+"' data-times='"+expdata[i].times+"'><div class='repsubcol01'>"+(i+1)+"</div><div class='repsubcol02'>"+expdata[i].cashval+"</div><div class='repsubcol03'>"+"</div><div class='repsubcol04'>"+document.custbalance+"</div><div class='repsubcol05'>"+expdata[i].desc+"</div><div class='repsubcol06'>"+expdata[i].dat+"</div></div>"
		}
rowscont.append(prfrow);
}
if(expdata.length<1){
document.custbalance=document.custprevcashbalance
}
});//// end of ajax call


//alert(document.custbalance)
if(parseFloat(document.custbalance)>0){
balancetotcont.html(document.custbalance)
balancedesccont.html("مبلغ مستحق لصاحب الحساب")
}else{
balancetotcont.html(parseFloat(document.custbalance)*(-1))
balancedesccont.html("مبلغ مستحق على صاحب الحساب")
	
}
}
/////////////////// cash report functions ////////////

function getcashmovementsinrep(startdat,enddate){
	
	//// initialize the table
	$("#insafemovs").find('div.righttblrow').remove();
	$("#outsafemovs").find('div.lefttblrow').remove();
	$("#outcashtotal").html("0")
	$("#incashtotal").html("0")
	$("#cashbalance").html((parseFloat($("#incashtotal").html())-parseFloat($("#outcashtotal").html())).toFixed(2))
	$("#balanceindat").html("رصيد الخزينة في  :  " + enddate)
	document.incashsum=0
	document.outcashsum=0
	document.prevcashbalance=0
	prevdatestart=addsubsdaysfromdate(startdat,0,1)
	$("#cashreportto").html(enddate)
	$("#cashreportfrom").html(startdat)
	
	//alert("startdat  "+startdat+"prevstart dat  "+prevdatestart)
/// 1- get and calculate final cash balance before start date
////// get all the added cash in the previous period befor start date from 2010
var rep_calldata='1~'+'2010/01/01'+'~'+prevdatestart;
$.ajaxSetup({async:false});
$.post("php/acc_func.php",{param:'3~'+rep_calldata},function(server_response) {
expdata = $.parseJSON(server_response);
for(var i = 0; i < expdata.length; i++){
	//alert("calc prev "+expdata[i].cashvalue+ "  "+ expdata[i].cashdat) 
document.incashsum=(parseFloat(document.incashsum)+parseFloat(expdata[i].cashvalue)).toFixed(2)
}
if(expdata.length<1){
document.incashsum=0
}
});//// end of ajax call
////// get all the substracted cash in the period and insert into the table
var rep_calldata='2~'+'2010/01/01'+'~'+prevdatestart;
$.ajaxSetup({async:false});
$.post("php/acc_func.php",{param:'3~'+rep_calldata},function(server_response) {
expdata = $.parseJSON(server_response);
for(var i = 0; i < expdata.length; i++){
document.outcashsum=(parseFloat(document.outcashsum)+parseFloat(expdata[i].cashvalue)).toFixed(2)
}
if(expdata.length<1){
}
});//// end of ajax call
//// sum of final previous period balance
document.prevcashbalance=(parseFloat(document.incashsum)-parseFloat(document.outcashsum)).toFixed(2)

/// 2 - add to incash the prev balance as starting balance
var insafemovrow="<div class='righttblrow' data-cashid='"+0+"' data-accmovid='"+0+"' data-movtime='"+0+"'><div class='repsubcol1'>"+0+"</div><div class='repsubcol2'>رصيد مرحل من فترة سابقة حتى </div><div class='repsubcol3'>"+prevdatestart+"</div><div class='repsubcol4'>"+document.prevcashbalance+"</div></div>";
$("#insafemovs").append(insafemovrow);

/// 3- populate the table with movments from start to end dates
////// get the incash from start date to end date
document.incashsum=0
var rep_calldata='1~'+startdat+'~'+enddate;
$.ajaxSetup({async:false});
$.post("php/acc_func.php",{param:'3~'+rep_calldata},function(server_response) {
          	
////"cashid" => $row[0], "accmovid" => $row[1], "cashdat" => $row[2], "cashtime" => $row[3], "cashvalue" => $row[4], "desc" => $row[5]
					expdata = $.parseJSON(server_response);
					for(var i = 0; i < expdata.length; i++){
						document.incashsum=(parseFloat(document.incashsum)+parseFloat(expdata[i].cashvalue)).toFixed(2)
                  	var insafemovrow="<div class='righttblrow' data-cashid='"+expdata[i].cashid+"' data-accmovid='"+expdata[i].accmovid+"' data-movtime='"+expdata[i].cashtime+"'><div class='repsubcol1'>"+(i+1)+"</div><div class='repsubcol2'>"+expdata[i].desc+"</div><div class='repsubcol3'>"+expdata[i].cashdat+"</div><div class='repsubcol4'>"+expdata[i].cashvalue+"</div></div>"
					
					$("#insafemovs").append(insafemovrow);
					}
					if(expdata.length<1){
					var insafemovrow="<div class='righttblrow' data-cashid='"+0+"' data-accmovid='"+0+"' data-movtime='"+0+"'><div class='repsubcol1'>"+0+"</div><div class='repsubcol2'>لايوجد حركة</div><div class='repsubcol3'>"+0+"</div><div class='repsubcol4'>"+0+"</div></div>"
						$("#insafemovs").append(insafemovrow);
					}
					document.incashsum=(parseFloat(document.incashsum)+parseFloat(document.prevcashbalance)).toFixed(2)
					$("#incashtotal").html(document.incashsum)
});//// end of ajax call

////get outcash from start date to end date
document.outcashsum=0
////// get all the substracted cash in the period and insert into the table
var rep_calldata='2~'+startdat+'~'+enddate;
$.ajaxSetup({async:false});
$.post("php/acc_func.php",{param:'3~'+rep_calldata},function(server_response) {
  					expdata = $.parseJSON(server_response);
					for(var i = 0; i < expdata.length; i++){
					document.outcashsum=(parseFloat(document.outcashsum)+parseFloat(expdata[i].cashvalue)).toFixed(2)
                  	var insafemovrow="<div class='lefttblrow' data-cashid='"+expdata[i].cashid+"' data-accmovid='"+expdata[i].accmovid+"' data-movtime='"+expdata[i].cashtime+"'><div class='repsubcol1'>"+(i+1)+"</div><div class='repsubcol2'>"+expdata[i].desc+"</div><div class='repsubcol3'>"+expdata[i].cashdat+"</div><div class='repsubcol4'>"+expdata[i].cashvalue+"</div></div>"
					
					$("#outsafemovs").append(insafemovrow);
					}
					if(expdata.length<1){
					var insafemovrow="<div class='lefttblrow' data-cashid='"+0+"' data-accmovid='"+0+"' data-movtime='"+0+"'><div class='repsubcol1'>"+0+"</div><div class='repsubcol2'>لايوجد حركة</div><div class='repsubcol3'>"+0+"</div><div class='repsubcol4'>"+0+"</div></div>"
						$("#outsafemovs").append(insafemovrow);
					}
					$("#outcashtotal").html(document.outcashsum)
});//// end of ajax call

 $("#cashbalance").html((parseFloat($("#incashtotal").html())-parseFloat($("#outcashtotal").html())).toFixed(2))
		 $("#balanceindat").html("رصيد الخزينة في  :  " + enddate)

}//// end of func

//////get draw invoices search results report
///to draw the invoice search results table
///invresarray is the resulted json array of invoice search results
function drowinvsearch(invresarray){
	
	///check if the results is empty and show no results
	if(invresarray.length<1){
	///clear and hide the results table
	
	$("#invsearchtable").find(".invrestablerow").remove()
	//$("#invsearchtable").hide()
	///show the empgy results div
	$(".emptysearch").show()	
	}else{
	///hide the empty resutls div
	$(".emptysearch").hide()
	///show draw the results table dynamicly
	$("#invsearchtable").show()
	$("#invsearchtable").find(".invrestablerow").remove()
	for(i=0;i<invresarray.length;i++){
		var paidstatus=""
		if(parseInt(invresarray[i].inv_status)>0){
			paidstatus="مدفوعة"
		}else{
			paidstatus="غير مدفوعة"
		}
		var invsearchresrow="<div class='invrestablerow searchresultsrows'><div class='searchres_col1 searchrescol'>"+parseInt(i+1)+"</div><div class='searchres_col2 searchrescol'>"+invresarray[i].inv_id+"</div><div class='searchres_col3 searchrescol'>"+invresarray[i].inv_orderno+"</div><div class='searchres_col4 searchrescol'>"+invresarray[i].inv_dat+"</div><div class='searchres_col5 searchrescol'>"+ parseFloat(invresarray[i].inv_gtotal).toFixed(2)+"</div><div class='searchres_col6 searchrescol'>"+invresarray[i].inv_subinvcount+"</div><div class='searchres_col8 searchrescol'>"+paidstatus+"</div><div class='searchres_col7 searchrescol'><a class='resshowitm' data-clickid='"+i+"' data-invno='"+invresarray[i].inv_id+"'>عرض</a></div></div>"
		
		$("#invsearchtable").append(invsearchresrow);
	}///end for loop
	
	}//end if there is results

}//end function
///////
///////print invoices in dialoge popup
function PrintElems(elem,specific_css)
    {
        Popup1($(elem).html(),specific_css);
    }

    function Popup1(data,specific_css) 
    {
        var mywindowprint = window.open('', '', 'height=400,width=600');
        mywindowprint.document.write('<html><head><title>فاتورة</title>');
		//alert(mywindowprint)
        /*optional stylesheet*/ //
		mywindowprint.document.write('<link rel="stylesheet" type="text/css" href="css/accprintsearchinv.css" />');
		//mywindow.document.write(' <link rel="stylesheet" type="text/css" href="css/invprint.css" />');
       // mywindow.document.styleSheets="css/invprint.css"
		//mywindowprint.document.write(specific_css);
		mywindowprint.document.write('<style>.button{display:none;}</style>');
		mywindowprint.document.write('</head><body>');
        mywindowprint.document.write(data);
        mywindowprint.document.write('</body></html>');
       //setTimeout(mywindowprint.print(),5000);
	   //setTimeout(mywindowprint.close(),8000);
	    mywindowprint.print();
		//document.inv_obj.printed= 1;
		
       // return true;
    }

////function to show the selected invoice and sub invoices from inv search results
function show_inv_sub(invoiceNo){
	var maininvdata=""
	var minvitems=""
	var subinvarraydata=""
	var title="تفاصيل الفاتورة رقم : "+invoiceNo
	var txtmsg=""
	////get the main invoice data and draw it
	var data=3+'~'+invoiceNo
	$.ajaxSetup({async:false});
$.post("php/acc_func.php",{param:'19~'+data},function(server_response) {
					maininvdata=$.parseJSON(server_response)
					
});///end of ajax
inv_data="6~"+invoiceNo
$.ajaxSetup({async:false});
$.post("php/cashier_func.php",{param:inv_data},function(server_response) {
 minvitems = $.parseJSON(server_response);

})//end of ajax

//// draw the main invoice
for(oq=0;oq<maininvdata.length;oq++){
		///initialize vars
		var invhead="",itmsrow="",invfoot="",btns=""
		invhead="<div class='table-sub-invoice unpaidinv-cont maininv' data-arrobjid='"+oq+"' data-invtype='maininv'><div class='inv_data_row'> اوردر رقم :  <div class='inlinediv' data-ordersubid='223-1'>"+maininvdata[oq].inv_orderno+"</div></div><div class='inv_data_row'> فاتورة رقم :  <div class='inlinediv' data-invid='223-1'>"+maininvdata[oq].inv_id+"</div></div><div class='inv_data_row'> تاريخ :  <div class='inlinediv' data-orddat='"+maininvdata[oq].inv_dattime+"'>"+maininvdata[oq].inv_dattime+"</div></div><div class='inv_data_row'> اسم العميل :  <div class='inlinediv' data-custname='"+maininvdata[oq].inv_custname+"' data-custprofid='"+0+"'>"+maininvdata[oq].inv_custname+"</div></div><div class='inv_data_row'> كاشير رقم :  <div class='inlinediv' data-cashuserid='"+maininvdata[oq].inv_cashier_id+"' data-cashusername='noone'>"+maininvdata[oq].inv_cashier_id+"</div></div><div class='inv_table'><div class='inv_tbl_head'><div class='inv_name_col inv_row_col'>اسم الصنف</div><div class='inv_unitpr_col inv_row_col'>سعر الوحدة</div><div class='inv_qunt_col inv_row_col'>الكمية</div><div class='inv_cost_col inv_row_col'>الاجمالي</div><div class='inv_controls_col inv_row_col' style='display:none;'>حذف </div></div>"
		
		for(ais=0;ais<minvitems.length;ais++){////for looping invoice items
			
			itmsrow+="<div class='inv_tbl_datarows subinvitemsrows'><div class='inv_tbl_datarows subinvitemrow' data-itmid='"+minvitems[ais].inv_itm_id+"' data-subinv_arrid='"+ais+"' data-itmqnty='"+minvitems[ais].inv_itm_qnty+"' data-itmunprice='"+minvitems[ais].inv_itm_unit_price+"' data-itmtot='"+minvitems[ais].inv_itm_sum+"'><div class='inv_name_col inv_row_col'>"+minvitems[ais].inv_itm_name+"</div><div class='inv_unitpr_col inv_row_col'>"+minvitems[ais].inv_itm_unit_price+"</div><div class='inv_qunt_col inv_row_col'>"+minvitems[ais].inv_itm_qnty+"</div><div class='inv_cost_col inv_row_col'>"+minvitems[ais].inv_itm_sum+"</div><div class='inv_controls_col inv_row_col removesubinvitem' style='display:none;' data-itmid='93' data-subinv_arrid='0' data-itmqnty='2' data-itmunprice='5' data-itmtot='10'><img data-arrid='0' align='middle' class='ingr_remove' src='images/del24.png' style='display:none;'></div></div></div><!-----end of inv_table-->"
			
		}
		invfoot="<div id='taxrow' class='inv_tbl_datarows'><div class='inv_name_col inv_row_col'>الضريبة</div><div class='inv_unitpr_col inv_row_col'>10%</div><div class='inv_qunt_col inv_row_col'></div><div class='inv_cost_col inv_row_col'>"+parseFloat(maininvdata[oq].inv_tax).toFixed(2)+"</div><div class='inv_controls_col inv_row_col'></div></div><div class='inv_tbl_datarows servrow'><div class='inv_name_col inv_row_col'>الخدمة</div><div class='inv_unitpr_col inv_row_col'>12%</div><div class='inv_qunt_col inv_row_col'></div><div class='inv_cost_col inv_row_col'>"+parseFloat(maininvdata[oq].inv_service).toFixed(2)+"</div><div class='inv_controls_col inv_row_col'></div></div><div class='inv_tbl_datarows discrow'><div class='inv_name_col inv_row_col'>الخصم</div><div class='inv_unitpr_col inv_row_col'><div data-valpers='pers' style='display:none;' data-discinv='subinv' class='adddisc button'>%</div></div><div class='inv_qunt_col inv_row_col'><div data-valpers='val' style='display:none;' data-discinv='sub' class='adddisc button'>خصم</div></div><div class='inv_cost_col inv_row_col'>"+parseFloat(maininvdata[oq].inv_discount).toFixed(2)+"</div><div class='inv_controls_col inv_row_col'></div></div><div class='inv_tbl_datarows gtotalrow'><div class='inv_name_col inv_row_col'>الاجمالي</div><div class='inv_unitpr_col inv_row_col'></div><div class='inv_qunt_col inv_row_col'></div><div class='inv_cost_col inv_row_col'>"+parseFloat(maininvdata[oq].inv_gtotal).toFixed(2)+"</div><div class='inv_controls_col inv_row_col'></div></div>"

 btns="<div class='subinvbtns'><div data-clickedbtn='"+oq+"' class='button button-caution paysubbtns payunpinv' data-btntype='paynow' style='display: none;'>دفع</div><div class='button button-action paysubbtns paylatersubinv' data-btntype='paylater' style='display: none;'>دفع آجل</div><div class='button paysubbtns printunpinv button-primary' data-clickedbtn='"+oq+"' data-btntype='print' data-invtype='maininv'>طباعة</div></div></div><!-----end of invoice tbl--></div>"
		txtmsg+="<div class='searchmaininv' data-arrobjid='"+oq+"' style='text-align:center;'>"+invhead+itmsrow+invfoot+btns+"</div>"
	}//end main for
/////////


	////get the sub invoices by looping and draw each
	var subinvoicescount= parseInt(maininvdata[0].inv_subinvcount)
	//invoiceNo
	////get the sub invoices data of inv number invoiceNo and draw it
	var data=invoiceNo
	var subinvarr
	$.ajaxSetup({async:false});
$.post("php/acc_func.php",{param:'20~'+data},function(server_response) {
					subinvarr=$.parseJSON(server_response)		
});///end of ajax
	for(subin=0;subin<subinvarr.length;subin++){///sub invoices loop
		var invhead="",itmsrow="",invfoot="",btns=""
		invhead="<div class='table-sub-invoice unpaidinv-cont maininv' data-invtype='subinv' data-arrobjid='"+subin+"' data-subinvid='"+subinvarr[subin].subinv_id+"'><div class='inv_data_row'> اوردر رقم :  <div class='inlinediv' data-ordersubid='223-1'>"+maininvdata[0].inv_orderno+"-"+subinvarr[subin].subinv_no+"</div></div><div class='inv_data_row'> فاتورة رقم :  <div class='inlinediv' data-invid='223-1'>"+maininvdata[0].inv_id+"-"+subinvarr[subin].subinv_no+"</div></div><div class='inv_data_row'> تاريخ :  <div class='inlinediv' data-orddat='"+subinvarr[subin].inv_dattime+"'>"+subinvarr[subin].inv_dattime+"</div></div><div class='inv_data_row'> اسم العميل :  <div class='inlinediv' data-custname='"+subinvarr[subin].cust_name+"' data-custprofid='"+0+"'>"+subinvarr[subin].cust_name+"</div></div><div class='inv_data_row'> كاشير رقم :  <div class='inlinediv' data-cashuserid='"+subinvarr[subin].cash_id+"' data-cashusername='noone'>"+subinvarr[subin].cash_id+"</div></div><div class='inv_table'><div class='inv_tbl_head'><div class='inv_name_col inv_row_col'>اسم الصنف</div><div class='inv_unitpr_col inv_row_col'>سعر الوحدة</div><div class='inv_qunt_col inv_row_col'>الكمية</div><div class='inv_cost_col inv_row_col'>الاجمالي</div><div class='inv_controls_col inv_row_col' style='display:none;'>حذف </div></div>"
		
		///loop for sub invoice items
		var subinvdataitems=$.parseJSON(subinvarr[subin].subinv_items)
		var numberofsubinvitems=subinvdataitems.items.length
		for(subinitm=0;subinitm< numberofsubinvitems;subinitm++){////for looping invoice items
			
			itmsrow+="<div class='inv_tbl_datarows subinvitemsrows'><div class='inv_tbl_datarows subinvitemrow' data-itmid='"+subinvdataitems.items[subinitm].itmid+"' data-subinv_arrid='"+subinitm+"' data-itmqnty='"+subinvdataitems.items[subinitm].itm_qnty+"' data-itmunprice='"+subinvdataitems.items[subinitm].itm_price+"' data-itmtot='"+subinvdataitems.items[subinitm].itm_total+"'><div class='inv_name_col inv_row_col'>"+subinvdataitems.items[subinitm].itm_lname+"</div><div class='inv_unitpr_col inv_row_col'>"+subinvdataitems.items[subinitm].itm_price+"</div><div class='inv_qunt_col inv_row_col'>"+subinvdataitems.items[subinitm].itm_qnty+"</div><div class='inv_cost_col inv_row_col'>"+subinvdataitems.items[subinitm].itm_total+"</div><div class='inv_controls_col inv_row_col removesubinvitem' style='display:none;' data-itmid='93' data-subinv_arrid='0' data-itmqnty='2' data-itmunprice='5' data-itmtot='10'><img data-arrid='0' align='middle' class='ingr_remove' src='images/del24.png' style='display:none;'></div></div></div><!-----end of inv_table-->"
		}//end of looping sub invoice items
		///subinvoice tax service and gtotal and buttons
		invfoot="<div id='taxrow' class='inv_tbl_datarows'><div class='inv_name_col inv_row_col'>الضريبة</div><div class='inv_unitpr_col inv_row_col'>10%</div><div class='inv_qunt_col inv_row_col'></div><div class='inv_cost_col inv_row_col'>"+parseFloat(subinvdataitems.tax).toFixed(2)+"</div><div class='inv_controls_col inv_row_col'></div></div><div class='inv_tbl_datarows servrow'><div class='inv_name_col inv_row_col'>الخدمة</div><div class='inv_unitpr_col inv_row_col'>12%</div><div class='inv_qunt_col inv_row_col'></div><div class='inv_cost_col inv_row_col'>"+parseFloat(subinvdataitems.service).toFixed(2)+"</div><div class='inv_controls_col inv_row_col'></div></div><div class='inv_tbl_datarows discrow'><div class='inv_name_col inv_row_col'>الخصم</div><div class='inv_unitpr_col inv_row_col'><div data-valpers='pers' style='display:none;' data-discinv='subinv' class='adddisc button'>%</div></div><div class='inv_qunt_col inv_row_col'><div data-valpers='val' style='display:none;' data-discinv='sub' class='adddisc button'>خصم</div></div><div class='inv_cost_col inv_row_col'>"+parseFloat(subinvdataitems.discount).toFixed(2)+"</div><div class='inv_controls_col inv_row_col'></div></div><div class='inv_tbl_datarows gtotalrow'><div class='inv_name_col inv_row_col'>الاجمالي</div><div class='inv_unitpr_col inv_row_col'></div><div class='inv_qunt_col inv_row_col'></div><div class='inv_cost_col inv_row_col'>"+parseFloat(subinvdataitems.gtotal).toFixed(2)+"</div><div class='inv_controls_col inv_row_col'></div></div>"

 btns="<div class='subinvbtns'><div data-clickedbtn='"+subin+"' class='button button-caution paysubbtns payunpinv' data-btntype='paynow' style='display: none;'>دفع</div><div class='button button-action paysubbtns paylatersubinv' data-btntype='paylater' style='display: none;'>دفع آجل</div><div class='button paysubbtns printunpinv button-primary' data-clickedbtn='"+subin+"' data-subinvid='"+subinvarr[subin].subinv_id+"' data-btntype='print' data-invtype='subinv'>طباعة</div></div></div><!-----end of invoice tbl--></div>"
		txtmsg+="<div class='searchmaininv' data-subinvid='"+subinvarr[subin].subinv_id+"' data-arrobjid='"+subin+"' style='text-align:center;'>"+invhead+itmsrow+invfoot+btns+"</div>"
		
	}//end of looping sub invoices
	
	
	$myDialog2=$("<div style='padding:10px;overflow:auto;'>"+txtmsg+"</div>");
	$myDialog2.dialog({
	  appendTo: "#acc_viewinvoices-container",
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
		 $("#acc_viewinvoices-container").find(".ui-dialog").remove()
        }
      }
    });/// end of dialog	
}///end func

/////////////// sales report function
function getsalesreport(startdat,enddate){
	//// initialize the table
	$("#salesreprows").find('div.righttblrow').remove();
	$("#varincomerows").find('div.lefttblrow').remove();
	
	$("#varincometot").html("0")
	$("#paidsalestot").html("0")
	$("#unpaidsalestot").html("0")
	$("#salestot").html((parseFloat($("#paidsalestot").html())+parseFloat($("#unpaidsalestot").html())).toFixed(2))
	$("#grandsalestot").html((parseFloat($("#salestot").html())+parseFloat($("#varincometot").html())).toFixed(2))
	$("#salesbalancedat").html("اجمالي المبيعات والايرادات المتنوعة في  :  " + enddate)
	document.paidsalestot=0
	document.unpaidsalestot=0
	document.varincometot=0
	document.salestot=0
	document.prevcashbalance=0
	document.grandsalestot=0
	/// the day before start day
	prevdatestart=addsubsdaysfromdate(startdat,0,1)
	$("#salesreportfrom").html(startdat)
	$("#salesreportto").html(enddate)
	
//// ajax call for sales 
var rep_calldata='2~'+startdat+'~'+enddate;// all paid and unpaid sales parameter 1=2
$.ajaxSetup({async:false});
$.post("php/acc_func.php",{param:'4~'+rep_calldata},function(server_response) {
expdata = $.parseJSON(server_response);
for(var i = 0; i < expdata.length; i++){
	//"salesid" , "accmovid" , "invid" , "sales_value" , "dat" , "desc" , "paidstatus"  
	if(expdata[i].paidstatus==1){
		document.paidsalestot=(parseFloat(document.paidsalestot)+parseFloat(expdata[i].sales_value)).toFixed(2)
		var salesrow="<div class='righttblrow' data-salesid='"+expdata[i].salesid+"' data-accmovid='"+expdata[i].accmovid+"' data-invid='"+expdata[i].invid+"'><div class='repsubcol1'>"+(i+1)+"</div><div class='repsubcol2'>"+expdata[i].desc+"</div><div class='repsubcol3'>"+expdata[i].dat+"</div><div class='repsubcol4'>"+expdata[i].sales_value+"</div></div>"
		
	}else{
		document.unpaidsalestot=(parseFloat(document.unpaidsalestot)+parseFloat(expdata[i].sales_value)).toFixed(2)
		var salesrow="<div class='righttblrow unpaidrow' data-paidstatus='"+expdata[i].paidstatus+"' data-salesid='"+expdata[i].salesid+"' data-accmovid='"+expdata[i].accmovid+"' data-invid='"+expdata[i].invid+"'><div class='repsubcol1'>"+(i+1)+"</div><div class='repsubcol2'>"+expdata[i].desc+"</div><div class='repsubcol3'>"+expdata[i].dat+"</div><div class='repsubcol4'>"+expdata[i].sales_value+"</div></div>"
	}
$("#salesreprows").append(salesrow);


}///end of for loop

if(expdata.length<1){
var salesrow="<div class='righttblrow'><div class='repsubcol1'>"+(i+1)+"</div><div class='repsubcol2'>لا توجد مبيعات</div><div class='repsubcol3'>0</div><div class='repsubcol4'>0</div></div>"
$("#salesreprows").append(salesrow);
}///end if

document.salestot=(parseFloat(document.paidsalestot)+parseFloat(document.unpaidsalestot)).toFixed(2)
$("#paidsalestot").html(document.paidsalestot)
$("#unpaidsalestot").html(document.unpaidsalestot)
$("#salestot").html(document.salestot)

});//// end of ajax call

//// ajax call for  various income
var rep_calldata2=startdat+'~'+enddate;// 
$.ajaxSetup({async:false});
$.post("php/acc_func.php",{param:'5~'+rep_calldata2},function(server_response) {
expdata = $.parseJSON(server_response);
for(var i = 0; i < expdata.length; i++){
	// /////``varid`,`accmovid`,`dat`,`times`,`varval`,`desc`
		document.varincometot=(parseFloat(document.varincometot)+parseFloat(expdata[i].varval)).toFixed(2)
		var varincomerow="<div class='lefttblrow' data-varid='"+expdata[i].varid+"' data-accmovid='"+expdata[i].accmovid+"' data-times='"+expdata[i].times+"'><div class='repsubcol1'>"+(i+1)+"</div><div class='repsubcol2'>"+expdata[i].desc+"</div><div class='repsubcol3'>"+expdata[i].dat+"</div><div class='repsubcol4'>"+expdata[i].varval+"</div></div>"
		
$("#varincomerows").append(varincomerow);
}
if(expdata.length<1){
var varincomerow="<div class='lefttblrow'><div class='repsubcol1'>"+(i+1)+"</div><div class='repsubcol2'>لا توجد ايرادات متنوعة</div><div class='repsubcol3'>0</div><div class='repsubcol4'>0</div></div>"
$("#varincomerows").append(varincomerow);
}///end if
$("#varincometot").html(document.varincometot)
});//// end of ajax call

document.grandsalestot=(parseFloat(document.varincometot)+parseFloat(document.salestot)).toFixed(2)
$("#grandsalestot").html(document.grandsalestot)

}//// end of func

//// populate expences - accounting reports with drpo down lists
function populateprofdd(){
$(document).ready(function() {	
	
	$("#exp_from_dd").find('option').remove();
	$("#exp_owners_dd").find('option').remove();
	$("#exp_staff_dd").find('option').remove();
	$("#cust_dd").find('option').remove();
	$("#owners_dd").find('option').remove();
	$("#staff_dd").find('option').remove();
	
///// expences from 
//var expfrom=[]
expfrom=populateprofilylists(0,2,0,0)
$("#exp_from_dd").append(' <option value="0">الخزينة</option>');
for(var i = 0; i < expfrom.length; i++){
$("#exp_from_dd").append('<option data-mobile="'+expfrom[i].mobile+'" value='+expfrom[i].id+'>'+expfrom[i].name+'</option>');
}
if(expdata.length<1){
$("#exp_from_dd").find('option').remove();
}
///// owners list
//var owners=[]
owners=populateprofilylists(0,2,0,0)
for(var i = 0; i < owners.length; i++){
$("#exp_owners_dd").append('<option data-mobile="'+owners[i].mobile+'" value='+owners[i].id+'>'+owners[i].name+'</option>');
$("#owners_dd").append('<option data-mobile="'+owners[i].mobile+'" value='+owners[i].id+'>'+owners[i].name+'</option>')
}
if(owners.length<1){
$("#exp_owners_dd").find('option').remove();
$("#owners_dd").find('option').remove();
}
//// staf list
//var staff=[]
staff=populateprofilylists(0,3,0,0)
for(var i = 0; i < staff.length; i++){
$("#exp_staff_dd").append('<option data-mobile="'+staff[i].mobile+'" value='+staff[i].id+'>'+staff[i].name+'</option>');
$("#staff_dd").append('<option data-mobile="'+staff[i].mobile+'" value='+staff[i].id+'>'+staff[i].name+'</option>');

}
if(staff.length<1){
$("#exp_staff_dd").find('option').remove();
$("#staff_dd").find('option').remove();
}
//// customers list

customers=populateprofilylists(0,4,0,0)
for(var i = 0; i < customers.length; i++){
$("#cust_dd").append('<option data-mobile="'+customers[i].mobile+'" value='+customers[i].id+'>'+customers[i].name+'</option>');
}
if(staff.length<1){
$("#cust_dd").find('option').remove();
}

})//// end of doc ready
}
/////////////////////////////EXP SUB SCREEN Functions ///////////////////////
function populateexpenceslist(parentid,level){
	//// delete all options and regenerate them
	if(level==1){
		$("#exp_level1_dd").find('option').remove();
		$("#exp_level2_dd").find('option').remove();
		$("#exp_level3_dd").find('option').remove();
		//$("#exp_level2_dd").append('<option value="0">اختر البند الرئيسي</option>');
		//$("#exp_level3_dd").append('<option value="0">اختر البند الفرعي الاول</option>');
	}else if(level==2){
 		$("#exp_level2_dd").find('option').remove();
		$("#exp_level3_dd").find('option').remove();
	}else if(level==3){
 		$("#exp_level3_dd").find('option').remove();
	}
	
	
$.ajaxSetup({async:true});
$.post("php/acc_func.php",{param:'1~'+parentid},function(server_response) {
					
					$("#exp_level"+level+"_dd").append(' <option value="0">اختر التصنيف</option>');
					

                  	//$("#unit_measure_row").append(' <option value="0">اختر وحدة القياس</option>');
                  	
					expdata = $.parseJSON(server_response);
					for(var i = 0; i < expdata.length; i++){
                  	$("#exp_level"+level+"_dd").append('<option value='+expdata[i].id+'>'+expdata[i].name+'</option>');
                  //	$("#unit_measure_row").append('<option value='+data[i].unit_id+'>'+data[i].unit_name+'</option>');
					}
					if(expdata.length<1){
						$("#exp_level"+level+"_dd").find('option').remove();
						
					}
});
	
}//// end of populate expences list

function postexpences(exptype,exp_code,exp_dat,exp_time,exp_value,exp_desc,fromcash,profid,issalary){
	
	///check if exp is paid from cash , check the cashier balance if the exp is greater than cash , dont accept or save 
	cashbalance= getcashbalanceNow()
	if(exp_value>cashbalance){
	alert("رصيد السيولة الحالية ( "+cashbalance+" جنيه) أقل من المصروف المطلوب، يرجى التأكد من ان صرف المبلغ تم من الخزينة")	
	return false;
	}
	
	///////
////param1: exptype (1 exp is salary or pay to partner) , $param[2] : exp_code, $param[3]: exp_dat,$param[4]:exp_time,$param[5]:exp_value,$param[6]:exp_desc , param7:fromcash ( 1 if paid from chasier, profid if paid by any partner),  param8:profid ( the profid for staff or partner paid to), param9:issalary ( 1 if is paid to staff as salary or related type of exp)
var expencesdata=exptype+"~"+exp_code+"~"+exp_dat+"~"+exp_time+"~"+exp_value+"~"+exp_desc+"~"+fromcash+"~"+profid+"~"+issalary
$.ajaxSetup({async:true});
$.post("php/acc_func.php",{param:'16~'+expencesdata},function(server_response) {
	if(server_response=="succeded"){
		alert("تم تسجيل المصروفات")
		return true;
	}else{
		alert("حدث مشكلة اثناء تسجيل المصروفات")
		return false;
	}
});//end of post
}///end of add expences function

//// post various income
function postvarincome(varinctype,varinc_dat,varinc_time,varinc_value,varinc_desc,tocash,varinc_typ_nam){

var varincdata=varinctype+"~"+varinc_dat+"~"+varinc_time+"~"+varinc_value+"~"+varinc_desc+"~"+tocash+"~"+varinc_typ_nam
$.ajaxSetup({async:true});
$.post("php/acc_func.php",{param:'17~'+varincdata},function(server_response) {
	if(server_response=="succeded"){
		alert("تم تسجيل الايرادات المتنوعة")
		return true;
	}else{
		alert("حدث مشكلة اثناء تسجيل الايرادات المتنوعة")
		return false;
	}
});//end of post
}///end of add expences function

//// post add moeny to profile balance (staff/owner)
//// parameters : $param[1]: date ,$param[2]:time  ,$param[3]: not used now, $param[4]: prof id,$param[5]: prof added value (money),$param[6]: prof added value descr
function addincomeprofilemov(dat,proftime,profname,profid,addedvalue,desc){
var profincdata=dat+"~"+proftime+"~"+profname+"~"+profid+"~"+addedvalue+"~"+desc
$.ajaxSetup({async:true});
$.post("php/acc_func.php",{param:'22~'+profincdata},function(server_response) {
	if(server_response=="succeded"){
		alert(" تم تسجيل المستحق الى الحساب الجاري ل" + profname)
		return true;
	}else{
		alert("حدث مشكلة اثناء تسجيل المستحق ل " + profname)
		return false;
	}
});//end of post
}///end of add expences function

/////populate sales items in an array of objects
var salesitemslist={}
function populatesalesitmes(){
$.ajaxSetup({async:false});
$.post("php/cashier_func.php",{param:'0~0'},function(server_response) {
data = $.parseJSON(server_response);
salesitemslist=data
}); //end ajax
}///end of populate sales items list into array function
///////function to populate dropdownlists of sales items lists
function populatesalesitemsdd(dropdownelement,addselectalloption,addselectalloptiontxt){
	///initialize select options
	dropdownelement.find('option').remove();
	if(addselectalloption==1){
	dropdownelement.append("<option value='0'>"+addselectalloptiontxt+"</option>");
	for(hs=0;hs<salesitemslist.length;hs++){
		dropdownelement.append('<option value='+salesitemslist[hs].itm_id+' data-itm_lname='+salesitemslist[hs].itm_lname+' data-itm_price='+salesitemslist[hs].itm_price+' data-itm_group='+salesitemslist[hs].itm_group+' data-itm_desc='+salesitemslist[hs].itm_desc+' >'+salesitemslist[hs].itm_sname+'</option>');
	}
	}else{
		dropdownelement.append("<option value='0'>اختر الصنف</option>");
	for(hs=0;hs<salesitemslist.length;hs++){
		dropdownelement.append('<option value='+salesitemslist[hs].itm_id+' data-itm_lname='+salesitemslist[hs].itm_lname+' data-itm_price='+salesitemslist[hs].itm_price+' data-itm_group='+salesitemslist[hs].itm_group+' data-itm_desc='+salesitemslist[hs].itm_desc+' >'+salesitemslist[hs].itm_sname+'</option>');
	}
	}	
}

////////////generate sales items sales report
////if option is allitems=1 generate the full report if allitems=0 generate details report for one item
////function to generate the stock reports it returns the report in an object
var salesitmsfullrep={}
var salesitmrep={}
function getsalesreportobj(allitems,itmid,startdate,enddate){
	if(allitems==1){///all items report
	var itemid=0;
	///generate sales items sales report ///parm1: option (1:all items, 0:one item), parm2: itm id)
	////parm3: start date , parm4: end date
			var repdata=allitems+"~"+itemid+"~"+startdate+"~"+enddate
$.ajaxSetup({async:false});//get salesitems report for all itmes
	$.post("php/acc_func.php",{param:'18~'+repdata},function(server_response) {
						data = $.parseJSON(server_response);
						salesitmsfullrep=$.parseJSON(server_response);
	//console.log(data)					
	})
	return salesitmsfullrep
	}else{////one item detailed report
		var itemid=itmid;
	///generate detailed sales item sales report ///parm1: option (1:all items, 0:one item), parm2: itm id)
	////parm3: start date , parm4: end date
			var repdata=allitems+"~"+itemid+"~"+startdate+"~"+enddate
			salesitmrep.qntytot=0;
			salesitmrep.salestot=0;
$.ajaxSetup({async:false});//get salesitems report for all itmes
	$.post("php/acc_func.php",{param:'18~'+repdata},function(server_response) {
						data = $.parseJSON(server_response);
						salesitmrep={"qntytot":0,"salestot":0,"reprows":$.parseJSON(server_response)};
						for(sdf=0;sdf<data.length;sdf++){
						salesitmrep.qntytot+=parseInt(data[sdf].itmqnty)
						salesitmrep.salestot+=parseFloat(data[sdf].totprice)
						}
	//console.log(data)					
	})
	return salesitmrep
	}//end if
}

/////


////////////generate purchased items report
////if option is allitems=1 generate the full report if allitems=0 generate details report for one item
////function to generate the stock reports it returns the report in an object
var purchitmsfullrep={}
var purchitmrep={}
function getpurchreportobj(allitems,itmid,startdate,enddate){
	if(allitems==1){///all items report
	var itemid=0;
	///generate sales items sales report ///parm1: option (1:all items, 0:one item), parm2: itm id)
	////parm3: start date , parm4: end date
			var repdata=itemid+"~"+startdate+"~"+enddate
$.ajaxSetup({async:false});//get purchased items report for all itmes
	$.post("php/acc_func.php",{param:'21~'+repdata},function(server_response) {
						data = $.parseJSON(server_response);
						purchitmsfullrep=$.parseJSON(server_response);
	//console.log(data)					
	})
	//alert(purchitmsfullrep)
	return purchitmsfullrep
	}else{////one item detailed report
		var itemid=itmid;
	///generate detailed sales item sales report ///parm1: option (1:all items, 0:one item), parm2: itm id)
	////parm3: start date , parm4: end date
			var repdata=itemid+"~"+startdate+"~"+enddate
			purchitmrep.totqntytot=0;
			purchitmrep.totpurchtot=0;
$.ajaxSetup({async:false});//get salesitems report for all itmes
	$.post("php/acc_func.php",{param:'21~'+repdata},function(server_response) {
						data = $.parseJSON(server_response);
						purchitmrep={"totqntytot":0,"totpurchtot":0,"reprows":$.parseJSON(server_response)};
						for(sdf=0;sdf<data.length;sdf++){
						purchitmrep.totqntytot+=parseInt(data[sdf].purchqnty)
						purchitmrep.totpurchtot+=parseFloat(data[sdf].purchprice)
						}
	//console.log(data)					
	})
	return purchitmrep
	}//end if
}

/////
/////function to populate all stock itmes except sales items for dd list
/////populate sales items in an array of objects
var allstockitemslist={}
function populatestockitmes(){
$.ajaxSetup({async:false});
$.post("php/db_query_fun.php",{param:'4~2'},function(server_response) {
data = $.parseJSON(server_response);
allstockitemslist=data
}); //end ajax
}///end of populate sales items list into array function

function populatestockitemsdd(dropdownelement,addselectalloption,addselectalloptiontxt){
	///initialize select options
	populatestockitmes()
	dropdownelement.find('option').remove();
	if(addselectalloption==1){
	dropdownelement.append("<option value='0'>"+addselectalloptiontxt+"</option>");
	for(hs=0;hs<allstockitemslist.length;hs++){
		dropdownelement.append('<option value='+allstockitemslist[hs].itm_id+' data-itm_lname='+allstockitemslist[hs].itm_name+' data-itm_price='+0+' data-itm_group='+0+' data-itm_desc='+0+' >'+allstockitemslist[hs].itm_name+'</option>');
	}
	}else{
		dropdownelement.append("<option value='0'>اختر الصنف</option>");
	for(hs=0;hs<allstockitemslist.length;hs++){
		dropdownelement.append('<option value='+allstockitemslist[hs].itm_id+' data-itm_lname='+allstockitemslist[hs].itm_name+' data-itm_price='+0+' data-itm_group='+0+' data-itm_desc='+0+' >'+allstockitemslist[hs].itm_name+'</option>');
	}
	}	
}


/////function to be called when user click on show sales items sales report in reports sub screen
/////salesitemslist_dd: 0 all items or any value itmid, salesitmsreptyp_dd (0: today, 1: month, 3:period,4 :all periods 
function gen_show_salesitmsrep(salesitemslist_dd,salesitmsreptyp_dd,salesitmsrepfrom,salesitmsrepto){
	////get the values from the user dd selections
	var itmidorall=parseInt(salesitemslist_dd.find(":selected").val())
	var itmname=salesitemslist_dd.find(":selected").text()
	var repperiodid=parseInt(salesitmsreptyp_dd.find(":selected").val())
	var startdat,enddate
	switch(repperiodid){
	case 0://today rep
	startdat=frmtdatetimesql(1)
	enddate=frmtdatetimesql(1)
	break;
	case 1://month rep
	//// get today date //
		today=frmtdatetimesql(1);
		todayobj=new Date(today)
		/// get number of days to the first day of the month
		nodays=parseInt(parseInt(todayobj.getDate())-1)
		///// set the first day of the month
		firstdayinthismonth=addsubsdaysfromdate(today,0,nodays)
		//alert(firstdayinthismonth)
	startdat=firstdayinthismonth
	enddate=today
	break;
	case 3://period rep
	///verify inputs
	if(salesitmsrepfrom.val()=="" || salesitmsrepto.val()==""){alert("يجب ادخال  الفترة من تاريخ الى تاريخ");return false;}
	startdat=salesitmsrepfrom.val();
	enddate=salesitmsrepto.val();
	break;
	case 4:
	startdat="2010-1-1"
	enddate=frmtdatetimesql(1)
	break;
	}
	
	
	////generate html report based on user selections
	
	/////all sales items report html
	if(itmidorall==0){////all sales items sales report
	var repobj=getsalesreportobj(1,0,startdat,enddate)
	///rep header
	var reptitle="<div class='repheadtxt'> كشف مبيعات أصناف من : <div style='display:inline;'>"+startdat+"</div> الى <div style='display:inline;' >"+enddate+"</div></div>"
	
	var rephead="<div style='width:100%; height:45px;margin-right:7px;float:right;'><div class='dashitmhead' style='10%'>م</div><div class='dashitmhead'>كود الصنف</div><div class='dashitmhead'>اسم الصنف</div><div class='dashitmhead'>الكمية المباعة</div><div class='dashitmhead'>قيمة الكمية</div></div>"
	var reprows=""
	for(i=0;i<repobj.length;i++){
		allqnty=0;
		sumsal=0
		if(repobj[i].allquantity==null){allqnty=0}else{allqnty=repobj[i].allquantity}
		if(repobj[i].sumsales==null){sumsal=0}else{sumsal=repobj[i].sumsales}
	reprows+="<div style='width:100%; height:45px;margin-right:7px;float:right;'><div class='dashitmhead dashitembox' style='10%'>"+(i+1)+"</div><div class='dashitmhead dashitembox'>"+repobj[i].itmid+"</div><div class='dashitmhead dashitembox'>"+repobj[i].itmsname+"</div><div class='dashitmhead dashitembox'>"+allqnty+"</div><div class='dashitmhead dashitembox'>"+sumsal+"</div></div>"	
	}
	var fullrep=reptitle+rephead+reprows
	showreport(fullrep,"تقرير مبيعات أصناف")
	}else{///detailed report for one item
	
		var repobj=getsalesreportobj(0,itmidorall,startdat,enddate)
	///rep header
	var reptitle="<div class='repheadtxt'> كشف تفصيلي مبيعات صنف: <div style='display:inline;'>"+itmname+"</div> كود : <div style='display:inline;'>"+itmidorall+"</div> من : <div style='display:inline;'>"+startdat+"</div> الى <div style='display:inline;' >"+enddate+"</div></div>"
	
	var rephead="<div style='width:100%; height:45px;margin-right:7px;float:right;'><div class='dashitmhead' style='width:10%'>م</div><div class='dashitmhead' style='width:20%'>التاريخ</div><div class='dashitmhead' style='width:15%'>الكمية المباعة</div><div class='dashitmhead' style='width:15%'>رقم الفاتورة</div><div class='dashitmhead' style='width:15%'>رقم الأوردر</div><div class='dashitmhead' style='width:15%'>قيمة الكمية</div></div>"
	var reprows=""
	for(i=0;i<repobj.reprows.length;i++){
		
	reprows+="<div style='width:100%; height:45px;margin-right:7px;float:right;'><div class='dashitmhead dashitembox' style='width:10%'>"+(i+1)+"</div><div class='dashitmhead dashitembox' style='width:20%'>"+repobj.reprows[i].itmdat+"</div><div class='dashitmhead dashitembox' style='width:15%'>"+repobj.reprows[i].itmqnty+"</div><div class='dashitmhead dashitembox' style='width:15%'>"+repobj.reprows[i].itminvid+"</div><div class='dashitmhead dashitembox' style='width:15%'>"+repobj.reprows[i].itmorderid+"</div><div class='dashitmhead dashitembox' style='width:15%'>"+repobj.reprows[i].totprice+"</div></div>"	
	}
	repfooter="<div style='width:100%; height:45px;margin-right:7px;float:right;'><div class='dashitmhead' style='width:10%'> </div><div class='dashitmhead' style='width:20%'>الإجمالي</div><div class='dashitmhead' style='width:15%'>"+repobj.qntytot+"</div><div class='dashitmhead' style='width:15%'> </div><div class='dashitmhead' style='width:15%'> </div><div class='dashitmhead' style='width:15%'>"+repobj.salestot+"</div></div>"
	var fullrep=reptitle+rephead+reprows+repfooter
	showreport(fullrep,"تقرير مبيعات صنف")
	}//end if else all report or item report
}

/////function to be called when user click on show sales items sales report in reports sub screen
/////salesitemslist_dd: 0 all items or any value itmid, salesitmsreptyp_dd (0: today, 1: month, 3:period,4 :all periods 
function gen_show_purchitmsrep(purchitemslist_dd,purchitmsreptyp_dd,purchitmsrepfrom,purchitmsrepto){
	////get the values from the user dd selections
	var itmidorall=parseInt(purchitemslist_dd.find(":selected").val())
	var itmname=purchitemslist_dd.find(":selected").text()
	var repperiodid=parseInt(purchitmsreptyp_dd.find(":selected").val())
	//alert(itmidorall+" "+itmname+"  "+repperiodid)
	var startdat,enddate
	switch(repperiodid){
	case 0://today rep
	startdat=frmtdatetimesql(1)
	enddate=frmtdatetimesql(1)
	break;
	case 1://month rep
	//// get today date //
		today=frmtdatetimesql(1);
		todayobj=new Date(today)
		/// get number of days to the first day of the month
		nodays=parseInt(parseInt(todayobj.getDate())-1)
		///// set the first day of the month
		firstdayinthismonth=addsubsdaysfromdate(today,0,nodays)
		//alert(firstdayinthismonth)
	startdat=firstdayinthismonth
	enddate=today
	break;
	case 3://period rep
	///verify inputs
	if(purchitmsrepfrom.val()=="" || purchitmsrepto.val()==""){alert("يجب ادخال  الفترة من تاريخ الى تاريخ");return false;}
	startdat=purchitmsrepfrom.val();
	enddate=purchitmsrepto.val();
	break;
	case 4:
	startdat="2010-1-1"
	enddate=frmtdatetimesql(1)
	break;
	}
	
	
	////generate html report based on user selections
	
	/////all purch items report html
	if(itmidorall==0){////all purch items report
	var repobj=getpurchreportobj(1,0,startdat,enddate)
	///rep header
	var reptitle="<div class='repheadtxt'> كشف مشتريات أصناف من : <div style='display:inline;'>"+startdat+"</div> الى <div style='display:inline;' >"+enddate+"</div></div>"
	
	var rephead="<div style='width:100%; height:45px;margin-right:7px;float:right;'><div class='dashitmhead' style='width:5%;'>م</div><div class='dashitmhead' style='width:10%'>كود الصنف</div><div class='dashitmhead' style='width:13%'>اسم الصنف</div><div class='dashitmhead' style='width:13%'>الكمية-الوحدة</div><div class='dashitmhead' style='width:10%'>سعر الكمية</div><div class='dashitmhead' style='width:44%'>الوصف</div></div>"
	var reprows=""
	for(i=0;i<repobj.length;i++){
		allqnty=0;
		sumsal=0
		if(repobj[i].totquantity==null){allqnty=0}else{allqnty=repobj[i].totquantity}
		if(repobj[i].totprice==null){sumsal=0}else{sumsal=repobj[i].totprice}
		if(repobj[i].totquantity!=0){//if quantity is zero for any item dont include its row
	reprows+="<div style='width:100%; height:auto;margin-right:7px;float:right;'><div class='dashitmhead dashitembox' style='width:5%'>"+(i+1)+"</div><div class='dashitmhead dashitembox' style='width:10%'>"+repobj[i].itemid+"</div><div class='dashitmhead dashitembox' style='width:13%'>"+repobj[i].itemname+"</div><div class='dashitmhead dashitembox' style='width:13%'>"+repobj[i].totquantity+" - "+repobj[i].purchqntyname+"</div><div class='dashitmhead dashitembox' style='width:10%'>"+repobj[i].totprice+" جنيه"+"</div><div class='dashitmhead dashitembox' style='width:44%;height:auto;font-size: .95em;line-height: 1.2em;' >"+repobj[i].totdesc+"</div></div>"	
		}//end if quantity is zero
	}
	var fullrep=reptitle+rephead+reprows
	showreport(fullrep,"تقرير مشتريات أصناف")
	}else{///detailed report for one item
	
		var repobj=getpurchreportobj(0,itmidorall,startdat,enddate)
	///rep header
	console.log(repobj)
	var reptitle="<div class='repheadtxt'> كشف تفصيلي مشتريات صنف: <div style='display:inline;'>"+itmname+"</div> كود : <div style='display:inline;'>"+itmidorall+"</div> من : <div style='display:inline;'>"+startdat+"</div> الى <div style='display:inline;' >"+enddate+"</div></div>"
	
	var rephead="<div style='width:100%; height:auto;margin-right:7px;float:right;'><div class='dashitmhead' style='width:5%'>م</div><div class='dashitmhead' style='width:20%'>التاريخ</div><div class='dashitmhead' style='width:15%'>الكمية- الوحدة</div><div class='dashitmhead' style='width:15%'>سعر الكمية(جنيه)</div><div class='dashitmhead' style='width:0%'></div><div class='dashitmhead' style='width:35%;padding: 3px;'>الوصف</div></div>"
	var reprows=""
	var itemquantityunit=""
	for(i=0;i<repobj.reprows.length;i++){
		itemquantityunit=repobj.reprows[i].purchqntyname
	reprows+="<div style='width:100%; height:auto;margin-right:7px;float:right;'><div class='dashitmhead dashitembox' style='width:5%'>"+(i+1)+"</div><div class='dashitmhead dashitembox' style='width:20%'>"+repobj.reprows[i].purchdat+"</div><div class='dashitmhead dashitembox' style='width:15%'>"+repobj.reprows[i].purchqnty+" - "+repobj.reprows[i].purchqntyname+"</div><div class='dashitmhead dashitembox' style='width:15%'>"+repobj.reprows[i].purchprice+"</div><div class='dashitmhead dashitembox' style='width:0%'>"+""+"</div><div class='dashitmhead dashitembox' style='width:35%;padding: 3px;font-size: .95em;line-height: 1.2em;height: auto;'>"+repobj.reprows[i].purchdesc+"</div></div>"	
	}
	repfooter="<div style='width:100%; height:45px;margin-right:7px;float:right;'><div class='dashitmhead' style='width:5%'> </div><div class='dashitmhead' style='width:20%'>الإجمالي</div><div class='dashitmhead' style='width:15%'>"+repobj.totqntytot+" - "+itemquantityunit+"</div><div class='dashitmhead' style='width:15%'>"+repobj.totpurchtot+"</div><div class='dashitmhead' style='width:0%'> </div><div class='dashitmhead' style='width:35%;padding: 3px;'> </div></div>"
	var fullrep=reptitle+rephead+reprows+repfooter
	showreport(fullrep,"تقرير مبيعات صنف")
	}//end if else all report or item report
}///end of purchase items report

///function to show confirmation dialoge to save income to profile
function showconfsaveincprof(title,txtmsg,dat,proftime,profname,profid,addvalue,profinc_desc){
	//console.log(txtmsg)
$myDialog4=$("<div style='padding:10px;overflow:auto;'>"+txtmsg+"</div>");
	$myDialog4.dialog({
	  appendTo: "#accountpage-container1",
	  title: title, 
	  zIndex: 10000,
	  autoOpen: true,
      resizable: false,
      height:550,
	  width:450,
      modal: true,
      buttons: {
		  "تأكيد": function() {
			//$( this ).confirmed= true;
		addincomeprofilemov(dat,proftime,profname,profid,addvalue,profinc_desc);
		
		$("#staffdepvalue").val("")
		$("#staffdepdesc").val("")
		$("#staffpartners_dd").val(0)
		$( this ).dialog( "close" );
		//return succeded
        }
		  ,
        "الغاء": function() {
			//$( this ).confirmed= true;
			 
          $( this ).dialog( "close" );
		 $("#acc_viewinvoices-container").find(".ui-dialog").remove()
        }
      }
    });/// end of dialog	
	
}///end of show conf dialoge



////to show the report in modal window popup
function showreport(reportmsg,title){
	//var defer = $.Deferred();,
	$("#reportdiv").remove()
	//$myDialog="";
	$myDialog=$("<div id='reportdiv' style='height:auto !important;background-color:white;'><div class='repcontainer'>"+reportmsg+"</div></div>");
	$myDialog.dialog({
	  appendTo: "#accountpage-container1",
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
			specific_css="<style>.repheadtxt {font-size: 16px;display: inline-block;float: right;padding: 0 10px;}.dashitmhead {float: right;width: 120px;height: 40px;text-align:center;background-color: #FFE849;border: solid 1px rgb(186, 175, 175);font-size: 18px;line-height: 34px;margin-top: 3px;}.dashitembox {background-color: #CCC;font-family: sans-serif;}</style>"
			
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
        windowobj['mywindow' +rand ].document.write('<html><head><title>تقرير</title>');
        /*optional stylesheet*/ //
		//mywindow.document.write(' <link rel="stylesheet" type="text/css" href="../css/tablescash.css" />');
		//mywindow.document.write(' <link rel="stylesheet" type="text/css" href="css/invprint.css" />');
       // mywindow.document.styleSheets="css/invprint.css"
		windowobj['mywindow' +rand ].document.write(specific_css);
		windowobj['mywindow' +rand ].document.write('<style>.button{display:none;}</style>');
		windowobj['mywindow' +rand ].document.write('</head><body>');
        windowobj['mywindow' +rand ].document.write(data);
        windowobj['mywindow' +rand ].document.write('</body></html>');
       setTimeout(windowobj['mywindow' +rand ].print(),5000);
	   // mywindow.print();
		//document.inv_obj.printed= 1;
		windowobj['mywindow' +rand ].close();
		
        //return true;
    }
/////////////////////////////////////
//function to get the total current cash balance 
function getcashbalanceNow(){
var cashbalance=0;
	$.ajaxSetup({async:false});
$.post("php/acc_func.php",{param:'25'},function(server_response) {
					cashbalance=server_response		
});///end of ajax
return cashbalance;
}