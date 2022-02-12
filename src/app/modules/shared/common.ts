export interface queryString {
    from:string;
    value:string;
    brand?:Array<string> | string;
    color?:Array<string> | string;
    size?:Array<string> | string;
    minPrice?:string;
    maxPrice?:string;
    sortBy?:string;
    pageIndex?:string;

}
