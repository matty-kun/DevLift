import React, { useState, useRef, useEffect } from 'react';

interface MFAVerifyInputProps {
  onComplete: (code: string) => void;
  loading?: boolean;
  error?: string | null;
}

const MFAVerifyInput: React.FC<MFAVerifyInputProps> = ({ onComplete, loading, error }) => {
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    // Focus first input on mount
    inputRefs.current[0]?.focus();
  }, []);

  const handleChange = (index: number, value: string) => {
    // Only allow digits
    if (value && !/^\d$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Call onComplete when all 6 digits are entered
    if (newCode.every(digit => digit !== '')) {
      onComplete(newCode.join(''));
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    // Handle backspace
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').trim();

    // Only process if it's 6 digits
    if (/^\d{6}$/.test(pastedData)) {
      const newCode = pastedData.split('');
      setCode(newCode);
      inputRefs.current[5]?.focus();
      onComplete(pastedData);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-center gap-2">
        {code.map((digit, index) => (
          <input
            key={index}
            ref={el => inputRefs.current[index] = el}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onPaste={handlePaste}
            disabled={loading}
            className={`w-12 h-14 text-center text-2xl font-bold border-2 rounded-lg bg-black text-white transition-all
              ${error ? 'border-red-500' : 'border-[#232336]'}
              focus:border-custom-purple focus:bg-[#0302025f] outline-none
              disabled:opacity-50 disabled:cursor-not-allowed`}
          />
        ))}
      </div>

      {error && (
        <div className="text-center text-red-500 text-sm">
          {error}
        </div>
      )}
    </div>
  );
};

export default MFAVerifyInput;
