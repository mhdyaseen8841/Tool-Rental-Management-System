<?php 
    include "./spcall/spcall.php";
    include "../config/config.php";
    include_once 'authetication.php';
    header('Content-Type: application/json; charset=utf-8');
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Methods: POST');
    header('Access-Control-Allow-Headers: Content-Type,Authorization');
    $data = json_decode(file_get_contents('php://input'));
    if(!$data){
        die("Data not passed");
    }
    if(formatChecker('type',$data) && $data->type == "Authetication"){
        authentication($data->request);
    }
    else if(formatChecker('type',$data) && $data->type == "SP_CALL"){
       //sessionValidate();
       if($data->requestId == 1100001){
            sp1100001($data->request);
       } else {
            spCall($data->request,$data->requestId);
       }
    }
    else{
        formatError();
    }
    ?>


