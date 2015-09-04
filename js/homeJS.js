// Public home page Javascript
///////////////////////initialize and clear registration form ////////////////////
function clearRegForm(){
$("#email").val('');
	$("#remail").val('');
	$("#pwd").val('');
	$("#repwd").val('');
	$("#fullname").val('');
	$("#phone").val('');
	$("#captcha-code").val('');
	$("#street").val('');
	$("#city").val('');
	$("#country").val('');
	$("#year").val('');
	/*$("#nationality").val('');*/
	$("#children").val('0');
	$("#terms").val('0');
	$("#offers").val('0');
	$("#service").val('0');	
}

$(document).ready(function() {
	/*******************change male and female input according to the user select**********/
 $("#male").click(function(e) {
    $("#female").removeAttr("checked");
	$("#male").val('1');
});

$("#female").click(function(e) {
    $("#male").removeAttr("checked");
	$("#male").val('0');
});
/****************set the value of check boxes to be sent with the ajax call****/
$("#terms").click(function(e){
	$("#terms").val('1');
});
$("#children").click(function(e){
	$("#children").val('1');
});
$("#terms").click(function(e){
	$("#terms").val('1');
});
$("#offers").click(function(e){
	$("#offers").val('1');
});
$("#service").click(function(e){
	$("#service").val('1');
});

	//// refresh captcha 
	change_captcha();
	///intiate ajax post request variable
	//var Regrequest;// this variable is for storing reg ajax call to empty if requested multi times
	
	///// Captcha implementation ////////
	$("#captcha-refresh").click(function() {  /* when user click on captcha refresh*/
		
		change_captcha();
 });
 ///////////////////////////////////////////////////////////////////////
 //////////load captch
 /////////////////////////////////////////////////////////////////////
 function change_captcha()
 {
	 var rndnum=Math.floor(Math.random()*1000)
	 ;
	 sessionStorage.setItem("CaptchaFile",rndnum+".png");
	 $.ajaxSetup({async:false});
//     $.post("php/get_captcha.php",{param:rndnum},function(data) { 
//	
//	  sessionStorage.setItem("Captcha",data);
//	 //$("#captcha").attr("src","php/get_captcha.php?rnd=" + xx);
//	
//	$("#captcha").attr("src","images/captcha/" + rndnum+".png");
//	
//	
//	 });
var redata="";
	$.ajax({
        type: "POST",
        url: "php/get_captcha.php",
        data: "param="+ rndnum,
        success: function(data){
            redata = data;                
        }
    }); 
	$("#captcha").attr("src","images/captcha/" + rndnum+".png");
	 sessionStorage.setItem("Captcha",redata);  
	 
 }
 $.validator.addMethod(
    "date",
    function ( value, element ) {
        var bits = value.match( /([0-9]+)/gi ), str;
        if ( ! bits )
            return this.optional(element) || false;
        str = bits[ 1 ] + '/' + bits[ 0 ] + '/' + bits[ 2 ];
        return this.optional(element) || !/Invalid|NaN/.test(new Date( str ));
    },
    "من فضلك أدخا التاريخ بالطريقة الصحيحة اليوم-الشهر السنة"
);
//registration form validation int
var validated=$("#regform").validate({
		rules: {
			fullname: {
				required: true,
				minlength: 5
			},
			bod: {
				required: true,
				date:true
			},
			street: {
				required: true
			
			},		
			city: {
				required: true
				
			},
				
			country: {
				required: true
			},
			web: {
				required: false,
				url:true
			},
			pwd: {
				required: true,
				minlength: 5
			},
			repwd: {
				required: true,
				minlength: 5,
				equalTo: "#repwd"
			},
			email: {
				required: true,
				email: true
			},
			remail: {
				required: true,
				email: true,
				minlength: 5,
				equalTo: "#email"
			},
			phone: {
				required: true,
				digits: true,
				minlength: 8,
				maxlength:14 ,
			},
			country: {
				required: true
			},
			terms: "required"
		},
		messages: {
		country:{
		required:"من فضلك اختر البلد",
		},
		email:{
		required:"من فضلك أدخل بريدك الالكتروني",
		email:"من فضلك أدخل بريد الكتروني صحيح"
		},
		remail:{
		required:"من فضلك أعد ادخال بريدك الالكتروني",
		email:"من فضلك أدخل بريد الكتروني صحيح",
		equalTo:"البريد الالكتروني غير متطابق"
		},
		pwd: {
				required: "من فضلك اكتب كلمة المرور",
				minlength: "يجب ان تكون على الأقل 5 احرف"
			},
		repwd: {
				required: "من فضلك أعد كتابة كلمة المرور",
				minlength: "يجب ان تكون على الأقل 5 احرف",
				equalTo: "كلمة السر غير متطابقة"
			},
		phone: {
				required: "يرجى ادخال رقم التليفون أو الموبايل",
				digits: "الرقم غير صحيح",
				minlength:"ارجو ادخال رقم تلفون صحيح لا يقل عن 8 ارقام",
				maxlength:"ارجو ادخال رقم تلفون صحيح لا يزيد عن 14 ارقام" 
			},
			fullname: "من فضلك ادخل اسمك الكامل",
			street: "من فضلك ادخل اسم الشارع",
			city: "من فضلك ادخل اسم المدينة",
			bod: {
					required:"من فضلك اختر تاريخ ميلادك"
				},
			
			terms:"يجب الموافقة علي الشروط"
			
		}
	});

//int validate end

/****************menu navigation and pages effects ********************/

$("#mnuhome").click(function(e) {
	$("#cssmenu ul li").removeClass("active");
	$("#mnuhome").addClass("active")
	$(".pages div.page").hide();
	$(".contenthome").fadeIn(1000);
});
$("#mnulog").click(function(e) {
	$("#cssmenu ul li").removeClass("active");
	$("#mnulog").addClass("active");
	$("#login").prop("disabled", false);
	$("#password").prop("disabled",false)
	$("#loginbtn").prop("disabled", false);
	
});
$("#mnuabout").click(function(e) {
	$("#cssmenu ul li").removeClass("active");
	$("#mnuabout").addClass("active");
	$(".pages div.page").hide();
	$(".aboutuspage").fadeIn(1000);
	
});
/*************registration form to be removed **************/
$("#mnureg").click(function(e) {
	$("#cssmenu ul li").removeClass("active");
	$("#mnureg").addClass("active");
	$(".pages div.page").hide();
	/**************************/
	// clearRegForm();
	/**************************/
	$(".registrationpage").fadeIn(1000,function() {
	
//int datepick up as a callback function 		
		var myCalendar = new dhtmlXCalendarObject(["calendar","bod"]);
		myCalendar.setDateFormat("%d-%m-%Y");
		myCalendar.setWeekStartDay(7);
			});
});
/**************************************************************/
$("#mnucontact").click(function(e) {
	$("#cssmenu ul li").removeClass("active");
	$("#mnucontact").addClass("active");
	$(".pages div.page").hide();
	$(".contactus").fadeIn(1000);
});
$("#loginX").click(function(e) {
	$("#cssmenu ul li").removeClass("active");
	$("#mnuhome").addClass("active");
	$("#logout").hide();
	$("#login").prop("disabled", false);
	$("#password").prop("disabled",false)
	$("#result").html("");
	$("#spinner").hide();
	$(".pages div.page").hide();
	$(".contenthome").fadeIn(1000);
});
});
/******************************Home page Slideshow **************/
 $(function () {
            $('.slideshow div').hide(); // hide all slides
                  $('.slideshow div:first-child').show(); // show first slide
                  setInterval(function () {
                        $('.slideshow div:first-child').fadeOut(500)
                              .next('div').fadeIn(1000)
                              .end().appendTo('.slideshow');
                  },
            8000); // slide duration
      });
	  /*******************************************************registration to be removed ************************/
//submit the registration form after validation
function regform_submit(){
if($("#regform" ).valid()){///check if form fields are valid
var dataString = $( "#regform" ).serialize();///serialize form data
if($("#captcha-code").val()!=sessionStorage.getItem("Captcha")) {alert("Captcha doesn't match ") ;$("#captcha-code").focus();return false;}
alert('Ajax start');
//////////// store the registrarion data to db
///////// check if the user email exist or previously registered or not then register the data///////////////
var xx=0;
$.ajaxSetup({async:false});
$.post("php/company.php",{param:'65~' + $("#email").val()},function(data) { xx=parseInt(data,10);});
if (xx>0) {alert("هذا لبريد الالكتروني مسجل مسبقا") ;return false;}
$.ajaxSetup({async:false});
$.post("php/company.php",{param:'66~' + $("#email").val()},function(data) { xx=parseInt(data,10);});
if (xx>0) {alert("هذا البريد الالكتروني مسجل مسبقا") ;return false;}
////////////// do the registration using ajax call /////////////////
//if (Regrequest) {
  //     Regrequest.abort();
    //}
var returnedRegData;
	var $form = $("#regform");
	var $inputs = $form.find("input, select, button, textarea");
    // serialize the data in the form
    var serializedData = $form.serialize();
 $inputs.prop("disabled", true);
	Regrequest=$.ajax({
        url: "php/reg.php?key=x64fs3",
        data: serializedData,
		type: "post",
        success: function(data){
            returnedRegData = data;  
			alert(returnedRegData);
//validated.resetForm();

//clearRegForm();
			$inputs.prop("disabled", false); 
			  
        }
		
    }); 
//change_captcha();

}

$("#regform").submit(function(event) {
	  event.preventDefault();
	  }); 

}
/**********************************************************************************/

//login function

function login_function(){
   
var loginform = $( "#loginform" ).serialize();

      $("#spinner").show();
      $("#spinner").fadeIn(400).html('<img src="img/spinner.gif" />');
      $.ajax({
      type: "POST",
	  dataType: 'json',
      url: "php/login.php",
      data: loginform,
      cache: false,
      success: function(result){
               //alert(result.msg2);
			   if(result.msg2=="logout"){///returned if user is logedin in the db flag
				$("#logout").show(); 
				$("#logout a.logout_link").attr("href", "php/logout.php?id="+result.msg3);
				$("#loginbtn").prop("disabled", true);
				$("#login").prop("disabled", true);
				$("#password").prop("disabled", true);  
			   }else{
				   $("#login").prop("disabled", false);
				$("#password").prop("disabled",false)
				   $("#logout").hide();
			   }
               if(result.msg2=='dologin'){/// returned from login after creating sessions
				   //alert(result.msg1);
			     $("#result").html(result.msg1);
				 $("#loginbtn").prop("disabled", true);
				$("#login").prop("disabled", true);
				$("#password").prop("disabled", true);
				 
				 ///redirect to the applications page
				 if(result.msg3=="firstlogin"){/// if user is loging for the first time redirect to edit profile screen
					//alert("You are logged-in now- user edit screen"); 
					//window.location='edituserprofile.php';
					//permission=parseInt(<?php echo $_SESSION['permission']; ?>)
					//console.log(permission)
					//if(permission==1){//casheir user only
					//alert("You are logged-in now- Casheir Screen");
					//	window.location='orderscreen/order_screen.php';
					//}else{
						alert("You are logged-in now- apps screen");
					window.location='applicationmain.php';//// activated temporary until finishing edituserprofile.php
					//}
				 }else{/// if user is NOT loging for first time redirect to apps screen
				 //permission=parseInt(<?php echo $_SESSION['permission']; ?>)
				 //console.log(permission)
					//if(permission==1){//casheir user only
					//alert("You are logged-in now- Casheir Screen");
					//	window.location='orderscreen/order_screen.php';
					//}else{
					alert("You are logged-in now- apps screen");
					 window.location='applicationmain.php';
					 //}
					
				 }
               }else{
				   $("#loginbtn").prop("disabled", false);
				   $("#login").prop("disabled", false);
				$("#password").prop("disabled",false);
                     $("#result").html(result.msg1);
					 $("#spinner").hide();
					
               }
      }
      });
$("#loginform").submit(function(event) {
	  event.preventDefault();
	  }); 

}

//login function end


