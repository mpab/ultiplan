import { Add } from "@mui/icons-material";
import { Collapse, IconButton, TextField, Tooltip } from "@mui/material";
import React, { ChangeEvent, useState } from "react";
import { TaskStatus, TaskView } from "../api/types";
import { stringIsNullOrEmpty, stringIsNullOrEmptyOrWhitespace } from "../utils";

export interface TaskEditViewControlProps {
  taskView: TaskView;
  onTaskViewChange: (taskView: TaskView) => void;
  onTaskViewEditComplete: (taskView: TaskView) => void;
  isExpanded: boolean;
  forceEdit: boolean;
}

export const TaskEditViewControl = (props: TaskEditViewControlProps) => {
  let isReadonly = () => {
    if (props.forceEdit) return false;
    return (
      stringIsNullOrEmpty(tv.taskRecord.id) ||
      tv.status === TaskStatus.any ||
      tv.status === TaskStatus.completed
    );
  };

  let tv = { ...props.taskView };

  let validate = (s: string): string =>
    stringIsNullOrEmptyOrWhitespace(s) ? `cannot be whitespace` : ``;

  const [description, setDescription] = useState(tv.taskRecord.description);
  const [tags, setTags] = useState(tv.taskRecord.tags);

  const [validationError, setValidationError] = useState(
    validate(tv.taskRecord.description)
  );

  const onTaskViewChange = () => {
    props.onTaskViewChange(tv);
  };

  const onChangeDescription = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setDescription(e.target.value);
    setValidationError(validate(e.target.value));
    tv.taskRecord.description = e.target.value;
    onTaskViewChange();
  };

  const onKeyDownDescription = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === `Enter`) {
      if (stringIsNullOrEmptyOrWhitespace(description)) {
        return;
      }

      if (!e.shiftKey) {
        tv.taskRecord.description = description;
        tv.taskRecord.tags = tags;
        props.onTaskViewEditComplete(tv);
        return;
      }
    }
  };

  const handleClickNewTag = () => {
    const newTags = [...tags, ""];
    setTags(newTags);
    tv.taskRecord.tags = newTags;
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
    tv.taskRecord.tags = edit;
    onTaskViewChange();

    if (triggerEditComplete) {
      props.onTaskViewEditComplete(tv);
    }
  };

  const onKeyDownTag = (e: React.KeyboardEvent<HTMLDivElement>, id: number) => {
    if (e.key === `Enter`) {
      if (stringIsNullOrEmptyOrWhitespace(description)) {
        return;
      }
      if (!e.shiftKey) {
        tv.taskRecord.description = description;
        tv.taskRecord.tags = tags;
        props.onTaskViewEditComplete(tv);
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
      <Tooltip title={tv.taskRecord.id}>
        {isReadonly() ? (
          <TextField
            style={{ width: "100%" }}
            value={tv.taskRecord.description}
            InputProps={{
              readOnly: true,
            }}
          />
        ) : (
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
        )}
      </Tooltip>
      <Collapse in={props.isExpanded} timeout="auto" unmountOnExit>
        {tags.map((tag, id) => (
          <TextField
            key={id}
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
