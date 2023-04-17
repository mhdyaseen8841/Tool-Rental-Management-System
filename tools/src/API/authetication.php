<?php
include_once '../config/dbconn.php';
function authentication($result)
{
   $db = new Database();
   $token = "";
   $username = $result->username;
   $password =  md5($result->password);
   $result1 = $db->select("select uId,userName,userType from users where username = '$username' and password = '$password' and status=1");
   if (count($result1) > 0) {
      $token = md5(uniqid(rand(), true));
      $uid = $result1[0]["uId"];
      $platform = device();
      $db->insert("insert into login_session(uId,token,platform) values($uid,'$token','$platform')");
      $data = [
         "errorCode" => 1,
         "token" => $token,
         "data" => [
            "uId" => $result1[0]["uId"],
            "username" => $result1[0]["userName"],
            "usertype" => $result1[0]["userType"],
         ]
      ];
      echo (json_encode($data));
   } else {
      $data = [
         "errorCode" => 0,
         "errorMsg" => "Invalid username or Password"
      ];
      echo (json_encode($data));
   }
}
function sessionValidate()
{
   $db = new Database();
   $header = apache_request_headers();
   $token = "";
   foreach ($header as $headers => $value) {
      if ($headers == "Authorization") {
         $token = $value;
      }
   }
   $result1 = $db->select("select uId from login_session where token = '$token'");
   if (count($result1) == 0) {
      $data = [
         "errorCode" => 3,
         "errorMsg" => "session Timeout"
      ];
      echo (json_encode($data));
      die();
   }
}

function device(){
   // Check if the "mobile" word exists in User-Agent 
   $device = "";
   $company = "";
$isMob = is_numeric(strpos(strtolower($_SERVER["HTTP_USER_AGENT"]), "mobile")); 
  
// Check if the "tablet" word exists in User-Agent 
$isTab = is_numeric(strpos(strtolower($_SERVER["HTTP_USER_AGENT"]), "tablet")); 
 
// Platform check  
$isWin = is_numeric(strpos(strtolower($_SERVER["HTTP_USER_AGENT"]), "windows")); 
$isAndroid = is_numeric(strpos(strtolower($_SERVER["HTTP_USER_AGENT"]), "android")); 
$isIPhone = is_numeric(strpos(strtolower($_SERVER["HTTP_USER_AGENT"]), "iphone")); 
$isIPad = is_numeric(strpos(strtolower($_SERVER["HTTP_USER_AGENT"]), "ipad")); 
$isIOS = $isIPhone || $isIPad; 
 
if($isMob){ 
    if($isTab){ 
        $device = "tablet";
    }else{ 
      $device = "mobile";
    } 
}else{ 
   $device = "desktop";
} 
 
if($isIOS){ 
   $company = "IOS";
}elseif($isAndroid){ 
   $company = "Android"; 
}elseif($isWin){ 
   $company = "Windows" ;
}
  return $device."/".$company;
}