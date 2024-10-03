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
    this.init();
  }

  init() {
    document
      .getElementById('encodeButton')
      .addEventListener('click', () => this.updateOutput('encode'));
    document
      .getElementById('decodeButton')
      .addEventListener('click', () => this.updateOutput('decode'));
    this.outputTextElement.addEventListener('click', () =>
      this.copyToClipboard(),
    );
  }

  updateOutput(action) {
    const inputText = this.inputTextElement.value;
    this.outputTextElement.value = this.coder.process(action, inputText);
  }

  async copyToClipboard() {
    if (this.outputTextElement.value) {
      try {
        await navigator.clipboard.writeText(this.outputTextElement.value);
        alert('Результат скопійовано в буфер обміну!');
      } catch (err) {
        console.error('Не вдалося скопіювати результат: ', err);
      }
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const coder = new Base64Coder();
  new App(coder);
});
