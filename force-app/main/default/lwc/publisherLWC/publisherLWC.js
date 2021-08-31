import { LightningElement,track } from 'lwc';
import pubsub from 'c/pubsub' ;

export default class PublisherLWC extends LightningElement {
    @track messageinput;
    
    handleChange(event) {        
            this.messageinput = event.target.value;   
            console.log('messageinput1 == '+this.messageinput);    
    }

    handleClick(){
        window.console.log('Event Firing..... ');
        console.log('messageinput == '+this.messageinput);
        let message = {
            "message" : this.messageinput
        }
        pubsub.fire('simplevt', message );
        window.console.log('Event Fired ');
    }
}