import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, useEffect } from "react";
const queryClient = new QueryClient();
import AppRoutes from "./routes/AppRoutes";
import useAnalytics from "./hooks/useAnalytics";
const App = () => {
  const [promptEvent, setPromptEvent] = useState(null);
  useAnalytics();

  useEffect(() => {
    window.addEventListener("beforeinstallprompt", (e) => {
      e.preventDefault();
      setPromptEvent(e);
    });
  }, []);
  return (
    <QueryClientProvider client={queryClient}>
      {promptEvent && (
        <button
          onClick={installApp}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          Install App
        </button>
      )}
      <AppRoutes />
    </QueryClientProvider>
  );
};

export default App;
