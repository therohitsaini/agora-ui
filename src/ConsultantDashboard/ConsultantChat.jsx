import React from 'react'
import ChatUI from '../ChatComponents/ChatUI'
import { Fragment } from 'react'
import { useState } from 'react';
import { useEffect } from 'react';

function ConsultantChat() {
    const [id, setId] = useState(null);
    const [consultantUsers, setConsultantUsers] = useState([]);
    useEffect(() => {
        const id = localStorage.getItem('user-ID');
        setId(id);
    }, []);

    const getConsultantUsers = async (id) => {
        if (!id) {
            console.log("Id is not found");
            return;
        }
        try {
            const url = `${import.meta.env.VITE_BACK_END_URL}/api-consultant/consultant-all-user/${id}`;
            const res = await fetch(url, {
                method: "GET",
                headers: { "Content-Type": "application/json" }
            });
            const { userData } = await res.json();
 
            if (res.ok) {
                setConsultantUsers(userData);
            }
            else {
                console.log("Failed to get consultant users");
            }
        } catch (err) {
            console.log("Error in getConsultantUsers", err);
        }
    }
    useEffect(() => {
        getConsultantUsers(id);
    }, [id]);



    return (
        <Fragment>
            <ChatUI consultantUsers={consultantUsers} />
        </Fragment>
    )
}

export default ConsultantChat