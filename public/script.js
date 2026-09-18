let categoriesData = [];
let itemsData = [];
let materialsData = {}; // Stores raw material costs
let activeCategoryName = 'All';
let clearanceMode = false;
let cart = [];
let editingItemId = null; // Track if we are editing

document.addEventListener('DOMContentLoaded', () => {
  setupNavigation();
  fetchMaterialsData().then(() => {
    fetchMenuData();
  });
  setupPanelHandlers();
  setupBuilders();
  
  const clearanceToggle = document.getElementById('clearance-mode-toggle');
  if (clearanceToggle) {
    clearanceToggle.addEventListener('change', (e) => {
      clearanceMode = e.target.checked;
      renderItems();
      renderCart(); // Optional: updating cart items with clearance mode pricing? The prompt says "Ensure the shopping cart respects the discounted price".
    });
  }
});

function setupNavigation() {
  const navItems = document.querySelectorAll('.nav-item');
  const views = document.querySelectorAll('.view');

  navItems.forEach(item => {
    item.addEventListener('click', () => {
      navItems.forEach(n => n.classList.remove('active'));
      views.forEach(v => v.style.display = 'none');

      item.classList.add('active');
      const target = item.dataset.target;
      document.getElementById(target).style.display = 'block';
    });
  });
}

async function fetchMenuData() {
  try {
    const res = await fetch('/api/menu?t=' + new Date().getTime());
    const data = await res.json();
    
    if (data.error) {
      document.getElementById('items-container').innerHTML = `<p style="color:red">Error: ${data.error}.</p>`;
      return;
    }

    itemsData = data.items.filter(p => {
      const nameProp = p.properties.Item_Name || p.properties.Name || p.properties.title;
      const name = nameProp?.title?.[0]?.plain_text || '';
      return !name.includes('SYSTEM_');
    }).map(page => {
      const p = page.properties;
      const nameProp = p.Item_Name || p.Name || p.title;
      const name = nameProp?.title?.[0]?.plain_text || 'Unnamed Item';
      
      const priceProp = p.Base_Price || p.Price;
      const price = priceProp?.number || 0;
      
      const catProp = p.Category_ID || p.Category;
      const categoryName = catProp?.select?.name || 'Uncategorized';
      
      const inStock = p.Is_Active?.checkbox || false;
      const stock = p.Unit_Stock_Count?.number || 0;
      const lowStock = p.Low_Stock_Threshold?.number || 0;
      const dailyQuota = p.Daily_Quota?.number || 0;
      
      let bomRaw = null;
      if (p.Recipe_BOM_ID?.rich_text?.[0]) {
        try { bomRaw = JSON.parse(p.Recipe_BOM_ID.rich_text[0].plain_text); } catch(e){}
      }
      
      let imageUrl = '';
      if (p.Images?.files?.length > 0) {
        imageUrl = p.Images.files[0].external ? p.Images.files[0].external.url : p.Images.files[0].file.url;
      } else if (p.Image_URL?.url) {
        imageUrl = p.Image_URL.url;
      }

      return { id: page.id, name, price, categoryName, inStock, stock, lowStock, dailyQuota, bomRaw, imageUrl, raw: p };
    });

    // Use full predefined categories list so all tabs always show
    const fullCategories = [
      "Hollow Crisp Shells",
      "Flat Crisps & Edible Tart Bases",
      "Puffed Grain & Light Mixes",
      "Griddle-Fried Patties & Warm Cutlet Chaats",
      "Stuffed Pastries & Giant Kachoris",
      "Yogurt-Soaked Lentil Dumplings",
      "Crispy Battered Leaf & Fried Veg Chaats",
      "Boiled Legumes Sprouts & Protein Bases",
      "Roasted Roots & Fresh Fruit Chaats",
      "Regional Specialties",
      "Fusion & Modern Chaats"
    ];
    
    // Also include any other unexpected categories found in the DB just in case
    const categorySet = new Set(fullCategories);
    itemsData.forEach(item => {
      if (item.categoryName) categorySet.add(item.categoryName);
    });
    categoriesData = Array.from(categorySet);

    renderCategories();
    renderItems();
    renderAnalytics();
  } catch (err) {
    console.error(err);
    document.getElementById('items-container').innerHTML = `<p style="color:red">Failed to load menu data.</p>`;
  }
}

async function fetchMaterialsData() {
  try {
    const res = await fetch('/api/materials?t=' + new Date().getTime());
    const data = await res.json();
    materialsData = data || {};
  } catch (err) {
    console.error("Failed to load materials data:", err);
    materialsData = {};
  }
}

const categoryIcons = {
  "All Items": `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right:6px; opacity:0.8; margin-top:-2px;"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>`,
  "Hollow Crisp Shells": `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right:6px; opacity:0.8; margin-top:-2px;"><circle cx="12" cy="12" r="8"></circle></svg>`,
  "Flat Crisps & Edible Tart Bases": `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right:6px; opacity:0.8; margin-top:-2px;"><path d="M4 12h16M4 16h16M4 8h16"></path></svg>`,
  "Puffed Grain & Light Mixes": `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right:6px; opacity:0.8; margin-top:-2px;"><path d="M12 2v20M2 12h20M7 7l10 10M17 7L7 17"></path></svg>`,
  "Griddle-Fried Patties & Warm Cutlet Chaats": `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right:6px; opacity:0.8; margin-top:-2px;"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>`,
  "Stuffed Pastries & Giant Kachoris": `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right:6px; opacity:0.8; margin-top:-2px;"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path></svg>`,
  "Yogurt-Soaked Lentil Dumplings": `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right:6px; opacity:0.8; margin-top:-2px;"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"></path></svg>`,
  "Crispy Battered Leaf & Fried Veg Chaats": `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right:6px; opacity:0.8; margin-top:-2px;"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"></path><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"></path></svg>`,
  "Boiled Legumes Sprouts & Protein Bases": `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right:6px; opacity:0.8; margin-top:-2px;"><circle cx="12" cy="12" r="5"></circle><path d="M12 7v-5"></path><path d="M12 17v5"></path></svg>`,
  "Roasted Roots & Fresh Fruit Chaats": `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right:6px; opacity:0.8; margin-top:-2px;"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"></path><path d="M12 6v6l4 4"></path></svg>`,
  "Regional Specialties": `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right:6px; opacity:0.8; margin-top:-2px;"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>`,
  "Fusion & Modern Chaats": `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right:6px; opacity:0.8; margin-top:-2px;"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>`
};

function renderCategories() {
  const posRibbon = document.getElementById('pos-categories');
  const galleryRibbon = document.getElementById('gallery-categories');
  
  if (!posRibbon || !galleryRibbon) return;

  const iconAll = categoryIcons["All Items"];
  let html = `<button class="category-btn ${activeCategoryName === 'All' ? 'active' : ''}" data-category="All">${iconAll}All Items</button>`;
  
  categoriesData.forEach(cat => {
    if (!cat) return;
    const isActive = activeCategoryName === cat ? 'active' : '';
    const icon = categoryIcons[cat] || '';
    html += `<button class="category-btn ${isActive}" data-category="${cat}" style="display:flex; align-items:center;">${icon}${cat}</button>`;
  });

  posRibbon.innerHTML = html;
  galleryRibbon.innerHTML = html;

  setupCategoryListeners();
}

function setupCategoryListeners() {
  document.querySelectorAll('.category-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      // Find all buttons with same category across the app
      const cat = e.target.dataset.category;
      document.querySelectorAll('.category-btn').forEach(b => {
        if (b.dataset.category === cat) {
          b.classList.add('active');
        } else {
          b.classList.remove('active');
        }
      });
      activeCategoryName = cat;
      renderItems();
    });
  });
}

function renderItems() {
  const posContainer = document.getElementById('items-container');
  const galleryContainer = document.getElementById('gallery-grid');
  
  posContainer.innerHTML = '';
  galleryContainer.innerHTML = '';
  
  // 1. Render POS (Grid View)
  const filteredItems = activeCategoryName === 'All' 
    ? itemsData 
    : itemsData.filter(item => item.categoryName === activeCategoryName);

  filteredItems.forEach(item => {
    const isOut = !item.inStock || (item.stock !== undefined && item.stock !== null && item.stock <= 0 && item.raw.Item_Nature?.select?.name === 'Pre-Made');
    
    let statusHtml = '';
    if (isOut) {
      statusHtml = '<span class="status" style="color:#ff3b30; font-weight:600; text-align:center; padding:10px 0;">Out of Stock</span>';
    } else if (item.stock > 0 && item.lowStock > 0 && item.stock <= item.lowStock) {
      statusHtml = `<span style="background:#fff3e0; color:#ff9800; padding:4px 8px; border-radius:6px; font-size:11px; font-weight:700;">Only ${item.stock} Left!</span>`;
    }

    const imgHtml = item.imageUrl ? `<img onerror="this.style.display='none'" src="${item.imageUrl}" style="width:100%; height:130px; object-fit:cover; border-radius:12px; margin-bottom:12px;">` : '';
    
    const isPreMade = item.raw.Item_Nature?.select?.name === 'Pre-Made';
    let currentPrice = item.price;
    let priceHtml = `<span class="price" style="font-weight:600;">₹${currentPrice.toFixed(2)}</span>`;
    
    if (clearanceMode && isPreMade) {
      currentPrice = item.price * 0.8;
      priceHtml = `
        <div style="display:flex; flex-direction:column; align-items:flex-end;">
          <del style="color:#888; font-size:12px;">₹${item.price.toFixed(2)}</del>
          <span class="price" style="font-weight:700; color:#e65100;">₹${currentPrice.toFixed(2)}</span>
        </div>
      `;
    }

    const posCardHTML = `
      ${imgHtml}
      <div style="flex:1; display:flex; flex-direction:column; justify-content:flex-end;">
        <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom: 8px;">
          <h3 style="margin:0; font-size:16px;">${item.name}</h3>
          ${priceHtml}
        </div>
        ${statusHtml && !isOut ? `<div style="margin-bottom:8px;">${statusHtml}</div>` : ''}
        
        ${isOut ? statusHtml : `
          <div style="display:flex; justify-content:flex-end; margin-top: auto;">
            <div style="display:flex; width:70px; background:#f5f5f7; border-radius:8px; padding:2px; align-items:center;">
              <input type="number" class="qty-custom" min="1" placeholder="1" value="1" style="flex:1; width:100%; min-width:0; background:transparent; border:none; text-align:center; font-size:14px; font-weight:600; padding:2px 0; outline:none; box-shadow:none; -moz-appearance:textfield; -webkit-appearance:none;">
              <button class="qty-custom-btn" style="background:#0071e3; color:white; border:none; border-radius:6px; width:24px; height:24px; display:flex; align-items:center; justify-content:center; font-weight:700; font-size:16px; cursor:pointer; margin-right:2px; padding:0;">+</button>
            </div>
          </div>
        `}
      </div>
    `;

    const posCard = document.createElement('div');
    posCard.className = `item-card ${isOut ? 'out-of-stock' : ''}`;
    posCard.innerHTML = posCardHTML;
    
    if (!isOut) {
      const customBtn = posCard.querySelector('.qty-custom-btn');
      const customInput = posCard.querySelector('.qty-custom');
      
      customBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const qty = parseInt(customInput.value);
        if (qty && qty > 0) {
          addToCart(item, qty, currentPrice);
          customInput.value = '1';
          showFeedback(customBtn);
        }
      });
    }
    posContainer.appendChild(posCard);
  });

  // 2. Render Gallery (List View Grouped by Category)
  galleryContainer.style.display = 'block'; // override grid css if necessary
  
  const categoriesToRender = activeCategoryName === 'All' ? categoriesData : [activeCategoryName];
  
  categoriesToRender.forEach(cat => {
    const itemsInCat = itemsData.filter(item => item.categoryName === cat);
    if (itemsInCat.length === 0) return;
    
    const catHeader = document.createElement('h3');
    catHeader.style.cssText = "margin: 32px 0 16px 0; font-size: 20px; font-weight: 600; color: var(--text-primary); border-bottom: 1px solid #e5e5ea; padding-bottom: 8px;";
    catHeader.innerText = cat;
    galleryContainer.appendChild(catHeader);
    
    const listDiv = document.createElement('div');
    listDiv.style.cssText = "display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 16px;";
    
    itemsInCat.forEach(item => {
      const isOut = !item.inStock || (item.stock !== undefined && item.stock !== null && item.stock <= 0 && item.raw.Item_Nature?.select?.name === 'Pre-Made');
      
      let statusHtml = '';
      if (isOut) {
        statusHtml = '<span style="color:#ff3b30; font-weight:600; font-size:12px; background:#fff2f2; padding:4px 8px; border-radius:6px;">Out of Stock</span>';
      } else if (item.stock > 0 && item.lowStock > 0 && item.stock <= item.lowStock) {
        statusHtml = `<span style="color:#ff9800; font-weight:600; font-size:12px; background:#fff3e0; padding:4px 8px; border-radius:6px;">Low Stock (${item.stock})</span>`;
      } else {
        statusHtml = '<span style="color:#34c759; font-weight:600; font-size:12px; background:#e8f8ec; padding:4px 8px; border-radius:6px;">In Stock</span>';
      }
      
      const imgHtml = item.imageUrl 
        ? `<img onerror="this.style.display='none'" src="${item.imageUrl}" style="width:56px; height:56px; object-fit:cover; border-radius:10px;">` 
        : `<div style="width:56px; height:56px; border-radius:10px; background:#f5f5f7; display:flex; align-items:center; justify-content:center; color:#888; font-size:11px;">No Img</div>`;
      
      const row = document.createElement('div');
      row.style.cssText = `
        display: flex; 
        align-items: center; 
        padding: 12px 16px; 
        background: #ffffff; 
        border-radius: 12px; 
        box-shadow: 0 1px 3px rgba(0,0,0,0.05); 
        cursor: pointer;
        transition: transform 0.2s, box-shadow 0.2s;
        border: 1px solid #f5f5f7;
        ${isOut ? 'opacity: 0.6;' : ''}
      `;
      row.onmouseover = () => { row.style.transform = 'scale(1.01)'; row.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)'; };
      row.onmouseout = () => { row.style.transform = 'none'; row.style.boxShadow = '0 1px 3px rgba(0,0,0,0.05)'; };
      row.onclick = () => openEditPanel(item);
      
      row.innerHTML = `
        ${imgHtml}
        <div style="flex:1; margin-left: 16px;">
          <h4 style="margin:0 0 4px 0; font-size:16px; font-weight:600; color:#1d1d1f;">${item.name}</h4>
          <div style="font-size:14px; color:#555; font-weight:500;">₹${item.price.toFixed(2)}</div>
        </div>
        <div style="margin-right: 16px;">
          ${statusHtml}
        </div>
        <div style="color: #c7c7cc;">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18l6-6-6-6"/></svg>
        </div>
      `;
      listDiv.appendChild(row);
    });
    
    galleryContainer.appendChild(listDiv);
  });
}

function showFeedback(btn) {
  const originalText = btn.innerText;
  const originalBg = btn.style.background;
  const originalColor = btn.style.color;
  
  btn.innerText = "✓";
  btn.style.background = "#34c759";
  btn.style.color = "white";
  
  setTimeout(() => {
    btn.innerText = originalText;
    btn.style.background = originalBg;
    btn.style.color = originalColor;
  }, 400);
}

function addToCart(item, qty = 1, currentPrice = null) {
  const priceToUse = currentPrice !== null ? currentPrice : item.price;
  const existing = cart.find(c => c.id === item.id && c.currentPrice === priceToUse);
  
  if (existing) {
    existing.qty += qty;
  } else {
    cart.push({ ...item, qty: qty, currentPrice: priceToUse });
  }
  renderCart();
}

function renderCart() {
  const container = document.getElementById('cart-container');
  container.innerHTML = '';
  let total = 0;

  function getQtyColorStyles(qty) {
    const max = 10;
    const q = Math.min(qty, max);
    const hue = 120 - ((q - 1) * (120 / (max - 1)));
    return `background: hsl(${hue}, 80%, 90%); color: hsl(${hue}, 80%, 30%); padding: 2px 8px; border-radius: 10px; font-weight: 700; font-size: 13px;`;
  }

  cart.forEach((item, index) => {
    const price = item.currentPrice || item.price;
    const itemTotal = price * item.qty;
    total += itemTotal;
    
    container.innerHTML += `
      <div class="cart-item">
        <span class="cart-item-name">${item.name}</span>
        <span class="cart-item-qty" style="${getQtyColorStyles(item.qty)}">x${item.qty}</span>
        <span class="cart-item-price">₹${itemTotal.toFixed(2)}</span>
      </div>
    `;
  });

  document.getElementById('cart-total').innerText = `₹${total.toFixed(2)}`;
}

// Kitchen Display System Routing
const stationMapping = {
  "Hollow Crisp Shells": "Cold Prep",
  "Flat Crisps & Edible Tart Bases": "Cold Prep",
  "Puffed Grain & Light Mixes": "Cold Prep",
  "Griddle-Fried Patties & Warm Cutlet Chaats": "Hot Station",
  "Stuffed Pastries & Giant Kachoris": "Hot Station",
  "Yogurt-Soaked Lentil Dumplings": "Cold Prep",
  "Crispy Battered Leaf & Fried Veg Chaats": "Hot Station",
  "Boiled Legumes Sprouts & Protein Bases": "Cold Prep",
  "Roasted Roots & Fresh Fruit Chaats": "Cold Prep",
  "Regional Specialties": "Hot Station",
  "Fusion & Modern Chaats": "Hot Station"
};

document.querySelector('.checkout-btn').addEventListener('click', () => {
  if (cart.length === 0) {
    alert("Cart is empty!");
    return;
  }
  
  const tickets = { "Hot Station": [], "Cold Prep": [], "Uncategorized": [] };
  
  cart.forEach(item => {
    const station = stationMapping[item.categoryName] || "Uncategorized";
    tickets[station].push(item);
  });
  
  // Create a sleek KDS modal
  let ticketHTML = `<div style="padding:20px; text-align:left;">
    <h2 style="font-size:20px; font-weight:600; margin-bottom:20px;">Kitchen Routing Ticket</h2>
    <div style="display:flex; gap:20px;">
  `;
  
  ["Hot Station", "Cold Prep", "Uncategorized"].forEach(station => {
    if (tickets[station].length > 0) {
      ticketHTML += `
        <div style="flex:1; background:#f9f9fb; padding:15px; border-radius:12px; border:1px solid #e5e5ea;">
          <h3 style="font-size:16px; font-weight:700; margin-top:0; color:${station === 'Hot Station' ? '#ff3b30' : '#007aff'}">${station}</h3>
          <ul style="list-style:none; padding:0; margin:0;">
      `;
      tickets[station].forEach(item => {
        ticketHTML += `<li style="padding:8px 0; border-bottom:1px solid #e5e5ea; display:flex; justify-content:space-between;">
          <span style="font-weight:500;">${item.name}</span>
          <span style="font-weight:700;">x${item.qty}</span>
        </li>`;
      });
      ticketHTML += `</ul></div>`;
    }
  });
  
  ticketHTML += `</div><button id="close-kds" style="margin-top:20px; width:100%; padding:12px; background:#007aff; color:white; border:none; border-radius:8px; font-weight:600; cursor:pointer;">Send to Kitchen & Clear</button></div>`;
  
  const modal = document.createElement('div');
  modal.style.cssText = "position:fixed; top:0; left:0; width:100vw; height:100vh; background:rgba(0,0,0,0.4); display:flex; align-items:center; justify-content:center; z-index:9999; backdrop-filter:blur(5px);";
  const content = document.createElement('div');
  content.style.cssText = "background:white; padding:10px; border-radius:16px; width:600px; max-width:90vw; box-shadow:0 20px 40px rgba(0,0,0,0.2);";
  content.innerHTML = ticketHTML;
  modal.appendChild(content);
  document.body.appendChild(modal);
  
  document.getElementById('close-kds').addEventListener('click', () => {
    document.body.removeChild(modal);
    cart = [];
    renderCart();
  });
});

// JSON Builder Logic
function setupBuilders() {
  const bomList = document.getElementById('bom-list');
  const addonsList = document.getElementById('addons-list');

  document.getElementById('add-bom-btn').addEventListener('click', () => addBomRow());
  document.getElementById('add-addon-btn').addEventListener('click', () => addAddonRow());
}

function addBomRow(ingredient = '', qty = '', unit = 'g') {
  const bomList = document.getElementById('bom-list');
  const block = document.createElement('div');
  block.className = 'builder-row';
  block.style.cssText = "display:flex; gap:8px; margin-bottom:8px; position:relative;";
  
  const options = ['g', 'ml', 'pcs', 'kg', 'L'].map(u => 
    `<option value="${u}" ${u === unit ? 'selected' : ''}>${u}</option>`
  ).join('');

  block.innerHTML = `
    <input type="text" placeholder="Ingredient (e.g. onion)" class="bom-key" value="${ingredient}" style="flex:2; padding:8px; border:1px solid #d2d2d7; border-radius:8px;">
    <input type="number" placeholder="Qty" class="bom-val" value="${qty}" style="flex:1; padding:8px; border:1px solid #d2d2d7; border-radius:8px;">
    <select class="bom-unit" style="flex:1; padding:8px; border:1px solid #d2d2d7; border-radius:8px;">
      ${options}
    </select>
    <button type="button" class="remove-row-btn" title="Remove" style="background:transparent; border:none; color:#ff3b30; font-size:20px; cursor:pointer;">&times;</button>
  `;
  
  block.querySelector('.remove-row-btn').onclick = () => block.remove();
  bomList.appendChild(block);
}

function addAddonRow(id = '', price = '') {
  const addonsList = document.getElementById('addons-list');
  const row = document.createElement('div');
  row.className = 'builder-row';
  row.innerHTML = `
    <input type="text" placeholder="Add-on ID (e.g. MOD-12)" class="addon-id" value="${id}">
    <input type="number" placeholder="Price (e.g. 40)" class="addon-price" value="${price}">
    <button type="button" class="remove-row-btn" title="Remove">&times;</button>
  `;
  row.querySelector('.remove-row-btn').onclick = () => row.remove();
  addonsList.appendChild(row);
}

function openEditPanel(item) {
  editingItemId = item.id;
  const p = item.raw;

  document.querySelector('#add-panel h2').innerText = "Edit Menu Item";
  document.getElementById('add-panel').classList.add('open');
  document.getElementById('add-item-form').reset();
  document.getElementById('bom-list').innerHTML = '';
  document.getElementById('addons-list').innerHTML = '';
  document.getElementById('image_preview').innerHTML = '';

  // Populate basic fields
  document.getElementById('Item_Name').value = item.name;
  document.getElementById('Base_Price').value = item.price;
  
  // Show existing images in preview
  const fileInput = document.getElementById('Image_Files');
  if (p.Images?.files?.length > 0) {
    p.Images.files.forEach(f => {
      const url = f.external?.url || f.file?.url;
      if (url) {
        document.getElementById('image_preview').innerHTML += `<img onerror="this.style.display='none'" src="${url}" style="height:60px; width:60px; object-fit:cover; border-radius:4px;">`;
      }
    });
    fileInput.required = false;
  } else if (item.imageUrl) {
    document.getElementById('image_preview').innerHTML = `<img onerror="this.style.display='none'" src="${item.imageUrl}" style="height:60px; width:60px; object-fit:cover; border-radius:4px;">`;
    fileInput.required = false;
  } else {
    fileInput.required = true;
  }
  
  if (p.Item_ID?.rich_text?.[0]) document.getElementById('Item_ID').value = p.Item_ID.rich_text[0].plain_text;
  if (p.Category_ID?.select) document.getElementById('Category_ID').value = p.Category_ID.select.name;
  if (p.Menu_Type?.select) document.getElementById('Menu_Type').value = p.Menu_Type.select.name;
  if (p.Item_Nature?.select) document.getElementById('Item_Nature').value = p.Item_Nature.select.name;
  if (p.Tax_Tier_ID?.rich_text?.[0]) document.getElementById('Tax_Tier_ID').value = p.Tax_Tier_ID.rich_text[0].plain_text;
  if (p.Cost_Of_Goods?.number !== undefined) document.getElementById('COGS').value = p.Cost_Of_Goods.number;
  if (p.Unit_Stock_Count?.number !== undefined) document.getElementById('Unit_Stock_Count').value = p.Unit_Stock_Count.number;
  if (p.Low_Stock_Threshold?.number !== undefined) document.getElementById('Low_Stock_Threshold').value = p.Low_Stock_Threshold.number;
  if (p.Prep_Time_Mins?.number !== undefined) document.getElementById('Prep_Time_Mins').value = p.Prep_Time_Mins.number;
  
  document.getElementById('Is_Active').checked = item.inStock;

  // Populate BOM
  document.getElementById('Manual_Weekly_Forecast_Toggle').checked = false;
  document.getElementById('Manual_Forecast_Container').style.display = 'none';
  document.getElementById('Weekly_Forecast').value = '';
  // Clear UI
  ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].forEach(d => document.getElementById(`Quota_${d}`).value = '');

  if (p.Recipe_BOM_ID?.rich_text?.[0]) {
    try {
      const bom = JSON.parse(p.Recipe_BOM_ID.rich_text[0].plain_text);
      if (bom && typeof bom === 'object' && (bom.ingredients || bom.dailyQuotas)) {
        // New structure with forecast wrapper
        if (bom.ingredients) {
          bom.ingredients.forEach(b => addBomRow(b.ingredient, b.qty, b.unit));
        }
        
        if (bom.dailyQuotas) {
          ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].forEach(d => {
            if (bom.dailyQuotas[d] !== undefined) document.getElementById(`Quota_${d}`).value = bom.dailyQuotas[d];
          });
        }
        
        if (bom.manualWeeklyQty !== undefined && bom.manualWeeklyQty !== null) {
          document.getElementById('Manual_Weekly_Forecast_Toggle').checked = true;
          document.getElementById('Manual_Forecast_Container').style.display = 'block';
          document.getElementById('Weekly_Forecast').value = bom.manualWeeklyQty;
        }
      } else if (Array.isArray(bom)) {
        // Old Array structure
        bom.forEach(b => addBomRow(b.ingredient, b.qty, b.unit));
      } else {
        // Legacy object structure
        for (const [key, val] of Object.entries(bom)) addBomRow(key, val, 'g');
      }
    } catch(e) {}
  }

  // Populate Addons
  if (p.Add_Ons_Allowed?.rich_text?.[0]) {
    try {
      const addons = JSON.parse(p.Add_Ons_Allowed.rich_text[0].plain_text);
      addons.forEach(a => addAddonRow(a.id, a.price));
    } catch(e) {}
  }
}


// Full Page Modal Logic
function setupPanelHandlers() {
  const panel = document.getElementById('add-panel');
  const openBtn = document.getElementById('open-add-panel-btn');
  const cancelBtn = document.getElementById('cancel-panel-btn');
  const form = document.getElementById('add-item-form');
  const saveBtn = document.getElementById('save-panel-btn');
  const fileInput = document.getElementById('Image_Files');
  const preview = document.getElementById('image_preview');

  document.getElementById('Manual_Weekly_Forecast_Toggle').addEventListener('change', (e) => {
    document.getElementById('Manual_Forecast_Container').style.display = e.target.checked ? 'block' : 'none';
  });

  fileInput.addEventListener('change', () => {
    if (fileInput.files.length > 5) {
      alert("You can only upload up to 5 images.");
      fileInput.value = '';
      preview.innerHTML = '';
      return;
    }
    preview.innerHTML = '';
    Array.from(fileInput.files).forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        preview.innerHTML += `<img onerror="this.style.display='none'" src="${e.target.result}" style="height:60px; width:60px; object-fit:cover; border-radius:4px;">`;
      };
      reader.readAsDataURL(file);
    });
  });

  function openPanelNew() {
    editingItemId = null;
    document.querySelector('#add-panel h2').innerText = "New Menu Item";
    panel.classList.add('open');
    form.reset();
    document.getElementById('bom-list').innerHTML = '';
    document.getElementById('addons-list').innerHTML = '';
    preview.innerHTML = '';
    fileInput.required = true;
  }

  function closePanel() {
    panel.classList.remove('open');
    form.reset();
    preview.innerHTML = '';
  }

  openBtn.addEventListener('click', openPanelNew);
  cancelBtn.addEventListener('click', closePanel);

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    saveBtn.innerText = 'Saving...';
    saveBtn.disabled = true;

    // Read selected files
    const uploadedImages = [];
    if (fileInput.files.length > 0) {
      for (const file of fileInput.files) {
        const base64 = await new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = e => resolve(e.target.result);
          reader.readAsDataURL(file);
        });
        uploadedImages.push({ name: file.name, data: base64 });
      }
    }

    const bomIngredients = [];
    document.querySelectorAll('#bom-list .builder-row').forEach(row => {
      const ingredient = row.querySelector('.bom-key').value.trim();
      const qty = Number(row.querySelector('.bom-val').value);
      const unit = row.querySelector('.bom-unit').value;
      if (ingredient && qty) bomIngredients.push({ ingredient, qty, unit });
    });

    const bomPayload = { 
      ingredients: bomIngredients,
      dailyQuotas: {}
    };
    
    ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].forEach(d => {
      bomPayload.dailyQuotas[d] = Number(document.getElementById(`Quota_${d}`).value) || 0;
    });

    if (document.getElementById('Manual_Weekly_Forecast_Toggle').checked) {
      const val = document.getElementById('Weekly_Forecast').value;
      if (val !== '') {
        bomPayload.manualWeeklyQty = Number(val);
      }
    }

    const addonsData = [];
    document.querySelectorAll('#addons-list .builder-row').forEach(row => {
      const id = row.querySelector('.addon-id').value.trim();
      const price = row.querySelector('.addon-price').value;
      if (id) addonsData.push({ id, price: Number(price) });
    });

    const payload = {
      Item_Name: document.getElementById('Item_Name').value,
      Item_ID: document.getElementById('Item_ID').value,
      Base_Price: document.getElementById('Base_Price').value,
      Uploaded_Images: uploadedImages,
      Category_ID: document.getElementById('Category_ID').value,
      Menu_Type: document.getElementById('Menu_Type').value,
      Item_Nature: document.getElementById('Item_Nature').value,
      Tax_Tier_ID: document.getElementById('Tax_Tier_ID').value,
      COGS: document.getElementById('COGS').value,
      Unit_Stock_Count: document.getElementById('Unit_Stock_Count').value,
      Daily_Quota: Math.round(['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].reduce((sum, d) => sum + (Number(document.getElementById(`Quota_${d}`).value) || 0), 0) / 7),
      Low_Stock_Threshold: document.getElementById('Low_Stock_Threshold').value,
      Prep_Time_Mins: document.getElementById('Prep_Time_Mins').value,
      Recipe_BOM_ID: (bomIngredients.length > 0 || Object.values(bomPayload.dailyQuotas).some(q => q > 0) || bomPayload.manualWeeklyQty) ? JSON.stringify(bomPayload) : '',
      Add_Ons_Allowed: addonsData.length > 0 ? JSON.stringify(addonsData) : '',
      Is_Active: document.getElementById('Is_Active').checked
    };

    try {
      const endpoint = editingItemId ? `/api/menu/${editingItemId}` : `/api/menu`;
      const method = editingItemId ? 'PATCH' : 'POST';

      const res = await fetch(endpoint, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        alert("Error saving item: " + (data.error || "Unknown error"));
      } else {
        closePanel();
        await fetchMenuData(); 
      }
    } catch (err) {
      alert("Network error: " + err.message);
    } finally {
      saveBtn.innerText = 'Save';
      saveBtn.disabled = false;
    }
  });
}

// PO Logic
document.getElementById('generate-po-btn').addEventListener('click', () => {
  const totals = {};
  
  itemsData.forEach(item => {
    if (!item.inStock || !item.bomRaw) return;
    
    let weeklyTarget = item.dailyQuota * 7;
    let ingredientsArray = [];
    
    if (item.bomRaw && typeof item.bomRaw === 'object' && (item.bomRaw.ingredients || item.bomRaw.dailyQuotas)) {
      // New wrapper format
      ingredientsArray = item.bomRaw.ingredients || [];
      
      // Calculate auto-forecast from sum of 7 days if they exist
      if (item.bomRaw.dailyQuotas) {
        let sum = 0;
        Object.values(item.bomRaw.dailyQuotas).forEach(v => sum += Number(v));
        weeklyTarget = sum;
      }
      
      // Override with manual weekly qty if specified
      if (item.bomRaw.manualWeeklyQty !== undefined && item.bomRaw.manualWeeklyQty !== null) {
        weeklyTarget = Number(item.bomRaw.manualWeeklyQty);
      }
    } else if (Array.isArray(item.bomRaw)) {
      // Old array format
      ingredientsArray = item.bomRaw;
    }
    
    if (weeklyTarget <= 0) return;
    
    if (ingredientsArray.length > 0) {
      ingredientsArray.forEach(ing => {
        const key = `${ing.ingredient.toLowerCase()}_${ing.unit}`;
        if (!totals[key]) totals[key] = { name: ing.ingredient, unit: ing.unit, qty: 0 };
        totals[key].qty += ing.qty * weeklyTarget;
      });
    } else {
      // Fallback for old objects
      for (const [ingredient, qty] of Object.entries(item.bomRaw)) {
        const key = `${ingredient.toLowerCase()}_g`;
        if (!totals[key]) totals[key] = { name: ingredient, unit: 'g', qty: 0 };
        totals[key].qty += Number(qty) * weeklyTarget;
      }
    }
  });
  
  const container = document.getElementById('po-results');
  const items = Object.values(totals);
  
  if (items.length === 0) {
    container.innerHTML = '<span style="color:#ff3b30;">No raw materials needed based on current forecasts.</span>';
    return;
  }
  
  const dateStr = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  const poNumber = "PO-" + Date.now().toString().slice(-6);

  let html = `
    <div class="po-slip-container">
      <div class="po-slip-header" style="display:none;">
        <div style="display:flex; justify-content:space-between; margin-bottom: 30px; border-bottom: 2px solid #000; padding-bottom: 10px;">
          <div>
            <h1 style="margin:0; font-size:28px; letter-spacing:1px; text-transform:uppercase;">Purchase Order</h1>
            <p style="margin:4px 0 0 0; color:#555;">Date: ${dateStr}</p>
            <p style="margin:4px 0 0 0; color:#555;">PO #: ${poNumber}</p>
          </div>
          <div style="text-align:right;">
            <h2 style="margin:0; font-size:20px;">[Your Company Name]</h2>
            <p style="margin:4px 0 0 0; color:#555;">123 Business Rd, Suite 100</p>
            <p style="margin:4px 0 0 0; color:#555;">City, State 12345</p>
          </div>
        </div>
        
        <div style="display:flex; justify-content:space-between; margin-bottom: 40px;">
          <div style="width:45%;">
            <h3 style="margin:0 0 8px 0; font-size:14px; text-transform:uppercase; color:#888; border-bottom:1px solid #ddd; padding-bottom:4px;">Vendor (To)</h3>
            <p style="margin:0; font-weight:600;">Primary Raw Materials Supplier</p>
            <p style="margin:4px 0 0 0;">456 Market Street</p>
            <p style="margin:4px 0 0 0;">Supplier City, State 67890</p>
          </div>
          <div style="width:45%;">
            <h3 style="margin:0 0 8px 0; font-size:14px; text-transform:uppercase; color:#888; border-bottom:1px solid #ddd; padding-bottom:4px;">Delivery Address (Ship To)</h3>
            <p style="margin:0; font-weight:600;">[Your Company Name]</p>
            <p style="margin:4px 0 0 0;">123 Business Rd, Suite 100</p>
            <p style="margin:4px 0 0 0;">City, State 12345</p>
          </div>
        </div>
      </div>

      <table class="po-table" style="width:100%; border-collapse:collapse; margin-top:0;">
        <thead>
          <tr style="border-bottom:2px solid #d2d2d7; text-align:left;">
            <th style="padding:12px 0; font-weight:600; color:var(--text-secondary);">Ingredient</th>
            <th style="padding:12px 0; font-weight:600; color:var(--text-secondary); text-align:right;">Required Quantity</th>
          </tr>
        </thead>
        <tbody>
  `;
  
  items.sort((a,b) => a.name.localeCompare(b.name)).forEach(item => {
    html += `
      <tr style="border-bottom:1px solid #e5e5ea;">
        <td style="padding:12px 0; font-weight:500;">${item.name}</td>
        <td style="padding:12px 0; text-align:right; font-weight:700;">${item.qty.toLocaleString()} ${item.unit}</td>
      </tr>
    `;
  });
  
  html += `</tbody></table>
      
      <div class="po-slip-footer" style="display:none; margin-top: 60px;">
        <div style="display:flex; justify-content:space-between;">
          <div style="width: 40%; border-top: 1px solid #000; padding-top: 8px;">
            <p style="margin:0; font-weight:600;">Authorized Signature</p>
          </div>
          <div style="width: 40%; border-top: 1px solid #000; padding-top: 8px;">
            <p style="margin:0; font-weight:600;">Date</p>
          </div>
        </div>
      </div>
    </div> <!-- end po-slip-container -->
    
    <div style="margin-top:24px; text-align:right;" class="no-print">
      <button class="btn btn-secondary" onclick="window.print()">Print Purchase Order</button>
    </div>
  `;
  
  container.innerHTML = html;
});

// --- Analytics & Profitability ---
function renderAnalytics() {
  const materialsContainer = document.getElementById('materials-container');
  const marginsContainer = document.getElementById('margins-container');
  
  if (!materialsContainer || !marginsContainer) return;
  
  // 1. Gather all unique raw materials from all items' BOMs
  const uniqueMaterials = new Set();
  itemsData.forEach(item => {
    if (item.bomRaw && item.bomRaw.ingredients && Array.isArray(item.bomRaw.ingredients)) {
      item.bomRaw.ingredients.forEach(ing => {
        const ingName = ing.ingredient || ing.name;
        if (ing && ingName) uniqueMaterials.add(String(ingName).trim());
      });
    }
  });
  
  const sortedMaterials = Array.from(uniqueMaterials).sort();
  
  // 2. Render Raw Material Inputs
  let materialsHtml = '';
  if (sortedMaterials.length === 0) {
    materialsHtml = '<p style="color:#888;">No raw materials found in any BOMs.</p>';
  } else {
    sortedMaterials.forEach(mat => {
      const currentPrice = materialsData[mat] || 0;
      materialsHtml += `
        <div style="display:flex; justify-content:space-between; align-items:center; border-bottom: 1px solid #f5f5f7; padding-bottom: 8px;">
          <div style="display:flex; flex-direction:column;">
            <label style="font-size:14px; color:#1d1d1f; font-weight:600;">${mat}</label>
            <span style="font-size:11px; color:#888;">Cost per KG / L / Pc</span>
          </div>
          <div style="display:flex; align-items:center;">
            <span style="color:#888; margin-right:4px;">₹</span>
            <input type="number" class="mat-cost-input apple-input" data-mat="${mat}" value="${currentPrice}" step="0.01" style="width:70px; padding:4px 8px; text-align:right;">
          </div>
        </div>
      `;
    });
  }
  materialsContainer.innerHTML = materialsHtml;
  
  // Setup Save Button
  const saveBtn = document.getElementById('save-materials-btn');
  saveBtn.onclick = async () => {
    const inputs = document.querySelectorAll('.mat-cost-input');
    const newData = {};
    inputs.forEach(input => {
      newData[input.dataset.mat] = parseFloat(input.value) || 0;
    });
    materialsData = newData;
    
    // Save to server
    try {
      saveBtn.innerText = "Saving...";
      await fetch('/api/materials', {
        method: 'POST',
        body: JSON.stringify(materialsData)
      });
      saveBtn.innerText = "Saved ✓";
      saveBtn.style.background = "#34c759";
      
      // Re-render margins table
      renderAnalyticsMargins();
      
      setTimeout(() => {
        saveBtn.innerText = "Save Costs";
        saveBtn.style.background = "#0071e3";
      }, 1500);
    } catch (err) {
      alert("Failed to save materials.");
      saveBtn.innerText = "Save Costs";
    }
  };

  // 3. Render initial margins
  renderAnalyticsMargins();
}

function renderAnalyticsMargins() {
  const container = document.getElementById('margins-container');
  if (!container) return;
  
  let html = `
    <table style="width:100%; border-collapse:collapse; font-size:14px;">
      <thead>
        <tr style="border-bottom:2px solid #e5e5ea; text-align:left;">
          <th style="padding:12px 8px; font-weight:600; color:#888;">Item Name</th>
          <th style="padding:12px 8px; font-weight:600; color:#888; text-align:right;">Base Price</th>
          <th style="padding:12px 8px; font-weight:600; color:#888; text-align:right;">Dynamic COGS</th>
          <th style="padding:12px 8px; font-weight:600; color:#888; text-align:right;">Margin %</th>
        </tr>
      </thead>
      <tbody>
  `;
  
  itemsData.sort((a,b) => a.name.localeCompare(b.name)).forEach(item => {
    if (!item.bomRaw || !item.bomRaw.ingredients || item.bomRaw.ingredients.length === 0) return; // Skip items without a BOM
    
    // Calculate COGS
    let cogs = 0;
    if (item.bomRaw && item.bomRaw.ingredients && Array.isArray(item.bomRaw.ingredients)) {
      item.bomRaw.ingredients.forEach(ing => {
        const ingName = ing.ingredient || ing.name;
        if (!ing || !ingName) return;
        const qty = parseFloat(ing.qty) || 0;
        const matName = String(ingName).trim();
        const matPrice = materialsData[matName] || 0; // price per KG/L/Pc
        
        let calculatedQty = qty;
        if (ing.unit === 'g' || ing.unit === 'ml') {
          calculatedQty = qty / 1000;
        }
        
        cogs += (calculatedQty * matPrice);
      });
    }
    
    // Calculate Margin
    const price = item.price || 0;
    let marginPct = 0;
    if (price > 0) {
      marginPct = ((price - cogs) / price) * 100;
    }
    
    let marginStyle = 'color:#34c759; font-weight:700;'; // Green for Cash Cow
    if (marginPct < 20) marginStyle = 'color:#ff3b30; font-weight:700;'; // Red for Loss Leader
    else if (marginPct < 50) marginStyle = 'color:#ff9800; font-weight:700;'; // Orange for ok
    
    html += `
      <tr style="border-bottom:1px solid #f5f5f7;">
        <td style="padding:12px 8px; font-weight:500;">${item.name}</td>
        <td style="padding:12px 8px; text-align:right;">₹${price.toFixed(2)}</td>
        <td style="padding:12px 8px; text-align:right;">₹${cogs.toFixed(2)}</td>
        <td style="padding:12px 8px; text-align:right; ${marginStyle}">${marginPct.toFixed(1)}%</td>
      </tr>
    `;
  });
  
  html += `</tbody></table>`;
  container.innerHTML = html;
}


// --- Employee Onboarding ---
const onboardingForm = document.getElementById('onboarding-form');
if (onboardingForm) {
  onboardingForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = document.getElementById('btn-submit-employee');
    btn.innerText = "Saving...";
    btn.disabled = true;

    try {
      const getFileBase64 = (inputId) => {
        return new Promise((resolve) => {
          const file = document.getElementById(inputId).files[0];
          if (!file) return resolve(null);
          const reader = new FileReader();
          reader.onload = (e) => resolve({ name: file.name, data: e.target.result });
          reader.readAsDataURL(file);
        });
      };

      const payload = {
        name: document.getElementById('emp_name').value,
        doj: document.getElementById('emp_doj').value,
        role: document.getElementById('emp_role').value,
        mobile: document.getElementById('emp_mobile').value,
        emergencyName: document.getElementById('emp_emergency_name').value,
        emergencyPhone: document.getElementById('emp_emergency_phone').value,
        emergencyRel: document.getElementById('emp_emergency_rel').value,
        idType: document.getElementById('emp_id_type').value,
        idNumber: document.getElementById('emp_id_number').value,
        bankName: document.getElementById('emp_bank_name').value,
        bankAcc: document.getElementById('emp_bank_acc').value,
        bankIfsc: document.getElementById('emp_bank_ifsc').value,
        dob: document.getElementById('emp_dob').value,
        blood: document.getElementById('emp_blood').value,
        father: document.getElementById('emp_father').value,
        marital: document.getElementById('emp_marital').value,
        currentAddress: document.getElementById('emp_current_address').value,
        permAddress: document.getElementById('emp_perm_address').value,
        uan: document.getElementById('emp_uan').value,
        email: document.getElementById('emp_email').value,

        photo: await getFileBase64('emp_photo'),
        idDoc: await getFileBase64('emp_id_doc'),
        addressDoc: await getFileBase64('emp_address_doc')
      };

      const res = await fetch('/api/employees', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      
      // Read the backend response which should now return the employee ID
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save');

      // Populate ID Card Modal
      const empName = payload.name || "Unknown";
      const empRole = payload.role || "Employee";
      const empBlood = payload.blood || "-";
      const empIdStr = data.empId || "EMP-000000";

      document.getElementById('id-card-name').innerText = empName;
      document.getElementById('id-card-role').innerText = empRole;
      document.getElementById('id-card-blood').innerText = empBlood;
      document.getElementById('id-card-empid').innerText = empIdStr;
      
      // Use the base64 photo if available, else a placeholder will show
      if (payload.photo && payload.photo.data) {
        document.getElementById('id-card-photo').src = payload.photo.data;
      }
      
      // Generate QR Code with employee data
      const qrData = encodeURIComponent(`ID:${empIdStr}|Name:${empName}|Blood:${empBlood}|Role:${empRole}`);
      document.getElementById('id-card-qr').src = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${qrData}`;

      // Show Modal
      document.getElementById('id-card-modal').style.display = 'flex';

      onboardingForm.reset();

    } catch (err) {
      console.error(err);
      alert("Error: " + err.message);
    } finally {
      btn.innerText = "Save Employee Record";
      btn.disabled = false;
    }
  });
}


window.previewSampleID = function() {
  document.getElementById('id-card-name').innerText = "Rahul Sharma";
  document.getElementById('id-card-role').innerText = "Store Manager";
  document.getElementById('id-card-blood').innerText = "O+";
  document.getElementById('id-card-empid').innerText = "EMP-654321";
  document.getElementById('id-card-photo').src = "https://i.pravatar.cc/150?img=11";
  
  const qrData = encodeURIComponent("ID:EMP-654321|Name:Rahul Sharma|Blood:O+|Role:Store Manager");
  document.getElementById('id-card-qr').src = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${qrData}`;

  document.getElementById('id-card-modal').style.display = 'flex';
};


window.loadEmployeeDirectory = async function() {
  const grid = document.getElementById('employee-grid');
  grid.innerHTML = '<p style="color:#888;">Fetching employees from Notion...</p>';
  try {
    const res = await fetch('/api/employees');
    const data = await res.json();
    grid.innerHTML = '';
    
    if (data.length === 0) {
      grid.innerHTML = '<p style="color:#888;">No employees found.</p>';
      return;
    }

    window.employeeList = data;
    data.forEach(emp => {
      const p = emp.properties;
      const name = p.Name?.title[0]?.plain_text || 'Unknown';
      const role = p.Role?.select?.name || 'Staff';
      const blood = p['Blood Group']?.select?.name || '-';
      const empIdStr = p['Employee ID']?.rich_text[0]?.plain_text || 'EMP-XXXXXX';
      const phone = p.Mobile?.phone_number || '';
      
      const photoUrl = p.Photo?.files[0]?.external?.url || 'https://i.pravatar.cc/150?u=' + empIdStr;

      const card = document.createElement('div');
      card.style.cssText = 'background:#fff; border-radius:12px; padding:20px; box-shadow:0 1px 3px rgba(0,0,0,0.05); display:flex; align-items:center; gap:16px; border:1px solid #eee;';
      card.innerHTML = `
        <img src="${photoUrl}" style="width:60px; height:60px; border-radius:50%; object-fit:cover; border:2px solid #eee;">
        <div style="flex:1;">
          <h4 style="margin:0; font-size:16px; color:#333;">${name}</h4>
          <p style="margin:2px 0 0 0; font-size:13px; color:#0071e3; font-weight:500;">${role}</p>
          <p style="margin:4px 0 0 0; font-size:12px; color:#888;">${empIdStr} • ${phone}</p>
        </div>
        
        <button class="btn btn-secondary" onclick="openProfile('${emp.id}')">View Profile</button>

      `;
      grid.appendChild(card);
    });
  } catch(err) {
    grid.innerHTML = '<p style="color:red;">' + err.message + '</p>'; console.error(err);
  }
};

window.showIDCard = function(name, role, blood, empId, photoUrl) {
  document.getElementById('id-card-name').innerText = name;
  document.getElementById('id-card-role').innerText = role;
  document.getElementById('id-card-blood').innerText = blood;
  document.getElementById('id-card-empid').innerText = empId;
  document.getElementById('id-card-photo').src = photoUrl;
  
  const qrData = encodeURIComponent(`ID:${empId}|Name:${name}|Blood:${blood}|Role:${role}`);
  document.getElementById('id-card-qr').src = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${qrData}`;
  
  document.getElementById('id-card-modal').style.display = 'flex';
};

// Auto-load directory when tab is clicked
document.querySelector('[data-target="employee-directory-view"]').addEventListener('click', loadEmployeeDirectory);


window.openProfile = function(pageId) {
  const emp = window.employeeList.find(e => e.id === pageId);
  if (!emp) return;
  const p = emp.properties;
  
  const name = p.Name?.title[0]?.plain_text || '';
  const role = p.Role?.select?.name || '';
  const blood = p['Blood Group']?.select?.name || '';
  const empId = p['Employee ID']?.rich_text[0]?.plain_text || '';
  const mobile = p.Mobile?.phone_number || '';
  const email = p['Email Address']?.email || '';
  const photoUrl = p.Photo?.files[0]?.external?.url || 'https://i.pravatar.cc/150?u=' + empId;

  const doj = p['Date of Joining']?.date?.start || '';
  const dob = p['Date of Birth']?.date?.start || '';
  const father = p['Father/Spouse Name']?.rich_text[0]?.plain_text || '';
  const marital = p['Marital Status']?.select?.name || '';
  const currentAddress = p['Current Address']?.rich_text[0]?.plain_text || '';
  const permAddress = p['Permanent Address']?.rich_text[0]?.plain_text || '';
  const uan = p['UAN Number']?.rich_text[0]?.plain_text || '';
  const emergencyName = p['Emergency Contact']?.rich_text[0]?.plain_text || '';
  const emergencyPhone = p['Emergency Phone']?.phone_number || '';
  const emergencyRel = p['Emergency Relationship']?.rich_text[0]?.plain_text || '';
  const idType = p['ID Type']?.select?.name || '';
  const idNumber = p['ID Number']?.rich_text[0]?.plain_text || '';
  const bankName = p['Bank Name']?.rich_text[0]?.plain_text || '';
  const bankAcc = p['Account Number']?.rich_text[0]?.plain_text || '';
  const bankIfsc = p['IFSC Code']?.rich_text[0]?.plain_text || '';
  
  // Hide views
  document.querySelectorAll('.view').forEach(v => v.style.display = 'none');
  document.getElementById('employee-profile-view').style.display = 'block';

  // Fill edit form
  document.getElementById('edit_emp_id').value = pageId;
  document.getElementById('edit_name').value = name;
  document.getElementById('edit_role').value = role;
  document.getElementById('edit_blood').value = blood;
  document.getElementById('edit_empid').value = empId;
  document.getElementById('edit_mobile').value = mobile;
  document.getElementById('edit_email').value = email;
  
  document.getElementById('edit_doj').value = doj;
  document.getElementById('edit_dob').value = dob;
  document.getElementById('edit_father').value = father;
  document.getElementById('edit_marital').value = marital;
  document.getElementById('edit_uan').value = uan;
  
  document.getElementById('edit_emergency_name').value = emergencyName;
  document.getElementById('edit_emergency_phone').value = emergencyPhone;
  document.getElementById('edit_emergency_rel').value = emergencyRel;
  
  document.getElementById('edit_current_address').value = currentAddress;
  document.getElementById('edit_perm_address').value = permAddress;
  document.getElementById('edit_id_type').value = idType;
  document.getElementById('edit_id_number').value = idNumber;
  document.getElementById('edit_bank_name').value = bankName;
  document.getElementById('edit_bank_acc').value = bankAcc;
  document.getElementById('edit_bank_ifsc').value = bankIfsc;

  // Fill ID Card
  document.getElementById('profile-card-name').innerText = name;
  document.getElementById('profile-card-role').innerText = role;
  document.getElementById('profile-card-blood').innerText = blood;
  document.getElementById('profile-card-empid').innerText = empId;
  document.getElementById('profile-card-photo').src = photoUrl;
  
  const qrData = encodeURIComponent(`ID:${empId}|Name:${name}|Blood:${blood}|Role:${role}`);
  document.getElementById('profile-card-qr').src = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${qrData}`;
};

window.backToDirectory = function() {
  document.querySelectorAll('.view').forEach(v => v.style.display = 'none');
  document.getElementById('employee-directory-view').style.display = 'block';
};

window.downloadIDCard = function() {
  window.print();
};

const editForm = document.getElementById('edit-employee-form');
if (editForm) {
  editForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const pageId = document.getElementById('edit_emp_id').value;
    
    // Quick local update to ID Card to reflect changes instantly before save
    const name = document.getElementById('edit_name').value;
    const role = document.getElementById('edit_role').value;
    const blood = document.getElementById('edit_blood').value;
    document.getElementById('profile-card-name').innerText = name;
    document.getElementById('profile-card-role').innerText = role;
    document.getElementById('profile-card-blood').innerText = blood;
    
    const qrData = encodeURIComponent(`ID:${document.getElementById('edit_empid').value}|Name:${name}|Blood:${blood}|Role:${role}`);
    document.getElementById('profile-card-qr').src = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${qrData}`;

    try {
      const res = await fetch(`/api/employees/${pageId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name,
          role: role,
          mobile: document.getElementById('edit_mobile').value,
          email: document.getElementById('edit_email').value,
          blood: blood,
          doj: document.getElementById('edit_doj').value,
          dob: document.getElementById('edit_dob').value,
          father: document.getElementById('edit_father').value,
          marital: document.getElementById('edit_marital').value,
          uan: document.getElementById('edit_uan').value,
          emergencyName: document.getElementById('edit_emergency_name').value,
          emergencyPhone: document.getElementById('edit_emergency_phone').value,
          emergencyRel: document.getElementById('edit_emergency_rel').value,
          currentAddress: document.getElementById('edit_current_address').value,
          permAddress: document.getElementById('edit_perm_address').value,
          idType: document.getElementById('edit_id_type').value,
          idNumber: document.getElementById('edit_id_number').value,
          bankName: document.getElementById('edit_bank_name').value,
          bankAcc: document.getElementById('edit_bank_acc').value,
          bankIfsc: document.getElementById('edit_bank_ifsc').value
        })
      });
      if (!res.ok) throw new Error("Save failed");
      alert("Employee details updated successfully!");
      loadEmployeeDirectory();
    } catch(err) {
      alert(err.message);
    }
  });
}
