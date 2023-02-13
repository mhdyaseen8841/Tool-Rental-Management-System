import axios from "axios";


const ServiceURL = 'https://6512-111-92-72-183.in.ngrok.io/tools/src/API/'
const requestPost = async (data)=>{
try{
        const response = await axios.post(ServiceURL,data)
        console.log(response);
        // alert("Error Occured From Server")
        return response.data
}
catch(err){
    console.log("err"+err)
    return err
}

}
export default requestPost