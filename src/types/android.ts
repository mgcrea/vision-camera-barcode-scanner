/**
 * @see https://developers.google.com/android/reference/com/google/mlkit/vision/barcode/Barcode.BarcodeFormat
 */
export declare enum AndroidBarcodeFormat {
  UNKNOWN = -1,
  ALL_FORMATS = 0,
  CODE_128 = 1,
  CODE_39 = 2,
  CODE_93 = 4,
  CODABAR = 8,
  DATA_MATRIX = 16,
  EAN_13 = 32,
  EAN_8 = 64,
  ITF = 128,
  QR_CODE = 256,
  UPC_A = 512,
  UPC_E = 1024,
  PDF417 = 2048,
  AZTEC = 4096,
}

/**
 * @see https://developers.google.com/android/reference/com/google/mlkit/vision/barcode/Barcode.BarcodeValueType
 */
export declare enum AndroidBarcodeValueType {
  UNKNOWN = 0,
  CONTACT_INFO = 1,
  EMAIL = 2,
  ISBN = 3,
  PHONE = 4,
  PRODUCT = 5,
  SMS = 6,
  TEXT = 7,
  URL = 8,
  WIFI = 9,
  GEO = 10,
  CALENDAR_EVENT = 11,
  DRIVER_LICENSE = 12,
}

/**
 * @see https://developers.google.com/android/reference/com/google/mlkit/vision/barcode/Barcode.Address.AddressType
 */
export declare enum AndroidAddressType {
  UNKNOWN = 0,
  WORK = 1,
  HOME = 2,
}

/**
 * @see https://developers.google.com/android/reference/com/google/mlkit/vision/barcode/Barcode.Address
 */
export interface AndroidAddress {
  addressLines?: string[];
  type?: AndroidAddressType;
}

/**
 * @see https://developers.google.com/android/reference/com/google/mlkit/vision/barcode/Barcode.PersonName
 */
export interface AndroidPersonName {
  first?: string;
  formattedName?: string;
  last?: string;
  middle?: string;
  prefix?: string;
  pronunciation?: string;
  suffix?: string;
}

/**
 * @see https://developers.google.com/android/reference/com/google/mlkit/vision/barcode/Barcode.ContactInfo
 */
export interface AndroidContactInfo {
  addresses?: AndroidAddress[];
  emails?: AndroidEmail[];
  name?: AndroidPersonName;
  organization?: string;
  phones?: AndroidPhone[];
  title?: string;
  urls?: string[];
}

/**
 * @see https://developers.google.com/android/reference/com/google/mlkit/vision/barcode/Barcode.Email.FormatType
 */
export declare enum AndroidEmailType {
  UNKNOWN = 0,
  WORK = 1,
  HOME = 2,
}

/**
 * @see https://developers.google.com/android/reference/com/google/mlkit/vision/barcode/Barcode.Email
 */
export interface AndroidEmail {
  address?: string;
  body?: string;
  subject?: string;
  type?: AndroidEmailType;
}

/**
 * @see https://developers.google.com/android/reference/com/google/mlkit/vision/barcode/Barcode.Phone.FormatType
 */
export declare enum AndroidPhoneType {
  UNKNOWN = 0,
  WORK = 1,
  HOME = 2,
  FAX = 3,
  MOBILE = 4,
}

/**
 * @see https://developers.google.com/android/reference/com/google/mlkit/vision/barcode/Barcode.Phone
 */
export interface AndroidPhone {
  number?: string;
  type?: AndroidPhoneType;
}

/**
 * @see https://developers.google.com/android/reference/com/google/mlkit/vision/barcode/Barcode.Sms
 */
export interface AndroidSms {
  message?: string;
  phoneNumber?: string;
}

/**
 * @see https://developers.google.com/android/reference/com/google/mlkit/vision/barcode/Barcode.UrlBookmark
 */
export interface AndroidUrlBookmark {
  title?: string;
  url?: string;
}

/**
 * @see https://developers.google.com/android/reference/com/google/mlkit/vision/barcode/Barcode.WiFi.EncryptionType
 */
export declare enum AndroidEncryptionType {
  OPEN = 1,
  WPA = 2,
  WEP = 3,
}

/**
 * @see https://developers.google.com/android/reference/com/google/mlkit/vision/barcode/Barcode.WiFi
 */
export interface AndroidWifi {
  encryptionType?: AndroidEncryptionType;
  password?: string;
  ssid?: string;
}

/**
 * @see https://developers.google.com/android/reference/com/google/mlkit/vision/barcode/Barcode.GeoPoint
 */
export interface AndroidGeoPoint {
  lat?: number;
  lng?: number;
}

/**
 * @see https://developers.google.com/android/reference/com/google/mlkit/vision/barcode/Barcode.CalendarDateTime
 */
export interface AndroidDate {
  day: number;
  hours: number;
  minutes: number;
  month: number;
  rawValue: string;
  seconds: number;
  year: number;
  isUtc: boolean;
}

/**
 * @see https://developers.google.com/android/reference/com/google/mlkit/vision/barcode/Barcode.CalendarEvent
 */
export interface AndroidCalendarEvent {
  description?: string;
  end?: Date;
  location?: string;
  organizer?: string;
  start?: Date;
  status?: string;
  summary?: string;
}

/**
 * @see https://developers.google.com/android/reference/com/google/mlkit/vision/barcode/Barcode.DriverLicense
 */
export interface AndroidDriverLicense {
  addressCity?: string;
  addressState?: string;
  addressStreet?: string;
  addressZip?: string;
  birthDate?: string;
  documentType?: string;
  expiryDate?: string;
  firstName?: string;
  gender?: string;
  issueDate?: string;
  issuingCountry?: string;
  lastName?: string;
  licenseNumber?: string;
  middleName?: string;
}

/**
 * @see https://developer.android.com/reference/android/graphics/Rect.html
 */
export interface AndroidRect {
  bottom: number;
  left: number;
  right: number;
  top: number;
}

/**
 * @see https://developer.android.com/reference/android/graphics/Point.html
 */
export interface AndroidPoint {
  x: number;
  y: number;
}

/**
 * @see https://developers.google.com/android/reference/com/google/mlkit/vision/barcode/Barcode
 */
export declare type AndroidBarcode = {
  boundingBox?: AndroidRect;
  cornerPoints?: AndroidPoint[];
  displayValue?: string;
  rawValue?: string;
  format: AndroidBarcodeFormat;
  content:
    | {
        type:
          | AndroidBarcodeValueType.UNKNOWN
          | AndroidBarcodeValueType.ISBN
          | AndroidBarcodeValueType.TEXT;
        data: string;
      }
    | {
        type: AndroidBarcodeValueType.CONTACT_INFO;
        data: AndroidContactInfo;
      }
    | {
        type: AndroidBarcodeValueType.EMAIL;
        data: AndroidEmail;
      }
    | {
        type: AndroidBarcodeValueType.PHONE;
        data: AndroidPhone;
      }
    | {
        type: AndroidBarcodeValueType.SMS;
        data: AndroidSms;
      }
    | {
        type: AndroidBarcodeValueType.URL;
        data: AndroidUrlBookmark;
      }
    | {
        type: AndroidBarcodeValueType.WIFI;
        data: AndroidWifi;
      }
    | {
        type: AndroidBarcodeValueType.GEO;
        data: AndroidGeoPoint;
      }
    | {
        type: AndroidBarcodeValueType.CALENDAR_EVENT;
        data: AndroidCalendarEvent;
      }
    | {
        type: AndroidBarcodeValueType.DRIVER_LICENSE;
        data: AndroidDriverLicense;
      };
};
