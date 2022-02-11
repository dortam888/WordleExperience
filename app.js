const tileDisplay = document.querySelector('.tile-container');
const keyBoard = document.querySelector('.key-container');
const messageDisplay = document.querySelector('.message-container');


const getWordle = () => {
    fetch('http://localhost:8000/word')
    .then(response => response.json())
    .then(json => {
        wordle = json.toUpperCase();
        console.log(wordle);
    })
    .catch(err => console.log(err));
};

const keys = [
    'Q',
    'W',
    'E',
    'R',
    'T',
    'Y',
    'U',
    'I',
    'O',
    'P',
    'A',
    'S',
    'D',
    'F',
    'G',
    'H',
    'J',
    'K',
    'L',
    'ENTER',
    'Z',
    'X',
    'C',
    'V',
    'B',
    'N',
    'M',
    '<<'
];

const guessRows = [
    ['', '', '', '', ''],
    ['', '', '', '', ''],
    ['', '', '', '', ''],
    ['', '', '', '', ''],
    ['', '', '', '', ''],
    ['', '', '', '', '']
];

let wordle = '';
let currentRow = 0;
let currentTile = 0;
let isGameOver = false;

getWordle();

guessRows.forEach((guessRows, guessRowIndex) => {
    const rowElement = document.createElement('div');
    rowElement.setAttribute('id', 'guessRow-' + guessRowIndex);

    guessRows.forEach((guess,guessIndex) => {
        const tileElement = document.createElement('div');
        tileElement.setAttribute('id', 'guessRow-' + guessRowIndex + '-tile-' + guessIndex);
        tileElement.classList.add('tile');
        rowElement.append(tileElement);
    });
    tileDisplay.append(rowElement);
});

const handleClick = (key) => {
    console.log('clicked', key);

    if(key == '<<')
    {
        deleteLetter();
        console.log('guessRows', guessRows);
        return;
    }

    if (key == 'ENTER')
    {
        checkRow();
        console.log('guessRows', guessRows);
        return;
    }

    addLetter(key);
};

keys.forEach(key => {
    const buttonElement = document.createElement('button');
    buttonElement.textContent = key;
    buttonElement.setAttribute('id', key);
    buttonElement.addEventListener('click', () => handleClick(key));
    keyBoard.append(buttonElement);
});


const addLetter = (letter) => {
    if (currentTile < 5 && currentRow < 6)
    {
        const tile = document.getElementById('guessRow-' + currentRow + '-tile-' + currentTile);
        tile.textContent = letter;
        guessRows[currentRow][currentTile] = letter;
        tile.setAttribute('data', letter);
        currentTile++;
    }
};

const deleteLetter = () => {
    if (currentTile > 0)
    {
        currentTile--;
        const tile = document.getElementById('guessRow-' + currentRow + '-tile-' + currentTile)
        tile.textContent = '';
        guessRows[currentRow][currentTile];
        tile.setAttribute('data', '');
    }
}

const checkRow = () => {
    const guess = guessRows[currentRow].join('');

    if (currentTile > 4)
    {
        console.log('guess is '+ guess);
        flipTile();
        if (wordle == guess)
        {
            showMessage('You guessed the right word');
            isGameOver = true;
            return;
        }
        else
        {
            if (currentRow < 5)
            {
                currentRow++;
                currentTile = 0;
            }

            else
            {
                isGameOver = true;
                return;
            }
        }

    }
}

const showMessage = (message) => {
    const messageElement = document.createElement('p');
    messageElement.textContent = message;
    messageDisplay.append(messageElement);
    setTimeout(() => {
        messageDisplay.removeChild(messageElement),20000
    });
};

const addColorToKey = (letter, color) => {
    const key = document.getElementById(letter);
    key.classList.add(color);
}

const flipTile = () => {
    const rowTiles = document.querySelector('#guessRow-' + currentRow).childNodes;
    let checkWordle = wordle;
    const guess = [];

    rowTiles.forEach(tile => {
        guess.push({ letter: tile.getAttribute('data'), color: 'grey-overlay'});
    });

    guess.forEach((guess, index) => {
        if(guess.letter == wordle[index])
        {
            guess.color = 'green-overlay';
            checkWordle = checkWordle.replace(guess.letter, '');
        }
    })

    guess.forEach((guess, index) => {
        if(guess.letter == wordle[index])
        {
            guess.color = 'green-overlay';
            checkWordle = checkWordle.replace(guess.letter, '');
        }
    })

    rowTiles.forEach((tile, index) => {
        setTimeout(() => {
            tile.classList.add('flip');
            tile.classList.add(guess[index].color);
            addColorToKey(guess[index].letter, guess[index].color);
        }, 500 * index);
    });  
};