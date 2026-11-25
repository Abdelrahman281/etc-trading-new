'use client';

import { useState, useTransition } from 'react';
import { Trash2, Loader2 } from 'lucide-react';
import { deleteCategory } from '@/lib/actions';
import { useTranslations } from 'next-intl';

export function DeleteCategoryButton({
  categoryId,
  categoryName,
  productCount,
}: {
  categoryId: string;
  categoryName: string;
  productCount: number;
}) {
  const [isPending, startTransition] = useTransition();
  const [confirming, setConfirming] = useState(false);
  const t = useTranslations('Admin.deleteCategoryButton');

  const handleDelete = () => {
    startTransition(async () => {
      await deleteCategory(categoryId);
    });
  };

  if (confirming) {
    return (
      <div className="flex items-center gap-2">
        <button
          onClick={handleDelete}
          disabled={isPending}
          className="inline-flex items-center gap-1 rounded-md bg-red-500 px-2.5 py-1 text-xs font-semibold text-white hover:bg-red-600 disabled:opacity-50"
        >
          {isPending ? <Loader2 className="h-3 w-3 animate-spin" /> : <Trash2 className="h-3 w-3" />}
          {productCount > 0 ? t('confirmWithCount', { count: productCount }) : t('confirm')}
        </button>
        <button
          onClick={() => setConfirming(false)}
          className="rounded-md px-2 py-1 text-xs font-medium text-navy-500 hover:bg-navy-100"
        >
          {t('cancel')}
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => setConfirming(true)}
      className="rounded-md p-1.5 text-navy-400 transition-colors hover:bg-red-50 hover:text-red-500"
      aria-label={t('deleteLabel', { name: categoryName })}
    >
      <Trash2 className="h-4 w-4" />
    </button>
  );
}
