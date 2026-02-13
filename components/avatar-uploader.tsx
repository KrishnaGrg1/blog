"use client";
import { CldUploadButton, type CldUploadButtonProps } from "next-cloudinary";

interface UploadButtonProps extends Omit<CldUploadButtonProps, "uploadPreset"> {
  onUploadSuccess?: (result: any) => void;
  uploadPreset: string;
  cloudName?: string;
}

function UploadButton({
  onUploadSuccess,
  cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  ...props
}: UploadButtonProps) {
  return (
    <CldUploadButton
      {...props}
      options={{
        cloudName: cloudName,
        ...props.options,
      }}
      onSuccess={(result) => {
        if (onUploadSuccess && typeof result !== "string") {
          onUploadSuccess(result);
        }
      }}
    />
  );
}

export default UploadButton;
