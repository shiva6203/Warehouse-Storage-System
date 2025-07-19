const db = new Dexie("WarehouseDB");
db.version(1).stores({
  items: "++id, name, seller, price"
});

const idInput = document.getElementById("productId");
const nameInput = document.getElementById("productName");
const sellerInput = document.getElementById("seller");
const priceInput = document.getElementById("price");
const tableBody = document.getElementById("tableBody");
const statusMsg = document.getElementById("statusMsg");

function resetForm() {
  idInput.value = "";
  nameInput.value = "";
  sellerInput.value = "";
  priceInput.value = "";
}

async function getNextId() {
  const items = await db.items.toArray();
  return items.length > 0 ? Math.max(...items.map(i => i.id)) + 1 : 1;
}

async function createItem() {
  let name = nameInput.value.trim();
  let seller = sellerInput.value.trim();
  let price = parseFloat(priceInput.value);

  if (name && seller && !isNaN(price)) {
    await db.items.add({ name, seller, price });
    resetForm();
    showStatus();
    updateNextId();
    readItems();
  }
}

function showStatus() {
  statusMsg.style.display = "block";
  setTimeout(() => {
    statusMsg.style.display = "none";
  }, 2000);
}

async function updateNextId() {
  const nextId = await getNextId();
  idInput.value = nextId;
}

async function readItems() {
  const allItems = await db.items.toArray();
  tableBody.innerHTML = "";

  if (allItems.length === 0) {
    tableBody.innerHTML = `<tr><td colspan="6">No record found in the database...!</td></tr>`;
    return;
  }

  allItems.forEach(item => {
    tableBody.innerHTML += `
      <tr>
        <td>${item.id}</td>
        <td>${item.name}</td>
        <td>${item.seller}</td>
        <td>${item.price}</td>
        <td><button class="btn btn-sm btn-warning" onclick="editItem(${item.id})">Edit</button></td>
        <td><button class="btn btn-sm btn-danger" onclick="deleteItem(${item.id})">Delete</button></td>
      </tr>
    `;
  });
}

async function editItem(id) {
  const item = await db.items.get(id);
  idInput.value = item.id;
  nameInput.value = item.name;
  sellerInput.value = item.seller;
  priceInput.value = item.price;
}

async function updateItem() {
  let id = parseInt(idInput.value);
  let name = nameInput.value.trim();
  let seller = sellerInput.value.trim();
  let price = parseFloat(priceInput.value);

  if (!isNaN(id) && name && seller && !isNaN(price)) {
    await db.items.put({ id, name, seller, price });
    resetForm();
    showStatus();
    updateNextId();
    readItems();
  }
}

async function deleteItem(id) {
  await db.items.delete(id);
  readItems();
  updateNextId();
}

async function deleteAll() {
  await db.items.clear();
  readItems();
  updateNextId();
}

// Initialize
readItems();
updateNextId();
