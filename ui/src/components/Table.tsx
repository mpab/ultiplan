import MaterialTable, { Column } from "@material-table/core";
import { Container } from "@material-ui/core";
import { TaskRecord } from "../types";

type Props = {
  data: TaskRecord[];
};

const columns: Array<Column<TaskRecord>> = [
  { title: "Id", field: "id" },
  { title: "Project", field: "project" },
  { title: "Description", field: "description" },
];

const options = {
  paging: true,
  pageSize: 10,
  emptyRowsWhenPaging: false,
  pageSizeOptions: [10, 20, 50],
};

export const Table = ({ data }: Props) => {
  return (
    <Container>
      <MaterialTable
        columns={columns}
        data={data}
        //icons={tableIcons}
        options={options}
        title={"Tasks"}
      />
    </Container>
  );
};
