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

document.addEventListener('DOMContentLoaded', () => {
  const coder = new Base64Coder();

  const inputTextElement = document.getElementById('inputText');
  const outputTextElement = document.getElementById('outputText');

  const updateOutput = (action) => {
    const inputText = inputTextElement.value;
    outputTextElement.value = coder.process(action, inputText);
  };

  document
    .getElementById('encodeButton')
    .addEventListener('click', () => updateOutput('encode'));
  document
    .getElementById('decodeButton')
    .addEventListener('click', () => updateOutput('decode'));

  outputTextElement.addEventListener('click', async () => {
    if (outputTextElement.value) {
      try {
        await navigator.clipboard.writeText(outputTextElement.value);
        alert('Результат скопійовано в буфер обміну!');
      } catch (err) {
        console.error('Не вдалося скопіювати результат: ', err);
      }
    }
  });
});
