import "./styles.css";

import { SnackbarProvider } from "notistack";
import Index from "./components/Index";
import { CssBaseline } from "@mui/material";

export default function App() {
  return (
    <SnackbarProvider maxSnack={3}>
      <div className="App">
        <CssBaseline />
        <Index />
      </div>
    </SnackbarProvider>
  );
}
