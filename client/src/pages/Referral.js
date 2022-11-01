import React, { useEffect, useState } from "react";
import Web3 from "web3";
import Web3Modal from "web3modal";
import swal from "sweetalert";
import WalletConnectProvider from "@walletconnect/web3-provider";

import { contract_address, contract_abi } from "../config.js"
import LeftImage from '../assets/15.webp'
import RightImage from '../assets/13.webp'
import Copy from '../assets/copy.png'
import "reactjs-popup/dist/index.css";
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { v4 as uuidv4 } from 'uuid';
import axios from "axios"

const Referral = () => {
    // const [unstaked_Ifmale, setunstaked_Ifmale] = useState([1, 2]);
    // const [show, setShow] = React.useState(false);
    // const [showClassText, setShowClassText] = React.useState("");
    // const asdasd = [1, 3];
    // function toggle_Show() {
    //   if (showClassText == "") {
    //     console.log("show");
    //     setShowClassText("show");
    //     //document.body.append('<div className="modal-backdrop fade show"></div>');
    //   } else {
    //     setShowClassText("");
    //     // document.body.append('<div className="modal-backdrop fade" onClick:{toggle_Show}></div>');
    //   }
    // }

    useEffect(() => {
        // setCopyValue(`http://localhost:3000/${uuidv4()}`)
        //fetch_data();
        //connect_wallet();
    }, []);
    const [connected, setConnected] = useState(false);
    const [wladdress, setwladdress] = useState();
    const [balance, setbalance] = useState(0);
    const [pending, setpending] = useState(0);
    const [totalrewards, settotalrewards] = useState(0);
    const [mintNumber, setMintNumber] = useState(1);
    const [totalsupply, settotalsupply] = useState(0);
    const [price, set_price] = useState(0);
    const [copied, setCopied] = useState(false);
    const [copyValue, setCopyValue] = useState("");
    // const [total, set_total] = useState(0.2);
    // set_total(mintNumber * price);
    let total = mintNumber * price;

    const mintButtonClickHandler = () => {
        // sale_controller();

    };

    let url;

    if (process.env.NODE_ENV === 'production') {
        url = process.env.REACT_APP_BACKEND_URL
    } else {
        url = "http://localhost:3000"
    }

    const [walletstatus, set_walletstatus] = useState("Connect Wallet");

    const checkReferralStatusOrCreateReferralLink = async (d) => {
        await axios.post(`/api/users/check`, { walletAddress: d, referralLink: url }).then(res => {
            if (res.statusText === "OK") {
                swal("Success", "Link generated", "success");
                setConnected(true);
                setCopyValue(res.data.referralLink);
            } else {
                swal("Error", "Link not generated", "Error")
            }
        })
    }

    async function connect_wallet() {
        if (Web3.givenProvider) {
            const providerOptions = {
                walletconnect: {
                    package: WalletConnectProvider, // required
                    options: {
                        infuraId: "https://mainnet.infura.io/v3/3ca1583421a74069b07075f209879afb" // required
                    }
                },
                coinbasewallet: {
                    // package: CoinbaseWalletSDK, // Required
                    options: {
                        appName: "FlyGuyz", // Required
                        infuraId: "https://mainnet.infura.io/v3/3ca1583421a74069b07075f209879afb", // Required
                        rpc: "", // Optional if `infuraId` is provided; otherwise it's required
                        chainId: 1, // Optional. It defaults to 1 if not provided
                        darkMode: false // Optional. Use dark theme, defaults to false
                    }
                }
            };

            const web3Modal = new Web3Modal({
                network: "mainnet", // optional
                cacheProvider: true, // optional
                providerOptions, // required
            });

            const provider = await web3Modal.connect();
            const web3 = new Web3(provider);
            const addresses = await web3.eth.getAccounts();
            const address = addresses[0];

            web3.eth.net.getId().then((result) => {
                console.log("Network id: " + result);
                if (result !== 1) {
                    swal("Wrong Network Selected. Select Ethereum Mainnet");
                }
            });
            set_walletstatus("Wallet Connected");
            setwladdress(address);
            console.log("Default address: " + address)
            checkReferralStatusOrCreateReferralLink(address)
            fetch_data();
        } else {
            swal("Web3 Not Found");
        }
    }

    async function show_error_alert(error) {
        let temp_error = error.message.toString();
        console.log(temp_error);
        let error_list = [
            "HODLeR Shoes :: Not Yet Active.",
        ];

        for (let i = 0; i < error_list.length; i++) {
            if (temp_error.includes(error_list[i])) {
                // set ("Transcation Failed")
                // alert(error_list[i]);
                swal("Alert!", error_list[i], "warning");
            }
        }
    }

    async function fetch_data() {
        if (Web3.givenProvider) {
            const web3 = new Web3(Web3.givenProvider);
            await Web3.givenProvider.enable();
            const contract = new web3.eth.Contract(contract_abi, contract_address);

            const addresses = await web3.eth.getAccounts();
            const address = addresses[0];
            console.log("addresses[0]: " + addresses[0]);
            // console.log("addresses[1]: "+addresses[1])
            // console.log("Default address: "+await web3.eth.defaultAccount)
            contract.methods.balanceOf(address).call((err, result) => {
                console.log("error: " + err);
                console.log(result);
                setbalance(result);
            });

            contract.methods.getVestingSchedulesCountByBeneficiary(address).call((err, result) => {
                console.log("error: " + err);
                console.log(result);
                setpending(result);
            });

            contract.methods.getVestingSchedulesTotalAmount().call((err, result) => {
                console.log("error: " + err);
                console.log(result);
                settotalrewards(result);
            });
            // await contract.methods.tokenByIndex(i).call();
        }
    }

    async function claim_manually() {
        if (Web3.givenProvider) {
            const web3 = new Web3(Web3.givenProvider);
            await Web3.givenProvider.enable();
            const contract = new web3.eth.Contract(contract_abi, contract_address);
            const addresses = await web3.eth.getAccounts();
            const address = addresses[0];
            console.log("addresses[0]: " + addresses[0]);
            // console.log("addresses[1]: "+addresses[1])
            // console.log("Default address: "+await web3.eth.defaultAccount)
            try {
                const estemated_Gas = await contract.methods.claimFromAllVestings().send({
                    from: address,
                    maxPriorityFeePerGas: null,
                    maxFeePerGas: null,
                });
                console.log(estemated_Gas);
                const result = await contract.methods.claimFromAllVestings().send({
                    from: address,
                    gas: estemated_Gas,
                    maxPriorityFeePerGas: null,
                    maxFeePerGas: null,
                });
            } catch (error) {
                show_error_alert(error);
            }
        }
    }

    setTimeout(() => {
        setCopied(false)
    }, 10000);
    return (
        <div className="referral">
            <div>
                <h1 className="fs-50 text-uppercase text-rose text-center mb-2 mb-md-4 fw-bold"><span className="text-shadow">Invite your</span>  friends and earn <span className="text-shadow">FlyGuyz</span></h1>
                <div className="main-container grid grid-cols-1 md:grid-cols-2 gap-x-10">
                    <div>
                        <img src={LeftImage} alt="Left" />
                        <h3 className="text-white">Share your personal link</h3>
                        <h3 className="text-white">with your friends</h3>
                    </div>
                    <div>
                        <img src={RightImage} alt="Right" />
                        <h3 className="text-white">Earn 5% of the invested</h3>
                        <h3 className="text-white">amount in FlyGuyz</h3>
                    </div>
                </div>
                {
                    !connected ?
                        <div className="mt-5">
                            <button className="btn btn-blue fs-15 rounded-pill" onClick={connect_wallet}> Connect </button>
                        </div>
                        :
                        <div className="mt-5 copySection">
                            <input disabled value={copyValue} onChange={({ target: { value } }) => { setCopied(true); setCopyValue(value) }} />
                            <CopyToClipboard text={copyValue} onCopy={() => setCopied(true)}>
                                <img src={Copy} alt="copy" />
                            </CopyToClipboard>
                            {
                                copied &&
                                <span className="copied">Copied</span>
                            }
                        </div>
                }
            </div>
        </div>
    )
}

export default Referral
