// Importa layout reutilizável e formulário de cadastro
import UserForm from '../components/form/UserForm';
import Form from '../components/form/Form';

function RegisterUser() {
    return (
        // Estrutura centralizada com fundo translúcido
        <main className="flex justify-center items-center min-h-screen bg-blue-950">
            {/* Reaproveita o componente de layout com título e formulário */}
            <Form
                title='Registre-se'
                form={<UserForm />}
            />
        </main>
    );
}

export default RegisterUser;