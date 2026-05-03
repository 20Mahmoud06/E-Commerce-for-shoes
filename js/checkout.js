document.addEventListener('DOMContentLoaded', () => {
    let savedData = JSON.parse(localStorage.getItem('profileData')) || {};
    let products = JSON.parse(localStorage.getItem("cart")) || [];

    document.getElementById('name-value').innerText = savedData.fullName || '';
    document.getElementById('email-value').innerText = savedData.email || '';
    document.getElementById('phone-value').innerText = savedData.phone || '';
    document.getElementById('address-value').innerText = savedData.address || '';
    document.getElementById('card-name').value = savedData.fullName || '';

    let subtotal = 0;
    products.forEach(p => {
        subtotal += parseFloat(p.price.replace('$', '')) * p.quantity;
    });
    const totalPrice = '$' + subtotal.toFixed(2);
    document.querySelector('.total-price').innerText = totalPrice;

    const headerProfileImg = document.getElementById('header-profile-img');
    if (savedData.profilePic) headerProfileImg.src = savedData.profilePic;

    function clearErrors() {
        document.querySelectorAll('.error').forEach(el => el.innerText = '');
    }

    const validateName = name => name.trim().length > 0;
    const validateEmail = email => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    const validatePhone = phone => /^\d{10,15}$/.test(phone.replace(/\D/g, ''));
    const validateAddress = address => address.trim().length > 0;
    const validateCardNumber = num => {
        num = num.replace(/\s/g, '');
        return num.length === 16 && /^\d{16}$/.test(num);
    };
    const validateExpiry = exp => {
        if (!/^\d{2}\/\d{2}$/.test(exp)) return false;
        let [mm, yy] = exp.split('/').map(Number);
        if (mm < 1 || mm > 12) return false;
        let now = new Date();
        let expDate = new Date(2000 + yy, mm, 0);
        return expDate > now;
    };
    const validateCVV = cvv => /^\d{3,4}$/.test(cvv);

    const edits = document.querySelectorAll('.edit');
    edits.forEach(edit => {
        edit.addEventListener('click', function handleEdit() {
            const row = edit.parentElement;
            const valueDiv = row.querySelector('.value');
            const currentText = valueDiv.innerText;
            const input = document.createElement('input');
            input.type = 'text';
            input.value = currentText;
            valueDiv.innerHTML = '';
            valueDiv.appendChild(input);
            edit.innerText = '✓';
            edit.classList.add('save');
            edit.removeEventListener('click', handleEdit);
            edit.addEventListener('click', () => {
                const newValue = input.value.trim();
                const labelElem = row.querySelector('.label');
                let key, errorId;
                if (labelElem) {
                    const label = labelElem.innerText;
                    key = label === 'Name' ? 'fullName' : label === 'Email' ? 'email' : 'phone';
                    errorId = `${key === 'fullName' ? 'name' : key}-error`;
                } else {
                    key = 'address';
                    errorId = 'address-error';
                }
                let valid = true;
                let errorMsg = '';
                if (key === 'fullName' && !validateName(newValue)) {
                    valid = false;
                    errorMsg = 'Name cannot be empty.';
                } else if (key === 'email' && !validateEmail(newValue)) {
                    valid = false;
                    errorMsg = 'Invalid email format.';
                } else if (key === 'phone' && !validatePhone(newValue)) {
                    valid = false;
                    errorMsg = 'Phone must be 10-15 digits.';
                } else if (key === 'address' && !validateAddress(newValue)) {
                    valid = false;
                    errorMsg = 'Address cannot be empty.';
                }
                if (valid) {
                    valueDiv.innerText = newValue;
                    edit.innerText = '✎';
                    edit.classList.remove('save');
                    savedData[key] = newValue;
                    localStorage.setItem('profileData', JSON.stringify(savedData));
                    if (key === 'fullName') document.getElementById('card-name').value = newValue;
                    document.getElementById(errorId).innerText = '';
                    edit.addEventListener('click', handleEdit);
                } else {
                    document.getElementById(errorId).innerText = errorMsg;
                }
            });
        });
    });

    const cardNumberInput = document.getElementById('card-number');
    cardNumberInput.addEventListener('input', e => {
        let val = e.target.value.replace(/\D/g, '').slice(0, 16);
        e.target.value = val.replace(/(\d{4})(?=\d)/g, '$1 ');
    });

    const expiryInput = document.getElementById('expiry');
    expiryInput.addEventListener('input', e => {
        let val = e.target.value.replace(/\D/g, '').slice(0, 4);
        if (val.length > 2) val = val.slice(0, 2) + '/' + val.slice(2);
        e.target.value = val;
    });

    const cvvInput = document.getElementById('cvv');
    cvvInput.addEventListener('input', e => {
        e.target.value = e.target.value.replace(/\D/g, '').slice(0, 4);
    });

    document.querySelector('.pay-btn').addEventListener('click', () => {
        clearErrors();
        const cardNumber = document.getElementById('card-number').value;
        const expiry = document.getElementById('expiry').value;
        const cvv = document.getElementById('cvv').value;
        const cardName = document.getElementById('card-name').value;
        let valid = true;
        if (!validateCardNumber(cardNumber)) {
            document.getElementById('card-number-error').innerText = 'Invalid card number (must be 16 digits).';
            valid = false;
        }
        if (!validateExpiry(expiry)) {
            document.getElementById('expiry-error').innerText = 'Invalid or expired date (MM/YY).';
            valid = false;
        }
        if (!validateCVV(cvv)) {
            document.getElementById('cvv-error').innerText = 'CVV must be 3 or 4 digits.';
            valid = false;
        }
        if (!validateName(cardName)) {
            document.getElementById('card-name-error').innerText = 'Name on card cannot be empty.';
            valid = false;
        }
        if (valid) {
            localStorage.setItem('lastOrderTotal', totalPrice);
            alert('Payment successful!');
            localStorage.removeItem('cart');
            window.location.href = '../html/feedback.html';
        }
    });
});
