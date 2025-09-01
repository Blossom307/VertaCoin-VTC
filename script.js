// ====================================
// Mobile Menu Toggle
// ====================================
const mobileToggle = document.querySelector('.mobile-menu-toggle');
const navList = document.querySelector('.nav-list');

mobileToggle.addEventListener('click', () => {
  navList.classList.toggle('active');
  mobileToggle.classList.toggle('open');

  // Change the icon
  if (mobileToggle.classList.contains('open')) {
    mobileToggle.textContent = '×'; // X when open
  } else {
    mobileToggle.textContent = '☰'; // Hamburger when closed
  }
});


// ====================================
// Dropdown Menu Keyboard Accessibility
// ====================================
const dropdownItems = document.querySelectorAll('.nav-item.dropdown');

dropdownItems.forEach(item => {
  const link = item.querySelector('a');
  const submenu = item.querySelector('.dropdown-menu');

  // Show submenu on focus
  link.addEventListener('focus', () => {
    submenu.style.display = 'flex';
  });

  // Hide submenu on blur
  link.addEventListener('blur', () => {
    setTimeout(() => { // Delay to allow clicking submenu items
      submenu.style.display = 'none';
    }, 200);
  });
});

// ====================================
// Smooth Scroll for Anchor Links
// ====================================
const navLinks = document.querySelectorAll('a[href^="#"]');

navLinks.forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const targetId = link.getAttribute('href').slice(1);
    const targetEl = document.getElementById(targetId);
    if (targetEl) {
      targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      // Close mobile menu after click
      if (navList.classList.contains('active')) {
        navList.classList.remove('active');
      }
    }
  });
});

// ====================================
// Login/Register Form Validation
// ====================================
const authForm = document.getElementById('auth-form');

authForm.addEventListener('submit', (e) => {
  e.preventDefault();
  let valid = true;

  // Clear previous error messages
  authForm.querySelectorAll('.error-message').forEach(el => el.remove());

  const inputs = authForm.querySelectorAll('input[required]');
  inputs.forEach(input => {
    if (!input.value.trim()) {
      valid = false;
      showError(input, 'This field is required');
    } else if (input.type === 'email' && !validateEmail(input.value)) {
      valid = false;
      showError(input, 'Please enter a valid email');
    }
  });

  if (valid) {
    alert('Form submitted successfully!');
    authForm.reset();
  }
});

function showError(input, message) {
  const error = document.createElement('div');
  error.classList.add('error-message');
  error.style.color = '#D4AF37';
  error.style.fontSize = '0.9rem';
  error.style.marginTop = '0.25rem';
  error.textContent = message;
  input.parentNode.insertBefore(error, input.nextSibling);
}

function validateEmail(email) {
  const re = /\S+@\S+\.\S+/;
  return re.test(email);
}

// ====================================
// Newsletter Form Validation
// ====================================
const newsletterForm = document.getElementById('newsletter-form');

newsletterForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const input = newsletterForm.querySelector('input[type="email"]');
  newsletterForm.querySelectorAll('.error-message').forEach(el => el.remove());

  if (!input.value.trim()) {
    showError(input, 'Email is required');
  } else if (!validateEmail(input.value)) {
    showError(input, 'Enter a valid email');
  } else {
    alert('Subscribed successfully!');
    newsletterForm.reset();
  }
});

// ====================================
// Section Fade-In Animation
// ====================================
const sections = document.querySelectorAll('section');

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('fade-in');
    }
  });
}, {
  threshold: 0.2
});

sections.forEach(section => {
  section.classList.add('fade-section');
  observer.observe(section);
});

      

// ====================================
// Vertacoin / Web3 Integration
// ====================================

// ====================================
// Vertacoin / Web3 Integration (Refined)
// ====================================

const connectWalletBtns = document.querySelectorAll('#connectWalletBtn, #connectWallet'); // select both buttons
const walletInfo = document.getElementById('walletInfo');
const walletAddressSpan = document.getElementById('walletAddress');
const walletVertacoinBalance = document.getElementById('walletVertacoinBalance');
const dashboardVertacoinBalance = document.getElementById('dashboardVertacoinBalance');
const sendTokenForm = document.getElementById('sendTokenForm');
const txStatus = document.getElementById('txStatus');

// Replace with your deployed contract address and ABI
const contractAddress = "0xebc5942d0053B1acEfF18B01086272667209Df5b";
const contractABI = [
  {
    "constant":true,
    "inputs":[{"name":"_owner","type":"address"}],
    "name":"balanceOf",
    "outputs":[{"name":"balance","type":"uint256"}],
    "type":"function"
  },
  {
    "constant":false,
    "inputs":[{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],
    "name":"transfer",
    "outputs":[{"name":"","type":"bool"}],
    "type":"function"
  }
];

let web3, vertacoinContract, userAddress;

async function connectWallet() {
  if (window.ethereum) {
    try {
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      web3 = new Web3(window.ethereum);
      const accounts = await web3.eth.getAccounts();
      userAddress = accounts[0];
      walletAddressSpan.textContent = userAddress;
      walletInfo.style.display = 'block';

      vertacoinContract = new web3.eth.Contract(contractABI, contractAddress);
      updateBalances();
    } catch (err) {
      alert("Connection failed: " + err.message);
    }
  } else {
    alert("MetaMask is not installed!");
  }
}



async function updateBalances() {
  if (vertacoinContract && userAddress) {
    const balance = await vertacoinContract.methods.balanceOf(userAddress).call();
    const formatted = web3.utils.fromWei(balance, 'ether');
    walletVertacoinBalance.textContent = formatted;
    dashboardVertacoinBalance.textContent = formatted;
  }
}

sendTokenForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const recipient = document.getElementById('recipient').value;
  const amount = document.getElementById('amount').value;

  if (!recipient || !amount) return;

  try {
    txStatus.textContent = "Sending transaction...";
    const amountWei = web3.utils.toWei(amount, 'ether');

    await vertacoinContract.methods.transfer(recipient, amountWei)
      .send({ from: userAddress });

    txStatus.textContent = "Transaction successful!";
    updateBalances();
    sendTokenForm.reset();
  } catch (err) {
    txStatus.textContent = "Transaction failed: " + err.message;
  }
});

// Attach the same connectWallet function to both buttons
connectWalletBtns.forEach(btn => btn.addEventListener('click', connectWallet));


