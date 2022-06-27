import "./styles.css";
import { Table } from "./components/Table";
import CssBaseline from "@material-ui/core/CssBaseline";
import { useEffect, useState } from "react";
import { TaskRecord } from "./types";
import { apiGet } from "./api/api";

export default function App() {
  const [records, setRecords] = useState<TaskRecord[]>([]);

  useEffect(() => {
    apiGet(setRecords);
  }, []);

  return (
    <div className="App">
      <CssBaseline />
      <Table data={records} />
    </div>
  );
}
