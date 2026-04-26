import { useState } from 'react';
import { Delete, Check } from 'lucide-react';
import Button from './Button';

interface NumpadProps {
  onSubmit: (phoneNumber: string) => void;
  title?: string;
  maxDigits?: number;
}

export default function Numpad({ 
  onSubmit, 
  title = 'Sizi Arayalım',
  maxDigits = 10 
}: NumpadProps) {
  const [value, setValue] = useState('');

  const handlePress = (num: string) => {
    if (value.length < maxDigits) {
      setValue((prev) => prev + num);
    }
  };

  const handleBackspace = () => {
    setValue((prev) => prev.slice(0, -1));
  };

  const keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];

  return (
    <div className="flex flex-col items-center w-full mx-auto space-y-4">

      {/* DISPLAY FIELD */}
      <div className="flex items-center justify-between w-full h-14 px-4 bg-stone-50 border border-stone-100 rounded-2xl overflow-hidden">
        <span className="text-xl font-black text-stone-900 tracking-[0.2em]">
          {value || '05XXXXXXXX'}
        </span>
        {value.length > 0 && (
          <Button 
            onClick={handleBackspace}
            variant="ghost"
            mode="circle"
            size="sm"
            className="!text-stone-400 hover:!text-stone-900"
            icon={<Delete size={20} />}
          />
        )}
      </div>

      {/* KEYPAD GRID */}
      <div className="grid grid-cols-3 gap-3 w-full">
        {keys.map((key) => (
          <Button
            key={key}
            onClick={() => handlePress(key)}
            variant="secondary"
            mode="circle"
            className="!w-full !h-16 !text-xl font-black !bg-white hover:!border-stone-900"
          >
            {key}
          </Button>
        ))}
        
        {/* BOTTOM ROW */}
        <div className="w-full h-16" /> {/* Left empty */}
        
        <Button
          onClick={() => handlePress('0')}
          variant="secondary"
          mode="circle"
          className="!w-full !h-16 !text-xl font-black !bg-white hover:!border-stone-900"
        >
          0
        </Button>

        <Button
          onClick={() => value.length >= 10 && onSubmit(value)}
          variant="action"
          mode="circle"
          showFingerprint={true}
          disabled={value.length < 10}
          className={`!w-full !h-16 ${value.length < 10 ? 'opacity-50' : 'hover:scale-105 active:scale-95'}`}
          icon={<Check size={24} strokeWidth={3} />}
        />
      </div>
    </div>
  );
}
