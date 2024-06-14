import { RegisterFormProvider } from '@/hooks/use-register-form';

const RegisterFormLayout = ({ children }) => {
  return <RegisterFormProvider>{children}</RegisterFormProvider>;
};

export default RegisterFormLayout;
