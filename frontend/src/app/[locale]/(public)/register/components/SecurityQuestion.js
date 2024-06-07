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
import { useRegisterForm } from '@/hooks/use-register-form';

const SecurityQuestion = () => {
  const { setMfaType } = useRegisterForm();
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
                    <Select className="w-full">
                      <SelectTrigger>
                        <SelectValue placeholder="Select a question" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Fruits</SelectLabel>
                          <SelectItem value="apple">Apple</SelectItem>
                          <SelectItem value="banana">Banana</SelectItem>
                          <SelectItem value="blueberry">Blueberry</SelectItem>
                          <SelectItem value="grapes">Grapes</SelectItem>
                          <SelectItem value="pineapple">Pineapple</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Input type="text" placeholder={'Security Answer'} />
                </div>
                <Button
                  type="submit"
                  onClick={() => setMfaType('caesarCipher')}
                >
                  Save Answer
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
