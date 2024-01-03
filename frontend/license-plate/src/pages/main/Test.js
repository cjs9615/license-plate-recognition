import SideBar from "../../components/comm/SideBar"
import { useEffect, useRef, useState } from "react"

import React from 'react'

const Test = () => {
    const [messages, setMessages] = useState();
    const webSocket = useRef(null);


    useEffect(() => {
        webSocket.current = new WebSocket("ws://10.125.121.216:8080/pushservice");
        webSocket.current.onopen = () => {
            console.log("연결");
        }

        webSocket.current.onmessage = (event) => {
            console.log("message : ", event.data);
            setMessages(event.data);
        };
    }, [])
    return (
        <div className="grow flex">
            <SideBar />
            <div className="w-[80%] px-[1rem] md:px-[6rem] md:mt-[1.5rem]">
                소켓 연결 테스트
                {messages && <div>{messages}</div>}
            </div>
        </div>
    )
}

export default Test;