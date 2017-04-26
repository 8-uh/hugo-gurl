
console.log('blerrrrrg')

document.addEventListener("DOMContentLoaded", function() {
  const pres = document.getElementsByTagName('pre')
  for(var pre of pres) {
    pre.classList.add('line-numbers')
  }
  Prism.highlightAll(true)
});
