
const createOrderConfirmationEmailHtml = (orderId, productList, totalPrice) => `
    <div 
        style="
            border-radius:10px; 
            font-family: Jost, sans-serif;
            max-width: 600px; 
            margin: 0 auto; 
            padding: 20px; 
            background-color: #EAE9E8 !important;
        "
    >
        <h1 
            style="
                text-align: center; 
                color: #0F303F !important;
                font-family: Jost;
                font-size: 26px;
                text-transform: uppercase;
            "
        >
            Спасибо за ваш заказ!
        </h1>
        <p style=" 
                font-family: Jost;
                display: flex;
                align-items: center;
                gap:5px;
                font-size: 20px;
                color: #0F303F;
                font-weight:600;
                margin:0px;  
            "
        >
            <span>Номер заказа: </span> 
            <span style="font-size: 20px;font-weight:600; "
            >
                ${orderId}
            </span>
        </p>
        
        <ul 
            style="
            padding: 20px; 
            border-radius: 10px;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 30px;
            margin:0px;
            "
        >
            ${productList}
        </ul>
        
            <p style="font-size:18px; color: #0F303F;">
                Всего: <span style="font-weight:600; font-size:20px;">${totalPrice} $</span>
            </p>
            </div>

`

const createProductListItemHtml = (productId, productName, productSize, productPrice) => `
    <li 
        style="
            max-width: 400px;
            list-style: none; 
            background-color: #f2f2f2;
            border-radius: 10px;
            display: flex;
            flex-direction: column;
            align-items: start;
            gap: 5px;
            padding: 10px;
        "
    >
            <img 
                src="cid:${productId}"
                alt="${productName}"
                width="220" height="270"
                style="
                    border-radius: 10px;
                    object-fit: contain;
                    padding: 5px;
                    background-color: #fff;
                    border: 1px solid #ddd; 
                    object-fit: contain; 
                    padding: 5px;
                "
            />
            <div style=" 
                display:flex; 
                flex-direction:column;
                color: #0F303F ;
                font-family: Jost;
                "
            >
                <div style=" font-size:20px"
                >
                    ${productName}
                </div>
                <div style="margin-bottom:5px;">Размер: ${productSize}</div>
                <div style="font-size:20px">${productPrice} $</div>
            </div>
        </li>
`

module.exports = { createOrderConfirmationEmailHtml, createProductListItemHtml };
