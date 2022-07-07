import "./styles.css";
import CssBaseline from "@material-ui/core/CssBaseline";
import { useEffect, useState } from "react";
import { TaskRecord } from "./api/types";
import { tasksRead } from "./api/tasks";
import { Table } from "./components/Table";

export default function App() {
  const [records, setRecords] = useState<TaskRecord[]>([]);

  useEffect(() => {
    tasksRead(setRecords);
  }, []);

  return (
    <div className="App">
      <CssBaseline />
      <Table data={records} />
    </div>
  );
}
