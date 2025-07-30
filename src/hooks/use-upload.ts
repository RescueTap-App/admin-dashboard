import { useUploadFileMutation } from "@/redux/features/upload-api"
import { toast } from "sonner"

export function useUpload() {
    const [uploadFile, { isLoading: uploadingFile }] = useUploadFileMutation()

    const upload = async (file: FormData) => {
        try {
            const res = await uploadFile({ file }).unwrap();
            toast.success("File uploaded successfully");
            return res;
        } catch (error: unknown) {
            const errorMessage = (error as { data?: { message: string } })?.data?.message || "Failed to upload file"
            toast.error(errorMessage)
            console.log(error)
        }
    };
    return {
        upload,
        uploadingFile
    }
}
