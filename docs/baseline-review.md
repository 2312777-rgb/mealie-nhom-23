# Duyệt baseline — Nhóm 23

Rà soát kỹ thuật cập nhật ngày 20/10/2026. Bộ test đã chạy đủ 8 màn hình bằng tài khoản QA, seed phiên bản 1 và ngày cố định. Kết quả visual regression là 8/8 pass; planner có 7 entry, shopping index có 2 danh sách, không lấy trang đăng nhập hoặc loading làm baseline. Bằng chứng tự động được lưu trong `evidence/final-results.json`, `evidence/verification-summary.json` và HTML report của Playwright.

Trạng thái hiện tại là **đã kiểm tra kỹ thuật**, còn cột “Nhóm chấp nhận” vẫn để **Chờ xác nhận** vì nhóm chưa cung cấp tên người duyệt và chữ ký xác nhận. Không tự ghi người duyệt thay cho nhóm.

| Ảnh | Kết quả rà soát kỹ thuật ngày 20/10/2026 | Nhóm chấp nhận |
| --- | --- | --- |
| VR01 | Finder ở trạng thái chưa chọn food/tool và No recipes found — **Pass kỹ thuật** | Chờ xác nhận |
| VR02 | Timeline chứa 10 recipe QA và ngày cố định — **Pass kỹ thuật** | Chờ xác nhận |
| VR03 | Có 3 category QA — **Pass kỹ thuật** | Chờ xác nhận |
| VR04 | Có 7 recipe entry trong tuần cố định — **Pass kỹ thuật** | Chờ xác nhận |
| VR05 | Đúng trang index với 2 shopping list — **Pass kỹ thuật** | Chờ xác nhận |
| VR06 | Profile và thống kê recipe 10 category 3 user 1 — **Pass kỹ thuật** | Chờ xác nhận |
| VR07 | Food data có 10 hàng QA — **Pass kỹ thuật** | Chờ xác nhận |
| VR08 | Form Meal Plan Rules và các control hiển thị — **Pass kỹ thuật** | Chờ xác nhận |

Phân công rà soát baseline: Huỳnh Thành phụ trách kiểm tra VR05–VR08, baseline, diff/defect và demo; các thành viên còn lại phối hợp kiểm tra phần mình phụ trách. Khi có người duyệt chính thức, nhóm ghi thêm họ tên, MSSV, requirement/issue, ảnh diff và commit trước/sau. Hai demo CSS là thay đổi tổng hợp, không cập nhật baseline thật.
