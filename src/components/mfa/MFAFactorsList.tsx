import React, { useState } from 'react';
import { Shield, Trash2, CheckCircle, AlertCircle } from 'lucide-react';
import type { Factor } from '@supabase/supabase-js';

interface MFAFactorsListProps {
  factors: Factor[];
  onUnenroll: (factorId: string) => Promise<void>;
}

const MFAFactorsList: React.FC<MFAFactorsListProps> = ({ factors, onUnenroll }) => {
  const [unenrolling, setUnenrolling] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const handleUnenroll = async (factorId: string) => {
    if (confirmDelete !== factorId) {
      setConfirmDelete(factorId);
      return;
    }

    try {
      setUnenrolling(factorId);
      await onUnenroll(factorId);
    } catch (err) {
      console.error('Failed to unenroll factor:', err);
    } finally {
      setUnenrolling(null);
      setConfirmDelete(null);
    }
  };

  if (factors.length === 0) {
    return (
      <div className="text-center py-8 text-neutral-400">
        <Shield className="w-12 h-12 mx-auto mb-3 opacity-50" />
        <p>No MFA factors enrolled yet.</p>
        <p className="text-sm mt-1">Enable two-factor authentication to secure your account.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {factors.map((factor) => (
        <div
          key={factor.id}
          className="flex items-center justify-between p-4 bg-[#0b0b10] border border-[#232336] rounded-lg"
        >
          <div className="flex items-center gap-3">
            <Shield className="w-5 h-5 text-custom-cyan" />
            <div>
              <p className="text-white font-medium">
                {factor.friendly_name || `${factor.factor_type.toUpperCase()} Authenticator`}
              </p>
              <div className="flex items-center gap-2 mt-1">
                {factor.status === 'verified' ? (
                  <span className="flex items-center gap-1 text-xs text-green-500">
                    <CheckCircle className="w-3 h-3" />
                    Verified
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-xs text-yellow-500">
                    <AlertCircle className="w-3 h-3" />
                    Unverified
                  </span>
                )}
                <span className="text-xs text-neutral-500">
                  {factor.factor_type.toUpperCase()}
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={() => handleUnenroll(factor.id)}
            disabled={unenrolling === factor.id}
            className={`p-2 rounded-lg transition-colors ${
              confirmDelete === factor.id
                ? 'bg-red-500/20 text-red-500 hover:bg-red-500/30'
                : 'hover:bg-[#232336] text-neutral-400 hover:text-red-500'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
            title={confirmDelete === factor.id ? 'Click again to confirm' : 'Remove this factor'}
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ))}

      {confirmDelete && (
        <div className="text-sm text-yellow-500 text-center bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3">
          ⚠️ Click delete again to confirm removal. You will be signed out after removing this factor.
        </div>
      )}
    </div>
  );
};

export default MFAFactorsList;
