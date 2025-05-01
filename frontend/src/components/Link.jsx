function Link(props) {
    return (
        <a href={props.href}
            className="text-lg font-medium font-sans text-white duration-200 hover:text-blue-400"
        >
            {props.text}
        </a>
    );
}

export default Link;