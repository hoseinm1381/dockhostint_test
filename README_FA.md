# پروژه کامل آزمایشی Poulstar — DockHosting (نسخه ۱.۱)

پروژه کوچک و مستقل برای جلسهٔ ۱۱: **رابط React + API با NestJS + GET/POST + ذخیرهٔ JSON** روی یک آدرس HTTPS.

> پروژهٔ نمایشی برای دادهٔ عمومی است؛ اطلاعات خصوصی، رمز یا کلید API وارد نکنید.

## انتشار پروژه روی GitHub — جایگزینی همهٔ فایل‌ها

1. ZIP را **Extract** کن. خود ZIP را به‌عنوان فایل در GitHub آپلود نکن.
2. وارد مخزن `hoseinm1381/dockhostint_test` (شاخهٔ `main`) شو.
3. فایل‌ها و زیرپوشه‌های **داخل** پوشهٔ استخراج‌شده را با `Add file > Upload files` آپلود و Commit کن.
4. ساختار ریشهٔ مخزن باید شبیه این باشد (هیچ پوشهٔ اضافی بالای فایل‌ها نگذار):

   ```text
   Dockerfile
   nixpacks.toml
   package.json
   tsconfig.server.json
   src/
     server/main.ts
     frontend/index.html
     frontend/main.tsx
     frontend/style.css
   ```

5. این دو آدرس باید باز شوند:
   - `https://github.com/hoseinm1381/dockhostint_test/blob/main/Dockerfile`
   - `https://github.com/hoseinm1381/dockhostint_test/blob/main/nixpacks.toml`

فایل‌های دیگر ZIP، شامل `.dockerignore` و `.gitignore` و همین راهنما، نیز باید در ریشه باشند. اگر مرورگر آپلود فایل‌های مخفی را پشتیبانی نکرد، دو فایل مخفی ضروری برای بالا آمدن برنامه نیستند؛ ولی `Dockerfile` و `nixpacks.toml` مهم هستند.

**نکتهٔ GitHub:** آپلود فایل روی مسیر یکسان، نسخهٔ قبلی را جایگزین می‌کند؛ ولی فایل‌های اضافه‌ای را که دیگر در ZIP نیستند، خودش پاک نمی‌کند. در این پروژه ساختار فایل‌های قبلی حفظ شده است.

## تنظیم DockHosting

- Repository: `hoseinm1381/dockhostint_test`
- Branch: `main`
- Runtime: `NestJS` یا `Node.js`
- Build method / Builder: **Dockerfile** (اگر چنین گزینه‌ای دارد)
- Dockerfile path: `Dockerfile`
- Root directory: **خالی** یا `/`
- App port: **Automatic** یا در صورت اجبار `3000`
- Database: **No database**
- Environment variables: برای تست اولیه نیاز ندارد
- Auto-deploy: می‌تواند فعال باشد

روی Push جدید، یک Deployment تازه شروع می‌شود. قبل از Redeploy دستی، وضعیت Buildهای قبلی را بررسی کن و از ایجاد Deployهای هم‌زمان خودداری کن.

اگر در لاگ خروجی `FROM node:22-alpine` دیدی، Dockerfile انتخاب شده است.
اگر `nixpacks plan` دیدی، سیستم هنوز Nixpacks را اجرا می‌کند؛ فایل `nixpacks.toml` باید شروع را به `npm start` تغییر دهد. در لاگ اجرا، **Caddy نباید جای NestJS را بگیرد**.

## تست بعد از Deploy موفق

- صفحهٔ اصلی: `https://dockhostint-test.dockhosting.dev/`
- سلامت API: `https://dockhostint-test.dockhosting.dev/api/health`
- دریافت پیام‌ها: `https://dockhostint-test.dockhosting.dev/api/messages`
- روی صفحه یک پیام عمومی بنویس و ذخیره کن؛ بعد Refresh کن.

**مهم:** صرفاً Refresh تضمین نمی‌کند اطلاعات بعد از Redeploy باقی بمانند.

## برای تست ماندگاری واقعی JSON

- از پنل DockHosting یک **Persistent Volume** با mount path برابر `/data` بساز (اگر پلن اجازه می‌دهد).
- Environment Variable به نام `DATA_DIR` با مقدار `/data` تنظیم کن.
- Restart/Redeploy کن، یک پیام ثبت کن و دوباره Restart/Redeploy کن؛ پیام باید باقی بماند.
- اگر امکان Volume وجود ندارد، شرط «ماندگاری پس از انتشار مجدد» هنوز تأمین نشده و برای هدف نهایی جلسهٔ ۱۱ باید هاست دیگری انتخاب شود.

## اجرای محلی برای تست

در کامپیوتری که Node.js نسخهٔ ۲۲ دارد:

```bash
npm install
npm run build
npm start
```

سپس `http://localhost:3000/` را باز کن.

## عیب‌یابی

- 404 صفحهٔ اصلی: ابتدا `/api/health` را تست کن. اگر API کار کرد، مسیر فایل‌های React را بررسی کن.
- 404 برای API: احتمالاً برنامهٔ NestJS اجرا نشده و Caddy یا وب‌سرور استاتیک بالا آمده است؛ لاگِ آخرین Deploy را ببین.
- `Pending` یا `Building` طولانی: الزاماً خطای کد نیست؛ ساخت Docker image و منابع سرویس‌دهنده را بررسی کن.
- اگر خطای TypeScript یا npm مشاهده شد، **اولین** خطای صریح لاگ را بفرست، نه صرفاً آخرین خط را.

این ZIP کد کامل پروژه است؛ نیازی به ساخت دستی فایل دیگری در GitHub نیست.
