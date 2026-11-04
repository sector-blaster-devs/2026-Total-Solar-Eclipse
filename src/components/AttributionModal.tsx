import React, { useState, useEffect, useMemo } from 'react';
import {
  X,
  ExternalLink,
  Database,
  Globe,
  Compass,
  BookOpen,
  Layers,
  Code2,
  Scale,
  ShieldCheck,
  AlertTriangle,
  Copy,
  Check,
  Search,
  Award,
  Sparkles,
  FileText
} from 'lucide-react';

interface AttributionModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: 'credits' | 'licenses' | 'project';
}

interface CreditSource {
  name: string;
  organization: string;
  category: 'astronomy' | 'algorithm' | 'cartography';
  description: string;
  url?: string;
  badge: string;
  licenseType: string;
}

interface SoftwareLicense {
  name: string;
  version: string;
  licenseType: 'MIT' | 'ISC' | 'Apache-2.0' | 'Public Domain';
  author: string;
  purpose: string;
  url: string;
  licenseText: string;
}

const SCIENTIFIC_CREDITS: CreditSource[] = [
  {
    name: 'NASA GSFC Solar Eclipse Bulletins & Besselian Elements',
    organization: 'NASA Goddard Space Flight Center',
    category: 'astronomy',
    description:
      'Official Besselian elements (x, y, d, l1, l2, mu), umbral shadow velocity vectors, contact times (C1–C4), central line maximum totality duration, and Saros 126 ephemeris calculations for the Total Solar Eclipse of August 12, 2026.',
    url: 'https://eclipse.gsfc.nasa.gov/solar.html',
    badge: 'NASA GSFC',
    licenseType: 'Public Domain (US Gov)',
  },
  {
    name: 'Interactive Solar Eclipse 2026 Calculations & Ground Path Tables',
    organization: 'Xavier M. Jubier / International Astronomical Union (IAU)',
    category: 'astronomy',
    description:
      'High-precision geographic path of totality coordinates, umbral path width modeling, local circumstance tables across Greenland, Iceland, mainland Spain, and the Balearic Sea.',
    url: 'http://xjubier.free.fr/en/site_pages/solar_eclipses/TSE_2026_GoogleMapFull.html',
    badge: 'Ephemeris',
    licenseType: 'Scientific Research Attribution',
  },
  {
    name: 'Eclipse Predictions & Path Geometry',
    organization: 'Fred Espenak ("Mr. Eclipse", NASA Emeritus)',
    category: 'astronomy',
    description:
      'Topocentric eclipse magnitude formulas, obscuration geometry, solar altitude and azimuth tables, and timing milestones for the August 12, 2026 eclipse path.',
    url: 'https://www.mreclipse.com/',
    badge: 'Predictions',
    licenseType: 'Educational / Research Attribution',
  },
  {
    name: 'Astronomical Algorithms (2nd Edition)',
    organization: 'Jean Meeus (Willmann-Bell / Sky & Telescope)',
    category: 'algorithm',
    description:
      'Foundational mathematical algorithms for Greenwich Mean Sidereal Time (GMST), Keplerian solar orbital coordinates, lunar topocentric parallax, atmospheric refraction, and spherical chord disc obscuration.',
    url: 'https://www.willbell.com/math/mc1.htm',
    badge: 'Algorithms',
    licenseType: 'Academic Reference',
  },
  {
    name: 'Earth Orientation & Celestial Coordinate Systems',
    organization: 'US Naval Observatory (USNO) / IAU SOFA',
    category: 'algorithm',
    description:
      'Standard reference frames for Earth obliquity of the ecliptic (23.44°), subsolar point geographic coordinates, and day/night solar terminator vector geometry.',
    url: 'https://www.usno.navy.mil/',
    badge: 'Geodesy',
    licenseType: 'Public Domain',
  },
  {
    name: 'NASA Visible Earth (Blue Marble & Black Marble)',
    organization: 'NASA Earth Observatory',
    category: 'cartography',
    description:
      'High-resolution land surface textures, bathymetry, atmospheric Rayleigh scattering models, and nighttime city lights illumination data.',
    url: 'https://visibleearth.nasa.gov/',
    badge: 'Textures',
    licenseType: 'Public Domain (NASA)',
  },
  {
    name: 'Natural Earth Cartographic Datasets',
    organization: 'Natural Earth / Public Domain',
    category: 'cartography',
    description:
      'Global 1:110m and 1:50m coastline vectors, sovereign country boundaries, and territorial metadata for stations in Greenland, Iceland, and Spain.',
    url: 'https://www.naturalearthdata.com/',
    badge: 'Boundaries',
    licenseType: 'Public Domain (CC0)',
  },
];

const SOFTWARE_LICENSES: SoftwareLicense[] = [
  {
    name: 'Three.js',
    version: '0.185.1',
    licenseType: 'MIT',
    author: 'Ricardo Cabello (Mr.doob) and Three.js authors',
    purpose: 'Real-time GPU WebGL 3D planetary rendering, shaders, raycasting, and orbit controls.',
    url: 'https://github.com/mrdoob/three.js',
    licenseText: `The MIT License

Copyright © 2010-2026 three.js authors

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.`,
  },
  {
    name: 'astronomy-engine',
    version: '2.1.19',
    licenseType: 'MIT',
    author: 'Don Cross (Cosmonav)',
    purpose: 'High-precision solar, lunar, and planetary vector calculation engine based on modern ephemerides.',
    url: 'https://github.com/cosmonav/astronomy',
    licenseText: `MIT License

Copyright (c) 2019-2024 Don Cross

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.`,
  },
  {
    name: 'React & React-DOM',
    version: '19.0.1',
    licenseType: 'MIT',
    author: 'Meta Platforms, Inc. and affiliates',
    purpose: 'Declarative component framework and virtual DOM architecture for UI state management.',
    url: 'https://github.com/facebook/react',
    licenseText: `MIT License

Copyright (c) Meta Platforms, Inc. and affiliates.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.`,
  },
  {
    name: 'Lucide React',
    version: '0.546.0',
    licenseType: 'ISC',
    author: 'Lucide Project Contributors',
    purpose: 'Clean, lightweight, modern vector UI iconography for astronomical dashboards.',
    url: 'https://github.com/lucide-icons/lucide',
    licenseText: `ISC License

Copyright (c) for portions of Lucide are held by Cole Bemis 2013-2022 as part of Feather (MIT). All other copyright (c) 2022-present Lucide Contributors.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted, provided that the above
copyright notice and this permission notice appear in all copies.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.`,
  },
  {
    name: 'Tailwind CSS',
    version: '4.1.14',
    licenseType: 'MIT',
    author: 'Tailwind Labs, Inc.',
    purpose: 'Utility-first CSS styling framework and dynamic theme system.',
    url: 'https://github.com/tailwindlabs/tailwindcss',
    licenseText: `MIT License

Copyright (c) Tailwind Labs, Inc.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.`,
  },
  {
    name: 'Motion',
    version: '12.23.24',
    licenseType: 'MIT',
    author: 'Motion Software / Matt Perry',
    purpose: 'High-performance gesture and physical spring animations.',
    url: 'https://github.com/motiondivision/motion',
    licenseText: `MIT License

Copyright (c) 2018-present Motion Software / Matt Perry

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.`,
  },
  {
    name: 'canvas-confetti',
    version: '1.9.4',
    licenseType: 'ISC',
    author: 'Kiril Vatev',
    purpose: 'Celebration particle animations triggered during maximum totality arrival.',
    url: 'https://github.com/catdad/canvas-confetti',
    licenseText: `ISC License

Copyright (c) 2020, Kiril Vatev

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted, provided that the above
copyright notice and this permission notice appear in all copies.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.`,
  },
  {
    name: 'Vite',
    version: '6.2.3',
    licenseType: 'MIT',
    author: 'Evan You and Vite Contributors',
    purpose: 'Next-generation lightning fast frontend build tooling and development server.',
    url: 'https://github.com/vitejs/vite',
    licenseText: `MIT License

Copyright (c) 2019-present Evan You & Vite Contributors

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.`,
  },
];

export const AttributionModal: React.FC<AttributionModalProps> = ({
  isOpen,
  onClose,
  defaultTab = 'credits',
}) => {
  const [activeTab, setActiveTab] = useState<'credits' | 'licenses' | 'project'>(defaultTab);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedLicense, setExpandedLicense] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Sync defaultTab when modal opens
  useEffect(() => {
    if (isOpen) {
      setActiveTab(defaultTab);
      setSearchQuery('');
    }
  }, [isOpen, defaultTab]);

  // Close on Escape key press
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 2000);
    }).catch(() => {});
  };

  // Filtered scientific credits
  const filteredCredits = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return SCIENTIFIC_CREDITS;
    return SCIENTIFIC_CREDITS.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.organization.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q) ||
        c.badge.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  // Filtered software licenses
  const filteredLicenses = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return SOFTWARE_LICENSES;
    return SOFTWARE_LICENSES.filter(
      (l) =>
        l.name.toLowerCase().includes(q) ||
        l.author.toLowerCase().includes(q) ||
        l.purpose.toLowerCase().includes(q) ||
        l.licenseType.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 md:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="licenses-credits-modal-title"
    >
      <div
        className="bg-[#070a10] border border-white/20 rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col text-slate-200 overflow-hidden font-sans select-none ring-1 ring-white/10"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 border-b border-white/15 bg-black/70">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-cyan-950/90 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shrink-0 shadow-[0_0_12px_rgba(6,182,212,0.25)]">
              <Scale className="w-4 h-4" />
            </div>
            <div>
              <h2
                id="licenses-credits-modal-title"
                className="text-sm sm:text-base font-mono font-bold tracking-wider text-white uppercase flex items-center gap-2"
              >
                <span>Licenses & Credits</span>
                <span className="hidden sm:inline-block text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/15 border border-amber-500/30 text-amber-300 font-semibold uppercase tracking-wider">
                  August 12, 2026
                </span>
              </h2>
              <p className="text-[11px] text-slate-400 font-mono">
                Open source software licenses, ephemeris data attributions & scientific models
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded text-slate-400 hover:text-white hover:bg-white/10 transition-colors focus:outline-none focus:ring-1 focus:ring-cyan-400"
            title="Close (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs & Search Controls */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 px-4 sm:px-6 py-2.5 border-b border-white/10 bg-[#090d15]">
          {/* Tab Buttons */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar font-mono text-xs">
            <button
              onClick={() => setActiveTab('credits')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded transition-all whitespace-nowrap uppercase tracking-wider font-semibold text-[11px] ${
                activeTab === 'credits'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/5 border border-transparent'
              }`}
            >
              <Award className="w-3.5 h-3.5 text-cyan-400" />
              <span>Scientific Credits</span>
              <span className="ml-1 text-[10px] px-1.5 py-0.2 rounded-full bg-cyan-950/80 border border-cyan-800/80 text-cyan-300 font-mono">
                {SCIENTIFIC_CREDITS.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('licenses')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded transition-all whitespace-nowrap uppercase tracking-wider font-semibold text-[11px] ${
                activeTab === 'licenses'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/5 border border-transparent'
              }`}
            >
              <Code2 className="w-3.5 h-3.5 text-amber-400" />
              <span>Software Licenses</span>
              <span className="ml-1 text-[10px] px-1.5 py-0.2 rounded-full bg-amber-950/80 border border-amber-800/80 text-amber-300 font-mono">
                {SOFTWARE_LICENSES.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('project')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded transition-all whitespace-nowrap uppercase tracking-wider font-semibold text-[11px] ${
                activeTab === 'project'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/50 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/5 border border-transparent'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Project & Safety</span>
            </button>
          </div>

          {/* Quick Search / Filter Input */}
          {(activeTab === 'credits' || activeTab === 'licenses') && (
            <div className="relative shrink-0 sm:w-60">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={activeTab === 'credits' ? 'Filter credits & datasets...' : 'Filter packages & licenses...'}
                className="w-full pl-8 pr-7 py-1 text-xs bg-black/60 border border-white/15 rounded text-slate-200 placeholder-slate-500 font-mono focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 p-0.5"
                  title="Clear filter"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          )}
        </div>

        {/* Tab 1: Scientific Credits & Data Sources */}
        {activeTab === 'credits' && (
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 text-sm">
            {/* Overview Banner */}
            <div className="bg-cyan-950/30 border border-cyan-800/40 rounded p-3 sm:p-3.5 flex items-start gap-3 text-xs leading-relaxed text-cyan-100">
              <Sparkles className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-cyan-200">Scientific Ephemeris & Geodesy Heritage:</span>{' '}
                Orbital trajectories, solar obscuration percentages, contact times, and umbral shadow footprints in this simulator are computed using official NASA GSFC Besselian elements, Jean Meeus astronomical algorithms, and Xavier Jubier TSE 2026 central line coordinate tables.
              </div>
            </div>

            {/* Astronomy Ephemeris Section */}
            <div>
              <div className="flex items-center gap-2 pb-2 mb-3 border-b border-white/10 text-cyan-400 font-mono text-xs font-bold uppercase tracking-wider">
                <Globe className="w-3.5 h-3.5" />
                <span>Ephemeris, Besselian Elements & Eclipse Geometry</span>
              </div>
              <div className="space-y-3">
                {filteredCredits
                  .filter((c) => c.category === 'astronomy')
                  .map((src, i) => (
                    <div
                      key={i}
                      className="bg-black/50 border border-white/10 rounded p-3.5 hover:border-cyan-500/40 transition-colors"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 mb-1.5">
                        <div>
                          <div className="font-semibold text-white text-sm">{src.name}</div>
                          <div className="text-[11px] text-slate-400 font-mono mt-0.5">{src.organization}</div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0 self-start">
                          <span className="px-2 py-0.5 rounded bg-cyan-950/80 border border-cyan-800/80 text-cyan-300 text-[10px] font-mono font-semibold uppercase tracking-wider">
                            {src.badge}
                          </span>
                          <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-slate-300 text-[10px] font-mono">
                            {src.licenseType}
                          </span>
                          {src.url && (
                            <a
                              href={src.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1 text-slate-400 hover:text-cyan-300 transition-colors"
                              title="Open original documentation"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                          )}
                        </div>
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed">{src.description}</p>
                    </div>
                  ))}
              </div>
            </div>

            {/* Mathematical Algorithms */}
            <div>
              <div className="flex items-center gap-2 pb-2 mb-3 border-b border-white/10 text-amber-400 font-mono text-xs font-bold uppercase tracking-wider">
                <Compass className="w-3.5 h-3.5" />
                <span>Mathematical Models & Reference Coordinate Frames</span>
              </div>
              <div className="space-y-3">
                {filteredCredits
                  .filter((c) => c.category === 'algorithm')
                  .map((src, i) => (
                    <div
                      key={i}
                      className="bg-black/50 border border-white/10 rounded p-3.5 hover:border-amber-500/40 transition-colors"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 mb-1.5">
                        <div>
                          <div className="font-semibold text-white text-sm">{src.name}</div>
                          <div className="text-[11px] text-slate-400 font-mono mt-0.5">{src.organization}</div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0 self-start">
                          <span className="px-2 py-0.5 rounded bg-amber-950/80 border border-amber-800/80 text-amber-300 text-[10px] font-mono font-semibold uppercase tracking-wider">
                            {src.badge}
                          </span>
                          <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-slate-300 text-[10px] font-mono">
                            {src.licenseType}
                          </span>
                          {src.url && (
                            <a
                              href={src.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1 text-slate-400 hover:text-amber-300 transition-colors"
                              title="Open original documentation"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                          )}
                        </div>
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed">{src.description}</p>
                    </div>
                  ))}
              </div>
            </div>

            {/* Cartography & Planetary Textures */}
            <div>
              <div className="flex items-center gap-2 pb-2 mb-3 border-b border-white/10 text-emerald-400 font-mono text-xs font-bold uppercase tracking-wider">
                <Layers className="w-3.5 h-3.5" />
                <span>Cartography, Textures & Planetary Datasets</span>
              </div>
              <div className="space-y-3">
                {filteredCredits
                  .filter((c) => c.category === 'cartography')
                  .map((src, i) => (
                    <div
                      key={i}
                      className="bg-black/50 border border-white/10 rounded p-3.5 hover:border-emerald-500/40 transition-colors"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 mb-1.5">
                        <div>
                          <div className="font-semibold text-white text-sm">{src.name}</div>
                          <div className="text-[11px] text-slate-400 font-mono mt-0.5">{src.organization}</div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0 self-start">
                          <span className="px-2 py-0.5 rounded bg-emerald-950/80 border border-emerald-800/80 text-emerald-300 text-[10px] font-mono font-semibold uppercase tracking-wider">
                            {src.badge}
                          </span>
                          <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-slate-300 text-[10px] font-mono">
                            {src.licenseType}
                          </span>
                          {src.url && (
                            <a
                              href={src.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1 text-slate-400 hover:text-emerald-300 transition-colors"
                              title="Open original documentation"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                          )}
                        </div>
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed">{src.description}</p>
                    </div>
                  ))}
              </div>
            </div>

            {filteredCredits.length === 0 && (
              <div className="py-12 text-center text-slate-400 font-mono text-xs">
                No credits matched your filter &quot;{searchQuery}&quot;.
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Software Licenses */}
        {activeTab === 'licenses' && (
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 text-sm">
            {/* Open Source Notice Banner */}
            <div className="bg-amber-950/25 border border-amber-800/40 rounded p-3 sm:p-3.5 flex items-start gap-3 text-xs leading-relaxed text-amber-100">
              <Scale className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-amber-200">Open Source Software Stack:</span>{' '}
                This application is built with modern open-source software libraries. Full copyright notices and permission notices are preserved below in accordance with each project&apos;s license terms.
              </div>
            </div>

            <div className="space-y-3">
              {filteredLicenses.map((pkg) => {
                const isExpanded = expandedLicense === pkg.name;
                const isCopied = copiedKey === pkg.name;

                return (
                  <div
                    key={pkg.name}
                    className="bg-black/50 border border-white/10 rounded overflow-hidden hover:border-white/25 transition-all"
                  >
                    <div className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-white text-sm font-mono">{pkg.name}</span>
                          <span className="text-xs text-slate-400 font-mono">v{pkg.version}</span>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider border ${
                            pkg.licenseType === 'MIT'
                              ? 'bg-emerald-950/70 border-emerald-700/60 text-emerald-300'
                              : pkg.licenseType === 'ISC'
                              ? 'bg-cyan-950/70 border-cyan-700/60 text-cyan-300'
                              : 'bg-purple-950/70 border-purple-700/60 text-purple-300'
                          }`}>
                            {pkg.licenseType}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-400 font-mono mt-1">
                          Author: <span className="text-slate-300">{pkg.author}</span>
                        </div>
                        <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                          {pkg.purpose}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 shrink-0 self-start sm:self-center">
                        <button
                          onClick={() => setExpandedLicense(isExpanded ? null : pkg.name)}
                          className="px-2.5 py-1 text-[11px] font-mono font-medium rounded bg-white/5 hover:bg-white/10 border border-white/15 text-slate-300 hover:text-white transition-colors"
                        >
                          {isExpanded ? 'Hide License' : 'View License'}
                        </button>
                        <a
                          href={pkg.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 text-slate-400 hover:text-amber-300 transition-colors"
                          title="Open package repository"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    </div>

                    {/* Expandable Verbatim License Text Drawer */}
                    {isExpanded && (
                      <div className="border-t border-white/10 bg-black/80 p-3.5 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                            <FileText className="w-3 h-3 text-amber-400" />
                            Verbatim License Notice ({pkg.name})
                          </span>
                          <button
                            onClick={() => copyToClipboard(pkg.licenseText, pkg.name)}
                            className="flex items-center gap-1 px-2 py-0.5 rounded bg-white/10 hover:bg-white/20 text-slate-200 text-[10px] font-mono transition-colors"
                          >
                            {isCopied ? (
                              <>
                                <Check className="w-3 h-3 text-emerald-400" />
                                <span className="text-emerald-400">Copied</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3 h-3" />
                                <span>Copy Text</span>
                              </>
                            )}
                          </button>
                        </div>
                        <pre className="p-3 rounded bg-black border border-white/10 text-[11px] font-mono text-slate-300 overflow-x-auto whitespace-pre-wrap leading-relaxed max-h-48 select-text">
                          {pkg.licenseText}
                        </pre>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {filteredLicenses.length === 0 && (
              <div className="py-12 text-center text-slate-400 font-mono text-xs">
                No software packages matched your filter &quot;{searchQuery}&quot;.
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Project License, Academic Citation & Eye Safety Notice */}
        {activeTab === 'project' && (
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 text-sm">
            {/* Eye Safety Advisory */}
            <div className="bg-red-950/30 border border-red-500/40 rounded-lg p-4 space-y-2 text-red-200">
              <div className="flex items-center gap-2 text-red-400 font-bold uppercase tracking-wider text-xs font-mono">
                <AlertTriangle className="w-4 h-4 text-red-400" />
                <span>Critical Solar Observation Eye Safety Notice</span>
              </div>
              <p className="text-xs leading-relaxed text-red-100">
                <strong>NEVER</strong> look directly at the Sun with the naked eye or through binoculars, telescopes, or camera lenses without certified <strong>ISO 12312-2</strong> compliant solar eclipse glasses or filters. During partial eclipse phases, looking at the Sun can cause permanent retinal damage or solar retinopathy. Only during the brief window of 100% totality—when the Moon completely covers the Sun&apos;s photosphere—is it safe to observe with the naked eye.
              </p>
            </div>

            {/* Application Open Source License (MIT) */}
            <div className="bg-black/50 border border-white/10 rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-emerald-400 font-mono text-xs font-bold uppercase tracking-wider">
                  <Scale className="w-4 h-4" />
                  <span>Project Open Source License (MIT License)</span>
                </div>
                <button
                  onClick={() =>
                    copyToClipboard(
                      `MIT License\n\nCopyright (c) 2026 Total Solar Eclipse Visualizer Contributors\n\nPermission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:\n\nThe above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.\n\nTHE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.`,
                      'project-license'
                    )
                  }
                  className="flex items-center gap-1 px-2.5 py-1 rounded bg-white/10 hover:bg-white/20 text-slate-200 text-xs font-mono transition-colors"
                >
                  {copiedKey === 'project-license' ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy MIT License</span>
                    </>
                  )}
                </button>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Total Solar Eclipse 2026 Orbital &amp; Ground Sky Simulation is released as free and open-source software under the permissive MIT License. You are free to inspect, study, adapt, and build upon this educational scientific tool.
              </p>
              <pre className="p-3.5 rounded bg-black/90 border border-white/10 text-[11px] font-mono text-slate-300 overflow-x-auto whitespace-pre-wrap leading-relaxed select-text">
{`MIT License

Copyright (c) 2026 Total Solar Eclipse Visualizer Contributors

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.`}
              </pre>
            </div>

            {/* Academic & Scientific Citation */}
            <div className="bg-black/50 border border-white/10 rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs font-bold uppercase tracking-wider">
                  <BookOpen className="w-4 h-4" />
                  <span>How to Cite This Project</span>
                </div>
                <button
                  onClick={() =>
                    copyToClipboard(
                      `@software{TotalSolarEclipse2026Simulator,
  author = {Total Solar Eclipse 2026 Visualization Project},
  title = {Total Solar Eclipse 2026: 3D Orbital & Ground Sky Ephemeris Simulation},
  year = {2026},
  url = {https://eclipse.gsfc.nasa.gov/solar.html},
  note = {Ephemeris data adapted from NASA GSFC, Xavier Jubier TSE 2026 tables, and Astronomy Engine}
}`,
                      'citation'
                    )
                  }
                  className="flex items-center gap-1 px-2.5 py-1 rounded bg-white/10 hover:bg-white/20 text-slate-200 text-xs font-mono transition-colors"
                >
                  {copiedKey === 'citation' ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-cyan-400" />
                      <span className="text-cyan-400">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy BibTeX</span>
                    </>
                  )}
                </button>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                If you use this visualization or its mathematical ephemeris formulas for academic publications, educational courses, astronomical presentations, or planetary science outreach, you may cite it with the following reference:
              </p>
              <pre className="p-3 rounded bg-black/90 border border-white/10 text-[11px] font-mono text-cyan-300 overflow-x-auto whitespace-pre-wrap leading-relaxed select-text">
{`@software{TotalSolarEclipse2026Simulator,
  author = {Total Solar Eclipse 2026 Visualization Project},
  title = {Total Solar Eclipse 2026: 3D Orbital & Ground Sky Ephemeris Simulation},
  year = {2026},
  note = {Based on NASA GSFC Besselian elements, Xavier Jubier IAU tables, and Astronomy Engine}
}`}
              </pre>
            </div>
          </div>
        )}

        {/* Modal Footer */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3 border-t border-white/15 bg-black/80 font-mono text-xs">
          <div className="flex items-center gap-2 text-slate-400">
            <BookOpen className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
            <span className="truncate">Total Solar Eclipse • August 12, 2026 • Saros 126</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded bg-white/10 hover:bg-white/20 text-white font-medium transition-colors uppercase tracking-wider text-[11px] shrink-0"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
