'use client';

import { useState, useTransition } from 'react';
import { Loader2, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { updateSubCategory } from '@/lib/actions';
import { useTranslations } from 'next-intl';
import type { SubCategory } from '@/lib/types';

export function SubCategoryForm({ subCategory }: { subCategory: SubCategory }) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const t = useTranslations('Admin.subCategoryForm');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSaved(false);
    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      const result = await updateSubCategory(subCategory.id, formData);
      if (result.success) {
        setSaved(true);
      } else {
        setError(t('error'));
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="grid items-end gap-3 sm:grid-cols-[1fr_1fr_auto]">
      <div className="space-y-1.5">
        <Label htmlFor={`sub-name-${subCategory.id}`}>{t('name')}</Label>
        <Input
          id={`sub-name-${subCategory.id}`}
          name="name"
          defaultValue={subCategory.name}
          required
        />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor={`sub-name-ar-${subCategory.id}`}>{t('nameAr')}</Label>
        <Input
          id={`sub-name-ar-${subCategory.id}`}
          name="name_ar"
          dir="rtl"
          defaultValue={subCategory.name_ar ?? ''}
        />
      </div>
      <div className="flex items-center gap-2">
        <Button
          type="submit"
          size="sm"
          disabled={isPending}
          className="bg-orange-500 text-white hover:bg-orange-600"
        >
          {isPending ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <Save className="h-3.5 w-3.5" />
          )}
        </Button>
        {saved && !isPending && (
          <span className="text-xs font-medium text-green-600">{t('saved')}</span>
        )}
        {error && (
          <span className="text-xs font-medium text-red-600">{error}</span>
        )}
      </div>
    </form>
  );
}
