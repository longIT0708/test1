const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

// Hàm này sẽ trả về danh sách tệp trong thư mục uploads
function getFiles() {
  const uploadsDir = path.join(__dirname, '..', 'uploads');
  const fileNames = fs.readdirSync(uploadsDir);
  const files = fileNames.map(fileName => {
    const filePath = path.join(uploadsDir, fileName);
    const stat = fs.statSync(filePath);
    return {
      id: uuidv4(), // Tạo một ID duy nhất cho tệp
      name: fileName,
      size: stat.size,
      created: stat.birthtime
    };
  });
  return files;
}

// Hàm này sẽ lưu một tệp mới vào thư mục uploads
function saveFile(fileData) {
  const uploadsDir = path.join(__dirname, '..', 'uploads');
  const fileName = fileData.name.replace(/ /g, '_'); // Thay thế khoảng trắng bằng dấu gạch dưới
  const filePath = path.join(uploadsDir, fileName);
  fs.writeFileSync(filePath, fileData.data);
  const stat = fs.statSync(filePath);
  return {
    id: uuidv4(), // Tạo một ID duy nhất cho tệp
    name: fileName,
    size: stat.size,
    created: stat.birthtime
  };
}

// Hàm này sẽ xóa một tệp khỏi thư mục uploads
function deleteFile(id) {
    const uploadsDir = path.join(__dirname, '..', 'uploads');
    const file = getFiles().find(file => file.id === id);
    if (file) {
      const filePath = path.join(uploadsDir, file.name);
      fs.unlinkSync(filePath);
      return { message: `Đã xóa tệp "${file.name}"` };
    } else {
      return { error: `Không tìm thấy tệp với ID "${id}"` };
    }
  }
  
  module.exports = { getFiles, saveFile, deleteFile };
  
