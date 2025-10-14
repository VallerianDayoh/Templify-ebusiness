// Demo JS: renders products, cart logic, simple checkout that triggers downloads (dummy files)
// Products data
const products = [
  { id: "ppt-modern", title: "Modern PowerPoint Template", price: 15000, priceText: "Rp15.000", desc: "Clean, academic slide set (20 slides).", img: "/assets/ppt.svg", fileType: "pptx" },
  { id: "notes-alg", title: "Algorithms Summary Notes", price: 10000, priceText: "Rp10.000", desc: "Concise notes with examples and diagrams.", img: "/assets/notes.svg", fileType: "pdf" },
  { id: "cv-pro", title: "Professional CV Template", price: 20000, priceText: "Rp20.000", desc: "Editable CV template (A4).", img: "/assets/cv.svg", fileType: "docx" },
  { id: "ebook-marketing", title: "Digital Marketing eBook", price: 25000, priceText: "Rp25.000", desc: "Comprehensive guide (50 pages).", img: "/assets/ebook.svg", fileType: "pdf" },
  { id: "infographic-set", title: "Infographic Elements Set", price: 12000, priceText: "Rp12.000", desc: "Icons and charts for presentations.", img: "/assets/infographic.svg", fileType: "zip" },
  { id: "research-template", title: "Research Paper Template", price: 18000, priceText: "Rp18.000", desc: "LaTeX template for academic papers.", img: "/assets/research.svg", fileType: "tex" }
];

// Cart state
let cart = [];

// Helpers
const el = (sel) => document.querySelector(sel);
const elAll = (sel) => document.querySelectorAll(sel);

// Render products
function renderProducts(){
  const grid = el("#productGrid");
  grid.innerHTML = "";
  products.forEach(p => {
    const card = document.createElement("div");
    card.className = "product-card bg-white rounded-xl p-4";
    card.innerHTML = `
      <img src="${p.img}" alt="${p.title}" class="w-full h-40 object-contain rounded-md mb-4" />
      <h3 class="font-semibold">${p.title}</h3>
      <p class="text-sm text-gray-600 mb-3">${p.desc}</p>
      <div class="flex items-center justify-between">
        <div class="font-bold text-[#2563EB]">${p.priceText}</div>
        <div class="flex gap-2">
          <button class="addBtn px-3 py-2 rounded-md bg-[#2563EB] text-white text-sm flex items-center justify-center" title="Add to cart">
            <svg xmlns='http://www.w3.org/2000/svg' class='h-5 w-5' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
              <path stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M6 6h15l-1.5 9h-13z' />
              <circle cx='9' cy='20' r='1' />
              <circle cx='18' cy='20' r='1' />
            </svg>
          </button>
        </div>
      </div>
    `;
    // add event
    card.querySelector(".addBtn").addEventListener("click", () => addToCart(p.id));
    grid.appendChild(card);
  });
}

// Cart functions
function addToCart(id){
  const prod = products.find(p => p.id === id);
  cart.push(prod);
  updateCartUI();
}

function removeFromCart(index){ 
  cart.splice(index,1);
  updateCartUI();
}

function clearCart(){
  cart = [];
  updateCartUI();
}

function updateCartUI(){
  el("#cartCount").textContent = cart.length;
  el("#mobileCartCount").textContent = cart.length;
  el("#cartTotal").textContent = formatRupiah(cart.reduce((s,a)=>s+a.price,0));
  // populate modal
  const items = el("#cartItems");
  items.innerHTML = "";
  if(cart.length===0){
    items.innerHTML = "<div class='text-sm text-gray-600'>Cart is empty.</div>";
  } else {
    cart.forEach((c, idx) => {
      const it = document.createElement("div");
      it.className = "flex items-center gap-3";
      it.innerHTML = `
        <img src="${c.img}" alt="" class="w-12 h-12 object-contain rounded"/>
        <div class="flex-1">
          <div class="font-medium">${c.title}</div>
          <div class="text-xs text-gray-500">${c.priceText}</div>
        </div>
        <div>
          <button class="removeBtn text-sm text-red-500">Remove</button>
        </div>
      `;
      it.querySelector(".removeBtn").addEventListener("click", ()=> removeFromCart(idx));
      items.appendChild(it);
    });
  }
}

// Format rupiah
function formatRupiah(num){
  return "Rp" + num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

// Checkout -> simulate file downloads
function checkout(){
  if(cart.length===0){ alert("Your cart is empty."); return; }
  // For demo: create a dummy blob for each product and trigger download
  cart.forEach(p=>{
    const content = `This is a demo file for ${p.title}.\nProduct ID: ${p.id}\nPrice: ${p.priceText}`;
    const blob = new Blob([content], {type: "application/octet-stream"});
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${p.title.replace(/\s+/g,"_")}.${p.fileType || "txt"}`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  });
  alert("Thanks for your purchase! Downloads should start automatically.");
  clearCart();
  closeCart();
}

// Modal controls
function openCart(){ el("#cartModal").classList.add("show"); el("#cartModal").style.display="flex"; }
function closeCart(){ el("#cartModal").classList.remove("show"); el("#cartModal").style.display="none"; }

// Init
document.addEventListener("DOMContentLoaded", ()=>{
  renderProducts();
  updateCartUI();

  // hamburger
  const ham = el("#hamburger");
  const mobileMenu = el("#mobileMenu");
  ham.addEventListener("click", ()=>{
    mobileMenu.classList.toggle("hidden");
  });

  // cart
  el("#cartBtn").addEventListener("click", openCart);
  el("#mobileCart").addEventListener("click", openCart);
  el("#closeCart").addEventListener("click", closeCart);
  el("#clearCart").addEventListener("click", clearCart);
  el("#checkoutBtn").addEventListener("click", checkout);

  // bundle button
  el("#bundleShop").addEventListener("click", ()=> {
    // add sample bundle (two products) to cart
    addToCart("ppt-modern");
    addToCart("notes-alg");
    openCart();
  });

  // subscribe form
  el("#subscribeForm").addEventListener("submit", (e)=>{
    e.preventDefault();
    const email = el("#emailInput").value;
    if(!email) return;
    alert("Thanks! Subscribed: " + email);
    el("#emailInput").value = "";
  });

  // Smooth small fade-in on scroll
  const observer = new IntersectionObserver(entries=>{
    entries.forEach(ent=>{
      if(ent.isIntersecting) ent.target.classList.add("fade-in");
    });
  }, {threshold: 0.08});
  document.querySelectorAll("section").forEach(s=> observer.observe(s));
});
