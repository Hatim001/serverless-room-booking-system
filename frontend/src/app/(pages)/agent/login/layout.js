import { LoginFormProvider } from '@/hooks/use-login-form';

const LoginFormLayout = ({ children }) => {
  return <LoginFormProvider>{children}</LoginFormProvider>;
};

export default LoginFormLayout;
