import logo from '../assets/image/logo.png';

function Logo() {
    return (
        <div className='flex gap-2'>
            <img src={logo} alt="Logo da VidaPlus" className='w-8' />

            <h1 className='text-3xl text-blue-400 font-bold'>VidaPlus</h1>
        </div>
    );
}

export default Logo;