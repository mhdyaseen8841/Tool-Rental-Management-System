import axios from "axios";
// import { toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';


const ServiceURL = 'https://bde9-202-164-137-208.in.ngrok.io/tools/src/API/'

const datas={
    result:[
        {

    }
]
}
const requestPost = async (data)=>{
    

    try{
        const response = await axios.post(ServiceURL,data)
        console.log(response);
        // alert("Error Occured From Server")
        return response.data
    }catch(err){
        // toast.error(err.message);
      throw err.message
    }

   
}

export default requestPost