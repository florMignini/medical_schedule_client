export function Overview({ institutionId }: { institutionId: string }) {
    return (
      <div className="p-4 border rounded bg-muted/20">
        <h3 className="font-semibold mb-2">Información general</h3>
        <p>Resumen de la institución con estadísticas, historial de actividad, etc.</p>
      </div>
    );
  }
  