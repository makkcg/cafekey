// JavaScript Document for Appsa screen
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
$(document).ready(function() {
	////////////////////// top menu control////////////////
	$('.topmenuitem').click(function() {
	 $(this).addClass('active').siblings().removeClass('active');
	 
	});

	$('.mnucashierpage').click(function() {
	 $('#accountpage-container').hide();
	 $('#stockpage-container').hide();
	 $('#Cashier-Page').show();
	 $('#manage-Page').hide();
	 initializeInvobj();
initializesalesitems();
recalculateInvobj();
refreshinvoicetable();
	 });
	 
	/* $('.mnustockpage').click(function() {
		// initialize_stock_sub_pages();
	 $('#accountpage-container').hide();
	 $('#stockpage-container').show();
	 $('#Cashier-Page').hide();
	 $('#manage-Page').hide();
	 });*/
	 
	  $('.mnuaccountpage').click(function() {
	 $('#accountpage-container').show();
	 $('#stockpage-container').hide();
	 $('#Cashier-Page').hide();
	 $('#manage-Page').hide();
	 initializeaccscreen();
	 });
	 
	 $('.mnumanagepage').click(function() {
	 $('#accountpage-container').hide();
	 $('#stockpage-container').hide();
	 $('#Cashier-Page').hide();
	 $('#manage-Page').show();
	 });
	

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

////////////////////////////old script ///////////////////
var uid="0";
 
 var picname="";
 $.ajaxSetup({async:false});
$.post("php/request.php",{param:'35~' + uid},function(data) { picname=data;});
 $("#usrimg").attr("src","ttapp/images/users/"+picname);
 var fname;// user full name
 var uemail;// user lemail
 var udob;// user date of birth
 var ucomp;/// user company name
 var expDate/// expiration date

$.ajaxSetup({async:false});
$.post("php/request.php",{param:'34~' + uid},function(data) {ud=data.split("~");});
fname=ud[0] +" " + ud[1];
uemail=ud[10];
udob=ud[3];
ucomp=ud[8];
$.post("php/request.php",{param:'75~' + uid},function(data) {uda=data.split("~");});
expDate=uda[0];
//$("#utitle").html("<span style='text-align:center;'>"+"مـــرحــبــا"+ "</span><br/>" +fname+ "<br/><span class='profiletitle'>"+"تاريخ الميلاد" +"</span><br/>"+ udob + "<br/><span class='profiletitle'>"+"البريد الالكتروني" +"</span><br/>"+ uemail+ "<br/><span class='profiletitle'>"+"الجهة/الشركة" +"</span><br/>"+ ucomp+ "<br/><span class='profiletitle'>"+"تاريخ انتهاء الاشتراك" +"</span><br/>"+ expDate);
$("#utitle").html("<div style='color: rgb(128, 16, 16);font-size: 18px;text-align:center;'>"+fname+ "</div><span class='profiletitle'>"+"تاريخ الميلاد" +"</span><br/>"+ udob + "<br/><span class='profiletitle'>"+"البريد الالكتروني" +"</span><br/>"+ uemail+ "<br/><span class='profiletitle'>"+"الجهة/الشركة" +"</span><br/>"+ ucomp+ "<br/><span class='profiletitle'>"+"تاريخ انتهاء الاشتراك" +"</span><br/>"+ expDate);

sessionStorage.setItem("CurrentFullName",fname);
sessionStorage.setItem("ExpirationDate",fname);

});
