//  CONSTANTS
const MY_USERNAME = 'edmancota';
const ENDPOINT = 'https://chat.arpanetos.lol/messages';
// const ENDPOINT = 'http://127.0.0.1:3009/messages';
let messageToSend = '';

let theme = localStorage.getItem('theme');
console.log('theme: ', theme);

if (theme === null) {
  theme = 'dark';
}

console.log('theem: ', theme);

// Descargamos todos los mensajes ya creados de la base de datos
async function getMessages() {
  let messages = [];

  const response = await fetch(ENDPOINT);
  messages = await response.json();
  messages = messages.reverse();
  console.log('messages: ', messages);

  // Variables
  const darkSidebar = '#202229';
  const lightSidebar = '#ffffff';
  const darkChats = '#131416';
  const lightChats = '#FBFBFC';

  const sidebarBackground = theme === 'light' ? lightSidebar : darkSidebar;
  const navbarBackground = theme === 'light' ? lightSidebar : darkSidebar;
  const chatsBackground = theme === 'light' ? lightChats : darkChats;

  document.body.style.margin = 0;
  document.body.style.padding = 0;
  document.body.style.fontFamily = 'Arial';
  document.body.style.boxSizing = 'border-box';

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
  navbar.style.borderLeft = `2px solid ${darkChats}`;
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
  chatLogo.src =
    'https://theme.zdassets.com/theme_assets/888863/c31e9da5d235464dde8789d620c315f13469c8bc.svg';
  chatLogo.width = 30;
  chatLogo.height = 30;

  avatar.appendChild(chatLogo);

  let chatName = document.createElement('div');
  chatName.innerText = 'Arpanetos Chat';
  chatName.style.color = '#ffffff';

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
    username.style.color = '#ffffff';

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

  // Contenedor donde se escriben los mensajes
  let chatsFooter = document.createElement('div');
  chatsFooter.style.height = '60px';
  chatsFooter.style.width = '100%';
  chatsFooter.style.display = 'flex';
  chatsFooter.style.borderLeft = `2px solid ${darkChats}`;
  chatsFooter.style.backgroundColor = sidebarBackground;

  // Input para escribir los chats
  let chatInput = document.createElement('input');
  chatInput.type = 'text';
  chatInput.style.height = '40px';
  chatInput.style.width = '90%';
  chatInput.style.backgroundColor = darkChats;
  chatInput.style.borderRadius = '20px';
  chatInput.style.border = 'none';
  chatInput.style.outline = 'none';
  chatInput.style.margin = 'auto';
  chatInput.style.color = 'white';
  chatInput.maxLength = 140;
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

  chatsFooter.appendChild(chatInput);

  // Añadirmos el chatsContent  al chatsContainer
  chatsContainer.appendChild(chatsContent);
  chatsContainer.appendChild(chatsFooter);

  // Añadirmos el chatsContainer  al content
  content.appendChild(chatsContainer);

  // Añadirmos el sidebar al contenedor principal
  main.appendChild(sidebar);

  // Añadirmos el content al contenedor principal
  main.appendChild(content);

  document.body.prepend(main);

  // Movemos el scroll hasta abajo del fondo de la pantalla
  chatsContent.scrollTop = chatsContent.scrollHeight;
}

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
  await fetch(ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username: MY_USERNAME, message: messageToSend }),
  });

  let chatsContent = document.getElementById('chatsContent');
  chatsContent.scrollTop = chatsContent.scrollHeight;

  // Si todo se guardo correctamente refrescamos la pantalla con los nuevos mensajes
  // getMessages();
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
  console.log('currentTheme: ', currentTheme);
  localStorage.setItem('theme', currentTheme);

  // Refresh the page
  location.reload();
};

// setInterval(getMessages, 5000);
