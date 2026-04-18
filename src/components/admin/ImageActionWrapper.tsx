import React, { useRef, memo, ReactNode } from 'react';
import { THEME } from '../../data/config';

interface ImageActionWrapperProps {
  children: ReactNode;
  isAdmin: boolean;
  isUploading: boolean;
  onFileSelect: (file: File) => void;
  className?: string;
}

/**
 * IMAGE ACTION WRAPPER
 * -----------------------------------------------------------
 * A specialized admin tool that turns any content into an 
 * interactive upload zone. Handles the hidden input and 
 * the "uploading" overlay automatically.
 */
const ImageActionWrapper = memo(({ 
  children, 
  isAdmin, 
  isUploading, 
  onFileSelect,
  className
}: ImageActionWrapperProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const theme = THEME.imageActionWrapper;

  const handleClick = () => {
    if (isAdmin && !isUploading) {
      fileInputRef.current?.click();
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onFileSelect(file);
    }
    // Reset input so the same file can be selected again if needed
    event.target.value = '';
  };

  const wrapperClass = `
    ${className || theme.base} 
    ${isAdmin && !isUploading ? theme.adminClickable : ''}
  `;

  return (
    <div className={wrapperClass} onClick={handleClick}>
      {/* THE ACTUAL CONTENT (IMAGE, ICON, ETC.) */}
      {children}

      {/* ADMIN OVERLAYS */}
      {isAdmin && (
        <>
          {/* HOVER HINT: Subtle darken on hover to indicate interactivity */}
          {!isUploading && <div className={theme.hoverHint} />}

          {/* UPLOADING STATE: Professional spinner overlay */}
          {isUploading && (
            <div className={theme.uploadingOverlay}>
              <div className={theme.spinner} />
              <span className={theme.uploadLabel}>
                Yükleniyor
              </span>
            </div>
          )}

          {/* HIDDEN LOGIC: The physical file input */}
          <input 
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
        </>
      )}
    </div>
  );
});

export default ImageActionWrapper;
