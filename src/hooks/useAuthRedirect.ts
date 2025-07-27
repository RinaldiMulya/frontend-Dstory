// src/hooks/useAuthRedirect.ts
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { isLoggedIn } from "../app/lib/token"; 

export function useAuthRedirect() {
    const router = useRouter();
    const [isChecking, setIsChecking] = useState(true);

    useEffect(() => {
        // Berikan waktu untuk token tersimpan setelah login
        const checkAuth = () => {
            if (typeof window !== "undefined") {
                const loggedIn = isLoggedIn();
                
                if (!loggedIn) {
                    console.log("Not logged in, redirecting to login");
                    router.push("/login");
                } else {
                    console.log("User is logged in");
                }
                setIsChecking(false);
            }
        };

        // Delay sedikit untuk menghindari race condition
        const timeoutId = setTimeout(checkAuth, 200);
        
        return () => clearTimeout(timeoutId);
    }, [router]);

    return isChecking;
}