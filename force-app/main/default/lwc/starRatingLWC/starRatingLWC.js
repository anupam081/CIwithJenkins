import { LightningElement,api } from 'lwc';

export default class StarRatingLWC extends LightningElement {
  
  static pizzarating;
  static deliveryrating;
  static burgerrating;
  static  packagerating;

  @api name;
  rating(event) {
    if (event.target.name === "Pizza") {        
        StarRatingLWC.pizzarating = event.target.value;        
    }
    if (event.target.name === "Burger") {
        StarRatingLWC.burgerrating = event.target.value;
    }
    if (event.target.name === "Package") {
        StarRatingLWC.packagerating = event.target.value; 
    }
    if (event.target.name === "Delivery") {
        StarRatingLWC.deliveryrating = event.target.value;
    }

    // Creates the event with the data.
    const selectedEvent = new CustomEvent("ratingchange", {
      detail: event.target.name + '-'+ event.target.value
    });
    // Dispatches the event.
    this.dispatchEvent(selectedEvent);
  }
@api
  getvalues() {
    var totalRating = "DeliveryRating:" +
    StarRatingLWC.deliveryrating +
      ", PizzaRating:" +
      StarRatingLWC.pizzarating +
      ", BurgerRating:" +
      StarRatingLWC.burgerrating +
      ", PackageRating:" +
      StarRatingLWC.packagerating;
    alert(totalRating );
    return totalRating;
  }
}