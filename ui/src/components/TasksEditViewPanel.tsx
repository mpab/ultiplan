import { Add } from "@mui/icons-material";
import { IconButton, TextField, Tooltip } from "@mui/material";
import React, { ChangeEvent } from "react";
import { stringIsNullOrEmpty } from "../utils";

export const TaskEditViewPanel = (props: {
  description: string;
  setDescription: (description: string) => void;
  descriptionError: string;
  setDescriptionError: (err: string) => void;
  tags: string[];
  setTags: (tags: string[]) => void;
}) => {
  const handleInputChangeDescription = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    props.setDescriptionError(
      stringIsNullOrEmpty(e.target.value) ? "description cannot be empty" : ""
    );
    props.setDescription(e.target.value);
  };

  const handleClickNewTag = () => {
    props.setTags([...props.tags, ""]);
  };

  const handleInputChangeTag = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    id: number
  ) => {
    let edit = props.tags;
    if (e.target.value) edit[id] = e.target.value;
    else edit.splice(id, 1);
    props.setTags([...edit]);
  };

  return (
    <React.Fragment>
      <TextField
        autoFocus
        margin="dense"
        label="Description"
        type="text"
        fullWidth
        value={props.description}
        helperText={props.descriptionError}
        multiline
        rows={3}
        onChange={(e) => handleInputChangeDescription(e)}
      />
      {props.tags.map((tag, id) => (
        <TextField
          id={String(id)}
          fullWidth
          value={tag}
          onChange={(e) => handleInputChangeTag(e, id)}
        />
      ))}
      <Tooltip title="add a tag line">
        <IconButton onClick={handleClickNewTag} sx={{ fontSize: "12px" }}>
          <Add sx={{ fontSize: "12px" }} />
          add tag
        </IconButton>
      </Tooltip>
    </React.Fragment>
  );
};
