import { LightningElement } from 'lwc';
import pubsub from 'c/pubsub' ;

export default class SubscriberLWC extends LightningElement {
    message;
    connectedCallback(){
        this.regiser();
    }

    regiser(){
        window.console.log('event registered ');
        pubsub.register('simplevt', this.handleEvent.bind(this));
    }

    handleEvent(messageFromEvt){
        window.console.log('event handled ',messageFromEvt);
        this.message = messageFromEvt ? JSON.stringify(messageFromEvt, null, '\t') : 'no message payload';
    }
}