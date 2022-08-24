let baseUrl = window.location.href;
let originUrl = window.location.origin + "/";

if (baseUrl !== originUrl) {
  let roomId = baseUrl.substring(baseUrl.lastIndexOf('=') + 1);
  $('#room-id').val(roomId);
} else {
  $('#room-id').val(Math.floor(100000 + Math.random() * 900000));
}
