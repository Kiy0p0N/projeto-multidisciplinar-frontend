function Card(props) {
    return (
        <div className="w-96 h-72 flex flex-col items-center justify-center gap-5 rounded-2xl border-1 border-blue-500 p-8 drop-shadow-2xl">

            <span className="text-blue-500">{props.icon}</span>
            <h1 className="text-2xl font-bold">{props.title}</h1>
            <p className="text-[16px] text-center ">{props.content}</p>
        </div>
    );
}

export default Card;