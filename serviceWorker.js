import axios from "axios";


const ServiceURL = 'https://2365-111-92-74-77.ngrok-free.app/tools/src/API/'

const requestPost = async (data)=>{
    
    
    const response = await axios.post(ServiceURL,data)
    console.log(response);
    // alert("Error Occured From Server")
    return response.data
}

export default requestPost