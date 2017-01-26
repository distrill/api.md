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

function formatDesc(lines) {
  const descLine = lines.filter(line => line.split(' ')[0] === 'desc:')[0];
  const desc = removeFirstWord(descLine);
  if (!desc) return '';
  return `${desc}\n`;
}

function formatTitle(lines) {
  const titleLine = lines.filter(line => line.split(' ')[0] === 'title:')[0];
  const title = removeFirstWord(titleLine);
  if (!title) return '';
  return `### ${title}`;
}

function formatPath(lines) {
  const pathLine = lines.filter(line => line.split(' ')[0] === 'path:')[0];
  const path = removeFirstWord(pathLine);
  if (!path) return '';
  return `\`${path}\``;
}

function formatParams(lines) {
  const paramLines = lines.filter(line => line.split(' ')[0] === 'param:');
  const params = paramLines.map(removeFirstWord);
  if (!params.length) return '';
  const paramsHeader = '| Field | Type | Description |\n| ----- | ---- | ----------- |';
  paramsContent = params.map((param) => {
    return `| ${param.split(' || ').join('|')} |`;
  });
  return [paramsHeader, ...paramsContent].join('\n');
}

function formatBlock(block) {
  const lines = block.split('\n');
  const result = [
    '---',
    formatTitle(lines),
    formatDesc(lines),
    formatPath(lines),
    formatParams(lines),
  ].join('  \n');

  console.log(result);

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