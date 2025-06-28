export const variants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 300 : -300,
      opacity: 0,
      position: "absolute" as const,
      width: "100%",
    }),
    center: {
      x: 0,
      opacity: 1,
      position: "relative" as const,
      width: "100%",
    },
    exit: (dir: number) => ({
      x: dir < 0 ? 300 : -300,
      opacity: 0,
      position: "absolute" as const,
      width: "100%",
    }),
  };
  