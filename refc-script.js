const content_products = document.getElementById("content_products");
const cart_products = document.getElementById("cart_products");
let total = 0;

const products = [
	{
		id: 1,
		name: "Produto 1",
		price: 10.0,
	},
	{
		id: 2,
		name: "Produto 2",
		price: 20.0,
	},
	{
		id: 3,
		name: "Produto 3",
		price: 30,
	},
];

const renderProducts = () => {
	products.forEach((product) => {
		content_products.innerHTML += `
        <div draggable="true" id="${"product-" + product.id}" class="border w-full p-4 flex justify-between items-center gap-3 rounded cursor-grab">
					<h2 class="font-bold text-xl">${product.name}</h2>
					<div class="flex items-center gap-2 price ">
						<p class="text-sm font-medium">Preço:</p>
						<span class="text-xl text-emerald-500 font-semibold">R$ ${product.price.toFixed(2)}</span>
					</div>
        </div>
        `;
	});
};

const dragStart = (event) => event.dataTransfer.setData("text/plain", event.target.id);
const dragOver = (event) => event.preventDefault();

const drop = (event) => {
	const data = event.dataTransfer.getData("text/plain");
	const element = cloneElement(data);
    const price = parseFloat(element.querySelector(".price span").textContent.split(" ")[1]);

	if (elementExists(element)) {
        incrementSpanQuantity(elementExists(element));
        total += price;
	} else {
		addSpanQuantity(element.querySelector(".price"));
        total += price;
		cart_products.appendChild(element);
        element.addEventListener("dblclick", () => removeElement(element,price));
	}

    updateTotal();
    isCartEmpty()
};

const cloneElement = (id) => {
	const element = document.getElementById(id);
	const clone = element.cloneNode(true);
	clone.classList.add("cursor-pointer");
	clone.classList.remove("cursor-grab");

	return clone;
};
const elementExists = (element) => Array.from(cart_products.children).find((child) => child.id === element.id);

const addSpanQuantity = (element) => {
	const span = document.createElement("span");
	span.classList.add("qtd_product");
	span.textContent = "X 1";

	element.appendChild(span);
};

const incrementSpanQuantity = (element) =>{
    const span = element.querySelector(".qtd_product");
    const quantity = parseInt(span.textContent.split(" ")[1]) + 1;
    span.textContent = `X ${quantity}`;

  
}

const decrementSpanQuantity = (element) =>{
    const span = element.querySelector(".qtd_product");
    const quantity = parseInt(span.textContent.split(" ")[1]) - 1;
    span.textContent = `X ${quantity}`;
}

const removeElement = (element,price) => {
    const quantity = parseInt(element.querySelector(".qtd_product").textContent.split(" ")[1]);

    if(quantity > 1){
        decrementSpanQuantity(element);
        total -= price;
        updateTotal();
    }
    else{
        total -= price;
        element.remove();
        updateTotal();
        isCartEmpty();
    }
}

const isCartEmpty = () =>{
    if(cart_products.children.length == 1){
        document.getElementById("empty_message").classList.add("flex");
        document.getElementById("empty_message").classList.remove("hidden");
    }else{
        document.getElementById("empty_message").classList.add("hidden");
        document.getElementById("empty_message").classList.remove("flex");
    }
}

const updateTotal = () => document.getElementById("total").textContent = `R$ ${total.toFixed(2)}`;

content_products.addEventListener("dragstart", dragStart);
cart_products.addEventListener("dragover", dragOver);
cart_products.addEventListener("drop", drop);

renderProducts();
