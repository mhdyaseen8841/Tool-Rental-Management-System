import axios from "axios";
import Router from 'next/router';

// const ServiceURL = 'https://aonerentals.in/tools/src/API/' //live server 

const ServiceURL = 'http://localhost/tools/src/API/' //development server

// const ServiceURL = 'https://03e0-202-164-138-93.ngrok-free.app/tools/src/API/' //development NGROK server

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