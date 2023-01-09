// categories is the main data structure for the app; it looks like this:

//  [
//    { title: "Math",
//      clues: [
//        {question: "2+2", answer: 4, showing: null},
//        {question: "1+1", answer: 2, showing: null}
//        ...
//      ],
//    },
//    { title: "Literature",
//      clues: [
//        {question: "Hamlet Author", answer: "Shakespeare", showing: null},
//        {question: "Bell Jar Author", answer: "Plath", showing: null},
//        ...
//      ],
//    },
//    ...
//  ]

let categories = [];
const WIDTH = 6;
const HEIGHT = 5;

/** Get NUM_CATEGORIES random category from API.
 *
 * Returns array of category ids
 */

async function getCategoryIds() {
    const res = await axios.get("http://jservice.io/api/random?count=6")
    return (res.data.map(function (clue) {
        return (clue.category.id)
    }))
}



/** Return object with data about a category:
 *
 *  Returns { title: "Math", clues: clue-array }
 *
 * Where clue-array is:
 *   [
 *      {question: "Hamlet Author", answer: "Shakespeare", showing: null},
 *      {question: "Bell Jar Author", answer: "Plath", showing: null},
 *      ...
 *   ]
 */

async function getCategory(catId) {
    const res = await axios.get(`http://jservice.io/api/category?id=${catId}`)

    const title = res.data.title
    const category = {
        title,
        clues: res.data.clues.map(function (clue) {
            return {
                question: clue.question,
                answer: clue.answer,
                showing: null
            }
        })
    }
    return category;
}

/** Fill the HTML table#jeopardy with the categories & cells for questions.
 *
 * - The <thead> should be filled w/a <tr>, and a <td> for each category
 * - The <tbody> should be filled w/NUM_QUESTIONS_PER_CAT <tr>s,
 *   each with a question for each category in a <td>
 *   (initally, just show a "?" where the question/answer would go.)
 */

async function fillTable() {

    const htmlBoard = document.querySelector('#board')
    const titles = document.createElement('tr')

    for (let x = 0; x < WIDTH; x++) {
        const titleCell = document.createElement("td");
        titleCell.innerText = categories[x].title;
        titles.append(titleCell);
    }
    htmlBoard.append(titles);

    for (let y = 0; y < HEIGHT; y++) {
        const row = document.createElement("tr");
        for (let x = 0; x < WIDTH; x++) {
            const cell = document.createElement("td");
            cell.setAttribute('id', `${x}-${y}`)
            cell.innerText = "?"
            cell.addEventListener('click', handleClick)
            row.append(cell);
        }
        htmlBoard.append(row);
    }
}


/** Handle clicking on a clue: show the question or answer.
 *
 * Uses .showing property on clue to determine what to show:
 * - if currently null, show question & set .showing to "question"
 * - if currently "question", show answer & set .showing to "answer"
 * - if currently "answer", ignore click
 * */

async function handleClick(evt) {
    let id = evt.target.id;
    let [x, y] = id.split('-');
    let clue = categories[x].clues[y]
    let text;
    if (!clue.showing) {
        text = clue.question;
        clue.showing = 'question';
    }
    else if (clue.showing === 'question') {
        text = clue.answer;
        clue.showing = 'answer';
    }
    else {
        return;
    }

    let update = document.getElementById(`${x}-${y}`);
    update.innerText = text;
}

/** Wipe the current Jeopardy board, show the loading spinner,
 * and update the button used to fetch data.
 */

function showLoadingView() {

}

/** Remove the loading spinner and update the button used to fetch data. */

function hideLoadingView() {
}

/** Start game:
 *
 * - get random category Ids
 * - get data for each category
 * - create HTML table
 * */

async function setupAndStart() {
    const categoryIds = await getCategoryIds();
    categories = await Promise.all(categoryIds.map(id => getCategory(id)));
    console.log(categories)
    fillTable()
}

/** On click of start / restart button, set up game. */

// TODO

/** On page load, add event handler for clicking clues */

// TODO

setupAndStart()
