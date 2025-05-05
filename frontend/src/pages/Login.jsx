import { Button, TextField, FormControl, InputLabel, OutlinedInput, InputAdornment, IconButton } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material'
import { Link } from 'react-router-dom';
import { useState } from 'react';

function Login() {
    const [showPassword, setShowPassword] = useState(false);

    // Quando o ícone for clicado, troca o modo de exibição, 'text' ou 'password'
    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const handleMouseUpPassword = (event) => {
        event.preventDefault();
    };

    return (
        <div className="w-full min-h-dvh flex flex-col">

            <main className="flex flex-col w-full h-dvh justify-center items-center">
                <div className='w-96 h-auto p-5 flex flex-col gap-2 shadow-2xl rounded-2xl'>

                    {/* Email */}
                    <TextField id="email" label="Email" variant="outlined" />

                    {/* Senha */}
                    <FormControl className='w-full' variant="outlined">
                        <InputLabel htmlFor="outlined-adornment-password">Senha</InputLabel>
                        <OutlinedInput
                            id="password"
                            name='password'
                            type={showPassword ? 'text' : 'password'}
                            endAdornment={
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label={
                                            showPassword ? 'hide the password' : 'display the password'
                                        }
                                        onClick={handleClickShowPassword}
                                        onMouseDown={handleMouseDownPassword}
                                        onMouseUp={handleMouseUpPassword}
                                        edge="end"
                                        >
                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            }
                            label="Senha"
                        />
                    </FormControl>

                    <Button variant="contained">Entrar</Button>

                    <hr />
                    
                    {/* Link para o formulário de criação da conta */}
                    <p className='text-center'>
                        Não tem conta? <Link to="/register" className='text-blue-500 hover:underline hover:text-blue-400 duration-150'>
                                            Cadastre-se
                                        </Link>
                    </p>
                </div>
            </main>

        </div>
    );
}

export default Login;