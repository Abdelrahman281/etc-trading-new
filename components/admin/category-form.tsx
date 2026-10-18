'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { updateCategory } from '@/lib/actions';
import { uploadCatalogImage } from '@/lib/upload-image';
import { useTranslations } from 'next-intl';
import type { Category } from '@/lib/types';

interface CategoryFormProps {
  category: Category;
  locale?: string;
}

export function CategoryForm({ category, locale = 'en' }: CategoryFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(category.image_url ?? null);
  const t = useTranslations('Admin.categoryForm');

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setImagePreview(file ? URL.createObjectURL(file) : category.image_url ?? null);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSaved(false);
    const form = e.currentTarget;
    const formData = new FormData(form);
    const imageInput = form.elements.namedItem('image') as HTMLInputElement;
    const imageFile = imageInput?.files?.[0];
    formData.delete('image');

    startTransition(async () => {
      let imageUrl = category.image_url ?? '';
      if (imageFile) {
        const uploaded = await uploadCatalogImage(imageFile, 'categories');
        if (uploaded.error) {
          setError(uploaded.error);
          return;
        }
        imageUrl = uploaded.url ?? imageUrl;
      }
      formData.set('image_url', imageUrl);

      const result = await updateCategory(category.id, formData);
      if (result.success) {
        setSaved(true);
        router.refresh();
      } else {
        setError(result.error ?? t('error'));
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">
          {error}
        </div>
      )}

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="name">
            {t('name')} <span className="text-orange-500">*</span>
          </Label>
          <Input id="name" name="name" defaultValue={category.name} required />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="name_ar">{t('nameAr')}</Label>
          <Input id="name_ar" name="name_ar" dir="rtl" defaultValue={category.name_ar ?? ''} />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="short_name">
            {t('shortName')} <span className="text-orange-500">*</span>
          </Label>
          <Input id="short_name" name="short_name" defaultValue={category.short_name} required />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="short_name_ar">{t('shortNameAr')}</Label>
          <Input id="short_name_ar" name="short_name_ar" dir="rtl" defaultValue={category.short_name_ar ?? ''} />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="description">{t('description')}</Label>
          <Textarea id="description" name="description" rows={4} defaultValue={category.description} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="description_ar">{t('descriptionAr')}</Label>
          <Textarea id="description_ar" name="description_ar" dir="rtl" rows={4} defaultValue={category.description_ar ?? ''} />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="image">{t('image')}</Label>
        <div className="flex items-center gap-4">
          {imagePreview && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={imagePreview}
              alt=""
              className="h-20 w-20 shrink-0 rounded-lg border border-navy-100 object-cover"
            />
          )}
          <Input
            id="image"
            name="image"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleImageChange}
            className="max-w-sm"
          />
        </div>
        <p className="text-xs text-navy-400">{t('imageHint')}</p>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="sort_order">{t('sortOrder')}</Label>
        <Input
          id="sort_order"
          name="sort_order"
          type="number"
          defaultValue={category.sort_order ?? 0}
          className="max-w-[160px]"
        />
      </div>

      <div className="flex items-center gap-3 pt-2">
        <Button
          type="submit"
          disabled={isPending}
          className="bg-orange-500 text-white hover:bg-orange-600"
        >
          {isPending ? (
            <Loader2 className="me-2 h-4 w-4 animate-spin" />
          ) : (
            <Save className="me-2 h-4 w-4" />
          )}
          {t('save')}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push(`/${locale}/admin/categories`)}
          className="border-navy-200"
        >
          {t('cancel')}
        </Button>
        {saved && !isPending && (
          <span className="text-sm font-medium text-green-600">{t('saved')}</span>
        )}
      </div>
    </form>
  );
}
