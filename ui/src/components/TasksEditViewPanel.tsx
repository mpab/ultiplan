import { Add } from "@mui/icons-material";
import { Collapse, IconButton, TextField, Tooltip } from "@mui/material";
import React, { ChangeEvent, useState } from "react";
import { TaskRecord } from "../api/types";
import { stringIsNullOrEmptyOrWhitespace } from "../utils";

export const TaskEditViewPanel = (props: {
  taskRecord: TaskRecord;
  onTaskRecordChange: (taskRecord: TaskRecord) => void;
  onTaskRecordEditComplete: (taskRecord: TaskRecord) => void;
  isExpanded: boolean;
}) => {
  let validate = (s: string): string =>
    stringIsNullOrEmptyOrWhitespace(s) ? `cannot be whitespace` : ``;

  const [description, setDescription] = useState(props.taskRecord.description);
  const [validationError, setValidationError] = useState(
    validate(props.taskRecord.description)
  );
  const [tags, setTags] = useState(props.taskRecord.tags);

  const onTaskRecordChange = () => {
    props.taskRecord.description = description;
    props.taskRecord.tags = tags;
    props.onTaskRecordChange(props.taskRecord);
  };

  const onChangeDescription = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setDescription(e.target.value);
    setValidationError(validate(e.target.value));
    onTaskRecordChange();
  };

  const handleClickNewTag = () => {
    setTags([...tags, ""]);
  };

  const onChangeTag = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    id: number
  ) => {
    let edit = tags;
    if (e.target.value) {
      edit[id] = e.target.value;
    } else {
      edit.splice(id, 1);
    }
    setTags([...edit]);
    onTaskRecordChange();
  };

  const onKeyDownDescription = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === `Enter`) {
      if (stringIsNullOrEmptyOrWhitespace(description)) {
        return;
      }
      
      if (!e.shiftKey) {
        props.taskRecord.description = description;
        props.taskRecord.tags = tags;
        props.onTaskRecordEditComplete(props.taskRecord);
        return;
      }
    }
    onTaskRecordChange();
  };

  const onKeyDownTag = (e: React.KeyboardEvent<HTMLDivElement>, id: number) => {
    if (e.key !== "Enter") {
      return;
    }

    if (e.shiftKey) {
      handleClickNewTag();
      return;
    }

    onTaskRecordChange();
  };

  return (
    <React.Fragment>
      <TextField
        autoFocus
        label="Description"
        type="text"
        fullWidth
        value={description}
        helperText={validationError}
        multiline
        onChange={(e) => onChangeDescription(e)}
        onKeyDown={(e) => onKeyDownDescription(e)}
        rows={props.isExpanded ? 3 : 1}
      />
      <Collapse in={props.isExpanded} timeout="auto" unmountOnExit>
        {tags.map((tag, id) => (
          <TextField
            autoFocus
            id={String(id)}
            fullWidth
            value={tag}
            onChange={(e) => onChangeTag(e, id)}
            onKeyDown={(e) => onKeyDownTag(e, id)}
          />
        ))}
        <Tooltip title="add a tag line">
          <IconButton onClick={handleClickNewTag} sx={{ fontSize: "12px" }}>
            <Add sx={{ fontSize: "12px" }} />
            add tag
          </IconButton>
        </Tooltip>
      </Collapse>
    </React.Fragment>
  );
};
