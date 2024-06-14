import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import React from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useRegisterForm } from '@/hooks/use-register-form';

const formSchema = z.object({
  encryptionKey: z
    .union([z.string(), z.number()])
    .transform((value) =>
      typeof value === 'string' ? parseInt(value, 10) : value,
    )
    .refine((value) => !isNaN(value), {
      message: 'Encryption key must be a number',
    })
    .refine((value) => value > 0, {
      message: 'Encryption key must be a positive number',
    }),
});

const CaesarCipher = () => {
  const { setMfaType } = useRegisterForm();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      encryptionKey: '',
    },
    mode: 'onChange',
  });

  const saveKey = (values) => {
    // Handle form submission
    console.log('Submitted values:', values);
    setMfaType('caesarCipher');
  };

  return (
    <div className="w-full max-w-md mx-auto p-6">
      <div className="mt-7 border border-gray-200 rounded-xl shadow-sm dark:bg-neutral-900 dark:border-neutral-700">
        <div className="p-4 sm:p-7">
          <div className="text-center">
            <h1 className="block text-2xl font-bold text-gray-800 dark:text-white">
              Caesar Cipher
            </h1>
          </div>

          <div className="mt-5">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(saveKey)}>
                <div className="grid gap-y-6">
                  <FormField
                    control={form.control}
                    name="encryptionKey"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Enter Encryption key for Caesar Cipher
                        </FormLabel>
                        <FormControl>
                          <Input
                            className="mt-2"
                            type="number"
                            placeholder="Encryption key"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" disabled={form.formState.isSubmitting}>
                    Save Key & Login
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CaesarCipher;
