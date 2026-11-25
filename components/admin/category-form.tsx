'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import { createCategory, updateCategory } from '@/lib/actions';
import { uploadCatalogImage } from '@/lib/upload-image';
import { useTranslations } from 'next-intl';
import type { Category } from '@/lib/types';

const ICON_OPTIONS = ['Package', 'Nut', 'Layers', 'Zap', 'Pipette', 'Hammer'];

interface CategoryFormProps {
  category?: Category | null;
  mode: 'create' | 'edit';
  locale?: string;
}

export function CategoryForm({ category, mode, locale = 'en' }: CategoryFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(category?.image_url ?? null);
  const [iconName, setIconName] = useState(category?.icon_name ?? 'Package');
  const t = useTranslations('Admin.categoryForm');

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setImagePreview(file ? URL.createObjectURL(file) : category?.image_url ?? null);
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
      let imageUrl = category?.image_url ?? '';
      if (imageFile) {
        const uploaded = await uploadCatalogImage(imageFile, 'categories');
        if (uploaded.error) {
          setError(uploaded.error);
          return;
        }
        imageUrl = uploaded.url ?? imageUrl;
      }
      if (!imageUrl) {
        setError(t('imageRequired'));
        return;
      }
      formData.set('image_url', imageUrl);
      formData.set('icon_name', iconName);

      const result =
        mode === 'create'
          ? await createCategory(formData)
          : await updateCategory(category!.id, formData);

      if (result.success) {
        if (mode === 'create') {
          router.push(`/${locale}/admin/categories`);
        }
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
          <Input id="name" name="name" defaultValue={category?.name ?? ''} required />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="name_ar">{t('nameAr')}</Label>
          <Input id="name_ar" name="name_ar" dir="rtl" defaultValue={category?.name_ar ?? ''} />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="short_name">
            {t('shortName')} <span className="text-orange-500">*</span>
          </Label>
          <Input id="short_name" name="short_name" defaultValue={category?.short_name ?? ''} required />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="short_name_ar">{t('shortNameAr')}</Label>
          <Input id="short_name_ar" name="short_name_ar" dir="rtl" defaultValue={category?.short_name_ar ?? ''} />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="icon_name">{t('icon')}</Label>
        <Select name="icon_name" value={iconName} onValueChange={setIconName}>
          <SelectTrigger id="icon_name" className="w-full max-w-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {ICON_OPTIONS.map((icon) => (
              <SelectItem key={icon} value={icon}>
                {icon}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="description">{t('description')}</Label>
          <Textarea id="description" name="description" rows={4} defaultValue={category?.description ?? ''} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="description_ar">{t('descriptionAr')}</Label>
          <Textarea id="description_ar" name="description_ar" dir="rtl" rows={4} defaultValue={category?.description_ar ?? ''} />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="features">{t('features')}</Label>
          <Textarea
            id="features"
            name="features"
            rows={5}
            defaultValue={(category?.features ?? []).join('\n')}
            placeholder={t('featuresPlaceholder')}
          />
          <p className="text-xs text-navy-400">{t('featuresHint')}</p>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="features_ar">{t('featuresAr')}</Label>
          <Textarea
            id="features_ar"
            name="features_ar"
            dir="rtl"
            rows={5}
            defaultValue={(category?.features_ar ?? []).join('\n')}
            placeholder={t('featuresArPlaceholder')}
          />
          <p className="text-xs text-navy-400">{t('featuresHint')}</p>
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="specifications">{t('specifications')}</Label>
          <Textarea
            id="specifications"
            name="specifications"
            rows={5}
            defaultValue={(category?.specifications ?? []).map((s) => `${s.label}: ${s.value}`).join('\n')}
            placeholder={t('specificationsPlaceholder')}
          />
          <p className="text-xs text-navy-400">{t('specificationsHint')}</p>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="specifications_ar">{t('specificationsAr')}</Label>
          <Textarea
            id="specifications_ar"
            name="specifications_ar"
            dir="rtl"
            rows={5}
            defaultValue={(category?.specifications_ar ?? []).map((s) => `${s.label}: ${s.value}`).join('\n')}
            placeholder={t('specificationsArPlaceholder')}
          />
          <p className="text-xs text-navy-400">{t('specificationsHint')}</p>
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="applications">{t('applications')}</Label>
          <Textarea
            id="applications"
            name="applications"
            rows={4}
            defaultValue={(category?.applications ?? []).join('\n')}
            placeholder={t('applicationsPlaceholder')}
          />
          <p className="text-xs text-navy-400">{t('featuresHint')}</p>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="applications_ar">{t('applicationsAr')}</Label>
          <Textarea
            id="applications_ar"
            name="applications_ar"
            dir="rtl"
            rows={4}
            defaultValue={(category?.applications_ar ?? []).join('\n')}
            placeholder={t('applicationsArPlaceholder')}
          />
          <p className="text-xs text-navy-400">{t('featuresHint')}</p>
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="image">
          {t('image')} {mode === 'create' && <span className="text-orange-500">*</span>}
        </Label>
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
          defaultValue={category?.sort_order ?? 0}
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
          {mode === 'create' ? t('create') : t('save')}
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
