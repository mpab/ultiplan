import "./styles.css";
import { Table } from "./components/Table";
import CssBaseline from '@material-ui/core/CssBaseline'
import { useEffect, useState } from "react";
import { TaskRecord } from "./types";

export default function App() {
  const [records, setRecords] = useState<TaskRecord[]>([]);

  useEffect(() => {
    fetch('http://localhost:3000/api')
    .then((res) =>  res.json())
    .then(records => {
      const result: TaskRecord[] = new Array<TaskRecord>();
      for (const d of records) {
        const task = {
          id: d.id,
          project: d.project,
          description: d.description,
        };
        result.push(task);
      setRecords(result);
    }
    });
  }, []);


  return (
    <div className="App">
      <CssBaseline />
      <Table data={records} />
    </div>
  );
}
