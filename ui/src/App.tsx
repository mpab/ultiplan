import "./styles.css";

// import { Table } from "./components/Table";
// import CollapsibleTable from "./components/CollapsibleTable";
// import CustomOverridesTable from "./components/CustomOverridesTable";
// import DataTable from "./components/DataTable";

import StickyHeaderTable from "./components/StickyHeaderTable";
import Index from "./components/Index";
import { CssBaseline } from "@mui/material";

export default function App() {

  //<Table data={records} />
  //<CollapsibleTable />
  //<CustomOverridesTable />
  //<StickyHeaderTable />
  //<DataTable />
  <StickyHeaderTable />

  return (
    <div className="App">
      <CssBaseline />
      <Index />
    </div>
  );
}
