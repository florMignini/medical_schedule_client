export async function uploadPatientFilesClient(files: File[]) {
  if (!files?.length) return [];

  const fd = new FormData();
  files.forEach((f) => fd.append("files", f));

  const res = await fetch("/api/upload/patient-files", {
    method: "POST",
    body: fd,
  });

  const data = await res.json();

  if (!res.ok || !data?.success) {
    throw new Error(data?.message ?? "Error subiendo archivos");
  }

  return data.urls as string[];
}
