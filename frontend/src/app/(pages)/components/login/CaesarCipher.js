import React from 'react';

import { z } from 'zod';
import { useForm } from 'react-hook-form';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { words } from '@/utils/caeser-words';

const formSchema = z.object({
  word: z.string(),
  encryptedWord: z.string(),
});

const CaesarCipher = ({ onSubmit, disableForm = false }) => {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      word: generateRandomWord(),
      encryptedWord: '',
    },
    mode: 'onChange',
  });

  const generateRandomWord = () => {
    return words[Math.floor(Math.random() * words.length)];
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
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <div className="grid gap-y-6">
                  <FormField
                    control={form.control}
                    name="word"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Word</FormLabel>
                        <FormControl>
                          <Input
                            className="mt-2"
                            type="text"
                            disabled={true}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="encryptedWord"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Encrypted Text</FormLabel>
                        <FormControl>
                          <Input
                            className="mt-2"
                            type="text"
                            placeholder="Enter encrypted text"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button
                    type="submit"
                    disabled={form.formState.isSubmitting || disableForm}
                  >
                    Verify
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
