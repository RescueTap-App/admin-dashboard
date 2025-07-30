import { useCallback, useState } from "react"
import { useDropzone } from "react-dropzone"
import { useUpload } from "@/hooks/use-upload"
import { cn } from "@/lib/utils"
import Image from "next/image"


interface ProfileImageUploadProps {
  label: string
  placeholderText?: string
  onUpload: (url: string) => void
  initialUrl?: string
}

export function ProfileImageUpload({
  label,
  placeholderText = "Take Profile Photo",
  onUpload,
  initialUrl,
}: ProfileImageUploadProps) {
  const { upload, uploadingFile } = useUpload()
  const [previewUrl, setPreviewUrl] = useState(initialUrl || "")

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0]
      if (!file) return

      const formData = new FormData()
      formData.append("file", file)

      const res = await upload(formData)
      if (res?.data) {
        setPreviewUrl(res.data)
        onUpload(res.data)
      }
    },
    [upload, onUpload]
  )

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      "image/*": [],
    },
    multiple: false,
  })

  return (
    <div className="space-y-2">
      <label className="text-sm font-semibold text-gray-800">{label}</label>
      <div
        {...getRootProps()}
        className={cn(
          "border-2 border-dashed border-gray-300 rounded-md flex items-center justify-center aspect-square w-32 cursor-pointer relative overflow-hidden",
          uploadingFile && "opacity-50 pointer-events-none"
        )}
      >
        <input {...getInputProps()} />
        {previewUrl ? (
          <Image src={previewUrl} alt="Profile" fetchPriority="high" className="object-cover w-full h-full rounded-md" />
        ) : (
          <div className="text-center flex flex-col items-center justify-center text-xs text-gray-500">
            <div className="w-12 h-12 bg-indigo-100 rounded-full mb-1 font-lato" />
            <span>{placeholderText}</span>
          </div>
        )}
      </div>
    </div>
  )
}
