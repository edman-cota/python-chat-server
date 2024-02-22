//  CONSTANTS
const MY_USERNAME = 'labs';
const ENDPOINT = 'https://chat.arpanetos.lol/messages';
// const ENDPOINT = 'http://127.0.0.1:3009/messages';
let messageToSend = '';

let theme = localStorage.getItem('theme');

if (theme === null) theme = 'light';

// Variables
const darkSidebar = '#202229';
const lightSidebar = '#ffffff';
const darkChats = '#131416';
const lightChats = '#FBFBFC';
const lightFontColor = '#000000';
const darkFontColor = '#ffffff';

const sidebarBackground = theme === 'light' ? lightSidebar : darkSidebar;
const navbarBackground = theme === 'light' ? lightSidebar : darkSidebar;
const chatsBackground = theme === 'light' ? lightChats : darkChats;
const fontColor = theme === 'light' ? lightFontColor : darkFontColor;

document.body.style.margin = 0;
document.body.style.padding = 0;
document.body.style.fontFamily = 'Arial';
document.body.style.boxSizing = 'border-box';
document.body.style.scrollbarColor = 'red';
document.body.style.MozScrollbarColor = 'red';

// Change the scrollbar thumb track background
let scrollbar = document.documentElement;
scrollbar.style.scrollbarColor = 'red';

// Main container
let main = document.createElement('main');
main.style.backgroundColor = 'red';
main.style.height = '100vh';
main.style.display = 'flex';
main.style.overflow = 'hidden';

// LEFT SIDEBAR
let sidebar = document.createElement('div');
sidebar.style.backgroundColor = sidebarBackground;
sidebar.style.height = '100vh';
sidebar.style.width = '300px';

// SIDEBAR HEADER
let sidebarHeader = document.createElement('div');
sidebarHeader.style.height = '100px';
sidebarHeader.style.width = '100%';
sidebarHeader.style.display = 'flex';
sidebarHeader.style.justifyContent = 'center';
sidebarHeader.style.alignItems = 'center';
sidebarHeader.style.color = fontColor;
sidebarHeader.innerText = 'Mensajes';

sidebar.appendChild(sidebarHeader);

// SIDEBAR CONTENT
let sidebarContent = document.createElement('div');
sidebarContent.style.height = 'calc(100% - 100px)';
sidebarContent.style.display = 'flex';
sidebarContent.style.flexDirection = 'column';
sidebarContent.style.gap = '10px';
sidebarContent.style.overflowY = 'auto';

sidebar.appendChild(sidebarContent);

// CONTENT
let content = document.createElement('div');
content.style.display = 'flex';
content.style.flexDirection = 'column';
content.style.height = '100vh';
content.style.width = 'calc(100% - 300px)';

// NAVBAR
let navbar = document.createElement('div');
navbar.style.height = '100px';
navbar.style.width = '100%';
navbar.style.display = 'flex';
navbar.style.alignItems = 'center';
// navbar.style.justifyContent = 'space-between';
navbar.style.padding = '0px 16px';
navbar.style.borderLeft = `2px solid ${chatsBackground}`;
navbar.style.backgroundColor = sidebarBackground;

let chatLogoWrapper = document.createElement('div');
chatLogoWrapper.style.display = 'flex';
chatLogoWrapper.style.height = '100%';
chatLogoWrapper.style.width = '200px';
chatLogoWrapper.style.gap = '10px';
chatLogoWrapper.style.alignItems = 'center';

let avatar = document.createElement('div');
avatar.style.height = '50px';
avatar.style.width = '50px';
avatar.style.backgroundColor = 'orange';
avatar.style.borderRadius = '50%';
avatar.style.display = 'flex';
avatar.style.alignItems = 'center';
avatar.style.justifyContent = 'center';

let chatLogo = document.createElement('img');
chatLogo.src = 'https://theme.zdassets.com/theme_assets/888863/c31e9da5d235464dde8789d620c315f13469c8bc.svg';
chatLogo.width = 30;
chatLogo.height = 30;

avatar.appendChild(chatLogo);

let chatName = document.createElement('div');
chatName.innerText = 'Arpanetos Chat';
chatName.style.color = fontColor;

let themeMode = document.createElement('button');
themeMode.innerText = theme === 'light' ? '🌚' : '🔆';
themeMode.style.cursor = 'pointer';
themeMode.title = theme === 'light' ? 'Cambiar a dark mode' : 'Cambiar a light mode';
themeMode.style.backgroundColor = 'transparent';
themeMode.style.border = 'none';
themeMode.onclick = function () {
  handleThemeChange(theme === 'light' ? 'dark' : 'light');
};

chatLogoWrapper.appendChild(avatar);
chatLogoWrapper.appendChild(chatName);
navbar.appendChild(chatLogoWrapper);
navbar.appendChild(themeMode);

// Añadirmos el navbar  al content
content.appendChild(navbar);

let chatsContainer = document.createElement('div');
chatsContainer.style.width = '100%';
chatsContainer.style.height = 'calc(100% - 100px)';
chatsContainer.style.display = 'flex';
chatsContainer.style.flexDirection = 'column';
chatsContainer.style.backgroundColor = chatsBackground;

// Descargamos todos los mensajes ya creados de la base de datos
// Primero inicializamos el chatsContent
// Contenedor donde se muestran los mensajes
let chatsContent = document.createElement('div');
chatsContent.id = 'chatsContent';
chatsContent.style.width = '100%';
chatsContent.style.height = 'calc(100% - 60px)';
chatsContent.style.display = 'flex';
chatsContent.style.flexDirection = 'column';
chatsContent.style.padding = '20px';
chatsContent.style.boxSizing = 'border-box';
chatsContent.style.overflowY = 'auto';
chatsContent.style.overflowX = 'hidden';

chatsContainer.appendChild(chatsContent);

async function getMessages() {
  let messages = [];

  const response = await fetch(ENDPOINT);
  messages = await response.json();
  messages = messages.reverse();

  messages.forEach((item) => {
    // El contenedor del mensaje
    let messageWrapper = document.createElement('div');
    // messageWrapper.style.maxWidth = '50%';
    messageWrapper.style.width = 'fit-content';
    messageWrapper.style.display = 'flex';
    messageWrapper.style.flexDirection = 'column';
    messageWrapper.style.padding = '0px 16px';
    messageWrapper.style.marginTop = '10px';
    messageWrapper.style.alignSelf = getMessageStyle(item).alignSelf;

    let messageHeader = document.createElement('div');
    messageHeader.style.display = 'flex';
    messageHeader.style.gap = '10px';
    messageHeader.style.justifyContent = 'flex-end';

    // Elemento donde se muesta la hora del mensaje
    let time = document.createElement('p');
    time.innerText = obtenerHoraFormateada(new Date(item.created_at));
    time.style.margin = '0px';
    time.style.fontSize = '14px';
    time.style.color = '#bab5b5';

    let username = document.createElement('p');
    username.innerText = item.username === MY_USERNAME ? 'Yo' : item.username;
    username.style.margin = '0px';
    username.style.color = fontColor;

    messageHeader.appendChild(time);
    messageHeader.appendChild(username);

    let messageBubble = document.createElement('div');
    messageBubble.style.width = 'fit-content';
    messageBubble.style.color = 'white';
    messageBubble.style.display = 'flex';
    messageBubble.style.flexDirection = 'column';
    messageBubble.style.justifyContent = 'center';
    messageBubble.style.minHeight = '40px';
    messageBubble.style.alignItems = 'center';
    messageBubble.style.padding = '0px 16px';
    messageBubble.style.backgroundColor = getMessageStyle(item).backgroundColor;
    messageBubble.style.borderRadius = getMessageStyle(item).borderRadius;

    let result = isLink(item.message);
    if (result !== null) {
      const images = filtrarEnlacesImagenes(result);
      images.map((url) => {
        let imageWrapper = document.createElement('div');
        imageWrapper.style.display = 'flex';
        imageWrapper.style.width = '100%';
        imageWrapper.style.maxWidth = '100%';
        imageWrapper.style.flexDirection = 'column';

        let image = document.createElement('img');
        image.src = url;
        image.width = 60;
        image.height = 60;
        image.alt = 'Imagen';

        let link = document.createElement('a');
        link.href = url;
        link.innerText = url;

        imageWrapper.appendChild(image);
        imageWrapper.appendChild(link);

        messageBubble.appendChild(imageWrapper);
      });
    } else {
      // Si no tiene imagen en el mensaje
      let message = document.createElement('p');
      message.innerText = item.message;
      message.style.margin = '0px';

      messageBubble.appendChild(message);
    }

    messageWrapper.appendChild(messageHeader);
    messageWrapper.appendChild(messageBubble);

    chatsContent.appendChild(messageWrapper);
  });

  chatsContent.scrollTop = chatsContent.scrollHeight;

  // Ahora mostramos el ultimo mensaje de cada usuario en el sidebar

  // Objeto para almacenar mensajes resumidos por usuario
  const uniqueUser = {};

  // Iterar sobre la lista de mensajes
  messages.forEach((mensaje) => {
    // Si el usuario ya existe en el objeto de mensajes resumidos
    if (uniqueUser.hasOwnProperty(mensaje.username)) {
      // Obtener la fecha del mensaje actual y la fecha del mensaje resumido
      const currentDate = new Date(mensaje.created_at);
      const uniqueDate = new Date(uniqueUser[mensaje.username].created_at);

      // Si el mensaje actual es más reciente que el mensaje resumido, actualizar el mensaje resumido
      if (currentDate > uniqueDate) {
        uniqueUser[mensaje.username] = {
          id: mensaje.id,
          username: mensaje.username,
          message: mensaje.message,
          created_at: mensaje.created_at,
        };
      }
    } else {
      // Si el usuario no existe en el objeto de mensajes resumidos, agregar el mensaje actual
      uniqueUser[mensaje.username] = {
        id: mensaje.id,
        username: mensaje.username,
        message: mensaje.message,
        created_at: mensaje.created_at,
      };
    }
  });

  for (key in uniqueUser) {
    let user = document.createElement('div');
    user.style.width = '100%';
    user.style.height = '40px';
    user.style.display = 'flex';
    user.style.gap = '10px';
    user.style.color = fontColor;

    let userAvatar = document.createElement('div');
    userAvatar.style.height = '40px';
    userAvatar.style.width = '40px';
    userAvatar.style.minWidth = '40px';
    userAvatar.style.minHeight = '40px';
    userAvatar.style.backgroundColor = 'orange';
    userAvatar.style.borderRadius = '50%';
    userAvatar.style.display = 'flex';
    userAvatar.style.alignItems = 'center';
    userAvatar.style.justifyContent = 'center';

    let chatLogo = document.createElement('img');
    chatLogo.src =
      'https://theme.zdassets.com/theme_assets/888863/c31e9da5d235464dde8789d620c315f13469c8bc.svg';
    chatLogo.width = 20;
    chatLogo.height = 20;

    let userWrapper = document.createElement('div');
    userWrapper.style.display = 'flex';
    userWrapper.style.flexDirection = 'column';
    userWrapper.style.height = '100%';
    userWrapper.style.justifyContent = 'center';

    let userName = document.createElement('p');
    userName.innerText = uniqueUser[key].username;
    userName.style.margin = '0px';

    let userLastMessage = document.createElement('p');
    userLastMessage.innerText = uniqueUser[key].message.slice(0, 30);
    userLastMessage.style.color = 'gray';
    userLastMessage.style.margin = '0px';
    userLastMessage.style.fontSize = '13px';

    userWrapper.appendChild(userName);
    userWrapper.appendChild(userLastMessage);

    userAvatar.appendChild(chatLogo);

    user.appendChild(userAvatar);
    user.appendChild(userWrapper);

    sidebarContent.appendChild(user);
  }
}

// Contenedor donde se escriben los mensajes
let chatsFooter = document.createElement('div');
chatsFooter.style.height = '60px';
chatsFooter.style.width = '100%';
chatsFooter.style.padding = '0px 10px';
chatsFooter.style.display = 'flex';
chatsFooter.style.display = 'flex';
chatsFooter.style.borderLeft = `2px solid ${chatsBackground}`;
chatsFooter.style.backgroundColor = sidebarBackground;

// Input para escribir los chats
let chatInput = document.createElement('input');
chatInput.type = 'text';
chatInput.style.height = '40px';
chatInput.style.width = '90%';
chatInput.style.backgroundColor = chatsBackground;
chatInput.style.borderRadius = '20px';
chatInput.style.border = 'none';
chatInput.style.outline = 'none';
chatInput.style.margin = 'auto';
chatInput.style.color = 'white';
chatInput.maxLength = 140;
chatInput.style.color = fontColor;
chatInput.style.padding = '0px 16px';

// Escuchamos por texto ingresado al input
chatInput.addEventListener('input', (event) => {
  messageToSend = event.target.value;
});

chatInput.addEventListener('keyup', (event) => {
  if (event.code === 'Enter') {
    sendMessage(messageToSend);

    // Limpiamos el input despues de enviar el mensaje para poder escribit otro nuevo
    messageToSend = '';
    chatInput.value = '';
  }
});

// Send button
let sendButton = document.createElement('button');
sendButton.innerText = 'Enviar';
sendButton.style.height = '40px';
sendButton.style.margin = 'auto';
sendButton.style.color = '#ffffff';
sendButton.style.borderRadius = '4px';
sendButton.style.border = 'none';
sendButton.style.width = '120px';
sendButton.style.backgroundColor = '#299CF2';
sendButton.onclick = function () {
  sendMessage(messageToSend);
};

chatsFooter.appendChild(chatInput);
chatsFooter.appendChild(sendButton);

// Añadirmos el chatsFooter  al chatsContainer
chatsContainer.appendChild(chatsFooter);

// Añadirmos el chatsContainer  al content
content.appendChild(chatsContainer);

// Añadirmos el sidebar al contenedor principal
main.appendChild(sidebar);

// Añadirmos el content al contenedor principal
main.appendChild(content);

document.body.prepend(main);
getMessages();

/// UTIL FUNCTIONS
const getMessageStyle = (message) => {
  // Si el mensaje fue enviado por el usuario actual
  if (message.username === MY_USERNAME) {
    return {
      backgroundColor: '#299CF2',
      borderRadius: '4px 0px 4px 4px',
      alignSelf: 'flex-end',
    };
  }
  return {
    backgroundColor: '#202328',
    borderRadius: '0px 4px 4px 4px',
    alignSelf: 'flex-start',
  };
};

const sendMessage = async (messageToSend) => {
  if (messageToSend !== '') {
    await fetch(ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username: MY_USERNAME, message: messageToSend }),
    });

    let chatsContent = document.getElementById('chatsContent');
    chatsContent.scrollTop = chatsContent.scrollHeight;

    messageToSend = '';
    chatInput.value = '';

    getMessages();
  }
  return null;
};

const isLink = (texto) => {
  // Expresión regular para encontrar enlaces
  var regex = /(https?:\/\/[^\s]+)/g;

  // Buscar enlaces en el texto usando la expresión regular
  var enlaces = texto.match(regex);

  // Devolver la lista de enlaces encontrados
  return enlaces;
};

function filtrarEnlacesImagenes(listaEnlaces) {
  // Expresión regular para comprobar si el enlace termina con una extensión de imagen
  var expresionRegularImagen = /\.(png|svg|jpg|jpeg|gif)$/i;

  // Filtrar la lista de enlaces
  var enlacesImagenes = listaEnlaces.filter(function (enlace) {
    return expresionRegularImagen.test(enlace);
  });

  return enlacesImagenes;
}

function obtenerHoraFormateada(fecha) {
  var horas = fecha.getHours();
  var minutos = fecha.getMinutes();
  var ampm = horas >= 12 ? 'PM' : 'AM';
  horas = horas % 12;
  horas = horas ? horas : 12; // Si horas es 0, entonces es medianoche (12 AM)
  minutos = minutos < 10 ? '0' + minutos : minutos;
  var horaFormateada = horas + ':' + minutos + ' ' + ampm;
  return horaFormateada;
}

const handleThemeChange = (currentTheme) => {
  localStorage.setItem('theme', currentTheme);

  // Refresh the page
  location.reload();
};

setInterval(getMessages, 5000);
