<?php
//error_reporting(E_ALL);
//ini_set('display_errors', '1');
$temp= $_POST["param"];
//session_start();
$keyin=$temp;

if (empty($keyin)){
	echo "<META HTTP-EQUIV=\"refresh\" CONTENT=\"0; URL=../index.php#login_form\"> ";
	die();
}
$word_1 = '';

for ($i = 0; $i < 4; $i++) 
{
	$word_1=$word_1.chr(rand(97, 122));
}
$word_2='';
for ($i = 0; $i < 4; $i++) 
{
	$word_2=$word_2.chr(rand(97, 122));
}

$cap = $word_1.' '.$word_2;

$dir = 'fonts/';

$image = imagecreatetruecolor(165, 50);

$font = "recaptchaFont.ttf"; // font style

$color = imagecolorallocate($image, 0, 0, 0);// color

$white = imagecolorallocate($image, 255, 255, 255); // background color white

imagefilledrectangle($image, 0,0, 709, 99, $white);

imagettftext ($image, 22, 0, 5, 30, $color, $dir.$font, $cap);

//header("Content-type: image/png");
if (file_exists("../images/captcha/".$temp.".png")) unlink("../images/captcha/".$temp.".png");
imagepng($image,"../images/captcha/".$temp.".png"); 
 
//$_SESSION['Captcha'] =$cap;
echo $cap;
?>