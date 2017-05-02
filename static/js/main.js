
console.log('blerrrrrg')

document.addEventListener("DOMContentLoaded", function() {
  const pres = document.getElementsByTagName('pre')
  for(let i = 0; i < pres.length; i++) {
    const pre = pres[i]
    pre.classList.add('line-numbers')
  }
  Prism.highlightAll(true)
});
