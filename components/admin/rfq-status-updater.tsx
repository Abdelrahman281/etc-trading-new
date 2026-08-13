'use client';

import { useState, useTransition } from 'react';
import { Loader2, Check } from 'lucide-react';
import { updateRfqStatus } from '@/lib/actions';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import { useTranslations } from 'next-intl';

export function RfqStatusUpdater({ rfqId, currentStatus }: { rfqId: string; currentStatus: string }) {
  const [status, setStatus] = useState(currentStatus);
  const [isPending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);
  const t = useTranslations('Admin');

  const statusOptions = [
    { value: 'new', label: t('status.new') },
    { value: 'reviewed', label: t('status.reviewed') },
    { value: 'quoted', label: t('status.quoted') },
    { value: 'closed', label: t('status.closed') },
  ];

  const handleStatusChange = (value: string) => {
    setStatus(value);
    setSaved(false);
    startTransition(async () => {
      await updateRfqStatus(rfqId, value);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    });
  };

  return (
    <div className="flex items-center gap-2">
      <Select value={status} onValueChange={handleStatusChange} disabled={isPending}>
        <SelectTrigger className="w-[160px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {statusOptions.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {isPending && <Loader2 className="h-4 w-4 animate-spin text-navy-400" />}
      {saved && !isPending && (
        <span className="flex items-center gap-1 text-xs font-medium text-green-600">
          <Check className="h-3.5 w-3.5" />
          {t('rfqUpdater.saved')}
        </span>
      )}
    </div>
  );
}
