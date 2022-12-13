import { useEffect } from 'react';
import Home from "./index"

function getResponse(){
    const response = Home.getFiles();
    // console.log("response", response);
    return response;
}

export default getResponse;