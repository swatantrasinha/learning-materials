const STORAGE_KEY = 'learningLinks';
const TOPICS_KEY = 'learningTopics';
const CATEGORIES_KEY = 'learningCategories';
const SUBCATEGORIES_KEY = 'learningSubCategories';

const TYPE_ICONS = { video: '🎬', article: '📄', course: '📚', other: '🔗' };

function getLinks() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
}

function saveLinks(links) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(links));
}

function getCategories() {
  return JSON.parse(localStorage.getItem(CATEGORIES_KEY) || '[]');
}

function saveCategories(cats) {
  localStorage.setItem(CATEGORIES_KEY, JSON.stringify([...new Set(cats)].sort()));
}

function getTopics() {
  return JSON.parse(localStorage.getItem(TOPICS_KEY) || '[]');
}

function saveTopics(topics) {
  localStorage.setItem(TOPICS_KEY, JSON.stringify([...new Set(topics)].sort()));
}

function getSubCategories() {
  return JSON.parse(localStorage.getItem(SUBCATEGORIES_KEY) || '[]');
}

function saveSubCategories(subs) {
  localStorage.setItem(SUBCATEGORIES_KEY, JSON.stringify([...new Set(subs)].sort()));
}

function addLink(link) {
  const links = getLinks();
  link.id = Date.now().toString();
  link.createdAt = new Date().toISOString();
  links.unshift(link);
  saveLinks(links);
  return link;
}

function updateLink(id, updates) {
  const links = getLinks().map(l => l.id === id ? { ...l, ...updates } : l);
  saveLinks(links);
}

function deleteLink(id) {
  saveLinks(getLinks().filter(l => l.id !== id));
}

function populateCategoryDropdowns() {
  const cats = getCategories();
  document.querySelectorAll('#category-filter, #link-category').forEach(sel => {
    const current = sel.value;
    const firstOption = sel.options[0].outerHTML;
    sel.innerHTML = firstOption + cats.map(c => `<option value="${c}">${c}</option>`).join('');
    sel.value = current;
  });
}

function populateTopicDropdowns() {
  const topics = getTopics();
  document.querySelectorAll('#topic-filter, #link-topic').forEach(sel => {
    const current = sel.value;
    const firstOption = sel.options[0].outerHTML;
    sel.innerHTML = firstOption + topics.map(t => `<option value="${t}">${t}</option>`).join('');
    sel.value = current;
  });
}

function populateSubCategoryDropdowns() {
  const subs = getSubCategories();
  document.querySelectorAll('#subcategory-filter, #link-subcategory').forEach(sel => {
    const current = sel.value;
    const firstOption = sel.options[0].outerHTML;
    sel.innerHTML = firstOption + subs.map(s => `<option value="${s}">${s}</option>`).join('');
    sel.value = current;
  });
}

// Browse page
function initBrowsePage() {
  const container = document.getElementById('links-container');
  if (!container) return;

  const searchEl = document.getElementById('search');
  const topicFilter = document.getElementById('topic-filter');
  const catFilter = document.getElementById('category-filter');
  const subCatFilter = document.getElementById('subcategory-filter');
  const typeFilter = document.getElementById('type-filter');

  function render() {
    const query = searchEl.value.toLowerCase();
    const topic = topicFilter.value;
    const cat = catFilter.value;
    const subCat = subCatFilter.value;
    const type = typeFilter.value;

    let links = getLinks().filter(l =>
      (!query || l.title.toLowerCase().includes(query)) &&
      (!topic || l.topic === topic) &&
      (!cat || l.category === cat) &&
      (!subCat || l.subCategory === subCat) &&
      (!type || l.type === type)
    );

    const emptyMsg = document.getElementById('empty-msg');

    if (links.length === 0) {
      container.innerHTML = '';
      emptyMsg.classList.remove('hidden');
      return;
    }

    emptyMsg.classList.add('hidden');

    // Group by category
    const grouped = {};
    links.forEach(l => {
      (grouped[l.category] = grouped[l.category] || []).push(l);
    });

    container.innerHTML = Object.keys(grouped).sort().map(cat => `
      <div class="category-section">
        <h2 class="category-heading">${cat}</h2>
        ${grouped[cat].map(l => `
          <a href="${l.url}" target="_blank" rel="noopener" class="link-card">
            <span class="link-type">${TYPE_ICONS[l.type] || '🔗'}</span>
            <div class="link-info">
              <span class="link-title">${l.title}</span>
              ${l.topic ? `<span class="link-topic">${l.topic}</span>` : ''}
              ${l.subCategory ? `<span class="link-sub">${l.subCategory}</span>` : ''}
              ${l.description ? `<span class="link-desc">${l.description}</span>` : ''}
            </div>
            <span class="link-arrow">↗</span>
          </a>
        `).join('')}
      </div>
    `).join('');
  }

  populateTopicDropdowns();
  populateCategoryDropdowns();
  populateSubCategoryDropdowns();
  render();
  searchEl.addEventListener('input', render);
  topicFilter.addEventListener('change', render);
  catFilter.addEventListener('change', render);
  subCatFilter.addEventListener('change', render);
  typeFilter.addEventListener('change', render);
}

document.addEventListener('DOMContentLoaded', initBrowsePage);
