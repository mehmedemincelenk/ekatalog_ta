// K.I.S.S. İstemci Taraflı Resim Sıkıştırma 
// iPhone kameralarından gelen 5-10MB'lık devasa fotoğrafları anında 40-50KB seviyelerine çeker.
// Bu sayede LocalStorage (5MB) sınırı asla şişmez ve React "Beyaz Ekran" (White Screen of Death) hatası vermez.

export function compressImage(file, maxSize = 600, quality = 0.7) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        // Boyut oranını koruyarak küçült (Örn: 4000x3000 piksel -> 600x450 piksele iner)
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
        
        // Safari saydam arkaplanlı HEIC veya PNG dosyalarını siyaha çevirmesin diye zemini daima beyaza boya
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.drawImage(img, 0, 0, width, height);

        // JPEG dönüşümü: Boyutu devasa oranda küçültür (örn: 10MB -> 40KB)
        const dataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(dataUrl);
      };
      img.onerror = () => reject(new Error('Resim işlenemedi.'));
      img.src = e.target.result;
    };
    reader.onerror = () => reject(new Error('Dosya okunamadı.'));
    reader.readAsDataURL(file);
  });
}
