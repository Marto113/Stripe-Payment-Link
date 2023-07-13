const stripe = require('stripe')('sk_test_51NQ5VyBZKsEJBqMNnSnAHLSaTz8962S3IhVjHQCGs5HX4WLy7r48ux0uGOR3E6wxl5pyrgpXZd8UQbt5G08PA2yQ00EAVhnzoR');
const express = require('express');
const app = express();
const bodyparser = require('body-parser');
const endpoint = "whsec_8097e435d0a95c330080a34a59ff2b49bbb1cbbb1255d6f30c8d35d3c814a6de";


app.get('/webhook', (request, response) => {
    response.send('Get request recieved');
});

app.post('/webhook', bodyparser.raw({type: 'application/json'}), async(request, response) => {
    const sig = request.headers['stripe-signature'];

    let event;

    try {
        event = stripe.webhooks.constructEvent(request.body, sig, endpoint);
    } catch (err) {
        response.status(400).send(`Webhooks: ${err.message}`);
        return;
    }

    switch(event.type){
        case 'payment_intent.payment_failed':
            const paymentIntentPaymentFailed = event.data.object;
            response.status(402);
            console.log('fail');
            break;
        case 'payment_intent.succeeded':
            const paymentIntentSucceeded = event.data.object;
            response.status(200);
            console.log('success');
            break;
        default:
            response.status(404).json({success:false});
    }

    response.json({success:true});
});

app.listen(3000, () => console.log('Running port 3000'));