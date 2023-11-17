package com.visioncameracodescanner;

// https://github.com/googlesamples/mlkit/blob/master/android/android-snippets/app/src/main/java/com/google/example/mlkit/BarcodeScanningActivity.java

import android.graphics.ImageFormat;
import android.graphics.Rect;
import android.media.Image;
import android.util.Log;
import com.google.android.gms.tasks.Task;
import com.google.android.gms.tasks.Tasks;
import com.google.mlkit.vision.barcode.BarcodeScanner;
import com.google.mlkit.vision.barcode.BarcodeScannerOptions;
import com.google.mlkit.vision.barcode.BarcodeScanning;
import com.google.mlkit.vision.barcode.common.Barcode;
import com.google.mlkit.vision.common.InputImage;
import com.mrousavy.camera.frameprocessor.Frame;
import com.mrousavy.camera.frameprocessor.FrameProcessorPlugin;
import com.mrousavy.camera.types.Orientation;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import org.jetbrains.annotations.NotNull;
import org.jetbrains.annotations.Nullable;

public class CodeScannerProcessorPlugin extends FrameProcessorPlugin {

  private BarcodeScanner barcodeScanner = null;
  private int barcodeScannerFormatsBitmap = -1;

  CodeScannerProcessorPlugin(@Nullable Map<String, Object> options) {
    super(options);
    Log.d(
      VisionCameraCodeScannerModule.NAME,
      "CodeScannerProcessorPlugin initialized with options: " + options
    );
  }

  @Nullable
  @Override
  public Object callback(
    @NotNull Frame frame,
    @Nullable Map<String, Object> params
  ) {
    Image mediaImage = frame.getImage();

    // Check if the image is in a supported format
    int format = mediaImage.getFormat();
    if (format != ImageFormat.YUV_420_888) {
      Log.e(
        VisionCameraCodeScannerModule.NAME,
        "Unsupported image format: " +
        format +
        ". Only YUV_420_888 is supported for now."
      );
      return null;
    }

    List<Object> barcodes = new ArrayList<>();

    InputImage inputImage = InputImage.fromMediaImage(
      mediaImage,
      Orientation.Companion.fromUnionValue(frame.getOrientation()).toDegrees()
    );
    List<Number> regionOfInterestList = (ArrayList<Number>) params.get(
      "regionOfInterest"
    );
    if (regionOfInterestList != null) {
      Rect regionOfInterestRect = new Rect(
        regionOfInterestList.get(0).intValue(),
        regionOfInterestList.get(1).intValue(),
        regionOfInterestList.get(0).intValue() +
        regionOfInterestList.get(2).intValue(),
        regionOfInterestList.get(1).intValue() +
        regionOfInterestList.get(3).intValue()
      );
      // @TODO
      // inputImage.setCropRegion(regionOfInterestRect);
    }

    BarcodeScanner scanner = getBarcodeScannerClient(params);
    Task<List<Barcode>> barcodeListTask = scanner.process(inputImage);

    try {
      List<Barcode> barcodeList = Tasks.await(barcodeListTask);
      for (Barcode barcode : barcodeList) {
        barcodes.add(BarcodeConverter.convertBarcode(barcode));
      }
    } catch (Exception err) {
      Log.e(VisionCameraCodeScannerModule.NAME, err.getMessage());
      return null;
    }

    return barcodes;
  }

  private BarcodeScanner getBarcodeScannerClient(
    @Nullable Map<String, Object> params
  ) {
    Set<Integer> barcodeFormats = new HashSet<>();

    if (params != null) {
      HashMap<String, String> barcodeTypes = (HashMap<
          String,
          String
        >) params.get("barcodeTypes");
      if (barcodeTypes != null && barcodeTypes.size() > 0) {
        for (String type : barcodeTypes.values()) {
          switch (type) {
            case "code-128":
              barcodeFormats.add(Barcode.FORMAT_CODE_128);
              break;
            case "code-39":
              barcodeFormats.add(Barcode.FORMAT_CODE_39);
              break;
            case "code-93":
              barcodeFormats.add(Barcode.FORMAT_CODE_93);
              break;
            case "data-matrix":
              barcodeFormats.add(Barcode.FORMAT_DATA_MATRIX);
              break;
            case "ean-13":
              barcodeFormats.add(Barcode.FORMAT_EAN_13);
              break;
            case "ean-8":
              barcodeFormats.add(Barcode.FORMAT_EAN_8);
              break;
            case "upc-a":
              barcodeFormats.add(Barcode.FORMAT_UPC_A);
              break;
            case "upc-e":
              barcodeFormats.add(Barcode.FORMAT_UPC_E);
              break;
            case "qr":
              barcodeFormats.add(Barcode.FORMAT_QR_CODE);
              break;
            default:
              Log.e(
                VisionCameraCodeScannerModule.NAME,
                "Unsupported barcode type: " + type
              );
          }
        }
      }
    }

    if (barcodeFormats.isEmpty()) {
      barcodeFormats.add(Barcode.FORMAT_ALL_FORMATS);
    }

    int[] barcodeFormatsArray = barcodeFormats
      .stream()
      .mapToInt(i -> i)
      .toArray();

    int formatsBitmap = barcodeFormatsToBitmap(barcodeFormatsArray);
    if (
      barcodeScanner != null && barcodeScannerFormatsBitmap == formatsBitmap
    ) {
      return barcodeScanner;
    }
    barcodeScannerFormatsBitmap = formatsBitmap;

    BarcodeScannerOptions barcodeScannerOptions =
      new BarcodeScannerOptions.Builder()
        .setBarcodeFormats(
          barcodeFormatsArray[0],
          Arrays.copyOfRange(barcodeFormatsArray, 1, barcodeFormatsArray.length)
        )
        .build();

    barcodeScanner = BarcodeScanning.getClient(barcodeScannerOptions);

    return barcodeScanner;
  }

  private int barcodeFormatsToBitmap(int[] barcodeFormats) {
    int bitmap = 0;
    for (int format : barcodeFormats) {
      bitmap |= format;
    }
    return bitmap;
  }
}
