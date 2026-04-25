function initAdminPage() {
  const catInput = document.getElementById('new-category');
  const addCatBtn = document.getElementById('add-category-btn');
  const catTags = document.getElementById('category-tags');
  const topicInput = document.getElementById('new-topic');
  const addTopicBtn = document.getElementById('add-topic-btn');
  const topicTags = document.getElementById('topic-tags');
  const subCatInput = document.getElementById('new-subcategory');
  const addSubCatBtn = document.getElementById('add-subcategory-btn');
  const subCatTags = document.getElementById('subcategory-tags');
  const form = document.getElementById('link-form');
  const editIdEl = document.getElementById('edit-id');
  const titleEl = document.getElementById('link-title');
  const urlEl = document.getElementById('link-url');
  const descEl = document.getElementById('link-desc');
  const topicSelect = document.getElementById('link-topic');
  const catSelect = document.getElementById('link-category');
  const subCatSelect = document.getElementById('link-subcategory');
  const typeSelect = document.getElementById('link-type');
  const saveBtn = document.getElementById('save-btn');
  const cancelBtn = document.getElementById('cancel-btn');
  const formTitle = document.getElementById('form-title');
  const adminLinks = document.getElementById('admin-links');
  const adminEmpty = document.getElementById('admin-empty');

  if (!form) return;

  function renderCategoryTags() {
    const cats = getCategories();
    catTags.innerHTML = cats.map(c => `
      <span class="tag">${c} <button class="tag-remove" data-cat="${c}">×</button></span>
    `).join('') || '<span class="empty-msg">No categories yet</span>';

    catTags.querySelectorAll('.tag-remove').forEach(btn => {
      btn.addEventListener('click', () => {
        const cat = btn.dataset.cat;
        if (confirm(`Delete category "${cat}"? Links with this category won't be deleted.`)) {
          saveCategories(getCategories().filter(c => c !== cat));
          renderCategoryTags();
          populateCategoryDropdowns();
        }
      });
    });
  }

  function renderTopicTags() {
    const topics = getTopics();
    topicTags.innerHTML = topics.map(t => `
      <span class="tag tag-topic">${t} <button class="tag-remove" data-topic="${t}">×</button></span>
    `).join('') || '<span class="empty-msg">No topics yet</span>';

    topicTags.querySelectorAll('.tag-remove').forEach(btn => {
      btn.addEventListener('click', () => {
        const topic = btn.dataset.topic;
        if (confirm(`Delete topic "${topic}"? Links with this topic won't be deleted.`)) {
          saveTopics(getTopics().filter(t => t !== topic));
          renderTopicTags();
          populateTopicDropdowns();
        }
      });
    });
  }

  function renderSubCategoryTags() {
    const subs = getSubCategories();
    subCatTags.innerHTML = subs.map(s => `
      <span class="tag tag-sub">${s} <button class="tag-remove" data-sub="${s}">×</button></span>
    `).join('') || '<span class="empty-msg">No sub categories yet</span>';

    subCatTags.querySelectorAll('.tag-remove').forEach(btn => {
      btn.addEventListener('click', () => {
        const sub = btn.dataset.sub;
        if (confirm(`Delete sub category "${sub}"? Links with this sub category won't be deleted.`)) {
          saveSubCategories(getSubCategories().filter(s => s !== sub));
          renderSubCategoryTags();
          populateSubCategoryDropdowns();
        }
      });
    });
  }

  function renderAdminLinks() {
    const links = getLinks();
    if (links.length === 0) {
      adminLinks.innerHTML = '';
      adminEmpty.classList.remove('hidden');
      return;
    }
    adminEmpty.classList.add('hidden');
    adminLinks.innerHTML = links.map(l => `
      <div class="admin-link-row">
        <div class="admin-link-info">
          <span class="link-type">${TYPE_ICONS[l.type] || '🔗'}</span>
          <div>
            <strong>${l.title}</strong>
            <span class="admin-link-meta">${l.topic ? l.topic + ' › ' : ''}${l.category}${l.subCategory ? ' › ' + l.subCategory : ''}</span>
          </div>
        </div>
        <div class="admin-link-actions">
          <button class="btn btn-small btn-secondary" data-edit="${l.id}">✏️</button>
          <button class="btn btn-small btn-danger" data-delete="${l.id}">🗑️</button>
        </div>
      </div>
    `).join('');

    adminLinks.querySelectorAll('[data-edit]').forEach(btn => {
      btn.addEventListener('click', () => editLink(btn.dataset.edit));
    });
    adminLinks.querySelectorAll('[data-delete]').forEach(btn => {
      btn.addEventListener('click', () => {
        if (confirm('Delete this link?')) {
          deleteLink(btn.dataset.delete);
          renderAdminLinks();
        }
      });
    });
  }

  function editLink(id) {
    const link = getLinks().find(l => l.id === id);
    if (!link) return;
    editIdEl.value = id;
    titleEl.value = link.title;
    urlEl.value = link.url;
    descEl.value = link.description || '';
    topicSelect.value = link.topic || '';
    catSelect.value = link.category;
    subCatSelect.value = link.subCategory || '';
    typeSelect.value = link.type;
    formTitle.textContent = 'Edit Link';
    saveBtn.textContent = 'Update Link';
    cancelBtn.classList.remove('hidden');
    form.scrollIntoView({ behavior: 'smooth' });
  }

  function resetForm() {
    form.reset();
    editIdEl.value = '';
    formTitle.textContent = 'Add Link';
    saveBtn.textContent = 'Add Link';
    cancelBtn.classList.add('hidden');
  }

  addCatBtn.addEventListener('click', () => {
    const val = catInput.value.trim();
    if (!val) return;
    const cats = getCategories();
    cats.push(val);
    saveCategories(cats);
    catInput.value = '';
    renderCategoryTags();
    populateCategoryDropdowns();
  });

  catInput.addEventListener('keydown', e => { if (e.key === 'Enter') addCatBtn.click(); });

  addTopicBtn.addEventListener('click', () => {
    const val = topicInput.value.trim();
    if (!val) return;
    const topics = getTopics();
    topics.push(val);
    saveTopics(topics);
    topicInput.value = '';
    renderTopicTags();
    populateTopicDropdowns();
  });

  topicInput.addEventListener('keydown', e => { if (e.key === 'Enter') addTopicBtn.click(); });

  addSubCatBtn.addEventListener('click', () => {
    const val = subCatInput.value.trim();
    if (!val) return;
    const subs = getSubCategories();
    subs.push(val);
    saveSubCategories(subs);
    subCatInput.value = '';
    renderSubCategoryTags();
    populateSubCategoryDropdowns();
  });

  subCatInput.addEventListener('keydown', e => { if (e.key === 'Enter') addSubCatBtn.click(); });

  form.addEventListener('submit', e => {
    e.preventDefault();
    const data = {
      title: titleEl.value.trim(),
      url: urlEl.value.trim(),
      description: descEl.value.trim(),
      topic: topicSelect.value,
      category: catSelect.value,
      subCategory: subCatSelect.value,
      type: typeSelect.value,
    };
    if (editIdEl.value) {
      updateLink(editIdEl.value, data);
    } else {
      addLink(data);
    }
    resetForm();
    renderAdminLinks();
  });

  cancelBtn.addEventListener('click', resetForm);

  // Export
  document.getElementById('export-btn').addEventListener('click', () => {
    const data = { links: getLinks(), topics: getTopics(), categories: getCategories(), subCategories: getSubCategories() };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'learning-materials-backup.json';
    a.click();
  });

  // Import
  document.getElementById('import-file').addEventListener('change', e => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(reader.result);
        if (data.links) saveLinks(data.links);
        if (data.topics) saveTopics(data.topics);
        if (data.categories) saveCategories(data.categories);
        if (data.subCategories) saveSubCategories(data.subCategories);
        renderTopicTags();
        renderCategoryTags();
        renderSubCategoryTags();
        populateTopicDropdowns();
        populateCategoryDropdowns();
        populateSubCategoryDropdowns();
        renderAdminLinks();
        alert('Imported successfully!');
      } catch {
        alert('Invalid JSON file.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  });

  renderTopicTags();
  renderCategoryTags();
  renderSubCategoryTags();
  populateTopicDropdowns();
  populateCategoryDropdowns();
  populateSubCategoryDropdowns();
  renderAdminLinks();
}

document.addEventListener('DOMContentLoaded', initAdminPage);
