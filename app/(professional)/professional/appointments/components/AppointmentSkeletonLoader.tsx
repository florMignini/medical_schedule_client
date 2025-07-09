export const AppointmentSkeletonLoader = () => {
    return (
      <div className="rounded-2xl w-full grid grid-cols-1 md:grid-cols-2 gap-8 border border-zinc-200 shadow-sm bg-white/60 backdrop-blur-sm p-4 space-y-3 animate-pulse">
        <div className="w-full h-[700px] bg-zinc-200 rounded-xl" />
        <div className="w-full h-[700px] bg-zinc-200 rounded-xl" />
      </div>
    );
  };