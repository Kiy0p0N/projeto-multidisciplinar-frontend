import Cleave from 'cleave.js/react';

function NumbersInput({ htmlFor, label, id, name, value, required, delimiters, blocks, minLength, onChange }) {
  return (
    <div className='w-full h-auto'>
      {/* Rótulo do campo com indicação visual de obrigatório, se aplicável */}
      <label htmlFor={htmlFor} className='font-medium'>
        {label}
        {required ? "*" : null}:
      </label>

      <Cleave
        className="w-full p-2 rounded-[5px] border border-gray-400 
       focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"

        options={{
          delimiters: delimiters,
          blocks: blocks,
          numericOnly: true,
        }}

        value={value}
        onChange={(e) => onChange({ target: { name, value: e.target.value } })}

        render={({ value, onChange }) => (
          <input
            id={id}
            name={name}
            value={value}
            onChange={onChange}
            required={required}
            minLength={minLength}
          />
        )}
      />
    </div>
  );
}

export default NumbersInput;
