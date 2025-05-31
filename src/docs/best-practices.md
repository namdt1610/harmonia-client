CHECKLIST BEST PRACTICES CHUNG KHI CODE MODULE

1. Cấu trúc code rõ ràng, dễ hiểu

Đặt tên biến/hàm đúng nghĩa, dễ đoán chức năng.
Tách hàm logic lớn thành hàm nhỏ, mỗi hàm làm đúng một việc.
Sử dụng comment khi cần thiết, tránh comment thừa.

2. Định nghĩa rõ kiểu dữ liệu

Dùng TypeScript (hoặc tương tự) để định nghĩa kiểu rõ ràng.
Tránh any, tránh kiểu mơ hồ.
Khi hàm trả về Promise, xác định rõ kiểu trả về (e.g., Promise<boolean>, Promise<User>,...).

3. Xử lý lỗi hiệu quả

Dùng try-catch hoặc Promise.catch để bắt lỗi.
Trả lỗi có ý nghĩa, dễ debug.
Không show raw lỗi cho user, mà nên map lỗi thành message dễ hiểu.

4. Tối ưu UX & accessibility

Form có trạng thái loading/disable để tránh submit nhiều lần.
Thêm aria-label, autoComplete, keyboard navigation.
Feedback rõ ràng cho user khi thao tác thành công hoặc thất bại.

5. Sử dụng các thư viện chuẩn và hooks hợp lý

Với React: dùng React Hook Form, Zod, hoặc các thư viện hợp chuẩn.
Tách logic ra hook để dễ test, reuse.

6. Kiểm tra đầu vào đầu ra (validation)
Validate dữ liệu đầu vào (form, API) ngay từ client.

Đồng bộ validate ở backend.

Dùng schema validation (Zod, Yup, Joi,...).

7. Tách biệt UI và logic
Component chỉ tập trung render UI.

Logic gọi API, xử lý trạng thái tách riêng (hooks hoặc services).

8. Bảo mật
Không lưu thông tin nhạy cảm thẳng vào localStorage (như mật khẩu).

Mã hóa, hash password phía backend.

Xác thực, phân quyền chặt chẽ.

9. Code review và testing
Luôn viết test (unit test, integration test).

Tham gia code review nghiêm túc.

Đặt test case cho các tình huống chính, đặc biệt là lỗi.

10. Tối ưu hiệu năng
Tránh render thừa.

Debounce input nếu cần.

Sử dụng memo, lazy load, code splitting nếu cần.

