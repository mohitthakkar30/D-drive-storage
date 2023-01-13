import { ConnectButton } from "@rainbow-me/rainbowkit";
import type { NextPage } from "next";
import Head from "next/head";
import styles from "../styles/Home.module.css";
import { Web3Storage } from "web3.storage";
import { useState, useEffect } from "react";
import CryptoJS from "crypto-js";
import ABI from "../abi/driveABI";
import { ethers, Signer } from "ethers";
import { fetchSigner } from "@wagmi/core";
import { useAccount } from "wagmi";
import Spinner from "react-bootstrap/Spinner";
import 'bootstrap/dist/css/bootstrap.min.css';

const Home: NextPage = () => {
  const [updating, setUpdating] = useState(false);

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

  const inputType = (uploadType: any) => {
    uploadType === "file" && document.getElementById("file")?.click();
    uploadType === "folder" && document.getElementById("folder")?.click();
  };

  const getEventFile = (e: any) => {
    setUploadedFiles(e);
  };

  const uploadFiles = async function storeFiles() {
    const fileInput = document.querySelector('input[type="file"]');
    try {
      setUpdating(true);
      // @ts-ignore: Object is possibly 'null'
      const name: any = document.getElementById("fileName").value;
      // @ts-ignore: Object is possibly 'null'
      const files: any = fileInput.files;
      const client = makeStorageClient();
      const cid = await client.put(files);

      localStorage.setItem("MyDrive " + name, cid + ".ipfs.w3s.link");
      await encryption(cid + ".ipfs.w3s.link", name);
      getFiles();
      return cid;
    } catch (e) {
      console.log(e);
    } finally {
      setUpdating(false);
    }
  };
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
      }
    }

    for (let i = 0; i < data.length; i++) {
      const key = data[i];
      response.result.push({ key: key, link: localStorage.getItem(key) });
      tableCode =
        tableCode +
        `<tr><td>${key}</td><td><p><a href="${localStorage.getItem(
          "MyDrive " + key
        )}" target="_blank" rel="noopener noreferrer">${localStorage.getItem(
          "MyDrive " + key
        )}</a></p></td></tr>`;
    }

    const column = tableCode;
    setResult({ data: column, loading: false });
    return response;
  };

  function getKey() {
    return process.env.NEXT_PUBLIC_KEY;
  }
  const { address } = useAccount();
  const encryption = async (link: any, fileName: any) => {
    // @ts-ignore: Object is possibly 'undefined'
    const key: string = getKey();
    var encrypted = CryptoJS.AES.encrypt(link, key);

    const encryptResut = encrypted.toString();
    const contractAddress = "0x3D8a5f1921d9E4E672bB3b45d706e500F677ca17";
    const signer: any = await fetchSigner();
    const contract = new ethers.Contract(contractAddress, ABI, signer);
    await contract.setter(address, encryptResut, fileName);
  };

  const decryption = async (address: any) => {
    const contractAddress = "0x3D8a5f1921d9E4E672bB3b45d706e500F677ca17";
    const signer: any = await fetchSigner();
    const contract = new ethers.Contract(contractAddress, ABI, signer);
    // @ts-ignore: Object is possibly 'undefined'
    const key: string = getKey();
    try {
      const encrypted = await contract.getLink(address);
      const response = [];
      for (let i = 0; i < encrypted.length; i++) {
        let decrypted = CryptoJS.AES.decrypt(encrypted[i], key);
        response.push(decrypted.toString(CryptoJS.enc.Utf8));
      }
      console.log("Response  ", response);
    } catch (e) {
      // alert(e)
      console.log(e);
    }
  };
  const res = () => {
    decryption(address);
  };

  return (
    <div className={styles.common}>
      <div className={styles.left}>
        <div className={styles.h1}>
          <p >Easy and secure access to your content</p>
        </div>
        
        {/* <h1>Store data permanently</h1> */}
      </div>
      <div className={styles.container}>
        <main className={styles.main}>
          <ConnectButton />

          <br></br>
          <div>
            <div>
              <input type="file" />
              <br></br>
              <input
                type="text"
                className={styles.text_input}
                id="fileName"
                placeholder="Give name to your file"
              />
              <button type="submit" className={styles.newbtn} onClick={uploadFiles} disabled={updating}>
                <span>
                  {updating ? <Spinner animation="border"></Spinner> : "Upload"}
                </span>
              </button>

              <button type="submit"  className={styles.newbtn} onClick={res}>
                Get Files
              </button>
            </div>
            <br></br>
            <br></br>
            <div className={styles.tab}>
            <table dangerouslySetInnerHTML={{ __html: result.data }} ></table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Home;
