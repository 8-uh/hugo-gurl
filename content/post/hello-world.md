+++
date = "2017-04-25T23:48:11-05:00"
draft = false
title = "hello, world!"
description = "Just making sure I've set everything up correctly."
+++

I'm back!

And just trying to get my code highlighting done properly...

```javascript

import remark from 'remark'
import html from 'remark-html'
import visit from 'unist-util-visit'
import u from 'unist-builder'
import jetpack from 'fs-jetpack'
import debug from 'debug'
import fmt from 'fmt-obj'
import {truncValues, none} from './utils'
import reporter from 'vfile-reporter'
import CodeStore from './CodeStore'
import LoveNotes from './LoveNotes'


const fs = jetpack

const log = debug('love-notes:log')
const err = debug('love-notes:err')


function process(fptr) {
  log('fptr:', fptr)

  const contents = fs.read(fptr)
  const store = new CodeStore()
  const ast = remark().parse(contents)

  visit(ast, 'code', node => {
    node.data = node.data || {}
    if(none(node.data.process) || !!node.data.process) {
      // that's some bad ~hat~ side-effect, harry :\
      node = store.addNode(node)
    }
  })
  log('virtual files created:', store.codefiles.length)
  return store
}

function create(files, outdir) {
  log('files:\n%O', files)
  const pen = fs.cwd(outdir)
  files.forEach(file => {
    pen.write(file.name, file.source)
  })
  log('files created:\n%O', pen.list().map(f => `${pen.cwd()}/${f}`))
}

function tangle(fptr, outdir = './docs') {
  log('outdir:', outdir)
  const store = process(fptr)

  const filenames = store.filenames
  log('filenames: %O', filenames)
  const files = filenames.map(file => {
    return {source: store.generateSource(file), name: file}
  })
  create(files, outdir)
  return files
}

function weave(fptr, outdir = `./docs`, optr) {

  const contents = fs.read(fptr)
  const filename = optr || /\/?(\S+)\.\S+$/.exec(fptr)[1] + '.html'
  remark().use(weaver).use(html).process(contents, function (err, file) {
    const pen = fs.cwd(outdir)
    pen.write(filename, file.contents)
    log(`created file ${pen.cwd()}/${filename}`)
  });
}

function weaver() {

  function transformer(ast, file) {
    var insertions = []

    visit(ast,'code', (node, index, parent) => {
      const {lang} = node
      const dq = node.data || {}
      const cmdstr = lang.split(' ')
      if(cmdstr.length >= 2 && cmdstr[1] === '<3') {
        node.lang = cmdstr[0]
        dq.process = false
        let htmlsrc = node.value
        if(node.lang === 'js') {
          htmlsrc = `<script>${node.value}</script>`
        }
        const htmlNode = u('html', {value: htmlsrc})
        insertions.push({node, index, parent, htmlNode})
      }
      node.data = data
    })
    insertions.forEach((insert, idx) => {
      insert.parent.children.splice(insert.index + (idx+1), 0, insert.htmlNode)
    })
  }

  return transformer
}

export default { tangle, process, weave, create }
```

```html
<!DOCTYPE html>
<html>
<body>

<img src="w3schools.jpg" alt="W3Schools.com" width="104" height="142">

</body>
</html>
```

```css
code[class*="language-"],
pre[class*="language-"] {
	color: #f8f8f2;
	background: none;
	text-shadow: 0 1px rgba(0, 0, 0, 0.3);
	font-family: Consolas, Monaco, 'Andale Mono', 'Ubuntu Mono', monospace;
	text-align: left;
	white-space: pre;
	word-spacing: normal;
	word-break: normal;
	word-wrap: normal;
	line-height: 1.5;

	-moz-tab-size: 4;
	-o-tab-size: 4;
	tab-size: 4;

	-webkit-hyphens: none;
	-moz-hyphens: none;
	-ms-hyphens: none;
	hyphens: none;
}

/* Code blocks */
pre[class*="language-"] {
	padding: 1em;
	margin: .5em 0;
	overflow: auto;
	border-radius: 0.3em;
}

:not(pre) > code[class*="language-"],
pre[class*="language-"] {
	background: #3B4251;
}

/* Inline code */
:not(pre) > code[class*="language-"] {
	padding: .1em;
	border-radius: .3em;
	white-space: normal;
}

.token.comment,
.token.prolog,
.token.doctype,
.token.cdata {
	color: #4C5669;
}

.token.punctuation {
	color: #D8DEE9;
}

.namespace {
	opacity: .7;
}

.token.property,
.token.tag,
.token.constant,
.token.symbol,
.token.deleted {
	color: #f92672;
}

.token.boolean,
.token.number {
	color: #ae81ff;
}

.token.selector,
.token.attr-name,
.token.string,
.token.char,
.token.builtin,
.token.inserted {
	color: #a6e22e;
}

.token.operator,
.token.entity,
.token.url,
.language-css .token.string,
.style .token.string,
.token.variable {
	color: #f8f8f2;
}

.token.atrule,
.token.attr-value,
.token.function {
	color: #e6db74;
}

.token.keyword {
	color: #66d9ef;
}

.token.regex,
.token.important {
	color: #fd971f;
}

.token.important,
.token.bold {
	font-weight: bold;
}
.token.italic {
	font-style: italic;
}

.token.entity {
	cursor: help;
}

pre[data-line] {
	position: relative;
	padding: 1em 0 1em 3em;
}

.line-highlight {
	position: absolute;
	left: 0;
	right: 0;
	padding: inherit 0;
	margin-top: 1em; /* Same as .prism’s padding-top */

	background: hsla(24, 20%, 50%,.08);
	background: linear-gradient(to right, hsla(24, 20%, 50%,.1) 70%, hsla(24, 20%, 50%,0));

	pointer-events: none;

	line-height: inherit;
	white-space: pre;
}

	.line-highlight:before,
	.line-highlight[data-end]:after {
		content: attr(data-start);
		position: absolute;
		top: .4em;
		left: .6em;
		min-width: 1em;
		padding: 0 .5em;
		background-color: hsla(24, 20%, 50%,.4);
		color: hsl(24, 20%, 95%);
		font: bold 65%/1.5 sans-serif;
		text-align: center;
		vertical-align: .3em;
		border-radius: 999px;
		text-shadow: none;
		box-shadow: 0 1px white;
	}

	.line-highlight[data-end]:after {
		content: attr(data-end);
		top: auto;
		bottom: .4em;
	}

pre.line-numbers {
	position: relative;
	padding-left: 3.8em;
	counter-reset: linenumber;
}

pre.line-numbers > code {
	position: relative;
}

.line-numbers .line-numbers-rows {
	position: absolute;
	pointer-events: none;
	top: 0;
	font-size: 100%;
	left: -3.8em;
	width: 3em; /* works for line-numbers below 1000 lines */
	letter-spacing: -1px;
	border-right: 1px solid #999;

	-webkit-user-select: none;
	-moz-user-select: none;
	-ms-user-select: none;
	user-select: none;

}

	.line-numbers-rows > span {
		pointer-events: none;
		display: block;
		counter-increment: linenumber;
	}

		.line-numbers-rows > span:before {
			content: counter(linenumber);
			color: #999;
			display: block;
			padding-right: 0.8em;
			text-align: right;
		}
pre.code-toolbar {
	position: relative;
}

pre.code-toolbar > .toolbar {
	position: absolute;
	top: .3em;
	right: .2em;
	transition: opacity 0.3s ease-in-out;
	opacity: 0;
}

pre.code-toolbar:hover > .toolbar {
	opacity: 1;
}

pre.code-toolbar > .toolbar .toolbar-item {
	display: inline-block;
}

pre.code-toolbar > .toolbar a {
	cursor: pointer;
}

pre.code-toolbar > .toolbar button {
	background: none;
	border: 0;
	color: inherit;
	font: inherit;
	line-height: normal;
	overflow: visible;
	padding: 0;
	-webkit-user-select: none; /* for button */
	-moz-user-select: none;
	-ms-user-select: none;
}

pre.code-toolbar > .toolbar a,
pre.code-toolbar > .toolbar button,
pre.code-toolbar > .toolbar span {
	color: #bbb;
	font-size: .8em;
	padding: 0 .5em;
	background: #f5f2f0;
	background: rgba(224, 224, 224, 0.2);
	box-shadow: 0 2px 0 0 rgba(0,0,0,0.2);
	border-radius: .5em;
}

pre.code-toolbar > .toolbar a:hover,
pre.code-toolbar > .toolbar a:focus,
pre.code-toolbar > .toolbar button:hover,
pre.code-toolbar > .toolbar button:focus,
pre.code-toolbar > .toolbar span:hover,
pre.code-toolbar > .toolbar span:focus {
	color: inherit;
	text-decoration: none;
}

.command-line-prompt {
	border-right: 1px solid #999;
	display: block;
	float: left;
	font-size: 100%;
	letter-spacing: -1px;
	margin-right: 1em;
	pointer-events: none;

	-webkit-user-select: none;
	-moz-user-select: none;
	-ms-user-select: none;
	user-select: none;
}

.command-line-prompt > span:before {
	color: #999;
	content: ' ';
	display: block;
	padding-right: 0.8em;
}

.command-line-prompt > span[data-user]:before {
	content: "[" attr(data-user) "@" attr(data-host) "] $";
}

.command-line-prompt > span[data-user="root"]:before {
	content: "[" attr(data-user) "@" attr(data-host) "] #";
}

.command-line-prompt > span[data-prompt]:before {
	content: attr(data-prompt);
}
```
