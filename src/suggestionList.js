import React from "react";
/*

This is a controlled component

type SuggestionList = {
  items: string[],
  onSelect: () => {}
}
*/

export const SuggestionList = React.forwardRef(
  ({ items, onClick, onMouseOver, onKeyDown, cursorPosition }, ref) => {
    return (
      <ul
        className="searchSuggestion-container"
        onClick={onClick}
        onMouseOver={onMouseOver}
        onKeyDown={onKeyDown}
        ref={ref}
      >
        {items.map((item, index) => (
          <li
            // className={cursorPosition === index ? "searchItem--focused" : null}
            key={index}
            data-item-index={index}
            tabIndex={1}
            // tabIndex={cursorPosition === index ? 0 : -1}
          >
            {item}
          </li>
        ))}
      </ul>
    );
  }
);
