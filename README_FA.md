# پروژه تست انتشار Poulstar در DockHosting

این پروژه برای جلسه ۱۱ ترم اول تهیه شده است؛ **React + NestJS + GET/POST + ذخیره JSON** در یک سرویس و یک URL.

## ۱. قرار دادن فایل‌ها در GitHub

1. ZIP را در کامپیوتر **Extract** کنید.
2. در GitHub یک repository تازه مثلاً `poulstar-deploy-test` بسازید.
3. با `Add file` → `Upload files`، **محتویات داخل پوشه** را آپلود کنید، نه خود فایل ZIP و نه یک پوشهٔ اضافه.
4. فایل `package.json` باید دقیقاً در **ریشه repository** دیده شود؛ مثلاً `https://github.com/USERNAME/poulstar-deploy-test/blob/main/package.json`.
5. Commit changes را بزنید. فایل‌های `.env` یا کلید API لازم نیستند.

## ۲. انتشار در DockHosting

1. در صفحهٔ Onboarding، ریپوی `poulstar-deploy-test` را انتخاب کنید.
2. Branch را روی `main` بگذارید.
3. Runtime یا Framework را روی `Node.js` یا `NestJS` (اگر قابل انتخاب است) بگذارید؛ تشخیص خودکار هم قابل قبول است.
4. Root directory باید `/` یا خالی باشد (همان محل `package.json`).
5. Build command در صورت نیاز: `npm run build`
6. Start command در صورت نیاز: `npm start`
7. Port: برنامه خودش `process.env.PORT` را استفاده می‌کند؛ در صورت اجبار `3000` انتخاب کنید.
8. **Database لازم نیست**؛ اگر مرحلهٔ Database اختیاری بود Skip/None را بزنید.
9. Deploy کنید و منتظر نتیجهٔ موفق باشید.

## ۳. تست اول: React و NestJS

* URL ارائه‌شده توسط DockHosting را باز کنید.
* باید تیتر «سایتت روی اینترنت زنده است!» دیده شود.
* یک پیام آزمایشی وارد کنید و «ذخیره روی سرور» را بزنید.
* صفحه را Refresh کنید و ببینید پیام موجود است.
* آدرس‌های `/api/health` و `/api/messages` نیز باید JSON برگردانند.

**توجه:** باقی ماندن داده در Refresh به معنی ماندگاری بعد از Deploy نیست.

## ۴. تست اصلی: ماندگاری پس از Restart/Redeploy

در پروژهٔ DockHosting، در بخش Storage / Volumes (بسته به نسخهٔ پنل):

* یک **Persistent Volume** اضافه کنید.
* Mount path را دقیقاً `/data` قرار دهید.
* در تنظیمات Environment Variables مقدار `DATA_DIR` را برابر `/data` بگذارید.
* سرویس را Restart یا Redeploy کنید.
* دوباره یک پیام ثبت کنید.
* شناسهٔ boot را در صفحه یادداشت کنید، یک Restart یا Redeploy دیگر انجام دهید.
* شناسهٔ boot باید عوض شود، اما پیام قبلی باید حفظ شود.

اگر این بخش در پنل رایگان موجود نبود، **آن را به عنوان تست ماندگاری موفق در نظر نگیرید.** بدون Volume ممکن است دادهٔ JSON هنگام Redeploy از بین برود.

## ۵. اجرای محلی (اختیاری)

نیازمند Node.js 20 یا 22:

```bash
npm install
npm run build
npm start
```

در مرورگر `http://localhost:3000` را باز کنید. برای تست محلی فایل JSON در پوشهٔ `data` ذخیره می‌شود.

## نکات ایمنی

* فقط متن آزمایشی عمومی بنویسید؛ نام/شماره/اطلاعات شخصی وارد نکنید.
* این پروژه بدون حساب کاربری و فقط برای تست است؛ هر کسی با URL می‌تواند پیام وارد کند.
* فایل‌های ذخیره‌شده در مخزن GitHub نگهداری نمی‌شوند؛ اطلاعات در فضای سرور قرار می‌گیرند.
* این نمونه برای تست قابلیت‌هاست، نه برنامهٔ آمادهٔ تولید.
