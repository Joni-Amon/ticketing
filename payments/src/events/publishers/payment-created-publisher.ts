import {
    Publisher,
    PaymentCreatedEvent,
    Subjects
} from '@jatestorg/common';

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
    readonly subject = Subjects.PaymentCreated;
}