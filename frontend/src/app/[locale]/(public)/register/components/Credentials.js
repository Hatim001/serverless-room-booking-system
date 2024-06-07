import { useRegisterForm } from '@/hooks/use-register-form';

const Credentials = () => {
  const { setMfaType } = useRegisterForm();
  return (
    <div>
      Credentials
      <button
        type="button"
        onClick={() => setMfaType('securityQuestion')}
        class="py-3 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-800"
      >
        Button
      </button>
    </div>
  );
};

export default Credentials;
