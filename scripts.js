document.addEventListener('DOMContentLoaded', function() {
  const postForm = document.querySelector('.post-form');
  const postTitle = document.querySelector('#postTitle');
  const postContent = document.querySelector('#postContent');
  const postAudio = document.querySelector('#postAudio');
  const postButton = document.querySelector('#publishButton');
  const postsContainer = document.querySelector('#postsContainer');
  const searchInput = document.querySelector('#searchInput');
  const searchButton = document.querySelector('#searchButton');

  // Функція для створення нового допису
  function createPost(title, content, audioFile, date) {
    const postElement = document.createElement('div');
    postElement.classList.add('post');

    const postTitleElement = document.createElement('h2');
    postTitleElement.textContent = title;

    const postContentElement = document.createElement('p');
    postContentElement.textContent = content;

    // Створення аудіоплеєра, якщо є аудіофайл
    let audioPlayer;
    if (audioFile) {
      audioPlayer = document.createElement('audio');
      audioPlayer.controls = true;
      const audioSource = document.createElement('source');
      audioSource.src = URL.createObjectURL(audioFile);
      audioSource.type = 'audio/mpeg';
      audioPlayer.appendChild(audioSource);
    }

    // Додавання дати опублікування
    const dateElement = document.createElement('p');
    dateElement.classList.add('post-date');
    dateElement.textContent = `Опубліковано: ${date}`;

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Видалити';
    deleteButton.onclick = function() {
      postsContainer.removeChild(postElement);
      savePosts();
    };

    postElement.appendChild(postTitleElement);
    postElement.appendChild(postContentElement);
    if (audioPlayer) {
      postElement.appendChild(audioPlayer);
    }
    postElement.appendChild(dateElement);
    postElement.appendChild(deleteButton);

    postsContainer.appendChild(postElement);
  }

  // Функція для збереження дописів
  function savePosts() {
    const posts = [];
    document.querySelectorAll('.post').forEach(postElement => {
      const title = postElement.querySelector('h2').textContent;
      const content = postElement.querySelector('p').textContent;
      const audioSrc = postElement.querySelector('audio') ? postElement.querySelector('source').src : null;
      const dateText = postElement.querySelector('.post-date').textContent.replace('Опубліковано: ', '');

      posts.push({ title, content, audio: audioSrc, date: dateText });
    });
    localStorage.setItem('posts', JSON.stringify(posts));
  }

  // Функція для завантаження дописів
  function loadPosts() {
    const posts = JSON.parse(localStorage.getItem('posts')) || [];
    posts.forEach(post => {
      // Перетворення URL аудіофайлу назад у Blob для створення аудіоплеєра
      fetch(post.audio)
        .then(response => response.blob())
        .then(blob => createPost(post.title, post.content, blob, post.date));
    });
  }

  // Обробник події для кнопки "Опублікувати"
  postButton.addEventListener('click', function() {
    const title = postTitle.value.trim();
    const content = postContent.value.trim();
    const audio = postAudio.files[0];
    const currentDate = new Date();

    if(title && content) {
      createPost(title, content, audio, currentDate.toLocaleDateString('uk-UA'));
      savePosts();
      postTitle.value = '';
      postContent.value = '';
      postAudio.value = '';
    } else {
      alert('Будь ласка, заповніть всі поля!');
    }
  });

  // Функція для пошуку дописів
  searchButton.addEventListener('click', function() {
    const filter = searchInput.value.toUpperCase();
    const posts = postsContainer.getElementsByClassName('post');

    for (let i = 0; i < posts.length; i++) {
      const title = posts[i].getElementsByTagName('h2')[0];
      if (title) {
        const txtValue = title.textContent || title.innerText;
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
          posts[i].style.display = '';
        } else {
          posts[i].style.display = 'none';
        }
      }
    }
  });

  // Завантаження дописів при завантаженні сторінки
  loadPosts();
});
