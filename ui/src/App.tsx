import "./styles.css";
import CssBaseline from "@material-ui/core/CssBaseline";

// import { Table } from "./components/Table";
// import CollapsibleTable from "./components/CollapsibleTable";
// import CustomOverridesTable from "./components/CustomOverridesTable";
// import DataTable from "./components/DataTable";

import StickyHeaderTable from "./components/StickyHeaderTable";
import Index from "./components/Index";

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
