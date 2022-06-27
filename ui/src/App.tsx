import "./styles.css";
import { Table } from "./components/Table";
import CssBaseline from "@material-ui/core/CssBaseline";
import { useEffect, useState } from "react";
import { TaskRecord } from "./types";

const apiGetRecords = (setRecords: (arg0: TaskRecord[]) => void) => {
  fetch("http://localhost:3001/api")
    .then((res) => res.json())
    .then((records) => {
      const result: TaskRecord[] = new Array<TaskRecord>();
      for (const d of records) {
        const task = {
          id: d.id,
          project: d.project,
          description: d.description,
        };
        result.push(task);
      }
      setRecords(result);
    });
};

export default function App() {
  const [records, setRecords] = useState<TaskRecord[]>([]);

  useEffect(() => {
    apiGetRecords(setRecords);
  }, []);

  return (
    <div className="App">
      <CssBaseline />
      <Table data={records} />
    </div>
  );
}
