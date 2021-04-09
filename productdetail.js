// creates Roll object
function Roll(roll, flavor, quantity) {
    this.roll = roll;
    this.flavor = flavor;
    this.quantity = quantity;
}

// changes current roll selected in localStorage
function selectedRoll(roll) {
    var current_roll = new Roll(roll, 'NONE', '1');
    localStorage.setItem('current_roll', JSON.stringify(current_roll));
}

function setTitleAndCheckCartStatus() {
    setRollTitle();
    checkCartStatus();
}

// sets the roll title on the detail page based on what the user selects
function setRollTitle() {
    let current_roll = JSON.parse(localStorage.getItem('current_roll'));
    document.getElementById('roll_title').innerHTML = current_roll.roll;
}

// toggles hidden content
function show(button_id) {
    document.getElementById(button_id).classList.toggle("show");
}

// allows user to modify options (flavor, quantity)
// replaces photo with updated version
function replace(button_id, value) {
    // replaces the value and text in the button to reflect the new choice
    document.getElementById(button_id).value = value;
    document.getElementById(button_id).innerHTML = value;
    let current_roll = JSON.parse(localStorage.getItem('current_roll'));

    // if flavor changes, changes large photo to represent the roll
    if (button_id == 'flavor-button') {
        document.getElementById('id_large_roll').src = "images/" + value.toLowerCase() + "-roll.png";
        current_roll.flavor = value;
    }

    // if quantity changes, changes the title to represent the new number of rolls selected
    if (button_id == 'quantity-button') {
        current_roll.quantity = value;
        if (value == '1') {
            document.getElementById('roll_title').innerHTML = current_roll.roll;
        }
        else {
            document.getElementById('roll_title').innerHTML = current_roll.roll + " " + value + "-PACK";
        }
    }
    localStorage.setItem('current_roll', JSON.stringify(current_roll));


    // hides dropdown options
    var flavor = document.getElementById("flavors");
    var quantities = document.getElementById("quantities")
    if (flavor.classList.contains('show')) {
        flavor.classList.remove('show');
    }
    if (quantities.classList.contains('show')) {
        quantities.classList.remove('show');
    }
}

// used when loading page, checks contents to show cart notification if items are in the cart
function checkCartStatus() {
    var cart_full = localStorage.getItem('cart');
    if (cart_full == "true") {
        var current_cart = JSON.parse(localStorage.getItem('current_cart'));
        document.getElementById("cart_indication").style.display = "block";
        document.getElementById('cart_indication').innerHTML = current_cart.length;
    }
    else {
        document.getElementById("cart_indication").style.display = "none";
    }
    // console.log(JSON.parse(localStorage.getItem('current_cart')));
}

// sets cart having items to true
// resets the value to update number in cart with every item added
function addToCart() {
    var cart_full = localStorage.getItem('cart');
    var current_roll = JSON.parse(localStorage.getItem('current_roll'));
    let roll_to_add = new Roll(current_roll.roll, current_roll.flavor, current_roll.quantity);
    let current_cart;
    if (cart_full == 'true') {
        // adds roll to list in cart and changes cart indicator
        current_cart = JSON.parse(localStorage.getItem('current_cart'));
        current_cart.push(roll_to_add);
        document.getElementById('cart_indication').innerHTML = current_cart.length;
        localStorage.setItem('current_cart', JSON.stringify(current_cart));
    }
    else {
        // case that this is the first item to add to cart
        localStorage.setItem('cart', 'true');
        current_cart = [roll_to_add];
        localStorage.setItem('current_cart', JSON.stringify(current_cart));
    }
}

// removes the selected roll from the cart
function removeRoll(cart_index) {
    var current_cart = JSON.parse(localStorage.getItem("current_cart"));
    // delete current_cart[cart_index]; <-- leaves undefined index
    // creates a new cart that doesn't add the removed element
    var new_cart = [];
    for (let i = 0; i < current_cart.length; i++) {
        if (i != cart_index) {
            new_cart.push(current_cart[i]);
        }
    }
    // when cart is emptied, change cart value to reflect empty cart
    if (new_cart.length == 0) {
        localStorage.setItem("cart", 'false');
    }
    localStorage.setItem("current_cart", JSON.stringify(new_cart));
    location.reload(); // reloads the page to reflect the updated cart
}

// add rolls to the cart page
function addCartItemsToPage() {
    var cart_full = localStorage.getItem('cart');
    var total = 0;
    if (cart_full == 'true') {
        var current_cart = JSON.parse(localStorage.getItem('current_cart'));
        var place_to_add_roll = document.getElementById("pump_roll");
        var place_to_add_quantity = document.getElementById("pump_quantity");
        for (let i = 0; i < current_cart.length; i++) {
            // add ids to enable removal
            // creates roll title
            var roll = document.createElement("h5");
            var roll_text = document.createTextNode(current_cart[i].roll);
            roll.appendChild(roll_text);
            place_to_add_roll.appendChild(roll);

            // adds roll flavor
            var flavor = document.createElement("label");
            var flavor_text;
            if (current_cart[i].flavor != "NONE") {
                flavor_text = document.createTextNode(current_cart[i].flavor);
            }
            else {
                flavor_text = document.createTextNode("NO FLAVOR SELECTED");
            }

            flavor.appendChild(flavor_text);
            flavor.setAttribute('class', 'flavor');
            place_to_add_roll.appendChild(flavor);

            // adds remove button
            var remove_button = document.createElement("button");
            remove_button.innerHTML = "REMOVE";
            remove_button.setAttribute('class', 'remove_button');
            place_to_add_roll.appendChild(remove_button);
            remove_button.setAttribute('id', current_cart[i].roll + "_" + i.toString());
            remove_button.setAttribute('onclick', 'removeRoll(' + i.toString() + ')');

            // adds quantity value
            var quantity = document.createElement("h5");
            var quantity_text = document.createTextNode(current_cart[i].quantity);
            quantity.appendChild(quantity_text);
            place_to_add_quantity.appendChild(quantity);
            var line_spacing = document.createElement("div");
            line_spacing.setAttribute('class', 'formatted_quantity');
            place_to_add_quantity.appendChild(line_spacing);
            total += parseInt(current_cart[i].quantity) * 6;
        }
    }
    document.getElementById('total').innerHTML = "TOTAL: $" + total.toString() + ".00";
}

function AddItemsToPageAndCheckCartStatus() {
    checkCartStatus();
    addCartItemsToPage();
}
