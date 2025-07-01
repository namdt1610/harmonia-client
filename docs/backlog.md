refactor login form
TODO:
      - Tách field username, password, remember me thành components riêng.
      - Tách login schema thành 1 hook riêng.
      - Thêm const quản lý routes trong lib.
      - Thêm bản dịch.
      - Thêm kiểu cho hàm async để trả về boolean để dễ debug?
      - Sửa hook GG login (chi tiết ở hook useLogin)
EXPLAINED:
      - form.control là core control object được React Hook Form (useForm) tạo ra, giúp bạn liên kết các field với hệ thống validation và state management của form.
      - form là object được tạo ra từ hook useForm().
      - form.control là cái mà bạn truyền vào <FormField /> để nói rằng "cái field này thuộc về cái form này".

TODO:
      - Tìm hiểu PayloadAction của Redux, kỹ về Redux
      - Refactor API