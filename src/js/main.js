document.addEventListener('DOMContentLoaded', function() {
  document.querySelector('.read-more').addEventListener('click', function(e) {
    e.preventDefault();
    this.parentNode.nextElementSibling.style.display = 'block';
    this.parentNode.removeChild(this);
  });
});
