import "./styles.css";
import { Table } from "./components/Table";
import CssBaseline from '@material-ui/core/CssBaseline'
import { data } from "./fake-data";

export default function App() {
  return (
    <div className="App">
      <CssBaseline />
      <Table data={data} />
    </div>
  );
}
