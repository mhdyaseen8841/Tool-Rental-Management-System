<?php
function formatError(){
    $format  = Array();
    $format['errorCode'] = 0;
    $format['errorMsg'] = 'request Error';
    print json_encode($format);
 }
 function formatChecker($key,$array){
     if(array_key_exists($key, $array)){
         return true;
     }
     else{
         formatError();
         return false;
     }
  }
  function jsonformating($data){
    $rs1 = str_replace("\\","",$data);
    $len = strlen($rs1);
    for ($i=0; $i < $len; $i++) { 
        if($rs1[$i] =='[' && $rs1[$i+1] =='"' && $rs1[$i+2] =='{'){
              $rs1[$i+1] = " ";
        }
        if($rs1[$i] ==']' && $rs1[$i-1] =='"' && $rs1[$i-2] =='}'){
            $rs1[$i-1] = " ";
        }
        if($rs1[$i-1] =='"' && $rs1[$i] =='{'){
            $rs1[$i-1] = " ";
        }
        if($rs1[$i-1] =='"' && $rs1[$i-2] =='}'){
          $rs1[$i-1] = " ";
        } 
        if($rs1[$i-1] =='"' && $rs1[$i] =='['){
            $rs1[$i-1] = " ";
        }
        if($rs1[$i] =='"' && $rs1[$i-1] ==']'){
          $rs1[$i] = " ";
        } 
      
    }
    //echo $rs1;
    //$rs2 = json_decode($rs1);
    return $rs1;
  }
