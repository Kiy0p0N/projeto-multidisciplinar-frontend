// Card genérico para serviços ou informações em geral
function Card(props) {
    return (
        <div className="
            w-80 md:w-96 h-72
            flex flex-col items-center justify-center gap-5
            rounded-2xl border border-blue-500
            p-8
            shadow-lg
            hover:shadow-2xl
            transition-shadow duration-300
            bg-white
            "
        >
            {/* Ícone do serviço */}
            <span className="text-blue-500">{props.icon}</span>

            {/* Título do card */}
            <h1 className="text-2xl font-bold text-center">{props.title}</h1>

            {/* Descrição do card */}
            <p className="text-[16px] text-center text-gray-700">{props.content}</p>
        </div>
    );
}

export default Card;
