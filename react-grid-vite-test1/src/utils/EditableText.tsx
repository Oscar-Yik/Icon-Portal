// EditableTextItem.js hello
import React, { useState, useRef, useEffect } from 'react';
import "./Background.css";

import { blockType, blockModalType, colorType, updateBlocks2Fn, updateEditFn } from './../grid-types';

type onStateChangeFn = (trash: any, text: string) => void;

type EditTextItemProps = { initialText: string, id: string, colors: colorType, onStateChange: onStateChangeFn }

const EditableTextItem = ({ initialText, id, onStateChange, colors } : EditTextItemProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState(initialText);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setText(event.target.value);
    onStateChange(id, text);
  };

  const handleBlur = () => {
    setIsEditing(false);
    // Save the changes or perform any required actions here
  };

  // Focus the input field when editing starts
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  return (
    <div onDoubleClick={handleDoubleClick}>
      {isEditing ? (
        <input
          type="text"
          value={text}
          onChange={handleChange}
          onBlur={handleBlur}
          ref={inputRef}
        />
      ) : (
        (id === "Background") ? (<span className='background-text'
                                       style={{color: colors.headerFont}}>{text}</span>)
                              : (<span className='background-text'>{text}</span>)
      )}
    </div>
  );
};

export default EditableTextItem;