package com.visioncameracodescanner;

import androidx.annotation.NonNull;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.module.annotations.ReactModule;
import com.google.mlkit.vision.barcode.common.Barcode;
import java.util.HashMap;
import java.util.Map;

@ReactModule(name = VisionCameraCodeScannerModule.NAME)
public class VisionCameraCodeScannerModule extends ReactContextBaseJavaModule {

  public static final String NAME = "VisionCameraCodeScanner";

  public VisionCameraCodeScannerModule(ReactApplicationContext reactContext) {
    super(reactContext);
  }

  @Override
  @NonNull
  public String getName() {
    return NAME;
  }

  // Example method
  // See https://reactnative.dev/docs/native-modules-android
  @ReactMethod
  public void multiply(double a, double b, Promise promise) {
    promise.resolve(a * b);
  }

  @Override
  public Map<String, Object> getConstants() {
    final Map<String, Object> constants = new HashMap<>();

    constants.put("MODULE_NAME", NAME);

    Map<String, Number> barcodeType = new HashMap<>();
    barcodeType.put("TYPE_UNKNOWN", Barcode.TYPE_UNKNOWN);
    barcodeType.put("TYPE_ISBN", Barcode.TYPE_ISBN);
    barcodeType.put("TYPE_TEXT", Barcode.TYPE_TEXT);
    barcodeType.put("TYPE_CONTACT_INFO", Barcode.TYPE_CONTACT_INFO);
    barcodeType.put("TYPE_PHONE", Barcode.TYPE_PHONE);
    barcodeType.put("TYPE_SMS", Barcode.TYPE_SMS);
    barcodeType.put("TYPE_URL", Barcode.TYPE_URL);
    barcodeType.put("TYPE_WIFI", Barcode.TYPE_WIFI);
    barcodeType.put("TYPE_GEO", Barcode.TYPE_GEO);
    barcodeType.put("TYPE_CALENDAR_EVENT", Barcode.TYPE_CALENDAR_EVENT);
    barcodeType.put("TYPE_DRIVER_LICENSE", Barcode.TYPE_DRIVER_LICENSE);
    constants.put("BARCODE_TYPES", barcodeType);

    Map<String, Number> barcodeFormat = new HashMap<>();
    barcodeFormat.put("FORMAT_UNKNOWN", Barcode.FORMAT_UNKNOWN);
    barcodeFormat.put("FORMAT_ALL_FORMATS", Barcode.FORMAT_ALL_FORMATS);
    barcodeFormat.put("FORMAT_CODE_128", Barcode.FORMAT_CODE_128);
    barcodeFormat.put("FORMAT_CODE_39", Barcode.FORMAT_CODE_39);
    barcodeFormat.put("FORMAT_CODE_93", Barcode.FORMAT_CODE_93);
    barcodeFormat.put("FORMAT_CODABAR", Barcode.FORMAT_CODABAR);
    barcodeFormat.put("FORMAT_DATA_MATRIX", Barcode.FORMAT_DATA_MATRIX);
    barcodeFormat.put("FORMAT_EAN_13", Barcode.FORMAT_EAN_13);
    barcodeFormat.put("FORMAT_EAN_8", Barcode.FORMAT_EAN_8);
    barcodeFormat.put("FORMAT_ITF", Barcode.FORMAT_ITF);
    barcodeFormat.put("FORMAT_QR_CODE", Barcode.FORMAT_QR_CODE);
    barcodeFormat.put("FORMAT_UPC_A", Barcode.FORMAT_UPC_A);
    barcodeFormat.put("FORMAT_UPC_E", Barcode.FORMAT_UPC_E);
    barcodeFormat.put("FORMAT_PDF417", Barcode.FORMAT_PDF417);
    barcodeFormat.put("FORMAT_AZTEC", Barcode.FORMAT_AZTEC);
    constants.put("BARCODE_FORMATS", barcodeFormat);

    return constants;
  }
}
