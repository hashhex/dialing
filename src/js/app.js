import gsap from "gsap";
import { Swiper, Navigation } from "swiper";
import Inputmask from "inputmask";



Swiper.use([Navigation]);

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

    return { burger_clone, burger, nav };
}

let { burger_clone, burger, nav } = NavBurger();


function Paralax(scroll_number) {
    let small = document.querySelector('.elipse--small');
    let middle = document.querySelector('.elipse--middle');
    let big = document.querySelector('.elipse--big');

    gsap.to(small, {y: scroll_number / 6})
    gsap.to(middle, {y: scroll_number / 3})
    gsap.to(big, {y: scroll_number / 2})
}

Paralax(window.pageYOffset);


let quest_el = document.querySelectorAll('[data-quest]');
quest_el.forEach((item, i) => {
    item.addEventListener('click', (e) => {
        
        if (document.querySelector('.text-quest')) {
            quest_el.forEach(all_item => {
                all_item.classList.remove('active')
            })
            console.log(document.querySelector('.text-quest').closest());
            document.querySelector('.text-quest').closest().remove();
        }

        let target = e.currentTarget;
        const { x, y } = target.getBoundingClientRect();
        const quest_text = target.dataset.quest;
        let quest_block_wrap = document.createElement('div');
        quest_block_wrap.classList.add('wrap-text--clicked')
        let quest_block = document.createElement('div');
        quest_block.classList.add('text-quest');
        quest_block.setAttribute('id', target.dataset.questId);
        quest_block.innerText = quest_text;
        quest_block.style.cssText = `top: ${y}px; left: ${x}px;`;
        quest_block_wrap.innerHTML = quest_block.outerHTML;
        

        if (!target.classList.contains('active')) {
            target.classList.add('active');

            document.querySelector('.site').insertAdjacentElement('beforeend', quest_block_wrap)
        }
    });
});

function adaptiveQuestText() {
    if (!document.querySelector('.text-quest')) {
        return false;
    }
    let _text =  document.querySelector('.text-quest');
    let _id = Number(_text.getAttribute('id'));
    let { x, y } = document.querySelector(`[data-quest-id="${_id}"]`).getBoundingClientRect();

    _text.style.left = `${x}px`;
    _text.style.top = `${y}px`;
}


document.addEventListener('click', (e) => {
    let target = e.target;
    if (target.classList.value === "wrap-text--clicked") {
        document.querySelectorAll('.question').forEach(item => {
            item.classList.remove('active');
        })
        document.querySelector('.text-quest').parentElement.remove();
    } 
    
})



document.querySelectorAll('.title__solution').forEach(item => {
    item.addEventListener('click', (e) => {
        if (window.matchMedia("(min-width: 767px)").matches) {
            return false;
        }
        let target = e.target
        let _list = target.nextElementSibling;
        if (!target.classList.contains('active')) {
            target.classList.add('active');
        } else {
            target.classList.remove('active');
        }
    });
});

new Swiper('.work-carousel', {
  loop: true,
  spaceBetween: 50,
  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
  },
  breakpoints: {
      0: {
        slidesPerView: 1,
      },
      640: {
        slidesPerView: 2,
      },
      992: {
        slidesPerView: 3,
      },
      1100: {
        slidesPerView: 4,
      }
  }
});

let linksScroll = document.querySelectorAll('[data-scroll]');
linksScroll.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        let target = e.target
        let elementId = target.getAttribute('href').substr(1);
        document.getElementById(elementId).scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
        nav.classList.remove('active');
        burger.classList.remove('active');
    });
});

let inputs = document.querySelectorAll(".fieldset input");
[].forEach.call(inputs, function(item){
  item.addEventListener("focus", (e) => {
      let target = e.target;
      target.previousElementSibling.classList.add('focus');
  });
  item.addEventListener("blur", (e) => {
    let target = e.target;
    if (target.value.length === 0) {
        target.previousElementSibling.classList.remove('focus');
    }
  });
});


document.querySelector('[data-form]').addEventListener('submit', (e) => {
    e.preventDefault();
    let error = [];
    let form = e.target;
    form.querySelectorAll('input[required]').forEach(input => {
        if (input.value === 0) {
            error.push({input: 'empty'})
        }
    });
    if (error.length !== 0) {
        console.log(error)
        return false
    }
});
document.querySelectorAll('[data-popup]').forEach(button => {
    button.addEventListener('click', (e) => {
        e.preventDefault();
        document.querySelector('.popup').classList.add('active');
    });
})


document.querySelectorAll('[data-close-popup]').forEach(button => {
    button.addEventListener('click', (e) => {
        document.querySelector('.popup').classList.remove('active');
    });
})

document.querySelectorAll('[type="tel"]').forEach(input_tel => {
    new Inputmask("+7999-999 99 99").mask(input_tel)
});



window.addEventListener('resize', (e) => {
    positionBurger(burger_clone, burger);
    adaptiveQuestText()
});

window.addEventListener('scroll', (e) => {
    Paralax(window.pageYOffset);
    adaptiveQuestText();
})

