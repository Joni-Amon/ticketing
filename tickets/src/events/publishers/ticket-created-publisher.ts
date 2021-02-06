import { Publisher, Subjects, TicketCreatedEvent } from '@jatestorg/common';

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
    readonly subject = Subjects.TicketCreated;
}