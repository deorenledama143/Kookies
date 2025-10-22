//Optional interactivity (highlight effect)
document.querySelectorAll('.card-flip').forEach(card => {
card.addEventListener('mouseenter', () => {
card.querySelector('.card.front').classList.add('shadow-lg');
});
card.addEventListener('mouseleave', () => {
card.querySelector('.card.front').classList.remove('shadow-lg');
});
});