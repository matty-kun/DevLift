import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';

interface MFAQRCodeProps {
  qrCodeSvg: string;
  secret: string;
}

const MFAQRCode: React.FC<MFAQRCodeProps> = ({ qrCodeSvg, secret }) => {
  const [copied, setCopied] = useState(false);

  const handleCopySecret = async () => {
    try {
      await navigator.clipboard.writeText(secret);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-center">
        <div
          className="bg-white p-4 rounded-lg"
          dangerouslySetInnerHTML={{ __html: qrCodeSvg }}
        />
      </div>

      <div className="space-y-2">
        <p className="text-sm text-neutral-400 text-center">
          Or enter this code manually in your authenticator app:
        </p>
        <div className="flex items-center gap-2 bg-[#0b0b10] border border-[#232336] rounded-lg p-3">
          <code className="flex-1 text-center text-custom-cyan font-mono text-sm break-all">
            {secret}
          </code>
          <button
            type="button"
            onClick={handleCopySecret}
            className="p-2 hover:bg-[#232336] rounded transition-colors flex-shrink-0"
            title="Copy secret"
          >
            {copied ? (
              <Check className="w-4 h-4 text-green-500" />
            ) : (
              <Copy className="w-4 h-4 text-neutral-400" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MFAQRCode;
