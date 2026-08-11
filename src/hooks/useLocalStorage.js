import { useEffect, useState } from "react";

function useLocalStorage(key, initialValue) {

  const [value, setValue] = useState(() => {

    try {

      const saved =
        localStorage.getItem(key);

      return saved
        ? JSON.parse(saved)
        : initialValue;

    } catch (error) {

      console.error(
        `Error reading ${key}:`,
        error
      );

      return initialValue;
    }
  });


  useEffect(() => {

    try {

      localStorage.setItem(
        key,
        JSON.stringify(value)
      );

    } catch (error) {

      console.error(
        `Error saving ${key}:`,
        error
      );

    }

  }, [key, value]);


  return [value, setValue];
}

export default useLocalStorage;
