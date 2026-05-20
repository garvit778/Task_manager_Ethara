import * as ToastPrimitive from "@radix-ui/react-toast";
import { createContext, useContext, useMemo, useState } from "react";
import { X } from "lucide-react";
import { Button } from "./button";

type Toast = { id: string; title: string; description?: string };
const ToastContext = createContext<{ push: (toast: Omit<Toast, "id">) => void }>({ push: () => undefined });

export const useToast = () => useContext(ToastContext);

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const value = useMemo(
    () => ({
      push: (toast: Omit<Toast, "id">) => setToasts((items) => [...items, { ...toast, id: crypto.randomUUID() }])
    }),
    []
  );

  return (
    <ToastContext.Provider value={value}>
      <ToastPrimitive.Provider swipeDirection="right">
        {children}
        {toasts.map((toast) => (
          <ToastPrimitive.Root
            key={toast.id}
            className="glass grid gap-1 rounded-lg p-4 shadow-glow"
            onOpenChange={(open) => !open && setToasts((items) => items.filter((item) => item.id !== toast.id))}
          >
            <ToastPrimitive.Title className="font-semibold">{toast.title}</ToastPrimitive.Title>
            {toast.description ? <ToastPrimitive.Description className="text-sm text-muted-foreground">{toast.description}</ToastPrimitive.Description> : null}
            <ToastPrimitive.Close asChild>
              <Button size="icon" variant="ghost" className="absolute right-2 top-2 h-8 w-8">
                <X className="h-4 w-4" />
              </Button>
            </ToastPrimitive.Close>
          </ToastPrimitive.Root>
        ))}
        <ToastPrimitive.Viewport className="fixed bottom-4 right-4 z-50 flex w-96 max-w-[calc(100vw-2rem)] flex-col gap-3" />
      </ToastPrimitive.Provider>
    </ToastContext.Provider>
  );
};
