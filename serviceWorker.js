import axios from "axios";


const ServiceURL = 'https://6512-111-92-72-183.in.ngrok.io/tools/src/API/'

const requestPost = async (data)=>{
    
    const response = await axios.post(ServiceURL,data)
    console.log(response);
    // alert("Error Occured From Server")
    return response.data
}

export default requestPost