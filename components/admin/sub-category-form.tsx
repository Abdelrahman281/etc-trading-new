'use client';

import { useState, useTransition } from 'react';
import { Loader2, Save, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { updateSubCategory } from '@/lib/actions';
import { uploadCatalogDatasheet } from '@/lib/upload-datasheet';
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
    const form = e.currentTarget;
    const formData = new FormData(form);
    const datasheetInput = form.elements.namedItem('datasheet') as HTMLInputElement;
    const datasheetFile = datasheetInput?.files?.[0];
    formData.delete('datasheet');

    startTransition(async () => {
      let datasheetUrl = subCategory.datasheet_url ?? '';
      if (datasheetFile) {
        const uploaded = await uploadCatalogDatasheet(datasheetFile);
        if (uploaded.error) {
          setError(uploaded.error);
          return;
        }
        datasheetUrl = uploaded.url ?? datasheetUrl;
      }
      formData.set('datasheet_url', datasheetUrl);

      const result = await updateSubCategory(subCategory.id, formData);
      if (result.success) {
        setSaved(true);
      } else {
        setError(result.error ?? t('error'));
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="grid items-end gap-3 sm:grid-cols-[1fr_1fr_auto]">
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
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Label htmlFor={`sub-datasheet-${subCategory.id}`} className="shrink-0 text-xs text-navy-500">
          {t('datasheet')}
        </Label>
        <Input
          id={`sub-datasheet-${subCategory.id}`}
          name="datasheet"
          type="file"
          accept="application/pdf"
          className="max-w-xs text-xs"
        />
        {subCategory.datasheet_url && (
          <a
            href={subCategory.datasheet_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs font-medium text-orange-600 hover:text-orange-700"
          >
            <FileText className="h-3.5 w-3.5" />
            {t('currentDatasheet')}
          </a>
        )}
      </div>
    </form>
  );
}
