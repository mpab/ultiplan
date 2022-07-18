import { Add } from "@mui/icons-material";
import {
  Box,
  Button,
  Collapse,
  Grid,
  IconButton,
  TextField,
  Tooltip,
} from "@mui/material";
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

  const lineCount = tv.taskRecord.description.split(`\n`).length;

  const isExternalUrl = (test: string) => {
    let url;
    try {
      url = new URL(test);
    } catch (_) {
      return false;
    }
    return url.protocol === "http:" || url.protocol === "https:";
  };

  interface LinkTextFieldProps {
    val: string;
    id: number;
  }
  const LinkTextField = (props: LinkTextFieldProps) => {
    return (
      <>
        {isExternalUrl(props.val) ? (
          <Grid container spacing={1}>
            <Grid item xs={11}>
              <TextField
                key={props.id}
                autoFocus
                id={String(props.id)}
                fullWidth
                value={props.val}
                onChange={(e) => onChangeTag(e, props.id)}
                onKeyDown={(e) => onKeyDownTag(e, props.id)}
              />
            </Grid>
            <Tooltip title={"open url"}>
            <Grid item xs={1} container justifyContent="flex-end">
                <Button fullWidth href={props.val} target="_blank" variant="contained" color="primary" disableElevation>
                  Open
                </Button>
            </Grid>
            </Tooltip>
          </Grid>
        ) : (
          <TextField
            key={props.id}
            autoFocus
            id={String(props.id)}
            fullWidth
            value={props.val}
            onChange={(e) => onChangeTag(e, props.id)}
            onKeyDown={(e) => onKeyDownTag(e, props.id)}
          />
        )}
      </>
    );
  };

  return (
    <React.Fragment>
      <Tooltip title={tv.taskRecord.id ? tv.summary : "undefined"}>
        {isReadonly() ? (
          <TextField
            style={{ width: "100%" }}
            value={tv.taskRecord.description}
            InputProps={{
              readOnly: true,
            }}
            multiline
            rows={props.isExpanded ? lineCount : 1}
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
            rows={props.isExpanded ? lineCount : 1}
          />
        )}
      </Tooltip>
      <Collapse in={props.isExpanded} timeout="auto" unmountOnExit>
        {tags.map((tag, id) => (
          <LinkTextField val={tag} id={id} />
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
