import { Message } from 'node-nats-streaming';
import {
    Listener,
    OrderCreatedEvent,
    Subjects
} from '@jatestorg/common';
import { queueGroupName } from './queue-group-name';
import { Order } from '../../models/order';

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
    readonly subject = Subjects.OrderCreated;
    queueGroupName = queueGroupName;

    async onMessage(
        data: OrderCreatedEvent['data'],
        msg: Message
    ) {
        const order = Order.build({
            id: data.id,
            price: data.ticket.price,
            status: data.status,
            version: data.version,
            userId: data.userId
        });

        await order.save();

        msg.ack();
    }
}