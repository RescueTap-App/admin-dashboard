"use client"

import { useDropzone } from "react-dropzone"
import { useUpload } from "@/hooks/use-upload"
import { type Control, Controller } from "react-hook-form"
import { FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { cn } from "@/lib/utils"
import { useCallback } from "react"
import Image from "next/image"
import { CiImageOn } from "react-icons/ci"
import { Loader2, X } from "lucide-react"

interface UploadFieldProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: Control<any>
  name: string
  label?: string
  buttonLabel?: string
}

export function UploadField({ control, name, label, buttonLabel = "Upload" }: UploadFieldProps) {
  const { upload, uploadingFile } = useUpload()

  const UploadZone = ({ onChange, value }: { onChange: (val: string) => void; value: string }) => {
    const onDrop = useCallback(
      async (acceptedFiles: File[]) => {
        const file = acceptedFiles[0]
        const formData = new FormData()
        formData.append("file", file)
        const result = await upload(formData)
        if (result?.data) {
          onChange(result?.data)
        }
      },
      [onChange],
    )

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
      onDrop,
      accept: { "image/*": [] },
      multiple: false,
      disabled: uploadingFile,
    })

    return (
      <div
        {...getRootProps()}
        className={cn(
          "flex flex-col items-center justify-center h-40 border border-dashed border-gray-300 rounded cursor-pointer bg-white hover:border-primary",
          isDragActive && "bg-gray-100",
          uploadingFile && "cursor-not-allowed opacity-50",
        )}
      >
        <input {...getInputProps()} />
        {uploadingFile ? (
          <div className="flex flex-col items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm text-gray-700 mt-2">Uploading...</p>
          </div>
        ) : value ? (
          <div className="relative group">
            <Image src={value || "/placeholder.svg"} alt="Uploaded" width={80} height={80} className="rounded-full" />
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                onChange("")
              }}
              className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
              aria-label="Remove image"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center">
            <CiImageOn size={50} />
            <p className="text-sm text-gray-700">{buttonLabel}</p>
          </div>
        )}
      </div>
    )
  }

  return (
    <FormField
      control={control}
      name={name}
      render={() => (
        <FormItem>
          {label && <FormLabel className="mb-2 block">{label}</FormLabel>}
          <Controller
            control={control}
            name={name}
            render={({ field: controllerField }) => (
              <UploadZone onChange={controllerField.onChange} value={controllerField.value} />
            )}
          />
          <FormMessage className="text-red-600 text-xs font-light font-sans" />
        </FormItem>
      )}
    />
  )
}
