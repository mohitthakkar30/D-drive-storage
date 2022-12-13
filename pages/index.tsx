import { ConnectButton } from "@rainbow-me/rainbowkit";
import type { NextPage } from "next";
import Head from "next/head";
import styles from "../styles/Home.module.css";
import lighthouse from "@lighthouse-web3/sdk";
import { Web3Storage } from "web3.storage";
import { useState } from "react";
import getResponse from "./Dynamictable"
import { getDisplayName } from "next/dist/shared/lib/utils";

const Home: NextPage = () => {

  const [uploadedFiles, setUploadedFiles] = useState<any>([]);

  function getAccessToken() {
    console.log(process.env.NEXT_PUBLIC_WEB3STORAGE_TOKEN);
    return process.env.NEXT_PUBLIC_WEB3STORAGE_TOKEN;
  }

  function makeStorageClient() {
    const accessToken = getAccessToken() as string;
    console.log("accessToken", accessToken);
    return new Web3Storage({ token: accessToken });
  }

  const onSubmit = async (values: any) => {
    let uploadResponse;
    if (uploadedFiles?.target?.files.length > 0) {
      uploadResponse = await uploadedFiles(uploadedFiles);
      console.log("uploadResponse", uploadResponse);
    }

    values.file = uploadResponse?.data?.Hash;
    console.log("valuesssss", values);
    const client = makeStorageClient();
    const obj = {
      name: values.name,
      description: values.description,
      category: values.category,
      // thumbnail: values.img,
    };
    const blob = new Blob([JSON.stringify(obj)], { type: "application/json" });

    const files = [new File([blob], "metadata.json")];
    console.log(files);
    const metadata_cid = await client.put(files);

    console.log("stored files with cid:", metadata_cid);
  };
  const inputType = (uploadType: any) => {
    uploadType === "file" && document.getElementById("file")?.click();
    uploadType === "folder" && document.getElementById("folder")?.click();
  };

  const getEventFile = (e: any) => {
    setUploadedFiles(e);
  };

  const uploadedFile = async (uploadedFiles: any) => {
    console.log("first", uploadedFiles);

    uploadedFiles.persist();
    const uploadResponse = await lighthouse.upload(
      uploadedFiles,
      "e425247e-3e3e-4773-9d9a-5ae216ce5b3a"
    );
    return uploadResponse;
  };

  // const files = function getFiles () {
  //   const fileInput = document.querySelector('input[type="file"]')
  //   return fileInput.files
  // }
  const uploadFiles = async function storeFiles() {
    const fileInput = document.querySelector('input[type="file"]');
    const name: any = document.getElementById("fileName").value;
    console.log("name ==>", name);

    const files: any = fileInput.files;
    const client = makeStorageClient();
    const cid = await client.put(files);
    console.log("stored files with cid:", cid);
    localStorage.setItem("MyDrive " + name, cid + ".ipfs.w3s.link");

    return cid;
  };
  // const data: any = ["test1","test2","test3"];
  const data:any = []

  const response:any = {
    result:[

    ]
  }

  const getFiles = () => {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.includes("MyDrive")) {
        var res = key.split(" ");
        data.push(res[1]);
        console.log("Data ==> ", data);
      }
    }

    for (let i = 0; i < data.length; i++) {
      const key = data[i];
      response.result.push({"key":key,"link":localStorage.getItem(key)})
      console.log(`${key}: ${localStorage.getItem(key)}`);
    }
    //console.log("getResponse ==> ",getResponse);
    const column = response.result;
    console.log("***",column);
    const ThData = () => {
      return column.map((data)=>{
        return <tr> <th key={data.key}>{data.key}</th><th key={data.link}>{data.link}</th></tr> //<th key={data.link}>{data.link}</th>
      })
    }
    const tdData = () => {
      return response.result.map((data)=>{
        return (
          <tr>
            {column.map((cData)=>{
              return <td>{data[cData]}</td>
            })}
          </tr>
        )
      })
    } 
    const demo = ThData();

    console.log("ThDAta",demo); 
    return response;

    // setState({list:response.result})
    
  };
  


  // let response = list.map((item)=>{return (<tr><td>{item.key}</td></tr>)})
  
  return (
   
      <div className={styles.container}>
        <main className={styles.main}>
          <ConnectButton />
          <br></br>
         <div>
         <input type="file" />
          
         <input type="text" id="fileName" placeholder="Name of your file" />
        
         <button type="submit" onClick={getFiles}>
       Upload
     </button>
     
         </div>
         <br></br>
         <table>
          <tbody>
          <tr> <th key={data.key}>{data.key}</th><th key={data.link}>{data.link}</th></tr>

          </tbody>
         </table>

        

        </main>
      </div>

    
  );
}


export default Home;
