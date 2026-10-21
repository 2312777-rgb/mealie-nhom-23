# Kiểm chứng trên máy thành viên thứ hai

Ngày chạy: 21/10/2026

Máy thứ hai đã clone repository Nhóm 23, checkout Mealie tại commit `879b133b5f98dd91419948f363d2d6d58793c3a0`, cấu hình tài khoản QA local và chạy lại bộ kiểm thử trên Windows.

## Kết quả

| Hạng mục | Kết quả |
| --- | --- |
| Bootstrap tài khoản QA | Thành công; group slug `r02-k10-qa` |
| Seed | 10 recipes, 3 categories, 10 foods, 2 shopping lists, 7 meal plan days |
| Seed idempotence | Đạt; chạy lại không tăng số bản ghi |
| TypeScript | `tsc --noEmit` pass |
| Smoke test | 4 passed gồm setup và 3 FLOW |
| Visual test | 9 passed gồm setup và 8 VR |
| Playwright report | Mở được tại `http://localhost:9323` |

Kết quả này chứng minh hướng dẫn onboarding, lock commit, seed và automation có thể được thực hiện lại trên một máy khác. File `.env` và credential chỉ dùng local, không đưa vào Git.
Người thực hiện: NGUYỄN ĐỨC THÀNH – MSSV 2312749
Máy kiểm chứng: Máy thành viên thứ hai
Ngày chạy: 21/10/2026
Kết quả: 4 smoke passed, 9 visual passed