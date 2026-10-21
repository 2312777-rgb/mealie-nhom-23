# R02 K10 Kiểm thử hồi quy giao diện Mealie

Bộ hồ sơ nhóm 4 người gồm môi trường QA, seed tái lập, 8 visual test, 3 smoke test nghiệp vụ, demo phân biệt intentional/regression và báo cáo Word giữa kỳ/cuối kỳ. Mealie được khảo sát ở commit `879b133b5f98dd91419948f363d2d6d58793c3a0` (3.28.0). Đây là repository harness riêng nằm trong checkout Mealie, không sửa tính năng upstream.

## Thành viên và phân công

Phân công dưới đây dựa trên báo cáo giữa kỳ R02 K10, được chi tiết hóa thành đầu việc và tiêu chí bàn giao. Đây là kế hoạch trách nhiệm; kết quả chung trong `evidence/` không tự xác nhận đóng góp của từng người. Mỗi thành viên bổ sung link issue/PR/commit và xác nhận phần việc thực tế tại [docs/team.md](docs/team.md).

| Thành viên | MSSV | Vai trò | Phạm vi chính | Người kiểm tra chéo |
| --- | --- | --- | --- | --- |
| Nguyễn Đức Thành | 2312749 | Phân tích hệ thống và tổng hợp báo cáo | Kiến trúc, ba luồng dữ liệu, kế hoạch, báo cáo và theo dõi tiến độ | K’ Nguyễn Quang Trường |
| K’ Nguyễn Quang Trường | 2312789 | Môi trường và dữ liệu QA | Docker, khóa phiên bản, tài khoản QA, seed và onboarding | Nguyễn Viết Toàn |
| Nguyễn Viết Toàn | 2312777 | Tự động hóa Playwright | Cấu hình, xác thực, VR01–VR04, FLOW01–FLOW02 và CI | Huỳnh Thành |
| Huỳnh Thành | 2312748 | Kiểm thử giao diện và phân tích kết quả | VR05–VR08, FLOW03, baseline review, diff, defect và demo | Nguyễn Đức Thành |

### Nguyễn Đức Thành — Phân tích hệ thống và tổng hợp báo cáo

- Đọc cấu trúc frontend/backend; xác định actor, module, dependency và ranh giới group/household liên quan tới phạm vi kiểm thử.
- Cập nhật sơ đồ component/container và giải thích ba luồng: công thức, thực đơn, danh sách mua sắm; chỉ rõ page/composable, API, controller/service, repository và DB.
- Cùng Toàn và Huỳnh Thành hoàn thiện test plan: precondition, input, expected result, dữ liệu, rủi ro và tiêu chí pass/fail cho tám màn hình.
- Theo dõi issue/board theo các trạng thái cần làm, đang làm, chờ review, hoàn thành; ghi người phụ trách và bằng chứng, không tự ghi nhận công việc chưa thực hiện.
- Tổng hợp kết quả vào báo cáo giữa kỳ/cuối kỳ, đối chiếu yêu cầu A–H và K10; chuẩn bị nội dung mở đầu, sơ đồ kiến trúc, phạm vi và giới hạn khi thuyết trình.
- Kiểm tra chéo VR05–VR08 và cách phân loại diff của Huỳnh Thành; ghi quyết định review, lý do và yêu cầu sửa nếu có.

**Sản phẩm bàn giao:** `docs/architecture.md`, `docs/test-plan.md`, `docs/backlog.csv`, nội dung báo cáo và minh chứng board/đóng góp tại `docs/team.md`.

**Tiêu chí hoàn thành:** sơ đồ khớp môi trường QA; giải thích được ba luồng và ít nhất 3–5 module liên quan; báo cáo dẫn đúng lần chạy, không gán demo tổng hợp thành lỗi tự nhiên; mọi mục còn thiếu có người nhận xử lý.

### K’ Nguyễn Quang Trường — Môi trường và dữ liệu QA

- Dựng backend Linux container, frontend Nuxt và SQLite QA; kiểm tra UI cổng 3000, API cổng 19000 và trạng thái healthy.
- Khóa Mealie commit, dependency và cấu hình ảnh; ghi runtime, hệ điều hành, browser và image ID để lần chạy có thể đối chiếu.
- Quản lý bootstrap tài khoản và group/household QA riêng; hướng dẫn cấu hình `.env`, không đưa credential hoặc trạng thái đăng nhập lên Git.
- Duy trì seed gồm 10 recipe, 3 category, 10 food, 2 shopping list và 7 meal entry; chạy seed lần hai và kiểm tra không tăng bản ghi.
- Viết hướng dẫn dựng từ máy mới, xử lý xung đột cổng, lỗi dependency và khác biệt nền tảng; phối hợp dựng lại trên máy thành viên thứ hai.
- Kiểm tra chéo hướng dẫn kiến trúc và môi trường do Nguyễn Đức Thành viết bằng cách thực hiện lại các lệnh trong onboarding.

**Sản phẩm bàn giao:** `Dockerfile.backend`, `docker-compose.visual.yml`, `project-lock.json`, `.env.example`, `scripts/bootstrap.mjs`, `scripts/seed.mjs`, `scripts/verify-seed.mjs`, `docs/onboarding.md` và bằng chứng môi trường/seed trong `evidence/`.

**Tiêu chí hoàn thành:** dựng được đúng phiên bản từ hướng dẫn; seed chạy lại không nhân bản; môi trường thứ hai có metadata và kết quả riêng; không đưa dữ liệu cá nhân hoặc bí mật vào gói nộp.

### Nguyễn Viết Toàn — Playwright VR01–VR04 và tự động hóa

- Duy trì cấu hình Playwright, setup đăng nhập và storage state; khóa Chromium, viewport 1440×900, locale, timezone, ngày và chế độ giao diện theo `project-lock.json`.
- Phụ trách VR01 Recipe Finder, VR02 Recipe Timeline, VR03 Recipe Categories và VR04 Meal Planner trong `tests/visual.spec.ts`.
- Với từng scenario, kiểm tra route và nội dung đại diện, chờ skeleton/font/ảnh/transition ổn định, bắt lỗi API/JavaScript rồi so sánh screenshot; giải thích đúng hai ngưỡng pixel.
- Phụ trách FLOW01 tạo công thức và FLOW02 tạo meal entry qua API, kiểm tra dữ liệu trên UI, dọn đúng bản ghi tạm trong `tests/business.spec.ts`.
- Duy trì script chạy, typecheck và phát hiện test; phối hợp với Trường cấu hình Windows self-hosted runner, chạy CI và lưu URL workflow cùng artifact khi thực hiện.
- Kiểm tra chéo seed/onboarding của Trường; bàn giao baseline VR01–VR04 cho Huỳnh Thành review, không tự cập nhật ảnh để bỏ qua lỗi.

**Sản phẩm bàn giao:** `playwright.config.ts`, `tests/auth.setup.ts`, phần VR01–VR04 và FLOW01–FLOW02, `package.json`, `.github/workflows/visual-regression.yml`, ảnh baseline tương ứng và report của lần chạy.

**Tiêu chí hoàn thành:** bốn visual và hai smoke chạy đạt trong môi trường đã khóa; baseline thiếu phải fail ở chế độ so sánh; dữ liệu tạm được dọn; CI chỉ ghi đã đạt khi có lần chạy thành công thực tế.

### Huỳnh Thành — VR05–VR08 và phân tích diff

- Phụ trách VR05 Shopping Lists, VR06 User Profile, VR07 Group Foods và VR08 Meal Plan Settings trong `tests/visual.spec.ts`.
- Phụ trách FLOW03 tạo shopping list qua API, xác nhận UI hiển thị và dọn bản ghi tạm; bảo đảm seed có hai list để VR05 giữ đúng trang index.
- Rà soát cả tám baseline: đúng tài khoản, route, dữ liệu và trạng thái; ghi nhận ngày và quyết định của nhóm tại `docs/baseline-review.md`.
- Đọc expected/actual/diff khi fail; phân biệt lỗi môi trường, dữ liệu, harness, regression và intentional change; ghi cách tái hiện, nguyên nhân và hướng xử lý vào hồ sơ defect.
- Duy trì hai demo CSS có kiểm soát: dịch nội dung 48 pixel và đổi nền theo REQ-DEMO-01; kiểm tra mismatch thật, lưu phân loại và giữ nguyên baseline trong demo.
- Tổng hợp JSON/HTML, ảnh ba FLOW và metadata; chuẩn bị demo diff, giải thích ngưỡng/giới hạn và kiểm tra chéo VR01–VR04 của Toàn.

**Sản phẩm bàn giao:** phần VR05–VR08 và FLOW03, `scripts/demo-regression.mjs`, `scripts/collect-evidence.mjs`, `docs/defects.csv`, `docs/baseline-review.md`, `docs/defense-demo.md` và bằng chứng trong `evidence/`.

**Tiêu chí hoàn thành:** bốn visual và FLOW03 chạy đạt; đủ tám baseline được nhóm duyệt; demo tạo đúng mismatch và được ghi là tổng hợp; defect có bằng chứng và nguyên nhân; report khớp lần chạy được công bố.

### Quy trình phối hợp và nghiệm thu

1. Mỗi đầu việc có issue/task, người phụ trách, sản phẩm và tiêu chí hoàn thành. Thành viên cập nhật link bằng chứng thực tế vào `docs/team.md` và board.
2. Dùng nhánh `docs/<noi-dung>` hoặc `test/<scenario>`, commit mô tả rõ thay đổi và PR để người kiểm tra chéo đọc. Vì các scenario dùng chung file, Toàn và Huỳnh Thành thống nhất vùng sửa trước khi tích hợp.
3. Trường xác nhận môi trường và seed; Toàn và Huỳnh Thành chạy typecheck, smoke, visual và đọc report. Mỗi lần chạy ghi commit, cấu hình và thời điểm, không dùng report cũ làm bằng chứng vừa chạy.
4. Khi ảnh lệch, người phụ trách scenario phối hợp với các thành viên còn lại để xác định nguyên nhân. Chỉ cập nhật baseline khi có yêu cầu thay đổi hợp lệ và quyết định của nhóm; lưu diff và commit trước/sau.
5. Trước giữa kỳ 20/10, cả nhóm tập dượt dựng môi trường, ba nghiệp vụ, kiến trúc và kế hoạch K10. Trước bảo vệ cuối kỳ, hoàn tất chạy lại trên máy khác, duyệt baseline, báo cáo, gói mã nguồn và đánh giá chéo; nộp báo cáo trước bảo vệ một tuần theo yêu cầu môn học.

**Trạng thái cập nhật:** bằng chứng ngày 20/10/2026 trên máy chính đạt 12/12 (1 setup, 8 visual, 3 smoke). Ngày 21/10/2026, máy thành viên thứ hai cũng chạy được bootstrap, seed idempotence, typecheck, 4 smoke pass và 9 visual pass; xem [evidence/second-machine-verification.md](evidence/second-machine-verification.md). Nhóm 23 đã tự rà soát 8 baseline; không yêu cầu chữ ký riêng trong hồ sơ này. Các việc còn lại là chạy CI GitHub nếu muốn dùng CI làm bằng chứng và bổ sung link đóng góp cá nhân/peer evaluation nếu giảng viên yêu cầu.

Tham khảo cách tổ chức vai trò và đầu việc từ [R02-K05-Mealie-QA](https://github.com/Huuthien12/R02-K05-Mealie-QA). Phạm vi và sản phẩm của nhóm này là R02 + K10 với Playwright; các nhiệm vụ ở trên được điều chỉnh theo báo cáo giữa kỳ và harness hiện tại.

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
`npm run test:demo` chèn CSS chỉ vào browser: dịch main 48 pixel (regression tổng hợp), hoặc đổi màu nền theo REQ-DEMO-01 (intentional tổng hợp). Cả hai phải sinh mismatch thật. Script kiểm tra đây là lỗi pixel, lưu actual/expected/diff và classification; không cập nhật baseline. Demo không phải lỗi tự nhiên được phát hiện trong upstream. Thay đổi intentional thực tế vẫn cần yêu cầu hợp lệ và quyết định của nhóm.

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
