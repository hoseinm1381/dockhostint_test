# برگهٔ سریع تنظیم DockHosting

| فیلد | مقدار |
| --- | --- |
| Repository | hoseinm1381/dockhostint_test |
| Branch | main |
| Framework | NestJS |
| Builder | Dockerfile (اگر قابل انتخاب است) |
| Dockerfile path | Dockerfile |
| Root directory | خالی |
| Port | Auto یا 3000 |
| Database | None |
| Build (اگر دستی درخواست شد) | npm run build |
| Start (اگر دستی درخواست شد) | npm start |
| DATA_DIR | فقط بعد از اتصال Volume: /data |

نشانهٔ درست بودن استقرار: `/api/health` یک JSON با `ok: true` برمی‌گرداند و `/` صفحهٔ React را باز می‌کند.
