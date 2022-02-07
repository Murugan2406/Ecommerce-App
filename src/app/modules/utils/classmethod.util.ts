

export const findColumnValue = (element:any, column:string,
  parsingFn?:(elm:any, clm:string)=>string):string => {

  if (parsingFn) {

    const pVal = parsingFn(element, column);
    if (pVal) {

      return pVal;

    }

  }

  return <string> column.split('.').reduce((acc, cur) => acc[cur] ?? '', element);

};

declare const Stripe: (arg0: string) => any;

export const reditectToStripe = (token:string) => {

  const stripe = Stripe('pk_test_ED9cjwAaAIi6XvKCXzwGOu6100MabxSaDJ');
  stripe.redirectToCheckout({
    sessionId: token,

  }).then((res:any) => {


  });

};

