import {
    Subjects, Publisher, ExpirationCompleteEvent
} from '@jatestorg/common';

export class ExpirationCompletePublisher extends Publisher<
    ExpirationCompleteEvent
> {
    readonly subject = Subjects.ExpirationComplete;
}