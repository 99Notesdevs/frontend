import { api } from "@/config/api/route";

export const isLocked = async () => {
    try {
        const response = await api.get(`/admin/ops`) as { success: boolean; data: { globalRestrictions: boolean } };
        
        if (!response.success) {
            throw new Error('Network response was not ok');
        }
        
        const data = response.data;
        return data.globalRestrictions;
    } catch (error) {
        console.error('Error:', error);
        return false;
    }
};