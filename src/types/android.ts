import type {
  AndroidAddressType,
  AndroidBarcodeFormat,
  AndroidBarcodeValueType,
  AndroidEmailType,
  AndroidEncryptionType,
  AndroidPhoneType,
} from "src/constants/android";
import type { Point } from "./common";

/**
 * {@link https://developers.google.com/android/reference/com/google/mlkit/vision/barcode/Barcode.Address}
 */
export interface AndroidAddress {
  addressLines?: string[];
  type?: AndroidAddressType;
}

/**
 * {@link https://developers.google.com/android/reference/com/google/mlkit/vision/barcode/Barcode.PersonName}
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
 * {@link https://developers.google.com/android/reference/com/google/mlkit/vision/barcode/Barcode.ContactInfo}
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
 * {@link https://developers.google.com/android/reference/com/google/mlkit/vision/barcode/Barcode.Email}
 */
export interface AndroidEmail {
  address?: string;
  body?: string;
  subject?: string;
  type?: AndroidEmailType;
}

/**
 * {@link https://developers.google.com/android/reference/com/google/mlkit/vision/barcode/Barcode.Phone}
 */
export interface AndroidPhone {
  number?: string;
  type?: AndroidPhoneType;
}

/**
 * {@link https://developers.google.com/android/reference/com/google/mlkit/vision/barcode/Barcode.Sms}
 */
export interface AndroidSms {
  message?: string;
  phoneNumber?: string;
}

/**
 * {@link https://developers.google.com/android/reference/com/google/mlkit/vision/barcode/Barcode.UrlBookmark}
 */
export interface AndroidUrlBookmark {
  title?: string;
  url?: string;
}

/**
 * {@link https://developers.google.com/android/reference/com/google/mlkit/vision/barcode/Barcode.WiFi}
 */
export interface AndroidWifi {
  encryptionType?: AndroidEncryptionType;
  password?: string;
  ssid?: string;
}

/**
 * {@link https://developers.google.com/android/reference/com/google/mlkit/vision/barcode/Barcode.GeoPoint}
 */
export interface AndroidGeoPoint {
  lat?: number;
  lng?: number;
}

/**
 * {@link https://developers.google.com/android/reference/com/google/mlkit/vision/barcode/Barcode.CalendarDateTime}
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
 * {@link https://developers.google.com/android/reference/com/google/mlkit/vision/barcode/Barcode.CalendarEvent}
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
 * {@link https://developers.google.com/android/reference/com/google/mlkit/vision/barcode/common/Barcode.DriverLicense}
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
 * {@link https://developer.android.com/reference/android/graphics/Rect.html}
 */
export type AndroidRect = {
  bottom: number;
  left: number;
  right: number;
  top: number;
};

/**
 * {@link https://developers.google.com/android/reference/com/google/mlkit/vision/barcode/common/Barcode}
 */
export type AndroidBarcode = {
  boundingBox: AndroidRect;
  cornerPoints: Point[];
  displayValue: string;
  rawValue: string;
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
