import { useMemo } from "react";

export const useActivefilter = (
  itemsIncluded: any,
  options = { memoize: true }
) => {
  return useMemo(() => {
    if (!Array.isArray(itemsIncluded) || itemsIncluded.length === 0) {
      return [];
    }

    if (options.memoize === false) {
      return itemsIncluded.filter(({ patient }) => patient?.isActive);
    }

    return itemsIncluded.filter(({ patient }) => patient?.isActive);
  }, [itemsIncluded, options.memoize]);
};

