import "./styles.css";

export default function SearchInputs({ inputValue, setInputValue }) {
  function SearchQuery(event) {
    setInputValue(event.target.value.toUpperCase());
  }

  return (
    <input
      type="text"
      placeholder="Search"
      value={inputValue}
      onChange={SearchQuery}
    />
  );
}
