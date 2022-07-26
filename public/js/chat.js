socket = io();
let idChatRoom = '';

const addMessage = (data) => {
  const divMessageUser = document.getElementById('message_user');

  divMessageUser.innerHTML += `
  <span class="user_name user_name_date">
  <img class="img_user" src="${data.user.avatar}" />
  <strong>${data.user.name}</strong>
  <span class="date"> ${dayjs(data.message.created_at).format(
    'DD/MM/YYYY HH:mm',
  )}</span></span>
  <div class="messages">
    <span class="chat_message">${data.message.text}</span>
  </div>
  `;
};

const addUser = (user) => {
  const userList = document.getElementById('users_list');
  userList.innerHTML += `<li
  class="user_name_list"
  id="user_${user._id}"
  idUser="${user._id}"
>
  <img
    class="nav_avatar"
    src="${user.avatar}"
  />
  ${user.name}
</li>`;
};

const onLoad = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const name = urlParams.get('name');
  const avatar =
    urlParams.get('avatar') ||
    'https://cdn-icons-png.flaticon.com/512/149/149071.png';
  const email = urlParams.get('email');

  document.querySelector('.user_logged').innerHTML += `
  <img
    class="avatar_user_logged"
    src=${avatar}
  />
  <strong id="user_logged">${name}</strong>
`;

  socket.emit('start', {
    email,
    name,
    avatar,
  });

  socket.on('new_users', (data) => {
    const existInDiv = document.getElementById(`user_${data._id}`);
    if (!existInDiv) {
      addUser(data);
    }
  });

  socket.emit('get_users', (users) => {
    users.forEach((user) => {
      if (user.email != email) {
        addUser(user);
      }
    });
  });

  socket.on('message', (data) => {
    if (data.message.roomId === idChatRoom) {
      addMessage(data);
    }
  });

  socket.on('notification', (data) => {
    if (data.roomId !== idChatRoom) {
      const user = document.getElementById(`user_${data.from._id}`);
      user.insertAdjacentHTML(
        'afterbegin',
        `
          <div class="notification"</div>
        `,
      );
    }
  });
};

document.getElementById('users_list').addEventListener('click', (event) => {
  const inputMessage = document.getElementById('user_message');
  inputMessage.classList.remove('hidden');

  document
    .querySelectorAll('li.user_name_list')
    .forEach((item) => item.classList.remove('user_in_focus'));

  document.getElementById('message_user').innerHTML = '';
  if (event.target && event.target.matches('li.user_name_list')) {
    const idUser = event.target.getAttribute('idUser');

    event.target.classList.add('user_in_focus');
    const notification = document.querySelector(
      `#user_${idUser} .notification`,
    );

    if (notification) {
      notification.remove();
    }

    socket.emit('start_chat', { idUser }, (response) => {
      idChatRoom = response.room.idChatRoom;

      response.messages?.forEach((message) => {
        const data = {
          message,
          user: message.to,
        };
        addMessage(data);
      });
    });
  }
});

document
  .getElementById('user_message')
  .addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
      const message = event.target.value;
      event.target.value = '';

      const data = {
        message,
        idChatRoom,
      };

      if (idChatRoom) {
        socket.emit('message', data);
      }
    }
  });

onLoad();
