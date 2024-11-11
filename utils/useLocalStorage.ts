import { useState } from "react";

export const useLocalStorage = ( key:string, initialValue?:any ) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key!);
      return item !== null ? JSON.parse(item) : null;
    } catch (error) {
      console.log(error);
    }
  });

  const setValue = (value: string | any) => {
    try {
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.log(error);
    }
  };
  return [storedValue, setValue];
};
