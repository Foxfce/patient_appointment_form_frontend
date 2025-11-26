import { socket } from '@/components/admin/StaffView';
import { ADMIN_EVENT, GENERAL_EVENT, USER_ROLE } from '@/libs/constants/socket.constant';
import { create } from 'zustand';

interface SessionStore {
    sessionId: string;
    prevSessionId: string;
    setSessionId: (sessionId: string) => void;
    setPrevSessionId: (sessionId: string) => void;
    watchSession: () => void;
}

export const useSessionStore = create<SessionStore>()(
    (
        (set,get) => ({
            sessionId: '',
            prevSessionId:'',
            setSessionId: (sessionId: string) => set(state => ({sessionId: sessionId})),
            setPrevSessionId: (sessionId: string) => set(state => ({prevSessionId: sessionId})),
            watchSession : () => {
                    if (!socket || !get().sessionId) return;
                    const prevSessionId = get().prevSessionId;
                    const sessionId = get().sessionId;
                    if (prevSessionId) {
                        console.log('leaving'+prevSessionId);
                        socket.emit(GENERAL_EVENT.LEAVE, { prevSessionId })
                    };
                    get().setPrevSessionId(sessionId);
                    socket.emit(ADMIN_EVENT.REQUEST_SESSION, { sessionId, role: USER_ROLE.ADMIN });
                },
        })
    )
);