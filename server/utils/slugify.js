function slugify(text) {
  return text
    .toString()
    .normalize("NFD") // tách chữ và dấu
    .replace(/[\u0300-\u036f]/g, "") // bỏ dấu
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-") // thay khoảng trắng thành dấu -
    .replace(/[^\w\-]+/g, "") // bỏ ký tự không phải chữ, số, dấu -
    .replace(/\-\-+/g, "-"); // bỏ dấu - lặp lại
}

module.exports = slugify;
