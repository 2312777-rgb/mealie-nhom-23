# R02 K10 Kiểm thử hồi quy giao diện Mealie

Bộ hồ sơ nhóm 4 người gồm môi trường QA, seed tái lập, 8 visual test, 3 smoke test nghiệp vụ, demo phân biệt intentional/regression và báo cáo Word giữa kỳ/cuối kỳ. Mealie được khảo sát ở commit `879b133b5f98dd91419948f363d2d6d58793c3a0` (3.28.0). Đây là repository harness riêng nằm trong checkout Mealie, không sửa tính năng upstream.

## Dựng lại
Xem [onboarding](docs/onboarding.md). Trên máy hiện tại: UI http://localhost:3000, API http://localhost:19000. Cổng 19000 tránh xung đột với MinIO đang dùng 9000; trong container API vẫn nghe ở 9000.

Từ gốc Mealie:
```powershell
docker compose -f mealie-nhom-23/docker-compose.visual.yml up -d --build --wait
```
Trong frontend, terminal riêng:
```powershell
pnpm install --frozen-lockfile
$env:API_URL='http://localhost:19000'
pnpm run dev --no-fork
```
Trong harness:
```powershell
Copy-Item .env.example .env
npm ci
npx playwright install chromium
# Điền credential QA và đặt MEALIE_ALLOW_SEED=true trong .env
npm run bootstrap
npm run seed
npm run typecheck
npm run test:smoke
npm run test:visual:update
# Duyệt trực quan cả tám ảnh trước khi chấp nhận
npm run test:visual
npm run test:demo
npm run test:visual:report
```

## Phạm vi
| ID | Màn hình | Trạng thái chụp |
| --- | --- | --- |
| VR01 | Recipe finder | Chưa chọn food/tool, hiển thị No recipes found |
| VR02 | Recipe timeline | Có 10 recipe QA với ngày cố định |
| VR03 | Recipe categories | 3 category gắn công thức QA |
| VR04 | Meal planner | 7 bữa tối trong tuần cố định |
| VR05 | Shopping lists | Có QA Weekly Shopping và QA Pantry Shopping |
| VR06 | User profile | Tài khoản Visual QA Team |
| VR07 | Group foods | 10 food QA |
| VR08 | Meal plan settings | Cấu hình household QA |

Ba FLOW test tạo dữ liệu qua API và kiểm tra UI đọc được dữ liệu, rồi xóa đúng bản ghi tạm do test tạo. Không tuyên bố đây là các bài thao tác hoàn toàn bằng form UI.

## Cấu hình và tiêu chí
Chromium do Playwright 1.64.0 quản lý; Windows; 1440×900; scale 1; light theme; en-US; UTC; Date cố định 2026-10-12T12:00:00Z. Cấp quyền screen-wake-lock để không bị lỗi permission của headless browser khi mở shopping list. Bài test vẫn bắt lỗi JavaScript/API, kiểm tra đúng route và nội dung đại diện, đợi skeleton/font/ảnh, rồi chụp full-page với maxDiffPixelRatio=0.01. Lệnh so sánh thường không tự tạo baseline thiếu.

Ngưỡng 1% là lựa chọn thực nghiệm, không phải code coverage. 8/8 là phạm vi màn hình được chọn, không chứng minh toàn bộ Mealie không có lỗi. Baseline Windows cần cùng nền tảng/browser/font; không so trực tiếp với Linux.

## Phân biệt thay đổi
`npm run test:demo` chèn CSS chỉ vào browser: dịch main 48 pixel (regression tổng hợp), hoặc đổi màu nền theo REQ-DEMO-01 (intentional tổng hợp). Cả hai phải sinh mismatch thật. Script kiểm tra đây là lỗi pixel, lưu actual/expected/diff và classification; không cập nhật baseline. Demo không phải lỗi tự nhiên được phát hiện trong upstream. Thay đổi intentional thực tế vẫn cần người duyệt và yêu cầu hợp lệ.

## Hồ sơ
- `docs/architecture.md`: actor/module/kiến trúc và 3 luồng dữ liệu.
- `docs/test-plan.md`: scenario/precondition/expected/risk.
- `docs/onboarding.md`: môi trường và lệnh dựng từ máy mới.
- `docs/defects.csv`: lỗi môi trường/harness và demo tổng hợp.
- `project-lock.json`: commit và cấu hình ảnh.
- `evidence/`: metrics và report và demo diff và metadata.
- `tests/__screenshots__/`: 8 ảnh baseline.
- `output/`: hai báo cáo Word và gói nộp.

## GitHub Actions
Job validate chạy typecheck và phát hiện test trên Ubuntu. Job visual được kích hoạt thủ công, cần self-hosted Windows runner nhãn mealie-qa có UI/API QA và .env. Workflow được cấu hình nhưng không được coi là đã chạy thành công trên GitHub nếu chưa có URL run. Có thể chạy toàn bộ test local bằng `npx playwright test`.

## Bảo mật và bàn giao
Không commit `.env`, `.auth`, node_modules hoặc trace chứa phiên/credential. Gói nộp phải loại các file này. `.env` hiện tại chứa mật khẩu QA ngẫu nhiên, giữ local. Tên/MSSV, lịch sử board, đóng góp và peer evaluation cần nhóm cung cấp; không tự tạo bằng chứng quản trị.


`threshold=0.2` kiểm soát khác biệt cảm nhận màu của từng pixel; maxDiffPixelRatio=0.01 kiểm soát tỷ lệ pixel bị coi là khác. Đổi màu quá nhạt có thể không bị gắn cờ dù ảnh đã thay đổi. Xem docs/team.md và docs/backlog.csv cho các mục nhóm cần xác nhận.
