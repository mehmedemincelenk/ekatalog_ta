import { memo } from 'react';
import { THEME } from '../../../data/config';
import ReferenceItem from './ReferenceItem';

interface ReferencesProps {
  references: Array<{ id: number; logo: string; name: string }>;
  isAdmin: boolean;
  onUpdate: (id: number, file: File) => Promise<void>;
}

/**
 * REFERENCES COMPONENT
 * -----------------------------------------------------------
 * Displays trusted partners. Now fully modular and admin-editable.
 */
const References = memo(({ references, isAdmin, onUpdate }: ReferencesProps) => {
  const referencesTheme = THEME.references;

  return (
    <section className={referencesTheme.layout}>
      <div className={referencesTheme.container}>
        
        {/* HEADER */}
        <h2 className={referencesTheme.headerTitle}>
          referanslar
        </h2>

        {/* LOGO GRID */}
        <div className={referencesTheme.grid}>
          {references.map((item: { id: number; logo: string; name: string }) => (
            <ReferenceItem 
              key={item.id}
              id={item.id}
              logo={item.logo}
              name={item.name}
              isAdmin={isAdmin}
              onUpdate={onUpdate}
            />
          ))}
        </div>
      </div>
    </section>
  );
});

export default References;
