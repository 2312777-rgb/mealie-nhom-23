# Duyệt baseline — Nhóm 23

Rà soát kỹ thuật cập nhật ngày 20/10/2026. Bộ test đã chạy đủ 8 màn hình bằng tài khoản QA, seed phiên bản 1 và ngày cố định. Kết quả visual regression là 8/8 pass; planner có 7 entry, shopping index có 2 danh sách, không lấy trang đăng nhập hoặc loading làm baseline. Bằng chứng tự động được lưu trong `evidence/final-results.json`, `evidence/verification-summary.json` và HTML report của Playwright.

Trạng thái hiện tại là **đã kiểm tra kỹ thuật bởi Nhóm 23**. Báo cáo này không yêu cầu chữ ký riêng; kết quả được căn cứ vào lần chạy tự động và phần rà soát baseline của nhóm.

| Ảnh | Kết quả rà soát kỹ thuật ngày 20/10/2026 | Nhóm chấp nhận |
| --- | --- | --- |
| VR01 | Finder ở trạng thái chưa chọn food/tool và No recipes found — **Pass kỹ thuật** | Đã kiểm tra |
| VR02 | Timeline chứa 10 recipe QA và ngày cố định — **Pass kỹ thuật** | Đã kiểm tra |
| VR03 | Có 3 category QA — **Pass kỹ thuật** | Đã kiểm tra |
| VR04 | Có 7 recipe entry trong tuần cố định — **Pass kỹ thuật** | Đã kiểm tra |
| VR05 | Đúng trang index với 2 shopping list — **Pass kỹ thuật** | Đã kiểm tra |
| VR06 | Profile và thống kê recipe 10 category 3 user 1 — **Pass kỹ thuật** | Đã kiểm tra |
| VR07 | Food data có 10 hàng QA — **Pass kỹ thuật** | Đã kiểm tra |
| VR08 | Form Meal Plan Rules và các control hiển thị — **Pass kỹ thuật** | Đã kiểm tra |

Phân công rà soát baseline: Huỳnh Thành phụ trách kiểm tra VR05–VR08, baseline, diff/defect và demo; các thành viên còn lại phối hợp kiểm tra phần mình phụ trách. Khi có thay đổi baseline thật, nhóm ghi requirement/issue, ảnh diff và commit trước/sau. Hai demo CSS là thay đổi tổng hợp, không cập nhật baseline thật.
