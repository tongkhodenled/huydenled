// scripts.js

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
window.onload = loadProducts;

// Mở modal
function openModal(productName, productPrice) {
    document.getElementById('orderModal').style.display = 'block';
    document.getElementById('productName').value = productName;
    document.getElementById('productPrice').value = productPrice;
}

// Đóng modal
var modal = document.getElementById('orderModal');
var span = document.getElementsByClassName('close')[0];

span.onclick = function() {
    modal.style.display = 'none';
}

window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = 'none';
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
        orderTime: new Date().toLocaleString('vi-VN') // Thời gian đặt hàng
    };

    orders.push(order);
    localStorage.setItem('orders', JSON.stringify(orders));

    // Ẩn modal và hiển thị thông báo cảm ơn
    modal.style.display = 'none';
    document.getElementById('thankYouMessage').style.display = 'block';
});

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
}
