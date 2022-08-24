const generateMessage = (username, text, alpha) => {
  debugger;
  return {
    username,
    text,
    createdAt: new Date().getTime(),
    alpha
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

const generateLocationMessage = (username, url, lat, lon, alpha) => {
  return {
    username,
    url,
    createdAt: new Date().getTime(),
    lat,
    lon,
    alpha
  }
}

module.exports = {
  generateMessage,
  generateLocationMessage,
  generateNotification
}