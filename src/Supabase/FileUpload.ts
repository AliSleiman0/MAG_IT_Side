import { supabase } from "./supabaseClient";
export const uploadImage = async (file: File): Promise<string> => {
    // Generate a unique file name
    const timestamp = Date.now();
    const fileExt = file.name.split('.').pop();
    const filePath = `${timestamp}_${file.name}.${fileExt}`;

    const { error } = await supabase.storage
        .from('uploads')
        .upload(filePath, file);

    if (error) {
        throw new Error(`Upload failed: ${error.message}`);
    }
    return filePath; // Return the file path to later retrieve its public URL
};
export const listImages = async (): Promise<{ name: string }[]> => {
    const { data, error } = await supabase.storage.from('uploads').list('');
    if (error) {
        throw new Error(`Listing images failed: ${error.message}`);
    }
    return data;
};
export const getImageUrl = (filePath: string): string => {
    const { data } = supabase.storage.from('uploads').getPublicUrl(filePath);
    return data.publicUrl;
};
export const deleteImage = async (filePath: string): Promise<void> => {
    const { error } = await supabase.storage.from('uploads').remove([filePath]);
    if (error) {
        throw new Error(`Delete failed: ${error.message}`);
    }
};
export const updateImage = async (oldFilePath: string, newFile: File): Promise<string> => {
    await deleteImage(oldFilePath);
    return await uploadImage(newFile);
};
