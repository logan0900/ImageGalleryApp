package com.imagegalleryapp;

import android.os.Build;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.Arguments;

public class DeviceDetailsModule extends ReactContextBaseJavaModule {
    DeviceDetailsModule(ReactApplicationContext context) {
        super(context);
    }

    @Override
    public String getName() {
        return "DeviceDetails";
    }

    @ReactMethod
    public void getDeviceInfo(Promise promise) {
        try {
            WritableMap map = Arguments.createMap();
            map.putString("brand", Build.BRAND);
            map.putString("model", Build.MODEL);
            map.putString("osVersion", Build.VERSION.RELEASE);
            map.putString("systemName", "Android");
            promise.resolve(map);
        } catch (Exception e) {
            promise.reject("Error", e.getMessage());
        }
    }
}
