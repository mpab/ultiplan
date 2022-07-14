import { Add } from "@mui/icons-material";
import { Collapse, IconButton, TextField, Tooltip } from "@mui/material";
import React, { ChangeEvent, useState } from "react";
import { TaskView } from "../api/types";
import { stringIsNullOrEmptyOrWhitespace } from "../utils";

export const TaskEditViewControl = (props: {
  taskView: TaskView;
  onTaskViewChange: (taskView: TaskView) => void;
  onTaskViewEditComplete: (taskView: TaskView) => void;
  isExpanded: boolean;
}) => {
  let taskView = {...props.taskView}

  let validate = (s: string): string =>
    stringIsNullOrEmptyOrWhitespace(s) ? `cannot be whitespace` : ``;

  const [description, setDescription] = useState(taskView.taskRecord.description);
  const [tags, setTags] = useState(taskView.taskRecord.tags);

  const [validationError, setValidationError] = useState(
    validate(taskView.taskRecord.description)
  );

  const onTaskViewChange = () => {
    props.onTaskViewChange(taskView);
  };

  const onChangeDescription = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setDescription(e.target.value);
    setValidationError(validate(e.target.value));
    taskView.taskRecord.description = e.target.value;
    onTaskViewChange();
  };

  const onKeyDownDescription = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === `Enter`) {
      if (stringIsNullOrEmptyOrWhitespace(description)) {
        return;
      }

      if (!e.shiftKey) {
        taskView.taskRecord.description = description;
        taskView.taskRecord.tags = tags;
        props.onTaskViewEditComplete(taskView);
        return;
      }
    }
  };

  const handleClickNewTag = () => {
    const newTags = [...tags, ""];
    setTags(newTags);
    taskView.taskRecord.tags = newTags;
    onTaskViewChange();
  };

  const onChangeTag = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    id: number
  ) => {
    let triggerEditComplete = false;
    let edit = tags;
    if (e.target.value) {
      edit[id] = e.target.value;
    } else {
      edit.splice(id, 1); // empty tag, delete
      if (!stringIsNullOrEmptyOrWhitespace(description)) {
        triggerEditComplete = true;
      }
    }

    setTags([...edit]);
    taskView.taskRecord.tags = edit;
    onTaskViewChange();
    
    if (triggerEditComplete) {
      props.onTaskViewEditComplete(taskView);
    }
  };

  const onKeyDownTag = (e: React.KeyboardEvent<HTMLDivElement>, id: number) => {
    if (e.key === `Enter`) {
      if (stringIsNullOrEmptyOrWhitespace(description)) {
        return;
      }
      if (!e.shiftKey) {
        taskView.taskRecord.description = description;
        taskView.taskRecord.tags = tags;
        props.onTaskViewEditComplete(taskView);
        return;
      }
      if (!stringIsNullOrEmptyOrWhitespace(tags[id])) {
        handleClickNewTag();
        return;
      }
    }

    onTaskViewChange();
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
