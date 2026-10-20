import { useTranslation } from 'react-i18next';
import { Code2, Server, BookOpen, Palette, Globe, GitBranch, Briefcase } from 'lucide-react';

const teamMembers = [
  {
    name: 'gaballahtech',
    handle: 'gaballahtech',
    roleKey: 'frontendLead',
    icon: Code2,
    links: [
      { icon: Globe, href: 'https://gaballahtech.vercel.app', labelKey: 'portfolio' },
      { icon: GitBranch, href: 'https://github.com/gaballahtech', labelKey: 'github' },
    ],
  },
  {
    name: 'Mohamed Khider',
    handle: 'mohamed50mostafa',
    roleKey: 'backendDev',
    icon: Server,
    links: [
      { icon: Globe, href: 'https://mohamed50mostafa.github.io/-mohamed50mostafa.github.io/', labelKey: 'portfolio' },
      { icon: GitBranch, href: 'https://github.com/mohamed50mostafa', labelKey: 'github' },
    ],
  },
  {
    name: 'Jana Ayman',
    handle: 'jana-ayman',
    roleKey: 'researcher',
    icon: BookOpen,
    links: [
      { icon: Briefcase, href: 'https://www.linkedin.com/in/jana-ayman-9ab862389/', labelKey: 'linkedin' },
    ],
  },
  {
    name: 'Ahd Fayez',
    handle: 'ahd-fayez',
    roleKey: 'designer',
    icon: Palette,
    links: [
      { icon: Briefcase, href: 'https://www.linkedin.com/in/ahd-fayez-2049a0363/', labelKey: 'linkedin' },
    ],
  },
];

export default function Team() {
  const { t } = useTranslation();

  return (
    <section id="team" className="py-20 sm:py-28" aria-labelledby="team-title">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 id="team-title" className="section-title">{t('team.title')}</h2>
          <p className="section-subtitle mx-auto flex justify-center">{t('team.subtitle')}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {teamMembers.map((member, i) => (
            <div key={i} className="bg-card glow-border flex flex-col">
              <div className="px-4 py-2 border-b border-subtle flex items-center justify-between gap-3 text-xs text-secondary tracking-widest">
                <span className="overflow-hidden whitespace-nowrap text-ellipsis" dir="auto">
                  +-- {t(`team.roles.${member.roleKey}`)} --+
                </span>
                <span className="text-accent animate-blink" aria-hidden="true">_</span>
              </div>

              <div className="p-5 flex flex-col flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2.5 bg-accent/10 text-accent shrink-0">
                    <member.icon className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-primary text-phosphor-glow truncate" dir="auto">{member.name}</p>
                    <p className="text-[11px] text-muted font-mono truncate" dir="ltr">@{member.handle}</p>
                  </div>
                </div>

                <div className="mt-auto flex flex-wrap gap-2">
                  {member.links.map((link, j) => (
                    <a
                      key={j}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-secondary inline-flex items-center gap-1.5 text-xs"
                      aria-label={`${t(`team.links.${link.labelKey}`)} — ${member.name}`}
                    >
                      <link.icon className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>{t(`team.links.${link.labelKey}`)}</span>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
