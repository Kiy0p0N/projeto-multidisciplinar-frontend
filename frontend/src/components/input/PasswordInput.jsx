import { IconButton } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useState } from 'react';

function PasswordInput({
    htmlFor,
    label,
    id,
    name,
    required,
    value,
    onChange,
    compareTo = '', // senha para comparar (opcional)
    errorMessage = '' // mensagem de erro customizável
}) {
    const [showPassword, setShowPassword] = useState(false);
    const togglePasswordVisibility = () => setShowPassword(prev => !prev);

    const hasError = compareTo !== '' && value !== compareTo;

    return (
        <div className="w-full h-auto relative">
            <label htmlFor={htmlFor} className='font-medium'>
                {label}{required ? '*' : ''}:
            </label>

            <input
                className={`w-full p-2 pr-10 rounded-[5px] border ${
                    hasError ? 'border-red-500' : 'border-gray-400'
                } focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500`}
                type={showPassword ? 'text' : 'password'}
                id={id}
                name={name}
                required={required}
                value={value}
                onChange={onChange}
            />

            <IconButton
                type="button"
                onClick={togglePasswordVisibility}
                className="!absolute right-1 top-2/3 -translate-y-1/2 !p-1"
            >
                {showPassword ? <VisibilityOff /> : <Visibility />}
            </IconButton>

            {hasError && value && (
                <p className="text-sm text-red-500 mt-1">
                    {errorMessage || 'As senhas não coincidem.'}
                </p>
            )}
        </div>
    );
}

export default PasswordInput;
