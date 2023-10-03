package com.visioncameracodescanner;

// https://github.com/googlesamples/mlkit/blob/master/android/android-snippets/app/src/main/java/com/google/example/mlkit/BarcodeScanningActivity.java

import android.graphics.ImageFormat;
import android.media.Image;
import android.util.Log;
import androidx.annotation.NonNull;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.WritableNativeArray;
import com.facebook.react.bridge.WritableNativeMap;
import com.google.android.gms.tasks.OnFailureListener;
import com.google.android.gms.tasks.OnSuccessListener;
import com.google.android.gms.tasks.Task;
import com.google.android.gms.tasks.Tasks;
import com.google.mlkit.vision.barcode.BarcodeScanner;
import com.google.mlkit.vision.barcode.BarcodeScannerOptions;
import com.google.mlkit.vision.barcode.BarcodeScanning;
import com.google.mlkit.vision.barcode.common.Barcode;
import com.google.mlkit.vision.common.InputImage;
import com.mrousavy.camera.frameprocessor.Frame;
import com.mrousavy.camera.frameprocessor.FrameProcessorPlugin;
import com.mrousavy.camera.parsers.Orientation;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ExecutionException;
import org.jetbrains.annotations.NotNull;
import org.jetbrains.annotations.Nullable;

public class CodeScannerProcessorPlugin extends FrameProcessorPlugin {

  public CodeScannerProcessorPlugin() {
    BarcodeScannerOptions options = new BarcodeScannerOptions.Builder()
      .setBarcodeFormats(
        Barcode.FORMAT_CODE_128,
        Barcode.FORMAT_CODE_39,
        Barcode.FORMAT_EAN_13,
        Barcode.FORMAT_EAN_8
      )
      .build();
  }

  @Override
  public Object callback(
    @NotNull Frame frame,
    @Nullable Map<String, Object> params
  ) {
    Image mediaImage = frame.getImage();
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

    Map<String, Object> result = new HashMap<>();

    Map<String, Object> image = new HashMap<>();
    image.put("width", mediaImage.getWidth());
    image.put("height", mediaImage.getHeight());
    image.put("orientation", frame.getOrientation());
    image.put("pixelFormat", frame.getPixelFormat());
    result.put("image", image);

    List<Object> barcodes = new ArrayList<>();
    result.put("barcodes", barcodes);

    InputImage inputImage = InputImage.fromMediaImage(
      mediaImage,
      Orientation.Companion.fromUnionValue(frame.getOrientation()).toDegrees()
    );

    BarcodeScanner scanner = BarcodeScanning.getClient();
    Task<List<Barcode>> barcodeListTask = scanner.process(inputImage);

    try {
      List<Barcode> barcodeList = Tasks.await(barcodeListTask);
      for (Barcode barcode : barcodeList) {
        barcodes.add(BarcodeConverter.convertBarcode(barcode));
      }
    } catch (Exception e) {
      e.printStackTrace();
      result.put("error", e.getMessage());
    }
    return result;
  }
}
