let cart = [];
let hoverTimer = null;

// Seleciona todos os botões que precisam da lógica de 3 segundos
const hoverButtons = document.querySelectorAll('.hover-btn');

hoverButtons.forEach(btn => {
    // Quando o mouse ENTRA no botão
    btn.addEventListener('mouseenter', () => {
        // Adiciona a classe que inicia a animação do CSS (3 segundos)
        btn.classList.add('filling');
        
        // Inicia o timer do JavaScript
        hoverTimer = setTimeout(() => {
            btn.classList.remove('filling'); // Reseta a barra
            executeAction(btn); // Executa a ação do botão
        }, 3000); // 3000 ms = 3 segundos
    });

    // Quando o mouse SAI do botão antes dos 3 segundos
    btn.addEventListener('mouseleave', () => {
        btn.classList.remove('filling'); // Cancela a animação
        clearTimeout(hoverTimer); // Cancela a execução
    });
});

// Função que direciona a lógica dependendo do botão
function executeAction(btn) {
    const action = btn.getAttribute('data-action');

    if (action === 'add') {
        const name = btn.getAttribute('data-name');
        const price = parseFloat(btn.getAttribute('data-price'));
        cart.push({ name, price });
        showToast(`${name} adicionado!`);
    } 
    else if (action === 'next') {
        if (cart.length === 0) {
            alert('Adicione pelo menos um item antes de avançar.');
            return;
        }
        updateCartUI();
        switchStage('stage-confirmation');
    } 
    else if (action === 'back') {
        switchStage('stage-selection');
    } 
    else if (action === 'finish') {
        alert('Pedido finalizado com sucesso! Preparando seu lanche...');
        cart = []; // Limpa carrinho
        switchStage('stage-selection'); // Volta para o início
    }
}

// Troca de abas (Telas)
function switchStage(stageId) {
    document.querySelectorAll('.stage').forEach(el => el.classList.remove('active'));
    document.getElementById(stageId).classList.add('active');
}

// Atualiza a visualização do carrinho na aba de Confirmação
function updateCartUI() {
    const list = document.getElementById('cart-items');
    const totalSpan = document.getElementById('total-value');
    
    list.innerHTML = '';
    let total = 0;

    cart.forEach(item => {
        total += item.price;
        const li = document.createElement('li');
        li.innerHTML = `<span>${item.name}</span> <span>R$ ${item.price.toFixed(2).replace('.', ',')}</span>`;
        list.appendChild(li);
    });

    totalSpan.innerText = total.toFixed(2).replace('.', ',');
}

// Mostra um aviso rápido na tela
function showToast(msg) {
    const toast = document.getElementById('toast');
    toast.innerText = msg;
    toast.style.display = 'block';
    setTimeout(() => {
        toast.style.display = 'none';
    }, 2000);
}
