import { subsubcategories } from './subsubcategories';

export interface subcategories {
    id:number;
    name:string;
    availabeColours?: Array<string>;
    availableSizes?:string;
    availablebrands?: Array<string>;
    url: string;
    image:string;
    subsubcategories:Array<subsubcategories>

}
