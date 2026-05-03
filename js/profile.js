document.addEventListener('DOMContentLoaded', () => {
    let savedData = JSON.parse(localStorage.getItem('profileData')) || {};
    let products = JSON.parse(localStorage.getItem("cart")) || [];

    document.getElementById('name').innerText = savedData.fullName || 'Default user name';
    document.getElementById('email').innerText = savedData.email || 'example@email.com';

    document.getElementById('full-name').value = savedData.fullName || '';
    document.getElementById('email-address').value = savedData.email || '';
    document.getElementById('phone-number').value = savedData.phone || '';
    document.getElementById('address').value = savedData.address || '';

    let subtotal = 0;
    products.forEach(p => {
        const priceNum = parseFloat(p.price.replace('$', ''));
        subtotal += priceNum * p.quantity;
    });

    const headerProfileImg = document.getElementById('header-profile-img');
    const profilePic = document.getElementById('profile-pic');
    if (savedData && savedData.profilePic) {
        headerProfileImg.src = savedData.profilePic;
        profilePic.src = savedData.profilePic;
    }

    const editBtn = document.querySelector('.edit-btn');
    const profilePicInput = document.getElementById('profile-pic-input');

    editBtn.addEventListener('click', () => {
        profilePicInput.click();
    });

    profilePicInput.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const newSrc = e.target.result;
                profilePic.src = newSrc;
                headerProfileImg.src = newSrc;
                
                savedData.profilePic = newSrc;
                localStorage.setItem('profileData', JSON.stringify(savedData));
            };
            reader.readAsDataURL(file);
        }
    });

    const profileForm = document.getElementById('profileForm');
    profileForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const fullNameInput = document.getElementById('full-name');
        const emailInput = document.getElementById('email-address');
        const phoneInput = document.getElementById('phone-number');
        const addressInput = document.getElementById('address');

        fullNameInput.value = fullNameInput.value.trim();
        emailInput.value = emailInput.value.trim();
        phoneInput.value = phoneInput.value.trim();
        addressInput.value = addressInput.value.trim();

        if (!profileForm.checkValidity()) {
            profileForm.reportValidity();
            return;
        }

        savedData.fullName = fullNameInput.value;
        savedData.email = emailInput.value;
        savedData.phone = phoneInput.value;
        savedData.address = addressInput.value;

        document.getElementById('name').innerText = savedData.fullName || 'Default user name';
        document.getElementById('email').innerText = savedData.email || 'example@email.com';

        localStorage.setItem('profileData', JSON.stringify(savedData));
        alert('changed saved!');
    });

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
                const newValue = input.value;
                valueDiv.innerText = newValue;
                edit.innerText = '✎';
                edit.classList.remove('save');

                const labelElem = row.querySelector('.label');
                let key;
                if (labelElem) {
                    const label = labelElem.innerText;
                    if (label === 'Email') key = 'email';
                    if (label === 'Phone') key = 'phone';
                } else {
                    key = 'address';
                }
                savedData[key] = newValue;
                localStorage.setItem('profileData', JSON.stringify(savedData));

                edit.addEventListener('click', handleEdit);
            });
        });
    });
});
