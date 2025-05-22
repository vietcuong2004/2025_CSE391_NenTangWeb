$(document).ready(function() {
    console.log("jQuery is ready!");

    // Các hàm kiểm tra validation
    const validators = {
        fullName: (value) => {
            if (!value) return "Vui lòng nhập họ tên";
            if (value.length < 2) return "Họ tên phải có ít nhất 2 ký tự";
            return "";
        },
        email: (value) => {
            if (!value) return "Vui lòng nhập email";
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) return "Email không hợp lệ";
            return "";
        },
        password: (value) => {
            if (!value) return "Vui lòng nhập mật khẩu";
            if (value.length < 6) return "Mật khẩu phải có ít nhất 6 ký tự";
            if (!/[A-Z]/.test(value)) return "Mật khẩu phải có ít nhất 1 chữ hoa";
            if (!/[0-9]/.test(value)) return "Mật khẩu phải có ít nhất 1 số";
            return "";
        },
        confirmPassword: (value, password) => {
            if (!value) return "Vui lòng xác nhận mật khẩu";
            if (value !== password) return "Mật khẩu xác nhận không khớp";
            return "";
        },
        phone: (value) => {
            if (!value) return "Vui lòng nhập số điện thoại";
            const phoneRegex = /^[0-9]{10}$/;
            if (!phoneRegex.test(value)) return "Số điện thoại không hợp lệ (10 số)";
            return "";
        }
    };

    // Xử lý sự kiện input để validate realtime
    $('#registrationForm input').on('input', function() {
        const field = $(this).attr('id');
        const value = $(this).val();
        const password = $('#password').val();
        
        let error = validators[field](value, password);
        $(`#${field}Error`).text(error)[error ? 'slideDown' : 'slideUp']();
        
        // Thêm/xóa class is-invalid dựa trên kết quả validate
        $(this).toggleClass('is-invalid', !!error);
    });

    // Xử lý sự kiện submit form
    $('#registrationForm').on('submit', function(e) {
        e.preventDefault();
        
        // Reset error messages
        $('.error-message').slideUp();
        
        // Validate tất cả các trường
        const formData = {};
        let hasError = false;
        
        $(this).find('input').each(function() {
            const field = $(this).attr('id');
            const value = $(this).val();
            formData[field] = value;
            
            let error = validators[field](value, formData.password);
            if (error) {
                hasError = true;
                $(`#${field}Error`).text(error).slideDown();
                $(this).addClass('is-invalid');
            }
        });
        
        if (hasError) return;

        // Thêm loading spinner
        const $submitBtn = $(this).find('button[type="submit"]');
        const originalText = $submitBtn.text();
        $submitBtn.html('<span class="spinner"></span>Đang xử lý...').prop('disabled', true);

        // Gửi dữ liệu bằng AJAX
        $.ajax({
            url: 'https://jsonplaceholder.typicode.com/users', // API demo
            method: 'POST',
            data: formData,
            success: function(response) {
                // Ẩn form với hiệu ứng
                $('#registrationForm').fadeOut(500, function() {
                    // Hiển thị thông báo thành công
                    $('#successMessage').slideDown();
                });
            },
            error: function(xhr, status, error) {
                alert('Có lỗi xảy ra: ' + error);
            },
            complete: function() {
                // Khôi phục nút submit
                $submitBtn.html(originalText).prop('disabled', false);
            }
        });
    });

    // Xử lý nút "đăng ký tài khoản khác"
    $('#registerAnother').on('click', function(e) {
        e.preventDefault();
        
        // Ẩn thông báo thành công
        $('#successMessage').slideUp(500, function() {
            // Reset form
            $('#registrationForm')[0].reset();
            $('.error-message').hide();
            $('.is-invalid').removeClass('is-invalid');
            
            // Hiển thị form
            $('#registrationForm').fadeIn();
        });
    });

    // Thêm hiệu ứng hover cho các input
    $('.form-control').hover(
        function() { $(this).addClass('shadow-sm'); },
        function() { $(this).removeClass('shadow-sm'); }
    );
}); 