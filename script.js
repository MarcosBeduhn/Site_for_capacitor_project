let cart = [];

// Tolerância anti-tremores (Grace Period)
const TREMOR_GRACE_PERIOD = 400; // 400ms de tolerância caso o mouse dê pequenas escapadas

const hoverButtons = document.querySelectorAll('.hover-btn');

hoverButtons.forEach(btn => {
    let hoverTimer = null;
    let graceTimer = null;
    let isFilling = false;

    btn.addEventListener('mouseenter', () => {
        // Se o mouse deu uma escapada rápida por tremor e voltou, cancela o resete
        if (graceTimer) {
            clearTimeout(graceTimer);
            graceTimer = null;
            return;
        }

        isFilling = true;
        btn.classList.add('filling');

        // Timer de 3 segundos
        hoverTimer = setTimeout(() => {
            btn.classList.remove('filling');
            isFilling = false;
            executeAction(btn);
        }, 3000);
    });

    btn.addEventListener('mouseleave', () => {
        if (!isFilling) return;

        // Aguarda 400ms antes de resetar a animação caso seja apenas um tremor da mão
        graceTimer = setTimeout(() => {
            btn.classList.remove('filling');
            if (hoverTimer) {
                clearTimeout(hoverTimer);
                hoverTimer = null;
            }
            isFilling = false;
            graceTimer = null;
        }, TREMOR_GRACE_PERIOD);
    });
});

function executeAction(btn) {
    const action = btn.getAttribute('data-action');

    if (action === 'add') {
        const name = btn.getAttribute('data-name');
        const price = parseFloat(btn.getAttribute('data-price'));
        cart.push({ name, price });
        showToast(`✔ ${name} Adicionado!`);
    } 
    else if (action === 'next') {
        if (cart.length === 0) {
            alert('Adicione pelo menos um item ao carrinho antes de avançar.');
            return;
        }
        updateCartUI();
        switchStage('stage-confirmation');
    } 
    else if (action === 'back') {
        switchStage('stage-selection');
    } 
    else if (action === 'finish') {
        cart = [];
        switchStage('stage-selection');
    }
}

function switchStage(stageId) {
    document.querySelectorAll('.stage').forEach(el => el.classList.remove('active'));
    document.getElementById(stageId).classList.add('active');
}

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

function showToast(msg) {
    const toast = document.getElementById('toast');
    toast.innerText = msg;
    toast.style.display = 'block';
    setTimeout(() => {
        toast.style.display = 'none';
    }, 2000);
}
