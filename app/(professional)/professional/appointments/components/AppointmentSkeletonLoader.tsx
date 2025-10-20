export const AppointmentSkeletonLoader = () => {
    return (
      <div className="rounded-2xl w-full flex flex-col gap-8 border border-zinc-200 shadow-sm bg-white/60 backdrop-blur-sm p-4 space-y-3 animate-pulse">
        <div className="w-full h-[20%] bg-zinc-200 rounded-xl" />
        <div className="w-full h-[75%] bg-zinc-200 rounded-xl" />
      </div>
    );
  };