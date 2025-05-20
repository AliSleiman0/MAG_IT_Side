import { PlanOfStudy, PlanOfStudyGet } from '../pages/30/Students';
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
export const DeletePOS = async (depId :number): Promise<string> => {
    try {
        const response = await api.post('/remove_pos', { "departmentid": depId});
        return response.data.message;
    } catch (error: any) {
        const errorMessage = error.response?.data?.message || 'Delete failed';
        throw new Error(errorMessage);
    }
};
export const GetDepartmentsPOS = async (): Promise<PlanOfStudyGet[]> => {
    try {
        const response = await api.get('/getAllDepartmentsPOS');
        return response.data;
    } catch (error: any) {
        const errorMessage = error.response?.data?.message || 'Request failed';
        throw new Error(errorMessage);
    }
};