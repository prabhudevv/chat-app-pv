const socket = io();

// Elements
const $messageForm = document.querySelector('#message-form');
const $messageFormInput = $messageForm.querySelector('textarea');
const $messageFormButton = $messageForm.querySelector('button');
const $locationButton = document.querySelector('#send-location');
const $messages = document.querySelector('#messages');

// Templates
const messageTemplate = document.querySelector('#message-template').innerHTML;
const locationTemplate = document.querySelector('#location-template').innerHTML;
const sideBarTemplate = document.querySelector('#sidebar-template').innerHTML;
const notificationTemplate = document.querySelector('#notification-template').innerHTML;

// Options
const { username, room } = Qs.parse(location.search, { ignoreQueryPrefix: true });

const autoScroll = () => {
  const $newMessage = $messages.lastElementChild;
  const newMessageStyle = getComputedStyle($newMessage);
  const newMessageMargin = parseInt(newMessageStyle.marginBottom);
  const newMessageHeight = $newMessage.offsetHeight + newMessageMargin;

  const visibleHeight = $messages.offsetHeight;

  const containerHeight = $messages.scrollHeight;

  const scrollOffset = $messages.scrollTop + visibleHeight;

  if (containerHeight - newMessageHeight <= scrollOffset) {
    $messages.scrollTop = $messages.scrollHeight;
  }
}

socket.on('message', (message) => {
  const html = Mustache.render(messageTemplate, {
    username: message.username,
    message: message.text,
    createdAt: moment(message.createdAt).format('MMMM DD, YYYY h:mma'),
    alpha: message.username.charAt(0).toUpperCase(),
    name: (message.username).charAt(0).toUpperCase() + (message.username).slice(1)
  });
  $messages.insertAdjacentHTML('beforeend', html);
  autoScroll();
})

socket.on('notification', (message) => {
  const html = Mustache.render(notificationTemplate, {
    username: message.username,
    message: message.text,
    createdAt: moment(message.createdAt).format('MMMM DD, YYYY h:mma'),
    alpha: message.username.charAt(0).toUpperCase(),
    name: (message.username).charAt(0).toUpperCase() + (message.username).slice(1)
  });
  $messages.insertAdjacentHTML('beforeend', html);
  autoScroll();
})

socket.on('locationMessage', (message) => {
  const html = Mustache.render(locationTemplate, {
    username: message.username,
    url: message.url,
    createdAt: moment(message.createdAt).format('MMMM DD, YYYY h:mma'),
    alpha: message.username.charAt(0).toUpperCase(),
    name: (message.username).charAt(0).toUpperCase() + (message.username).slice(1),
    lat: message.lat,
    lon: message.lon
  });
  $messages.insertAdjacentHTML('beforeend', html);
  autoScroll();
})

socket.on('roomData', ({ room, users }) => {
  const html = Mustache.render(sideBarTemplate, {
    room,
    users,
    usersCount: users.length,
    name
  });
  document.querySelector('#nav-mobile').innerHTML = html;
})

$messageForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const message = (e.target.elements.message.value).trim();

  if (!message) {
    return alert("Enter message");
  }

  $messageFormButton.setAttribute('disabled', 'disabled');

  socket.emit('sendMessage', message, (error) => {

    $messageFormButton.removeAttribute('disabled');
    $messageFormInput.value = '';
    $messageFormInput.focus();

    if (error) {
      return console.log(error);
    }
  });
})

$locationButton.addEventListener('click', (e) => {
  e.preventDefault();

  $locationButton.setAttribute('disabled', 'disabled');

  if (!navigator.geolocation) {
    alert("Geolocation not supported for your browser");
  }

  navigator.geolocation.getCurrentPosition((position) => {
    socket.emit('sendLocation', {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude
    }, () => {
      $locationButton.removeAttribute('disabled');
    });
  })
})

socket.emit('join', { username, room }, (error) => {
  if (error) {
    alert(error);
    location.href = '/';
  }
})