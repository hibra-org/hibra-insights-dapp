import { SweetAlertOptions } from 'sweetalert2';

function isEmpty(obj: Array<any> | object): boolean {
  if (!obj || typeof obj !== 'object') return !obj;

  if (Array.isArray(obj)) {
    return !obj.length;
  }

  return !Object.keys(obj).length;
}

function removeUndefinedAndNull(obj: Object) {
  const result: Record<string, any> = {};

  for (const key in obj) {
    if (
      obj[key as keyof Object] !== undefined &&
      obj[key as keyof Object] !== null
    ) {
      result[key as any] = obj[key as keyof Object];
    }
  }

  return result;
}

const toBase64 = (str: string) =>
  typeof window === 'undefined'
    ? Buffer.from(str).toString('base64')
    : window.btoa(str);

// Pixel GIF code adapted from https://stackoverflow.com/a/33919020/266535
const keyStr =
  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';

const triplet = (e1: number, e2: number, e3: number) =>
  keyStr.charAt(e1 >> 2) +
  keyStr.charAt(((e1 & 3) << 4) | (e2 >> 4)) +
  keyStr.charAt(((e2 & 15) << 2) | (e3 >> 6)) +
  keyStr.charAt(e3 & 63);

const rgbDataURL = (r: number, g: number, b: number) =>
  `data:image/gif;base64,R0lGODlhAQABAPAA${
    triplet(0, r, g) + triplet(b, 255, 255)
  }/yH5BAAAAAAALAAAAAABAAEAAAICRAEAOw==`;

const PLACEHOLDER_IMAGE = rgbDataURL(204, 204, 204) as 'data:image/${string}';

const toCapitalizeFirstLetter = (str: string) =>
  str[0].toUpperCase() + str.slice(1);

const getSweetErrorConfig = (message: string): SweetAlertOptions => {
  return {
    icon: 'error',
    title: message,
    width: 600,
    padding: '3em',
    color: '#716add',
    backdrop: `
            rgba(0,0,123,0.4)
            url("/common/nyan-cat.gif")
            left top
            no-repeat
        `,
  };
};

const currencyFormat = (value: bigint | number) =>
  new Intl.NumberFormat('en', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 4,
  }).format(value);

export {
  removeUndefinedAndNull,
  isEmpty,
  toBase64,
  rgbDataURL,
  toCapitalizeFirstLetter,
  getSweetErrorConfig,
  PLACEHOLDER_IMAGE,
  currencyFormat,
};
