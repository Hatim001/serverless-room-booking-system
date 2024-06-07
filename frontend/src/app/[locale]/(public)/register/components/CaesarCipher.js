import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import React from 'react';

const CaesarCipher = () => {
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
            <form>
              <div className="grid gap-y-6">
                <div>
                  <Label>Enter Encryption key for Caesar Cipher</Label>
                  <Input
                    className="mt-2"
                    type="number"
                    placeholder="Encryption key"
                  />
                </div>
                <Button
                  type="submit"
                  onClick={() => setMfaType('caesarCipher')}
                >
                  Save Key & Login
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CaesarCipher;
