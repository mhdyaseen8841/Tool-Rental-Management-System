<?php
  include_once '../config/dbconn.php';
 function spCall($result,$requestId){
    $db = new Database();
    $result = $db->select("call `".$requestId."`('".json_encode($result)."')");
    print jsonformating($result[0]["result"]);
 }
?>