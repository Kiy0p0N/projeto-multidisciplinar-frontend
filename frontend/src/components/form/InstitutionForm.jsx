import TextInput from "../input/TextInput";
import ImgInput from "../input/ImgInput";
import NumbersInput from "../input/NumbersInput";
import { Button } from "@mui/material";
import { useState } from "react";
import axios from "axios";

function InstitutionForm() {
    // Estado para armazenar o preview da imagem selecionada
    const [preview, setPreview] = useState(null);

    // Estado para armazenar os dados do formulário
    const [form, setForm] = useState({
        name: '',
        cnpj: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        state: '',
        zip_code: '',
    });

    const [error, setError] = useState(null); // Armazena mensagens de erro

    // Função para atualizar o estado do formulário ao digitar nos inputs
    const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    };

    // Função para tratar o upload de imagem
    const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
        setPreview(URL.createObjectURL(file)); // Gera um preview da imagem
    }
    };

    // Verifica se todos os campos obrigatórios foram preenchidos
    const isFormValid =
    form.name.trim() &&
    form.cnpj.trim() &&
    form.email.trim() &&
    form.phone.trim() &&
    form.address.trim() &&
    form.city.trim() &&
    form.state.trim() &&
    form.zip_code.trim() &&
    preview !== null; // Verifica se a imagem foi adicionada

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const formData = new FormData();

            // Adiciona campos do formulário ao formData
            Object.entries(form).forEach(([key, value]) => {
                formData.append(key, value);
            });

            // Verifica se há imagem selecionada
            const imageInput = document.getElementById("image");
            if (imageInput?.files.length > 0) {
                formData.append("image", imageInput.files[0]);
            } else {
                setError("Imagem obrigatória.");
                return;
            }

            const response = await axios.post("http://localhost:3000/institution", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            if (response.status === 200) {
                alert(response.data.message);
            }
        } catch (error) {
            if (error.response) {
                setError(error.response.data.message || "Erro ao enviar dados.");
                console.warn("Erro do servidor:", error.response.data);
            } else {
                setError("Erro ao conectar ao servidor.");
                console.error("Erro desconhecido:", error);
            }
        }
    };


    return (
        <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-4 max-w-2xl max-h-96 overflow-y-auto mx-auto bg-white p-8 shadow-lg rounded-xl"
        >

            {/* Exibição de erros, se houver */}
            {error && <p className="text-center text-red-500">{error}</p>}

            {/* Campo: Nome */}
            <TextInput
            htmlFor="name"
            label="Nome da Instituição"
            name="name"
            id="name"
            value={form.name}
            onChange={handleChange}
            required={true}
            />

            {/* Campo: CNPJ (com máscara) */}
            <NumbersInput
            htmlFor="cnpj"
            label="CNPJ"
            id="cnpj"
            name="cnpj"
            blocks={[2, 3, 3, 4, 2]}
            delimiters={['.', '.', '/', '-']}
            value={form.cnpj}
            onChange={handleChange}
            required={true}
            />

            {/* Campo: Email */}
            <TextInput
            htmlFor="email"
            label="Email de Contato"
            name="email"
            id="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            required={true}
            />

            {/* Campo: Telefone (com máscara) */}
            <NumbersInput
            htmlFor="phone"
            label="Telefone"
            id="phone"
            name="phone"
            delimiters={['(', ')', ' ', ' ', '-']}
            blocks={[0, 2, 0, 1, 4, 4]}
            minLength={16}
            value={form.phone}
            onChange={handleChange}
            required={true}
            />

            {/* Campo: Endereço */}
            <TextInput
            htmlFor="address"
            label="Endereço"
            name="address"
            id="address"
            value={form.address}
            onChange={handleChange}
            required={true}
            />

            {/* Campos: Cidade e Estado (em colunas) */}
            <div className="grid grid-cols-2 gap-4">
            <TextInput
                htmlFor="city"
                label="Cidade"
                name="city"
                id="city"
                value={form.city}
                onChange={handleChange}
                required={true}
            />

            <TextInput
                htmlFor="state"
                label="Estado (UF)"
                name="state"
                id="state"
                maxLength={2}
                value={form.state}
                onChange={handleChange}
                required={true}
            />
            </div>

            {/* Campo: CEP (com máscara) */}
            <NumbersInput
            htmlFor="zip_code"
            label="CEP"
            name="zip_code"
            id="zip_code"
            delimiters={['-']}
            blocks={[5, 3]}
            minLength={9}
            value={form.zip_code}
            onChange={handleChange}
            required={true}
            />

            {/* Campo: Imagem da Instituição */}
            <ImgInput
            htmlFor="image"
            label="Imagem da Instituição"
            name="image"
            id="image"
            onChange={handleImageChange}
            preview={preview}
            />

            {/* Botão de envio - desativado se o formulário estiver incompleto */}
            <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={!isFormValid}
            >
            Cadastrar
            </Button>
        </form>
    );
}

export default InstitutionForm;
