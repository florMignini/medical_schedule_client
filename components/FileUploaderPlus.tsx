import Image from "next/image";
import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
type FileUploaderPlusProps = {
    files?: File[] | undefined;
    onChange: (files: File[]) => void;
    setIsTthereAnImage?: (isThereAnImage: boolean) => void;
  };
const FileUploaderPlus = ({files, onChange, setIsTthereAnImage }: FileUploaderPlusProps) => {
  const [filesPreview, setFilesPreview] = useState<File[]>([]);

  const onDrop = (acceptedFiles:File[]) => {
    // Convertimos los archivos a un formato legible
    const mappedFiles = acceptedFiles.map((file:File) =>
      Object.assign(file, {
        preview: URL.createObjectURL(file),
      })
    );
    setFilesPreview((prev) => [...prev, ...mappedFiles]);
    onChange([...filesPreview, ...mappedFiles]);
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: { 'image/*': [], 'application/pdf': [] },
    multiple: true, 
  });

  const removeFile = (file:File) => {
    setFilesPreview(filesPreview.filter((f) => f !== file));
    if (setIsTthereAnImage) {
      setIsTthereAnImage(false);
    }
  };

  const removeAllFiles = () => {
    setFilesPreview([]);
    if (setIsTthereAnImage) {
      setIsTthereAnImage(false);
    }
  };
console.log(filesPreview)
  return (
    <div className="dropzone-container">
      <div
        {...getRootProps()}
        className="file-upload overflow-auto w-[100%]"
      >
        <input {...getInputProps()} />
        <p className="text-black">Arrastra tus archivos aquí o haz clic para seleccionar</p>
      </div>
      {filesPreview.length > 0 && (
        <div className="files-list mt-4">
          <h4>Archivos seleccionados:</h4>
          <ul className="flex w-[100%] gap-5 flex-col">
            {filesPreview && filesPreview.map((file: any, index) => (
              <li key={index} className="file-item flex items-center gap-4 flex-col">
                {
                    file.type === "application/pdf" ? (
                        <object
                        data={file.preview}
                        width="100%"
                        height="100%"
                        type="application/pdf"
                        className="top-0 overflow-hidden mx-auto object-cover"
                      ></object>
                    ) : (
                        <Image
                  src={file.preview}
                  alt={file.name}
                  width={1000}
                  height={1000}
                  className="h-auto w-[100%] top-0 overflow-hidden mx-auto object-cover"
                />
                )}
                <div className="file-details">
                  <p>{file.name}</p>
                  <p className="text-sm text-gray-500">{file.size} bytes</p>
                </div>
                <button
                  onClick={() => removeFile(file)}
                  className="remove-file-btn text-red-500 hover:underline"
                >
                  Eliminar
                </button>
              </li>
            ))}
          </ul>
          <button
            onClick={removeAllFiles}
            className="clear-all-btn mt-4 text-white bg-red-500 px-4 py-2 rounded hover:bg-red-600"
          >
            Eliminar todos
          </button>
        </div>
      )}
    </div>
  );
};

export default FileUploaderPlus;
