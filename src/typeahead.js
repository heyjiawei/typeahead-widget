/*
Functionalities for typeahead widget:
- take in a text and call search api
- present a maximum of 10 results
- while typing, wait for user to complete typing (debounce of 100ms) before providing suggestions
- if no suggestions, show nothing
- if there are suggestions, allow keyboard navigation down to suggestions and choosing them

- if no search results, show "no results" text for that particular search term.
Bonus - text highlight like mdn search box

What if the results take a long time to return?
What if the results returned have "expired" / is from an old search term?
*/

/*
This is a controlled component

type Typeahead = {
  value: string
  onChange: (event) => {},
  onFocus: (event) => {},
  onBlur: (event) => {},
  onKeyDown: (event) => {}
}
*/
export function Typeahead({ value, onChange, onFocus, onBlur, onKeyDown }) {
  return (
    <>
      <input
        type="search"
        name="SearchBar"
        autoComplete="off"
        className="input"
        tabIndex={0}
        value={value}
        onChange={onChange}
        onFocus={onFocus}
        onBlur={onBlur}
        onKeyDown={onKeyDown}
      />
    </>
  );
}
