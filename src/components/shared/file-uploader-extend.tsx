"use client"

import { useDropzone, type FileRejection } from "react-dropzone"
import { useUpload } from "@/hooks/use-upload"
import { type Control } from "react-hook-form"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { cn } from "@/lib/utils"
import { useCallback, useEffect, useState } from "react"
import Image from "next/image"
import { Image as ImageIcon, Loader2, X } from "lucide-react"
import { toast } from "sonner"

interface UploadZoneProps {
  onChange: (val: string) => void
  value: string
  buttonLabel?: string
  disabled?: boolean
  className?: string
  onLoadingChange?: (loading: boolean) => void
}

interface ImageUploaderProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: Control<any>
  name: string
  label?: string
  buttonLabel?: string
  disabled?: boolean
  className?: string
  onLoadingChange?: (loading: boolean) => void
}

interface FileWithPreview extends File {
  preview: string
  uploading?: boolean
}

const UploadZone = ({
  onChange,
  value,
  buttonLabel = "Upload",
  disabled = false,
  className = "",
  onLoadingChange
}: UploadZoneProps) => {
  const { upload, uploadingFile } = useUpload()
  const [localFile, setLocalFile] = useState<FileWithPreview | null>(null)

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (acceptedFiles.length === 0) return

      const file = acceptedFiles[0]
      const fileWithPreview = Object.assign(file, {
        preview: URL.createObjectURL(file),
        uploading: true
      }) as FileWithPreview

      setLocalFile(fileWithPreview)

      try {
        const formData = new FormData()
        formData.append("file", file)
        const result = await upload(formData)

        if (result?.data) {
          onChange(result.data)
        }
      } catch (error) {
        console.error("Upload error:", error)
        toast.error("Failed to upload image")
      } finally {
        setLocalFile(null)
      }
    },
    [onChange, upload]
  )

  const onDropRejected = useCallback((fileRejections: FileRejection[]) => {
    const fileRejection = fileRejections[0]
    const fileError = fileRejection.errors[0]

    if (fileError.code === 'file-too-large') {
      toast.error('File is too large')
    } else if (fileError.code === 'file-invalid-type') {
      toast.error('Invalid file type. Please upload an image.')
    } else {
      toast.error('Failed to upload file')
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    onDropRejected,
    accept: { "image/*": [] },
    multiple: false,
    disabled: disabled || uploadingFile,
  })

  const removeImage = useCallback(() => {
    onChange("")
  }, [onChange])

  const removeLocalFile = useCallback(() => {
    if (localFile) {
      URL.revokeObjectURL(localFile.preview)
      setLocalFile(null)
    }
  }, [localFile])

  // Notify parent component of loading state changes
  useEffect(() => {
    onLoadingChange?.(uploadingFile || !!localFile?.uploading)
  }, [uploadingFile, localFile?.uploading, onLoadingChange])

  // Cleanup preview on unmount
  useEffect(() => {
    return () => {
      if (localFile) {
        URL.revokeObjectURL(localFile.preview)
      }
    }
  }, [localFile])

  const isUploading = uploadingFile || !!localFile?.uploading
  const hasImage = !!value || !!localFile

  return (
    <div className={cn("w-full", className)}>
      <div
        {...getRootProps()}
        className={cn(
          "flex flex-col items-center justify-center h-40 border-2 border-dashed border-gray-300 rounded-md cursor-pointer bg-white transition-colors",
          isDragActive && "border-primary bg-primary/5",
          (disabled || isUploading) && "opacity-50 cursor-not-allowed",
          !disabled && !isUploading && "hover:border-primary"
        )}
      >
        <input {...getInputProps()} />

        {isUploading ? (
          <div className="flex flex-col items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm text-gray-700 mt-2">Uploading...</p>
          </div>
        ) : hasImage ? (
          <div className="relative group h-36 w-full">
            <Image
              src={localFile?.preview || value || "/placeholder.svg"}
              alt="Uploaded Image"
              fill
              fetchPriority="high"
              className="object-contain object-center"
            />

            {localFile?.uploading && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded">
                <Loader2 className="h-6 w-6 text-white animate-spin" />
              </div>
            )}

            {!disabled && !localFile?.uploading && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  if (localFile) {
                    removeLocalFile()
                  } else {
                    removeImage()
                  }
                }}
                className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                aria-label="Remove image"
              >
                <X className="h-3 w-3" />
              </button>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center">
            <ImageIcon className="w-6 h-6 text-gray-400 mb-2" />
            <p className="text-sm text-gray-600 text-center">
              {isDragActive
                ? "Drop the image here..."
                : "Drag 'n' drop an image here, or click to select"}
            </p>
            <p className="text-xs text-gray-400 mt-1">{buttonLabel}</p>
          </div>
        )}
      </div>

      {!hasImage && !isUploading && (
        <div className="text-center py-2 text-gray-500">
          <p className="text-xs">No image uploaded yet</p>
        </div>
      )}
    </div>
  )
}

export function ImageUploader({
  control,
  name,
  label = "Upload Image",
  buttonLabel = "Upload",
  disabled = false,
  className,
  onLoadingChange
}: ImageUploaderProps) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field: { onChange, value } }) => (
        <FormItem>
          {label && <FormLabel className="mb-2 block">{label}</FormLabel>}
          <FormControl>
            <UploadZone
              onChange={onChange}
              value={value || ""}
              buttonLabel={buttonLabel}
              disabled={disabled}
              className={className}
              onLoadingChange={onLoadingChange}
            />
          </FormControl>
          <FormMessage className="text-red-600 text-xs font-light font-sans" />
        </FormItem>
      )}
    />
  )
}

// Keep UploadField for backward compatibility if needed elsewhere
export function UploadField({ control, name, label }: Omit<ImageUploaderProps, 'buttonLabel' | 'disabled' | 'className' | 'onLoadingChange'>) {
  return (
    <ImageUploader
      control={control}
      name={name}
      label={label}
    />
  )
}