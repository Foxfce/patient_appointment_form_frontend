'use client'

import { ADMIN_EVENT, GENERAL_EVENT, PATIENT_EVENT, USER_ROLE } from "@/libs/constants/socket.constant";
import { useEffect, useState } from "react"
import io from "socket.io-client";
import SessionList from "./components/SessionList";
import PatientFormMonitoring from "./components/PatientFormMonitoring";
import { useSessionStore } from "@/stores/sessionStore";

export let socket: ReturnType<typeof io> = io(process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:4000');

function StaffPage() {
    const { sessionId, setSessionId, watchSession } = useSessionStore();
    const [patientData, setPatientData] = useState<any>(null);
    const [status, setStatus] = useState('unknown');

    useEffect(() => {
        socket.emit(GENERAL_EVENT.JOIN, { sessionId, role: USER_ROLE.ADMIN });

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

    return (
        <div className="p-4">
            <div>

            </div>
            <h1 className="text-2xl font-semibold mb-4">Staff Monitoring</h1>
            <div className="w-full">
                <SessionList />
            </div>
            <div className="flex justify-between items-center px-20">
                <div className="my-4 text-xl font-semibold">
                    <span>Watching: </span>
                    <span>{sessionId ? sessionId : 'none'}</span>
                    {/* <input
                    value={sessionId}
                    onChange={(e) => setSessionId(e.target.value)}
                    placeholder="Session ID"
                    className="input"
                    /> */}
                </div>

                <div className="space-y-2">
                    <div>Status: <span className="font-medium">{status}</span></div>
                </div>
            </div>
            <div className="bg-gray-300 w-full h-full flex justify-center py-20">
                <div className="bg-white w-fit h-fit p-20 rounded-xl">
                    <PatientFormMonitoring data={patientData} />
                </div>
            </div>
        </div>
    )
}

export default StaffPage