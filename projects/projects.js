import { fetchJSON, renderProjects } from '/portfolio/global.js';


const projects = await fetchJSON('/portfolio/lib/projects.json');

const projectsContainer = document.querySelector('.projects');

renderProjects(projects, projectsContainer, 'h2');


export function renderProjects(projects, containerElement, headingLevel = 'h2') {

  containerElement.innerHTML = '';

  for (let project of projects) {

    const article = document.createElement('article');

    article.innerHTML = `
      <${headingLevel}>${project.title}</${headingLevel}>
      <img src="${project.image}" alt="${project.title}">
      <p>${project.description}</p>
    `;

    containerElement.appendChild(article);
  }
}