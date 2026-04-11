import { TECH } from '../data/config';

export const getImageUrl = (path: string | null | undefined): string | null => {
  if (!path) return null;
  if (path.startsWith('http') || path.startsWith('data:')) return path;
  
  const baseUrl = import.meta.env.BASE_URL.replace(/\/$/, '');
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${baseUrl}${cleanPath}`;
};

export const PLACEHOLDER_EMOJI = TECH.image.placeholderEmoji;

const fileToImage = (file: File): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error('Resim dosyası açılamadı.'));
      img.src = e.target?.result as string;
    };
    reader.onerror = () => reject(new Error('Dosya okuma hatası.'));
    reader.readAsDataURL(file);
  });
};

/**
 * processDualImage: Tek bir dosyadan HQ ve LQ kopyaları üretir.
 */
export async function processDualImage(file: File): Promise<{ hq: Blob, lq: Blob }> {
  const img = await fileToImage(file);
  
  const createCopy = (maxSize: number, quality: number): Promise<Blob> => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      let { width, height } = img;

      if (width > height && width > maxSize) {
        height = Math.round((height * maxSize) / width);
        width = maxSize;
      } else if (height > maxSize) {
        width = Math.round((width * maxSize) / height);
        height = maxSize;
      }

      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0, width, height);
      }
      
      canvas.toBlob((blob) => resolve(blob!), 'image/jpeg', quality);
    });
  };

  const hq = await createCopy(TECH.image.hqSize, TECH.image.uploadQuality);
  const lq = await createCopy(TECH.image.lqSize, TECH.image.quality);

  return { hq, lq };
}

/**
 * compressImage: Eski bileşenler için geriye dönük uyumluluk sağlar.
 * Gelen dosyayı sıkıştırıp Base64 string döner.
 */
export async function compressImage(file: File, maxSize: number, quality: number): Promise<string> {
  const img = await fileToImage(file);
  const canvas = document.createElement('canvas');
  let { width, height } = img;

  if (width > height && width > maxSize) {
    height = Math.round((height * maxSize) / width);
    width = maxSize;
  } else if (height > maxSize) {
    width = Math.round((width * maxSize) / height);
    maxSize = maxSize;
  }

  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, width, height);
    ctx.drawImage(img, 0, 0, width, height);
  }
  
  return canvas.toDataURL('image/jpeg', quality);
}
