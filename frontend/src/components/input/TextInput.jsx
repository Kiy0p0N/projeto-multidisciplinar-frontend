function TextInput({ htmlFor, label, id, name, type, required, placeholder, value, onChange }) {
    return (
        <div className="w-full h-auto">
            <label htmlFor={htmlFor} className='font-medium'>
                {label}{required ? "*" : ""}:
            </label>
            <input
                className="w-full p-2 rounded-[5px] border border-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                type={type || "text"}
                id={id}
                name={name}
                required={required}
                value={value}
                placeholder={placeholder || ""}
                onChange={onChange}
            />
        </div>
    );
}

export default TextInput;