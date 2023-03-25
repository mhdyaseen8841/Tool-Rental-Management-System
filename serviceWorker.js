import axios from "axios";


const ServiceURL = 'https://59cc-202-164-137-208.in.ngrok.io/tools/src/API/'

const requestPost = async (data)=>{
    
    const response = await axios.post(ServiceURL,data)
    console.log(response);
    // alert("Error Occured From Server")
    return response.data
}

export default requestPost