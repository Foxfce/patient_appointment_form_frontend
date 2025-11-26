import { GENERAL_EVENT, PATIENT_EVENT, PATIENT_STATUS } from "@/libs/constants/socket.constant"
import SessionCard from "./SessionCard"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useEffect, useState } from "react"
import { socket } from "../StaffView"

interface Session {
  sessionId: string
  status: PATIENT_STATUS

}

type SessionsList = Session[] | [];

function SessionList() {
  const [sessionsList, setSessionsList] = useState<SessionsList>([]);
  // const [currentStatus, setCurrentStatus] = useState<PATIENT_STATUS>();
  // const [sessionStatus, setSessionStatus] = useState(sessionsList);

  useEffect(() => {

    socket.on(GENERAL_EVENT.UPDATE_SESSION, (arrAllSession) => {
      // console.log(arrAllSession);
      setSessionsList(arrAllSession)
    });

    socket.on(PATIENT_EVENT.STATUS_CARD, ({ sessionId, status }) => {
      setSessionsList(prev =>
        prev.map(s =>
          s.sessionId === sessionId ? { ...s, status } : s
        )
      );
    });

    return () => {
      socket.off(GENERAL_EVENT.UPDATE_SESSION);
      socket.off(PATIENT_EVENT.STATUS_CARD);
    };
  }, []);

  return (
    <ScrollArea className="h-72 w-full rounded-md border">
      <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
        {
          sessionsList.map((session, index) =>
            <SessionCard 
          key={index} 
          index={index + 1} 
          sessionId={session.sessionId} 
          status={session.status} />
          )
        }
      </div>
    </ScrollArea>
  )
}

export default SessionList