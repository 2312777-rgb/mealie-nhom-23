# Hướng dẫn dựng lại R02 K10

## Khóa phiên bản
Đọc `project-lock.json`. Checkout Mealie commit `879b133b5f98dd91419948f363d2d6d58793c3a0` rồi đặt thư mục harness `mealie-nhom-23` vào gốc repo. Giữ nguyên uv.lock, frontend/pnpm-lock.yaml và package-lock.json của harness. Baseline Windows chỉ so sánh trên Windows với Chromium cùng phiên bản; Linux cần bộ baseline được duyệt riêng.

## Yêu cầu
Windows với Docker Desktop dùng Linux containers và WSL2, Node 22 trở lên, pnpm đúng bản trong frontend/package.json, Git và uv 0.11.7 cho việc chạy Python trên host khi cần. Backend chạy trong Linux container để tránh lỗi build python-ldap trên Windows. Cần Internet cho lần tải dependency đầu tiên.

## Backend
Từ gốc Mealie:
```powershell
docker compose -f mealie-nhom-23/docker-compose.visual.yml up -d --build --wait
```
API: http://localhost:19000; tài liệu: http://localhost:19000/docs nếu được bật. SQLite lưu trong volume `mealie-r02-k10_qa-data`, tách khỏi dữ liệu cá nhân. Cổng backend chỉ bind loopback.

## Frontend
Trong terminal thứ hai từ thư mục frontend:
```powershell
pnpm install --frozen-lockfile
$env:API_URL='http://localhost:19000'
pnpm run dev --no-fork
```
UI: http://localhost:3000. Mô hình này là môi trường development gồm hai tiến trình, không phải gói production SPA.

## QA account và dữ liệu
Trong thư mục mealie-nhom-23:
```powershell
Copy-Item .env.example .env
npm ci
npx playwright install chromium
```
Đặt MEALIE_BASE_URL=http://localhost:3000, MEALIE_API_URL=http://localhost:19000, email/password cho tài khoản QA và MEALIE_ALLOW_SEED=true trong .env. Không commit .env. Chạy:
```powershell
npm run bootstrap
npm run seed
npm run typecheck
npm run test:list
```
Bootstrap tạo group/hộ gia đình riêng qua đăng ký local, cập nhật group slug trong .env và xác nhận đăng nhập. Seed tạo 10 công thức, 3 category gắn công thức, 10 food, hai shopping list và 7 bữa tối trong tuần ngày cố định. Seed chạy lại không tạo thêm bản ghi cùng tên hoặc meal entry cùng ngày/công thức/loại bữa. Không xóa dữ liệu có sẵn.

## Baseline và so sánh
```powershell
npm run test:visual:update
npm run test:visual:report
# Duyệt trực quan cả 8 ảnh trước khi chấp nhận.
npm run test:visual
```
Lệnh so sánh thường không tự tạo baseline bị thiếu. Ảnh expected nằm trong tests/__screenshots__, HTML ở playwright-report, JSON ở test-results/results.json. Commit baseline chỉ sau review. Không đưa .auth, .env hoặc trace chứa credential vào gói nộp công khai.

## Dừng môi trường
```powershell
docker compose -f mealie-nhom-23/docker-compose.visual.yml stop
```
Dừng frontend bằng Ctrl+C. Không dùng down -v nếu còn cần dữ liệu QA.

## Xử lý lỗi
- Docker pipe không tồn tại: mở Docker Desktop và đợi Engine Ready, kiểm tra docker info.
- Port 9000/3000 đang dùng: xác định tiến trình và thay cấu hình nhất quán, không tắt dịch vụ khác tùy tiện.
- Seed 403: kiểm tra quyền canOrganize/canManage của QA account.
- Ảnh khác trên máy mới: kiểm tra OS, Chromium, font, scale, commit, seed và ngày cố định trước khi gán lỗi UI.
- Backend native Windows không build được python-ldap: dùng Dockerfile.backend; không sửa mã xác thực upstream để né lỗi.
