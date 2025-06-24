import { apiServer } from '@/api/api-server';
import { Patient } from '@/interfaces';
import { useState, useEffect } from 'react';


interface UsePatientInfoReturn {
  patientInfo: Patient | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export const usePatientInfo = (patientId: string | undefined): UsePatientInfoReturn => {
  const [patientInfo, setPatientInfo] = useState<Patient | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPatientInfo = async () => {
    if (!patientId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const { data } = await apiServer.get<Patient>(
        `https://medical-schedule-server.onrender.com/api/patients/get-patient/${patientId}`
      );
      setPatientInfo(data as Patient);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar información del paciente');
      setPatientInfo(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatientInfo();
  }, [patientId]);

  return {
    patientInfo,
    loading,
    error,
    refetch: fetchPatientInfo
  };
};

// Ejemplo de uso en tu componente:
/*
const YourComponent = ({ patientId }: { patientId: string }) => {
  const { patientInfo, loading, error, refetch } = usePatientInfo(patientId);
  const [dinamicPage, setDinamicPage] = useState<string>("Informacion del Paciente");

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!patientInfo) return <div>No se encontró información del paciente</div>;

  return (
    <div>
      <h1>{dinamicPage}</h1>
      <p>Nombre: {patientInfo.name}</p>
      <button onClick={refetch}>Recargar información</button>
    </div>
  );
};
*/