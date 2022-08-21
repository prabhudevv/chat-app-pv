const generateMessage = (username, text) => {
  debugger;
  return {
    username,
    text,
    createdAt: new Date().getTime()
  }
}

const generateNotification = (username, text) => {
  debugger;
  return {
    username,
    text,
    createdAt: new Date().getTime()
  }
}

const generateLocationMessage = (username, url, lat, lon) => {
  return {
    username,
    url,
    createdAt: new Date().getTime(),
    lat,
    lon
  }
}

module.exports = {
  generateMessage,
  generateLocationMessage,
  generateNotification
}