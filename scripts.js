document.getElementById('contact-form').addEventListener('submit', function (e) {
    e.preventDefault();

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;

    alert(`Cảm ơn bạn, ${name}! Chúng tôi sẽ liên hệ với bạn sớm.`);
    
    // Logic để gửi thông tin hoặc xử lý biểu mẫu
});
