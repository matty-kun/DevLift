import React, { useState, useEffect } from 'react';
import { X, Loader2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import MFAQRCode from './MFAQRCode';
import MFAVerifyInput from './MFAVerifyInput';

interface MFAEnrollDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const MFAEnrollDialog: React.FC<MFAEnrollDialogProps> = ({ isOpen, onClose, onSuccess }) => {
  const [step, setStep] = useState<'loading' | 'scan' | 'verify'>('loading');
  const [factorId, setFactorId] = useState<string>('');
  const [qrCode, setQrCode] = useState<string>('');
  const [secret, setSecret] = useState<string>('');
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      enrollFactor();
    } else {
      // Reset state when dialog closes
      setStep('loading');
      setFactorId('');
      setQrCode('');
      setSecret('');
      setError(null);
    }
  }, [isOpen]);

  const enrollFactor = async () => {
    try {
      setStep('loading');
      setError(null);

      const { data, error: enrollError } = await supabase.auth.mfa.enroll({
        factorType: 'totp',
        friendlyName: 'Authenticator App',
      });

      if (enrollError) throw enrollError;

      setFactorId(data.id);
      setQrCode(data.totp.qr_code);
      setSecret(data.totp.secret);
      setStep('scan');
    } catch (err: any) {
      console.error('Enrollment error:', err);
      setError(err.message || 'Failed to start enrollment');
      setStep('scan');
    }
  };

  const handleVerifyCode = async (code: string) => {
    try {
      setVerifying(true);
      setError(null);

      // Create challenge
      const { data: challengeData, error: challengeError } = await supabase.auth.mfa.challenge({
        factorId,
      });

      if (challengeError) throw challengeError;

      // Verify code
      const { error: verifyError } = await supabase.auth.mfa.verify({
        factorId,
        challengeId: challengeData.id,
        code,
      });

      if (verifyError) throw verifyError;

      // Success - refresh session to get aal2
      await supabase.auth.refreshSession();

      onSuccess();
      onClose();
    } catch (err: any) {
      console.error('Verification error:', err);
      setError(err.message || 'Invalid code. Please try again.');
    } finally {
      setVerifying(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-[#0b0b10] border border-[#232336] rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#232336]">
          <h2 className="text-xl font-bold text-white">Enable Two-Factor Authentication</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-[#232336] rounded transition-colors"
            disabled={verifying}
          >
            <X className="w-5 h-5 text-neutral-400" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {step === 'loading' && (
            <div className="flex flex-col items-center justify-center py-8">
              <Loader2 className="w-8 h-8 text-custom-cyan animate-spin mb-4" />
              <p className="text-neutral-400">Setting up your authenticator...</p>
            </div>
          )}

          {step === 'scan' && (
            <div className="space-y-6">
              <div className="space-y-2">
                <h3 className="font-semibold text-white">Step 1: Scan QR Code</h3>
                <p className="text-sm text-neutral-400">
                  Open your authenticator app (Google Authenticator, Authy, 1Password, etc.) and scan this QR code.
                </p>
              </div>

              <MFAQRCode qrCodeSvg={qrCode} secret={secret} />

              <button
                onClick={() => setStep('verify')}
                className="w-full bg-custom-cyan text-black font-semibold py-3 rounded-lg hover:brightness-110 transition-all"
              >
                I've Scanned the Code
              </button>
            </div>
          )}

          {step === 'verify' && (
            <div className="space-y-6">
              <div className="space-y-2">
                <h3 className="font-semibold text-white">Step 2: Verify Code</h3>
                <p className="text-sm text-neutral-400">
                  Enter the 6-digit code from your authenticator app.
                </p>
              </div>

              <MFAVerifyInput
                onComplete={handleVerifyCode}
                loading={verifying}
                error={error}
              />

              <button
                onClick={() => setStep('scan')}
                disabled={verifying}
                className="w-full text-neutral-400 hover:text-white text-sm underline disabled:opacity-50"
              >
                Back to QR Code
              </button>
            </div>
          )}

          {error && step !== 'verify' && (
            <div className="mt-4 p-3 bg-red-500/10 border border-red-500 text-red-500 rounded-lg text-sm">
              {error}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MFAEnrollDialog;
