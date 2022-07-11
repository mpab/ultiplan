import { Add } from "@mui/icons-material";
import { Collapse, IconButton, TextField, Tooltip } from "@mui/material";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import React, { ChangeEvent, useState } from "react";
import { stringIsNullOrEmpty } from "../utils";

export const TaskEditViewPanel = (props: {
  description: string;
  setDescription: (description: string) => void;
  descriptionError: string;
  setDescriptionError: (err: string) => void;
  tags: string[];
  setTags: (tags: string[]) => void;
  handleEndEdit: () => void;
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
    if (e.target.value) {
      edit[id] = e.target.value;
    } else {
      edit.splice(id, 1);
      props.handleEndEdit();
    }
    props.setTags([...edit]);
  };

  const handleDescriptionKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key !== "Enter") {
      return;
    }

    if (e.shiftKey) {
      return;
    }

    props.handleEndEdit();
  };

  const handleTagKeyDown = (
    e: React.KeyboardEvent<HTMLDivElement>,
    id: number
  ) => {
    if (e.key !== "Enter") {
      return;
    }

    if (e.shiftKey) {
      handleClickNewTag();
      return;
    }

    props.handleEndEdit();
  };

  const [isExpanded, setIsExpanded] = useState(false);

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
        onChange={(e) => handleInputChangeDescription(e)}
        onKeyDown={(e) => handleDescriptionKeyDown(e)}
        rows={isExpanded ? 3 : 1}
      />
      {!isExpanded ? (
        <IconButton
          aria-label="expand row"
          size="small"
          sx={{ fontSize: "12px" }}
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <KeyboardArrowRightIcon sx={{ fontSize: "12px" }} />
        </IconButton>
      ) : (
        <IconButton
          aria-label="expand row"
          size="small"
          sx={{ fontSize: "12px" }}
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <KeyboardArrowDownIcon sx={{ fontSize: "12px" }} />
        </IconButton>
      )}
      <Collapse in={isExpanded} timeout="auto" unmountOnExit>
      {props.tags.map((tag, id) => (
        <TextField
          id={String(id)}
          fullWidth
          value={tag}
          onChange={(e) => handleInputChangeTag(e, id)}
          onKeyDown={(e) => handleTagKeyDown(e, id)}
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
