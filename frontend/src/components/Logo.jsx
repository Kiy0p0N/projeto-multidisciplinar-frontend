import { Link } from 'react-router-dom';

import logo from '../assets/image/logo.png';

function Logo() {
    return (
        <Link to="/" className='flex gap-2'>
            <img src={logo} alt="Logo da VidaPlus" className='w-8' />

            <h1 className='text-3xl text-blue-400 font-bold'>VidaPlus</h1>
        </Link>
    );
}

export default Logo;