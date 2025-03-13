package com.visioncameracodescanner;

import android.graphics.ImageFormat;
import android.media.Image;
import android.util.Log;
import com.google.android.gms.tasks.Tasks;
import com.google.mlkit.vision.barcode.BarcodeScanner;
import com.google.mlkit.vision.barcode.BarcodeScannerOptions;
import com.google.mlkit.vision.barcode.BarcodeScanning;
import com.google.mlkit.vision.barcode.common.Barcode;
import com.google.mlkit.vision.common.InputImage;
import com.mrousavy.camera.core.FrameInvalidError;
import com.mrousavy.camera.frameprocessors.Frame;
import com.mrousavy.camera.frameprocessors.FrameProcessorPlugin;
import com.mrousavy.camera.frameprocessors.VisionCameraProxy;
import com.mrousavy.camera.core.types.Orientation;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.ExecutionException;
import org.jetbrains.annotations.NotNull;
import org.jetbrains.annotations.Nullable;

public class CodeScannerProcessorPlugin extends FrameProcessorPlugin {

  private static final String TAG = VisionCameraCodeScannerModule.NAME;
  private static BarcodeScanner barcodeScanner = null;
  private static int previousBarcodeScannerFormatsBitmap = -1;

  CodeScannerProcessorPlugin(@NotNull VisionCameraProxy proxy,
                             @Nullable Map<String, Object> options) {
    Log.d(TAG,
          "CodeScannerProcessorPlugin initialized with options: " + options);
  }

  @Nullable
  @Override
  public Object callback(@NotNull Frame frame,
                         @Nullable Map<String, Object> params) {

    try {
      Image mediaImage = frame.getImage();

      if (mediaImage.getFormat() != ImageFormat.YUV_420_888) {
        Log.e(TAG, "Unsupported image format: " + mediaImage.getFormat() +
                ". Only YUV_420_888 is supported for now.");
        return null;
      }
    } catch (FrameInvalidError e) {
      Log.e(TAG, "Received an invalid frame.");
      return null;
    }

    InputImage inputImage = getInputImageFromFrame(frame);
    if (inputImage == null) {
      return null;
    }

    BarcodeScanner scanner = getBarcodeScannerClient(params);

    List<Object> barcodes = new ArrayList<>();
    try {
      List<Barcode> barcodeList = Tasks.await(scanner.process(inputImage));
      barcodeList.forEach(
          barcode -> barcodes.add(BarcodeConverter.convertBarcode(barcode)));
    } catch (ExecutionException | InterruptedException e) {
      Log.e(TAG, "Error processing image for barcodes: " + e.getMessage());
      return null;
    }

    return barcodes;
  }

  @Nullable
  private InputImage getInputImageFromFrame(@NotNull Frame frame) {
    try {
      Image mediaImage = frame.getImage();
      return InputImage.fromMediaImage(mediaImage, 0);
    } catch (FrameInvalidError e) {
      Log.e(TAG, "Received an invalid frame.");
      return null;
    }
  }

  private synchronized BarcodeScanner
  getBarcodeScannerClient(@Nullable Map<String, Object> params) {
    int formatsBitmap = getFormatsBitmapFromParams(params);

    if (barcodeScanner == null ||
        previousBarcodeScannerFormatsBitmap != formatsBitmap) {
      previousBarcodeScannerFormatsBitmap = formatsBitmap;
      BarcodeScannerOptions options = new BarcodeScannerOptions.Builder()
                                          .setBarcodeFormats(formatsBitmap)
                                          .build();
      barcodeScanner = BarcodeScanning.getClient(options);
    }

    return barcodeScanner;
  }

  private int getFormatsBitmapFromParams(@Nullable Map<String, Object> params) {
    if (params == null)
      return Barcode.FORMAT_ALL_FORMATS;
    Set<Integer> barcodeFormats = new HashSet<>();
    Object barcodeTypesObj = params.get("barcodeTypes");
    if (barcodeTypesObj instanceof Map) {
      Map<String, String> barcodeTypes = (Map<String, String>)barcodeTypesObj;
      barcodeTypes.values().forEach(type -> {
        Integer format = BarcodeFormatMapper.getFormat(type);
        if (format != null)
          barcodeFormats.add(format);
        else
          Log.e(TAG, "Unsupported barcode type: " + type);
      });
    }
    return barcodeFormats.isEmpty() ? Barcode.FORMAT_ALL_FORMATS
                                    : barcodeFormatsToBitmap(barcodeFormats);
  }

  private int barcodeFormatsToBitmap(Set<Integer> barcodeFormats) {
    return barcodeFormats.stream().reduce(0, (a, b) -> a | b);
  }
}
