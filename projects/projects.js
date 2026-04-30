import { fetchJSON, renderProjects } from '../global.js';
import * as d3 from 'https://cdn.jsdelivr.net/npm/d3@7.9.0/+esm';

const projects = await fetchJSON('../lib/projects.json');

const projectsContainer = document.querySelector('.projects');
const searchInput = document.querySelector('.searchBar');

let query = '';
let selectedIndex = -1;
let currentPieData = [];

function getSearchFilteredProjects() {
  return projects.filter((project) =>
    project.title.toLowerCase().includes(query.toLowerCase())
  );
}

function getFilteredProjects() {
  let filteredProjects = getSearchFilteredProjects();

  if (selectedIndex !== -1 && currentPieData[selectedIndex]) {
    let selectedYear = currentPieData[selectedIndex].label;

    filteredProjects = filteredProjects.filter((project) =>
      project.year == selectedYear
    );
  }

  return filteredProjects;
}

function renderPieChart(projectsGiven) {
  let newRolledData = d3.rollups(
    projectsGiven,
    (v) => v.length,
    (d) => d.year
  );

  let newData = newRolledData.map(([year, count]) => {
    return {
      label: year,
      value: count
    };
  });

  currentPieData = newData;

  if (selectedIndex >= newData.length) {
    selectedIndex = -1;
  }

  let arcGenerator = d3.arc()
    .innerRadius(0)
    .outerRadius(50);

  let sliceGenerator = d3.pie()
    .value((d) => d.value);

  let arcData = sliceGenerator(newData);
  let arcs = arcData.map((d) => arcGenerator(d));

  let colors = d3.scaleOrdinal(d3.schemeTableau10);

  let svg = d3.select('#projects-pie-plot');
  let legend = d3.select('.legend');

  svg.selectAll('path').remove();
  legend.selectAll('li').remove();

  arcs.forEach((arc, i) => {
    svg
      .append('path')
      .attr('d', arc)
      .attr('fill', colors(i))
      .attr('class', i === selectedIndex ? 'selected' : '')
      .on('click', () => {
        selectedIndex = selectedIndex === i ? -1 : i;

        svg
          .selectAll('path')
          .attr('class', (_, idx) =>
            idx === selectedIndex ? 'selected' : ''
          );

        legend
          .selectAll('li')
          .attr('class', (_, idx) =>
            idx === selectedIndex
              ? 'legend-item selected'
              : 'legend-item'
          );

        let filteredProjects = getFilteredProjects();
        renderProjects(filteredProjects, projectsContainer, 'h2');
      });
  });

  newData.forEach((d, i) => {
    legend
      .append('li')
      .attr('style', `--color: ${colors(i)}`)
      .attr('class', i === selectedIndex ? 'legend-item selected' : 'legend-item')
      .html(`<span class="swatch"></span> ${d.label} <em>(${d.value})</em>`);
  });
}

// Initial page load
let initialProjects = getFilteredProjects();
renderProjects(initialProjects, projectsContainer, 'h2');
renderPieChart(getSearchFilteredProjects());

// Update projects and pie chart when searching
searchInput.addEventListener('input', (event) => {
  query = event.target.value;

  selectedIndex = -1;

  let searchFilteredProjects = getSearchFilteredProjects();

  renderProjects(searchFilteredProjects, projectsContainer, 'h2');
  renderPieChart(searchFilteredProjects);
});