import { BRAND } from '../../config/branding';
import type { CareerTrack } from '../../types/index';

export interface SiteLoginScreenProps {
  loginNameInput: string;
  setLoginNameInput: (v: string) => void;
  selectedTrack: CareerTrack;
  setSelectedTrack: (t: CareerTrack) => void;
  onDrawName: () => void;
  onCommit: () => void;
}

const TRACK_INFO: { id: CareerTrack; label: string; desc: string }[] = [
  { id: 'TECH', label: '技术岗', desc: '看图纸、编方案、做技术交底。脑力劳动为主。' },
  { id: 'BUILD', label: '施工岗', desc: '盯现场、管工人、抓进度。体力与协调并重。' },
  { id: 'BIZ', label: '商务岗', desc: '算成本、做标书、跟甲方对账。数字就是战场。' },
];

export function SiteLoginScreen({
  loginNameInput,
  setLoginNameInput,
  selectedTrack,
  setSelectedTrack,
  onDrawName,
  onCommit,
}: SiteLoginScreenProps) {
  return (
    <div className="fixed inset-0 z-[220] flex items-center justify-center p-4 sm:p-6 bg-gradient-to-br from-slate-900 via-slate-800 to-zinc-950">
      <div className="relative w-full max-w-[28rem]">
        <div className="relative overflow-hidden rounded-2xl border border-amber-500/25 dark:border-white/10 bg-[#faf8f2] dark:bg-gray-800 text-stone-800 dark:text-gray-100 shadow-2xl">
          <div className="px-7 py-8 sm:px-9 sm:py-10 flex flex-col gap-5">
            <header className="text-center space-y-2 border-b border-amber-900/15 dark:border-white/10 pb-5">
              <p className="text-[10px] font-mono tracking-[0.25em] text-amber-900/55 dark:text-amber-400/80 uppercase">
                进场登记 · {new Date().getFullYear()}
              </p>
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-stone-900 dark:text-gray-100">项目部报到</h2>
              <p className="text-[11px] font-mono text-amber-900/55 dark:text-amber-400/80">{BRAND.name}</p>
            </header>

            <div className="space-y-2">
              <label className="text-[10px] font-mono uppercase text-stone-500 dark:text-gray-400">选择岗位</label>
              <div className="grid grid-cols-3 gap-2">
                {TRACK_INFO.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setSelectedTrack(t.id)}
                    className={`p-3 rounded-xl border-2 text-center transition-all ${
                      selectedTrack === t.id
                        ? 'border-amber-600 dark:border-amber-500 bg-amber-50 dark:bg-amber-950/40 shadow-sm'
                        : 'border-stone-200 dark:border-white/10 bg-white dark:bg-gray-900/50 hover:border-stone-300 dark:hover:border-white/20'
                    }`}
                  >
                    <p className="text-sm font-bold dark:text-gray-100">{t.label}</p>
                    <p className="text-[10px] text-stone-500 dark:text-gray-400 mt-1 leading-tight">{t.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="site-login-name" className="text-[10px] font-mono uppercase text-stone-500 dark:text-gray-400">
                现场姓名
              </label>
              <input
                id="site-login-name"
                type="text"
                value={loginNameInput}
                onChange={(e) => setLoginNameInput(e.target.value)}
                placeholder="亲笔签名，或点「安全帽抽签」"
                maxLength={24}
                className="w-full rounded-xl border border-amber-900/20 dark:border-white/10 bg-white/90 dark:bg-gray-900/80 dark:text-gray-100 placeholder:text-gray-400 px-4 py-3 text-sm outline-none ring-amber-700/25 dark:ring-amber-500/30 focus:ring-2"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={onDrawName}
                className="py-3.5 rounded-xl bg-stone-900 text-[#faf8f2] dark:bg-white dark:text-black text-sm font-bold hover:bg-stone-800 dark:hover:bg-gray-200 transition-colors"
              >
                安全帽抽签
              </button>
              <button
                type="button"
                disabled={!loginNameInput.trim()}
                onClick={onCommit}
                className="py-3.5 rounded-xl border-2 border-amber-900/25 dark:border-white/15 bg-white/70 dark:bg-gray-900/60 text-sm font-bold text-stone-900 dark:text-gray-100 hover:bg-amber-50/80 dark:hover:bg-gray-700/50 transition-colors disabled:opacity-35"
              >
                进场打卡
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
