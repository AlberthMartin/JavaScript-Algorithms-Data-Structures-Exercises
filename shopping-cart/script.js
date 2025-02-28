//hold the items in the cart
const cartContainer = document.getElementById("cart-container"); 
//The products in the cart
const productsContainer = document.getElementById("products-container");
//Holds the items in the main window
const dessertCards = document.getElementById("dessert-card-container");
//Button that hides and shows the cart
const cartBtn = document.getElementById("cart-btn");
//Button inside the cart to clear it
const clearCartBtn = document.getElementById("clear-cart-btn");

//Info about the products in the cart
const totalNumberOfItems = document.getElementById("total-items");
const cartSubTotal = document.getElementById("subtotal");
const cartTaxes = document.getElementById("taxes");
const cartTotal = document.getElementById("total");

//span on the cartBtn
const showHideCartSpan = document.getElementById("show-hide-cart");
let isCartShowing = false;

//Products in the store
const products = [
  {
    id: 1,
    name: "Vanilla Cupcakes (6 Pack)",
    price: 12.99,
    category: "Cupcake",
  },
  {
    id: 2,
    name: "French Macaron",
    price: 3.99,
    category: "Macaron",
  },
  {
    id: 3,
    name: "Pumpkin Cupcake",
    price: 3.99,
    category: "Cupcake",
  },
  {
    id: 4,
    name: "Chocolate Cupcake",
    price: 5.99,
    category: "Cupcake",
  },
  {
    id: 5,
    name: "Chocolate Pretzels (4 Pack)",
    price: 10.99,
    category: "Pretzel",
  },
  {
    id: 6,
    name: "Strawberry Ice Cream",
    price: 2.99,
    category: "Ice Cream",
  },
  {
    id: 7,
    name: "Chocolate Macarons (4 Pack)",
    price: 9.99,
    category: "Macaron",
  },
  {
    id: 8,
    name: "Strawberry Pretzel",
    price: 4.99,
    category: "Pretzel",
  },
  {
    id: 9,
    name: "Butter Pecan Ice Cream",
    price: 2.99,
    category: "Ice Cream",
  },
  {
    id: 10,
    name: "Rocky Road Ice Cream",
    price: 2.99,
    category: "Ice Cream",
  },
  {
    id: 11,
    name: "Vanilla Macarons (5 Pack)",
    price: 11.99,
    category: "Macaron",
  },
  {
    id: 12,
    name: "Lemon Cupcakes (4 Pack)",
    price: 12.99,
    category: "Cupcake",
  },
];

//Add the products in the store to the main screen.
products.forEach( 
  ({ name, id, price, category }) => { //For each product object
    dessertCards.innerHTML += `  //adds the HTML to the main windows products
      <div class="dessert-card">
        <h2>${name}</h2>
        <p class="dessert-price">$${price}</p>
        <p class="product-category">Category: ${category}</p>
        <button 
          id="${id}" 
          class="btn add-to-cart-btn">Add to cart //Buttons to add the items to the cart
        </button>
      </div>
    `;
  }
);

/*Class for the shopping cart,*/
class ShoppingCart {
  //able to store the items, keeps track of the total sum
  constructor() {
    this.items = []; //a shopping cart is constructed with an array for the products 
    this.total = 0; // total price of the items in the cart
    this.taxRate = 8.25;
  }

  //function for adding an item to the cart, takes the id of the product, and the list of all stored products
  addItem(id, products) {
    const product = products.find((item) => item.id === id); //Finds the product with the matching id
    const { name, price } = product; // takes the name and price from the product
    this.items.push(product); //adds the product to the shopping cart

    const totalCountPerProduct = {}; //stores the total count of each product
    
    this.items.forEach((dessert) => { //goes through the item in the cart
      totalCountPerProduct[dessert.id] = (totalCountPerProduct[dessert.id] || 0) + 1; // +1 for the current product
    })

    const currentProductCount = totalCountPerProduct[product.id]; //gets count for this product
    const currentProductCountSpan = document.getElementById(`product-count-for-id${id}`); //Gets the element for product-count-for-id (of the product added)

    currentProductCount > 1 ? //if this product is already in the cart
      currentProductCountSpan.textContent = `${currentProductCount}x`  //Just add the new count to the cart
      
      : productsContainer.innerHTML += ` //else make a new container for the product added in the cart.
      <div id="dessert${id}" class="product">
        <p>
          <span class="product-count" id="product-count-for-id${id}"></span>${name}
        </p>
        <p>${price}</p>
      </div>
      `;
  }
  //How many products are in the cart
  getCounts() {
    return this.items.length;
  }

  //Function for clearing the cart
  clearCart() {
    //If the cart is already empty, return
    if (!this.items.length) {
      alert("Your shopping cart is already empty");
      return;
    }
    
    //User needs to confirm that they want to clear the cart
    const isCartCleared = confirm(
      "Are you sure you want to clear all items from your shopping cart?"
    );

    //If the user confrimed, continue else do nothing
    if (isCartCleared) {
      this.items = []; //clears the cart
      this.total = 0;
      productsContainer.innerHTML = ""; //clears all the products from the cart
      totalNumberOfItems.textContent = 0; //resets the values to 0
      cartSubTotal.textContent = 0;
      cartTaxes.textContent = 0;
      cartTotal.textContent = 0;
    }
  }

  calculateTaxes(amount) {
    return parseFloat(((this.taxRate / 100) * amount).toFixed(2)); //ex. 9/100 = 0.09 * 5€ = 0.45, 2 decimals, and returned as a number
  }
  calculateTotal() {
    const subTotal = this.items.reduce((total, item) => total + item.price, 0); //sums up the subtotal before tax
    const tax = this.calculateTaxes(subTotal); //calculates the taxes on the total
    this.total = subTotal + tax; //total price
    //Updates the text in the cart
    cartSubTotal.textContent = `$${subTotal.toFixed(2)}`;
    cartTaxes.textContent = `$${tax.toFixed(2)}`;
    cartTotal.textContent = `$${this.total.toFixed(2)}`;
    return this.total; // retruns total
  }
};
//Constructs an shoppingCart
const cart = new ShoppingCart();
//Cart buttons added above
const addToCartBtns = document.getElementsByClassName("add-to-cart-btn");
//makes an array of the cart buttons and add event handlers to each
[...addToCartBtns].forEach(
  (btn) => {
    btn.addEventListener("click", (event) => { //what to do  when the button is clicked:
      cart.addItem(Number(event.target.id), products); //add the Item with the id
      totalNumberOfItems.textContent = cart.getCounts(); //update total number of items
      cart.calculateTotal(); // calculate the new totals
    })
  }
);
//logic for the cartBtn
cartBtn.addEventListener("click", () => {
  isCartShowing = !isCartShowing; //When clicked change the value of isCartShowing
  showHideCartSpan.textContent = isCartShowing ? "Hide" : "Show"; // If the cart is showing display "Hide" and if it is not showing "Show"
  cartContainer.style.display = isCartShowing ? "block" : "none"; // If the cart should be showing "block" and if it should be hidden "none"
});
//The cart that we constructed above is binded to the clearCart function
clearCartBtn.addEventListener("click", cart.clearCart.bind(cart))
