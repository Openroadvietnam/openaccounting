# Open Accounting

* OpenAccounting là phần mềm  kế toán Việt Nam do công ty phần mềm Sao Tiên Phong phát triển (http://saotienphong.com.vn)
* OpenAccounting có thể được cài đặt trên Windows, Linux và MacOS
* OpenAccounting được viết trên NodeJS,MongoDB,AngularJS,Bootstrap
* Phiên bản hiện tại: 0.0.1 beta

## Hướng dẫn cài đặt

* Cài đặt [NodeJS](https://nodejs.org), sau khi cài NodeJS thì kiểm tra lại bằng bằng hai lệnh sau (các dấu `$` ở đầu mỗi dòng lệnh không được gõ):

  `$ node -v`
  Màn hình hiển thị giống như sau: `v0.10.36` là phiên bản NodeJS hiện tại.

  `$ npm --version`
  Màn hình hiển thị giống như sau: `2.7.1` là phiên bản NPM hiện tại.
* *(Tùy chọn)* Ứng dụng sử dụng MongoDB làm hệ quản trị cơ sở dữ liệu, bạn cần phải [cài MongoDB vào máy tính](http://docs.mongodb.org/manual/installation/) trước khi chạy Open Accounting. Nếu bạn sử dụng MongoDB từ một dịch vụ hoặc máy chủ khác thì bỏ qua bước này.
* Clone mã nguồn của ứng dụng trực tiếp từ Github hoặc [download](https://github.com/Openroadvietnam/openaccounting/archive/master.zip) và giải nén. Các bước sau giả sử mã nguồn của chương trình đang ở thư mục `/home/vagrant/code/openaccounting`
* Mở command line (trên Windows) hoặc terminal (trên Linux), chuyển thư mục làm việc đến thư mục chứa mã nguồn ở trên, ví dụ:

  `$ cd /home/vagrant/code/openaccounting`
* Cài đặt các thư viện cần thiết bằng `npm`

  `$ npm install`

  Chờ đợi một lát để hoàn tất quá trình cài đặt các thư viện.
* Cấu hình cho việc gửi email: để đăng kí tài khoản mới, ứng dụng cần được cấu hình để gửi email xác nhận. Cách đơn giản nhất là sử dụng một tài khoản Gmail, các dịch vụ khác cũng được hỗ trợ [(xem thêm)](https://github.com/andris9/nodemailer-wellknown#user-content-supported-services). Mở file `configs.js`, tìm đến đoạn

```
    sender.auth = {
            user: 'email',
            pass: 'password'
        }
```


  Thay `email` và `password` bằng địa chỉ gmail **đầy đủ** của bạn (ví dụ như: `openaccounting.vn@gmail.com`) và mật khẩu đăng nhập của địa chỉ gmail đó.
* Khởi động ứng dụng:

  `$ node app.js`
* Truy cập ứng dụng bằng địa chỉ mặc định [http://localhost:8000](http://localhost:8000)
* Đăng kí một tài khoản mới, sau đó kiểm tra email để lấy mật khẩu đăng nhập và bắt đầu sử dụng thử các tính năng của chương trình.



## Phân hệ

  * Kế toán tiền
  * Kế toán mua hàng
  * Kế toán bán hàng
  * Kế toán kho
  * Giá thành vụ việc, dự án (đang thực hiện...)
  * Giá thành sản xuất sản phẩm (đang thực hiện...)
  * Kế toán tổng hợp
  * Công cụ dụng cụ và tài sản cố định

## Tài liệu và cộng đồng

Đang cập nhật...

## Demo

[http://ungdungquanly.vn/admin](http://ungdungquanly.vn/admin)

## License
GNU AFFERO GENERAL PUBLIC LICENSE Version 3
