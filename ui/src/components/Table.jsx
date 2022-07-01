import React, { useState, useEffect } from "react";
import MaterialTable, { Column } from "@material-table/core";
import tableIcons from "./TableIcons";
import { Container } from "@material-ui/core";
import { TaskRecord } from "../types";

type Props = {
  data: TaskRecord[],
};

const columns: Array<Column<TaskRecord>> = [
  //{ title: "Id", field: "id" },
  { title: "Description", field: "description" },
  { title: "Project", field: "project" },
  { title: "Created", field: "created_on" },
  { title: "Completed", field: "completed_on" },
  { title: "Due", field: "due_on" },
  { title: "Status", field: "status" },
];

const options = {
  paging: true,
  pageSize: 10,
  emptyRowsWhenPaging: false,
  pageSizeOptions: [10, 20, 50],
};

export const Table = ({ data }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    // Closes dialog after saving
    if (isDialogOpen) {
      setIsDialogOpen(false);
    }
  }, [data, isDialogOpen]);

  return (
    <Container>
      <MaterialTable
        columns={columns}
        data={data}
        icons={tableIcons}
        options={options}
        title={"Tasks"}
        actions={[
          {
            icon: tableIcons.Delete,
            tooltip: "Delete User",
            onClick: (event, rowData) => alert("Delete Task?"),
          },
          {
            icon: tableIcons.Add,
            tooltip: "Add Task",
            isFreeAction: true,
            onClick: (event) => setIsDialogOpen(true),
          },
        ]}
      />
    </Container>
  );
};
