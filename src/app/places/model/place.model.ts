export class Place {
    constructor(
    public id: string,
    public title: string,
    public desc: string, 
    public imageUrl: string, 
    public price: number,
    public availableFrom: Date,
    public availableTo: Date) {}
}