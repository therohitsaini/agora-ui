import React from 'react'
import { Fragment } from 'react'
import ChatUI from '../ChatComponents/ChatUI'
import Navbar from './Navbar'
import { useState } from 'react'

function WebChatBox() {

    const [height, setHeight] = useState("93vh")
    
    return (
        <Fragment>
            <Navbar />
            <ChatUI height={height} />
        </Fragment>

    )
}

export default WebChatBox