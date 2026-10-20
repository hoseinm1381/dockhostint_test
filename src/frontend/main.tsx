import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './style.css';

type Item = { id: string; text: string; createdAt: string };
type Health = {
  ok: boolean;
  service: string;
  bootId: string;
  total: number;
  storageDir: string;
  configuredForPersistentVolume: boolean;
  reminder: string;
};

function App() {
  const [health, setHealth] = useState<Health | null>(null);
  const [items, setItems] = useState<Item[]>([]);
  const [text, setText] = useState('');
  const [status, setStatus] = useState('در حال اتصال به سرور…');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  async function refresh() {
    setError('');
    try {
      const [healthResponse, itemsResponse] = await Promise.all([
        fetch('/api/health', { cache: 'no-store' }),
        fetch('/api/messages', { cache: 'no-store' })
      ]);
      if (!healthResponse.ok || !itemsResponse.ok) throw new Error('پاسخ API ناموفق بود');
      const healthData = (await healthResponse.json()) as Health;
      const list = (await itemsResponse.json()) as { items: Item[] };
      setHealth(healthData);
      setItems(list.items);
      setStatus('React و NestJS به یکدیگر متصل‌اند');
    } catch (err) {
      setHealth(null);
      setError(err instanceof Error ? err.message : 'خطای شبکه');
      setStatus('ارتباط با سرور برقرار نیست');
    }
  }

  useEffect(() => { void refresh(); }, []);

  async function add(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!text.trim() || saving) return;
    setSaving(true);
    setError('');
    try {
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text })
      });
      if (!response.ok) throw new Error(`ثبت اطلاعات ناموفق بود (HTTP ${response.status})`);
      setText('');
      await refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'ثبت انجام نشد');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="shell">
      <div className="topline"><span>POULSTAR / DEPLOYMENT LAB</span><span>جلسهٔ ۱۱ · تست انتشار واقعی</span></div>
      <header>
        <div className="eyebrow">تست یک پروژهٔ واقعی · نسخهٔ ۱</div>
        <h1>سایتت روی اینترنت <span>زنده است!</span></h1>
        <p>این صفحه با React ساخته شده و اطلاعات را از طریق NestJS روی سرور ثبت و دریافت می‌کند.</p>
      </header>

      <div className="status"><span className={health ? 'dot good' : 'dot bad'}></span><strong>{status}</strong><button onClick={() => void refresh()} type="button">بازآزمایی اتصال ↻</button></div>
      {error && <div className="error" role="alert">{error}</div>}

      <section className="grid">
        <div className="panel input-panel">
          <div className="kicker">01 / POST</div>
          <h2>ثبت یک پیام آزمایشی</h2>
          <p>یک جملهٔ عمومی وارد کن. سپس صفحه را Refresh کن؛ پیام باید باقی بماند.</p>
          <form onSubmit={e => void add(e)}>
            <label htmlFor="test-message">متن آزمایشی (حداکثر ۱۰۰ کاراکتر)</label>
            <input id="test-message" maxLength={100} value={text} onChange={e => setText(e.target.value)} placeholder="مثلاً: سلام از کلاس پول‌استار!" required />
            <button className="primary" disabled={saving || !text.trim()} type="submit">{saving ? 'در حال ثبت…' : 'ذخیره روی سرور ←'}</button>
          </form>
        </div>
        <div className="panel">
          <div className="kicker">02 / GET</div>
          <h2>پیام‌های ذخیره‌شده</h2>
          <p>فهرست مستقیماً از فایل JSON سرور خوانده می‌شود.</p>
          <div className="messages">
            {items.length ? items.map(item => <div className="message" key={item.id}><span>{item.text}</span><small>{new Date(item.createdAt).toLocaleString('fa-IR')}</small></div>) : <div className="empty">هنوز پیامی ثبت نشده است.</div>}
          </div>
        </div>
      </section>

      <section className="panel diagnostics">
        <div className="kicker">03 / HEALTH CHECK</div>
        <h2>وضعیت فنی</h2>
        <div className="stats">
          <div><small>تعداد رکوردها</small><strong>{health?.total ?? '—'}</strong></div>
          <div><small>شناسهٔ اجرای سرور</small><strong dir="ltr">{health?.bootId ?? '—'}</strong></div>
          <div><small>مسیر ذخیره‌سازی</small><strong className="path" dir="ltr">{health?.storageDir ?? '—'}</strong></div>
        </div>
        <div className="note">
          <strong>آزمایش ماندگاری:</strong> بعد از ذخیرهٔ پیام، پروژه را از پنل DockHosting ری‌استارت یا دوباره Deploy کن. شناسهٔ اجرا باید عوض شود ولی پیام‌ها باید باقی بمانند. <strong>این آزمایش فقط با Volume ماندگار معتبر است:</strong> پوشهٔ <code>/data</code> را Mount و متغیر <code>DATA_DIR=/data</code> را تنظیم کن.
        </div>
        <p className="muted">وضعیت تنظیم متغیر DATA_DIR: <strong>{health?.configuredForPersistentVolume ? 'تنظیم شده؛ اتصال واقعی Volume را در پنل بررسی کن' : 'هنوز تنظیم نشده؛ داده‌ها ممکن است هنگام انتشار مجدد پاک شوند'}</strong></p>
      </section>
      <footer>Built for Poulstar · React + NestJS · No database, no API key</footer>
    </div>
  );
}

createRoot(document.getElementById('root')!).render(<React.StrictMode><App /></React.StrictMode>);
