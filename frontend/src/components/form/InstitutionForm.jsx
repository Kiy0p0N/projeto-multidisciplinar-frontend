// Importação dos componentes e bibliotecas
import TextInput from "../input/TextInput";
import ImgInput from "../input/ImgInput";
import NumbersInput from "../input/NumbersInput";
import { Button } from "@mui/material";
import { useState } from "react";
import axios from "axios";
import { apiUrl } from "../../utils/constants";

function InstitutionForm() {
    // Estado responsável pelo preview da imagem
    const [preview, setPreview] = useState(null);

    // Estado para armazenar dados do formulário
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

    // Estados para feedback do usuário
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    /**
     * Atualiza os campos do formulário dinamicamente.
     */
    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    /**
     * Manipula o upload da imagem e gera um preview local.
     */
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setPreview(URL.createObjectURL(file));
        }
    };

    /**
     * Validação simples do formulário.
     * Verifica se todos os campos obrigatórios foram preenchidos e se a imagem foi selecionada.
     */
    const isFormValid =
        form.name.trim() &&
        form.cnpj.trim() &&
        form.email.trim() &&
        form.phone.trim() &&
        form.address.trim() &&
        form.city.trim() &&
        form.state.trim() &&
        form.zip_code.trim() &&
        preview !== null;

    /**
     * Manipula o envio do formulário para o backend.
     */
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const formData = new FormData();

            // Adiciona todos os campos do formulário ao FormData
            Object.entries(form).forEach(([key, value]) => {
                formData.append(key, value);
            });

            // Verifica se a imagem foi selecionada
            const imageInput = document.getElementById("image");
            if (imageInput?.files.length > 0) {
                formData.append("image", imageInput.files[0]);
            } else {
                setError("A imagem da instituição é obrigatória.");
                return;
            }

            // Envia dados para o backend
            const response = await axios.post(`${apiUrl}/institution`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            if (response.status === 200) {
                setSuccess(response.data.message);
                window.location.reload(); // Recarrega a página após sucesso
            }
        } catch (error) {
            if (error.response) {
                setError(error.response.data.message || "Erro ao enviar os dados.");
                console.warn("Erro no servidor:", error.response.data);
            } else {
                setError("Erro ao conectar com o servidor.");
                console.error("Erro desconhecido:", error);
            }
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="form bg-white shadow-lg p-6 rounded-xl space-y-6 max-w-xl mx-auto w-full"
        >
            {/* Mensagens de erro */}
            {error && <p className="text-center text-red-500">{error}</p>}

            {/* Campo: Nome da instituição */}
            <TextInput
                htmlFor="name"
                label="Nome da Instituição"
                name="name"
                id="name"
                value={form.name}
                onChange={handleChange}
                required
            />

            {/* Campo: CNPJ */}
            <NumbersInput
                htmlFor="cnpj"
                label="CNPJ"
                id="cnpj"
                name="cnpj"
                blocks={[2, 3, 3, 4, 2]}
                delimiters={['.', '.', '/', '-']}
                value={form.cnpj}
                onChange={handleChange}
                required
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
                required
            />

            {/* Campo: Telefone */}
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
                required
            />

            {/* Campo: Endereço */}
            <TextInput
                htmlFor="address"
                label="Endereço"
                name="address"
                id="address"
                value={form.address}
                onChange={handleChange}
                required
            />

            {/* Campos: Cidade e Estado */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <TextInput
                    htmlFor="city"
                    label="Cidade"
                    name="city"
                    id="city"
                    value={form.city}
                    onChange={handleChange}
                    required
                />

                <TextInput
                    htmlFor="state"
                    label="Estado (UF)"
                    name="state"
                    id="state"
                    maxLength={2}
                    value={form.state}
                    onChange={handleChange}
                    required
                />
            </div>

            {/* Campo: CEP */}
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
                required
            />

            {/* Campo: Upload de imagem */}
            <ImgInput
                htmlFor="image"
                label="Imagem da Instituição"
                name="image"
                id="image"
                onChange={handleImageChange}
                preview={preview}
            />

            {/* Mensagem de sucesso */}
            {success && <p className="text-center text-green-500">{success}</p>}

            {/* Botão de envio */}
            <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                disabled={!isFormValid}
            >
                Cadastrar
            </Button>
        </form>
    );
}

export default InstitutionForm;
