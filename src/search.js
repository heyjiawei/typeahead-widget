import { useReducer, useRef } from "react";
import { findMatches } from "./fruits";
import { SuggestionList } from "./suggestionList";
import { Typeahead } from "./typeahead";

const initialState = {
  isFocused: false,
  search: "",
  searchResult: [],
  savedResult: [],
  cursorPosition: -1
};

const CHANGE_SEARCH = "CHANGE_SEARCH";
const ON_FOCUS = "ON_FOCUS";
const ON_BLUR = "ON_BLUR";
const SELECT_RESULT = "SELECT_RESULT";
const MOUSEOVER_CURSOR = "MOUSEOVER_CURSOR";
const NAVIGATE_CURSOR_KEYBOARD = "NAVIGATE_CURSOR_KEYBOARD";
const ArrowUp = "ArrowUp";
const ArrowDown = "ArrowDown";
const Enter = "Enter";
const Escape = "Escape";

function reducer(state, action) {
  console.log("action", action.type, action.payload);
  switch (action.type) {
    case CHANGE_SEARCH:
      return {
        ...state,
        search: action.payload.search,
        searchResult: action.payload.searchResult,
        cursorPosition: -1,
        isFocused: true
      };

    case SELECT_RESULT:
      return {
        ...state,
        search: action.payload.search,
        searchResult: [],
        savedResult: [...state.savedResult, action.payload.search],
        cursorPosition: -1
      };

    case ON_FOCUS:
      return { ...state, isFocused: true, cursorPosition: -1 };

    case ON_BLUR:
      return {
        ...state,
        isFocused: false,
        cursorPosition: -1
      };

    case MOUSEOVER_CURSOR:
      return {
        ...state,
        cursorPosition: action.payload.cursorPosition
      };

    case NAVIGATE_CURSOR_KEYBOARD:
      return {
        ...state,
        search: state.searchResult[action.payload.cursorPosition],
        cursorPosition: action.payload.cursorPosition
      };

    default:
      return state;
  }
}
/*
Functionalities for typeahead widget:
- take in a text and call search api
- present a maximum of 10 results
- while typing, wait for user to complete typing (debounce of 100ms) before providing suggestions
- if no suggestions, show nothing
- if there are suggestions, allow keyboard navigation down to suggestions and choosing them

- if no search results, show "no results" text for that particular search term.
Bonus - text highlight like mdn search box

1. What if the results take a long time to return?
- show a "loading" suggestion
2. What if the results returned have "expired" / is from an old search term?
- have a debounce of 100ms and call api
- store search keyword as an id (or index) and when suggestion returns, check if id matches
if results match, set suggestion list
if results do not match, do nothing

*/

export function Search(props) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const ref = useRef();

  // Event handlers
  function handleOnClickSuggestion(event) {
    dispatch({
      type: SELECT_RESULT,
      payload: {
        search: event.target.textContent
      }
    });
  }

  function handleOnMouseOver(event) {
    dispatch({
      type: MOUSEOVER_CURSOR,
      payload: {
        cursorPosition: parseInt(event.target.dataset.itemIndex, 10)
      }
    });
  }

  function handleOnInputChange(event) {
    dispatch({
      type: CHANGE_SEARCH,
      payload: {
        search: event.target.value,
        searchResult: findMatches(event.target.value)
      }
    });
  }

  function handleOnFocus(event) {
    dispatch({
      type: ON_FOCUS
    });
  }

  function handleOnBlur(event) {
    dispatch({
      type: ON_BLUR
    });
    event.stopPropagation();
  }

  function handleOnKeyDown(event) {
    switch (event.key) {
      case Enter:
        dispatch({
          type: SELECT_RESULT,
          payload: { search: event.target.value }
        });
        event.preventDefault();
        break;

      case ArrowUp:
        if (state.cursorPosition > 0) {
          const isLastItemInList = state.cursorPosition - 1 < 0;
          const nextCursorPosition = isLastItemInList
            ? state.searchResult.length - 1
            : state.cursorPosition - 1;
          ref.current.childNodes[nextCursorPosition].focus();
          dispatch({
            type: NAVIGATE_CURSOR_KEYBOARD,
            payload: { cursorPosition: nextCursorPosition }
          });
        }

        break;

      case ArrowDown:
        if (state.cursorPosition < state.searchResult.length) {
          const isLastItemInList =
            state.cursorPosition + 1 > state.searchResult.length - 1;
          const nextCursorPosition = isLastItemInList
            ? 0
            : state.cursorPosition + 1;
          ref.current.childNodes[nextCursorPosition].focus();

          dispatch({
            type: NAVIGATE_CURSOR_KEYBOARD,
            payload: {
              cursorPosition: nextCursorPosition
            }
          });
        }

        break;

      case Escape:
        dispatch({
          type: ON_BLUR
        });

        break;

      default:
        break;
    }
  }

  // console.count("Search component rendered");
  return (
    <div className="form--container">
      <form>
        <Typeahead
          value={state.search}
          onChange={handleOnInputChange}
          onFocus={handleOnFocus}
          onBlur={handleOnBlur}
          onKeyDown={handleOnKeyDown}
        />
      </form>

      {
        //state.isFocused > 0 &&
        state.searchResult.length > 0 ? (
          <SuggestionList
            ref={ref}
            items={state.searchResult}
            cursorPosition={state.cursorPosition}
            onClick={handleOnClickSuggestion}
            onMouseOver={handleOnMouseOver}
            onKeyDown={handleOnKeyDown}
          />
        ) : null
      }

      <h1>Your last search results</h1>
      <ul>
        {state.savedResult.map((item, key) => (
          <li key={key}>{item}</li>
        ))}
      </ul>
    </div>
  );
}
/*
var locales = document.getElementById("scrolling-list"),
  listItems = locales.children,
  allLnks = new Array();
for (var i = 0; i < listItems.length; i++) {
  allLnks[i] = listItems[i].firstElementChild;
}
locales.addEventListener("keydown", function (e) {
  var focusedElement = document.activeElement,
    index = allLnks.indexOf(focusedElement);
  if (index >= 0) {
    if (e.keyCode == 40 || e.keyCode == 39) {
      if (focusedElement.parentNode.nextElementSibling) {
        var nextNode =
          focusedElement.parentNode.nextElementSibling.firstElementChild;
        nextNode.focus();
      } else {
        listItems[0].firstElementChild.focus();
      }
    }
    if (e.keyCode == 38 || e.keyCode == 37) {
      if (focusedElement.parentNode.previousElementSibling) {
        var previousNode =
          focusedElement.parentNode.previousElementSibling.firstElementChild;
        previousNode.focus();
      } else {
        locales.lastElementChild.firstElementChild.focus();
      }
    }
  }
});
*/
/*
TODO: https://thewebdev.info/2021/04/22/how-to-set-the-keyboard-caret-position-of-an-html-text-box-with-javascript/

//   urlSearchObj.append("keyword", "shoe");

  const [state, dispatch] = useReducer(reducer, initialState);
  // fetch(urlSearchObj.toString()).then((result) => console.log("search", result));
  // console.log("in Search");
  // const debouncedDispatch = debounce(
  //   (event) => dispatch({ type: "fetch", searchTerm: event.target.value }),
  //   100
  // );

  const handleOnChange = (event) => {
    if (!event.target.value) {
      // TODO: if no search term
      return;
    }

    const urlSearchObj = generateUrl();
    urlSearchObj.append("keyword", event.target.value);

    dispatch({ type: "fetch", searchTerm: event.target.value });
    const searchId = state.searchId;
    console.log("fetch searchId", searchId);
    fetch(urlSearchObj.toString())
      .then((res) => {
        if (res.status === 200) return { res: res.json(), searchId };
        else return { error: res.status, errorMessage: "API Failed" };
      })
      .then((res) => {
        if (res.error) {
          dispatch({
            type: "fail",
            error: res.error,
            errorMessage: res.errorMessage
          });
        } else if (res.searchId === state.searchId) {
          console.log("successful search", state.searchId);
          dispatch({ type: "success", data: res.data });
        }
      });
  };
  */
