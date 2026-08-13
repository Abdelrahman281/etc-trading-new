'use client';

import { useState, useTransition, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import { createProduct, updateProduct } from '@/lib/actions';
import { useTranslations } from 'next-intl';
import type { Category, SubCategory, Product } from '@/lib/types';

interface ProductFormProps {
  categories: Category[];
  product?: Product | null;
  mode: 'create' | 'edit';
  locale?: string;
}

export function ProductForm({ categories, product, mode, locale = 'en' }: ProductFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState(
    product?.category_id ?? ''
  );
  const [selectedSubCategory, setSelectedSubCategory] = useState(
    product?.sub_category_id ?? ''
  );
  const t = useTranslations('Admin.productForm');

  useEffect(() => {
    if (!selectedCategory) {
      setSubCategories([]);
      return;
    }
    fetch(`/api/sub-categories?category_id=${selectedCategory}`)
      .then((res) => res.json())
      .then((data) => {
        setSubCategories(data);
      })
      .catch(() => setSubCategories([]));
  }, [selectedCategory]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      const result =
        mode === 'create'
          ? await createProduct(formData)
          : await updateProduct(product!.id, formData);

      if (result.success) {
        router.push(`/${locale}/admin/products`);
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

      <div className="space-y-1.5">
        <Label htmlFor="category_id">
          {t('category')} <span className="text-orange-500">*</span>
        </Label>
        <Select
          name="category_id"
          value={selectedCategory}
          onValueChange={(v) => {
            setSelectedCategory(v);
            setSelectedSubCategory('');
          }}
        >
          <SelectTrigger id="category_id" className="w-full">
            <SelectValue placeholder={t('categoryPlaceholder')} />
          </SelectTrigger>
          <SelectContent>
            {categories.map((c) => (
              <SelectItem key={c.id} value={c.id}>
                {c.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="sub_category_id">{t('subCategory')}</Label>
        <Select
          name="sub_category_id"
          value={selectedSubCategory}
          onValueChange={setSelectedSubCategory}
          disabled={subCategories.length === 0}
        >
          <SelectTrigger id="sub_category_id" className="w-full">
            <SelectValue placeholder={t('subCategoryPlaceholder')} />
          </SelectTrigger>
          <SelectContent>
            {subCategories.map((sub) => (
              <SelectItem key={sub.id} value={sub.id}>
                {sub.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="name">
          {t('name')} <span className="text-orange-500">*</span>
        </Label>
        <Input
          id="name"
          name="name"
          defaultValue={product?.name ?? ''}
          placeholder={t('namePlaceholder')}
          required
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="spec">{t('spec')}</Label>
        <Input
          id="spec"
          name="spec"
          defaultValue={product?.spec ?? ''}
          placeholder={t('specPlaceholder')}
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="sort_order">{t('sortOrder')}</Label>
        <Input
          id="sort_order"
          name="sort_order"
          type="number"
          defaultValue={product?.sort_order ?? 0}
          placeholder="0"
        />
      </div>

      <div className="flex items-center gap-3 pt-2">
        <Button
          type="submit"
          disabled={isPending}
          className="bg-orange-500 text-white hover:bg-orange-600"
        >
          {isPending ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Save className="mr-2 h-4 w-4" />
          )}
          {mode === 'create' ? t('create') : t('save')}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          className="border-navy-200"
        >
          {t('cancel')}
        </Button>
      </div>
    </form>
  );
}
