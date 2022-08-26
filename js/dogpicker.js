const languages = {
    myName: 'WebDevMe',
    languageOptions: ['eng', 'hun', 'pol'],
    arrowIntendation: {
        eng: '0.85rem',
        hun: '3.78rem',
        pol: '6.7rem',
    },
    h1: {
        eng: 'Pick a dog',
        hun: 'Kutya képtár',
        pol: 'Wybierz psa'
    },
    lb1: {
        eng: 'Choose a breed:',
        hun: 'Válassz egy fajtát:',
        pol: 'Wybierz rasę psa:'
    },
    lb2: {
        eng: 'Number of photos (1...10):',
        hun: 'Fotók száma (1...10):',
        pol: 'Liczba zdjęć (1...10):'
    },
    getPhotos_btn: {
        eng: 'Show',
        hun: 'Mutasd',
        pol: 'Pokaż zdjęcia'
    },
    h2: {
        eng: 'Photos will appear in this box:',
        hun: 'A fényképek itt fognak megjelenni:',
        pol: 'Zdjęcia pojawią się w tym polu:'
    },
    alert_whenNoNumber: {
        eng: 'Please specify how many photos you would like to display!',
        hun: 'Add meg a megjeleníteni kívánt fotók számát!',
        pol: 'Wybierz, ile zdjęć chcesz wyświetlić!'
    },
    alert_whenOutOfRange: {
        eng: 'Selected number must be between 1 and 10!',
        hun: 'Fotók száma 1 és 10 közé kell essen!',
        pol: 'Wybrana liczba musi wynosić od 1 do 10!'
    },
    bottom_link: {
        eng: `This site is maintained by <span id="myName"></span>`,
        hun: `Ezt az oldalt <span id="myName"></span> fejleszti`,
        pol: `Ta strona jest prowadzona przez <span id="myName"></span>`,
    }
}

let logo = document.querySelector('#logo');
let h1 = document.querySelector('h1');
let choose = document.querySelector('#breeds span');
let nums = document.querySelector('#numbers span');
let btn = document.querySelector('#getPhotos-btn');
let h2 = document.querySelector('#container-title');
let link = document.querySelector('footer a');
let flags = [...document.querySelectorAll('.flag')];
let arrow = document.querySelector('#arrow');

const setLanguage = (lang) => {
    h1.innerHTML = languages.h1[lang];
    choose.innerHTML = languages.lb1[lang];
    nums.innerHTML = languages.lb2[lang];
    btn.innerHTML = languages.getPhotos_btn[lang];
    h2.innerHTML = languages.h2[lang];
    link.innerHTML = languages.bottom_link[lang];
    arrow.style.marginLeft = languages.arrowIntendation[`${lang}`];

    let myName = document.querySelector('#myName');
    myName.innerHTML = languages.myName;
}

setLanguage(defaultLanguage = 'eng');

flags.forEach(flag => {
    flag.addEventListener('click', () => {
        let selector = flag.getAttribute('language');
        let h2InnerText = h2.innerText;

        setLanguage(selector);

        if (h2InnerText.split(' ').length <= 3) {
            h2.innerHTML = h2InnerText;
        }
        arrow.style.marginLeft = languages.arrowIntendation[`${selector}`];
    })
})

let isTailOnLeft = true;

const shakeTail = () => {
    logo.addEventListener('click', () => {
        if (isTailOnLeft) {
            logo.src = './img/dog_right.png';
            isTailOnLeft = false;
        } else {
            logo.src = './img/dog_left.png';
            isTailOnLeft = true;
        }
    })
}

shakeTail();

const select = document.querySelector('#breeds select');

const fetchData = () => {
    fetch('https://dog.ceo/api/breeds/list/all')
        .then(result => result.json())
        .then(data => {
            let breeds = Object.keys(data.message);
            let optionTags = [];

            breeds.forEach(breed => {
                if (data.message[`${breed}`].length === 0) {
                    optionTags.push(`<option id="${breed}" name="${breed}" class="opt-level-A">${breed}</option>`);
                } else {
                    data.message[`${breed}`].forEach(subBreed => {
                        optionTags.push(`<option id="${subBreed}-${breed}" name="${breed}-${subBreed}" class="opt-level-B">${subBreed} ${breed}</option>`);
                    })
                }
            });

            optionTags.sort()
            optionTags.forEach(tag => {
                select.innerHTML += tag;
            });
        });
}

fetchData();

let pictureContainer = document.getElementById('picture-container');

btn.addEventListener("click", () => {
    pictureContainer.innerHTML = ``;
    let chosenBreed = document.querySelector('#breeds select').value;
    if (chosenBreed.split(' ').length > 1) {
        chosenBreed = chosenBreed.split(' ');
        [chosenBreed[0], chosenBreed[1]] = [chosenBreed[1], chosenBreed[0]];
        chosenBreed = chosenBreed.join('/');
    }

    const chosenNum = document.querySelector('#numbers input').value;

    fetch(`https://dog.ceo/api/breed/${chosenBreed}/images/random/${chosenNum}`)
        .then(response => response.json())
        .then(data => {
            const randomPhotoList = data.message;
            const photos = Object.values(randomPhotoList);
            photos.map(src => document.getElementById('picture-container').innerHTML += `
            <div class="picture-box">
                <img src="${src}" alt="${chosenBreed}"></img>
            </div>
            `);
        });

    if (chosenBreed.split('/').length > 1) {
        chosenBreed = chosenBreed.split('/');
        [chosenBreed[0], chosenBreed[1]] = [chosenBreed[1], chosenBreed[0]];
        chosenBreed = chosenBreed.join(' ');
    }

    let firstLetter = chosenBreed[0].toUpperCase();
    let tail = chosenBreed.slice(1, chosenBreed.length);
    document.querySelector("#container-title").innerHTML = `<span>${firstLetter}${tail}</span>`;
});





