// Importa o formulário customizado e layout reutilizável
import LoginForm from "../components/form/LoginForm";
import Form from "../components/form/Form";

function Login() {
    return (
        // Centraliza vertical e horizontalmente a tela de login
        <main className="flex justify-center items-center min-h-screen bg-blue-950">
            {/* Componente de layout que exibe o formulário e o título */}
            <Form 
                title='Entre com suas credenciais'
                form={<LoginForm />}
            />
        </main>
    );
}

export default Login;