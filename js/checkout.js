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

    const validateName = name => /^[A-Za-z\s]{2,50}$/.test(name.trim());
    const validateEmail = email => /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email.trim());
    const validatePhone = phone => /^(010|011|012|015)[0-9]{8}$/.test(phone.trim());
    const validateAddress = address => {
        const trimmedAddress = address.trim();
        return trimmedAddress.length >= 5 && trimmedAddress.length <= 100;
    };
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

    function getFieldValue(id) {
        const valueContainer = document.getElementById(id);
        const input = valueContainer.querySelector('input');
        return input ? input.value.trim() : valueContainer.innerText.trim();
    }

    function validateContactInfo() {
        const name = getFieldValue('name-value');
        const email = getFieldValue('email-value');
        const phone = getFieldValue('phone-value');
        const address = getFieldValue('address-value');
        let valid = true;

        if (!validateName(name)) {
            document.getElementById('name-error').innerText = 'Name must be 2-50 letters.';
            valid = false;
        }
        if (!validateEmail(email)) {
            document.getElementById('email-error').innerText = 'Please enter a valid email address.';
            valid = false;
        }
        if (!validatePhone(phone)) {
            document.getElementById('phone-error').innerText = 'Phone must start with 010, 011, 012, or 015 followed by 8 digits.';
            valid = false;
        }
        if (!validateAddress(address)) {
            document.getElementById('address-error').innerText = 'Address must be 5-100 characters.';
            valid = false;
        }

        return valid;
    }

    function getContactFieldMeta(row) {
        const labelElem = row.querySelector('.label');

        if (!labelElem) {
            return {
                key: 'address',
                errorId: 'address-error',
                validate: validateAddress,
                errorMsg: 'Address must be 5-100 characters, no numbers.'
            };
        }

        const label = labelElem.innerText.trim();
        if (label === 'Name') {
            return {
                key: 'fullName',
                errorId: 'name-error',
                validate: validateName,
                errorMsg: 'Name must be 2-50 letters.'
            };
        }

        if (label === 'Email') {
            return {
                key: 'email',
                errorId: 'email-error',
                validate: validateEmail,
                errorMsg: 'Please enter a valid email address.'
            };
        }

        return {
            key: 'phone',
            errorId: 'phone-error',
            validate: validatePhone,
            errorMsg: 'Phone must start with 010, 011, 012, or 015 followed by 8 digits.'
        };
    }

    const edits = document.querySelectorAll('.edit');
    edits.forEach(edit => {
        edit.addEventListener('click', () => {
            const row = edit.parentElement;
            const valueDiv = row.querySelector('.value');
            const { key, errorId, validate, errorMsg } = getContactFieldMeta(row);

            if (!edit.classList.contains('save')) {
                const currentText = valueDiv.innerText.trim();
                const input = document.createElement('input');
                input.type = 'text';
                input.value = currentText;
                valueDiv.innerHTML = '';
                valueDiv.appendChild(input);
                edit.innerText = '✓';
                edit.classList.add('save');
                input.focus();
                input.select();
                return;
            }

            const input = valueDiv.querySelector('input');
            const newValue = input ? input.value.trim() : valueDiv.innerText.trim();

            if (!validate(newValue)) {
                document.getElementById(errorId).innerText = errorMsg;
                return;
            }

            valueDiv.innerText = newValue;
            edit.innerText = '✎';
            edit.classList.remove('save');
            document.getElementById(errorId).innerText = '';
            savedData[key] = newValue;
            localStorage.setItem('profileData', JSON.stringify(savedData));

            if (key === 'fullName') {
                document.getElementById('card-name').value = newValue;
            }
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

    document.getElementById('payment-form').addEventListener('submit', (event) => {
        event.preventDefault();
        clearErrors();

        const paymentForm = event.currentTarget;
        const cardNumberInput = document.getElementById('card-number');
        const expiryInput = document.getElementById('expiry');
        const cvvInput = document.getElementById('cvv');
        const cardNameInput = document.getElementById('card-name');

        cardNameInput.value = cardNameInput.value.trim();

        let valid = validateContactInfo();
        if (!paymentForm.checkValidity()) {
            paymentForm.reportValidity();
            valid = false;
        }

        const cardNumber = cardNumberInput.value.trim();
        const expiry = expiryInput.value.trim();
        const cvv = cvvInput.value.trim();
        const cardName = cardNameInput.value.trim();

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
            document.getElementById('card-name-error').innerText = 'Name must be 2-50 letters.';
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
