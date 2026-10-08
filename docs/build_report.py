from pathlib import Path
from docx import Document
from docx.enum.section import WD_SECTION
from docx.enum.table import WD_TABLE_ALIGNMENT, WD_CELL_VERTICAL_ALIGNMENT
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.oxml import OxmlElement
from docx.oxml.ns import qn
from docx.shared import Cm, Pt, RGBColor

ROOT = Path(__file__).resolve().parent
OUT = ROOT / "Bao_cao_R02_K10_Mealie_Visual_Regression.docx"

def shade(cell, fill):
    tc_pr = cell._tc.get_or_add_tcPr(); shd = OxmlElement("w:shd"); shd.set(qn("w:fill"), fill); tc_pr.append(shd)

def border(cell):
    tc_pr = cell._tc.get_or_add_tcPr(); borders = OxmlElement("w:tcBorders")
    for edge in ("top", "left", "bottom", "right", "insideH", "insideV"):
        el = OxmlElement(f"w:{edge}"); el.set(qn("w:val"), "single"); el.set(qn("w:sz"), "4"); el.set(qn("w:color"), "D9D9D9"); borders.append(el)
    tc_pr.append(borders)

def set_cell_text(cell, text, bold=False, color=None):
    cell.text = ""; p = cell.paragraphs[0]; p.paragraph_format.space_after = Pt(2)
    r = p.add_run(text); r.bold = bold; r.font.size = Pt(9); r.font.name = "Arial"
    if color: r.font.color.rgb = RGBColor(*color)
    cell.vertical_alignment = WD_CELL_VERTICAL_ALIGNMENT.CENTER; border(cell)

def table(doc, headers, rows, widths=None):
    t = doc.add_table(rows=1, cols=len(headers)); t.alignment = WD_TABLE_ALIGNMENT.CENTER; t.style = "Table Grid"
    for i, h in enumerate(headers):
        set_cell_text(t.rows[0].cells[i], h, True, (255,255,255)); shade(t.rows[0].cells[i], "1F4E78")
    for idx, row in enumerate(rows):
        cells = t.add_row().cells
        for i, value in enumerate(row):
            set_cell_text(cells[i], str(value))
            if idx % 2: shade(cells[i], "EDF3F8")
    if widths:
        for row in t.rows:
            for i, width in enumerate(widths): row.cells[i].width = Cm(width)
    doc.add_paragraph().paragraph_format.space_after = Pt(3)
    return t

def heading(doc, text, level=1):
    p = doc.add_paragraph(style=f"Heading {level}"); p.paragraph_format.space_before = Pt(10); p.paragraph_format.space_after = Pt(5)
    r = p.add_run(text); r.font.name = "Arial"; r.font.color.rgb = RGBColor(0,0,0)

def body(doc, text, bold_lead=None):
    p = doc.add_paragraph(); p.paragraph_format.space_after = Pt(6); p.paragraph_format.line_spacing = 1.15
    if bold_lead:
        r = p.add_run(bold_lead); r.bold = True; r.font.name = "Arial"; r.font.size = Pt(11)
    r = p.add_run(text); r.font.name = "Arial"; r.font.size = Pt(11)

doc = Document()
sec = doc.sections[0]; sec.top_margin = Cm(2.2); sec.bottom_margin = Cm(2); sec.left_margin = Cm(2.5); sec.right_margin = Cm(2)
styles = doc.styles
styles["Normal"].font.name = "Arial"; styles["Normal"].font.size = Pt(11)
for s in ("Heading 1", "Heading 2"):
    styles[s].font.name = "Arial"; styles[s].font.color.rgb = RGBColor(0,0,0)

p = doc.add_paragraph(); p.alignment = WD_ALIGN_PARAGRAPH.CENTER; p.paragraph_format.space_after = Pt(12)
r = p.add_run("TRƯỜNG ĐẠI HỌC ĐÀ LẠT\nKHOA CÔNG NGHỆ THÔNG TIN"); r.bold = True; r.font.name = "Arial"; r.font.size = Pt(14)
p = doc.add_paragraph(); p.alignment = WD_ALIGN_PARAGRAPH.CENTER; p.paragraph_format.space_before = Pt(45); p.paragraph_format.space_after = Pt(12)
r = p.add_run("BÁO CÁO ĐỀ TÀI MÔN KIỂM THỬ PHẦN MỀM"); r.bold = True; r.font.name = "Arial"; r.font.size = Pt(16)
p = doc.add_paragraph(); p.alignment = WD_ALIGN_PARAGRAPH.CENTER; p.paragraph_format.space_after = Pt(38)
r = p.add_run("KIỂM THỬ HỒI QUY GIAO DIỆN CHO HỆ THỐNG MEALIE\nBẰNG PLAYWRIGHT"); r.bold = True; r.font.name = "Arial"; r.font.size = Pt(18)
for line in ("Mã đề tài: R02 + K10", "Giảng viên: Nguyễn Thế Lâm", "Nhóm: 23", "Năm học: 2026 - 2027"):
    p = doc.add_paragraph(); p.alignment = WD_ALIGN_PARAGRAPH.CENTER; r = p.add_run(line); r.font.name = "Arial"; r.font.size = Pt(12)
doc.add_page_break()

heading(doc, "Thông tin nhóm", 1)
body(doc, "Bảng dưới đây được để trống để nhóm cập nhật đầy đủ họ tên, mã số sinh viên và phần việc thực tế trước khi nộp.")
table(doc, ["Thành viên", "MSSV", "Vai trò", "Sản phẩm phụ trách"], [
    ["Thành viên 1", "................................", "Nhóm trưởng và phân tích", "Kiến trúc, quản lý tiến độ, tổng hợp báo cáo"],
    ["Thành viên 2", "................................", "Môi trường và dữ liệu", "Docker, tài khoản test, seed data, README"],
    ["Thành viên 3", "................................", "Automation engineer", "VR01 - VR04, baseline và CI"],
    ["Thành viên 4", "................................", "QA analyst", "VR05 - VR08, defect report và trình bày"],
], [3, 3, 4, 7])
heading(doc, "Tóm tắt", 1)
body(doc, "Đề tài áp dụng kỹ thuật Visual Regression Testing cho Mealie, một hệ thống quản lý công thức, thực đơn và danh sách mua sắm. Nhóm xây dựng bộ kiểm thử tự động Playwright cho tám màn hình nghiệp vụ ổn định. Mỗi lần chạy, Playwright chụp ảnh giao diện trên Chromium với cấu hình cố định và so sánh với baseline đã được phê duyệt. Khác biệt vượt ngưỡng được ghi nhận là regression cho đến khi có bằng chứng đó là thay đổi có chủ đích.")
heading(doc, "1 Mục tiêu và phạm vi", 1)
body(doc, "Mục tiêu là phát hiện sớm lỗi bố cục, màu sắc, thành phần bị mất, tràn nội dung và thay đổi giao diện không mong muốn. Phạm vi được giới hạn ở giao diện web xác thực của Mealie để đảm bảo có thể tái lập trên máy sạch. Kiểm thử không thay thế kiểm thử chức năng, bảo mật hoặc hiệu năng.")
table(doc, ["Hạng mục", "Quyết định"], [
    ["Repository hệ thống", "mealie-recipes/mealie (R02), khóa theo tag và commit SHA trước khi tạo baseline"],
    ["Kỹ thuật", "Visual Regression Testing (K10)"],
    ["Công cụ", "Playwright Test và Chromium"],
    ["Môi trường", "Mealie chạy local/Docker; tài khoản và dữ liệu test riêng"],
    ["Trình duyệt", "Chromium, viewport 1440 x 900, device scale factor 1"],
    ["Locale và timezone", "en-US và UTC"],
], [5, 12])
heading(doc, "2 Phân tích hệ thống", 1)
body(doc, "Mealie có frontend Nuxt/Vue TypeScript giao tiếp với backend FastAPI qua REST API. Backend xử lý xác thực, nghiệp vụ công thức, thực đơn và shopping list; dữ liệu được lưu trong SQLite hoặc PostgreSQL tùy cấu hình. Visual regression tập trung ở frontend sau đăng nhập, nhưng tính ổn định của ảnh phụ thuộc trực tiếp vào API, dữ liệu seed và trạng thái nhóm/hộ gia đình.")
body(doc, "Luồng dữ liệu chính: người dùng đăng nhập qua giao diện -> frontend gửi yêu cầu đến API -> API xác thực và trả dữ liệu theo group/household -> Vue render danh sách, form hoặc lịch -> Playwright chụp toàn bộ trang sau khi mạng ổn định. Ảnh chụp được đối chiếu với baseline của cùng kịch bản.")
heading(doc, "3 Thiết lập và tái lập", 1)
body(doc, "Repository kiểm thử tách biệt gồm Playwright config, login setup, tám test screenshot, workflow CI, test plan và README. File .env chỉ chứa cấu hình local, không được commit. Trước khi chạy cần khởi động Mealie local, tạo test user riêng và seed dữ liệu xác định: tối thiểu 10 recipes, 3 categories, 10 foods, 1 shopping list và meal plan cho một tuần.")
table(doc, ["Bước", "Lệnh hoặc hành động", "Kết quả mong đợi"], [
    ["1", "Sao chép .env.example thành .env và điền thông tin local", "Không lộ credential vào Git"],
    ["2", "npm install; npx playwright install chromium", "Cài dependency và browser"],
    ["3", "npm run test:visual:update", "Tạo snapshot baseline đã được review"],
    ["4", "npm run test:visual", "So sánh actual với baseline"],
    ["5", "npm run test:visual:report", "Mở HTML report và ảnh diff khi có lỗi"],
], [1.2, 8.5, 7.3])
heading(doc, "4 Thiết kế kiểm thử", 1)
body(doc, "Test oracle là ảnh baseline đã được phê duyệt. Mỗi test điều hướng đến một route, chờ network idle, vô hiệu hóa animation/transition và chụp full-page screenshot. Ngưỡng maxDiffPixelRatio là 0.01. Một lỗi điều hướng, request thất bại hoặc khác biệt ảnh chưa được chấp thuận đều là fail.")
table(doc, ["ID", "Màn hình", "Tiền điều kiện", "Bất biến quan sát"], [
    ["VR01", "Recipe finder", "Đã đăng nhập, recipes seeded", "Thanh tìm kiếm, bộ lọc, recipe card và sidebar"],
    ["VR02", "Recipe timeline", "Có recipes seeded", "Timeline, điều khiển và tile công thức"],
    ["VR03", "Recipe categories", "Có categories seeded", "Danh sách category và action control"],
    ["VR04", "Meal planner", "Có meal plan tuần cố định", "Lưới tuần, meal entry và planner control"],
    ["VR05", "Shopping lists", "Có một shopping list", "List card, navigation và trạng thái danh sách"],
    ["VR06", "Profile dashboard", "Đã đăng nhập", "Summary card và điều hướng tài khoản"],
    ["VR07", "Group food data", "Có foods seeded", "Bảng/danh sách food và control"],
    ["VR08", "Meal plan settings", "Đã đăng nhập household", "Heading và các setting control"],
], [1.2, 3.1, 5.0, 7.7])
heading(doc, "5 Kiểm soát tính ổn định của snapshot", 1)
table(doc, ["Nguồn nhiễu", "Biện pháp"], [
    ["Animation, transition và caret", "Tắt bằng CSS và reduced motion trước khi chụp"],
    ["Dữ liệu thay đổi theo ngày", "Dùng meal plan và seed data cố định; timezone UTC"],
    ["Khác biệt browser", "Chỉ dùng Chromium do Playwright quản lý"],
    ["Loading skeleton/progress", "Chờ network idle và ẩn loading widget"],
    ["Baseline không được kiểm soát", "Review ảnh trong pull request; chỉ commit khi có phê duyệt"],
], [6, 11])
heading(doc, "6 Quy trình phát hiện và xử lý defect", 1)
body(doc, "Khi test thất bại, Playwright sinh expected, actual, diff image và trace. Người phụ trách tái chạy trên cùng phiên bản Mealie và seed data. Nếu khác biệt không có yêu cầu hoặc issue hợp lệ, nhóm tạo defect với mức độ, evidence, nguyên nhân gốc và người xử lý. Nếu thay đổi là chủ đích, reviewer xác nhận, cập nhật baseline qua pull request và ghi lý do thay đổi.")
table(doc, ["Trường defect", "Nội dung bắt buộc"], [
    ["Defect ID", "Ví dụ VR-001"],
    ["Bối cảnh", "Scenario ID, Mealie tag/SHA, snapshot SHA và ngày chạy"],
    ["Evidence", "Expected, actual, diff image và Playwright report"],
    ["Phân loại", "Regression hoặc intentional change"],
    ["Nguyên nhân gốc", "Component/CSS/data gây ra, corrective action và trạng thái"],
], [5, 12])
heading(doc, "7 Phân công và kế hoạch", 1)
table(doc, ["Vai trò", "Nhiệm vụ", "Deliverable"], [
    ["TV1", "Quản lý backlog, phân tích kiến trúc, review baseline", "Sơ đồ, tiến độ và báo cáo tổng hợp"],
    ["TV2", "Dựng Docker/local, test user và deterministic seed data", "Hướng dẫn setup và dữ liệu test"],
    ["TV3", "Cấu hình Playwright, VR01-VR04, CI", "Test code, baseline, workflow"],
    ["TV4", "VR05-VR08, phân tích diff và defect", "Test code, defect log, slide/demo"],
], [2, 8, 7])
table(doc, ["Sprint", "Mục tiêu", "Tiêu chí hoàn thành"], [
    ["1", "Khóa Mealie commit, dựng môi trường và data", "Có README và 3 luồng chạy được"],
    ["2", "Hoàn thành 8 scenario và baseline", "Mỗi màn hình có ảnh baseline được review"],
    ["3", "Chạy CI, phân tích regression và hoàn thiện report", "Có report/diff/defect evidence để demo"],
], [2, 7, 8])
heading(doc, "8 Kết luận", 1)
body(doc, "Giải pháp cung cấp một harness có thể chạy lại để kiểm soát hồi quy giao diện Mealie. Giá trị của bộ test nằm ở baseline được phê duyệt và môi trường có dữ liệu ổn định; vì vậy nhóm phải ghi nhận chính xác tag/commit của Mealie, phiên bản Node/Playwright, seed-data version và snapshot commit trước mỗi lần báo cáo hoặc bảo vệ.")
heading(doc, "Tài liệu tham khảo", 1)
body(doc, "[1] Mealie source repository: https://github.com/mealie-recipes/mealie")
body(doc, "[2] Playwright Visual Comparisons: https://playwright.dev/docs/test-snapshots")
body(doc, "[3] Tài liệu hướng dẫn đề tài môn Kiểm thử phần mềm, Nguyễn Thế Lâm, 2026.")

for section in doc.sections:
    footer = section.footer.paragraphs[0]; footer.alignment = WD_ALIGN_PARAGRAPH.CENTER
    run = footer.add_run("R02 K10 - Mealie Visual Regression Testing"); run.font.name = "Arial"; run.font.size = Pt(9)
doc.save(OUT)
print(OUT)
