import { specialProducts } from './specialProducts';

export interface categories {
    id: number;
    name :string;
    subcategories:specialProducts[];
    url: string;
}
