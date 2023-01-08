import { ConnectButton } from "@rainbow-me/rainbowkit";
import type { NextPage } from "next";
import Head from "next/head";
import styles from "../styles/Home.module.css";
import { Web3Storage } from "web3.storage";
import { useState, useEffect } from "react";


const Home: NextPage = () => {
  const [uploadedFiles, setUploadedFiles] = useState<any>([]);
  const [result, setResult] = useState({ data: "", loading: true });

  function getAccessToken() {
    // console.log(process.env.NEXT_PUBLIC_WEB3STORAGE_TOKEN);
    return process.env.NEXT_PUBLIC_WEB3STORAGE_TOKEN;
  }

  function makeStorageClient() {
    const accessToken = getAccessToken() as string;
    // console.log("accessToken", accessToken);
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

  // const uploadedFile = async (uploadedFiles: any) => {
  //   console.log("first", uploadedFiles);

  //   uploadedFiles.persist();
  //   const uploadResponse = await lighthouse.upload(
  //     uploadedFiles,
  //     "e425247e-3e3e-4773-9d9a-5ae216ce5b3a"
  //   );
  //   return uploadResponse;
  // };

  // const files = function getFiles () {
  //   const fileInput = document.querySelector('input[type="file"]')
  //   return fileInput.files
  // }
  const uploadFiles = async function storeFiles() {
    const fileInput = document.querySelector('input[type="file"]');
    try{
      // @ts-ignore: Object is possibly 'null'
      const name: any = document.getElementById("fileName").value;
      console.log("name ==>", name);
      // @ts-ignore: Object is possibly 'null'
      const files: any = fileInput.files;
      const client = makeStorageClient();
      const cid = await client.put(files);
      console.log("stored files with cid:", cid);
      localStorage.setItem("MyDrive " + name, cid + ".ipfs.w3s.link");
  
      return cid;

    }catch(e)
    {
      console.log(e);
      
    }
   
  };
  // const data: any = ["test1","test2","test3"];
  const data: any = [];

  const response: any = {
    result: [],
  };
  var tableCode = `<tr><th>Name</th><th>Links</th></tr>`;
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
      response.result.push({ key: key, link: localStorage.getItem(key) });
      console.log(`${key}: ${localStorage.getItem("MyDrive " + key)}`);
      tableCode =
        tableCode +
        `<tr><td>${key}</td><td><p><a href="${localStorage.getItem(
          "MyDrive " + key
        )}" target="_blank" rel="noopener noreferrer">${localStorage.getItem(
          "MyDrive " + key
        )}</a></p></td></tr>`;
    }

    //console.log("getResponse ==> ",getResponse);
    const column = tableCode;
    setResult({ data: column, loading: false });
    console.log(tableCode);

    return response;

    // setState({list:response.result})
  };

  // let response = list.map((item)=>{return (<tr><td>{item.key}</td></tr>)})

  return (
    <div className={styles.common}>
      <div className={styles.left}>
        <h1>Easy and secure access to your content</h1>
        {/* <h1>Store data permanently</h1> */}
      </div>
      <div className={styles.container}>
        <main className={styles.main}>
          <ConnectButton />

          <br></br>
          <div>
            <input type="file" />

            <input type="text" className={styles.text_input} id="fileName" placeholder="Give name to your file" />
            <button type="submit" onClick={uploadFiles}>
              {" "}
              Upload
            </button>
            
            <button type="submit" onClick={getFiles}>
              Get Files
            </button>
            <br></br>
            <br></br>
            <table dangerouslySetInnerHTML={{ __html: result.data }}></table>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Home;
