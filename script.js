const searchInput = document.querySelector('.searchWindow');
const autocompleteList = document.querySelector('.autocompleteList');
const resultList = document.querySelector('.resultList');


function debounce(fn, delay) {
    let timeout;
    return function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => fn.apply(this, args), delay);
    };
};

async function searchRepos(database) {
    const response = await fetch(`https://api.github.com/search/repositories?q=${database}&per_page=5`);
    const results = await response.json();
    return results.items || [];
};

function addSelectedToResultList(repository) {
    const li = document.createElement('li');
    li.classList.add('repository-list');
    li.innerHTML = `
    <span>Name: ${repository.name}<br>
    Owner: ${repository.owner.login}<br>
    Stars: ${repository.stargazers_count}</span>
    <button class='remove-btn'>X</button>
    `;

    resultList.appendChild(li);

    li.querySelector('.remove-btn').addEventListener('click', () => {
        resultList.removeChild(li);
    });

    searchInput.value = '';
    autocompleteList.innerHTML = '';
};

searchInput.addEventListener('input', debounce(async function() {
    const database = searchInput.value.trim();
    if (!database) {
        autocompleteList.innerHTML = '';
        return;
    }

    const result = await searchRepos(database);

    autocompleteList.innerHTML = '';

    result.forEach(repository => {
        const data = document.createElement('div');
        data.textContent = repository.name;
        data.addEventListener('click', () => addSelectedToResultList(repository));
        autocompleteList.appendChild(data);
    });
}, 600));

document.addEventListener('click', function(e) {
    if (!searchInput.contains(e.target) && !autocompleteList.contains(e.target)) {
        autocompleteList.innerHTML = '';
    }
});