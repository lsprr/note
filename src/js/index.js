const contentEditableElement = document.querySelector('[contenteditable]');
const br = document.getElementsByTagName("br");
const expt = document.getElementById("export");
const eradicate = document.getElementById("delete");
const top = document.getElementById("top");
const localStorageKey = 'contenteditable';
const debounceTimeout = 250;

function scrollToTop() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
}

function scroll() {
    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
        expt.style.right = "175px";
        eradicate.style.right = "91px";
        top.style.display = "block";
    } else {
        expt.style.right = "114px";
        eradicate.style.right = "30px";
        top.style.display = "none";
    }
}

function strip(html) {
    html = html.replace(/<(.|\n)*?>/g, '<br>');
    html = html.replace(/(<br>*)+/g, "<br/>");
    html = html.replace(/(<br\/>*)+/g, '%0D%0A')
    return html;
}

function email() {
    let html = contentEditableElement.innerHTML;
    html = strip(html);
    window.location = "mailto:?subject=Untitled&body=" + html;
}

function remove() {
    localStorage.removeItem(localStorageKey);
    contentEditableElement.innerHTML = '';
}

function load() {
    const saved = localStorage.getItem(localStorageKey);

    if (saved) {
        contentEditableElement.innerHTML = saved;
    }
}

function save() {
    let html = contentEditableElement.innerHTML;
    localStorage.setItem(localStorageKey, html);
}

function debounced(delay, fn) {
    let timerId;

    return function () {
        if (timerId) {
            clearTimeout(timerId);
        }

        timerId = setTimeout(function () {
            fn();
            timerId = null;
        }, delay);
    }
}

const debouncedSave = debounced(debounceTimeout, save);

window.onscroll = function () { scroll() };

contentEditableElement.addEventListener('input', function () {
    debouncedSave();
}, false);
expt.addEventListener("click", email);
eradicate.addEventListener("click", remove);
top.addEventListener("click", scrollToTop);

load();