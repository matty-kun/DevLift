import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../common/Button';
import Input from '../common/Input';
import ImageUpload from '../common/ImageUpload';
import Toast from '../common/Toast';

const StartupSettings: React.FC = () => {
  const { session, profile } = useAuth();
  const [loading, setLoading] = useState(true);
  const [startupName, setStartupName] = useState('');
  const [website, setWebsite] = useState('');
  const [industry, setIndustry] = useState('');
  const [description, setDescription] = useState('');
  const [logoUrl, setLogoUrl] = useState('');
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' as 'success' | 'error' });

  useEffect(() => {
    const fetchStartupData = async () => {
      if (session?.user?.id) {
        const { data, error } = await supabase
          .from('startups')
          .select('name, website, industry, description, logo_url')
          .eq('founder_id', session.user.id);

        if (error) {
          console.error('Error fetching startup data:', error);
          setToast({ show: true, message: `Error fetching startup data: ${error.message}`, type: 'error' });
        } else if (data && data.length > 0) {
          const startup = data[0]; // Take the first startup
          setStartupName(startup.name || '');
          setWebsite(startup.website || '');
          setIndustry(startup.industry || '');
          setDescription(startup.description || '');
          setLogoUrl(startup.logo_url || '');
        }
      }
      setLoading(false);
    };

    fetchStartupData();
  }, [session?.user?.id]);

  const uploadLogo = async (file: File) => {
    if (!session?.user?.id) return null;

    const fileExt = file.name.split('.').pop();
    const fileName = `${session.user.id}-${Math.random()}.${fileExt}`;
    const filePath = `startup_logos/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('startup_logos') // Assuming a bucket named 'startup_logos'
      .upload(filePath, file);

    if (uploadError) {
      throw uploadError;
    }

    const { data } = supabase.storage.from('startup_logos').getPublicUrl(filePath);
    return data.publicUrl || ''; // Ensure it always returns a string
  };

  const handleUpdateStartup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    let newLogoUrl: string = logoUrl; // Explicitly type as string

    if (!session?.user?.id) {
      setToast({ show: true, message: 'User not authenticated.', type: 'error' });
      setLoading(false);
      return;
    }

    try {
      if (logoFile) {
        const uploadedUrl = await uploadLogo(logoFile);
        if (uploadedUrl) {
          newLogoUrl = uploadedUrl;
        } else {
          throw new Error('Startup logo upload failed: No URL returned.');
        }
      }

      const startupData = {
        name: startupName,
        website,
        industry,
        description,
        logo_url: newLogoUrl,
        founder_id: session.user.id, // Ensure founder_id is set for upsert
      };

      const { error } = await supabase
        .from('startups')
        .upsert(startupData, { onConflict: 'founder_id' });

      if (error) {
        setToast({ show: true, message: `Error updating startup: ${error.message}`, type: 'error' });
      } else {
        setToast({ show: true, message: 'Startup profile updated successfully!', type: 'success' });
      }
    } catch (error: any) {
      setToast({ show: true, message: `Error uploading logo: ${error.message}`, type: 'error' });
    }
    setLoading(false);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {toast.show && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ ...toast, show: false })}
        />
      )}
      <h2 className="text-2xl font-bold text-white mb-6">Startup Settings</h2>
      <div className="bg-neutral-900 p-8 rounded-lg">
        <form onSubmit={handleUpdateStartup}>
          <div className="mb-6">
            <ImageUpload
              label="Startup Logo"
              onFileChange={setLogoFile}
              currentImageUrl={logoUrl}
            />
          </div>
          <div className="mb-6">
            <Input
              label="Startup Name"
              type="text"
              value={startupName}
              onChange={(e) => setStartupName(e.target.value)}
            />
          </div>
          <div className="mb-6">
            <Input
              label="Website"
              type="url"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
            />
          </div>
          <div className="mb-6">
            <Input
              label="Industry"
              type="text"
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
            />
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium text-neutral-400 mb-2">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-3 border border-neutral-700 rounded-md bg-neutral-800 text-white focus:ring-2 focus:ring-custom-cyan transition"
              rows={4}
            />
          </div>
          <Button type="submit" disabled={loading} variant="primary" size="lg">
            {loading ? 'Saving...' : 'Save Changes'}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default StartupSettings;
