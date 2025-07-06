export const InstitutionSkeletonCard = () => {
  return (
    <div className="rounded-2xl border border-zinc-200 shadow-sm bg-white/60 backdrop-blur-sm p-4 space-y-3 animate-pulse">
      <div className="w-full h-40 bg-zinc-200 rounded-xl" />
      <div className="h-5 bg-zinc-300 rounded-md w-3/4" />
      <div className="h-4 bg-zinc-200 rounded-md w-1/2" />
      <div className="h-4 bg-zinc-200 rounded-md w-1/3" />
    </div>
  );
};
