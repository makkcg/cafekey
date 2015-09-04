// JavaScript Document for Appsa screen
//////////////validation of phone number field/////////
///////////////////////////////////
$(document).ready(function() {
///initialize pages
$(".sub-sub-page-container").hide()
$("#main_btns_selector").show()


///// click on one of extract sub invoice buttons
$(document).on('click','.selector_btns',function(){
	var selectedbtn=parseInt($(this).data('id'))
	switch(selectedbtn){
	case 0:
	alert("عفوا !! غير مسموح لهذا المستخدم بالدخول على هذه الشاشة")
	break;
	case 1:///Casheir / Orders Screen
	window.location='orderscreen/order_screen.php';
	break;
	case 2:///Stock control screen
	window.location='stockcontrol.php';
	break;	
	case 3:///Accounting Screen
	window.location='accounting.php';
	break;
	case 4:///system setup first time
	window.location='firstsetup.php';
	break;
	}
})
///////////////////////////////////////////
});
