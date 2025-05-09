import Cleave from 'cleave.js/react';

// Componente de input para CPF com máscara formatada e estilo personalizado
function CPFInput({ htmlFor, label, id, name, cpf, setCpf, required }) {
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
          numericOnly: true, // Aceita apenas números
        }}
        value={cpf}
        onChange={(e) => setCpf(e.target.value)} // Atualiza o estado com valor formatado
        render={({ value, onChange }) => (
            <input
                id={id}
                name={name}
                value={value}       // Valor formatado vindo do Cleave
                onChange={onChange} // Manipulador controlado pelo Cleave
                required={required} // Campo obrigatório se `required` for true
            />
        )}
      />
    </div>
  );
}

export default CPFInput;
