"use client";

import Image from "next/image";
import React, { useEffect, useMemo } from "react";
import { useDropzone } from "react-dropzone";

type FileWithPreview = File & { preview?: string };

type FileUploaderPlusProps = {
  // source of truth: form field value
  files?: File[] | undefined;
  onChange: (files: File[]) => void;

  // optional: to support removing/resetting the correct field
  form?: any;
  name?: string; // e.g. "patientAttachedFilesUrl" or "pastAppointment.patientAttachedFilesUrl"

  readOnly?: boolean;
};

const FileUploaderPlus = ({
  files = [],
  onChange,
  form,
  name = "patientAttachedFilesUrl",
  readOnly = false,
}: FileUploaderPlusProps) => {
  // Build previews from files (derived state, not stored)
  const filesWithPreview: FileWithPreview[] = useMemo(() => {
    return (files || []).map((file) => {
      // avoid recreating previews if already attached
      const withPreview = file as FileWithPreview;
      if (!withPreview.preview) {
        withPreview.preview = URL.createObjectURL(file);
      }
      return withPreview;
    });
  }, [files]);

  // Cleanup previews on unmount / when files change
  useEffect(() => {
    return () => {
      filesWithPreview.forEach((f) => {
        if (f.preview) URL.revokeObjectURL(f.preview);
      });
    };
  }, [filesWithPreview]);

  const onDrop = (acceptedFiles: File[]) => {
    if (readOnly) return;

    // Merge new files with existing ones (prevent duplicates by name+size+lastModified)
    const existing = files || [];
    const merged = [...existing];

    for (const file of acceptedFiles) {
      const exists = merged.some(
        (f) =>
          f.name === file.name &&
          f.size === file.size &&
          f.lastModified === file.lastModified
      );
      if (!exists) merged.push(file);
    }

    onChange(merged);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [], "application/pdf": [] },
    multiple: true,
    disabled: readOnly,
  });

  const removeFile = (fileToRemove: File) => {
    if (readOnly) return;
    const next = (files || []).filter((f) => f !== fileToRemove);
    onChange(next);
  };

  const removeAllFiles = () => {
    if (readOnly) return;
    onChange([]);
    // optional: keep react-hook-form state clean
    form?.resetField?.(name);
  };

  return (
    <div className="w-full space-y-3">
      <div
        {...getRootProps()}
        className={[
          "w-full rounded-xl border border-black/10 bg-white/70 p-4",
          "cursor-pointer transition",
          readOnly ? "opacity-60 cursor-not-allowed" : "hover:bg-white",
          isDragActive ? "ring-2 ring-emerald-400" : "",
        ].join(" ")}
      >
        <input {...getInputProps()} />
        <div className="flex items-center justify-between gap-3">
          <div className="text-sm">
            <p className="text-gray-800 font-medium">
              {isDragActive ? "Soltá los archivos acá" : "Arrastrá o hacé clic para subir"}
            </p>
            <p className="text-gray-500 text-xs">
              Imágenes o PDF · múltiples archivos
            </p>
          </div>

          <div className="text-xs text-gray-600">
            {filesWithPreview.length ? `${filesWithPreview.length} seleccionados` : "0 seleccionados"}
          </div>
        </div>
      </div>

      {filesWithPreview.length > 0 && (
        <div className="rounded-xl border border-black/10 bg-white/70 p-3">
          <div className="flex items-center justify-between gap-3 pb-2">
            <p className="text-sm font-semibold text-gray-700">Archivos</p>

            {!readOnly && (
              <button
                type="button"
                onClick={removeAllFiles}
                className="text-xs px-3 py-1 rounded-lg bg-red-500 text-white hover:bg-red-600"
              >
                Eliminar todos
              </button>
            )}
          </div>

          <ul className="space-y-3">
            {filesWithPreview.map((file, index) => (
              <li
                key={`${file.name}-${file.size}-${file.lastModified}-${index}`}
                className="flex gap-3 items-start rounded-lg border border-black/10 bg-white p-2"
              >
                {/* Preview */}
                <div className="w-20 h-20 rounded-md overflow-hidden border border-black/10 bg-white flex items-center justify-center">
                  {file.type === "application/pdf" ? (
                    <object
                      data={file.preview}
                      type="application/pdf"
                      className="w-full h-full"
                    />
                  ) : (
                    <Image
                      src={file.preview!}
                      alt={file.name}
                      width={160}
                      height={160}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 truncate">
                    {file.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {(file.size / 1024).toFixed(1)} KB
                  </p>
                </div>

                {!readOnly && (
                  <button
                    type="button"
                    onClick={() => removeFile(file)}
                    className="text-xs text-red-600 hover:underline"
                  >
                    Eliminar
                  </button>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default FileUploaderPlus;
