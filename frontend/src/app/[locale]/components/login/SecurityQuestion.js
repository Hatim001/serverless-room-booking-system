import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useLoginForm } from '@/hooks/use-login-form';

const SecurityQuestion = () => {
  const { setMfaType } = useLoginForm();
  return (
    <div className="w-full max-w-md mx-auto p-6">
      <div className="mt-7 border border-gray-200 rounded-xl shadow-sm dark:bg-neutral-900 dark:border-neutral-700">
        <div className="p-4 sm:p-7">
          <div className="text-center">
            <h1 className="block text-2xl font-bold text-gray-800 dark:text-white">
              Security Question
            </h1>
          </div>

          <div className="mt-5">
            <form>
              <div className="grid gap-y-6">
                <div>
                  <div className="mt-2">
                    <Input
                      type="text"
                      disabled
                      placeholder={'What is your name of first pet?'}
                      className="flex-1 placeholder:text-black placeholder:font-semibold"
                    />
                  </div>
                </div>
                <div>
                  <Input type="text" placeholder={'Security Answer'} />
                </div>
                <Button
                  type="submit"
                  onClick={() => setMfaType('caesarCipher')}
                >
                  Submit Answer
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecurityQuestion;
