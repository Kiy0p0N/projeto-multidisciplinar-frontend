function SelectInput({ htmlFor, label, id, name, required, value, onChange, options }) {
    return (
        <div className="w-full h-auto">
            <label htmlFor={htmlFor} className="font-medium">
                {label}{required ? "*" : ""}:
            </label>
            <select
                className="w-full p-2 rounded-[5px] border border-gray-400 bg-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                id={id}
                name={name}
                required={required}
                value={value}
                onChange={onChange}
            >
                <option value="">Selecione...</option>
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
        </div>
    );
}

export default SelectInput;
