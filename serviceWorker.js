import axios from "axios";


const ServiceURL = 'https://54ff-111-92-81-134.in.ngrok.io/tools/src/API/'

const requestPost = async (data)=>{
    
    const response = await axios.post(ServiceURL,data)
    console.log(response);
    return response.data
}

export default requestPost