import React from 'react';
import { RefreshCw } from 'lucide-react';

import { words } from '@/utils/caeser-words';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const CaesarCipher = () => {
  const [currentWord, setCurrentWord] = React.useState(
    words[Math.floor(Math.random() * words.length)],
  );
  const [answer, setAnswer] = React.useState('');

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
                  <div className="mt-2 flex gap-2">
                    <Input
                      type="text"
                      disabled
                      placeholder={currentWord.toUpperCase()}
                      className="flex-1 placeholder:text-black placeholder:font-semibold"
                    />
                    <Button
                      type="button"
                      onClick={() => {
                        setCurrentWord(
                          words[Math.floor(Math.random() * words.length)],
                        );
                      }}
                    >
                      <RefreshCw />
                    </Button>
                  </div>
                </div>
                <div>
                  <Input
                    type="text"
                    placeholder={'Enter Caesar Cipher Encrypted Word'}
                  />
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

export default CaesarCipher;
