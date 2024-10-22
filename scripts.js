// Load product images
window.onload = function () {
    const gallery = document.getElementById('product-gallery');

    fetch('/images/')
        .then(response => response.text())
        .then(data => {
            const parser = new DOMParser();
            const doc = parser.parseFromString(data, 'text/html');
            const images = doc.querySelectorAll('a');

            images.forEach(imgLink => {
                const img = document.createElement('img');
                img.src = '/images/' + imgLink.getAttribute('href');
                gallery.appendChild(img);
            });
        });
};

// Handle modal display
const quoteBtn = document.getElementById('quote-btn');
const modal = document.getElementById('quote-modal');
const closeModal = document.querySelector('.close');
const submitBtn = document.getElementById('submit-btn');
const cancelBtn = document.getElementById('cancel-btn');
const thankYouModal = document.getElementById('thank-you-modal');
const visitorCount = document.getElementById('count');
let visitorNum = 0;
let customerData = [];

// Show the modal when "Nhận báo giá" button is clicked
quoteBtn.onclick = () => modal.style.display = 'flex';

// Close the modal when "Cancel" button or "x" is clicked
closeModal.onclick = () => modal.style.display = 'none';
cancelBtn.onclick = () => modal.style.display = 'none';

// Handle form submission
submitBtn.onclick = function () {
    const name = document.getElementById('name').value;
    const phone = document.getElementById('phone').value;
    const address = document.getElementById('address').value;

    if (name && phone && address) {
        customerData.push({ name, phone, address });
        visitorNum++;
        visitorCount.textContent = visitorNum;

        // Close the form and show thank you message
        modal.style.display = 'none';
        thankYouModal.style.display = 'flex';
        setTimeout(() => thankYouModal.style.display = 'none', 2000);
    } else {
        alert('Vui lòng điền đầy đủ thông tin.');
    }
};

// Download customer data as Excel file
document.getElementById('download-btn').onclick = function () {
    const data = customerData.map(d => `${d.name}, ${d.phone}, ${d.address}`).join('\n');
    const blob = new Blob([`Tên,SĐT,Địa chỉ\n${data}`], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'customer_data.csv';
    a.click();
};
