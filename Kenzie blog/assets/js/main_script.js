const container_scroller = document.querySelector('.container_scroller'), scroller = document.querySelectorAll('.scroller'), img = container_scroller.querySelectorAll('.img'), dot = document.querySelectorAll('.current_scroller li'), dot_animation = document.querySelector('.dot_animation')

container_scroller.style.overflow = 'hidden'
container_scroller.style.scrollSnapType = 'none'
container_scroller.style.scrollSnapAlign = 'none'

for (index of scroller){
    index.style.animation = 'none';
}
dot[0].className = ''
dot_animation.style.backgroundColor = 'rgba(255,255,255,1)'
dot_animation.style.border = 'thin solid white'
dot_animation.style.transform = 'translateX(-128px)'