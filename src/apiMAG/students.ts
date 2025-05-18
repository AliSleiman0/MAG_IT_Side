import { PlanOfStudy } from '../pages/30/Students';
import api from './api';

export const uploadPOS = async (pos: PlanOfStudy): Promise<string> => {
    try {
        const response = await api.post('/set_pos', pos);
        return response.data.message;
    } catch (error: any) {
        const errorMessage = error.response?.data?.message || 'Upload failed';
        throw new Error(errorMessage);
    }
};
