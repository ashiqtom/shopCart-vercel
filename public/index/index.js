document.addEventListener('DOMContentLoaded', () => {
    const mainContent = document.getElementById('main-content');

    // Function to load and display products
    const loadHome = async () => {
        try {
            mainContent.innerHTML = ''; // Clear existing content
            const response = await axios.get('/products');
            const { prods } = response.data;

            if (prods.length > 0) {
                const grid = document.createElement('div');
                grid.className = 'grid';

                prods.forEach(product => {
                    const ProductDiv = document.createElement('div');
                    ProductDiv.className = 'card product-item';

                    ProductDiv.innerHTML = `
                        <h1 class="product__title">${product.title}</h1>
                        <img src="${product.imageUrl}" alt="${product.title}">
                        <h2 class="product__price">$${product.price}</h2>
                        <p class="product__description">${product.description}</p>
                        <button class="addToCartBtn" data-product-id="${product._id}">Add to cart</button>
                    `;

                    grid.appendChild(ProductDiv);
                });

                mainContent.appendChild(grid); // Append grid to main content

                // Attach event listeners to newly created buttons
                grid.querySelectorAll('.addToCartBtn').forEach(button => {
                    button.addEventListener('click', async (event) => {
                        const productId = event.target.getAttribute('data-product-id');
                        const response=await axios.post(`/cart/${productId}`); // Add product to cart
                        loadCart(); // Reload cart to reflect changes
                    });
                });
            } else {
                mainContent.innerHTML = '<h1>No Products Found!</h1>';
            }
        } catch (err) {
            console.error('Error fetching products:', err);
            mainContent.innerHTML = '<h1>Failed to load products</h1>';
        }
    };

    const loadCart = async () => {
        mainContent.innerHTML = '<div class="container"></div>'; // Add container class
        const container = mainContent.querySelector('.container');
        try {
            const response = await axios.get('/cart');
            const cartItems = response.data;

            if (cartItems.length > 0) {
                const cartList = document.createElement('div');
                cartList.className = 'cart-list';

                cartItems.forEach(item => {
                    const product = item.productId;
                    const cartItemDiv = document.createElement('ul');
                    cartItemDiv.className = 'cart-item';

                    cartItemDiv.innerHTML = `
                        <li class="cart-item-details">
                            <span class="product-title">${product.title}</span>
                            <span class="product-price">Price: ${product.price}</span>
                            <span class="product-quantity">Quantity: ${item.quantity}</span>
                            <button class="deleteCartItemBtn" data-product-id="${product._id}">Delete</button>
                        </li>
                    `;
                    cartList.appendChild(cartItemDiv);
                });

                // Attach event listeners to delete buttons
                cartList.querySelectorAll('.deleteCartItemBtn').forEach(button => {
                    button.addEventListener('click', async (event) => {
                        const productId = event.target.getAttribute('data-product-id');
                        await axios.post(`/cartDeleteItem/`, { productId }); 
                        loadCart(); 
                    });
                });

                const orderBtn = document.createElement('button')
                orderBtn.textContent = 'Order'
                orderBtn.className = 'order-button'; // Added class for styling
                orderBtn.addEventListener('click', async () => {
                    const orders = await axios.post('/create-order');
                    loadOrder()
                })
                cartList.appendChild(orderBtn)

                container.appendChild(cartList); // Append cart list to container
            } else {
                container.innerHTML = '<h1>No Items in Cart!</h1>';
            }
        } catch (err) {
            console.error('Error fetching cart items:', err);
            container.innerHTML = '<h1>Failed to load cart items</h1>';
        }
    };
    const loadOrder = async () => {
        mainContent.innerHTML = '<div class="container"></div>'; // Add container class
        const container = mainContent.querySelector('.container');
        container.innerHTML = '';
        try {
            const response = await axios.get('/orders');
            const orders = response.data;
    
            if (orders.length > 0) {
                const orderList = document.createElement('div');
                orderList.className = 'order-list';
    
                orders.forEach(order => {
                    // Create a container for each order
                    const orderDiv = document.createElement('div');
                    orderDiv.className = 'order';
                    
                    // Add order details like user name if needed
                    const orderHeader = document.createElement('h3');
                    orderHeader.textContent = `Order Id ${order._id}`;
                    orderDiv.appendChild(orderHeader);
    
                    // Create a list for products
                    const productList = document.createElement('ul');
                    productList.className = 'product-list';
    
                    order.products.forEach(product => {
                        const productItem = document.createElement('li');
                        productItem.className = 'order-item';
    
                        productItem.innerHTML = `
                            <span class="product-title">${product.title}</span>
                            <span class="product-price">Price: ${product.price}</span>
                            <span class="product-quantity">Quantity: ${product.quantity}</span>
                        `;
    
                        productList.appendChild(productItem);
                    });
    
                    orderDiv.appendChild(productList);
                    orderList.appendChild(orderDiv);
                });
    
                container.appendChild(orderList);
            } else {
                container.innerHTML = '<h1>No Orders Found!</h1>';
            }
        } catch (err) {
            console.error('Error fetching orders:', err);
            container.innerHTML = '<h1>Failed to load orders</h1>';
        }
    };
    
    

    const loadAddProduct = async () => {
        mainContent.innerHTML = `
            <form id="add-product-form">
                <label for="title">Title:</label>
                <input type="text" id="title" name="title" required>

                <label for="imageUrl">Image URL:</label>
                <input type="text" id="imageUrl" name="imageUrl" required>

                <label for="price">Price:</label>
                <input type="number" id="price" name="price" required>

                <label for="description">Description:</label>
                <textarea id="description" name="description" required></textarea>

                <button type="submit">Add Product</button>
            </form>
            `;

        document.getElementById('add-product-form').addEventListener('submit',async(e)=>{
            e.preventDefault()

            const productObj = {
                title:e.target.title.value,
                imageUrl:e.target.imageUrl.value,
                price:e.target.price.value,
                description:e.target.description.value
            }
            try{
                const res= await axios.post('/admin/add-product',productObj)
                e.target.reset()
                loadHome()
            }catch(err){
                console.error(err);
                mainContent.innerHTML=`<h1>Failed to load This Page</h1>`
            }
        })
    };
    const loadProduct=async()=>{
        try {
            mainContent.innerHTML = ''; // Clear existing content
            const response = await axios.get('/products');
            const { prods } = response.data;

            if (prods.length > 0) {
                const grid = document.createElement('div');
                grid.className = 'grid';

                prods.forEach(product => {
                    const ProductDiv = document.createElement('div');
                    ProductDiv.className = 'card product-item';

                    ProductDiv.innerHTML = `
                        <h1 class="product__title">${product.title}</h1>
                        <img src="${product.imageUrl}" alt="${product.title}">
                        <h2 class="product__price">$${product.price}</h2>
                        <p class="product__description">${product.description}</p>
                        <button class="editProductBtn" data-product-id="${product._id}">Edit</button>
                        <button class="deleteProductBtn" data-product-id="${product._id}">Delete</button>
                    `;

                    grid.appendChild(ProductDiv);
                });

                mainContent.appendChild(grid);

                grid.querySelectorAll('.editProductBtn').forEach(button => {
                    button.addEventListener('click', async (event) => {
                        const productId = event.target.getAttribute('data-product-id');
                        const response=await axios.get(`/admin/edit-product/${productId}`);
                        const product = response.data;
                        mainContent.innerHTML = `
                        <form id="edit-product-form">
                            <label for="title">Title:</label>
                            <input type="text" id="title" name="title" value="${product.title}" required>

                            <label for="imageUrl">Image URL:</label>
                            <input type="text" id="imageUrl" name="imageUrl" value="${product.imageUrl}" required>

                            <label for="price">Price:</label>
                            <input type="number" id="price" name="price" value="${product.price}" required>

                            <label for="description">Description:</label>
                            <textarea id="description" name="description" required>${product.description}</textarea>

                            <button type="submit">Update Product</button>
                        </form>
                    `;

                    document.getElementById('edit-product-form').addEventListener('submit', async (e) => {
                        e.preventDefault();

                        const updatedProduct = {
                            productId:productId,
                            title: e.target.title.value,
                            imageUrl: e.target.imageUrl.value,
                            price: e.target.price.value,
                            description: e.target.description.value
                        };

                        try {
                            await axios.post(`/admin/edit-product`, updatedProduct);
                            loadProduct(); // Reload products after update
                        } catch (err) {
                            console.error(err);
                            mainContent.innerHTML='<h1>Failed to load Page</h1>'
                        }
                    });
                });
            });
                grid.querySelectorAll('.deleteProductBtn').forEach(button => {
                    button.addEventListener('click', async (event) => {
                        const productId = event.target.getAttribute('data-product-id');
                        const response=await axios.post(`/admin/delete-product`,{productId:productId});
                        loadProduct()
                    });
                });

            } else {
                mainContent.innerHTML = '<h1>No Products Found!</h1>';
            }
            
            
        } catch (err) {
            console.error('Error fetching products:', err);
            mainContent.innerHTML = '<h1>Failed to load products</h1>';
        }
    }

    // Set up event listeners for navigation links
    document.getElementById('home-link').addEventListener('click', (e) => {
        e.preventDefault();
        loadHome();
    });

    document.getElementById('cart-link').addEventListener('click', (e) => {
        e.preventDefault();
        loadCart();
    });

    document.getElementById('order-link').addEventListener('click', (e) => {
        e.preventDefault();
        loadOrder();
    });

    document.getElementById('addProduct-link').addEventListener('click', (e) => {
        e.preventDefault();
        loadAddProduct();
    });

    document.getElementById('Product-link').addEventListener('click', (e) => {
        e.preventDefault();
        loadProduct();
    });

    loadHome(); // Initial load of home page
});
