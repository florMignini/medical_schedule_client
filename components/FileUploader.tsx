"use client";
import { convertFileToUrl } from "@/lib";
import Image from "next/image";
import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import PencilIcon from "../public/assets/icons/upload.svg";

type FileUploaderProps = {
  files: File[] | undefined;
  onChange: (files: File[]) => void;
};
const FileUploader = ({ files, onChange }: FileUploaderProps) => {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    onChange(acceptedFiles);
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div {...getRootProps()} className="file-upload overflow-auto w-[100%]">
      <input {...getInputProps()} />
      {files && files?.length > 0 ? (
        files[0].type !== "application/pdf" ? (
          <Image
            src={convertFileToUrl(files[0])}
            alt="user-image"
            width={1000}
            height={1000}
            className="h-auto w-[100%] top-0 overflow-hidden mx-auto object-cover"
          />
        ) : (
          <object
            data={convertFileToUrl(files[0])}
            type="application/pdf"
            className="w-[100%]"
          ></object>
        )
      ) : (
        <>
          <Image src={PencilIcon} alt="pencil-icon" height={40} width={40} />
        </>
      )}
    </div>
  );
};

export default FileUploader;
