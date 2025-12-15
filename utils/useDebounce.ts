import { useEffect, useState } from "react";

export const useDebounce = <T,>(rawValue: T, delay = 500) => {
  const value =
    typeof rawValue === "string"
      ? (rawValue.charAt(0).toUpperCase() + rawValue.slice(1)) as unknown as T
      : rawValue;

  const [debounceValue, setDebounceValue] = useState<T>(value);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebounceValue(value);
    }, delay);

    return () => {
      clearTimeout(timeout);
    };
  }, [value, delay]);

  return debounceValue;
};
