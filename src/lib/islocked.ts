import { api } from "@/config/api/route";

export const isLocked = async () => {
    try {
        const response = await api.get(`/admin/ops`) as { success: boolean; data: any };
        
        if (!response.success) {
            throw new Error('Network response was not ok');
        }
        
        const data = await response.data;
        console.log("data");
        console.log(data.data.globalRestrictions);
        return data.data.globalRestrictions;
    } catch (error) {
        console.error('Error:', error);
        return false;
    }
};