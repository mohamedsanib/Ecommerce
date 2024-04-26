import { cart } from "../data/cart.js";
import { products } from "../data/products.js";

export const displayAllProducts = (products) => {
    const productContainerDiv = document.querySelector(".product-container");

    let items = ``;
    products.forEach((data) => {
        items += `
          <div class="product-item-div" data-id="${data.id}">
              <div class="product-img-div">
                  <img class="fill-img" src="${data.image}" alt="" srcset="">
              </div>
              <p class="product-name limit-text-to-2-lines ">
                  ${data.name}
              </p>
              <p class="product-price">
              &#8377; ${data.priceCents / 100}
              </p>
              <div class="product-qty">
                  <select>
                      <option selected value="1">1</option>
                      <option value="2">2</option>
                      <option value="3">3</option>
                      <option value="4">4</option>
                      <option value="5">5</option>
                      <option value="6">6</option>
                      <option value="7">7</option>
                      <option value="8">8</option>
                      <option value="9">9</option>
                      <option value="10">10</option>
                  </select>
              </div>
              <div class="added-pop">
                  Added
                  <img src="./icons/checkmark.png" alt="">
              </div>
              <button class="add-cart-btn" data-id="${data.id}">
                  Add to Cart
              </button>
          </div>
          `;
    });
    productContainerDiv.innerHTML += items;
};

export const showAddCartPop = (Addpop) => {
    Addpop.classList.add("added-pop-active");
    setTimeout(() => {
        Addpop.classList.remove("added-pop-active");
    }, 1000);
};

const checkcart = (item) => {
    let ans = true;
    cart.forEach((i) => {
        if (i.id === item) {
            ans = false;
        }
    });
    return ans;
};

const AppendIntoCart = (item, qty, Addpop) => {
    if (checkcart(item)) {
        cart.push({
            id: item,
            qty: qty,
        });
        setCart();
        showAddCartPop(Addpop);
    }
};

export const addCartEvent = () => {
    document.querySelectorAll(".add-cart-btn").forEach((btn) => {
        btn.addEventListener("click", (e) => {
            const Addpop = btn.previousSibling.previousSibling;
            const qty = Addpop.previousSibling.previousSibling.childNodes[1].value;
            const item = e.target.dataset.id;
            AppendIntoCart(item, qty, Addpop);
        });
    });
};

export const setCart = () => {
    let newcart = [];
    let existedItem = JSON.parse(localStorage.getItem("cart")) || [];

    cart.forEach((i) => {
        if (!existedItem.some((j) => i.id === j.id)) {
            newcart.push(i);
        }
    });

    existedItem.forEach((i) => {
        newcart.push(i);
    });

    localStorage.setItem("cart", JSON.stringify(newcart));
    cartPopup();
};

export const getCart = () => {
    const ans = JSON.parse(localStorage.getItem("cart"));
    return ans || [];
};

const calculateCartItem = () => {
    let carts = getCart();
    let count = 0;
    if (carts.length === 0) {
        return count;
    }
    carts.forEach((item) => {
        count += Number(item.qty);
    });
    return count;
};

export const cartPopup = () => {
    const cartlogo = document.querySelector(".cart-pops");
    cartlogo.innerText = calculateCartItem();
};

const checkProduct = (id) => {
    return new Promise((resolve, reject) => {
        const product = products.find((item) => item.id === id);
        if (product) {
            resolve(product);
        } else {
            reject(new Error("Product not found"));
        }
    });
};
export const RenderInCart = async () => {
    let cartItems = getCart();
    let itemResult = ``;
    const itemDiv = document.querySelector(".product-details");

    for (const item of cartItems) {
        try {
            const product = await checkProduct(item.id);
            itemResult += `
                <div class="product-details-grid">
                    <div class="grid-img">
                        <img class="fill-img" src="../${product.image}" alt="" />
                    </div>

                    <div class="grid-data">
                        <p class="data-name limit-text-to-2-lines ">
                            ${product.name}
                        </p>
                        <p class="data-price">&#8377; ${product.priceCents / 100
                }</p>
                        <p class="data-qty">Quantity: ${item.qty}</p>
                    </div>

                    <button class="data-delete" data-id="${product.id}">
                        <img class="fill-img" src="../icons/trash-can.png" alt="">
                    </button>
                </div>
            `;
        } catch (error) {
            console.error(error.message);
        }
    }

    itemDiv.innerHTML = itemResult;

    cartEvents();
};

export const cartDelete = (id) => {
    let exstcart = getCart();

    let newcart = [];
    exstcart.forEach((item) => {
        if (item.id !== id) {
            newcart.push(item);
        }
    });

    localStorage.setItem("cart", JSON.stringify(newcart));
};

export const cartEvents = () => {
    document.querySelectorAll(".data-delete").forEach((btn) => {
        btn.addEventListener("click", () => {
            cartDelete(btn.dataset.id);
            btn.parentElement.remove();
            RenderPrice();
        });
    });
};


export const RenderPrice = () => {
    let existCart = getCart();
    let count = calculateCartItem();

    let price = 0;
    existCart.forEach((i)=>{
        products.forEach((j)=>{
            if(i.id === j.id){
                price += j.priceCents/100;
            }
        })
    })

    let tax = (price+40)/100;
    let total = price+tax;

    const div = document.querySelector(".billing");
    let result = 
        existCart.length===0 ? "" : `
        <p class="billing-header">
            Order Summary
        </p>
        
        <p class="items">
            <span class="item">
                Items (${count}):
            </span>
            <span class="item">
                &#8377; ${price.toFixed(2)}
            </span>
        </p>
        <p class="items">
            <span class="item">
                Shipping & handling:
            </span>
            <span class="item">
            &#8377;40
            </span>
        </p>
        <p class="items">
            <span class="item">
                Total before tax:
            </span>
            <span class="item">
            &#8377;${(price+40).toFixed(2)}
            </span>
        </p>
        <p class="items last-items">
            <span class="item">
                Estimated tax (10%):
            </span>
            <span class="item">
            &#8377;${tax.toFixed(2)}
            </span>
        </p>

        <div class="totals">
            <span class="total">
                Order total:
            </span>
            <span class="total">
            &#8377; ${total.toFixed(2)}
            </span>
        </div>

        <button class="placeOrder-btn">
            place your Order
        </button>
            `;

        div.innerHTML = result;
};
