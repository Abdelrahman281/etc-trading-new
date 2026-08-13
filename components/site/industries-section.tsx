'use client';

import { Reveal } from '@/components/site/reveal';
import { industries } from '@/lib/data';
import { useTranslations } from 'next-intl';

export function IndustriesSection() {
  const t = useTranslations('Industries');
  return (
    <section className="relative overflow-hidden bg-navy-950 py-20 text-white sm:py-24">
      <div className="bg-grid-dark absolute inset-0 opacity-40" />
      <div className="absolute -left-20 bottom-10 h-72 w-72 rounded-full bg-orange-500/10 blur-3xl" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-sm font-semibold uppercase tracking-wider text-orange-400">
              {t('eyebrow')}
            </span>
            <h2 className="mt-3 font-barlow text-3xl font-bold sm:text-4xl">
              {t('title')}
            </h2>
            <p className="mt-4 text-base text-navy-300">
              {t('subtitle')}
            </p>
          </div>
        </Reveal>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {industries.map((industry, i) => {
            const Icon = industry.icon;
            return (
              <Reveal key={industry.name} delay={i * 70}>
                <div className="group h-full rounded-xl border border-navy-700 bg-navy-900/50 p-6 backdrop-blur-sm transition-all duration-500 hover:border-orange-500/50 hover:bg-navy-900">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-orange-500/15 text-orange-400 transition-colors group-hover:bg-orange-500 group-hover:text-white">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-5 font-barlow text-lg font-semibold text-white">
                    {industry.name}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-navy-300">
                    {industry.description}
                  </p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
