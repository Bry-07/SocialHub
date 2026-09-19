function SearchBar({ value, onChange, placeholder }) {
  return (
    <label className="search-field">
      <span aria-hidden="true">⌕</span>
      <input
        type="text"
        placeholder={placeholder || 'Buscar...'}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </label>
  );
}

export default SearchBar;