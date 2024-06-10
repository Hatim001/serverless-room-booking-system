import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { words } from '@/utils/caeser-words';
import { TbRefresh } from 'react-icons/tb';
import React from 'react';

const CaesarCipher = () => {
  const [currentWord, setCurrentWord] = React.useState(words[0]);
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
                    <Input type="text" disabled placeholder={currentWord.toUpperCase()} className="flex-1 placeholder:text-black placeholder:font-semibold" />
                    <Button
                      type="button"
                      onClick={() => {
                        setCurrentWord(
                          words[Math.floor(Math.random() * words.length)],
                        );
                      }}
                    >
                      <TbRefresh size={20} />
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
