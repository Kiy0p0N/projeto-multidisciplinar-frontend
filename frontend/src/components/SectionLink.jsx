function SectionLink({text, href, onClick}) {
    return (
        <a href={href}
            onClick={onClick}
            className="text-lg font-medium font-sans text-white duration-200 hover:text-blue-400"
        >
            {text}
        </a>
    );
}

export default SectionLink;