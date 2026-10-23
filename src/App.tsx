import { Toaster } from "sonner";
import AppRouter from "./app/router/AppRouter";

function App() {
  return (
    <>
      <AppRouter />
      <Toaster
        theme="dark"
        position="bottom-right"
        toastOptions={{
          style: {
            background: "#0b0b0d",
            border: "1px solid rgba(255,255,255,0.15)",
            color: "#f5f5f5",
            borderRadius: "2px",
          },
        }}
      />
    </>
  );
}

export default App;