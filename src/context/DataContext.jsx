import React, { createContext, useContext, useState, useEffect } from "react";
import axiosInstance from "../services/axios";
import { list } from "../utils/lists";

const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const [users, setUsers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [signals, setSignals] = useState([]);
  const [lists, setLists] = useState(list);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchInitialData = async () => {
      setLoading(true);
      try {
        await Promise.all([
          userActions.getAll(),
          projectActions.getAll(),
          signalActions.getAll(),
          instrumentActions.getAll(),
        ]);
      } catch (err) {
        console.error("Error fetching initial data:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchInitialData();
  }, []);

  // Función genérica para manejo de errores
  const handleError = (err) => {
    setError(err.response?.data?.message || err.message);
    setLoading(false);
    throw err;
  };

  // CRUD para Usuarios
  const userActions = {
    getAll: async () => {
      setLoading(true);
      try {
        const { data } = await axiosInstance.get("/users");
        setUsers(data);
        return data;
      } catch (err) {
        return handleError(err);
      } finally {
        setLoading(false);
      }
    },
    create: async (userData) => {
      setLoading(true);
      try {
        const { data } = await axiosInstance.post("/users", userData);
        setUsers((prev) => [...prev, data]);
        return data;
      } catch (err) {
        return handleError(err);
      } finally {
        setLoading(false);
      }
    },
    update: async (id, userData) => {
      setLoading(true);
      try {
        const { data } = await axiosInstance.put(`/users/${id}`, userData);
        setUsers((prev) => prev.map((u) => (u.id === id ? data : u)));
        return data;
      } catch (err) {
        return handleError(err);
      } finally {
        setLoading(false);
      }
    },
    delete: async (id) => {
      setLoading(true);
      try {
        await axiosInstance.delete(`/users/${id}`);
        setUsers((prev) => prev.filter((u) => u.id !== id));
        return true;
      } catch (err) {
        return handleError(err);
      } finally {
        setLoading(false);
      }
    },
  };

  // CRUD para Proyectos (misma estructura)
  const projectActions = {
    getAll: async () => {
      setLoading(true);
      try {
        const { data } = await axiosInstance.get("/projects");
        setProjects(data);
        return data;
      } catch (err) {
        return handleError(err);
      } finally {
        setLoading(false);
      }
    },
    create: async (projectData) => {
      setLoading(true);
      try {
        const { data } = await axiosInstance.post("/projects", projectData);
        setProjects((prev) => [...prev, data]);
        return data;
      } catch (err) {
        return handleError(err);
      } finally {
        setLoading(false);
      }
    },
    update: async (id, projectData) => {
      setLoading(true);
      try {
        const { data } = await axiosInstance.put(
          `/projects/${id}`,
          projectData
        );
        setProjects((prev) => prev.map((p) => (p.id === id ? data : p)));
        return data;
      } catch (err) {
        return handleError(err);
      } finally {
        setLoading(false);
      }
    },
    delete: async (id) => {
      setLoading(true);
      try {
        await axiosInstance.delete(`/projects/${id}`);
        setProjects((prev) => prev.filter((p) => p.id !== id));
        return true;
      } catch (err) {
        return handleError(err);
      } finally {
        setLoading(false);
      }
    },
  };

  // CRUD para Señales (misma estructura)
  const signalActions = {
    getAll: async () => {
      setLoading(true);
      try {
        const { data } = await axiosInstance.get("/signals");
        setSignals(data);
        return data;
      } catch (err) {
        return handleError(err);
      } finally {
        setLoading(false);
      }
    },
    create: async (signalData) => {
      setLoading(true);
      try {
        const { data } = await axiosInstance.post("/signals", signalData);
        setSignals((prev) => [...prev, data]);
        return data;
      } catch (err) {
        return handleError(err);
      } finally {
        setLoading(false);
      }
    },
    update: async (id, signalData) => {
      setLoading(true);
      try {
        const { data } = await axiosInstance.put(`/signals/${id}`, signalData);
        setSignals((prev) => prev.map((s) => (s.id === id ? data : s)));
        return data;
      } catch (err) {
        return handleError(err);
      } finally {
        setLoading(false);
      }
    },
    delete: async (id) => {
      setLoading(true);
      try {
        await axiosInstance.delete(`/signals/${id}`);
        setSignals((prev) => prev.filter((s) => s.id !== id));
        return true;
      } catch (err) {
        return handleError(err);
      } finally {
        setLoading(false);
      }
    },
  };

  const instrumentActions = {
    getAll: async () => {
      setLoading(true);
      try {
        const { data } = await axiosInstance.get("/instruments");
        setLists((prev) => ([ ...prev, data ]));
        return data;
      } catch (err) {
        return handleError(err);
      } finally {
        setLoading(false);
      }
    },
    create: async (instrumentData) => {
      setLoading(true);
      try {
        const { data } = await axiosInstance.post(
          "/instruments",
          instrumentData
        );
        return data;
      } catch (err) {
        return handleError(err);
      } finally {
        setLoading(false);
      }
    },
    update: async (id, instrumentData) => {
      setLoading(true);
      try {
        const { data } = await axiosInstance.put(
          `/instruments/${id}`,
          instrumentData
        );
        return data;
      } catch (err) {
        return handleError(err);
      } finally {
        setLoading(false);
      }
    },
    delete: async (id) => {
      setLoading(true);
      try {
        await axiosInstance.delete(`/instruments/${id}`);
        return true;
      } catch (err) {
        return handleError(err);
      } finally {
        setLoading(false);
      }
    },
  };

  return (
    <DataContext.Provider
      value={{
        users,
        projects,
        signals,
        loading,
        error,
        lists,
        actions: {
          users: userActions,
          projects: projectActions,
          signals: signalActions,
          instruments: instrumentActions,
        },
        clearError: () => setError(null),
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error("useData debe usarse dentro de un DataProvider");
  }
  return context;
};
