import { useEffect } from "react";
import { io } from "socket.io-client";
import { useDataStore } from "@/store/data-store";

export const useBootstrap = () => {
  const loadAll = useDataStore((state) => state.loadAll);

  useEffect(() => {
    loadAll();
    const socket = io(import.meta.env.VITE_SOCKET_URL ?? "http://localhost:5000");
    socket.on("project:changed", loadAll);
    socket.on("task:changed", loadAll);
    socket.on("task:deleted", loadAll);
    socket.on("comment:created", loadAll);
    return () => {
      socket.disconnect();
    };
  }, [loadAll]);
};
