import { useEffect, useState } from "react";

export const useDebounce = <T>(value:any, delay=500/* default time delay*/) => {
value = typeof value === 'string' ? value.charAt(0).toUpperCase() + value.slice(1) : value as T;
const [debounceValue, setDebounceValue] = useState<T>(value)

    useEffect(() => {
      const timeout = setTimeout(() =>{
    setDebounceValue(value)
    });
    
      return () => {
        clearTimeout(timeout);
      }
    }, [value, delay])
    return debounceValue;
}