import {
    Box,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    SelectChangeEvent,
  } from "@mui/material";
  
interface StatusFilterControlProps {
    filters: string[];
    setFilter: (filter: string) => void;
    filter: string;
  }

  export const StatusFilterControl = (props: StatusFilterControlProps) => {
    const onStatusFilterChange = (event: SelectChangeEvent) => {
      props.setFilter(event.target.value);
    };

    return (
      <Box sx={{ maxWidth: 140 }}>
        <FormControl fullWidth>
          <InputLabel>{props.filter}</InputLabel>
          <Select
            value={""}
            labelId="task-status-select-label"
            id="task-status-select-label-id"
            label="Status"
            onChange={onStatusFilterChange}
          >
            {props.filters.map((e, k) => (
              <MenuItem key={k} value={e}>
                {e}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
    );
  };