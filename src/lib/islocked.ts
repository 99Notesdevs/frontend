import { env } from "@/config/env";
import Cookies from "js-cookie";

export const isLocked = async () => {
    try {
        const response = await fetch(`${env.API}/admin/ops`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${Cookies.get('token')}`
            }
        });
        
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        
        const data = await response.json();
        console.log("data");
        console.log(data.data.globalRestrictions);
        return data.data.globalRestrictions;
    } catch (error) {
        console.error('Error:', error);
        return false;
    }
};