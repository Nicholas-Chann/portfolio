console.log('IT’S ALIVE!');

function $$(selector, context = document) {
  return Array.from(context.querySelectorAll(selector));
}

const BASE_PATH =
  (location.hostname === "localhost" || location.hostname === "127.0.0.1")
    ? "/"                 
    : "/portfolio/";     


let pages = [
  { url: "", title: "Home" },
  { url: "projects/", title: "Projects" },
  { url: "contacts/", title: "Contact" },
  { url: "Resume/", title: "Resume" },
  { url: "https://github.com/nicholas-chann", title: "GitHub" }
];

let nav = document.createElement('nav');
document.body.prepend(nav);

for (let p of pages) {
  let url = p.url;
  let title = p.title;

  if (!url.startsWith("http")) {
    url = BASE_PATH + url;
  }

  let a = document.createElement("a");
  a.href = url;
  a.textContent = title;
  nav.append(a);
}

let navLinks = $$("nav a");


let currentLink = navLinks.find(
  (a) => a.host === location.host && a.pathname === location.pathname,
);


if (currentLink) {
  // or if (currentLink !== undefined)
  currentLink.classList.add('current');
}

document.body.insertAdjacentHTML(
  "afterbegin",
  `
  <label class="color-scheme">
    Theme:
    <select id="color-scheme-select">
      <option value="light dark">Automatic</option>
      <option value="light">Light</option>
      <option value="dark">Dark</option>
    </select>
  </label>
  `
);

let select = document.querySelector("#color-scheme-select");

if ("colorScheme" in localStorage) {
  const saved = localStorage.colorScheme;
  document.documentElement.style.setProperty("color-scheme", saved);
  select.value = saved;
}

select.addEventListener("input", function (event) {
  console.log("color scheme changed to", event.target.value);
  localStorage.colorScheme = event.target.value;
  document.documentElement.style.setProperty('color-scheme', event.target.value);
});

export async function fetchJSON(url) {
  try {
    // Fetch the JSON file from the given URL
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch JSON data: ${response.status}`);
    }

    const data = await response.json();
    return data;

  } catch (error) {
    console.error('Error fetching or parsing JSON data:', error);
  }
}