export async function getInstitutions() {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/institutions`);
    if (!res.ok) throw new Error("Error al obtener instituciones");
    return res.json();
  }
  