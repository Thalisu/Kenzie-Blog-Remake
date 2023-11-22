container_scroller.onmousedown = event => {
    if (!animation_status) return;
    mouse_down_at = event.clientX;
}
container_scroller.ontouchstart = event => {
    if (!animation_status) return;
    touch_start_at = event.touches[0].clientX;
}
container_scroller.onmousemove = event => {
    if (mouse_down_at === '0') return;
    if (!animation_status) return;
    if (parseFloat(mouse_down_at) - event.clientX !== 0){
        anchor.forEach(a => {
            a.onclick = (event) =>{
            event.preventDefault();
            }
        })
    }
    const mouse_move_delta = parseFloat(mouse_down_at) - event.clientX, maxDelta = window.innerWidth / 2;
    percentage = Math.min(1100, Math.max(0, ((mouse_move_delta / maxDelta) * 50) + parseFloat(prev_percentage)));
    scroller_move(0)
}
container_scroller.ontouchmove = event => {
    if (touch_start_at === '0') return;
    if (!animation_status) return;
    const touch_move_delta = parseFloat(touch_start_at) - event.touches[0].clientX, maxDelta = window.innerWidth / 2;
    percentage = Math.min(1100, Math.max(0, ((touch_move_delta / maxDelta) * 50) + parseFloat(prev_percentage)));
    scroller_move(0)
}

 container_scroller.onmouseup = async () => {
    if (!animation_status) return;
    mouse_down_at = '0';
    if (percentage/100 - Math.floor(percentage/100) > 0.08 && percentage > prev_percentage){
        percentage = Math.ceil(percentage / 100) * 100
        percentage == 1100 ? await_fit(1) : await_fit()
        return
    }
    if (percentage/100 - Math.floor(percentage/100) > 0.2 && percentage < prev_percentage){
        percentage = Math.floor(percentage / 100) * 100
        percentage == 0 ? await_fit(2) : await_fit()
        return
    }
    scroller_move(1)
}
container_scroller.ontouchend = () => {
    touch_start_at = '0';
    if (percentage/100 - Math.floor(percentage/100) > 0.08 && percentage > prev_percentage){
        percentage = Math.ceil(percentage / 100) * 100
        percentage == 1100 ? await_fit(1) : await_fit()
        return
    }
    if (percentage/100 - Math.floor(percentage/100) > 0.2 && percentage < prev_percentage){
        percentage = Math.floor(percentage / 100) * 100
        percentage == 0 ? await_fit(2) : await_fit()
        return
    }
    scroller_move(1)
}

function scroller_move(prev){
    percentage = prev ? prev_percentage : percentage
    duration = prev ? 100 : 0
    for (let index of scroller){
        index.animate({
            transform: `translateX(-${percentage}%)`
        },  {
            duration: duration, fill: 'forwards'
        });
    }

}

function scroller_fit() {
    return new Promise((resolve) => {
        let scroller_cards = Array.from(scroller)
        let animations = scroller_cards.map(index => {
            return index.animate(
                { transform: `translateX(-${percentage}%)` },
                { duration: 300, fill: 'forwards' }).finished;
        })
        dot_move();
        Promise.all(animations).then(() => {
            resolve();
        });
    });
}

function scroller_reset(reset) {
    reset ? percentage = -1000 : percentage = 100
    return new Promise((resolve) => {
        let scroller_cards = Array.from(scroller)
        let animations = scroller_cards.map(index => {
            return index.style.transform = `translateX(${percentage}%)`
        });
        Promise.all(animations).then(() => {
            resolve();
        });
    });
}

async function await_fit(reset) {
    return new Promise(async (resolve) => {
        animation_status = 0;
        await scroller_fit();
        setTimeout(() => {
            anchor.forEach(a => {
                a.onclick = (event) =>{
                event.Default();
                }
            })
            reset == 1 ? (prev_percentage = 100, scroller_reset(), animation_status = 1) : reset == 2 ? (prev_percentage = 1000, scroller_reset(1), animation_status = 1) : (prev_percentage = percentage, animation_status = 1)
            resolve();
        }, 300);
    });
}

function dot_move(){
    dot_position = -128 + 32 * (percentage-100)/100
    dot_position < -128 ? dot_position = 160 : dot_position > 160 ? dot_position = -128 : ''
    if (dot_position < prev_dot_position){
        dot_animation.animate(
            [
                { paddingRight: '0px', transform: `translateX(${prev_dot_position}px)` },
                { paddingRight: '20px', transform: `translateX(${dot_position+16}px)` },
                { paddingRight: '0px', transform: `translateX(${dot_position}px)` },
            ],
            { duration: 300, fill: 'forwards', easing: 'ease-in-out' }
        );
    } else {
        dot_animation.animate(
            [
                { paddingLeft: '0px', transform: `translateX(${prev_dot_position}px)` },
                { paddingLeft: '20px', transform: `translateX(${dot_position}px)` },
                { paddingLeft: '0px', transform: `translateX(${dot_position}px)` },
            ],
            { duration: 300, fill: 'forwards', easing: 'ease-in-out' }
        );  
    }
    prev_dot_position = dot_position
}

function dot_click(index){
    dot_animation.style.transform = `translateX(${dot_position}px)`
    dot_position = -128 + 32 * index
    dot_animation.animate(
        [
            { paddingLeft: '0px',transform: `translateX(${prev_dot_position}px)` },
            { paddingLeft: '20px',transform: `translateX(${dot_position}px)` },
            { paddingLeft: '0px',transform: `translateX(${dot_position}px)` },
        ],
        { duration: 300, fill: 'forwards', easing: 'ease-in-out' }
    );
    prev_dot_position = dot_position
}

dot.forEach((dot, index) => {
    dot.onclick = () => {
        prev_percentage = (index+1)*100, percentage = (index+1)*100
        dot_click(index+1)
        await_fit()
    };
})