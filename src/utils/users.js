const users = [];

const addUser = ({ id, username, room }) => {
  debugger;
  username = username.trim().toLowerCase();
  room = room.trim().toLowerCase();
  name = (username.trim()).charAt(0).toUpperCase() + (username.trim()).slice(1);

  if (!username || !room) {
    return {
      error: 'Username and room are required'
    }
  }

  const existingUser = users.find((data) => {
    return data.room === room && data.username === username;
  })

  if (existingUser) {
    return {
      error: 'Username is already in use'
    }
  }

  const user = { id, username, room, name };
  users.push(user);
  return { user }
}

const removeUser = (id) => {
  const index = users.findIndex((user) => user.id === id);

  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
}

const getUser = (id) => {
  return users.find((user) => user.id === id)
}

const getUsersInRoom = (room) => {
  room = room.trim().toLowerCase();
  return users.filter((user) => user.room === room)
}

module.exports = {
  addUser,
  removeUser,
  getUser,
  getUsersInRoom
}