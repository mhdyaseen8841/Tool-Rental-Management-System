<?php
  include_once '../config/dbconn.php';
 function spCall($result,$requestId){
    $db = new Database();
    $result = $db->select("call `".$requestId."`('".json_encode($result)."')");
    print jsonformating($result[0]["result"]);
 }

 function spCallReturn($result,$requestId){
  $db = new Database();
  $result = $db->select("call `".$requestId."`('".json_encode($result)."')");
  return jsonformating($result[0]["result"]);
}


 function sp1100001($data){
   $db = new Database();
   $result = $db->select("call `1100001`('".json_encode($data)."')");
   $result1 = $result[0]["result"];
   $documents = $data->documents;
   //echo $documents[0]->doc;
   $result1 = json_decode($result1);
   if($result1->errorCode == 1){
      $res = $result1->result;
      $cid = $res->cId;
      $fname=upload($data->proof,$cid,"../uploads/images/");
      $db->insert("update customermaster set proof='$fname' where cId = {$cid}");
      foreach ($documents as $value) {
         $db->insert("insert into document(cId,file) value($cid,'')");
         $rs = $db->select("select LAST_INSERT_ID() as id");
         $filename = upload($value->doc, $rs[0]["id"],"../uploads/");
         $db->insert("update document set file='$filename' where dId = {$rs[0]['id']}");
         print jsonformating($result[0]["result"]);
   }
   }
   else{
      print jsonformating($result[0]["result"]);
   }
 }

 function upload($data,$filename,$path)  {
   $type = array();
   if (preg_match('/^data:image\/(\w+);base64,/', $data, $type)) {
      $data = substr($data, strpos($data, ',') + 1);
      $type = strtolower($type[1]); // jpg, png, gif
  
      if (!in_array($type, [ 'jpg', 'jpeg', 'gif', 'png' ])) {
          throw new \Exception('invalid image type');
      }
      $data = str_replace( ' ', '+', $data );
      $data = base64_decode($data);
      if ($data === false) {
          throw new \Exception('base64_decode failed');
      }
  } else {
      throw new \Exception('did not match data URI with image data');
  }
  file_put_contents("$path$filename.{$type}", $data);
  return ($filename.".".$type);
}
?>