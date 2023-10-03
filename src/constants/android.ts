/**
 * @see https://developers.google.com/android/reference/com/google/mlkit/vision/barcode/Barcode.BarcodeFormat
 */
export const enum AndroidBarcodeFormat {
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
export const enum AndroidBarcodeValueType {
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
export const enum AndroidAddressType {
  UNKNOWN = 0,
  WORK = 1,
  HOME = 2,
}

/**
 * @see https://developers.google.com/android/reference/com/google/mlkit/vision/barcode/Barcode.WiFi.EncryptionType
 */
export const enum AndroidEncryptionType {
  OPEN = 1,
  WPA = 2,
  WEP = 3,
}

/**
 * @see https://developers.google.com/android/reference/com/google/mlkit/vision/barcode/Barcode.Email.FormatType
 */
export const enum AndroidEmailType {
  UNKNOWN = 0,
  WORK = 1,
  HOME = 2,
}

/**
 * @see https://developers.google.com/android/reference/com/google/mlkit/vision/barcode/Barcode.Phone.FormatType
 */
export const enum AndroidPhoneType {
  UNKNOWN = 0,
  WORK = 1,
  HOME = 2,
  FAX = 3,
  MOBILE = 4,
}
