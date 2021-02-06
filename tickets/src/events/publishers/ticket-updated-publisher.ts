import { Publisher, Subjects, TicketUpdatedEvent } from '@jatestorg/common';

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
    readonly subject = Subjects.TicketUpdated;
}