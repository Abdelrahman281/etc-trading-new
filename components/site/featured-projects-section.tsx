'use client';

import Link from 'next/link';
import { ArrowRight, Building2, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Reveal } from '@/components/site/reveal';
import { featuredProjects } from '@/lib/data';
import { useLocale, useTranslations } from 'next-intl';

export function FeaturedProjectsSection() {
  const t = useTranslations('Projects');
  const locale = useLocale();
  return (
    <section className="bg-navy-50 py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-sm font-semibold uppercase tracking-wider text-orange-600">
              {t('eyebrow')}
            </span>
            <h2 className="mt-3 font-barlow text-3xl font-bold text-navy-900 sm:text-4xl">
              {t('title')}
            </h2>
            <p className="mt-4 text-base text-navy-500">
              {t('subtitle')}
            </p>
          </div>
        </Reveal>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featuredProjects.map((project, i) => (
            <Reveal key={project.name} delay={i * 70}>
              <div className="group h-full overflow-hidden rounded-xl border border-navy-100 bg-white shadow-sm transition-all duration-500 hover:-translate-y-1 hover:border-orange-200 hover:shadow-lg">
                <div className="relative h-44 overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={project.image}
                    alt={project.name}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy-950/80 to-transparent" />
                  <span className="absolute left-3 top-3 rounded-md bg-navy-900/80 px-2.5 py-1 text-xs font-semibold text-orange-400 backdrop-blur-sm">
                    {project.sector}
                  </span>
                </div>
                <div className="p-5">
                  <h3 className="font-barlow text-base font-semibold text-navy-900">
                    {project.name}
                  </h3>
                  <div className="mt-2 flex items-start gap-1.5">
                    <Building2 className="mt-0.5 h-4 w-4 shrink-0 text-orange-500" />
                    <span className="text-xs text-navy-500">{project.client}</span>
                  </div>
                  <div className="mt-1 flex items-start gap-1.5">
                    <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-navy-400" />
                    <span className="text-xs text-navy-500">{project.location}</span>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal>
          <div className="mt-12 text-center">
            <Button asChild size="lg" className="bg-navy-900 text-white hover:bg-navy-800">
              <Link href={`/${locale}/about#projects`}>
                {t('viewAll')}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
