function ImgInput({htmlFor, label, required, name, id, onChange, preview}) {
  return (
        <div className="w-full h-auto">
            <label htmlFor={htmlFor} className='font-medium'>
                {label}{required ? "*" : ""}:
            </label>
            <input type="file" 
                name={name} 
                id={id}
                accept="image/*"
                onChange={onChange}
            />

            {/* Preview opcional da imagem */}
            {preview && (
                <img src={preview} alt="Prévia" className="w-full h-52 object-cover rounded border" />
            )}
        </div>
    );
}

export default ImgInput;