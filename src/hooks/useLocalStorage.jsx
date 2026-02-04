import { useState, useEffect, useCallback } from "react";
import { Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const useLocalStorage = () => {
  const [plataform, setPlataform] = useState(null);

  useEffect(() => {
    if (Platform.OS === "web") {
      setPlataform("web");
    } else {
      setPlataform("native");
    }
  }, []);

  const saveLocal = useCallback(
    async (clave, valor) => {
      try {
        if (plataform === "web") {
          localStorage.setItem(clave, valor);
        } else {
          await AsyncStorage.setItem(clave, valor);
        }
        return true;
      } catch (error) {
        console.error("Error guardando:", error);
        return false;
      }
    },
    [plataform],
  );

  const deleteLocal = useCallback(
    async (clave) => {
      try {
        if (plataform === "web") {
          localStorage.removeItem(clave);
        } else {
          await AsyncStorage.removeItem(clave);
        }
        return true;
      } catch (error) {
        console.error("Error borrando:", error);
        return false;
      }
    },
    [plataform],
  );

  const getKey = useCallback(
    async (clave) => {
      try {
        if (plataform === "web") {
          const valor = localStorage.getItem(clave);
          return valor || null;
        } else {
          const valor = await AsyncStorage.getItem(clave);
          return valor || null;
        }
      } catch (error) {
        console.error("Error obteniendo key:", error);
        return null;
      }
    },
    [plataform],
  );

  const getStorage = useCallback(async () => {
    try {
      if (plataform === "web") {
        const allData = {};
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key) {
            const value = localStorage.getItem(key);
            allData[key] = value || null;
          }
        }
        return allData;
      } else {
        const keys = await AsyncStorage.getAllKeys();
        const allData = {};

        for (const key of keys) {
          const value = await getKey(key);
          allData[key] = value || null;
        }

        return allData;
      }
    } catch (error) {
      console.error("Error obteniendo storage completo:", error);
      return {};
    }
  }, [plataform]);

  const createFirstStorage = useCallback(
    async (initialData) => {
      try {
        if (plataform === "web") {
          // Para web (localStorage)
          for (const [key, value] of Object.entries(initialData)) {
            // Verificar si la clave ya existe
            const existingValue = localStorage.getItem(key);
            if (existingValue === null) {
              // Solo guardar si no existe
              localStorage.setItem(key, JSON.stringify(value));
            } else {
            }
          }
        } else {
          for (const [key, value] of Object.entries(initialData)) {
            try {
              // Verificar si la clave ya existe
              const existingValue = await AsyncStorage.getItem(key);
              if (existingValue === null) {
                // Solo guardar si no existe
                await AsyncStorage.setItem(key, JSON.stringify(value));
              } else {
              }
            } catch (itemError) {
              console.error(`❌ Error con clave "${key}":`, itemError);
            }
          }
        }

        return true;
      } catch (error) {
        console.error("❌ Error creando storage inicial:", error);
        return false;
      }
    },
    [plataform],
  );

  return {
    saveLocal,
    deleteLocal,
    getStorage,
    getKey,
    createFirstStorage,
  };
};

export default useLocalStorage;
