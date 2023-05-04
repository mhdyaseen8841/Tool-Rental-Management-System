import axios from "axios";
import Router from 'next/router';

const ServiceURL = 'https://aonerentals.in/tools/src/API/'


const requestPost = async (data)=>{

        const config = {
            headers: {
              Authorization: localStorage.getItem("authtoken"),
            },
          };
        const response = await axios.post(ServiceURL,data,config)
        
       
        return response.data
        
      
    
  
}

export default requestPost