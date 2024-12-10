import { useEffect, useRef } from "react";
import styles from "./InputContentEditable.module.css";
import classNames from "classnames";

const InputContentEditable = ({
  placeholder,
  isTitle,
  onInput,
  value,
  defaultValue,
  canceled,
  onFocus,
  lineThrough,
  disabled,
}) => {
  const inputRef = useRef();

  const handleInput = (e) => {
    onInput(e);
  };

  const handleClickPlaceholder = () => {
    inputRef.current?.focus();
  };

  const handlePaste = (event) => {
    event.preventDefault();

    // Get plain text from clipboard
    const text = event.clipboardData.getData("text/plain");

    // Insert the plain text into the contentEditable div
    document.execCommand("insertText", false, text);
  };

  useEffect(() => {
    if (!canceled) return;

    inputRef.current.innerText = defaultValue;
  }, [canceled, defaultValue]);

  return (
    <div
      className={classNames(styles.container, {
        [styles.title]: !!isTitle,
        [styles.lineThrough]: !!lineThrough,
      })}
    >
      <div
        ref={inputRef}
        className={styles.input}
        onInput={handleInput}
        contentEditable={!disabled}
        suppressContentEditableWarning
        onFocus={onFocus}
        onPaste={handlePaste}
        dangerouslySetInnerHTML={{
          __html: defaultValue.replaceAll("\n", "<br>") || "",
        }}
      ></div>
      {!value.length && (
        <div onClick={handleClickPlaceholder} className={styles.placeholder}>
          {placeholder}
        </div>
      )}
    </div>
  );
};

export default InputContentEditable;
