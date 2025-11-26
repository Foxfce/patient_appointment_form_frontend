'use client'

import { GENERAL_EVENT, PATIENT_EVENT } from "@/libs/constants/socket.constant";
import { useEffect, useState } from "react"
import io from "socket.io-client";

let socket: ReturnType<typeof io> | null = null;

function StaffPage() {
    const [sessionId, setSessionId] = useState('');
    const [patientData, setPatientData] = useState<any>(null);
    const [status, setStatus] = useState('unknown');

    useEffect(() => {
        socket = io(process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:4000');

        return () => {
            socket?.disconnect();
        };
    }, []);

    useEffect(() => {
        if (!socket) return;

        socket.on(PATIENT_EVENT.UPDATE, (data) => setPatientData(data));
        socket.on(PATIENT_EVENT.STATUS, ({ status }) => setStatus(status));
        socket.on(GENERAL_EVENT.SNAPSHOT, (snap) => setPatientData(snap));

        return () => {
            socket?.off(PATIENT_EVENT.UPDATE);
            socket?.off(PATIENT_EVENT.STATUS);
            socket?.off(GENERAL_EVENT.SNAPSHOT);
        };
    }, []);

    const watchSession = () => {
        if (!socket || !sessionId) return;
        socket.emit(GENERAL_EVENT.JOIN, { sessionId, role: 'staff' });
    };

    return (
        <div className="p-4">
            <h1 className="text-2xl font-semibold mb-4">Staff Monitoring</h1>
            <div className="mb-4">
                <input 
                value={sessionId}
                onChange={(e)=> setSessionId(e.target.value)}
                placeholder="Session ID"
                className="input"
                 />
                 <button
                 onClick={watchSession}
                 className="btn ml-2"
                 >Watch</button>
            </div>

            <div className="space-y-2">
                <div>Status: <span className="font-medium">{status}</span></div>
                <pre className="p-4 bg-gray-500 rounded">{JSON.stringify(patientData, null, 2)}</pre>
            </div>
        </div>
    )
}

export default StaffPage