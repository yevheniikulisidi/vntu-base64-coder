class Base64Coder {
  encode(text) {
    return btoa(encodeURIComponent(text));
  }

  decode(base64) {
    try {
      return decodeURIComponent(atob(base64));
    } catch {
      return null;
    }
  }

  process(action, text) {
    return action === 'encode' ? this.encode(text) : this.decode(text);
  }
}

class App {
  constructor(coder) {
    this.coder = coder;
    this.inputTextElement = document.getElementById('inputText');
    this.outputTextElement = document.getElementById('outputText');
    this.inputCharCountElement = document.getElementById('inputCharCount');
    this.copyButtonElement = document.getElementById('copyButton');
    this.init();
  }

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

  updateCharCount() {
    this.inputCharCountElement.textContent = `${this.inputTextElement.value.length} символів`;
  }

  clearText() {
    this.inputTextElement.value = '';
    this.outputTextElement.value = '';
    this.updateCharCount();
  }

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

  fallbackCopyTextToClipboard(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed'; // Avoid scrolling to bottom
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
