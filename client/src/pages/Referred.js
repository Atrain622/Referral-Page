import axios from 'axios';
import React, { useEffect } from 'react'
import swal from 'sweetalert';

const Referred = () => {
    const referralCode = window.location.pathname.split("/")[1];

    const addReferral = async () => {
        await axios.put(`/api/users/add/${referralCode}`, { referralCode, walletAddress: "qjwdjwd" }).then(res => {
            if (res.statusText === "OK") {
                swal("Success", "Referral added", "success");
            } else {
                swal("Error", "Referral could not be added", "Error")
            }
        })
    }

    useEffect(() => {
        addReferral();

        return () => {

        }
    }, []);


    return (
        <div className='Referred text-center' style={{ paddingTop: "300px" }}>
            <h1 className='text-white'>{referralCode}</h1>
        </div>
    )
}

export default Referred
