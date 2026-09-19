function Option({
  option,
  selected,
  onSelect,
  disabled
}) {
  const optionId = `option-${option
    .replace(/\s+/g, "-")
    .replace(/[^a-zA-Z0-9-_]/g, "")
    .toLowerCase()}`;

  return (
    <div className="option-item">

      <input
        type="radio"
        id={optionId}
        name="mcq-answer"
        value={option}
        checked={selected}
        disabled={disabled}
        onChange={() => onSelect(option)}
      />

      <label htmlFor={optionId}>
        {option}
      </label>

    </div>
  );
}

export default Option;