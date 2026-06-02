// File storage. In Supabase mode, uploads to the `avatars` bucket and returns
// a public URL. In localMode, returns a downscaled data URL.

import { supabase, localMode } from './supabase.js';
import { currentUser } from './auth.js';

const MAX_DIM = 512;

function downscale(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(reader.error);
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error('image load failed'));
      img.onload = () => {
        const scale = Math.min(1, MAX_DIM / Math.max(img.width, img.height));
        const w = Math.round(img.width * scale);
        const h = Math.round(img.height * scale);
        const canvas = document.createElement('canvas');
        canvas.width = w; canvas.height = h;
        canvas.getContext('2d').drawImage(img, 0, 0, w, h);
        canvas.toBlob(blob => {
          if (!blob) return reject(new Error('encode failed'));
          resolve({ blob, dataUrl: canvas.toDataURL('image/jpeg', 0.85), w, h });
        }, 'image/jpeg', 0.85);
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
}

export async function uploadAvatar(file) {
  const { blob, dataUrl } = await downscale(file);
  if (localMode) return dataUrl;
  const u = await currentUser();
  if (!u) throw new Error('Not signed in');
  const path = `${u.id}/avatar-${Date.now()}.jpg`;
  const { error } = await supabase.storage.from('avatars').upload(path, blob, {
    contentType: 'image/jpeg', upsert: true,
  });
  if (error) throw error;
  const { data } = supabase.storage.from('avatars').getPublicUrl(path);
  return data.publicUrl;
}

// Open the OS picker, downscale, upload, return the URL.
export function pickAndUploadAvatar() {
  return new Promise((resolve, reject) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.style.display = 'none';
    input.onchange = async () => {
      const file = input.files && input.files[0];
      input.remove();
      if (!file) return resolve(null);
      try { resolve(await uploadAvatar(file)); }
      catch (e) { reject(e); }
    };
    document.body.appendChild(input);
    input.click();
  });
}
