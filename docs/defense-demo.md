# Kịch bản demo bảo vệ

1. Mở UI http://localhost:3000 và API http://localhost:19000/api/app/about. Giải thích frontend host, backend Docker và SQLite volume.
2. Mở docs/architecture.md; giải thích ba luồng recipe, meal plan và shopping list. Mỗi người trình bày phần đã tự tìm hiểu.
3. Từ harness chạy npm run typecheck và npm run test:smoke. Nêu rõ API ghi dữ liệu, UI đọc và test dọn bản ghi tạm.
4. Chạy npm run test:visual. Mở report HTML và chỉ ra 8 baseline. Giải thích maxDiffPixelRatio 0.01 khác threshold màu 0.2.
5. Chạy npm run test:demo. Mỗi demo cố ý chạy ra 1 mismatch; script tổng hợp coi việc phát hiện mismatch là kết quả mong đợi. Mở ảnh diff trong evidence/demo-regression và demo-intentional.
6. Phân loại: regression là CSS dịch 48 pixel không có yêu cầu; intentional là demo đổi màu theo REQ-DEMO-01. Đây là dữ liệu tổng hợp, không phải lỗi phát hiện tự nhiên trong Mealie.
7. Chạy lại npm run test:visual để chứng minh baseline không đổi. Chỉ ra hashes trong evidence/baseline-manifest.json.
8. Nêu hạn chế: 8 màn hình không phải code coverage; màu rất nhạt có thể lọt ngưỡng; chỉ kiểm chứng Windows Chromium; CI GitHub chưa chạy; cần sign-off nhóm và đánh giá chéo thực tế.

Trước buổi bảo vệ: điền docs/team.md, xác nhận baseline, chạy lại trên máy thành viên thứ hai, kiểm tra lịch thi và nộp báo cáo trước một tuần. Không cập nhật baseline để che một test lỗi.
