<?php
header('Content-Type: text/html; charset=utf-8');/// set the content charset to utf-8 for php
session_start();
if(isset($_SESSION['user_id'])){/// if the user has a session opened for this computer
//error_reporting(E_ALL);
$user_ID= $_SESSION['user_id'];
//ini_set('display_errors', '1');
include "php/db_config.php";
/// check user login flag if 0  or the user session id on this computer is not equal to session id on db so destroy session
$sqlindex2="SELECT `users`.`userlogin_flag` ,`users`.`sessionDB_ID` FROM `users` WHERE `id`=".$user_ID;
		$sqlconindex=   mysqli_query($con, $sqlindex2);
		//echo $_SESSION['user_id'];
		//die();
		$current_session_id_from_user_computer=session_id();
		$current_session_id_from_DB=0;//initialize seession id from db variable
		$userlogin_flag=0;// initialize userlogin flag variable with 0, a flag to check if the user is logged in from other machin or not
		if ($sqlresindex2 =  mysqli_fetch_row($sqlconindex)){ /// if their is results from the database regarding user login flag
			$userlogin_flag= $sqlresindex2[0];//set the user lgoin flag as the resulted from the database
			$current_session_id_from_DB=$sqlresindex2[1];//get the session id from database
			if($current_session_id_from_user_computer != $current_session_id_from_DB){
  				session_destroy();
				//echo $current_session_id_from_DB;
				die();
				//header('location:location:./index.php#login_form');
			 }else{
				if($userlogin_flag>0){ // if user is logged in from any other machine  - flag value is grater than 0
				if($_SESSION['permission']==1){///is casheir only user
					header('location:./orderscreen/order_screen.php');
				}else{
					header('location:./applicationmain.php');
				}
					//die();
				}else{
					//destroy session
 					session_destroy();
				}
			 }
	
		}
	mysqli_close($con);
}
?>
<!doctype html>
<html>
<head>
<?PHP 
//include'inc/head.inc';
?>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
<title>موكا كافيه - Moka Cafe</title>
<script type="text/javascript" src="./js/jquery-1.11.1.min.js"></script>
<script type="text/javascript" src="./js/jquery-ui.js"></script>
<link rel="stylesheet" type="text/css" href="css/index.css" />
<link rel="stylesheet" type="text/css" href="css/homemenu.css" />
<!--<link rel="stylesheet" type="text/css" href="css/Regform_style.css"/>-->
<!-- Load date picker https://code.google.com/p/datepickr/
<script type="text/javascript" src="./js/datepickr.js"></script>-->
<!-- Date picker plugin http://dhtmlx.com/docs/products/dhtmlxCalendar/--->
<link rel="stylesheet" type="text/css" href="./plugins/datepicker/dhtmlxcalendar.css">
      <link rel="stylesheet" type="text/css" href="./plugins/datepicker/skins/dhtmlxcalendar_dhx_skyblue.css">
      <script src="./plugins/datepicker/dhtmlxcalendar.js"></script>
<!--loading validation jquery-->
<script src="./js/jquery.validate.js" type="text/javascript"></script>
<!-- check if user is idle and do actions http://www.paulirish.com/2009/jquery-idletimer-plugin/ -->

<script type="text/javascript" src="./js/homeJS.js"></script>
<!--loading datepicker javascript not jquery-->
<script type="text/javascript" src="./js/setup.js"></script>

</head>
<body>
<!-- login screen pop up------->
        <a href="#x" class="overlay" id="login_form"></a>
        <div class="popup">
        <h1>تسجيل الدخول</h1>
      <form id="loginform" method="post">
        <p><input type="text" id="login" name="login" value="" placeholder="اسم المستخدم"></p>
        <p><input type="password" id="password" name="password" value="" placeholder="كلمة المرور"></p>
        <input type="hidden" id="key" name="key" value="loginform">
        <p><input id="loginbtn" type="submit" onClick="login_function()" name="commit" value="تسجيل الدخول"></p>
		<div id="spinner"></div>
		<div id="result" class="loginresult"></div>
		<div id="logout" class="none"><a class="logout_link" href="php/logout.php"> تسجيل خروج </a>
        <!--<a id="gotoapps" href="applicationmain.php" style="float:left">  الذهاب الى شاشة التطبيقات  </a>-->
        </div>
        <p class="remember_me none">
          <label><input  type="checkbox" name="remember_me" id="remember_me">تذكر حساب الدخول على هذا الجهاز</label>
        </p>
      </form>
            <a id="loginX" class="close" href="#home"></a>
        </div>

      <!-----------------------end of login screen pop up------------->
<div class="homepagea">
<div class="pageframe">
<div class="maincontainer">
<!--<div class="maintitle">
  <h1>مرحبا بكم في موكة كافيه</h1></div>-->
<!-----------------------main slideshow --------------->
<?php
include'inc/slideshow.inc';
?>
<!-----------------main top menu------------------>
<?php
include'inc/menu.inc';
?>

      <!------------------ pages content Area ------------------>
      <div class="pages">
      <!----------------- Home page-------------------->
    <div class="contenthome page">
      <div class="ar_logo"><img src="images/logoMoka.png" /></div>
      <div class="hometxt">
     <!-- <h2>مرحبا بكم في حزمة برمجيات إشارة حياة للصم</h2>-->
      <p style="text-align:center;">مرحبا بك في الموقع الرسمي لكافيه موكا</p>
      <p>
     يقدم كافيه موكا كافة المشروبات الساخنة والمشروبات الباردة والعصائر الطازجة ، كما يقدم المعسل بكافة أنواع النكهات ،
     يتميز كافيه موكا بجلساته المريحة سواء في الداخل مكيف الهواء أو في الخارج ، كما يتوفر به خدمة الانترنت فائق السرعة.
       يمكنك الاستمتاع بمصاحبة أصدقائك أو مشاهدة التلفاز ، كما يمكنك انجاز أعمالك بهدوء</p>
      
      </div>
      </div><!-------end of home page----->
      <!------------------about us page ---------->
      <div class="aboutuspage page">
      <div style="text-align:center;margin:10px 0;"><img src="images/logoMoka.png" /></div>
      <div class="hometxt hometxt1">
     <!-- <h2>مرحبا بكم في حزمة برمجيات إشارة حياة للصم</h2>-->
      <p>تم افتتاح كافيه موكا في بداية 2014 في المهندسين ، من خلال مجموعة من الشركاء ، وتم تجهيز المكان بديكورات جذابة متنوعة تعطي انطباعات مختلفة لكل جلسة  تناسب كافة الاحتياجات والأذواق . </p>
      
      </div>
      
      </div><!--- end of about page--->
      <!------------Registration Page ------------>
	  
    <?php
	include'inc/registration_form.inc';
	?>
	
    <!--------------------- Contact us page----------->
    <div class="contactus page">
      <div style="text-align:center;margin:10px 0;"><img src="images/logoMoka.png" /></div>
      <div class="hometxt hometxt1">
      <div style="text-align:center;margin:15px 0; font-size:18px;">يقع كافيه موكا على ناصية شارعي نابلس وشارع القدس الشريف المتفرع من شارع شهاب بجوار ماكدونالدز (شهاب) ، حي المهندسين ، الجيزة ، مصر
      <br>للاتصال بنا : تليفون : 330555555   محمول : 01011111111</div>
      
      <p><div style="text-align:center;margin:20px 0;"><a target="_blank" href="https://www.google.com.eg/maps/place/30%C2%B003'20.1%22N+31%C2%B011'47.9%22E/@30.0564684,31.1947407,16z/data=!4m2!3m1!1s0x0:0x0?hl=en"><img src="images/mokaMap.png" /></a></div></p>
      
      </div>
      </div>
     </div> <!-----------------------end of pages content area ----------->
      
</div><!----------- end of main container ----------->
</div><!--------------end of page frame ------------>
<!--------------start of footer and copyright -------------->
<?php
include'inc/footer.inc'
?>
</div><!--------------end of homepage div------------>

</body>
</html>
