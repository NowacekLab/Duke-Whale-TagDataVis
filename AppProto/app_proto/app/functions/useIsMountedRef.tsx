import { useRef, useEffect } from "react";

export default function useIsMountedRef(){
    const isMountedRef = useRef<boolean | null>(null);
    useEffect(() => {
        isMountedRef ? isMountedRef.current = true : null;
        return () => {
          isMountedRef ? isMountedRef.current = false : null;
        }; 
    })
    return isMountedRef;
}