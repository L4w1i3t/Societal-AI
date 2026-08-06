/**
 * Loads legacy members from legacy.json and renders them
 * as a flat grid on the About page (no dropdowns).
 */
document.addEventListener('DOMContentLoaded', async () => {
  const alumniGrid = document.getElementById('alumni-grid');
  const loadingIndicator = document.querySelector('.loading-indicator-alumni');
  if (!alumniGrid) return;

  const placeholderSvg = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 200 200'%3E%3Crect fill='%231e293b' width='200' height='200'/%3E%3Ccircle cx='100' cy='75' r='35' fill='%23334155'/%3E%3Cellipse cx='100' cy='155' rx='55' ry='40' fill='%23334155'/%3E%3C/svg%3E`;

  try {
    const response = await fetch('../data/legacy.json');
    if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
    const data = await response.json();

    let html = '';
    const classes = Object.entries(data.pastBoardMembers);

    // Render newest class first
    for (const [, classData] of classes.slice().reverse()) {
      for (const member of classData.members) {
        const imgSrc = member.image || placeholderSvg;
        html += `
          <div class="board-card">
            <div class="board-photo">
              <img src="${imgSrc}" alt="${member.name}" loading="lazy" />
            </div>
            <div class="board-info">
              <h3>${member.name}</h3>
              <h4>${member.title}</h4>
              <p class="major">${classData.title}</p>
            </div>
          </div>
        `;
      }
    }

    if (loadingIndicator) loadingIndicator.style.display = 'none';
    alumniGrid.innerHTML = html;
  } catch (err) {
    console.error('Error loading alumni:', err);
    if (loadingIndicator) loadingIndicator.textContent = 'Could not load alumni.';
  }
});
