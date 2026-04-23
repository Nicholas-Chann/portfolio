import { fetchJSON, renderProjects, fetchGithubData } from '/portfolio/global.js';

const projects = await fetchJSON('/portfolio/lib/projects.json');
const latestProjects = projects.slice(0, 3);

const projectsContainer = document.querySelector('.projects');

const githubData = await fetchGithubData('Nicholas-Chann');
const profileStats = document.querySelector('#profile-stats');

if (profileStats) {
  profileStats.innerHTML = `
        <dl>
          <dt>Public Repos:</dt><dd>${githubData.public_repos}</dd>
          <dt>Public Gists:</dt><dd>${githubData.public_gists}</dd>
          <dt>Followers:</dt><dd>${githubData.followers}</dd>
          <dt>Following:</dt><dd>${githubData.following}</dd>
        </dl>
    `;
}

renderProjects(latestProjects, projectsContainer, 'h2');
