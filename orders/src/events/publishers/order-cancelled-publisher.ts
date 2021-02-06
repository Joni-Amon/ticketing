import {
    Publisher,
    OrderCancelledEvent,
    Subjects
} from '@jatestorg/common';

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
    readonly subject = Subjects.OrderCancelled;
}