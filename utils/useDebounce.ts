import { useEffect, useState } from "react";

export const useDebounce = <T>(value:T, delay=500/* default time delay*/) => {

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