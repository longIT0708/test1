// Lấy các phần tử DOM cần thiết
const form = document.querySelector('form');
const fileInput = document.querySelector('input[type="file"]');
const fileList = document.querySelector('ul');

// Xử lý sự kiện khi người dùng tải lên một tệp mới
form.addEventListener('submit', event => {
  event.preventDefault(); // Ngăn chặn gửi yêu cầu POST mặc định của trình duyệt

  const formData = new FormData();
  formData.append('file', fileInput.files[0]); // Thêm tệp vào FormData

  // Gửi yêu cầu POST đến đường dẫn /upload trên máy chủ
  fetch('/upload', {
    method: 'POST',
    body: formData
  })
    .then(response => response.json())
    .then(data => {
      // Hiển thị thông báo và làm mới danh sách tệp
      alert(data.message);
      refreshFileList();
    })
    .catch(error => console.error(error)); // Xử lý lỗi (nếu có)
});

// Xử lý sự kiện khi người dùng nhấn vào nút "Xóa"
fileList.addEventListener('click', event => {
  if (event.target.tagName === 'A') {
    event.preventDefault(); // Ngăn chặn mở liên kết mặc định của trình duyệt

    // Gửi yêu cầu DELETE đến đường
    fetch(`/file/${event.target.dataset.id}`, {
      method: 'DELETE'
    })
      .then(response => response.json())
      .then(data => {
        // Hiển thị thông báo và làm mới danh sách tệp
        alert(data.message);
        refreshFileList();
      })
      .catch(error => console.error(error)); // Xử lý lỗi (nếu có)
  }
});

// Hàm này sẽ làm mới danh sách tệp
function refreshFileList() {
  // Xóa tất cả các phần tử trong danh sách tệp
  while (fileList.firstChild) {
    fileList.removeChild(fileList.firstChild);
  }

  // Gửi yêu cầu GET đến đường dẫn /files trên máy chủ
  fetch('/files')
    .then(response => response.json())
    .then(data => {
      // Thêm một phần tử li cho mỗi tệp trong danh sách
      data.forEach(file => {
        const li = document.createElement('li');
        li.innerHTML = `
          <span>${file.name}</span>
          <button data-id="${file.id}">Xóa</button>
          <a href="/file/${file.id}" download>Tải xuống</a>
        `;
        fileList.appendChild(li);
      });
    })
    .catch(error => console.error(error)); // Xử lý lỗi (nếu có)
}

// Gọi hàm refreshFileList() để hiển thị danh sách tệp lần đầu tiên
refreshFileList();
