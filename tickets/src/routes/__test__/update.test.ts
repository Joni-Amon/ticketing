import request from 'supertest';
import mongoose from 'mongoose';

import { app } from '../../app';
import { natsWrapper } from '../../nats-wrapper';
import { Ticket } from '../../models/ticket';

it('returns a 404 if the provided id does not exist', async () => {
    const id = new mongoose.Types.ObjectId().toHexString();

    await request(app)
        .put(`/api/tickets/${id}`)
        .set('Cookie', global.signin())
        .send({
            title: 'Valid title',
            price: 20
        })
        .expect(404);
});

it('returns a 401 if the user is not authenticated', async () => {
    const id = new mongoose.Types.ObjectId().toHexString();

    await request(app)
        .put(`/api/tickets/${id}`)
        .send({
            title: 'Valid title',
            price: 20
        })
        .expect(401);
});

it('returns a 401 if the user does not own the ticket', async () => {
    const response = await request(app)
        .post(`/api/tickets`)
        .set('Cookie', global.signin())
        .send({
            title: 'Valid title',
            price: 20
        })
        .expect(201);

    await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set('Cookie', global.signin())
        .send({
            title: 'Valid titlee',
            price: 200
        })
        .expect(401);
});

it('returns a 400 if the user provides an ivalid title or price', async () => {
    const cookie = global.signin();

    const response = await request(app)
        .post(`/api/tickets`)
        .set('Cookie', cookie)
        .send({
            title: 'Valid title',
            price: 20
        })
        .expect(201);

    await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set('Cookie', cookie)
        .send({
            title: '',
            price: 20
        })
        .expect(400);

    await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set('Cookie', cookie)
        .send({
            title: 'Ttitlee',
            price: 0
        })
        .expect(400);
});

it('updates the ticket provided valid inputs', async () => {
    const cookie = global.signin();

    const response = await request(app)
        .post(`/api/tickets`)
        .set('Cookie', cookie)
        .send({
            title: 'Valid title',
            price: 20
        })
        .expect(201);
    
    const newTitle = 'Valid titlee';
    const newPrice = 200;
    const ticketResponse = await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set('Cookie', cookie)
        .send({
            title: newTitle,
            price: newPrice
        })
        .expect(200);
    
    expect(ticketResponse.body.title).toEqual(newTitle);
    expect(ticketResponse.body.price).toEqual(newPrice);
    
    const showTicketResponse = await request(app)
        .get(`/api/tickets/${response.body.id}`)
        .set('Cookie', cookie)
        .send()
        .expect(200);
    
    expect(showTicketResponse.body.title).toEqual(newTitle);
    expect(showTicketResponse.body.price).toEqual(newPrice);
});

it('publishes an event', async () => {
    const cookie = global.signin();

    const response = await request(app)
        .post(`/api/tickets`)
        .set('Cookie', cookie)
        .send({
            title: 'Valid title',
            price: 20
        })
        .expect(201);
    
    const newTitle = 'Valid titlee';
    const newPrice = 200;
    await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set('Cookie', cookie)
        .send({
            title: newTitle,
            price: newPrice
        })
        .expect(200);

    expect(natsWrapper.client.publish).toHaveBeenCalledTimes(2);
});

it('rejects updates if the ticket is reserved', async () => {
    const user = global.signin();

    const { body: createdTicket } = await request(app)
        .post('/api/tickets')
        .set('Cookie', user)
        .send({
            title: 'asdf',
            price: 20
        })
        .expect(201);

    const ticket = await Ticket.findById(createdTicket.id);
    ticket?.set({ orderId: mongoose.Types.ObjectId().toHexString() });
    await ticket?.save();

    await request(app)
        .put(`/api/tickets/${createdTicket.id}`)
        .set('Cookie', user)
        .send({
            title: 'new title',
            price: 100
        })
        .expect(400);
});