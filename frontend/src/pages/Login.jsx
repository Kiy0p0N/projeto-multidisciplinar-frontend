import LoginForm from "../components/form/LoginForm";
import Form from "../components/form/Form";

function Login() {
    return (
        <main className="container flex justify-center items-center min-h-screen">
            <Form 
                title='Entre com suas credenciais'
                form={<LoginForm />}
            />
        </main>
    );
}

export default Login;
