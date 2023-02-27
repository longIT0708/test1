const fileForm = document.getElementById('upload-form');
const fileList = document.getElementById('file-list');

// Đăng ký sự kiện "submit" cho biểu mẫu tải lên tệp
fileForm.addEventListener('submit', (e) => {
  e.preventDefault(); // Ngăn chặn việc tải lại trang khi gửi biểu mẫu

  // Tạo đối tượng FormData từ biểu mẫu
  const formData = new FormData(fileForm);

  // Gửi yêu cầu POST đến máy chủ để tải lên tệp
  fetch('/files', {
    method: 'POST',
    body: formData
  })
  .then(response => response.json())
  .then(data => {
    console.log(data); // In ra dữ liệu phản hồi từ máy chủ (có thể không cần thiết)
    refreshFileList(); // Cập nhật danh sách tệp
  })
  .catch(error => console.error(error)); // Xử lý lỗi (nếu có)
});

// Đăng ký sự kiện "click" cho nút "Đổi tên" của mỗi tệp trong danh sách
fileList.addEventListener('click', (e) => {
  if (e.target.tagName.toLowerCase() === 'button') {
    const fileId = e.target.getAttribute('data-id');
    const newName = prompt('Nhập tên mới cho tệp:', e.target.getAttribute('data-name'));

    // Gửi yêu cầu PUT đến máy chủ để đổi tên tệp
    fetch(`/files/${fileId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name: newName })
    })
    .then(response => response.json())
    .then(data => {
      console.log(data); // In ra dữ liệu phản hồi từ máy chủ (có thể không cần thiết)
      refreshFileList(); // Cập nhật danh sách tệp
    })
    .catch(error => console.error(error)); // Xử lý lỗi (nếu có)
  }
});

// Đăng ký sự kiện "click" cho nút "Xóa" của mỗi tệp trong danh sách
fileList.addEventListener('click', (e) => {
  if (e.target.tagName.toLowerCase() === 'a') {
    const fileId = e.target.getAttribute('data-id');

    // Gửi yêu cầu DELETE đến máy chủ để xóa tệp
    fetch(`/files/${fileId}`, {
      method: 'DELETE'
    })
    .then(response => response.json())
    .then(data => {
      console.log(data); // In ra dữ liệu phản hồi từ máy chủ (có thể không cần thiết)
      refreshFileList(); // Cập nhật danh sách tệp
    })
    .catch(error => console.error(error)); // Xử lý lỗi (nếu có)
  }
});

// Hàm này sẽ gọi đến API để lấy danh sách tệp và hiển thị chúng
// Hàm này sẽ gọi đến API để lấy danh sách tệp và hiển thị chúng
function refreshFileList() {
  // Gửi yêu cầu GET đến máy chủ để lấy danh sách tệp
  fetch('/files')
    .then(response => response.json())
    .then(data => {
      // Xóa danh sách tệp hiện tại
      while (fileList.firstChild) {
        fileList.removeChild(fileList.firstChild);
      }

      // Thêm các tệp mới vào danh sách
      data.forEach(file => {
        const li = document.createElement('li');
        li.innerHTML = `
          <span>${file.name}</span>
          <button data-id="${file.id}" data-name="${file.name}">Đổi tên</button>
          <a href="#" data-id="${file.id}">Xóa</a>
        `;
        fileList.appendChild(li);
      });
    })
    .catch(error => console.error(error)); // Xử lý lỗi (nếu có)
}

// Gọi hàm refreshFileList để hiển thị danh sách tệp ban đầu
refreshFileList();
