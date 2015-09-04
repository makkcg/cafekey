// JavaScript Document for Appsa screen
////////////////////validation of form fields/////////////////
//////////////validation of email/////////////////
function validEmail(v) {
    var r = new RegExp("[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?");
    return (v.match(r) == null) ? false : true;
}
//////////////////validation of any field lenght///////////////
function validateLength(selector,minlength){
	//alert(selector.val().length);
	if(selector.val().length<=minlength){
		return false;
	}else{
		return true;
	}
}
//////////////validation of phone number field/////////
function validatePhone(phone) {
    var regex = /^\+(?:[0-9] ?){6,14}[0-9]$/;
    if (regex.test(phone)) {
		return true;
        // Valid international phone number
    } else {
		return false;
        // Invalid international phone number
    }
}

///////////////////////////////////
$(document).ready(function() {

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
