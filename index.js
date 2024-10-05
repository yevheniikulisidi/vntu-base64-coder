// Клас для кодування та декодування тексту в формат Base64
class Base64Coder {
  /**
   * Кодує текст в формат Base64
   * @param {string} text - текст для кодування
   * @returns {string} - закодований текст
   */
  encode(text) {
    return btoa(encodeURIComponent(text));
  }

  /**
   * Декодує текст з формату Base64
   * @param {string} base64 - закодований текст
   * @returns {string} - декодований текст
   * @returns {null} - якщо текст не може бути декодований
   */
  decode(base64) {
    try {
      return decodeURIComponent(atob(base64));
    } catch {
      return null;
    }
  }

  /**
   * Кодує або декодує текст в залежності від дії
   * @param {string} action - дія (encode або decode)
   * @param {string} text - текст для кодування або декодування
   * @returns {string} - закодований або декодований текст
   */
  process(action, text) {
    return action === 'encode' ? this.encode(text) : this.decode(text);
  }
}

// Клас для ініціалізації програми та обробки подій
class App {
  /**
   * @param {Base64Coder} coder - екземпляр класу Base64Coder
   */
  constructor(coder) {
    this.coder = coder;
    this.inputTextElement = document.getElementById('inputText');
    this.outputTextElement = document.getElementById('outputText');
    this.inputCharCountElement = document.getElementById('inputCharCount');
    this.copyButtonElement = document.getElementById('copyButton');
    this.init();
  }

  /**
   * Ініціалізує програму та додає обробники подій
   * @returns {void}
   */
  init() {
    document
      .getElementById('encodeButton')
      .addEventListener('click', () => this.updateOutput('encode'));
    document
      .getElementById('decodeButton')
      .addEventListener('click', () => this.updateOutput('decode'));
    document
      .getElementById('clearButton')
      .addEventListener('click', () => this.clearText());
    this.copyButtonElement.addEventListener('click', () =>
      this.copyToClipboard(),
    );
    this.inputTextElement.addEventListener('input', () =>
      this.updateCharCount(),
    );
  }

  /**
   * Оновлює вихідний текст в залежності від дії
   * @param {string} action - дія (encode або decode)
   * @returns {void}
   */
  updateOutput(action) {
    const inputText = this.inputTextElement.value;
    const result = this.coder.process(action, inputText);

    if (result === null) {
      this.showMessage('Невірний формат Base64', 'error');
      this.outputTextElement.value = '';
    } else {
      this.outputTextElement.value = result;
    }

    this.updateCharCount();
  }

  /**
   * Оновлює лічильник символів в текстовому полі
   * @returns {void}
   */
  updateCharCount() {
    this.inputCharCountElement.textContent = `${this.inputTextElement.value.length} символів`;
  }

  /**
   * Очищує текстові поля та оновлює лічильник символів
   * @returns {void}
   */
  clearText() {
    this.inputTextElement.value = '';
    this.outputTextElement.value = '';
    this.updateCharCount();
  }

  /**
   * Копіює результат в буфер обміну
   * @returns {void}
   */
  async copyToClipboard() {
    if (this.outputTextElement.value) {
      try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          await navigator.clipboard.writeText(this.outputTextElement.value);
        } else {
          this.fallbackCopyTextToClipboard(this.outputTextElement.value);
        }
        this.showMessage('Результат скопійовано в буфер обміну!', 'success');
      } catch (err) {
        console.error('Не вдалося скопіювати текст у буфер обміну', err);
      }
    }
  }

  /**
   * Альтернативний метод копіювання тексту в буфер обміну
   * @param {string} text - текст для копіювання
   * @returns {void}
   */
  fallbackCopyTextToClipboard(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.opacity = '0';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand('copy');
    } catch (err) {
      console.error('Fallback: Не вдалося скопіювати результат: ', err);
    }
    document.body.removeChild(textArea);
  }

  /**
   * Показує повідомлення на екрані
   * @param {string} message - текст повідомлення
   * @param {string} type - тип повідомлення (success або error)
   * @returns {void}
   * @example
   * showMessage('Текст повідомлення', 'success');
   * showMessage('Текст помилки', 'error');
   * @see showMessage
   */
  showMessage(message, type) {
    const div = document.createElement('div');
    div.textContent = message;
    div.className =
      'fixed bottom-5 left-1/2 transform -translate-x-1/2 py-2 px-4 rounded shadow-lg opacity-0 transition-opacity duration-500 ease-in-out text-sm md:text-base text-center';
    if (type === 'success') {
      div.classList.add('bg-[#8EFE99]', 'text-gray-950');
    } else if (type === 'error') {
      div.classList.add('bg-[#FF6B6B]', 'text-white');
    }
    document.body.appendChild(div);
    void div.offsetWidth;
    div.classList.add('opacity-100');
    setTimeout(() => {
      div.classList.remove('opacity-100');
      div.classList.add('opacity-0');
      setTimeout(() => {
        document.body.removeChild(div);
      }, 500);
    }, 2000);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const coder = new Base64Coder();
  const app = new App(coder);
  app.init();
});
