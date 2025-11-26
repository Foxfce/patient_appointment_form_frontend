import {
  Card,
  CardContent,
  CardFooter,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { PATIENT_EVENT, PATIENT_STATUS } from "@/libs/constants/socket.constant"
import { useEffect, useState } from "react"
import { socket } from "../StaffView"
import { useSessionStore } from "@/stores/sessionStore"

type Props = {
  index: number
  sessionId: string,
  status: PATIENT_STATUS
}

type variants = "default" | "secondary" | "destructive" | "outline" | 'good' |'idle'|'active'| null | undefined;

function SessionCard({ index, sessionId, status }: Props) {

  const handleSetVariant = (status: PATIENT_STATUS) => {
    switch (status) {
      case PATIENT_STATUS.ACTIVE:
        setVariant('active');
        break;
      case PATIENT_STATUS.FILLING:
        setVariant('active');
        break;
      case PATIENT_STATUS.IDLE:
        setVariant("idle");
        break;
      case PATIENT_STATUS.INACTIVE:
        setVariant('destructive');
        break;
      case PATIENT_STATUS.SUBMIT:
        setVariant('good');
        break;
        default:
          return;
    }
  }

  const {watchSession, setSessionId} = useSessionStore();
  const currentSessionId = sessionId;
  const [variant, setVariant] = useState<variants>('default');

  useEffect(() => {
    handleSetVariant(status);
  }, [status]);

  return (
    <Card 
    onClick={()=>{
      setSessionId(currentSessionId)
      watchSession()
    }}
    className="flex-row py-4 px-2 justify-between w-full h-15 bg-gray-100 hover:bg-gray-200 items-center my-2 cursor-pointer transition-all"
    >
      <CardContent className="flex gap-4 overflow-hidden">
        <p className="hidden md:block font-semibold">{index}</p>
        <span className="truncate text-md">SessionID : {sessionId}</span>
      </CardContent>
      <CardFooter className="flex gap-2 pr-2">
        <span className="text-nowrap">status : </span>
        <Badge variant={variant}>{status}</Badge>
      </CardFooter>
    </Card>
  )
}

export default SessionCard

