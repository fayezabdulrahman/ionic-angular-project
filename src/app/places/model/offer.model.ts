export class Offer {
    constructor(
    public id: string,
    public title: string,
    public desc: string, 
    public imageUrl: string, 
    public offerPrice: number,
    public availableFrom: Date,
    public availableTo: Date,
    public userId: string) {}
}