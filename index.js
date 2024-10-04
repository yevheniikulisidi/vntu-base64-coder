class Base64Coder {
  encode(text) {
    return btoa(encodeURIComponent(text));
  }

  decode(base64) {
    try {
      return decodeURIComponent(atob(base64));
    } catch {
      return 'Невірний формат Base64';
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
    this.helpTextElement = document.getElementById('helpText');
    this.inputCharCountElement = document.getElementById('inputCharCount');
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
    this.outputTextElement.addEventListener('click', () =>
      this.copyToClipboard(),
    );
    this.inputTextElement.addEventListener('input', () =>
      this.updateCharCount(),
    );
  }

  updateOutput(action) {
    const inputText = this.inputTextElement.value;
    const result = this.coder.process(action, inputText);
    this.outputTextElement.value = result;
    this.updateCharCount();

    if (inputText.trim() === '' || result === 'Невірний формат Base64') {
      this.helpTextElement.classList.add('hidden');
    } else {
      this.helpTextElement.classList.remove('hidden');
    }

    this.outputTextElement.classList.toggle(
      'text-red-500',
      result === 'Невірний формат Base64',
    );
  }

  updateCharCount() {
    this.inputCharCountElement.textContent = `${this.inputTextElement.value.length} символів`;
  }

  clearText() {
    this.inputTextElement.value = '';
    this.outputTextElement.value = '';
    this.helpTextElement.classList.add('hidden');
    this.updateCharCount();
  }

  async copyToClipboard() {
    if (
      this.outputTextElement.value &&
      this.outputTextElement.value !== 'Невірний формат Base64'
    ) {
      try {
        await navigator.clipboard.writeText(this.outputTextElement.value);
        this.showCopyConfirmation();
      } catch (err) {
        console.error('Не вдалося скопіювати результат: ', err);
      }
    }
  }

  showCopyConfirmation() {
    const confirmation = document.createElement('div');
    confirmation.textContent = 'Результат скопійовано в буфер обміну!';
    confirmation.className =
      'fixed bottom-5 left-1/2 transform -translate-x-1/2 bg-[#8EFE99] text-gray-950 py-2 px-4 rounded shadow-lg opacity-0 transition-opacity duration-500 ease-in-out text-sm md:text-base';
    document.body.appendChild(confirmation);
    void confirmation.offsetWidth;
    confirmation.classList.add('opacity-100');
    setTimeout(() => {
      confirmation.classList.remove('opacity-100');
      confirmation.classList.add('opacity-0');
      setTimeout(() => {
        document.body.removeChild(confirmation);
      }, 500);
    }, 2000);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const coder = new Base64Coder();
  new App(coder);
});
