import gsap from "gsap";

function positionBurger(clone, original) {
    let {x, y} = clone.getBoundingClientRect();

    original.style.left = `${x - 25}px`;
    original.style.top = `${y}px`;
}

function NavBurger() {
    let burger_clone = document.querySelector('.burger.clone');
    let burger = document.querySelector('.burger.original');
    let nav = document.querySelector('.hidden-nav');

    positionBurger(burger_clone, burger);

    burger.addEventListener('click', (e) => {
        if (nav.classList.contains('active')) {
            burger.classList.remove('active');
            nav.classList.remove('active');
        } else {
            burger.classList.add('active');
            nav.classList.add('active');
        }
    })

    return { burger_clone, burger };
}

let { burger_clone, burger } = NavBurger();


function Paralax(scroll_number) {
    let small = document.querySelector('.elipse--small');
    let middle = document.querySelector('.elipse--middle');
    let big = document.querySelector('.elipse--big');

    gsap.to(small, {y: scroll_number / 6})
    gsap.to(middle, {y: scroll_number / 3})
    gsap.to(big, {y: scroll_number / 2})
}

Paralax(window.pageYOffset)

window.addEventListener('resize', (e) => {
    positionBurger(burger_clone, burger);
});

window.addEventListener('scroll', (e) => {
    Paralax(window.pageYOffset);
})

