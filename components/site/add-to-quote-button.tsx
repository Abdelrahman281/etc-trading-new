'use client';

import { useState } from 'react';
import { Plus, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/lib/cart-context';
import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';

interface AddToQuoteButtonProps {
  item: {
    name: string;
    spec?: string;
    category: string;
    categorySlug: string;
  };
  className?: string;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

export function AddToQuoteButton({
  item,
  className,
  variant = 'outline',
  size = 'sm',
}: AddToQuoteButtonProps) {
  const { addItem, items } = useCart();
  const t = useTranslations('AddToQuote');
  const id = `${item.categorySlug}-${item.name}`;
  const inCart = items.some((i) => i.id === id);
  const [justAdded, setJustAdded] = useState(false);

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (inCart) return;
    addItem({ id, ...item });
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 2000);
  };

  return (
    <Button
      onClick={handleAdd}
      variant={variant}
      size={size}
      disabled={inCart}
      className={cn(
        'shrink-0',
        inCart
          ? 'border-green-500 text-green-600 hover:bg-green-50 hover:text-green-600'
          : 'border-orange-300 text-orange-600 hover:bg-orange-50 hover:text-orange-700',
        className
      )}
    >
      {inCart ? (
        <>
          <Check className="h-3.5 w-3.5" />
          {t('added')}
        </>
      ) : justAdded ? (
        <>
          <Check className="h-3.5 w-3.5" />
          {t('addedExclaim')}
        </>
      ) : (
        <>
          <Plus className="h-3.5 w-3.5" />
          {t('add')}
        </>
      )}
    </Button>
  );
}
