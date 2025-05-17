import Cleave from 'cleave.js/react';


function CPFInput({ htmlFor, label, id, name, value, required, minLength, onChange }) {
  return (
    <div className='w-full h-auto'>
      {/* Rótulo do campo com indicação visual de obrigatório, se aplicável */}
      <label htmlFor={htmlFor}>
        {label}
        {required ? "*" : null}:
      </label>

      {/* Input com máscara de CPF usando Cleave.js */}
      <Cleave
        className="w-full p-2 rounded-[5px] border border-gray-400 
       focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"

        options={{
          // Define a formatação do CPF: 000.000.000-00
          delimiters: ['.', '.', '-'],
          blocks: [3, 3, 3, 2],
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

export default CPFInput;
