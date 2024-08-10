// Tải dữ liệu từ file JSON và hiển thị sản phẩm
function loadProducts() {
    fetch('data.json?v=' + new Date().getTime())
        .then(response => response.json())
        .then(data => {
            const productsContainer = document.getElementById('productsContainer');
            productsContainer.innerHTML = ''; // Xóa nội dung cũ

            data.products.forEach(product => {
                const productItem = document.createElement('div');
                productItem.className = 'product-item';
                productItem.innerHTML = `
                    <img src="${product.image}" alt="${product.name}">
                    <h3>${product.name}</h3>
                    <p>Giá: ${product.price}</p>
                    <button onclick="openModal('${product.name}', '${product.price}')">Đặt Mua</button>
                `;
                productsContainer.appendChild(productItem);
            });
        })
        .catch(error => console.error('Lỗi tải dữ liệu:', error));
}

// Gọi hàm để tải sản phẩm khi trang được tải
window.onload = function() {
    loadProducts();
    updateNotificationCount();
};

// Mở modal
function openModal(productName, productPrice) {
    document.getElementById('orderModal').style.display = 'block';
    document.getElementById('productName').value = productName;
    document.getElementById('productPrice').value = productPrice;
}

// Đóng modal
var modal = document.getElementById('orderModal');
var span = document.getElementsByClassName('close')[0];
var adminPrompt = document.getElementById('adminPrompt');
var notificationContent = document.getElementById('notificationContent');

span.onclick = function() {
    modal.style.display = 'none';
    adminPrompt.style.display = 'none';
}

window.onclick = function(event) {
    if (event.target == modal || event.target == adminPrompt) {
        modal.style.display = 'none';
        adminPrompt.style.display = 'none';
    }
}

// Lưu dữ liệu đơn hàng vào localStorage và hiển thị thông báo cảm ơn
document.getElementById('orderForm').addEventListener('submit', function(event) {
    event.preventDefault();

    var orders = JSON.parse(localStorage.getItem('orders')) || [];

    var order = {
        customerName: document.getElementById('customerName').value,
        customerPhone: document.getElementById('customerPhone').value,
        customerAddress: document.getElementById('customerAddress').value,
        productName: document.getElementById('productName').value,
        productPrice: document.getElementById('productPrice').value,
        orderTime: new Date().toLocaleString('vi-VN'),
        downloaded: false // Đặt trạng thái đơn hàng là chưa tải xuống
    };

    orders.push(order);
    localStorage.setItem('orders', JSON.stringify(orders));

    // Ẩn modal và hiển thị thông báo cảm ơn
    modal.style.display = 'none';
    document.getElementById('thankYouMessage').style.display = 'block';

    // Cập nhật nội dung thông báo và số lượng đơn hàng chưa tải xuống
    document.getElementById('notificationText').textContent = 'Đơn hàng mới vừa được đặt!';
    updateNotificationCount(); // Cập nhật số lượng đơn hàng chưa tải xuống
});

// Hiển thị prompt yêu cầu mật khẩu admin
function showAdminPrompt() {
    adminPrompt.style.display = 'block';
}

// Xác nhận mật khẩu admin và tải xuống đơn hàng
function validateAdmin() {
    const password = document.getElementById('adminPassword').value;
    const correctPassword = 'admin123'; // Đặt mật khẩu của bạn ở đây

    if (password === correctPassword) {
        downloadOrders();
        adminPrompt.style.display = 'none';
    } else {
        alert('Mật khẩu không chính xác.');
    }
}

// Cập nhật số lượng đơn hàng chưa tải xuống
function updateNotificationCount() {
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    const notDownloadedOrders = orders.filter(order => !order.downloaded).length;
    document.getElementById('notificationCount').textContent = notDownloadedOrders;
}

// Tải dữ liệu đơn hàng xuống dưới dạng file Excel
function downloadOrders() {
    var orders = JSON.parse(localStorage.getItem('orders')) || [];

    if (orders.length === 0) {
        alert('Không có đơn hàng nào để tải xuống.');
        return;
    }

    // Đảm bảo tiêu đề cột đúng với dữ liệu
    var ws = XLSX.utils.json_to_sheet(orders, {header: ["customerName", "customerPhone", "customerAddress", "productName", "productPrice", "orderTime"]});
    var wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Orders");
    XLSX.writeFile(wb, "orders.xlsx");

    // Đánh dấu các đơn hàng là đã tải xuống
    orders.forEach(order => order.downloaded = true);
    localStorage.setItem('orders', JSON.stringify(orders));

    // Cập nhật số lượng đơn hàng chưa tải xuống
    updateNotificationCount();
}

// Hiển thị hoặc ẩn thông báo khi nhấp vào hình chuông
function toggleNotification() {
    if (notificationContent.style.display === 'none' || notificationContent.style.display === '') {
        notificationContent.style.display = 'block';
    } else {
        notificationContent.style.display = 'none';
    }
}
