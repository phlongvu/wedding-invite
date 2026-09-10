# Nơi lưu xác nhận tham dự

Form xác nhận trên trang gửi câu trả lời vào một **Google Sheet** của bạn, qua
một đoạn Apps Script gắn với chính bảng đó. Không cần máy chủ, không cần đăng
ký dịch vụ nào, không tốn tiền, và dữ liệu nằm trong tài khoản Google của bạn
chứ không nằm chỗ người khác.

Làm một lần, khoảng 5 phút.

---

## 1. Tạo bảng

1. Vào <https://sheets.new> để tạo một bảng tính mới.
2. Đặt tên, ví dụ **Xác nhận tham dự - Phi Long & Kim Chi**.

Không cần tạo cột. Script tự tạo sheet `RSVP` và dòng tiêu đề ở lần chạy đầu.

## 2. Dán script

1. Trong bảng vừa tạo, vào menu **Tiện ích mở rộng → Apps Script**
   (Extensions → Apps Script).
2. Xoá hết nội dung `Code.gs` đang có.
3. Dán toàn bộ đoạn dưới đây vào.
4. Bấm biểu tượng đĩa mềm để lưu.

```javascript
/* Nhận xác nhận tham dự từ trang thiệp cưới và ghi vào bảng này.
   Gắn với chính bảng tính, nên không cần khai id bảng ở đâu cả. */

const SHEET_NAME = 'RSVP';
const HEADERS = ['Thời gian', 'Tên', 'Tham dự', 'Số khách', 'Mã'];

function doPost(e) {
  /* Trang gửi cùng một câu trả lời hai lần khi trình duyệt không được phép
     đọc câu trả lời của lần đầu. Khoá lại để hai lần đó không chen nhau và
     cùng thấy bảng chưa có mã, rồi cùng ghi. */
  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(20000);
  } catch (err) {
    return json_({ ok: false, error: 'busy' });
  }

  try {
    const p = (e && e.parameter) || {};

    /* Ô mà không người nào nhìn thấy để mà điền. Có chữ trong đó nghĩa là
       máy điền, và im lặng bỏ qua thì bên kia không học được gì. */
    if (p.website) return json_({ ok: true });

    const id = String(p.id || '').slice(0, 60);
    const sheet = sheet_();

    if (id && seen_(sheet, id)) return json_({ ok: true, duplicate: true });

    const coming = p.attending === 'yes';
    sheet.appendRow([
      new Date(),
      String(p.fullname || '').slice(0, 120),
      coming ? 'Có đến' : 'Không đến',
      coming ? Math.min(Math.max(Number(p.guests) || 1, 1), 20) : 0,
      id,
    ]);

    return json_({ ok: true });
  } catch (err) {
    return json_({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

/* Mở đường dẫn này trên trình duyệt sẽ thấy dòng chữ dưới đây. Đó là cách
   nhanh nhất để biết đã triển khai đúng chưa. */
function doGet() {
  return ContentService.createTextOutput(
    'RSVP đang chạy. Số dòng đã nhận: ' + Math.max(sheet_().getLastRow() - 1, 0)
  );
}

function sheet_() {
  const book = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = book.getSheetByName(SHEET_NAME) || book.insertSheet(SHEET_NAME);
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
    sheet.setFrozenRows(1);
    sheet.setColumnWidth(1, 170);
    sheet.setColumnWidth(2, 220);
  }
  return sheet;
}

function seen_(sheet, id) {
  const rows = sheet.getLastRow() - 1;
  if (rows < 1) return false;
  /* Chỉ dò trong khoảng gần đây. Hai lần gửi của cùng một người cách nhau
     tính bằng mili giây, nên không cần quét cả bảng mỗi lần. */
  const look = Math.min(rows, 200);
  const from = sheet.getLastRow() - look + 1;
  return sheet
    .getRange(from, 5, look, 1)
    .getValues()
    .some(function (row) {
      return String(row[0]) === id;
    });
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(
    ContentService.MimeType.JSON
  );
}
```

## 3. Triển khai

1. Góc trên bên phải, bấm **Triển khai → Bản triển khai mới**
   (Deploy → New deployment).
2. Bấm bánh răng cạnh "Chọn loại" và chọn **Ứng dụng web** (Web app).
3. Đặt:
   - **Thực thi với tư cách** (Execute as): **Tôi** (Me)
   - **Ai có quyền truy cập** (Who has access): **Bất kỳ ai** (Anyone)
4. Bấm **Triển khai**. Google sẽ hỏi quyền: chọn tài khoản, bấm **Nâng cao →
   Đi tới … (không an toàn)**, rồi **Cho phép**. Cảnh báo đó chỉ vì script chưa
   qua kiểm duyệt của Google; đây là script của chính bạn, chạy trên bảng của
   chính bạn.
5. Sao chép **URL ứng dụng web**. Nó có dạng:

   ```
   https://script.google.com/macros/s/AKfycb…/exec
   ```

**"Ai có quyền truy cập: Bất kỳ ai" nghĩa là gì.** Bất kỳ ai biết đường dẫn đó
đều có thể gửi một dòng vào bảng, và bắt buộc phải vậy vì khách không đăng nhập
Google khi mở thiệp. Họ **không** đọc được bảng, **không** sửa hay xoá được gì.
Rủi ro thực tế là ai đó tìm ra đường dẫn rồi gửi rác vào; nếu chuyện đó xảy ra,
bấm **Triển khai → Quản lý bản triển khai** rồi lưu trữ (archive) bản đó, đường
dẫn cũ chết ngay, và triển khai bản mới lấy đường dẫn khác.

## 4. Nối vào trang

**Đã xong.** `RSVP_ENDPOINT` ở đầu `script.js` đang trỏ tới bản triển khai
hiện tại. Nếu sau này triển khai lại và lấy đường dẫn khác, sửa đúng chỗ đó:

```javascript
const RSVP_ENDPOINT =
  "https://script.google.com/macros/s/AKfycb…/exec";
```

## 5. Kiểm tra (đừng bỏ bước này)

1. Mở đường dẫn web app thẳng trên trình duyệt. Phải thấy
   `RSVP đang chạy. Số dòng đã nhận: 0`. Nếu thấy trang lỗi thì bản triển khai
   sai, quay lại bước 3. Bước này phải do bạn làm: máy dựng trang không ra
   được `script.google.com`, nên nó chưa từng gọi thử đường dẫn này lần nào.
2. Mở trang thiệp thật, gửi một xác nhận thử.
3. Mở bảng tính. Phải có một dòng mới.
4. Xoá dòng thử đó đi.

**Vì sao bắt buộc kiểm tra.** Trang gửi câu trả lời nhưng trình duyệt thường
không được phép đọc câu trả lời từ Apps Script, nên nếu script hỏng thì khách
vẫn thấy lời cảm ơn còn bảng thì trống. Trang chỉ báo lỗi cho khách khi mạng
đứt hẳn. Một lần thử là biết ngay, và **thử lại mỗi lần triển khai lại script**.

## Sau đó

- **Xem xác nhận:** mở bảng tính. Dòng mới xuất hiện ngay.
- **Nhận thông báo:** trong bảng, vào **Công cụ → Quy tắc thông báo**
  (Tools → Notification rules) để Google gửi email khi có dòng mới.
- **Đếm số khách:** đặt vào một ô trống bên phải:
  `=SUMIF(C:C;"Có đến";D:D)`
- **Sửa lại script sau này:** sửa xong phải **Triển khai → Quản lý bản triển
  khai → sửa bản đang chạy → Phiên bản: Mới**. Chỉ lưu file thôi thì đường dẫn
  cũ vẫn chạy code cũ.

## Có gì trong bảng

| Cột | Nội dung |
| --- | --- |
| Thời gian | Lúc nhận được, theo múi giờ của bảng |
| Tên | Khách tự nhập, cắt còn 120 ký tự |
| Tham dự | `Có đến` hoặc `Không đến` |
| Số khách | Số người, kể cả họ. `0` nếu không đến |
| Mã | Mã của lượt gửi, để không ghi trùng khi trang gửi hai lần |

Cột Mã trông vô nghĩa nhưng đừng xoá: script dò cột đó để biết một câu trả lời
đã được ghi hay chưa. Xoá đi thì mỗi xác nhận có thể thành hai dòng.
