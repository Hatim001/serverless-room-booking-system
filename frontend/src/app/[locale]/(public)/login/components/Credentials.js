import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useLoginForm } from '@/hooks/use-login-form';

const Credentials = () => {
  const { setMfaType } = useLoginForm();
  return (
    <div className="w-full max-w-md mx-auto p-6">
      <div className="mt-7 border border-gray-200 rounded-xl shadow-sm dark:bg-neutral-900 dark:border-neutral-700">
        <div className="p-4 sm:p-7">
          <div className="text-center">
            <h1 className="block text-2xl font-bold text-gray-800 dark:text-white">
              Login
            </h1>
          </div>
          <div className="mt-5">
            <form>
              <div className="grid gap-y-4">
                <div>
                  <Label>Email</Label>
                  <Input className="mt-2" type="email" />
                </div>

                <div>
                  <Label>Password</Label>
                  <Input className="mt-2" type="password" />
                </div>

                <Button
                  type="submit"
                  onClick={() => setMfaType('securityQuestion')}
                >
                  Login ▶️

                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Credentials;
