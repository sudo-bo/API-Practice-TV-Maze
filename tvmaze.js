"use strict";

const $showsList = $("#showsList");
const $episodesArea = $("#episodesArea");
const $episodesList = $("#episodesList");
const $searchForm = $("#searchForm");

/** Given a search term, search for tv shows that match that query.
 *
 *  Returns (promise) array of show objects: [show, show, ...].
 *    Each show object should contain exactly: {id, name, summary, image}
 *    (if no image URL given by API, put in a default image URL)
 */

async function getShowsByTerm(request) {
  // ADD: Remove placeholder & make request to TVMaze search shows API.

  let showResults = await axios.get("https://api.tvmaze.com/search/shows", { params: { q: request } });
  const returnObj = [];
  for (let result of showResults.data) {
    returnObj.push(result.show);
  }
  return returnObj;
}

/** Given list of shows, create markup for each and to DOM */

function populateShows(shows) {
  $showsList.empty();

  for (let show of shows) {
    const $show = $(
      `<div data-show-id="${show.id}" class="Show col-md-12 col-lg-6 mb-4">
         <div class="media">
           <img
              src="${show.image.original ? show.image.original : "https://pbs.twimg.com/media/DwjuxGMUcAAr_1u.jpg"}"
              alt="${show.name}"
              class="w-25 me-3">
           <div class="media-body">
             <h5 class="text-primary">${show.name}</h5>
             <div><small>${show.summary ? show.summary : "No summary found"}</small></div>
             <button class="btn btn-outline-light btn-sm Show-getEpisodes">
               Episodes
             </button>
           </div>
         </div>
       </div>
      `
    );

    $showsList.append($show);
  }
}

/** Handle search form submission: get shows from API and display.
 *    Hide episodes area (that only gets shown if they ask for episodes)
 */

async function searchForShowAndDisplay() {
  const term = $("#searchForm-term").val();
  const shows = await getShowsByTerm(term);

  $episodesArea.hide();
  populateShows(shows);
}

$searchForm.on("submit", async function (evt) {
  evt.preventDefault();
  await searchForShowAndDisplay();
});

/** Given a show ID, get from API and return (promise) array of episodes:
 *      { id, name, season, number }
 */

async function getEpisodesOfShow(id) {
  let episodeResults = await axios.get(`https://api.tvmaze.com/shows/${id}/episodes`);
  console.log(episodeResults.data);
  return episodeResults.data;
}

/** Write a clear docstring for this function... */
function populateEpisodes(eps) {
  $episodesArea.show();

  for (let ep of eps) {
    const $ep = $(
      `<li>
          ${ep.name} (Season ${ep.season}, Episode ${ep.number})
       </li>
      `
    );
    $episodesList.append($ep);
  }
}

$("#showsList").on("click", ".Show", async function (evt) {
  if (evt.target.classList.contains("Show-getEpisodes")) {
    console.log();
    let episodes = await getEpisodesOfShow($(this).data("show-id"));
    populateEpisodes(episodes);
  }
});

//could be improved so that the episodes spanwn underneath each show, and should also allow for a remove button,
// but nevertheless, the main functionality is there :)
