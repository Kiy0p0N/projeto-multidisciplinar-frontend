import UserForm from '../components/form/UserForm';
import Form from '../components/form/Form';

function RegisterUser() {
    return (
        <main className="container justify-center items-center py-24 bg-zinc-400/80">
            <Form
                title='Registre-se'
                form={<UserForm />}
            />
        </main>
    );
}

export default RegisterUser;
