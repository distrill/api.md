function selectText() {
  const node = document.getElementById('formatted-output');
  if (document.selection) {
    const range = document.body.createTextRange();
    range.moveToElementText(node);
    range.select();
  } else if (window.getSelection) {
    const range = document.createRange();
    range.selectNodeContents(node);
    window.getSelection().removeAllRanges();
    window.getSelection().addRange(range);
  }
}

function removeFirstWord(string) {
  if (!string) return '';
  return string
    .split(' ')
    .slice(1)
    .join(' ');
}

class Lines {
  constructor(content) {
    this.content = content;
  }

  _find(match) {
    return this.content.filter(e => e.split(' ')[0] === match);
  }

  _format(match, mutate) {
    const line = this._find(match)[0];
    if (line && line.length) return mutate(removeFirstWord(line));
    return '';
  }

  formatDesc() {
    return this._format('desc:', (e) => `${e}\n`);
  }

  formatTitle() {
    return this._format('title:', (e) => `### ${e}`);
  }

  formatPath() {
    return this._format('path:', (e) => `\`${e}\``);
  }
  
  formatParams(sep = '||') {
    const params = this._find('param:').map(removeFirstWord);
    const header = '| Field | Type | Description |\n| ----- | ---- | ----------- |';
    if (!params.length) return '';
    const content = params.map((param) => {
      return `| ${param.split(sep).join('|')} |`;
    });
    return [header, ...content].join('\n');
  }
}

function formatBlock(block) {
  const lines = new Lines(block.split('\n'));
  const result = [
    '---',
    lines.formatTitle(),
    lines.formatDesc(),
    lines.formatPath(),
    lines.formatParams(),
  ].join('  \n');

  return result;
}

function format() {
  const input = document.getElementById('user-text-input');
  const output = document.getElementById('formatted-output');

  const blocks = input.value.split('\n\n');

  const results = blocks.map(formatBlock).join('\n\n');

  output.innerHTML = results;
  return false;
}