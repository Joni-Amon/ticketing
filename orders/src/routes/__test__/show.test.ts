import request from 'supertest';
import mongoose from 'mongoose';

import { app } from '../../app';
import { Ticket } from '../../models/ticket';

it('fetches the order', async () => {
    // Create ticket
    const ticket = Ticket.build({
        title: 'concert',
        price: 20,
        id: mongoose.Types.ObjectId().toHexString()
    });
    await ticket.save();

    const user = global.signin();

    // Create order
    const { body: order } = await request(app)
        .post('/api/orders')
        .set('Cookie', user)
        .send({ ticketId: ticket.id })
        .expect(201);

    // Fetch order
    const { body: fetchedOrder } = await request(app)
        .get(`/api/orders/${order.id}`)
        .set('Cookie', user)
        .send()
        .expect(200);

    expect(fetchedOrder.id).toEqual(fetchedOrder.id);
    expect(fetchedOrder.ticket.id).toEqual(ticket.id);
});

it('returns an error if one user tries to fetch another users order', async () => {
    // Create ticket
    const ticket = Ticket.build({
        title: 'concert',
        price: 20,
        id: mongoose.Types.ObjectId().toHexString()
    });
    await ticket.save();

    const user = global.signin();

    // Create order
    const { body: order } = await request(app)
        .post('/api/orders')
        .set('Cookie', user)
        .send({ ticketId: ticket.id })
        .expect(201);

    // Fetch order
    await request(app)
        .get(`/api/orders/${order.id}`)
        .set('Cookie', global.signin())
        .send()
        .expect(401);
});