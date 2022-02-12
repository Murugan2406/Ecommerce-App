

interface brand {
    id:number;
    name: string;
    is_popular:boolean;

}
export interface sizeArray {
    id: number;
    size: string;
    stock:number;

}
export interface options {
    color:string;
    colorhash: string;
    id: number;
    image_one:string;
    image_three: string;
    image_two:string;
    sizes:Array<sizeArray>;
    stock?: null;
    url:string;

}

interface org {
    original: string;
}


export interface specialProducts {
    OfferDirham: number;
    OfferDollar: number;
    OfferEuro: number;
    OfferPecentageDirham: string
    OfferPecentageDollar: string
    OfferPecentageEuro: string
    OfferPecentageSAR: string
    OfferPecentageSterling: string
    OfferSAR: number;
    OfferSterling: number;
    brand: brand;
    options?:options;
    created_date: Date;
    id: number;
    image:org;
    name:string;
    productpriceDirham: number;
    productpriceDollar: number;
    productpriceEuro: number;
    productpriceSar: number;
    productpriceSterling: number;
}
