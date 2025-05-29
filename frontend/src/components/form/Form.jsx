function Form({title, form}) {
    return (
        <div className='fixed inset-0 bg-zinc-400/80 flex items-center justify-center z-40'>

            <div className='bg-white p-6 rounded-xl shadow-lg w-full max-w-md relative'>
                <h2 className="text-xl font-semibold mb-4 text-center text-purple-600">{title}</h2>

                {form}
            </div>

        </div>
    )
}

export default Form;