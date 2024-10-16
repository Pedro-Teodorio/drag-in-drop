const content_products = document.getElementById("content_products");
const cart_products = document.getElementById("cart_products");

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

content_products.addEventListener("dragstart", (event) => {
	event.dataTransfer.setData("text/plain", event.target.id); // setando o id do elemento que está sendo arrastado
});

cart_products.addEventListener("dragover", (event) => {
	event.preventDefault(); // prevenindo o comportamento padrão
});

let total = 0;

cart_products.addEventListener("drop", (event) => {
	const id = event.dataTransfer.getData("text/plain"); // pegando o id do elemento que está sendo arrastado
	const element = document.getElementById(id); // pegando o elemento que está sendo arrastado
	const elementClone = element.cloneNode(true); // clonando o elemento
	elementClone.classList.add("cursor-pointer"); // adicionando a classe cursor
	elementClone.classList.remove("cursor-grab"); // removendo a classe cursor

	const price = parseFloat(element.querySelector(".price span").textContent.split(" ")[1]); // pegando o preço do elemento

	const existingElement = Array.from(cart_products.children).find((child) => child.id === elementClone.id); // verificando se o elemento já existe no carrinho co

	if (existingElement) {
		const quantityElement = existingElement.querySelector(".qtd_product"); // pegando o elemento de quantidade
		const quantity = parseInt(quantityElement.textContent.split(" ")[1]); // pegando a quantidade
		quantityElement.textContent = `X ${quantity + 1}`; // incrementando a quantidade
		total += price;
	} else {
		const quantityElement = document.createElement("span");
		quantityElement.classList.add("qtd_product"); // Adicionando classes ao novo elemento
		quantityElement.textContent = "X 1"; // Definir o texto do novo elemento
		const innerHTML = elementClone.querySelector(".price"); // pegando o conteúdo do elemento
		innerHTML.appendChild(quantityElement); // adicionando o novo elemento ao conteúdo do elemento

		cart_products.appendChild(elementClone); // adicionando o elemento ao carrinho
		total += price;

		elementClone.addEventListener("dblclick", () => {
			const quantityElement = elementClone.querySelector(".qtd_product"); // pegando o elemento de quantidade
			const quantity = parseInt(quantityElement.textContent.split(" ")[1]); // pegando a quantidade
			if (quantity > 1) {
				quantityElement.textContent = `X ${quantity - 1}`; // decrementando a quantidade
				total -= price;
				document.getElementById("total").textContent = `R$ ${total.toFixed(2)}`;
				verificarCarrinhoVazio();
			} else {
				total -= price;
				document.getElementById("total").textContent = `R$ ${total.toFixed(2)}`;
				elementClone.remove();
				verificarCarrinhoVazio();
			}
		}); // Adicionando um evento de clique ao elemento
	}
	verificarCarrinhoVazio(); // Verificar se o carrinho está vazio
	document.getElementById("total").textContent = `R$ ${total.toFixed(2)}`;
});

function verificarCarrinhoVazio() {
	if (cart_products.children.length == 1) {
		document.getElementById("empty_message").classList.add("flex");
		document.getElementById("empty_message").classList.remove("hidden");
	} else {
		document.getElementById("empty_message").classList.add("hidden");
		document.getElementById("empty_message").classList.remove("flex");
	}
}

renderProducts();
